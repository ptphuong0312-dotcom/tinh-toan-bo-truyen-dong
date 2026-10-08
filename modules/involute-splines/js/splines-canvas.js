/**
 * MITCalc Web App - Involute Splines 2D CAD Canvas Renderer
 * Renders exact involute profile geometry for shaft, hub, and meshing assembly.
 * Supports multi-touch gestures, pan/zoom, measurement pins, and common normal overlay.
 */

export class SplinesCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // View options
        this.viewMode = 'assembly'; // 'assembly' | 'shaft' | 'hub'
        this.toothScope = 'full';    // 'full' | 'detail' | 'single'
        this.showCircles = true;
        this.showInspection = true;
        this.showCenterlines = true;

        // Transform state
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        // Touch state
        this.touchDistance = 0;

        // Current calculation data
        this.geom = null;

        this.initEvents();
    }

    initEvents() {
        if (!this.canvas) return;

        // Mouse Pan & Zoom
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
            this.canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            if (this.canvas) this.canvas.style.cursor = 'grab';
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
            const newScale = Math.max(0.05, Math.min(50.0, this.scale * zoomFactor));

            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;

            this.render();
        }, { passive: false });

        // Touch gestures
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.startX = e.touches[0].clientX - this.panX;
                this.startY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.touchDistance = Math.hypot(dx, dy);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                this.panX = e.touches[0].clientX - this.startX;
                this.panY = e.touches[0].clientY - this.startY;
                this.render();
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                if (this.touchDistance > 0) {
                    const factor = dist / this.touchDistance;
                    this.scale = Math.max(0.05, Math.min(50.0, this.scale * factor));
                    this.render();
                }
                this.touchDistance = dist;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
            this.touchDistance = 0;
        });

        // Resize observer
        const ro = new ResizeObserver(() => {
            this.resizeCanvas();
            this.render();
        });
        ro.observe(this.canvas);
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = (rect.width || 1200) * dpr;
        this.canvas.height = (rect.height || 650) * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }

    resetView() {
        if (!this.geom) return;
        const rect = this.canvas.getBoundingClientRect();
        const w = rect.width || 1200;
        const h = rect.height || 650;

        const maxD = Math.max(this.geom.da0, this.geom.dri2, this.geom.d0 * 1.2);
        if (this.toothScope === 'full') {
            this.scale = Math.min(w, h) / (maxD * 1.35);
            this.panX = 0;
            this.panY = 0;
        } else if (this.toothScope === 'detail') {
            const toothH = (this.geom.da0 - this.geom.df0);
            this.scale = (h * 0.7) / (toothH * 3.0);
            this.panX = 0;
            this.panY = (this.geom.d0 / 2) * this.scale * 0.85;
        } else { // single
            const toothH = (this.geom.da0 - this.geom.df0);
            this.scale = (h * 0.7) / (toothH * 2.0);
            this.panX = 0;
            this.panY = (this.geom.d0 / 2) * this.scale * 0.85;
        }
        this.render();
    }

    updateData(geom) {
        this.geom = geom;
        if (this.scale === 1.0) {
            this.resetView();
        } else {
            this.render();
        }
    }

    /**
     * Compute analytical profile points for one spline tooth
     */
    generateToothPoints(isShaft, z, m, alfaDeg, d, db, da, df, s, numFlankPts = 25) {
        const pi = Math.PI;
        const alfa = (alfaDeg * pi) / 180.0;
        const invAlfa = Math.tan(alfa) - alfa;

        const r_pitch = d / 2.0;
        const r_base = db / 2.0;
        const r_tip = da / 2.0;
        const r_root = df / 2.0;

        const psi = s / d; // tooth half-angle on pitch circle

        // Involute starts at max(r_base, r_root)
        const r_start = Math.max(r_base, r_root);
        const r_end = r_tip;

        const rightFlank = [];
        const leftFlank = [];

        // Generate flank points
        for (let i = 0; i <= numFlankPts; i++) {
            const frac = i / numFlankPts;
            const r = r_start + (r_end - r_start) * frac;

            let alfa_r = 0;
            if (r > r_base) {
                alfa_r = Math.acos(r_base / r);
            }
            const invAlfa_r = Math.tan(alfa_r) - alfa_r;

            // Angle of flank point from tooth centerline
            const phi = psi + invAlfa - invAlfa_r;

            // Right flank point (x, y) with tooth centerline pointing along +Y
            rightFlank.push({
                x: r * Math.sin(phi),
                y: r * Math.cos(phi)
            });

            // Left flank point (symmetrical)
            leftFlank.push({
                x: -r * Math.sin(phi),
                y: r * Math.cos(phi)
            });
        }

        // Connect root if r_root < r_base (root extension / fillet)
        let rightRoot = [];
        let leftRoot = [];
        if (r_root < r_base) {
            // Radial extension to root
            rightRoot.push({
                x: r_root * Math.sin(psi),
                y: r_root * Math.cos(psi)
            });
            leftRoot.push({
                x: -r_root * Math.sin(psi),
                y: r_root * Math.cos(psi)
            });
        }

        return {
            r_tip,
            r_root,
            rightFlank,
            leftFlank,
            rightRoot,
            leftRoot,
            psi
        };
    }

    render() {
        if (!this.canvas || !this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        const w = rect.width || 1200;
        const h = rect.height || 650;

        // Clear canvas
        ctx.fillStyle = '#0f172a'; // slate-900 background
        ctx.fillRect(0, 0, w, h);

        // Draw engineering background grid
        this.drawGrid(ctx, w, h);

        // Save context and apply user transform
        ctx.save();
        ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
        ctx.scale(this.scale, -this.scale); // flip Y for standard engineering coordinates (+Y up)

        // Draw Centerlines
        if (this.showCenterlines) {
            this.drawCenterlines(ctx);
        }

        // Draw Circles (Pitch, Base, Tip, Root)
        if (this.showCircles) {
            this.drawReferenceCircles(ctx);
        }

        // Draw Spline Teeth (Hub and/or Shaft)
        if (this.viewMode === 'assembly' || this.viewMode === 'hub') {
            this.drawHub(ctx);
        }
        if (this.viewMode === 'assembly' || this.viewMode === 'shaft') {
            this.drawShaft(ctx);
        }

        // Draw Inspection Overlays (Pins & Common normal)
        if (this.showInspection) {
            this.drawInspection(ctx);
        }

        ctx.restore();

        // Draw UI overlay information (Scale, View mode, Legend)
        this.drawOverlayUI(ctx, w, h);
    }

    drawGrid(ctx, w, h) {
        ctx.save();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;

        const gridSize = 40;
        ctx.beginPath();
        for (let x = 0; x < w; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawCenterlines(ctx) {
        const g = this.geom;
        const rMax = Math.max(g.da0, g.dri2) * 0.75;

        ctx.save();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.0 / this.scale;
        ctx.setLineDash([12 / this.scale, 4 / this.scale, 3 / this.scale, 4 / this.scale]);

        ctx.beginPath();
        ctx.moveTo(-rMax, 0);
        ctx.lineTo(rMax, 0);
        ctx.moveTo(0, -rMax);
        ctx.lineTo(0, rMax);
        ctx.stroke();

        ctx.restore();
    }

    drawReferenceCircles(ctx) {
        const g = this.geom;
        ctx.save();
        ctx.lineWidth = 1.0 / this.scale;

        // Pitch circle (Green dashed)
        ctx.strokeStyle = '#22c55e';
        ctx.setLineDash([8 / this.scale, 5 / this.scale]);
        ctx.beginPath();
        ctx.arc(0, 0, g.d0 / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Base circle (Purple dashed)
        ctx.strokeStyle = '#a855f7';
        ctx.setLineDash([4 / this.scale, 4 / this.scale]);
        ctx.beginPath();
        ctx.arc(0, 0, g.db0 / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Shaft Tip Circle (Cyan solid)
        if (this.viewMode === 'shaft' || this.viewMode === 'assembly') {
            ctx.strokeStyle = '#0284c7';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(0, 0, g.da0 / 2, 0, Math.PI * 2);
            ctx.stroke();

            // Shaft Root Circle (Slate fine)
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.arc(0, 0, g.df0 / 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Hub Tip & Root Circles (Orange)
        if (this.viewMode === 'hub' || this.viewMode === 'assembly') {
            ctx.strokeStyle = '#ea580c';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(0, 0, g.di2 / 2, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = '#475569';
            ctx.beginPath();
            ctx.arc(0, 0, g.dri2 / 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawShaft(ctx) {
        const g = this.geom;
        const z = g.z0;
        const tooth = this.generateToothPoints(true, z, g.m, g.alfa, g.d0, g.db0, g.da0, g.df0, g.s0);

        ctx.save();
        ctx.fillStyle = 'rgba(2, 132, 199, 0.28)';   // Sky blue translucent fill
        ctx.strokeStyle = '#38bdf8';                 // Cyan neon contour
        ctx.lineWidth = 1.8 / this.scale;

        const numTeethToDraw = this.toothScope === 'full' ? z : (this.toothScope === 'detail' ? 3 : 1);
        const startIdx = this.toothScope === 'full' ? 0 : (this.toothScope === 'detail' ? -1 : 0);
        const endIdx = this.toothScope === 'full' ? z - 1 : (this.toothScope === 'detail' ? 1 : 0);

        ctx.beginPath();

        if (this.toothScope === 'full') {
            // Draw continuous closed 360° toothing
            for (let j = 0; j < z; j++) {
                const angle = (j * 2 * Math.PI) / z;
                this.traceTooth(ctx, tooth, angle);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Shaft inner bore
            const r_bore = (g.df0 / 2) * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, r_bore, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.stroke();
        } else {
            // Draw selected teeth
            for (let j = startIdx; j <= endIdx; j++) {
                const angle = (j * 2 * Math.PI) / z;
                this.traceTooth(ctx, tooth, angle);
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    drawHub(ctx) {
        const g = this.geom;
        const z = g.z2;
        // Hub space width corresponds to tooth space
        const tooth = this.generateToothPoints(false, z, g.m, g.alfa, g.d2, g.db2, g.dri2, g.di2, g.s2);

        ctx.save();
        ctx.fillStyle = 'rgba(249, 115, 22, 0.18)'; // Orange translucent fill
        ctx.strokeStyle = '#fb923c';                // Amber neon contour
        ctx.lineWidth = 1.8 / this.scale;

        const numTeethToDraw = this.toothScope === 'full' ? z : (this.toothScope === 'detail' ? 3 : 1);
        const startIdx = this.toothScope === 'full' ? 0 : (this.toothScope === 'detail' ? -1 : 0);
        const endIdx = this.toothScope === 'full' ? z - 1 : (this.toothScope === 'detail' ? 1 : 0);

        // Hub teeth are shifted by half pitch to mesh with shaft teeth
        const halfPitch = Math.PI / z;

        ctx.beginPath();

        if (this.toothScope === 'full') {
            for (let j = 0; j < z; j++) {
                const angle = (j * 2 * Math.PI) / z + halfPitch;
                this.traceTooth(ctx, tooth, angle);
            }
            ctx.closePath();
            ctx.stroke();

            // Outer hub collar
            const r_hub_outer = (g.dri2 / 2) * 1.35;
            ctx.beginPath();
            ctx.arc(0, 0, r_hub_outer, 0, Math.PI * 2);
            ctx.strokeStyle = '#f97316';
            ctx.stroke();
        } else {
            for (let j = startIdx; j <= endIdx; j++) {
                const angle = (j * 2 * Math.PI) / z + halfPitch;
                this.traceTooth(ctx, tooth, angle);
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    traceTooth(ctx, tooth, rotAngle) {
        const cosA = Math.cos(rotAngle);
        const sinA = Math.sin(rotAngle);

        const rot = (pt) => ({
            x: pt.x * cosA - pt.y * sinA,
            y: pt.x * sinA + pt.y * cosA
        });

        const pts = [];

        // 1. Left root / flank (from root up to tip)
        if (tooth.leftRoot.length > 0) {
            tooth.leftRoot.forEach(p => pts.push(rot(p)));
        }
        tooth.leftFlank.forEach(p => pts.push(rot(p)));

        // 2. Tip crest (left tip to right tip)
        // (Tip is circular arc r_tip)
        for (let i = tooth.rightFlank.length - 1; i >= 0; i--) {
            pts.push(rot(tooth.rightFlank[i]));
        }

        // 3. Right root
        if (tooth.rightRoot.length > 0) {
            tooth.rightRoot.forEach(p => pts.push(rot(p)));
        }

        // Draw polyline
        pts.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
    }

    drawInspection(ctx) {
        const g = this.geom;
        const pi = Math.PI;

        ctx.save();

        // 1. Inspection Pins / Balls (M)
        if (this.viewMode === 'shaft' || this.viewMode === 'assembly') {
            const dt = g.dt0;
            const r_pin = dt / 2;

            // Pin center radius on shaft
            // Pin center is at angle of tooth space (half pitch from top tooth: pi / z)
            const alfaRad = (g.alfa * pi) / 180;
            const invAlfa = Math.tan(alfaRad) - alfaRad;
            const invAlfaM = invAlfa + (2 * g.x0 * Math.tan(alfaRad) + dt / (g.m * Math.cos(alfaRad)) - 0.5 * pi) / g.z0;
            const alfaM_deg = Math.abs(invAlfaM);
            const r_center = (g.db0 / 2) / Math.cos(alfaRad); // approx center for visual

            const angles = [pi / g.z0, pi / g.z0 + pi]; // opposite tooth spaces
            ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';  // yellow pin
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5 / this.scale;

            angles.forEach(ang => {
                const cx = r_center * Math.sin(ang);
                const cy = r_center * Math.cos(ang);
                ctx.beginPath();
                ctx.arc(cx, cy, r_pin, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Cross center mark
                const s = 4 / this.scale;
                ctx.beginPath();
                ctx.moveTo(cx - s, cy);
                ctx.lineTo(cx + s, cy);
                ctx.moveTo(cx, cy - s);
                ctx.lineTo(cx, cy + s);
                ctx.stroke();
            });

            // Dimension line M0
            ctx.strokeStyle = '#facc15';
            ctx.setLineDash([5 / this.scale, 3 / this.scale]);
            ctx.beginPath();
            const p1 = { x: r_center * Math.sin(angles[0]), y: r_center * Math.cos(angles[0]) };
            const p2 = { x: r_center * Math.sin(angles[1]), y: r_center * Math.cos(angles[1]) };
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawOverlayUI(ctx, w, h) {
        const g = this.geom;
        ctx.save();
        ctx.font = '12px "Segoe UI", Tahoma, sans-serif';

        // HUD Info Card (Top Left)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(16, 16, 260, 115, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Segoe UI", Tahoma, sans-serif';
        ctx.fillText(`Mô Phỏng 2D Then Hoa: z = ${g.z0}, m = ${g.m} mm`, 28, 38);

        ctx.font = '12px "Segoe UI", Tahoma, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Đường kính đỉnh Trục da0: `, 28, 58);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`${g.da0.toFixed(3)} mm`, 185, 58);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Đường kính đỉnh Lỗ Di: `, 28, 76);
        ctx.fillStyle = '#fb923c';
        ctx.fillText(`${g.di2.toFixed(3)} mm`, 185, 76);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Kích thước đo bi M0: `, 28, 94);
        ctx.fillStyle = '#facc15';
        ctx.fillText(`${g.M0.toFixed(4)} mm`, 185, 94);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Pháp tuyến chung W0: `, 28, 112);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`${g.W0.toFixed(4)} mm (k=${g.k0})`, 185, 112);

        // Controls hint (Bottom Right)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(w - 240, h - 38, 224, 26, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Segoe UI", Tahoma, sans-serif';
        ctx.fillText('🖱 Kéo: Di chuyển | Lăn chuột: Thu phóng', w - 230, h - 21);

        ctx.restore();
    }

    exportImage() {
        if (!this.canvas) return;
        const link = document.createElement('a');
        link.download = `splines_2d_z${this.geom?.z0 || 20}_m${this.geom?.m || 10}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}
