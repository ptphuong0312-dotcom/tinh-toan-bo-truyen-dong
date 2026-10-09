/**
 * MITCalc Web App - Involute Splines 2D CAD Canvas Renderer
 * Renders exact involute profile geometry for shaft, hub, and meshing assembly.
 * Supports multi-touch gestures, pan/zoom, measurement pins, and common normal overlay.
 */

import { SplinesCalc, SPLINE_RESOLUTION_LEVELS } from './splines-calc.js';

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
        this.profileResolution = 6; // Mặc định Mức 6 (Chuẩn Gốc MITCalc 1.74)

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

    setResolution(lvl) {
        this.profileResolution = parseInt(lvl, 10) || 6;
        this.render();
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
        const prevD = this.geom ? this.geom.d0 : null;
        this.geom = geom;
        if (this.scale === 1.0 || !prevD || Math.abs(prevD - geom.d0) > 1e-3) {
            this.resetView();
        } else {
            this.render();
        }
    }

    /**
     * Compute analytical profile points for shaft teeth sector (External Spline)
     * Delegated to SplinesCalc for 100% unified geometry with DXF exporter
     */
    generateShaftSectorPoints(g, resLevel = 6) {
        return SplinesCalc.generateShaftSectorPoints(g, resLevel);
    }

    /**
     * Compute analytical profile points for internal hub tooth sector (Internal Spline Tooth)
     * Delegated to SplinesCalc for 100% unified geometry with DXF exporter
     */
    generateHubSpacePoints(g, resLevel = 6) {
        return SplinesCalc.generateHubSpacePoints(g, resLevel);
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
        const pts = this.generateShaftSectorPoints(g, this.profileResolution);

        ctx.save();
        ctx.fillStyle = 'rgba(2, 132, 199, 0.28)';   // Sky blue translucent fill
        ctx.strokeStyle = '#38bdf8';                 // Cyan neon contour
        ctx.lineWidth = 1.8 / this.scale;

        const startIdx = this.toothScope === 'full' ? 0 : (this.toothScope === 'detail' ? -1 : 0);
        const endIdx = this.toothScope === 'full' ? z - 1 : (this.toothScope === 'detail' ? 1 : 0);

        ctx.beginPath();
        let isFirstPt = true;

        for (let j = startIdx; j <= endIdx; j++) {
            const rotAngle = (j * 2 * Math.PI) / z;
            for (let i = 0; i < pts.length; i++) {
                const totalTheta = rotAngle + pts[i].theta;
                const px = pts[i].r * Math.sin(totalTheta);
                const py = pts[i].r * Math.cos(totalTheta);
                if (isFirstPt) {
                    ctx.moveTo(px, py);
                    isFirstPt = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }

        if (this.toothScope === 'full') {
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Inner shaft bore
            const r_bore = (g.df0 / 2) * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, r_bore, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
        }

        ctx.restore();
    }

    drawHub(ctx) {
        const g = this.geom;
        const z = g.z0;
        const pts = this.generateHubSpacePoints(g, this.profileResolution);

        ctx.save();
        ctx.fillStyle = 'rgba(249, 115, 22, 0.18)'; // Orange translucent fill
        ctx.strokeStyle = '#fb923c';                // Amber neon contour
        ctx.lineWidth = 1.8 / this.scale;

        const startIdx = this.toothScope === 'full' ? 0 : (this.toothScope === 'detail' ? -1 : 0);
        const endIdx = this.toothScope === 'full' ? z - 1 : (this.toothScope === 'detail' ? 1 : 0);

        if (this.toothScope === 'full') {
            const r_hub_outer = (g.dri2 / 2) * 1.35;

            // 1. Fill solid metal between outer collar and internal teeth using evenodd
            ctx.beginPath();
            // Outer collar subpath (clockwise)
            ctx.arc(0, 0, r_hub_outer, 0, Math.PI * 2, false);

            // Inner teeth subpath
            for (let j = 0; j < z; j++) {
                const rotAngle = (j * 2 * Math.PI) / z;
                for (let i = 0; i < pts.length; i++) {
                    const totalTheta = rotAngle + pts[i].theta;
                    const px = pts[i].r * Math.sin(totalTheta);
                    const py = pts[i].r * Math.cos(totalTheta);
                    if (j === 0 && i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
            }
            ctx.closePath();
            ctx.fill('evenodd');

            // 2. Stroke internal teeth ONLY
            ctx.beginPath();
            for (let j = 0; j < z; j++) {
                const rotAngle = (j * 2 * Math.PI) / z;
                for (let i = 0; i < pts.length; i++) {
                    const totalTheta = rotAngle + pts[i].theta;
                    const px = pts[i].r * Math.sin(totalTheta);
                    const py = pts[i].r * Math.cos(totalTheta);
                    if (j === 0 && i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
            }
            ctx.closePath();
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 1.8 / this.scale;
            ctx.stroke();

            // 3. Stroke outer collar contour ONLY
            ctx.beginPath();
            ctx.arc(0, 0, r_hub_outer, 0, Math.PI * 2);
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 1.5 / this.scale;
            ctx.stroke();
        } else {
            // Detail / Single tooth view
            ctx.beginPath();
            let isFirstPt = true;
            for (let j = startIdx; j <= endIdx; j++) {
                const rotAngle = (j * 2 * Math.PI) / z;
                for (let i = 0; i < pts.length; i++) {
                    const totalTheta = rotAngle + pts[i].theta;
                    const px = pts[i].r * Math.sin(totalTheta);
                    const py = pts[i].r * Math.cos(totalTheta);
                    if (isFirstPt) {
                        ctx.moveTo(px, py);
                        isFirstPt = false;
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
            }
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 1.8 / this.scale;
            ctx.stroke();
        }

        ctx.restore();
    }

    drawInspection(ctx) {
        const g = this.geom;
        const pi = Math.PI;

        ctx.save();

        // 1. Inspection Pins / Balls for Shaft
        if (this.viewMode === 'shaft' || this.viewMode === 'assembly') {
            const dt = g.dt0;
            const r_pin = dt / 2;
            const r_center = (g.M0 - dt) / 2.0;

            // Concentric Circle through the outermost point of the balls (Radius = M0 / 2)
            ctx.strokeStyle = '#f59e0b'; // Amber Gold
            ctx.setLineDash([8 / this.scale, 4 / this.scale]);
            ctx.lineWidth = 1.5 / this.scale;
            ctx.beginPath();
            ctx.arc(0, 0, g.M0 / 2, 0, pi * 2);
            ctx.stroke();

            // Place ball(s) in tooth space (Top space at pi / z0, and opposite space if even z)
            const angles = (g.z0 % 2 === 0) ? [pi / g.z0, pi / g.z0 + pi] : [pi / g.z0];
            ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';  // translucent yellow
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5 / this.scale;
            ctx.setLineDash([]);

            angles.forEach(ang => {
                const cx = r_center * Math.sin(ang);
                const cy = r_center * Math.cos(ang);
                ctx.beginPath();
                ctx.arc(cx, cy, r_pin, 0, pi * 2);
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

            // Dimension line & label for Shaft Ball Circle
            const lblAng = pi / g.z0;
            const ptOuter = { x: (g.M0 / 2) * Math.sin(lblAng), y: (g.M0 / 2) * Math.cos(lblAng) };
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.2 / this.scale;
            ctx.beginPath();
            ctx.moveTo(ptOuter.x, ptOuter.y);
            const ptExt = { x: ptOuter.x + 18 / this.scale, y: ptOuter.y + 12 / this.scale };
            ctx.lineTo(ptExt.x, ptExt.y);
            ctx.lineTo(ptExt.x + 42 / this.scale, ptExt.y);
            ctx.stroke();

            ctx.save();
            ctx.translate(ptExt.x + 2 / this.scale, ptExt.y + 3 / this.scale);
            ctx.scale(1, -1);
            ctx.fillStyle = '#fef08a';
            ctx.font = `bold ${Math.max(9, 11 / this.scale)}px sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`M = ${g.M0.toFixed(3)}`, 0, 0);
            ctx.restore();
        }

        // 2. Inspection Pins / Balls for Hub
        if (this.viewMode === 'hub') {
            const dt = g.dt2 || g.dt0;
            const r_pin = dt / 2;
            const r_center = (g.ds2 || Math.abs(g.M2 + dt)) / 2.0;
            const k2 = g.k2 || 3;

            // Concentric Circle through the innermost point of the balls (Radius = M2 / 2)
            ctx.strokeStyle = '#f59e0b';
            ctx.setLineDash([8 / this.scale, 4 / this.scale]);
            ctx.lineWidth = 1.5 / this.scale;
            ctx.beginPath();
            ctx.arc(0, 0, g.M2 / 2, 0, pi * 2);
            ctx.stroke();

            // Two balls placed in hub tooth spaces across k teeth
            const ang1 = 0;
            const ang2 = (2 * pi * k2) / g.z0;
            const angles = [ang1, ang2];

            ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5 / this.scale;
            ctx.setLineDash([]);

            const pts = angles.map(ang => {
                const cx = r_center * Math.sin(ang);
                const cy = r_center * Math.cos(ang);
                ctx.beginPath();
                ctx.arc(cx, cy, r_pin, 0, pi * 2);
                ctx.fill();
                ctx.stroke();

                const s = 4 / this.scale;
                ctx.beginPath();
                ctx.moveTo(cx - s, cy);
                ctx.lineTo(cx + s, cy);
                ctx.moveTo(cx, cy - s);
                ctx.lineTo(cx, cy + s);
                ctx.stroke();
                return { x: cx, y: cy, ang };
            });

            // Vector between ball centers
            const dx_c = pts[1].x - pts[0].x;
            const dy_c = pts[1].y - pts[0].y;
            const dist_c = Math.hypot(dx_c, dy_c) || 1e-6;
            const ux = dx_c / dist_c;
            const uy = dy_c / dist_c;

            // Furthest outermost points of the two balls (mép ngoài xa nhất của 2 viên bi)
            const pOut0 = { x: pts[0].x - ux * r_pin, y: pts[0].y - uy * r_pin };
            const pOut1 = { x: pts[1].x + ux * r_pin, y: pts[1].y + uy * r_pin };

            // Perpendicular unit vector for dimension boundary ticks
            const nx = -uy;
            const ny = ux;
            const tickLen = 7 / this.scale;

            // Dimension line across the 2 balls (W_bi2: furthest outer distance)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.3 / this.scale;
            ctx.setLineDash([4 / this.scale, 3 / this.scale]);
            ctx.beginPath();
            ctx.moveTo(pOut0.x, pOut0.y);
            ctx.lineTo(pOut1.x, pOut1.y);
            ctx.stroke();

            // Boundary ticks at both outermost edges
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(pOut0.x - nx * tickLen, pOut0.y - ny * tickLen);
            ctx.lineTo(pOut0.x + nx * tickLen, pOut0.y + ny * tickLen);
            ctx.moveTo(pOut1.x - nx * tickLen, pOut1.y - ny * tickLen);
            ctx.lineTo(pOut1.x + nx * tickLen, pOut1.y + ny * tickLen);
            ctx.stroke();

            // Text note for Wb between the 2 pins
            const midX = (pOut0.x + pOut1.x) / 2;
            const midY = (pOut0.y + pOut1.y) / 2;
            const wbVal = g.W_bi2 || g.W2;
            ctx.save();
            ctx.translate(midX + nx * (9 / this.scale), midY + ny * (9 / this.scale));
            ctx.scale(1, -1);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `bold ${Math.max(9, 11 / this.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Wb = ${wbVal.toFixed(3)} (k=${k2})`, 0, 0);
            ctx.restore();

            // Leader for Innermost Ball Circle M2
            ctx.strokeStyle = '#facc15';
            ctx.beginPath();
            const ptInner = { x: 0, y: -(g.M2 / 2) };
            ctx.moveTo(ptInner.x, ptInner.y);
            const ptExt = { x: ptInner.x - 25 / this.scale, y: ptInner.y - 15 / this.scale };
            ctx.lineTo(ptExt.x, ptExt.y);
            ctx.lineTo(ptExt.x - 30 / this.scale, ptExt.y);
            ctx.stroke();

            ctx.save();
            ctx.translate(ptExt.x - 2 / this.scale, ptExt.y - 3 / this.scale);
            ctx.scale(1, -1);
            ctx.fillStyle = '#fef08a';
            ctx.font = `bold ${Math.max(9, 11 / this.scale)}px sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`M = ${g.M2.toFixed(3)}`, 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }

    drawOverlayUI(ctx, w, h) {
        ctx.save();

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
