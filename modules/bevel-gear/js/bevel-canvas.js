/**
 * MITCalc Web App - 2D Interactive Bevel Gear Canvas Visualizer
 * Industrial-Grade Axial Engineering Cross-Section & Kinematic Meshing Simulator
 * Standards: ISO 23509, DIN 3971, DIN 3965
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
        this.viewMode = 'section'; // 'section' (Mat cat ky thuat) or 'kinematic' (Mo phong dong)

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
        const th_a1 = ((g.deltaa1_deg || 2.0) * Math.PI) / 180.0;
        const th_a2 = ((g.deltaa2_deg || 2.0) * Math.PI) / 180.0;
        const Rae1 = g.Re / Math.cos(th_a1);
        const Rae2 = g.Re / Math.cos(th_a2);

        // Calculate precise bounding box of entire assembly in mm:
        const x_hub_end1 = Rae1 * Math.cos(d1 + th_a1) + 15 + Math.max(30, b * 0.7);
        const y_hub_end2 = -Rae2 * Math.sin(d1 - th_a2 * 0.85) - 18 - Math.max(35, b * 0.8);
        const dae2_half = (g.dae2 || 400) / 2.0;
        const dae1_half = (g.dae1 || 200) / 2.0;

        const xMin = Math.min(-dae2_half - 20, -50);
        const xMax = Math.max(dae2_half + 20, x_hub_end1 + 30);
        const yMin = Math.min(y_hub_end2 - 30, -dae1_half - 20);
        const yMax = Math.max(dae1_half + 30, 50);

        const wGeom = Math.max(100, xMax - xMin);
        const hGeom = Math.max(100, yMax - yMin);
        const cxGeom = (xMin + xMax) / 2.0;
        const cyGeom = (yMin + yMax) / 2.0;

        const scale = Math.min((w * 0.82) / wGeom, (h * 0.82) / hGeom);

        ctx.save();
        ctx.translate(w / 2.0 + this.panX, h / 2.0 + this.panY);
        ctx.scale(this.zoom * scale, this.zoom * scale);
        ctx.translate(-cxGeom, -cyGeom);

        this.drawAxialSection(ctx);

        ctx.restore();
    }

    drawGrid(ctx, w, h) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const step = 25;
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

    drawAxialSection(ctx) {
        const g = this.geom;
        const d1 = g.delta1;
        const d2 = g.delta2;
        const Re = g.Re;
        const Ri = g.Ri;
        const Rm = g.Rm;
        const b = g.b;

        const th_a1 = (g.deltaa1_deg * Math.PI) / 180.0;
        const th_f1 = (g.deltaf1_deg * Math.PI) / 180.0;
        const th_a2 = (g.deltaa2_deg * Math.PI) / 180.0;
        const th_f2 = (g.deltaf2_deg * Math.PI) / 180.0;

        const d1a = d1 + th_a1;
        const d1f = d1 - th_f1;
        const d2a = d2 + th_a2;
        const d2f = d2 - th_f2;

        // Shaft Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([12, 4, 3, 4]);

        // Pinion Axis (X)
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(Re * 1.45, 0);
        ctx.stroke();

        // Gear Axis (Y pointing up = -Y in canvas)
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(0, -Re * 1.45);
        ctx.stroke();

        // Pitch Generator Line
        const pitchContactX = Re * Math.cos(d1);
        const pitchContactY = -Re * Math.sin(d1);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(pitchContactX * 1.15, pitchContactY * 1.15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Back Cone Normal Line at Re
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pitchContactX - 50 * Math.sin(d1), pitchContactY - 50 * Math.cos(d1));
        ctx.lineTo(pitchContactX + 50 * Math.sin(d1), pitchContactY + 50 * Math.cos(d1));
        ctx.stroke();
        ctx.setLineDash([]);

        // 1. PINION (BANH DAN 1)
        const Rae1 = Re / Math.cos(th_a1);
        const Rfe1 = Re / Math.cos(th_f1);
        const Rai1 = Ri / Math.cos(th_a1);
        const Rfi1 = Ri / Math.cos(th_f1);

        const p1_toe_tip = { x: Rai1 * Math.cos(d1a), y: -Rai1 * Math.sin(d1a) };
        const p1_heel_tip= { x: Rae1 * Math.cos(d1a), y: -Rae1 * Math.sin(d1a) };
        const p1_heel_root={ x: Rfe1 * Math.cos(d1f), y: -Rfe1 * Math.sin(d1f) };
        const p1_toe_root ={ x: Rfi1 * Math.cos(d1f), y: -Rfi1 * Math.sin(d1f) };

        const d_bore1 = Math.max(15, g.de1 * 0.22);
        const d_hub1  = Math.max(25, g.de1 * 0.45);
        const x_back1 = p1_heel_tip.x + 15;
        const x_hub_end1 = x_back1 + Math.max(30, b * 0.7);

        // Pinion Upper Half Cross-Section
        ctx.beginPath();
        ctx.moveTo(p1_toe_root.x, p1_toe_root.y);
        ctx.lineTo(p1_toe_tip.x, p1_toe_tip.y);
        ctx.lineTo(p1_heel_tip.x, p1_heel_tip.y);
        ctx.lineTo(p1_heel_root.x, p1_heel_root.y);
        ctx.lineTo(x_back1, -d_hub1 / 2.0);
        ctx.lineTo(x_hub_end1, -d_hub1 / 2.0);
        ctx.lineTo(x_hub_end1, -d_bore1 / 2.0);
        ctx.lineTo(p1_toe_root.x - 5, -d_bore1 / 2.0);
        ctx.lineTo(p1_toe_root.x, p1_toe_root.y);
        ctx.closePath();

        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Pinion Lower Half Cross-Section (Symmetric)
        ctx.beginPath();
        ctx.moveTo(p1_toe_root.x, -p1_toe_root.y);
        ctx.lineTo(p1_toe_tip.x, -p1_toe_tip.y);
        ctx.lineTo(p1_heel_tip.x, -p1_heel_tip.y);
        ctx.lineTo(p1_heel_root.x, -p1_heel_root.y);
        ctx.lineTo(x_back1, d_hub1 / 2.0);
        ctx.lineTo(x_hub_end1, d_hub1 / 2.0);
        ctx.lineTo(x_hub_end1, d_bore1 / 2.0);
        ctx.lineTo(p1_toe_root.x - 5, d_bore1 / 2.0);
        ctx.lineTo(p1_toe_root.x, -p1_toe_root.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.fill();
        ctx.stroke();

        // Pinion Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(p1_toe_root.x - 5, -d_bore1 / 2.0, x_hub_end1 - (p1_toe_root.x - 5), d_bore1);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.strokeRect(p1_toe_root.x - 5, -d_bore1 / 2.0, x_hub_end1 - (p1_toe_root.x - 5), d_bore1);

        // 2. GEAR (BANH BI DAN 2)
        const Rae2 = Re / Math.cos(th_a2);
        const Rfe2 = Re / Math.cos(th_f2);
        const Rai2 = Ri / Math.cos(th_a2);
        const Rfi2 = Ri / Math.cos(th_f2);

        const ang_gear_tip_mesh = -d1 + th_a2 * 0.85;
        const ang_gear_root_mesh= -d1 - th_f2;

        const p2_heel_tip = { x: Rae2 * Math.cos(ang_gear_tip_mesh), y: Rae2 * Math.sin(ang_gear_tip_mesh) };
        const p2_toe_tip  = { x: Rai2 * Math.cos(ang_gear_tip_mesh), y: Rai2 * Math.sin(ang_gear_tip_mesh) };
        const p2_heel_root= { x: Rfe2 * Math.cos(ang_gear_root_mesh), y: Rfe2 * Math.sin(ang_gear_root_mesh) };
        const p2_toe_root = { x: Rfi2 * Math.cos(ang_gear_root_mesh), y: Rfi2 * Math.sin(ang_gear_root_mesh) };

        const d_bore2 = Math.max(25, g.de2 * 0.16);
        const d_hub2  = Math.max(45, g.de2 * 0.32);
        const y_back2 = p2_heel_tip.y - 18;
        const y_hub_end2 = y_back2 - Math.max(35, b * 0.8);

        // Gear Left Half Cross-Section (Meshing side)
        ctx.beginPath();
        ctx.moveTo(p2_toe_root.x, p2_toe_root.y);
        ctx.lineTo(p2_toe_tip.x, p2_toe_tip.y);
        ctx.lineTo(p2_heel_tip.x, p2_heel_tip.y);
        ctx.lineTo(p2_heel_root.x, p2_heel_root.y);
        ctx.lineTo(d_hub2 / 2.0, y_back2);
        ctx.lineTo(d_hub2 / 2.0, y_hub_end2);
        ctx.lineTo(d_bore2 / 2.0, y_hub_end2);
        ctx.lineTo(d_bore2 / 2.0, p2_toe_root.y + 5);
        ctx.lineTo(p2_toe_root.x, p2_toe_root.y);
        ctx.closePath();

        ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Gear Right Half Cross-Section (Symmetric)
        ctx.beginPath();
        ctx.moveTo(-p2_toe_root.x, p2_toe_root.y);
        ctx.lineTo(-p2_toe_tip.x, p2_toe_tip.y);
        ctx.lineTo(-p2_heel_tip.x, p2_heel_tip.y);
        ctx.lineTo(-p2_heel_root.x, p2_heel_root.y);
        ctx.lineTo(-d_hub2 / 2.0, y_back2);
        ctx.lineTo(-d_hub2 / 2.0, y_hub_end2);
        ctx.lineTo(-d_bore2 / 2.0, y_hub_end2);
        ctx.lineTo(-d_bore2 / 2.0, p2_toe_root.y + 5);
        ctx.lineTo(-p2_toe_root.x, p2_toe_root.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
        ctx.fill();
        ctx.stroke();

        // Gear Bore Shading
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (p2_toe_root.y + 5) - y_hub_end2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.strokeRect(-d_bore2 / 2.0, y_hub_end2, d_bore2, (p2_toe_root.y + 5) - y_hub_end2);

        // 3. TOOTH CONJUGATE MESHING STRIPES
        this.drawToothStripes(ctx, p1_toe_root, p1_heel_root, p1_toe_tip, p1_heel_tip, '#059669', this.angle1);
        this.drawToothStripes(ctx, p2_toe_root, p2_heel_root, p2_toe_tip, p2_heel_tip, '#2563eb', -this.angle1 / (g.i || 2.5));

        // 4. APEX V & DIMENSION LABELS
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px Consolas, sans-serif';
        ctx.fillText('V (Dinh Non Chung - Apex)', -25, 22);

        // Dimension Arcs
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        ctx.beginPath();
        ctx.arc(0, 0, Re, -Math.PI / 2 - 0.1, 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, Ri, -Math.PI / 2 - 0.1, 0.1);
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px sans-serif';

        const ang_lbl = -d1 * 0.5;
        ctx.fillText('Re = ' + Re.toFixed(1) + ' mm', Re * Math.cos(ang_lbl) + 10, Re * Math.sin(ang_lbl));
        ctx.fillText('b = ' + b.toFixed(1) + ' mm', Rm * Math.cos(-d1) + 12, Rm * Math.sin(-d1) - 10);
        ctx.fillStyle = '#10b981';
        ctx.fillText('delta1 = ' + g.delta1_deg.toFixed(1) + ' deg', 70, -12);
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('delta2 = ' + g.delta2_deg.toFixed(1) + ' deg', 14, -75);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Sigma = ' + g.Sigma_deg.toFixed(1) + ' deg', 35, -35);

        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('dae1 = ' + g.dae1.toFixed(1), p1_heel_tip.x + 8, p1_heel_tip.y);
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('dae2 = ' + g.dae2.toFixed(1), p2_heel_tip.x, p2_heel_tip.y - 12);
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
