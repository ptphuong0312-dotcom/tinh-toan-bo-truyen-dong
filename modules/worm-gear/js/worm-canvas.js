/**
 * MITCalc Web App - Worm Gear 2D CAD Canvas, Dynamic Chart 1963 & DXF R12 Exporter (Module 3)
 * 100% Client-Side Offline Rendering (DIN 3975 / DIN 3996 / DXF.bas 1-to-1)
 */

class WormCanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.sec4Canvas = document.getElementById('wormSec4ChartCanvas');
        this.sec4Ctx = this.sec4Canvas ? this.sec4Canvas.getContext('2d') : null;

        this.geom = null;
        this.viewMode = 'assembly'; // 'assembly' | 'worm' | 'wheel'
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.showGrid = true;
        this.showDims = true;

        this.isPlaying = false;
        this.animSpeed = 1.0;
        this.animPhase = 0.0; // Worm rotation angle in radians
        this.lastFrameTime = 0;
        this.animFrameId = null;

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.lastPinchDist = null;

        if (this.canvas) {
            this.initInteractions();
        }
    }

    initInteractions() {
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.12 : 0.89;
            this.zoom = Math.max(0.25, Math.min(8.0, this.zoom * factor));
            this.render();
        }, { passive: false });

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

        // Mobile Multi-Touch (Rule 11)
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.lastPinchDist = Math.hypot(dx, dy);
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                this.panX = e.touches[0].clientX - this.dragStartX;
                this.panY = e.touches[0].clientY - this.dragStartY;
                this.render();
            } else if (e.touches.length === 2 && this.lastPinchDist) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                const ratio = dist / this.lastPinchDist;
                this.zoom = Math.max(0.25, Math.min(8.0, this.zoom * ratio));
                this.lastPinchDist = dist;
                this.render();
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
            this.lastPinchDist = null;
        });
    }

    updateGeometry(geom) {
        this.geom = geom;
        this.renderSec4Chart();
        this.render();
    }

    resetView() {
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.render();
    }

    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.lastFrameTime = performance.now();
            const loop = (now) => {
                if (!this.isPlaying) return;
                const dt = (now - this.lastFrameTime) / 1000.0;
                this.lastFrameTime = now;
                this.animPhase += dt * 3.0 * this.animSpeed;
                this.render();
                this.animFrameId = requestAnimationFrame(loop);
            };
            this.animFrameId = requestAnimationFrame(loop);
        } else if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
        return this.isPlaying;
    }

    // =========================================================================
    // SECTION 4.0 DYNAMIC PLOT (1-to-1 Reproduction of Chart 1963 / Data1)
    // =========================================================================
    renderSec4Chart() {
        if (!this.sec4Canvas || !this.sec4Ctx || !this.geom || !this.geom.chartData1) return;
        const ctx = this.sec4Ctx;
        const W = this.sec4Canvas.width;
        const H = this.sec4Canvas.height;
        const d1 = this.geom.chartData1;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        // Compute bounds from Data1 points
        const minX = Math.min(d1.C3, -this.geom.l1 - this.geom.BeSi) * 1.12;
        const maxX = Math.max(d1.C4, d1.C9 + this.geom.da1 * 0.65) * 1.08;
        const minY = Math.min(d1.D8, d1.D12, -this.geom.a - this.geom.BeSi * 2.5 - this.geom.df1 * 0.6) * 1.1;
        const maxY = Math.max(d1.D7, this.geom.da2 * 0.58) * 1.12;

        const padL = 44, padR = 18, padT = 20, padB = 32;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;

        const spanX = Math.max(10, maxX - minX);
        const spanY = Math.max(10, maxY - minY);
        const scale = Math.min(plotW / spanX, plotH / spanY);

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = (minY + maxY) / 2.0;
        const cxScr = padL + plotW / 2.0;
        const cyScr = padT + plotH / 2.0;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Nice grid step
        const rawStep = Math.max(spanX, spanY) / 6.0;
        const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const norm = rawStep / mag;
        const step = (norm <= 2 ? 2 : (norm <= 5 ? 5 : 10)) * mag;

        // Draw grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';

        const startX = Math.ceil((cxWorld - (plotW / 2) / scale) / step) * step;
        const endX = Math.floor((cxWorld + (plotW / 2) / scale) / step) * step;
        for (let gx = startX; gx <= endX; gx += step) {
            const sx = toX(gx);
            ctx.beginPath();
            ctx.moveTo(sx, padT);
            ctx.lineTo(sx, H - padB);
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(gx).toString(), sx, H - padB + 14);
        }

        const startY = Math.ceil((cyWorld - (plotH / 2) / scale) / step) * step;
        const endY = Math.floor((cyWorld + (plotH / 2) / scale) / step) * step;
        for (let gy = startY; gy <= endY; gy += step) {
            const sy = toY(gy);
            ctx.beginPath();
            ctx.moveTo(padL, sy);
            ctx.lineTo(W - padR, sy);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(gy).toString(), padL - 6, sy + 3);
        }

        // Border box
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(padL, padT, plotW, plotH);

        // 1. Axis lines (Data1!C3:D14)
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 4, 2, 4]);
        d1.axisLines.forEach(seg => {
            ctx.beginPath();
            ctx.moveTo(toX(seg[0].x), toY(seg[0].y));
            ctx.lineTo(toX(seg[1].x), toY(seg[1].y));
            ctx.stroke();
        });
        ctx.restore();

        // 2. Wheel Circles da2 (solid cyan) and d2 (dashed amber) at (0,0)
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(toX(0), toY(0), d1.wheelCenter.r_da2 * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(toX(0), toY(0), d1.wheelCenter.r_d2 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Worm Side Circles da1 and d1 at (C9, -a)
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(toX(d1.wormSideCenter.x), toY(d1.wormSideCenter.y), d1.wormSideCenter.r_da1 * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(toX(d1.wormSideCenter.x), toY(d1.wormSideCenter.y), d1.wormSideCenter.r_d1 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 4. Wheel Side Box (Data1!C60:D64)
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        d1.wheelBox.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
            else ctx.lineTo(toX(pt.x), toY(pt.y));
        });
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 5. Worm Shaft Polyline (Data1!C45:D57)
        ctx.save();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        d1.shaftPolyline.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
            else ctx.lineTo(toX(pt.x), toY(pt.y));
        });
        ctx.stroke();
        ctx.restore();

        // 6. Bearing Boxes (Data1!C67:D86)
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        d1.bearingBoxes.forEach(box => {
            ctx.beginPath();
            box.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.y));
                else ctx.lineTo(toX(pt.x), toY(pt.y));
            });
            ctx.fill();
            ctx.stroke();
            // Draw X diagonal inside bearing box
            ctx.beginPath();
            ctx.moveTo(toX(box[0].x), toY(box[0].y));
            ctx.lineTo(toX(box[2].x), toY(box[2].y));
            ctx.moveTo(toX(box[1].x), toY(box[1].y));
            ctx.lineTo(toX(box[3].x), toY(box[3].y));
            ctx.stroke();
        });
        ctx.restore();
    }

    // =========================================================================
    // TAB 2 MAIN INTERACTIVE 2D CAD CANVAS
    // =========================================================================
    render() {
        if (!this.canvas || !this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const g = this.geom;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, W, H);

        if (this.showGrid) {
            this.drawBackgroundGrid(ctx, W, H);
        }

        if (this.viewMode === 'assembly') {
            this.renderAssemblyView(ctx, W, H, g);
        } else if (this.viewMode === 'worm') {
            this.renderWormDetailView(ctx, W, H, g);
        } else {
            this.renderWheelDetailView(ctx, W, H, g);
        }

        this.drawHUD(ctx, W, H, g);
    }

    drawBackgroundGrid(ctx, W, H) {
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        const step = 40;
        for (let x = 0; x < W; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    renderAssemblyView(ctx, W, H, g) {
        // Compute world bounding box of Dual View (Front View at x=0, Side Throat Section at x=C9)
        const d1Chart = g.chartData1;
        const minX = Math.min(-g.da2 * 0.6, -g.l1 - g.BeSi * 1.5);
        const maxX = d1Chart.C9 + Math.max(g.b2H, g.da1) * 0.9;
        const minY = -g.a - g.da1 * 0.85;
        const maxY = g.de2 * 0.6;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const baseScale = Math.min((W * 0.82) / spanX, (H * 0.80) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = (minY + maxY) / 2.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // 1. Centerlines
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([10, 4, 2, 4]);
        // Wheel horizontal axis
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        // Worm horizontal axis at y = -a
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(-g.a));
        ctx.lineTo(toX(maxX), toY(-g.a));
        ctx.stroke();
        // Front vertical axis at x = 0
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(maxY));
        ctx.lineTo(toX(0), toY(minY));
        ctx.stroke();
        // Side vertical axis at x = C9
        ctx.beginPath();
        ctx.moveTo(toX(d1Chart.C9), toY(maxY));
        ctx.lineTo(toX(d1Chart.C9), toY(minY));
        ctx.stroke();
        ctx.restore();

        // 2. Left View: Worm Wheel (with animated conjugate teeth) + Horizontal Worm Thread Rack
        this.drawAnimatedWheelFront(ctx, toX(0), toY(0), scale, g);
        this.drawHorizontalWormFront(ctx, toX, toY, scale, 0, -g.a, g);

        // 3. Right View: Worm Wheel Throat Section (exact DXF.bas WWheel) + Worm Cross Section at (C9, -a)
        this.drawWheelThroatSection(ctx, toX, toY, scale, d1Chart.C9, 0, g);
        this.drawWormCrossSection(ctx, toX(d1Chart.C9), toY(-g.a), scale, g);

        // 4. Dimension Callouts
        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.da2 * 0.58), toY(0), toX(-g.da2 * 0.58), toY(-g.a), `a = ${g.a.toFixed(2)} mm`, -14);
            this.drawDimLine(ctx, toX(-g.L / 2), toY(-g.a - g.da1 * 0.65), toX(g.L / 2), toY(-g.a - g.da1 * 0.65), `L = ${g.L.toFixed(2)} mm`, 16);
            this.drawDimLine(ctx, toX(d1Chart.C9 - g.b2H / 2), toY(g.de2 * 0.54), toX(d1Chart.C9 + g.b2H / 2), toY(g.de2 * 0.54), `b2H = ${g.b2H.toFixed(2)}`, -12);
        }
    }

    renderWormDetailView(ctx, W, H, g) {
        const minX = -g.l1 - g.df1 * 0.8;
        const maxX = g.l2 + g.da1 * 1.8;
        const minY = -g.da1 * 1.1;
        const maxY = g.da1 * 1.1;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const scale = Math.min((W * 0.82) / spanX, (H * 0.72) / spanY) * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Centerline
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        this.drawHorizontalWormFront(ctx, toX, toY, scale, 0, 0, g);
        const sideX = g.l2 + g.da1 * 0.95;
        this.drawWormCrossSection(ctx, toX(sideX), toY(0), scale, g);

        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.L / 2), toY(-g.da1 * 0.72), toX(g.L / 2), toY(-g.da1 * 0.72), `L = ${g.L.toFixed(2)} mm`, 18);
            this.drawDimLine(ctx, toX(-g.l1), toY(g.da1 * 0.75), toX(g.l2), toY(g.da1 * 0.75), `l1 + l2 = ${(g.l1 + g.l2).toFixed(2)} mm`, -14);
            this.drawDimLine(ctx, toX(sideX + g.da1 * 0.6), toY(-g.da1 / 2), toX(sideX + g.da1 * 0.6), toY(g.da1 / 2), `da1 = ${g.da1.toFixed(2)}`, 14);
        }
    }

    renderWheelDetailView(ctx, W, H, g) {
        const sideOffsetX = g.de2 * 0.65 + g.b2H * 0.8;
        const minX = -g.de2 * 0.6;
        const maxX = sideOffsetX + g.b2H * 0.8;
        const minY = -g.de2 * 0.6;
        const maxY = g.de2 * 0.6;

        const spanX = Math.max(20, maxX - minX);
        const spanY = Math.max(20, maxY - minY);
        const scale = Math.min((W * 0.82) / spanX, (H * 0.78) / spanY) * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // Centerlines
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.moveTo(toX(0), toY(minY));
        ctx.lineTo(toX(0), toY(maxY));
        ctx.moveTo(toX(sideOffsetX), toY(minY));
        ctx.lineTo(toX(sideOffsetX), toY(maxY));
        ctx.stroke();
        ctx.restore();

        this.drawAnimatedWheelFront(ctx, toX(0), toY(0), scale, g);
        this.drawWheelThroatSection(ctx, toX, toY, scale, sideOffsetX, 0, g);

        if (this.showDims) {
            this.drawDimLine(ctx, toX(-g.de2 / 2), toY(-g.de2 * 0.56), toX(g.de2 / 2), toY(-g.de2 * 0.56), `de2 = ${g.de2.toFixed(2)} mm`, 18);
            this.drawDimLine(ctx, toX(sideOffsetX - g.b2H / 2), toY(g.de2 * 0.55), toX(sideOffsetX + g.b2H / 2), toY(g.de2 * 0.55), `b2H = ${g.b2H.toFixed(2)} mm`, -14);
        }
    }

    drawAnimatedWheelFront(ctx, cx, cy, scale, g) {
        const z2 = Math.max(6, Math.round(g.z2));
        const r_de2 = (g.de2 / 2.0) * scale;
        const r_da2 = (g.da2 / 2.0) * scale;
        const r_d2 = (g.d2 / 2.0) * scale;
        const r_df2 = (g.df2 / 2.0) * scale;
        const r_bore = Math.max(8, (g.ShaftDB2 / 2.0) * scale);

        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const wheelRot = -handSign * (this.animPhase * g.z1) / z2;

        ctx.save();
        ctx.translate(cx, cy);

        // Outside rim circle de2
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, r_de2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw conjugate gear teeth around throat circumference
        const alphaRad = (g.alfax * Math.PI) / 180.0;
        const pitchAngle = (Math.PI * 2.0) / z2;
        const halfPitchTooth = (g.sx2 / g.d2); // angular half-thickness on pitch circle
        const daDelta = ((r_da2 - r_d2) / Math.max(1, r_d2)) * Math.tan(alphaRad);
        const dfDelta = ((r_d2 - r_df2) / Math.max(1, r_d2)) * Math.tan(alphaRad);
        const halfTipAngle = Math.max(0.05 * pitchAngle, halfPitchTooth - daDelta);
        const halfRootAngle = Math.min(0.46 * pitchAngle, halfPitchTooth + dfDelta);

        // At bottom (angle = +PI/2 in canvas coordinates where +Y is down), wheel tooth space meets worm tooth
        const basePhase = Math.PI / 2.0 + pitchAngle / 2.0 + wheelRot;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.20)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let k = 0; k < z2; k++) {
            const th = basePhase + k * pitchAngle;
            const a1 = th - halfRootAngle;
            const a2 = th - halfTipAngle;
            const a3 = th + halfTipAngle;
            const a4 = th + halfRootAngle;
            const aNext = th + pitchAngle - halfRootAngle;

            if (k === 0) {
                ctx.moveTo(r_df2 * Math.cos(a1), r_df2 * Math.sin(a1));
            } else {
                ctx.lineTo(r_df2 * Math.cos(a1), r_df2 * Math.sin(a1));
            }
            ctx.lineTo(r_da2 * Math.cos(a2), r_da2 * Math.sin(a2));
            ctx.arc(0, 0, r_da2, a2, a3, false);
            ctx.lineTo(r_df2 * Math.cos(a4), r_df2 * Math.sin(a4));
            ctx.arc(0, 0, r_df2, a4, aNext, false);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pitch circle d2 (dashed)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, r_d2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bore + Keyway
        ctx.fillStyle = '#0b1120';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r_bore, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    drawHorizontalWormFront(ctx, toX, toY, scale, wxCenter, wyCenter, g) {
        const L = g.L;
        const da1 = g.da1;
        const d1 = g.d1;
        const df1 = g.df1;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const px = g.px;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;

        // Shaft extensions out to bearings (-l1 to +l2)
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        // Left shaft
        ctx.beginPath();
        ctx.rect(toX(wxCenter - g.l1), toY(wyCenter + ds / 2), (g.l1 - L / 2) * scale, ds * scale);
        ctx.fill();
        ctx.stroke();
        // Right shaft
        ctx.beginPath();
        ctx.rect(toX(wxCenter + L / 2), toY(wyCenter + ds / 2), (g.l2 - L / 2) * scale, ds * scale);
        ctx.fill();
        ctx.stroke();

        // Shoulders (ds x t) from DXF.bas Worm()
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(toX(wxCenter - L / 2 - th), toY(wyCenter + ds / 2), th * scale, ds * scale);
        ctx.strokeRect(toX(wxCenter + L / 2), toY(wyCenter + ds / 2), th * scale, ds * scale);

        // Root cylinder core (-L/2 to +L/2, -df1/2 to +df1/2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.rect(toX(wxCenter - L / 2), toY(wyCenter + df1 / 2), L * scale, df1 * scale);
        ctx.fill();
        ctx.stroke();

        // Trapezoidal worm thread rack along [-L/2, +L/2]
        // Thread axial shift from animation:
        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const axialShift = (handSign * ((this.animPhase / (Math.PI * 2.0)) * g.z1 * px)) % px;
        const ha1 = g.ha1;
        const hf1 = g.hf1;
        const halfSx1 = g.sx1 / 2.0;
        const halfSa1 = Math.max(0.05 * px, halfSx1 - ha1 * Math.tan(alfaxRad));
        const halfSf1 = Math.min(0.48 * px, halfSx1 + hf1 * Math.tan(alfaxRad));

        const nPitches = Math.ceil(L / px) + 2;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;

        // Clip to worm face width [-L/2, +L/2] with chamfer angle DXF_Beta
        ctx.save();
        const ch = Math.tan((g.DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
        ctx.beginPath();
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter));
        ctx.lineTo(toX(wxCenter - L / 2), toY(wyCenter + df1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2 + ch), toY(wyCenter + da1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2 - ch), toY(wyCenter + da1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter + df1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter - df1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2 - ch), toY(wyCenter - da1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2 + ch), toY(wyCenter - da1 / 2));
        ctx.lineTo(toX(wxCenter - L / 2), toY(wyCenter - df1 / 2));
        ctx.closePath();
        ctx.clip();

        for (let k = -nPitches; k <= nPitches; k++) {
            // Top tooth centered at x = k * px + axialShift (at k=0, tooth crest is at x=0 meshing with wheel space)
            const xcTop = wxCenter + k * px + axialShift;
            ctx.beginPath();
            ctx.moveTo(toX(xcTop - halfSf1), toY(wyCenter + df1 / 2));
            ctx.lineTo(toX(xcTop - halfSa1), toY(wyCenter + da1 / 2));
            ctx.lineTo(toX(xcTop + halfSa1), toY(wyCenter + da1 / 2));
            ctx.lineTo(toX(xcTop + halfSf1), toY(wyCenter + df1 / 2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Bottom tooth (shifted by px/2 for odd z1)
            const xcBot = xcTop + (g.z1 % 2 === 1 ? px / 2.0 : 0.0);
            ctx.beginPath();
            ctx.moveTo(toX(xcBot - halfSf1), toY(wyCenter - df1 / 2));
            ctx.lineTo(toX(xcBot - halfSa1), toY(wyCenter - da1 / 2));
            ctx.lineTo(toX(xcBot + halfSa1), toY(wyCenter - da1 / 2));
            ctx.lineTo(toX(xcBot + halfSf1), toY(wyCenter - df1 / 2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();

        // Pitch lines y = wyCenter +- d1/2
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter + d1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter + d1 / 2));
        ctx.moveTo(toX(wxCenter - L / 2), toY(wyCenter - d1 / 2));
        ctx.lineTo(toX(wxCenter + L / 2), toY(wyCenter - d1 / 2));
        ctx.stroke();
        ctx.restore();
    }

    // Exact reproduction of DXF.bas WWheel(x1, y1) throat geometry
    drawWheelThroatSection(ctx, toX, toY, scale, wx, wy, g) {
        const a = g.a;
        const da2 = g.da2;
        const dm2 = g.dm2;
        const df2 = g.df2;
        const de2 = Math.max(g.de2, 1.001 * da2);
        const b2h = g.b2H;

        const r1 = a - da2 / 2.0; // Throat tip arc radius centered at worm axis
        const r2 = a - dm2 / 2.0; // Throat pitch arc radius
        const r3 = a - df2 / 2.0; // Throat root arc radius

        const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2h * b2h));

        ctx.save();
        // Draw upper and lower wheel body halves with concave throat arcs
        [-1, 1].forEach(signY => {
            const wormCenterY = wy + signY * a;
            const yRootEdge = wy + signY * (df2 / 2.0 + v4);
            const yBore = wy + signY * (g.ShaftDB2 / 2.0);

            ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;

            ctx.beginPath();
            ctx.moveTo(toX(wx - b2h / 2.0), toY(yBore));
            ctx.lineTo(toX(wx - b2h / 2.0), toY(yRootEdge));
            // Concave root throat arc around (wx, wormCenterY) of radius r3
            const angL = Math.atan2(yRootEdge - wormCenterY, -b2h / 2.0);
            const angR = Math.atan2(yRootEdge - wormCenterY, b2h / 2.0);
            ctx.arc(
                toX(wx),
                toY(wormCenterY),
                r3 * scale,
                -angL,
                -angR,
                signY > 0
            );
            ctx.lineTo(toX(wx + b2h / 2.0), toY(yBore));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Concave tip throat arc (radius r1)
            const v1 = Math.min(r1 * 0.9, (de2 - da2) / 2.0);
            const b1 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1))));
            const yTipEdge = wy + signY * (da2 / 2.0 + v1);
            const angTipL = Math.atan2(yTipEdge - wormCenterY, -b1);
            const angTipR = Math.atan2(yTipEdge - wormCenterY, b1);

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(toX(wx), toY(wormCenterY), r1 * scale, -angTipL, -angTipR, signY > 0);
            ctx.stroke();

            // Concave pitch throat arc (radius r2, dashed)
            const v2 = Math.min(r2 * 0.9, (de2 - dm2) / 2.0);
            const b2 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v2 * (2.0 * r2 - v2))));
            const yPitchEdge = wy + signY * (dm2 / 2.0 + v2);
            const angPitchL = Math.atan2(yPitchEdge - wormCenterY, -b2);
            const angPitchR = Math.atan2(yPitchEdge - wormCenterY, b2);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.arc(toX(wx), toY(wormCenterY), r2 * scale, -angPitchL, -angPitchR, signY > 0);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        ctx.restore();
    }

    drawWormCrossSection(ctx, cx, cy, scale, g) {
        ctx.save();
        ctx.translate(cx, cy);
        // Tip circle da1
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, (g.da1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pitch circle d1 (dashed)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, (g.d1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Root circle df1
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, (g.df1 / 2.0) * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    drawDimLine(ctx, x1, y1, x2, y2, label, offset) {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.fillStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        const mx = (x1 + x2) / 2.0;
        const my = (y1 + y2) / 2.0;
        ctx.textAlign = 'center';
        ctx.fillText(label, mx, my + (offset || -8));
        ctx.restore();
    }

    drawHUD(ctx, W, H, g) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.fillRect(14, 14, 305, 92);
        ctx.strokeRect(14, 14, 305, 92);

        const typeNames = ["", "ZA (Archimedean)", "ZN (Normal Straight)", "ZI (Involute)", "ZK (Cone Milled)", "ZH (Cavex Concave)"];
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(`TRỤC VÍT - BÁNH VÍT (${typeNames[g.toothType] || 'ZN'})`, 24, 34);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`z1 = ${g.z1} | z2 = ${g.z2} | i = ${g.i.toFixed(2)} | q = ${g.q.toFixed(3)}`, 24, 54);
        ctx.fillText(`mn = ${g.mn.toFixed(3)} mm | mx = ${g.mx.toFixed(3)} mm | γ = ${g.gama.toFixed(3)}°`, 24, 72);
        ctx.fillText(`a = ${g.a.toFixed(3)} mm | d1 = ${g.d1.toFixed(2)} | d2 = ${g.d2.toFixed(2)} | η = ${g.etages_pct.toFixed(2)}%`, 24, 90);
        ctx.restore();
    }

    // =========================================================================
    // 100% OFFLINE DXF RELEASE 12 (AC1009) EXPORTER (Exact DXF.bas Port)
    // =========================================================================
    exportDXF(mode = 'assembly_front') {
        if (!this.geom) return;
        const g = this.geom;
        const entities = [];

        const addLine = (x1, y1, x2, y2, layer = 'OUTLINE') => {
            entities.push(
                `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(6)}\n20\n${y1.toFixed(6)}\n30\n0.0\n11\n${x2.toFixed(6)}\n21\n${y2.toFixed(6)}\n31\n0.0`
            );
        };
        const addCircle = (cx, cy, r, layer = 'OUTLINE') => {
            entities.push(
                `0\nCIRCLE\n8\n${layer}\n10\n${cx.toFixed(6)}\n20\n${cy.toFixed(6)}\n30\n0.0\n40\n${r.toFixed(6)}`
            );
        };
        const addArc = (cx, cy, r, startDeg, endDeg, layer = 'OUTLINE') => {
            entities.push(
                `0\nARC\n8\n${layer}\n10\n${cx.toFixed(6)}\n20\n${cy.toFixed(6)}\n30\n0.0\n40\n${r.toFixed(6)}\n50\n${startDeg.toFixed(6)}\n51\n${endDeg.toFixed(6)}`
            );
        };
        const addText = (x, y, h, text, layer = 'TEXT') => {
            entities.push(
                `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(6)}\n20\n${y.toFixed(6)}\n30\n0.0\n40\n${h.toFixed(4)}\n1\n${text}`
            );
        };

        // Helper: Wheel(x1, y1, d1, d2, d3, d4, isWorm) from DXF.bas lines 232-246
        const dxfWheel = (x1, y1, d1, d2, d3, d4, isWorm) => {
            const lap = d1 * 0.08;
            addCircle(x1, y1, d1 / 2.0, 'OUTLINE');
            addCircle(x1, y1, d2 / 2.0, 'AXIS');
            addCircle(x1, y1, d3 / 2.0, isWorm ? 'OUTLINE' : 'INVISIBLE');
            if (!isWorm && d4 > 0) {
                addCircle(x1, y1, d4 / 2.0, 'INVISIBLE');
            }
            addLine(x1 - d1 / 2.0 - lap, y1, x1 + d1 / 2.0 + lap, y1, 'AXIS');
            addLine(x1, y1 - d1 / 2.0 - lap, x1, y1 + d1 / 2.0 + lap, 'AXIS');
        };

        // Helper: Worm(x1, y1) from DXF.bas lines 258-280
        const dxfWorm = (x1, y1) => {
            const { da1, d1, df1, l1, l2, L, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            addLine(x1 - l1, y1, x1 + l2, y1, 'AXIS');
            addLine(x1 - l1, y1 + df1 / 2.0, x1 - l1, y1 - df1 / 2.0, 'AXIS');
            addLine(x1 + l2, y1 + df1 / 2.0, x1 + l2, y1 - df1 / 2.0, 'AXIS');
            addLine(x1 - L / 2.0, y1 + d1 / 2.0, x1 + L / 2.0, y1 + d1 / 2.0, 'AXIS');
            addLine(x1 - L / 2.0, y1 - d1 / 2.0, x1 + L / 2.0, y1 - d1 / 2.0, 'AXIS');

            const miLine = (ax, ay, bx, by) => {
                addLine(ax, ay, bx, by, 'OUTLINE');
                addLine(ax, 2 * y1 - ay, bx, 2 * y1 - by, 'OUTLINE');
                addLine(2 * x1 - ax, ay, 2 * x1 - bx, by, 'OUTLINE');
                addLine(2 * x1 - ax, 2 * y1 - ay, 2 * x1 - bx, 2 * y1 - by, 'OUTLINE');
            };
            miLine(x1 - L / 2.0 - th, y1 + ds / 2.0, x1 - L / 2.0, y1 + ds / 2.0);
            miLine(x1 - L / 2.0 - th, y1 + ds / 2.0, x1 - L / 2.0 - th, y1);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1 - L / 2.0, y1);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1, y1 + df1 / 2.0);
            const tmp = Math.tan((DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
            miLine(x1 - L / 2.0, y1 + df1 / 2.0, x1 - L / 2.0 + tmp, y1 + da1 / 2.0);
            miLine(x1 - L / 2.0 + tmp, y1 + da1 / 2.0, x1, y1 + da1 / 2.0);
        };

        // Helper: WWheel(x1, y1) from DXF.bas lines 305-354
        const dxfWWheel = (x1, y1) => {
            const { da2, dm2, df2, b2H: b2h, a, mn: m } = g;
            const de2 = Math.max(g.de2, 1.001 * da2);
            addLine(x1, y1 + a, x1, y1 - a, 'AXIS');
            addLine(x1 - b2h / 2.0, y1, x1 + b2h / 2.0, y1, 'AXIS');
            addLine(x1 - m / 4.0, y1 + a, x1 + m / 4.0, y1 + a, 'AXIS');
            addLine(x1 - m / 4.0, y1 - a, x1 + m / 4.0, y1 - a, 'AXIS');

            const r1 = a - da2 / 2.0;
            const r2 = a - dm2 / 2.0;
            const r3 = a - df2 / 2.0;
            const v1 = Math.max(0.01, r1 - (a - de2 / 2.0));
            const v2 = Math.max(0.01, r2 - (a - de2 / 2.0));
            const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2h * b2h));
            const b1 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1))));
            const b2 = Math.min(b2h / 2.0, Math.sqrt(Math.max(0.0, v2 * (2.0 * r2 - v2))));
            const b4 = (b2h / 2.0) * (r1 / r3);

            // Top and bottom throat arcs & rim lines
            [-1, 1].forEach(sy => {
                const wy = y1 + sy * a;
                const deg1 = (Math.atan2(-sy * (r3 - v4), -b2h / 2.0) * 180.0) / Math.PI;
                const deg2 = (Math.atan2(-sy * (r3 - v4), b2h / 2.0) * 180.0) / Math.PI;
                addArc(x1, wy, r3, sy > 0 ? deg1 : deg2, sy > 0 ? deg2 : deg1, 'OUTLINE');

                const degT1 = (Math.atan2(-sy * (r1 - v1), -b1) * 180.0) / Math.PI;
                const degT2 = (Math.atan2(-sy * (r1 - v1), b1) * 180.0) / Math.PI;
                addArc(x1, wy, r1, sy > 0 ? degT1 : degT2, sy > 0 ? degT2 : degT1, 'OUTLINE');

                const degP1 = (Math.atan2(-sy * (r2 - v2), -b2) * 180.0) / Math.PI;
                const degP2 = (Math.atan2(-sy * (r2 - v2), b2) * 180.0) / Math.PI;
                addArc(x1, wy, r2, sy > 0 ? degP1 : degP2, sy > 0 ? degP2 : degP1, 'AXIS');

                addLine(x1 - b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 - b2h / 2.0, y1, 'OUTLINE');
                addLine(x1 + b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 + b2h / 2.0, y1, 'OUTLINE');
                addLine(x1 - b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 - b4, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 + b2h / 2.0, y1 + sy * (df2 / 2.0 + v4), x1 + b4, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 - b4, y1 + sy * (da2 / 2.0 + v1), x1 - b1, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
                addLine(x1 + b4, y1 + sy * (da2 / 2.0 + v1), x1 + b1, y1 + sy * (da2 / 2.0 + v1), 'OUTLINE');
            });
        };

        if (mode === 'worm_left') {
            dxfWheel(0, 0, g.da1, g.d1, g.df1, 0, true);
        } else if (mode === 'worm_front') {
            dxfWorm(0, 0);
        } else if (mode === 'gear_front') {
            dxfWheel(0, 0, g.de2, g.d2, g.da2, g.df2, false);
        } else if (mode === 'gear_left') {
            dxfWWheel(0, 0);
        } else if (mode === 'assembly_left') {
            dxfWheel(0, -g.a, g.da1, g.d1, g.df1, 0, true);
            dxfWWheel(0, 0);
        } else {
            // Default: assembly_front + assembly_left + parameter table
            dxfWheel(0, 0, g.de2, g.d2, g.da2, g.df2, false);
            dxfWorm(0, -g.a);
            const offsetX = g.chartData1.C9;
            dxfWheel(offsetX, -g.a, g.da1, g.d1, g.df1, 0, true);
            dxfWWheel(offsetX, 0);

            // Parameter table on the right
            const tx = offsetX + g.b2H + 40;
            let ty = g.de2 / 2.0;
            const rows = [
                `WORM GEARING PARAMETERS (DIN 3975 / DIN 3996)`,
                `Worm Type: ${g.toothType === 1 ? 'ZA' : 'ZN'} | z1 = ${g.z1} | z2 = ${g.z2} | i = ${g.i}`,
                `Module mn = ${g.mn.toFixed(4)} mm | mx = ${g.mx.toFixed(4)} mm`,
                `Pressure angle alfa0 = ${g.alfa0} deg | Lead angle gama = ${g.gama.toFixed(4)} deg`,
                `Center distance a = ${g.a.toFixed(3)} mm | x2 = ${g.x2.toFixed(4)}`,
                `Worm: d1 = ${g.d1.toFixed(3)} | da1 = ${g.da1.toFixed(3)} | df1 = ${g.df1.toFixed(3)} | L = ${g.L.toFixed(3)}`,
                `Wheel: d2 = ${g.d2.toFixed(3)} | da2 = ${g.da2.toFixed(3)} | df2 = ${g.df2.toFixed(3)} | de2 = ${g.de2.toFixed(3)} | b2H = ${g.b2H.toFixed(2)}`,
                `Materials: ${g.dxf_worm_mat} / ${g.dxf_wheel_mat}`
            ];
            rows.forEach((line) => {
                addText(tx, ty, 3.5, line);
                ty -= 8.0;
            });
        }

        const dxfString = [
            "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC",
            "0\nSECTION\n2\nENTITIES",
            entities.join("\n"),
            "0\nENDSEC\n0\nEOF\n"
        ].join("\n");

        const blob = new Blob([dxfString], { type: 'application/dxf' });
        const url = URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.href = url;
        aTag.download = `MITCalc_WormGear_${mode}_z${g.z1}x${g.z2}_m${g.mn.toFixed(2)}.dxf`;
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
        URL.revokeObjectURL(url);
    }
}

if (typeof window !== 'undefined') {
    window.WormCanvasRenderer = WormCanvasRenderer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WormCanvasRenderer;
}
