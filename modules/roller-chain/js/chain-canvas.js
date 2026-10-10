/**
 * MITCalc Web App - Roller Chain 2D CAD Canvas Visualization Engine
 * Standards: ISO 606 / DIN 8187 / ASME B29.1M
 * Features:
 *   - 2D Canvas rendering of full transmission, sprockets, and articulated roller links.
 *   - 4 View Modes: 'full' (Assembly), 'sprocket1' (Pinion), 'sprocket2' (Wheel), 'mesh' (Mesh Detail).
 *   - Interactive Animation Loop (0.1x to 3.0x speed, pause, reset).
 *   - Rule 11: Mobile Touch Support (1-finger Pan, 2-finger Pinch Zoom, touch-action: none).
 *   - Desktop Mouse Pan (Drag), Wheel Zoom, Double-click auto-fit.
 */

class ChainCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');

        // View options
        this.viewMode = options.viewMode || 'full'; // 'full', 'sprocket1', 'sprocket2', 'mesh'
        this.showPitchCircles = options.showPitchCircles !== false;
        this.showDimensions = options.showDimensions !== false;
        this.showCenterLine = options.showCenterLine !== false;
        this.showLinks = options.showLinks !== false;
        this.showToothContours = options.showToothContours !== false;

        // View transform (Pan & Zoom)
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Multi-touch tracking
        this.touches = [];
        this.initialPinchDistance = 0;
        this.initialPinchZoom = 1.0;

        // Animation state
        this.isRunning = true;
        this.speedMultiplier = 1.0;
        this.rotationAngle = 0.0; // Current rotation in radians
        this.lastTimestamp = 0;
        this.animFrameId = null;

        // Current calculation data
        this.calcData = null;

        // Bind events & start loop
        this.initEvents();
        this.startAnimation();
    }

    setData(calcData) {
        this.calcData = calcData;
        this.autoFit();
        this.render();
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.autoFit();
        this.render();
    }

    setSpeed(speed) {
        this.speedMultiplier = Math.max(0.1, Math.min(3.0, speed));
    }

    toggleAnimation() {
        this.isRunning = !this.isRunning;
        return this.isRunning;
    }

    toggleLinks() {
        this.showLinks = !this.showLinks;
        this.render();
        return this.showLinks;
    }

    resetRotation() {
        this.rotationAngle = 0.0;
        this.render();
    }

    startAnimation() {
        const loop = (timestamp) => {
            if (!this.lastTimestamp) this.lastTimestamp = timestamp;
            const dt = (timestamp - this.lastTimestamp) / 1000.0;
            this.lastTimestamp = timestamp;

            if (this.isRunning && this.calcData) {
                // Angular velocity: omega1 = n1 * 2 * PI / 60 [rad/s]
                // Scale animation speed to visually smooth rotation (approx 0.5 - 1.5 rad/s visually)
                const visualSpeed = 0.75 * this.speedMultiplier;
                this.rotationAngle += visualSpeed * dt;
                if (this.rotationAngle > Math.PI * 2.0 * 100) {
                    this.rotationAngle %= (Math.PI * 2.0);
                }
                this.render();
            }

            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    stopAnimation() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    autoFit() {
        if (!this.calcData || !this.canvas) return;

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const res = this.calcData;
        const a = res.a || 300;
        const d1 = res.d1 || 100;
        const d2 = res.d2 || 200;
        const da1 = (res.sprocket1 && res.sprocket1.da) || (d1 + 10);
        const da2 = (res.sprocket2 && res.sprocket2.da) || (d2 + 10);

        if (this.viewMode === 'full') {
            // Full transmission: Sprocket 1 at (0, 0), Sprocket 2 at (a, 0)
            const margin = 1.30;
            const bboxWidth = (a + da1 / 2 + da2 / 2) * margin;
            const bboxHeight = Math.max(da1, da2) * 2.2;

            const scaleX = cw / bboxWidth;
            const scaleY = ch / bboxHeight;
            this.zoom = Math.min(scaleX, scaleY);

            // Center of transmission is at (a / 2, 0)
            this.panX = cw / 2 - (a / 2) * this.zoom;
            this.panY = ch / 2 - 15;
        } else if (this.viewMode === 'sprocket1') {
            // Focus on Sprocket 1 (Pinion)
            const margin = 1.35;
            const scale = Math.min(cw / (da1 * margin), ch / (da1 * margin));
            this.zoom = scale;
            this.panX = cw / 2;
            this.panY = ch / 2;
        } else if (this.viewMode === 'sprocket2') {
            // Focus on Sprocket 2 (Wheel)
            const margin = 1.35;
            const scale = Math.min(cw / (da2 * margin), ch / (da2 * margin));
            this.zoom = scale;
            this.panX = cw / 2 - a * this.zoom;
            this.panY = ch / 2;
        } else if (this.viewMode === 'mesh') {
            // Focus on Mesh detail near top span entrance of Sprocket 1
            const p = res.chain ? res.chain.pitch : 12.7;
            const scale = (ch / (p * 8));
            this.zoom = scale;
            this.panX = cw * 0.45;
            this.panY = ch * 0.55;
        }
    }

    initEvents() {
        // Desktop Mouse Events
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            if (!this.isRunning) this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
            const newZoom = Math.max(0.05, Math.min(25.0, this.zoom * zoomFactor));

            // Zoom centered at mouse position
            this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
            this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
            this.zoom = newZoom;

            if (!this.isRunning) this.render();
        }, { passive: false });

        this.canvas.addEventListener('dblclick', () => {
            this.autoFit();
            if (!this.isRunning) this.render();
        });

        // Mobile Multi-Touch Events (Rule 11)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.initialPinchDistance = Math.hypot(dx, dy);
                this.initialPinchZoom = this.zoom;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                this.panX = e.touches[0].clientX - this.dragStartX;
                this.panY = e.touches[0].clientY - this.dragStartY;
                if (!this.isRunning) this.render();
            } else if (e.touches.length === 2 && this.initialPinchDistance > 0) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const currentDist = Math.hypot(dx, dy);
                const scale = currentDist / this.initialPinchDistance;
                this.zoom = Math.max(0.05, Math.min(25.0, this.initialPinchZoom * scale));
                if (!this.isRunning) this.render();
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.isDragging = false;
                this.initialPinchDistance = 0;
            } else if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            }
        });
    }

    // World to Screen coordinates
    worldToScreen(x, y) {
        return {
            x: this.panX + x * this.zoom,
            y: this.panY - y * this.zoom // Invert Y for engineering coordinate system
        };
    }

    render() {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0f172a'; // Deep slate dark background
        ctx.fillRect(0, 0, cw, ch);

        // Draw engineering grid
        this.drawGrid();

        if (!this.calcData) {
            this.drawNoData();
            return;
        }

        const res = this.calcData;
        const a = res.a || 300;
        const d1 = res.d1 || 100;
        const d2 = res.d2 || 200;
        const z1 = res.z1 || 19;
        const z2 = res.z2 || 40;
        const p = res.p || (res.chain ? res.chain.pitch : 12.7);
        const d3 = res.d3 || (res.chain ? res.chain.d3 : 8.51); // roller diameter
        const b1 = res.b1 || (res.chain ? res.chain.b1 : 7.75);
        const X = res.X_even || res.X_exact || res.X || 100;

        const sp1 = res.sprocket1 || { da: res.da1, df: res.df1, R1: res.R1, bf1: res.bf, rx: res.rx, Dg: res.Dg1, p, d3 };
        const sp2 = res.sprocket2 || { da: res.da2, df: res.df2, R1: res.R1, bf1: res.bf, rx: res.rx, Dg: res.Dg2, p, d3 };
        const da1 = sp1.da || (d1 + 10);
        const da2 = sp2.da || (d2 + 10);

        // Generate full synchronized conjugate kinematics
        const kine = (ChainCalc && ChainCalc.generateChainKinematics) 
            ? ChainCalc.generateChainKinematics(d1, d2, a, p, X, this.rotationAngle, z1, z2)
            : { theta1: this.rotationAngle, theta2: this.rotationAngle * (z1 / z2), rollers: [] };

        ctx.save();

        if (this.viewMode === 'full') {
            // 1. Draw Sprocket 1 at (0, 0)
            this.drawSprocket(0, 0, d1, z1, sp1, kine.theta1, '#38bdf8', 'Đĩa dẫn 1 (Z1=' + z1 + ')');

            // 2. Draw Sprocket 2 at (a, 0)
            this.drawSprocket(a, 0, d2, z2, sp2, kine.theta2, '#fbbf24', 'Đĩa bị dẫn 2 (Z2=' + z2 + ')');

            // 3. Draw Chain Kinematics (Loop & Rollers & Links)
            if (this.showLinks) {
                this.drawChainLoop(kine, p, d3);
            }

            // 4. Center Line & Dimensions
            if (this.showCenterLine) {
                this.drawCenterLine(0, 0, a, 0);
            }
            if (this.showDimensions) {
                this.drawTransmissionDimensions(0, 0, a, 0, d1, d2, da1, da2, a);
            }
        } else if (this.viewMode === 'sprocket1') {
            // Focused on Sprocket 1
            this.drawSprocket(0, 0, d1, z1, sp1, kine.theta1, '#38bdf8', 'Đĩa xích dẫn 1 (Z1=' + z1 + ')');
            if (this.showLinks) {
                this.drawChainLoop(kine, p, d3);
            }
            if (this.showDimensions) {
                this.drawSprocketDimensions(0, 0, d1, sp1);
            }
        } else if (this.viewMode === 'sprocket2') {
            // Focused on Sprocket 2
            this.drawSprocket(a, 0, d2, z2, sp2, kine.theta2, '#fbbf24', 'Đĩa xích bị dẫn 2 (Z2=' + z2 + ')');
            if (this.showLinks) {
                this.drawChainLoop(kine, p, d3);
            }
            if (this.showDimensions) {
                this.drawSprocketDimensions(a, 0, d2, sp2);
            }
        } else if (this.viewMode === 'mesh') {
            // Zoomed Mesh Detail
            this.drawSprocket(0, 0, d1, z1, sp1, kine.theta1, '#38bdf8', 'Khu vực ăn khớp (Mesh Detail)');
            if (this.showLinks) {
                this.drawChainLoop(kine, p, d3, true);
            }
        }

        ctx.restore();

        // Overlay status info
        this.drawOverlayInfo();
    }

    drawGrid() {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        ctx.save();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)'; // slate-700
        ctx.lineWidth = 1;

        const gridSize = 50 * this.zoom;
        const minGrid = 30;
        let step = 50;
        while (step * this.zoom < minGrid) step *= 2;
        while (step * this.zoom > minGrid * 4) step /= 2;

        const effectiveStep = step * this.zoom;
        const startX = (this.panX % effectiveStep);
        const startY = (this.panY % effectiveStep);

        ctx.beginPath();
        for (let x = startX; x < cw; x += effectiveStep) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ch);
        }
        for (let y = startY; y < ch; y += effectiveStep) {
            ctx.moveTo(0, y);
            ctx.lineTo(cw, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawNoData() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Đang chờ nạp dữ liệu tính toán bộ truyền xích con lăn...', this.canvas.width / 2, this.canvas.height / 2);
        ctx.restore();
    }

    /**
     * Draw authentic mechanical Figure-8 dog-bone Link Plate
     */
    drawFigure8LinkPlate(pA, pB, H, waistRatio, fillStyle, strokeStyle) {
        const ctx = this.ctx;
        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const L = Math.hypot(dx, dy);
        if (L < 1e-4) return;

        const ux = dx / L;
        const uy = dy / L;
        const nx = -uy;
        const ny = ux;

        const R_end = (H / 2.0) * this.zoom;
        const halfWaist = ((H * waistRatio) / 2.0) * this.zoom;
        const ang_u = Math.atan2(uy, ux);

        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = Math.max(1.0, 1.2 * Math.min(2.0, this.zoom));

        ctx.beginPath();

        // 1. Arc around pA (from bottom around to top)
        const n_arc = 10;
        for (let j = 0; j <= n_arc; j++) {
            const th = (ang_u - Math.PI / 2.0) - (Math.PI * j / n_arc);
            const px = pA.x + R_end * Math.cos(th);
            const py = pA.y + R_end * Math.sin(th);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        // 2. Top waist curve from pA to pB
        const n_waist = 8;
        for (let j = 1; j < n_waist; j++) {
            const u = j / n_waist;
            const h_u = R_end - (R_end - halfWaist) * Math.sin(u * Math.PI);
            const bx = pA.x + u * dx;
            const by = pA.y + u * dy;
            ctx.lineTo(bx + h_u * nx, by + h_u * ny);
        }

        // 3. Arc around pB (from top around to bottom)
        for (let j = 0; j <= n_arc; j++) {
            const th = (ang_u + Math.PI / 2.0) - (Math.PI * j / n_arc);
            const px = pB.x + R_end * Math.cos(th);
            const py = pB.y + R_end * Math.sin(th);
            ctx.lineTo(px, py);
        }

        // 4. Bottom waist curve from pB to pA
        for (let j = 1; j < n_waist; j++) {
            const u = j / n_waist;
            const h_u = R_end - (R_end - halfWaist) * Math.sin(u * Math.PI);
            const bx = pB.x - u * dx;
            const by = pB.y - u * dy;
            ctx.lineTo(bx - h_u * nx, by - h_u * ny);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draw a Sprocket with ISO 606 tooth profile
     */
    drawSprocket(cx, cy, d, z, sprocketData, angle, color, label) {
        const ctx = this.ctx;
        const da = sprocketData ? sprocketData.da : (d + 10);
        const df = sprocketData ? sprocketData.df : (d - 10);
        const r_pitch = d / 2.0;
        const r_tip = da / 2.0;
        const r_root = df / 2.0;

        // 1. Tooth Contour (True ISO 606 Analytical Contour)
        if (this.showToothContours) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = 'rgba(30, 41, 59, 0.95)'; // Deep Slate Body
            ctx.lineWidth = Math.max(1.5, 1.8 * Math.min(2.0, this.zoom));

            const pts = (ChainCalc && ChainCalc.generateSprocket2DPoints)
                ? ChainCalc.generateSprocket2DPoints(z, sprocketData)
                : null;

            if (pts && pts.length > 0) {
                ctx.beginPath();
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                for (let i = 0; i < pts.length; i++) {
                    const px = pts[i].x;
                    const py = pts[i].y;
                    // Rotate by angle and translate by (cx, cy)
                    const wx = cx + px * cosA - py * sinA;
                    const wy = cy + px * sinA + py * cosA;
                    const s = this.worldToScreen(wx, wy);
                    if (i === 0) ctx.moveTo(s.x, s.y);
                    else ctx.lineTo(s.x, s.y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        // 2. Pitch Circle (Đường kính chia d) - Dash-dot line
        if (this.showPitchCircles) {
            ctx.save();
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.85)'; // Amber gold
            ctx.lineWidth = 1.2;
            ctx.setLineDash([8, 3, 2, 3]);
            ctx.beginPath();
            const scCenter = this.worldToScreen(cx, cy);
            ctx.arc(scCenter.x, scCenter.y, r_pitch * this.zoom, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Bore hole & Hub representation
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        const r_bore = r_root * 0.38;
        const scC = this.worldToScreen(cx, cy);
        ctx.beginPath();
        ctx.arc(scC.x, scC.y, r_bore * this.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Center cross mark
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        const crossL = Math.max(8, r_bore * 0.7 * this.zoom);
        ctx.beginPath();
        ctx.moveTo(scC.x - crossL, scC.y);
        ctx.lineTo(scC.x + crossL, scC.y);
        ctx.moveTo(scC.x, scC.y - crossL);
        ctx.lineTo(scC.x, scC.y + crossL);
        ctx.stroke();
        ctx.restore();

        // 4. Label
        ctx.save();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, scC.x, scC.y + (r_tip + 22) * this.zoom);
        ctx.restore();
    }

    /**
     * Draw the complete articulated Roller Chain Loop
     */
    drawChainLoop(kine, p, d3, detailed = false) {
        const ctx = this.ctx;
        if (!kine || !kine.rollers || kine.rollers.length === 0) return;

        const rollers = kine.rollers;
        const rollerR = (d3 / 2.0);
        const H_plate = 0.88 * p;
        const waist = 0.78;

        ctx.save();

        // Screen coordinates of all rollers
        const screenRollers = rollers.map(r => this.worldToScreen(r.x, r.y));

        // 1. Draw Pitch Path (Đường tâm ăn khớp xích)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < screenRollers.length; i++) {
            const s = screenRollers[i];
            if (i === 0) ctx.moveTo(s.x, s.y);
            else ctx.lineTo(s.x, s.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Pass 1: Inner Link Plates (odd indices)
        for (let i = 0; i < screenRollers.length; i++) {
            if (i % 2 === 1) {
                const nextIdx = (i + 1) % screenRollers.length;
                this.drawFigure8LinkPlate(screenRollers[i], screenRollers[nextIdx], H_plate, waist, 'rgba(51, 65, 85, 0.40)', '#475569');
            }
        }

        // 3. Pass 2: Rollers (Con lăn) seated in tooth gullets
        for (let i = 0; i < screenRollers.length; i++) {
            const s = screenRollers[i];
            const rScreen = Math.max(2.5, rollerR * this.zoom);

            ctx.fillStyle = '#0284c7'; // Sky blue roller body
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, rScreen, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // 4. Pass 3: Outer Link Plates (even indices) with semi-transparent metallic styling
        for (let i = 0; i < screenRollers.length; i++) {
            if (i % 2 === 0) {
                const nextIdx = (i + 1) % screenRollers.length;
                this.drawFigure8LinkPlate(screenRollers[i], screenRollers[nextIdx], H_plate, waist, 'rgba(148, 163, 184, 0.40)', '#cbd5e1');
            }
        }

        // 5. Pass 4: Pins (Chốt xích) with rivet heads
        for (let i = 0; i < screenRollers.length; i++) {
            const s = screenRollers[i];
            const rScreen = Math.max(2.5, rollerR * this.zoom);
            if (rScreen > 3.0) {
                const pinR = Math.max(1.5, rScreen * 0.38);
                ctx.fillStyle = '#0f172a';
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.arc(s.x, s.y, pinR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    /**
     * Draw Center Line connecting axes
     */
    drawCenterLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#ef4444'; // Red center line
        ctx.lineWidth = 1.2;
        ctx.setLineDash([12, 4, 3, 4]);

        const s1 = this.worldToScreen(x1, y1);
        const s2 = this.worldToScreen(x2, y2);

        // Extend slightly beyond sprockets
        const ext = 40;
        ctx.beginPath();
        ctx.moveTo(s1.x - ext, s1.y);
        ctx.lineTo(s2.x + ext, s2.y);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Draw Transmission Dimensions (Axis distance a, tip diameters)
     */
    drawTransmissionDimensions(x1, y1, x2, y2, d1, d2, da1, da2, a) {
        const ctx = this.ctx;
        ctx.save();

        const s1 = this.worldToScreen(x1, y1);
        const s2 = this.worldToScreen(x2, y2);

        // Dimension: Axis distance a [mm]
        const dimY = s1.y + Math.max(da1, da2) * 0.65 * this.zoom + 25;
        ctx.strokeStyle = '#a855f7'; // Purple dimension line
        ctx.fillStyle = '#c084fc';
        ctx.lineWidth = 1.0;

        // Extension lines
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y + 10);
        ctx.lineTo(s1.x, dimY + 8);
        ctx.moveTo(s2.x, s2.y + 10);
        ctx.lineTo(s2.x, dimY + 8);
        ctx.stroke();

        // Dimension line with arrows
        ctx.beginPath();
        ctx.moveTo(s1.x, dimY);
        ctx.lineTo(s2.x, dimY);
        ctx.stroke();
        this.drawArrow(s1.x, dimY, 1, 0);
        this.drawArrow(s2.x, dimY, -1, 0);

        // Text
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`a = ${a.toFixed(2)} mm`, (s1.x + s2.x) / 2, dimY - 6);

        ctx.restore();
    }

    /**
     * Draw Sprocket specific dimensions
     */
    drawSprocketDimensions(cx, cy, d, sprocketData) {
        const ctx = this.ctx;
        if (!sprocketData) return;
        ctx.save();

        const da = sprocketData.da;
        const df = sprocketData.df;
        const s = this.worldToScreen(cx, cy);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.textAlign = 'left';

        const infoX = s.x + (da / 2 + 15) * this.zoom;
        const infoY = s.y - 40;

        ctx.fillText(`d  = ${d.toFixed(2)} mm (Vòng chia)`, infoX, infoY);
        ctx.fillText(`da = ${da.toFixed(2)} mm (Vòng đỉnh)`, infoX, infoY + 18);
        ctx.fillText(`df = ${df.toFixed(2)} mm (Vòng đáy)`, infoX, infoY + 36);
        ctx.fillText(`R1 = ${sprocketData.R1.toFixed(2)} mm (Lượn đáy)`, infoX, infoY + 54);
        ctx.fillText(`bf1 = ${sprocketData.bf1.toFixed(2)} mm (Rộng răng)`, infoX, infoY + 72);

        ctx.restore();
    }

    drawArrow(x, y, dirX, dirY, size = 6) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dirX * size - dirY * (size / 2), y + dirY * size + dirX * (size / 2));
        ctx.lineTo(x + dirX * size + dirY * (size / 2), y + dirY * size - dirX * (size / 2));
        ctx.closePath();
        ctx.fill();
    }

    drawOverlayInfo() {
        const ctx = this.ctx;
        const cw = this.canvas.width;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(10, 10, 240, 75);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(10, 10, 240, 75);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px "Segoe UI", sans-serif';
        ctx.fillText('MÔ PHỎNG 2D BỘ TRUYỀN XÍCH', 20, 28);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.fillText(`Thu phóng: ${(this.zoom * 100).toFixed(0)}%`, 20, 46);
        ctx.fillText(`Chế độ: ${this.viewMode.toUpperCase()} | Tốc độ: ${this.speedMultiplier}x`, 20, 62);
        ctx.fillText(this.isRunning ? '▶ Đang chạy mô phỏng' : '⏸ Đang tạm dừng', 20, 78);

        ctx.restore();
    }
}

// Global expose
if (typeof window !== 'undefined') {
    window.ChainCanvas = ChainCanvas;
}
