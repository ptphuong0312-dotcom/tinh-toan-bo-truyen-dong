/**
 * MITCalc Web App - 2D Interactive Bevel Gear Canvas Visualizer
 * Industrial-Grade Axial Engineering Cross-Section & Kinematic Meshing Simulator
 * Standards: ISO 23509, DIN 3971, DIN 3965, ISO 128 (Technical Drawings - Hatching)
 */

class BevelGearCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.geom = null;
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.angle1 = 0;
        this.animSpeed = 1.0;
        this.isRunning = true;

        // Layer visibility toggles
        this.showDimensions = true;
        this.showHatching = true;
        this.showAxes = true;
        this.showStripes = true;
        this.showDataCard = true;

        this.initEvents();
        this.animate();
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.1, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    zoomBy(factor) {
        this.zoom = Math.max(0.2, Math.min(5.0, this.zoom * factor));
        this.render();
    }

    zoom(factor) {
        this.zoomBy(factor);
    }

    toggleAnimation() {
        this.isRunning = !this.isRunning;
        return this.isRunning;
    }

    setGeometry(geom) {
        this.geom = geom;
        this.resetView();
        this.render();
    }

    resetView() {
        if (!this.canvas || !this.geom) return;
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.render();
    }

    initEvents() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.render();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoom = Math.max(0.2, Math.min(5.0, this.zoom * factor));
            this.render();
        });

        // Mobile Touch Gestures: 1-finger pan, 2-finger pinch zoom
        let touchStartDist = 0;
        let touchStartZoom = 1.0;
        let isTouchPanning = false;
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isTouchPanning = true;
                touchStartX = e.touches[0].clientX - this.panX;
                touchStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                isTouchPanning = false;
                touchStartDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                touchStartZoom = this.zoom;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isTouchPanning) {
                this.panX = e.touches[0].clientX - touchStartX;
                this.panY = e.touches[0].clientY - touchStartY;
                this.render();
            } else if (e.touches.length === 2 && touchStartDist > 0) {
                const currentDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const factor = currentDist / touchStartDist;
                this.zoom = Math.max(0.2, Math.min(5.0, touchStartZoom * factor));
                this.render();
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isTouchPanning = false;
            touchStartDist = 0;
        }, { passive: true });
    }

    animate() {
        if (this.isRunning && this.geom) {
            this.angle1 += 0.02 * (this.animSpeed || 1.0);
            this.render();
        }
        requestAnimationFrame(() => this.animate());
    }

    render() {
        if (!this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        this.drawGrid(ctx, w, h);

        const g = this.geom;
        const b = g.b || 50;
        const d1 = g.delta1 || 0.38;
        const d2 = g.delta2 || 1.19;
        const s1 = Math.sin(d1), c1 = Math.cos(d1);
        const s2 = Math.sin(d2), c2 = Math.cos(d2);

        const hae1 = g.hae1 || 10, hfe1 = g.hfe1 || 12;
        const hae2 = g.hae2 || 10, hfe2 = g.hfe2 || 12;
        const Re = g.Re || 200;

        const dae1 = g.dae1 || 200;
        const dae2 = g.dae2 || 400;
        const x_hub_end1 = (Re * c1 + hfe1 * s1 + 15) + Math.max(35, b * 0.7);
        const y_hub_end2 = -(Re * c2 + hfe2 * s2 + 20) - Math.max(40, b * 0.8);

        const xMin = Math.min(-dae2 / 2.0 - 50, -60);
        const xMax = Math.max(dae2 / 2.0 + 50, x_hub_end1 + 60);
        const yMin = Math.min(y_hub_end2 - 50, -dae1 / 2.0 - 50);
        const yMax = Math.max(dae1 / 2.0 + 50, 60);

        const wGeom = Math.max(120, xMax - xMin);
        const hGeom = Math.max(120, yMax - yMin);
        const cxGeom = (xMin + xMax) / 2.0;
        const cyGeom = (yMin + yMax) / 2.0;

        const scale = Math.min((w * 0.78) / wGeom, (h * 0.78) / hGeom);

        ctx.save();
        ctx.translate(w / 2.0 + this.panX, h / 2.0 + this.panY);
        ctx.scale(this.zoom * scale, this.zoom * scale);
        ctx.translate(-cxGeom, -cyGeom);

        this.drawAxialSection(ctx);

        ctx.restore();

        if (this.showDataCard) {
            this.drawDataCard(ctx, g);
        }
    }

    drawGrid(ctx, w, h) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const step = 30;
        ctx.beginPath();
        for (let x = 0; x < w; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawPolygonSection(ctx, points, fillColor, strokeColor, hatchAngleRad, hatchColor) {
        if (!points || points.length < 3) return;

        // 1. Opaque solid body
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // 2. ISO 128 Cross-hatching
        if (this.showHatching) {
            this.drawHatchedPolygon(ctx, points, hatchAngleRad, hatchColor, 8.0);
        }

        // 3. Crisp engineering boundary outline
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.0;
        ctx.stroke();
    }

    drawHatchedPolygon(ctx, points, angleRad, strokeColor, step = 8.0) {
        if (!points || points.length < 3) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.clip();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.0;
        ctx.beginPath();

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of points) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }

        const diag = Math.hypot(maxX - minX, maxY - minY) + step * 3;
        const cx = (minX + maxX) / 2.0;
        const cy = (minY + maxY) / 2.0;
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);

        const numLines = Math.ceil(diag / step);
        for (let i = -numLines; i <= numLines; i++) {
            const offset = i * step;
            const px = cx + offset * sinA;
            const py = cy - offset * cosA;
            ctx.moveTo(px - diag * cosA, py - diag * sinA);
            ctx.lineTo(px + diag * cosA, py + diag * sinA);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawAxialSection(ctx) {
        const g = this.geom;
        const d1 = g.delta1;
        const d2 = g.delta2;
        const Re = g.Re;
        const Ri = g.Ri;
        const b = g.b;

        const s1 = Math.sin(d1), c1 = Math.cos(d1);
        const s2 = Math.sin(d2), c2 = Math.cos(d2);

        const hae1 = g.hae1, hfe1 = g.hfe1;
        const hae2 = g.hae2, hfe2 = g.hfe2;
        const hai1 = g.hai1, hfi1 = g.hfi1;
        const hai2 = g.hai2, hfi2 = g.hfi2;

        const dae1 = g.dae1, dae2 = g.dae2;

        // 1. PINION KEY COORDINATES (Apex at (0, 0), Axis along X)
        const p1_toe_tip = { x: Ri * c1 - hai1 * s1, y: -(Ri * s1 + hai1 * c1) };
        const p1_toe_root = { x: Ri * c1 + hfi1 * s1, y: -(Ri * s1 - hfi1 * c1) };
        const p1_heel_tip = { x: Re * c1 - hae1 * s1, y: -(Re * s1 + hae1 * c1) };
        const p1_heel_root = { x: Re * c1 + hfe1 * s1, y: -(Re * s1 - hfe1 * c1) };

        const p1_toe_tip_b = { x: p1_toe_tip.x, y: -p1_toe_tip.y };
        const p1_toe_root_b = { x: p1_toe_root.x, y: -p1_toe_root.y };
        const p1_heel_tip_b = { x: p1_heel_tip.x, y: -p1_heel_tip.y };
        const p1_heel_root_b = { x: p1_heel_root.x, y: -p1_heel_root.y };

        const d_bore1 = Math.max(20, (g.de1 || 100) * 0.22);
        const d_hub1 = Math.max(35, (g.de1 || 100) * 0.45);
        const H1out = Math.max(12, g.mmn * 1.3);

        // Pinion Front Face: Flat vertical face perpendicular to shaft axis at p1_toe_root.x
        const x_front1 = p1_toe_root.x;
        const x_back1 = p1_heel_root.x + H1out * s1;
        const y_back_rim1 = -(Re * s1 - (hfe1 + H1out) * c1);
        const x_hub_end1 = x_back1 + Math.max(35, b * 0.7);

        // Pinion Upper Half Cross-Section Polygon
        const pinion_upper = [
            p1_toe_root,
            p1_toe_tip,
            p1_heel_tip,
            p1_heel_root,
            { x: x_back1, y: y_back_rim1 },
            { x: x_back1, y: -d_hub1 / 2.0 },
            { x: x_hub_end1, y: -d_hub1 / 2.0 },
            { x: x_hub_end1, y: -d_bore1 / 2.0 },
            { x: x_front1, y: -d_bore1 / 2.0 },
            p1_toe_root
        ];

        // Pinion Lower Half Cross-Section Polygon (Symmetric)
        const pinion_lower = [
            { x: x_front1, y: d_bore1 / 2.0 },
            { x: x_hub_end1, y: d_bore1 / 2.0 },
            { x: x_hub_end1, y: d_hub1 / 2.0 },
            { x: x_back1, y: d_hub1 / 2.0 },
            { x: x_back1, y: -y_back_rim1 },
            p1_heel_root_b,
            p1_heel_tip_b,
            p1_toe_tip_b,
            p1_toe_root_b,
            { x: x_front1, y: d_bore1 / 2.0 }
        ];

        // 2. GEAR KEY COORDINATES (Apex at (0, 0), Axis along Y pointing up = -Y in canvas)
        const p2_heel_tip = { x: Re * s2 + hae2 * c2, y: -(Re * c2 - hae2 * s2) };
        const p2_heel_root = { x: Re * s2 - hfe2 * c2, y: -(Re * c2 + hfe2 * s2) };
        const p2_toe_tip = { x: Ri * s2 + hai2 * c2, y: -(Ri * c2 - hai2 * s2) };
        const p2_toe_root = { x: Ri * s2 - hfi2 * c2, y: -(Ri * c2 + hfi2 * s2) };

        const p2_heel_tip_l = { x: -p2_heel_tip.x, y: p2_heel_tip.y };
        const p2_heel_root_l = { x: -p2_heel_root.x, y: p2_heel_root.y };
        const p2_toe_tip_l = { x: -p2_toe_tip.x, y: p2_toe_tip.y };
        const p2_toe_root_l = { x: -p2_toe_root.x, y: p2_toe_root.y };

        const d_bore2 = Math.max(30, (g.de2 || 200) * 0.16);
        const d_hub2 = Math.max(55, (g.de2 || 200) * 0.32);
        const H2out = Math.max(16, g.mmn * 1.8);

        const y_back2 = -(Re * c2 + hfe2 * s2 + H2out * s2);
        const x_back_rim2 = Re * s2 - (hfe2 + H2out) * c2;
        const y_front2 = p2_toe_root.y;
        const x_front_rim2 = p2_toe_root.x;
        const y_hub_end2 = y_back2 - Math.max(40, b * 0.8);

        // Gear Right Half Cross-Section (Meshing side)
        const gear_right = [
            p2_toe_root,
            p2_toe_tip,
            p2_heel_tip,
            p2_heel_root,
            { x: x_back_rim2, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_front2 + 15 },
            { x: x_front_rim2, y: y_front2 },
            p2_toe_root
        ];

        // Gear Left Half Cross-Section (Symmetric)
        const gear_left = [
            { x: -x_front_rim2, y: y_front2 },
            { x: -d_bore2 / 2.0, y: y_front2 + 15 },
            { x: -d_bore2 / 2.0, y: y_hub_end2 },
            { x: -d_hub2 / 2.0, y: y_hub_end2 },
            { x: -d_hub2 / 2.0, y: y_back2 },
            { x: -x_back_rim2, y: y_back2 },
            p2_heel_root_l,
            p2_heel_tip_l,
            p2_toe_tip_l,
            p2_toe_root_l,
            { x: -x_front_rim2, y: y_front2 }
        ];

        // 3. DRAW PINION SECTIONS (Upper & Lower)
        for (const poly of [pinion_upper, pinion_lower]) {
            this.drawPolygonSection(ctx, poly, '#062e24', '#10b981', Math.PI / 4, 'rgba(16, 185, 129, 0.45)');
        }

        // Pinion Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(x_front1, -d_bore1 / 2.0, x_hub_end1 - x_front1, d_bore1);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(x_front1, -d_bore1 / 2.0, x_hub_end1 - x_front1, d_bore1);

        // 4. DRAW GEAR SECTIONS (Right & Left)
        for (const poly of [gear_right, gear_left]) {
            this.drawPolygonSection(ctx, poly, '#0d2247', '#3b82f6', -Math.PI / 4, 'rgba(59, 130, 246, 0.45)');
        }

        // Gear Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (y_front2 + 15) - y_hub_end2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (y_front2 + 15) - y_hub_end2);

        // 5. TOOTH ROOT CONE LINES
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1_toe_root.x, p1_toe_root.y);
        ctx.lineTo(p1_heel_root.x, p1_heel_root.y);
        ctx.moveTo(p1_toe_root_b.x, p1_toe_root_b.y);
        ctx.lineTo(p1_heel_root_b.x, p1_heel_root_b.y);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(p2_toe_root.x, p2_toe_root.y);
        ctx.lineTo(p2_heel_root.x, p2_heel_root.y);
        ctx.moveTo(p2_toe_root_l.x, p2_toe_root_l.y);
        ctx.lineTo(p2_heel_root_l.x, p2_heel_root_l.y);
        ctx.stroke();

        // 6. ANIMATED CONJUGATE MESHING STRIPES
        if (this.showStripes) {
            this.drawToothStripes(ctx, p1_toe_root, p1_heel_root, p1_toe_tip, p1_heel_tip, '#10b981', this.angle1);
            this.drawToothStripes(ctx, p2_toe_root, p2_heel_root, p2_toe_tip, p2_heel_tip, '#3b82f6', -this.angle1 / (g.i || 2.5));
        }

        // 7. CENTERLINES & PITCH CONE GENERATORS
        if (this.showAxes) {
            ctx.save();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([14, 4, 3, 4]);

            // Pinion Axis (Horizontal X)
            ctx.beginPath();
            ctx.moveTo(-50, 0);
            ctx.lineTo(x_hub_end1 + 60, 0);
            ctx.stroke();

            // Gear Axis (Vertical Y)
            ctx.beginPath();
            ctx.moveTo(0, 50);
            ctx.lineTo(0, y_hub_end2 - 60);
            ctx.stroke();

            // Pitch Cone Generator Line (Contact Line)
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([10, 4, 3, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.15, -Re * s1 * 1.15);
            ctx.stroke();

            // Symmetric Pitch Cone Generator for Gear Left
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-Re * s2 * 1.12, -Re * c2 * 1.12);
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.12, Re * s1 * 1.12);
            ctx.stroke();

            ctx.restore();
        }

        // 8. APEX V INDICATOR
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.fillText('Apex V(0,0)', -28, 18);

        // 9. CAD ENGINEERING DIMENSIONS
        if (this.showDimensions) {
            this.drawCadDimensions(ctx, {
                g, Re, Ri, b, d1, d2, s1, c1, s2, c2,
                dae1, dae2, x_hub_end1,
                p1_heel_tip, p1_heel_tip_b,
                p2_heel_tip, p2_heel_tip_l
            });
        }
    }

    drawCadDimensions(ctx, d) {
        const { g, Re, Ri, b, d1, d2, s1, c1, s2, c2, dae1, dae2, x_hub_end1, p1_heel_tip, p1_heel_tip_b, p2_heel_tip, p2_heel_tip_l } = d;

        // A. Pinion Tip Diameter dae1 (Vertical dimension on right side)
        const x_dim_dae1 = x_hub_end1 + 25;
        const y_top_dae1 = -dae1 / 2.0;
        const y_bot_dae1 = dae1 / 2.0;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(p1_heel_tip.x, p1_heel_tip.y);
        ctx.lineTo(x_dim_dae1 + 10, y_top_dae1);
        ctx.moveTo(p1_heel_tip_b.x, p1_heel_tip_b.y);
        ctx.lineTo(x_dim_dae1 + 10, y_bot_dae1);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            { x: x_dim_dae1, y: y_top_dae1 },
            { x: x_dim_dae1, y: y_bot_dae1 },
            '\u2300dae1 = ' + dae1.toFixed(1),
            '#34d399',
            { x: 10, y: 0 },
            'left'
        );

        // B. Gear Tip Diameter dae2 (Horizontal dimension at top)
        const y_dim_dae2 = -dae2 / 2.0 - 28;
        const x_left_dae2 = -dae2 / 2.0;
        const x_right_dae2 = dae2 / 2.0;

        ctx.beginPath();
        ctx.moveTo(p2_heel_tip_l.x, p2_heel_tip_l.y);
        ctx.lineTo(x_left_dae2, y_dim_dae2 - 10);
        ctx.moveTo(p2_heel_tip.x, p2_heel_tip.y);
        ctx.lineTo(x_right_dae2, y_dim_dae2 - 10);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            { x: x_left_dae2, y: y_dim_dae2 },
            { x: x_right_dae2, y: y_dim_dae2 },
            '\u2300dae2 = ' + dae2.toFixed(1),
            '#60a5fa',
            { x: 0, y: -10 },
            'center'
        );

        // C. Face Width b (Parallel to pitch cone generator line)
        const nx_p = -s1, ny_p = -c1;
        const b_off = 32;
        const p_b1 = { x: Ri * c1 + b_off * nx_p, y: -(Ri * s1 - b_off * ny_p) };
        const p_b2 = { x: Re * c1 + b_off * nx_p, y: -(Re * s1 - b_off * ny_p) };

        ctx.beginPath();
        ctx.moveTo(Ri * c1, -Ri * s1);
        ctx.lineTo(p_b1.x + 8 * nx_p, p_b1.y - 8 * ny_p);
        ctx.moveTo(Re * c1, -Re * s1);
        ctx.lineTo(p_b2.x + 8 * nx_p, p_b2.y - 8 * ny_p);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_b1, p_b2,
            'b = ' + b.toFixed(1),
            '#f59e0b',
            { x: 10 * nx_p, y: -10 * ny_p },
            'center'
        );

        // D. Outer Cone Distance Re
        const re_off = 58;
        const p_re1 = { x: re_off * nx_p, y: re_off * ny_p };
        const p_re2 = { x: Re * c1 + re_off * nx_p, y: -(Re * s1 - re_off * ny_p) };

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p_re1.x + 8 * nx_p, p_re1.y - 8 * ny_p);
        ctx.moveTo(Re * c1, -Re * s1);
        ctx.lineTo(p_re2.x + 8 * nx_p, p_re2.y - 8 * ny_p);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_re1, p_re2,
            'Re = ' + Re.toFixed(1),
            '#fbbf24',
            { x: 10 * nx_p, y: -10 * ny_p },
            'center'
        );

        // E. Pitch Cone Angles (δ1, δ2)
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 85, -d1, 0);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = '11px sans-serif';
        ctx.fillText('\u03B41 = ' + g.delta1_deg.toFixed(1) + '°', 95, -12);

        ctx.strokeStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(0, 0, 115, -Math.PI / 2, -d1);
        ctx.stroke();
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('\u03B42 = ' + g.delta2_deg.toFixed(1) + '°', 20, -125);
        ctx.restore();
    }

    drawDimensionLine(ctx, p1, p2, text, color = '#38bdf8', textOffset = { x: 0, y: -8 }, align = 'center') {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.hypot(dx, dy);
        if (length < 8) return;

        const ux = dx / length;
        const uy = dy / length;
        const vx = -uy;
        const vy = ux;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const arrowLen = Math.min(8.0, length * 0.35);
        const arrowHalfWidth = arrowLen / 3.0;

        // Arrow at p1
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x + arrowLen * ux + arrowHalfWidth * vx, p1.y + arrowLen * uy + arrowHalfWidth * vy);
        ctx.lineTo(p1.x + arrowLen * ux - arrowHalfWidth * vx, p1.y + arrowLen * uy - arrowHalfWidth * vy);
        ctx.closePath();
        ctx.fill();

        // Arrow at p2
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p2.x - arrowLen * ux + arrowHalfWidth * vx, p2.y - arrowLen * uy + arrowHalfWidth * vy);
        ctx.lineTo(p2.x - arrowLen * ux - arrowHalfWidth * vx, p2.y - arrowLen * uy - arrowHalfWidth * vy);
        ctx.closePath();
        ctx.fill();

        const midX = (p1.x + p2.x) / 2.0 + textOffset.x;
        const midY = (p1.y + p2.y) / 2.0 + textOffset.y;

        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        const metrics = ctx.measureText(text);
        const txtWidth = metrics.width;
        ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
        ctx.fillRect(align === 'center' ? midX - txtWidth / 2 - 3 : midX - 2, midY - 7, txtWidth + 6, 14);

        ctx.fillStyle = color;
        ctx.fillText(text, midX, midY);
        ctx.restore();
    }

    drawDataCard(ctx, g) {
        ctx.save();
        const cx = 16, cy = 16;
        const cardW = 260, cardH = 175;

        ctx.fillStyle = 'rgba(11, 19, 41, 0.9)';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, cardH, 6) : ctx.rect(cx, cy, cardW, cardH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, 26, [6, 6, 0, 0]) : ctx.rect(cx, cy, cardW, 26);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('📐 BẢNG THÔNG SỐ CHUẨN ISO 23509', cx + 10, cy + 13);

        const x1_str = (g.x1 >= 0 ? '+' : '') + (g.x1 || 0).toFixed(2);
        const x2_str = (g.x2 >= 0 ? '+' : '') + (g.x2 || 0).toFixed(2);
        const items = [
            ['Tỉ số truyền i', (g.i || (g.z2 / g.z1)).toFixed(3)],
            ['Số răng z1 / z2', g.z1 + ' / ' + g.z2],
            ['Mô-đun pháp mmn', (g.mmn || 10).toFixed(1) + ' mm'],
            ['Góc nón chia δ1 / δ2', (g.delta1_deg || 0).toFixed(1) + '° / ' + (g.delta2_deg || 0).toFixed(1) + '°'],
            ['Bề rộng vành răng b', (g.b || 0).toFixed(1) + ' mm'],
            ['Góc xoắn răng β', (g.beta_deg || 0).toFixed(1) + '°'],
            ['Dịch chỉnh x1 / x2', x1_str + ' / ' + x2_str]
        ];

        ctx.font = '10px system-ui, sans-serif';
        items.forEach((item, idx) => {
            const rowY = cy + 40 + idx * 18;
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(item[0], cx + 10, rowY);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 10px Consolas, monospace';
            ctx.textAlign = 'right';
            ctx.fillText(item[1], cx + cardW - 10, rowY);
            ctx.textAlign = 'left';
            ctx.font = '10px system-ui, sans-serif';
        });

        ctx.restore();
    }

    drawToothStripes(ctx, toe_root, heel_root, toe_tip, heel_tip, color, phaseAngle) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([2, 2]);

        const numTeeth = 6;
        for (let i = 0; i < numTeeth; i++) {
            const rawT = (i / numTeeth + (phaseAngle / (Math.PI * 2)) % 1 + 1) % 1;
            const t = Math.sin(rawT * Math.PI);
            if (t <= 0.05) continue;

            const rx = toe_root.x + (heel_root.x - toe_root.x) * rawT;
            const ry = toe_root.y + (heel_root.y - toe_root.y) * rawT;
            const tx = toe_tip.x + (heel_tip.x - toe_tip.x) * rawT;
            const ty = toe_tip.y + (heel_tip.y - toe_tip.y) * rawT;

            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(tx, ty);
            ctx.stroke();
        }
        ctx.restore();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BevelGearCanvas };
}
