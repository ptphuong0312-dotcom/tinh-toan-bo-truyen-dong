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
        this.viewMode = 'assembly'; // 'assembly' | 'worm' | 'wheel' | 'normal_profile' | 'tangential_profile'
        this.showWorm = true;
        this.showWheel = true;
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
        } else if (this.viewMode === 'wheel') {
            this.renderWheelDetailView(ctx, W, H, g);
        } else if (this.viewMode === 'normal_profile') {
            this.renderNormalProfileView(ctx, W, H, g);
        } else if (this.viewMode === 'axial_profile') {
            this.renderAxialProfileView(ctx, W, H, g);
        } else if (this.viewMode === 'tangential_profile') {
            this.renderTangentialProfileView(ctx, W, H, g);
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
        if (this.showWheel) this.drawAnimatedWheelFront(ctx, toX(0), toY(0), scale, g);
        if (this.showWorm) this.drawHorizontalWormFront(ctx, toX, toY, scale, 0, -g.a, g);

        // 3. Right View: Worm Wheel Throat Section (exact DXF.bas WWheel) + Worm Cross Section at (C9, -a)
        if (this.showWheel) this.drawWheelThroatSection(ctx, toX, toY, scale, d1Chart.C9, 0, g);
        if (this.showWorm) this.drawWormCrossSection(ctx, toX(d1Chart.C9), toY(-g.a), scale, g);

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

    setWormVisible(visible) {
        this.showWorm = !!visible;
        this.render();
        return this.showWorm;
    }

    setWheelVisible(visible) {
        this.showWheel = !!visible;
        this.render();
        return this.showWheel;
    }

    toggleWormVisible() {
        return this.setWormVisible(!this.showWorm);
    }

    toggleWheelVisible() {
        return this.setWheelVisible(!this.showWheel);
    }

    renderNormalProfileView(ctx, W, H, g) {
        const mn = g.mn;
        const alfanRad = (g.toothType === 1
            ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0))
            : (g.alfa0 || 20) * Math.PI / 180.0);
        const alfanDeg = (alfanRad * 180.0) / Math.PI;

        const pn = Math.PI * mn;
        const sn = pn / 2.0;
        const en = pn / 2.0;
        const ha1 = (g.da1 - g.d1) / 2.0;
        const hf1 = (g.d1 - g.df1) / 2.0;
        const rhof0 = 0.38 * mn;

        const tanA = Math.tan(alfanRad);
        const san = Math.max(0.08 * mn, sn - 2.0 * ha1 * tanA);
        const yStock = -hf1 - 1.25 * mn;

        const xMinWorld = -2.4 * pn;
        const xMaxWorld = 2.4 * pn;
        const yMinWorld = yStock - 0.25 * mn;
        const yMaxWorld = ha1 + 1.25 * mn;

        const spanX = xMaxWorld - xMinWorld;
        const spanY = yMaxWorld - yMinWorld;
        const baseScale = Math.min((W * 0.82) / spanX, (H * 0.68) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = 0.0;
        const cyWorld = (yMinWorld + yMaxWorld) / 2.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        const teeth = [-2, -1, 0, 1, 2];

        // 1. Draw Body Fill & 45-deg Cross Hatching
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld), toY(yStock));
        ctx.lineTo(toX(xMinWorld), toY(-hf1));

        teeth.forEach(k => {
            const xk = k * pn;
            const xRootL = xk - sn / 2.0 - hf1 * tanA;
            const xRootR = xk + sn / 2.0 + hf1 * tanA;
            const xTipL = xk - san / 2.0;
            const xTipR = xk + san / 2.0;
            const nextRootL = (k + 1) * pn - sn / 2.0 - hf1 * tanA;

            ctx.lineTo(toX(xRootL - rhof0), toY(-hf1));
            ctx.arcTo(toX(xRootL), toY(-hf1), toX(xTipL), toY(ha1), rhof0 * scale);
            ctx.lineTo(toX(xTipL), toY(ha1));
            ctx.lineTo(toX(xTipR), toY(ha1));
            ctx.arcTo(toX(xRootR), toY(-hf1), toX(nextRootL), toY(-hf1), rhof0 * scale);
            ctx.lineTo(toX(nextRootL - rhof0), toY(-hf1));
        });

        ctx.lineTo(toX(xMaxWorld), toY(-hf1));
        ctx.lineTo(toX(xMaxWorld), toY(yStock));
        ctx.closePath();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();

        // 45-deg Hatch lines
        ctx.save();
        ctx.clip();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1.0;
        const hStep = 12 * Math.max(0.6, this.zoom);
        for (let d = -W - H; d <= W + H; d += hStep) {
            ctx.beginPath();
            ctx.moveTo(d, 0);
            ctx.lineTo(d + H, H);
            ctx.stroke();
        }
        ctx.restore();

        // Rack Outline
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.restore();

        // 2. Tooth Centerlines & Reference Lines
        ctx.save();
        teeth.forEach(k => {
            const xk = k * pn;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([8, 3, 2, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(xk), toY(yStock - 0.1 * mn));
            ctx.lineTo(toX(xk), toY(ha1 + 0.5 * mn));
            ctx.stroke();
        });

        // Pitch line (y = 0)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(0));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(0));
        ctx.stroke();

        // Tip line (y = ha1)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(ha1));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(ha1));
        ctx.stroke();

        // Root line (y = -hf1)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(xMinWorld - 0.2 * pn), toY(-hf1));
        ctx.lineTo(toX(xMaxWorld + 0.2 * pn), toY(-hf1));
        ctx.stroke();
        ctx.restore();

        // Text labels for lines
        ctx.save();
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`Đường chia danh nghĩa (Pitch Line y = 0)`, toX(xMaxWorld) - 12, toY(0) - 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Đường đỉnh răng (Tip Line y = +${ha1.toFixed(2)})`, toX(xMaxWorld) - 12, toY(ha1) - 5);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Đường chân răng (Root Line y = -${hf1.toFixed(2)})`, toX(xMaxWorld) - 12, toY(-hf1) + 12);
        ctx.restore();

        // 3. Dimensions
        if (this.showDims) {
            this.drawDimLine(ctx, toX(0), toY(ha1 + 0.45 * mn), toX(pn), toY(ha1 + 0.45 * mn), `pn = ${pn.toFixed(3)} mm`, -8);
            this.drawDimLine(ctx, toX(-sn / 2.0), toY(0), toX(sn / 2.0), toY(0), `sn = ${sn.toFixed(3)}`, -8);
            this.drawDimLine(ctx, toX(sn / 2.0), toY(0), toX(pn - sn / 2.0), toY(0), `en = ${en.toFixed(3)}`, -8);
            this.drawDimLine(ctx, toX(-1.5 * pn), toY(0), toX(-1.5 * pn), toY(ha1), `ha1 = ${ha1.toFixed(2)}`, -10);
            this.drawDimLine(ctx, toX(-1.5 * pn), toY(0), toX(-1.5 * pn), toY(-hf1), `hf1 = ${hf1.toFixed(2)}`, 14);

            // Pressure angle callout arc
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            const xPitchR = sn / 2.0;
            ctx.beginPath();
            ctx.arc(toX(xPitchR), toY(0), 22 * this.zoom, -Math.PI / 2.0, -Math.PI / 2.0 + alfanRad, false);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`αn = ${alfanDeg.toFixed(2)}°`, toX(xPitchR + 0.15 * mn), toY(0.25 * ha1));

            // Fillet radius callout
            const xRootR0 = sn / 2.0 + hf1 * tanA;
            ctx.strokeStyle = '#a855f7';
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(toX(xRootR0 + rhof0 * 0.3), toY(-hf1 + rhof0 * 0.3));
            ctx.lineTo(toX(xRootR0 + 0.6 * mn), toY(-hf1 + 0.75 * mn));
            ctx.stroke();
            ctx.fillText(`ρf0 = ${rhof0.toFixed(2)} (0.38 mn)`, toX(xRootR0 + 0.65 * mn), toY(-hf1 + 0.8 * mn));
            ctx.restore();
        }
    }

    renderAxialProfileView(ctx, W, H, g) {
        const mx = g.mx;
        const px = g.px;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;
        const alfaxDeg = g.alfax;
        const gama = g.gama;
        const sx = g.sx1;
        const d1 = g.d1;
        const da1 = g.da1;
        const df1 = g.df1;
        const ha1 = (da1 - d1) / 2.0;
        const hf1 = (d1 - df1) / 2.0;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const L = g.L;
        const l1 = g.l1;
        const l2 = g.l2;
        const beta = g.DXF_Beta;

        const tanAx = Math.tan(alfaxRad);
        const sa1 = Math.max(0.08 * mx, sx - 2.0 * ha1 * tanAx);

        const minX = -l1 - 12.0;
        const maxX = l2 + 12.0;
        const minY = -da1 * 0.68;
        const maxY = da1 * 0.68;

        const spanX = maxX - minX;
        const spanY = maxY - minY;
        const baseScale = Math.min((W * 0.84) / spanX, (H * 0.72) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wy) => cyScr - (wy - cyWorld) * scale;

        // 1. Centerline along worm axis y = 0
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        // 2. Shaft core, extensions & shoulders
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        // Left shaft extension
        ctx.strokeRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        ctx.fillRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        // Right shaft extension
        ctx.strokeRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        ctx.fillRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        // Shoulders
        ctx.strokeRect(toX(-L / 2.0 - th), toY(df1 / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(-L / 2.0 - th), toY(-ds / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(df1 / 2.0), th * scale, (df1 - ds) * 0.5 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(-ds / 2.0), th * scale, (df1 - ds) * 0.5 * scale);

        // Core cylinder (-L/2 to +L/2, -df1/2 to +df1/2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(toX(-L / 2.0), toY(df1 / 2.0), L * scale, df1 * scale);
        ctx.fillRect(toX(-L / 2.0), toY(df1 / 2.0), L * scale, df1 * scale);
        ctx.restore();

        // 3. Teeth on Upper Flank (+y) and Lower Flank (-y)
        const ch = Math.tan((beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
        const nP = Math.ceil(L / px) + 2;

        const drawRackHalf = (signY, shiftX) => {
            ctx.save();
            ctx.beginPath();
            if (signY > 0) {
                ctx.moveTo(toX(-L / 2.0), toY(df1 / 2.0));
                ctx.lineTo(toX(-L / 2.0 + ch), toY(da1 / 2.0));
                ctx.lineTo(toX(L / 2.0 - ch), toY(da1 / 2.0));
                ctx.lineTo(toX(L / 2.0), toY(df1 / 2.0));
            } else {
                ctx.moveTo(toX(-L / 2.0), toY(-df1 / 2.0));
                ctx.lineTo(toX(-L / 2.0 + ch), toY(-da1 / 2.0));
                ctx.lineTo(toX(L / 2.0 - ch), toY(-da1 / 2.0));
                ctx.lineTo(toX(L / 2.0), toY(-df1 / 2.0));
            }
            ctx.closePath();
            ctx.clip();

            ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;

            for (let k = -nP; k <= nP; k++) {
                const xc = k * px + shiftX;
                const xL_flank = xc - sa1 / 2.0;
                const xR_flank = xc + sa1 / 2.0;
                const xL_root = xc - sx / 2.0 - hf1 * tanAx;
                const xR_root = xc + sx / 2.0 + hf1 * tanAx;

                ctx.beginPath();
                if (signY > 0) {
                    ctx.moveTo(toX(xL_root), toY(df1 / 2.0));
                    ctx.lineTo(toX(xL_flank), toY(da1 / 2.0));
                    ctx.lineTo(toX(xR_flank), toY(da1 / 2.0));
                    ctx.lineTo(toX(xR_root), toY(df1 / 2.0));
                } else {
                    ctx.moveTo(toX(xL_root), toY(-df1 / 2.0));
                    ctx.lineTo(toX(xL_flank), toY(-da1 / 2.0));
                    ctx.lineTo(toX(xR_flank), toY(-da1 / 2.0));
                    ctx.lineTo(toX(xR_root), toY(-df1 / 2.0));
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Cross-hatching for teeth
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.0;
            const hStep = 10 * Math.max(0.6, this.zoom);
            for (let d = -W - H; d <= W + H; d += hStep) {
                ctx.beginPath();
                ctx.moveTo(d, 0);
                ctx.lineTo(d + H, H);
                ctx.stroke();
            }
            ctx.restore();
        };

        // Draw upper teeth (shiftX = 0)
        drawRackHalf(1, 0);
        // Draw lower teeth (shiftX = px/2 for odd z1)
        const botShift = (g.z1 % 2 === 1) ? px / 2.0 : 0.0;
        drawRackHalf(-1, botShift);

        // 4. Reference lines: Pitch lines (d1/2), Tip lines (da1/2), Root lines (df1/2)
        ctx.save();
        ctx.lineWidth = 1.1;

        // Pitch lines
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(d1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(d1 / 2.0));
        ctx.moveTo(toX(-L / 2.0), toY(-d1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(-d1 / 2.0));
        ctx.stroke();

        // Tip lines
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0 + ch), toY(da1 / 2.0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(da1 / 2.0));
        ctx.moveTo(toX(-L / 2.0 + ch), toY(-da1 / 2.0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-da1 / 2.0));
        ctx.stroke();

        // Root lines
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(df1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(df1 / 2.0));
        ctx.moveTo(toX(-L / 2.0), toY(-df1 / 2.0));
        ctx.lineTo(toX(L / 2.0), toY(-df1 / 2.0));
        ctx.stroke();
        ctx.restore();

        // 5. Dimension Callouts
        if (this.showDims) {
            this.drawDimLine(ctx, toX(-L / 2.0), toY(da1 / 2.0 + 8.0), toX(L / 2.0), toY(da1 / 2.0 + 8.0), `L = ${L.toFixed(2)} mm`, -10);
            this.drawDimLine(ctx, toX(-L / 2.0 - th - 12.0), toY(-da1 / 2.0), toX(-L / 2.0 - th - 12.0), toY(da1 / 2.0), `da1 = ${da1.toFixed(2)}`, -14);
            this.drawDimLine(ctx, toX(L / 2.0 + th + 12.0), toY(-d1 / 2.0), toX(L / 2.0 + th + 12.0), toY(d1 / 2.0), `d1 = ${d1.toFixed(2)}`, 14);
            this.drawDimLine(ctx, toX(L / 2.0 + th + 24.0), toY(-df1 / 2.0), toX(L / 2.0 + th + 24.0), toY(df1 / 2.0), `df1 = ${df1.toFixed(2)}`, 14);
            this.drawDimLine(ctx, toX(0), toY(da1 / 2.0 + 3.0), toX(px), toY(da1 / 2.0 + 3.0), `px = ${px.toFixed(3)} mm`, -8);
            this.drawDimLine(ctx, toX(-sx / 2.0), toY(d1 / 2.0), toX(sx / 2.0), toY(d1 / 2.0), `sx = ${sx.toFixed(3)}`, -10);

            // Pressure angle callout arc on tooth +1
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(toX(px), toY(d1 / 2.0), 16 * this.zoom, -Math.PI / 2.0, -Math.PI / 2.0 + alfaxRad, false);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`αx = ${alfaxDeg.toFixed(2)}°`, toX(px + 0.15 * mx), toY(d1 / 2.0 + 0.35 * ha1));
            ctx.restore();
        }
    }

    renderTangentialProfileView(ctx, W, H, g) {
        const mx = g.mx;
        const mn = g.mn;
        const px = g.px;
        const pn = Math.PI * mn;
        const alfaxRad = (g.alfax * Math.PI) / 180.0;
        const alfaxDeg = g.alfax;
        const gama = g.gama;
        const gamaRad = (gama * Math.PI) / 180.0;
        const sx = g.sx1;
        const sn = pn / 2.0;
        const d1 = g.d1;
        const da1 = g.da1;
        const df1 = g.df1;
        const ha1 = (da1 - d1) / 2.0;
        const ds = g.Shaft_ds;
        const th = g.Shaft_th;
        const L = g.L;
        const l1 = g.l1;
        const l2 = g.l2;
        const beta = g.DXF_Beta || 15.0;

        // Tangent Plane slice width at y = d1/2
        const r1 = d1 / 2.0;
        const ra1 = da1 / 2.0;
        const wt = Math.sqrt(Math.max(0, ra1 * ra1 - r1 * r1)); // half chord
        const bt = 2.0 * wt; // total chord width of tangent cut
        const tanAx = Math.tan(alfaxRad);
        const tanGama = Math.tan(gamaRad);

        const minX = -l1 - 12.0;
        const maxX = l2 + 12.0;
        const minY = -Math.max(da1 / 2.0, wt * 1.35) * 1.15;
        const maxY = Math.max(da1 / 2.0, wt * 1.35) * 1.15;

        const spanX = maxX - minX;
        const spanY = maxY - minY;
        const baseScale = Math.min((W * 0.84) / spanX, (H * 0.72) / spanY);
        const scale = baseScale * this.zoom;

        const cxWorld = (minX + maxX) / 2.0;
        const cyWorld = 0.0;
        const cxScr = W / 2.0 + this.panX;
        const cyScr = H / 2.0 + this.panY;

        const toX = (wx) => cxScr + (wx - cxWorld) * scale;
        const toY = (wz) => cyScr - (wz - cyWorld) * scale;

        // 1. Ghost Background: Worm Outline in Top View (Shaft extensions & Body cylinder)
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.04)';
        ctx.lineWidth = 1.0;
        // Shaft extension left
        ctx.strokeRect(toX(-l1), toY(ds / 2.0), (l1 - L / 2.0 - th) * scale, ds * scale);
        // Shaft extension right
        ctx.strokeRect(toX(L / 2.0 + th), toY(ds / 2.0), (l2 - L / 2.0 - th) * scale, ds * scale);
        // Shoulders
        ctx.strokeRect(toX(-L / 2.0 - th), toY(df1 / 2.0), th * scale, df1 * scale);
        ctx.strokeRect(toX(L / 2.0), toY(df1 / 2.0), th * scale, df1 * scale);
        // Tip cylinder projection (ghost boundary)
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(toX(-L / 2.0), toY(da1 / 2.0), L * scale, da1 * scale);
        ctx.restore();

        // 2. Central Tangent Cut Band: [-L/2, L/2] x [-wt, wt]
        const ch = Math.tan((beta * Math.PI) / 180.0) * ha1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(0));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.lineTo(toX(L / 2.0), toY(0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.closePath();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();

        // 3. Centerline along worm axis / Pitch generator line at Z = 0
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([10, 4, 2, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(minX), toY(0));
        ctx.lineTo(toX(maxX), toY(0));
        ctx.stroke();
        ctx.restore();

        // 4. Helical Teeth Ribbons on Tangent Plane
        const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;
        const nP = Math.ceil(L / px) + 2;

        ctx.save();
        // Clip to Tangent Cut Band
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0), toY(0));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.lineTo(toX(L / 2.0), toY(0));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.lineTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.closePath();
        ctx.clip();

        const numZSteps = 16;
        for (let k = -nP; k <= nP; k++) {
            const xk = k * px;
            const ptsR = [];
            const ptsL = [];

            for (let i = 0; i <= numZSteps; i++) {
                const zVal = -wt + (2.0 * wt * i) / numZSteps;
                const rz = Math.sqrt(r1 * r1 + zVal * zVal);
                const deltaR = Math.max(0, rz - r1);
                const sxz = Math.max(0.08 * mx, sx - 2.0 * deltaR * tanAx);
                const xc = xk + handSign * zVal * tanGama;
                ptsR.push({ x: xc + sxz / 2.0, z: zVal });
                ptsL.push({ x: xc - sxz / 2.0, z: zVal });
            }

            // Draw tooth polygon
            ctx.beginPath();
            ptsR.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(toX(pt.x), toY(pt.z));
                else ctx.lineTo(toX(pt.x), toY(pt.z));
            });
            for (let i = ptsL.length - 1; i >= 0; i--) {
                ctx.lineTo(toX(ptsL[i].x), toY(ptsL[i].z));
            }
            ctx.closePath();

            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Pitch point on generator line Z = 0
            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(toX(xk), toY(0), 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // 45-degree Hatching across all teeth in tangent cut
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1.0;
        const hStep = 10 * Math.max(0.6, this.zoom);
        for (let d = -W - H; d <= W + H; d += hStep) {
            ctx.beginPath();
            ctx.moveTo(d, 0);
            ctx.lineTo(d + H, H);
            ctx.stroke();
        }
        ctx.restore();
        ctx.restore(); // end clip

        // 5. Tangent Band Limit Lines (Z = +wt and Z = -wt)
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(-L / 2.0 + ch), toY(wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(wt));
        ctx.moveTo(toX(-L / 2.0 + ch), toY(-wt));
        ctx.lineTo(toX(L / 2.0 - ch), toY(-wt));
        ctx.stroke();
        ctx.restore();

        // 6. Dimensions and Callouts
        if (this.showDims) {
            // Total Length L
            this.drawDimLine(ctx, toX(-L / 2.0), toY(wt + 8.0), toX(L / 2.0), toY(wt + 8.0), `L = ${L.toFixed(2)} mm`, -10);

            // Contact Width Bt
            this.drawDimLine(ctx, toX(-L / 2.0 - th - 12.0), toY(-wt), toX(-L / 2.0 - th - 12.0), toY(wt), `Bt = ${bt.toFixed(2)} mm`, -14);

            // Axial Pitch px along generator line
            this.drawDimLine(ctx, toX(0), toY(0), toX(px), toY(0), `px = ${px.toFixed(3)} mm`, 14);

            // Axial Tooth Thickness sx
            this.drawDimLine(ctx, toX(-sx / 2.0), toY(0), toX(sx / 2.0), toY(0), `sx = ${sx.toFixed(3)}`, -14);

            // Lead angle callout arc
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(toX(0), toY(0));
            ctx.lineTo(toX(0), toY(wt * 0.9));
            ctx.stroke();

            const arcR = 24 * this.zoom;
            ctx.beginPath();
            ctx.arc(toX(0), toY(0), arcR, -Math.PI / 2.0, -Math.PI / 2.0 + handSign * gamaRad, handSign < 0);
            ctx.stroke();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`γ = ${gama.toFixed(2)}°`, toX(handSign * arcR * 0.7), toY(wt * 0.45));
            ctx.restore();
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

            // Chamfer and flat lands on the wheel rim (responsive in real-time)
            const b4 = g.DXF_WheelChamfer_b4 !== undefined ? g.DXF_WheelChamfer_b4 : ((b2h / 2.0) * (r1 / r3));
            ctx.beginPath();
            // Left flat rim & chamfer
            ctx.moveTo(toX(wx - b1), toY(yTipEdge));
            ctx.lineTo(toX(wx - b4), toY(yTipEdge));
            ctx.lineTo(toX(wx - b2h / 2.0), toY(yRootEdge));

            // Right flat rim & chamfer
            ctx.moveTo(toX(wx + b1), toY(yTipEdge));
            ctx.lineTo(toX(wx + b4), toY(yTipEdge));
            ctx.lineTo(toX(wx + b2h / 2.0), toY(yRootEdge));
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
        ctx.fillRect(14, 14, 345, 96);
        ctx.strokeRect(14, 14, 345, 96);

        const typeNames = ["", "ZA (Archimedean)", "ZN (Normal Straight)", "ZI (Involute)", "ZK (Cone Milled)", "ZH (Cavex Concave)"];
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';

        if (this.viewMode === 'normal_profile') {
            ctx.fillText(`MẶT CẮT PHÁP TUYẾN BIÊN DẠNG RĂNG (N-N)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            const alfan = (g.toothType === 1
                ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0)) * 180 / Math.PI
                : (g.alfa0 || 20));
            ctx.fillText(`mn = ${g.mn.toFixed(3)} mm | αn = ${alfan.toFixed(2)}° | pn = ${(Math.PI * g.mn).toFixed(3)} mm`, 24, 54);
            ctx.fillText(`sn = ${(Math.PI * g.mn / 2).toFixed(3)} mm | ha1 = ${((g.da1 - g.d1)/2).toFixed(3)} | hf1 = ${((g.d1 - g.df1)/2).toFixed(3)} mm`, 24, 72);
            ctx.fillText(`ρf0 = ${(0.38 * g.mn).toFixed(3)} mm (0.38 mn) | Kiểu ren: ${typeNames[g.toothType] || 'ZN'}`, 24, 90);
        } else if (this.viewMode === 'axial_profile') {
            ctx.fillText(`MẶT CẮT DỌC TRỤC TRỤC VÍT (A-A)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`mx = ${g.mx.toFixed(3)} mm | αx = ${g.alfax.toFixed(2)}° | γ = ${g.gama.toFixed(3)}°`, 24, 54);
            ctx.fillText(`px = ${g.px.toFixed(3)} mm | sx = ${g.sx1.toFixed(3)} mm | L = ${g.L.toFixed(2)} mm`, 24, 72);
            ctx.fillText(`d1 = ${g.d1.toFixed(2)} mm | da1 = ${g.da1.toFixed(2)} mm | df1 = ${g.df1.toFixed(2)} mm`, 24, 90);
        } else if (this.viewMode === 'tangential_profile') {
            const wt = 0.5 * Math.sqrt(Math.max(0, g.da1 * g.da1 - g.d1 * g.d1));
            const bt = 2.0 * wt;
            ctx.fillText(`MẶT CẮT TIẾP TUYẾN MẶT TRỤ CHIA (T-T)`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`Mặt phẳng y = d1/2 (${(g.d1/2).toFixed(2)} mm) tiếp xúc mặt trụ chia | Bề rộng tiếp xúc Bt = ${bt.toFixed(2)} mm`, 24, 54);
            ctx.fillText(`γ = ${g.gama.toFixed(3)}° | px = ${g.px.toFixed(3)} mm | pn = ${(Math.PI * g.mn).toFixed(3)} mm`, 24, 72);
            ctx.fillText(`sx = ${g.sx1.toFixed(3)} mm | sn = ${(Math.PI * g.mn / 2).toFixed(3)} mm | L = ${g.L.toFixed(2)} mm`, 24, 90);
        } else {
            ctx.fillText(`TRỤC VÍT - BÁNH VÍT (${typeNames[g.toothType] || 'ZN'})`, 24, 34);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`z1 = ${g.z1} | z2 = ${g.z2} | i = ${g.i.toFixed(2)} | q = ${g.q.toFixed(3)}`, 24, 54);
            ctx.fillText(`mn = ${g.mn.toFixed(3)} mm | mx = ${g.mx.toFixed(3)} mm | γ = ${g.gama.toFixed(3)}°`, 24, 72);
            ctx.fillText(`a = ${g.a.toFixed(3)} mm | d1 = ${g.d1.toFixed(2)} | d2 = ${g.d2.toFixed(2)} | η = ${g.etages_pct.toFixed(2)}%`, 24, 90);
        }
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
            const b4 = g.DXF_WheelChamfer_b4 !== undefined ? g.DXF_WheelChamfer_b4 : ((b2h / 2.0) * (r1 / r3));

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

        if (mode === 'normal_profile') {
            const mn = g.mn;
            const alfanRad = (g.toothType === 1
                ? Math.atan(Math.tan((g.alfax || 20) * Math.PI / 180.0) * Math.cos((g.gama || 0) * Math.PI / 180.0))
                : (g.alfa0 || 20) * Math.PI / 180.0);
            const alfanDeg = (alfanRad * 180.0) / Math.PI;
            const pn = Math.PI * mn;
            const sn = pn / 2.0;
            const en = pn / 2.0;
            const ha1 = (g.da1 - g.d1) / 2.0;
            const hf1 = (g.d1 - g.df1) / 2.0;
            const rhof0 = 0.38 * mn;
            const tanA = Math.tan(alfanRad);
            const sinA = Math.sin(alfanRad);
            const cosA = Math.cos(alfanRad);
            const san = Math.max(0.08 * mn, sn - 2.0 * ha1 * tanA);
            const yStock = -hf1 - 1.5 * mn;

            const xL = -2.5 * pn;
            const xR = 2.5 * pn;
            addLine(xL, 0, xR, 0, 'PITCH_LINE');
            addLine(xL, ha1, xR, ha1, 'LIMIT_LINES');
            addLine(xL, -hf1, xR, -hf1, 'LIMIT_LINES');
            addLine(xL, yStock, xR, yStock, 'OUTLINE');
            addLine(xL, yStock, xL, -hf1, 'OUTLINE');
            addLine(xR, yStock, xR, -hf1, 'OUTLINE');

            const teeth = [-2, -1, 0, 1, 2];
            teeth.forEach(k => {
                const xk = k * pn;
                addLine(xk, yStock, xk, ha1 + mn * 0.5, 'AXIS');

                const xRootL = xk - sn / 2.0 - hf1 * tanA;
                const xRootR = xk + sn / 2.0 + hf1 * tanA;
                const xTipL = xk - san / 2.0;
                const xTipR = xk + san / 2.0;

                const xcL = xRootL - rhof0 * ((1.0 - sinA) / cosA);
                const xcR = xRootR + rhof0 * ((1.0 - sinA) / cosA);
                const xtL = xRootL + rhof0 * (1.0 - sinA) * tanA;
                const xtR = xRootR - rhof0 * (1.0 - sinA) * tanA;
                const ytL = -hf1 + rhof0 * (1.0 - sinA);
                const ytR = -hf1 + rhof0 * (1.0 - sinA);

                // Flanks & Tip
                addLine(xtL, ytL, xTipL, ha1, 'OUTLINE');
                addLine(xTipL, ha1, xTipR, ha1, 'OUTLINE');
                addLine(xTipR, ha1, xtR, ytR, 'OUTLINE');

                // Fillet arcs
                addArc(xcL, -hf1 + rhof0, rhof0, 270.0, 360.0 - alfanDeg, 'OUTLINE');
                addArc(xcR, -hf1 + rhof0, rhof0, 180.0 + alfanDeg, 270.0, 'OUTLINE');

                // Root land between teeth
                if (k < 2) {
                    const nextXk = (k + 1) * pn;
                    const nextXRootL = nextXk - sn / 2.0 - hf1 * tanA;
                    const nextXcL = nextXRootL - rhof0 * ((1.0 - sinA) / cosA);
                    addLine(xcR, -hf1, nextXcL, -hf1, 'OUTLINE');
                }
            });

            // Dimensions on DIMS layer
            addLine(-pn / 2.0, ha1 + mn * 0.4, pn / 2.0, ha1 + mn * 0.4, 'DIMS');
            addText(0, ha1 + mn * 0.45, mn * 0.28, `pn = ${pn.toFixed(4)} mm`, 'DIMS');

            addLine(-sn / 2.0, 0, sn / 2.0, 0, 'DIMS');
            addText(0, mn * 0.15, mn * 0.26, `sn = ${sn.toFixed(4)} mm`, 'DIMS');

            addLine(-1.6 * pn, 0, -1.6 * pn, ha1, 'DIMS');
            addText(-1.6 * pn - mn * 0.8, ha1 / 2.0, mn * 0.26, `ha1 = ${ha1.toFixed(3)} mm`, 'DIMS');

            addLine(-1.6 * pn, 0, -1.6 * pn, -hf1, 'DIMS');
            addText(-1.6 * pn - mn * 0.8, -hf1 / 2.0, mn * 0.26, `hf1 = ${hf1.toFixed(3)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = xR + mn * 1.5;
            let tblY = ha1 + mn * 0.8;
            const rows = [
                `WORM NORMAL TOOTH PROFILE (DIN 3975 / DIN 3996)`,
                `Normal Module mn: ${mn.toFixed(4)} mm`,
                `Normal Pressure Angle alfan: ${alfanDeg.toFixed(4)} deg`,
                `Normal Pitch pn: ${pn.toFixed(4)} mm`,
                `Normal Tooth Thickness sn: ${sn.toFixed(4)} mm`,
                `Normal Space Width en: ${en.toFixed(4)} mm`,
                `Addendum ha1: ${ha1.toFixed(3)} mm`,
                `Dedendum hf1: ${hf1.toFixed(3)} mm`,
                `Whole Tooth Depth h1: ${(ha1 + hf1).toFixed(3)} mm`,
                `Root Fillet Radius rhof0: ${rhof0.toFixed(3)} mm (0.38*mn)`,
                `Tip Land Width san: ${san.toFixed(3)} mm`,
                `Root Land Width efn: ${(en - 2.0 * hf1 * tanA).toFixed(3)} mm`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, mn * 0.30, r, 'MFG_TABLE');
                tblY -= mn * 0.58;
            });
        } else if (mode === 'axial_profile') {
            const { mx, px, alfax, gama, sx1: sx, da1, d1, df1, L, l1, l2, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            const ha1 = (da1 - d1) / 2.0;
            const hf1 = (d1 - df1) / 2.0;
            const alfaxRad = (alfax * Math.PI) / 180.0;
            const tanAx = Math.tan(alfaxRad);
            const sa1 = Math.max(0.08 * mx, sx - 2.0 * ha1 * tanAx);

            // Centerline
            addLine(-l1 - 5, 0, l2 + 5, 0, 'AXIS');

            // Pitch lines
            addLine(-L / 2.0, d1 / 2.0, L / 2.0, d1 / 2.0, 'PITCH_LINE');
            addLine(-L / 2.0, -d1 / 2.0, L / 2.0, -d1 / 2.0, 'PITCH_LINE');

            // Tip & Root lines
            addLine(-L / 2.0, da1 / 2.0, L / 2.0, da1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, -da1 / 2.0, L / 2.0, -da1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, df1 / 2.0, L / 2.0, df1 / 2.0, 'LIMIT_LINES');
            addLine(-L / 2.0, -df1 / 2.0, L / 2.0, -df1 / 2.0, 'LIMIT_LINES');

            // Shaft shoulders and extensions
            addLine(-l1, ds / 2.0, -L / 2.0 - th, ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -L / 2.0 - th, -ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -l1, ds / 2.0, 'OUTLINE');

            addLine(L / 2.0 + th, ds / 2.0, l2, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, l2, -ds / 2.0, 'OUTLINE');
            addLine(l2, -ds / 2.0, l2, ds / 2.0, 'OUTLINE');

            // Shoulders
            addLine(-L / 2.0 - th, ds / 2.0, -L / 2.0 - th, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -ds / 2.0, -L / 2.0 - th, -df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, df1 / 2.0, -L / 2.0, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -df1 / 2.0, -L / 2.0, -df1 / 2.0, 'OUTLINE');

            addLine(L / 2.0, df1 / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');

            // End chamfers
            const ch = Math.tan((DXF_Beta * Math.PI) / 180.0) * ((da1 - df1) / 2.0);
            addLine(-L / 2.0, df1 / 2.0, -L / 2.0 + ch, da1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, df1 / 2.0, L / 2.0 - ch, da1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0, -df1 / 2.0, -L / 2.0 + ch, -da1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 - ch, -da1 / 2.0, 'OUTLINE');

            // Upper & Lower teeth along [-L/2 + ch, L/2 - ch]
            const nP = Math.ceil(L / px) + 1;
            for (let k = -nP; k <= nP; k++) {
                const xcTop = k * px;
                const xL_flank = xcTop - sa1 / 2.0;
                const xR_flank = xcTop + sa1 / 2.0;
                const xL_root = xcTop - sx / 2.0 - hf1 * tanAx;
                const xR_root = xcTop + sx / 2.0 + hf1 * tanAx;

                if (xL_root >= -L / 2.0 && xR_root <= L / 2.0) {
                    addLine(xL_root, df1 / 2.0, xL_flank, da1 / 2.0, 'OUTLINE');
                    addLine(xL_flank, da1 / 2.0, xR_flank, da1 / 2.0, 'OUTLINE');
                    addLine(xR_flank, da1 / 2.0, xR_root, df1 / 2.0, 'OUTLINE');
                }

                const xcBot = xcTop + (g.z1 % 2 === 1 ? px / 2.0 : 0.0);
                const xL_bflank = xcBot - sa1 / 2.0;
                const xR_bflank = xcBot + sa1 / 2.0;
                const xL_broot = xcBot - sx / 2.0 - hf1 * tanAx;
                const xR_broot = xcBot + sx / 2.0 + hf1 * tanAx;

                if (xL_broot >= -L / 2.0 && xR_broot <= L / 2.0) {
                    addLine(xL_broot, -df1 / 2.0, xL_bflank, -da1 / 2.0, 'OUTLINE');
                    addLine(xL_bflank, -da1 / 2.0, xR_bflank, -da1 / 2.0, 'OUTLINE');
                    addLine(xR_bflank, -da1 / 2.0, xR_broot, -df1 / 2.0, 'OUTLINE');
                }
            }

            // Dimensions on DIMS layer
            addLine(-L / 2.0, da1 / 2.0 + 8, L / 2.0, da1 / 2.0 + 8, 'DIMS');
            addText(0, da1 / 2.0 + 10, 3.5, `L = ${L.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 15, -da1 / 2.0, -L / 2.0 - 15, da1 / 2.0, 'DIMS');
            addText(-L / 2.0 - 25, 0, 3.5, `da1 = ${da1.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 8, -d1 / 2.0, -L / 2.0 - 8, d1 / 2.0, 'DIMS');
            addText(-L / 2.0 - 12, 0, 3.0, `d1 = ${d1.toFixed(3)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = l2 + 15;
            let tblY = da1 / 2.0 + 8;
            const rows = [
                `WORM AXIAL TOOTH PROFILE A-A (DIN 3975)`,
                `Axial Module mx: ${mx.toFixed(4)} mm`,
                `Axial Pressure Angle alfax: ${alfax.toFixed(4)} deg`,
                `Lead Angle gama: ${gama.toFixed(4)} deg`,
                `Axial Pitch px: ${px.toFixed(4)} mm`,
                `Axial Tooth Thickness sx: ${sx.toFixed(4)} mm`,
                `Pitch Diameter d1: ${d1.toFixed(3)} mm`,
                `Tip Diameter da1: ${da1.toFixed(3)} mm`,
                `Root Diameter df1: ${df1.toFixed(3)} mm`,
                `Worm Thread Length L: ${L.toFixed(3)} mm`,
                `Shaft Shoulder Diameter ds: ${ds.toFixed(2)} mm`,
                `End Chamfer Angle: ${DXF_Beta} deg`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, 3.2, r, 'MFG_TABLE');
                tblY -= 6.5;
            });
        } else if (mode === 'tangential_profile') {
            const { mx, mn, px, alfax, gama, sx1: sx, da1, d1, df1, L, l1, l2, Shaft_ds: ds, Shaft_th: th, DXF_Beta } = g;
            const pn = Math.PI * mn;
            const sn = pn / 2.0;
            const alfaxRad = (alfax * Math.PI) / 180.0;
            const gamaRad = (gama * Math.PI) / 180.0;
            const tanAx = Math.tan(alfaxRad);
            const tanGama = Math.tan(gamaRad);
            const r1 = d1 / 2.0;
            const ra1 = da1 / 2.0;
            const wt = Math.sqrt(Math.max(0, ra1 * ra1 - r1 * r1));
            const bt = 2.0 * wt;
            const beta = DXF_Beta || 15.0;
            const ch = Math.tan((beta * Math.PI) / 180.0) * ((da1 - d1) / 2.0);
            const handSign = (parseInt(g.teethOrientation) === 2) ? -1.0 : 1.0;

            // 1. Centerline along worm axis / Pitch generator line (y = d1/2)
            addLine(-l1 - 5, 0, l2 + 5, 0, 'AXIS');

            // 2. Tangent Cut Boundary Lines (Z = +wt and Z = -wt)
            addLine(-L / 2.0 + ch, wt, L / 2.0 - ch, wt, 'LIMIT_LINES');
            addLine(-L / 2.0 + ch, -wt, L / 2.0 - ch, -wt, 'LIMIT_LINES');
            addLine(-L / 2.0, 0, -L / 2.0 + ch, wt, 'LIMIT_LINES');
            addLine(-L / 2.0, 0, -L / 2.0 + ch, -wt, 'LIMIT_LINES');
            addLine(L / 2.0, 0, L / 2.0 - ch, wt, 'LIMIT_LINES');
            addLine(L / 2.0, 0, L / 2.0 - ch, -wt, 'LIMIT_LINES');

            // Ghost outer cylinder bounds
            addLine(-L / 2.0, da1 / 2.0, L / 2.0, da1 / 2.0, 'PITCH_LINE');
            addLine(-L / 2.0, -da1 / 2.0, L / 2.0, -da1 / 2.0, 'PITCH_LINE');

            // Shaft shoulders and extensions
            addLine(-l1, ds / 2.0, -L / 2.0 - th, ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -L / 2.0 - th, -ds / 2.0, 'OUTLINE');
            addLine(-l1, -ds / 2.0, -l1, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, l2, ds / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, l2, -ds / 2.0, 'OUTLINE');
            addLine(l2, -ds / 2.0, l2, ds / 2.0, 'OUTLINE');

            // Shoulders
            addLine(-L / 2.0 - th, ds / 2.0, -L / 2.0 - th, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -ds / 2.0, -L / 2.0 - th, -df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, df1 / 2.0, -L / 2.0, df1 / 2.0, 'OUTLINE');
            addLine(-L / 2.0 - th, -df1 / 2.0, -L / 2.0, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, df1 / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0, -df1 / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, ds / 2.0, L / 2.0 + th, df1 / 2.0, 'OUTLINE');
            addLine(L / 2.0 + th, -ds / 2.0, L / 2.0 + th, -df1 / 2.0, 'OUTLINE');

            // 3. Teeth ribbons across tangent plane
            const nP = Math.ceil(L / px) + 2;
            const numSteps = 10;
            for (let k = -nP; k <= nP; k++) {
                const xk = k * px;
                const ptsR = [];
                const ptsL = [];

                for (let i = 0; i <= numSteps; i++) {
                    const zVal = -wt + (2.0 * wt * i) / numSteps;
                    const rz = Math.sqrt(r1 * r1 + zVal * zVal);
                    const deltaR = Math.max(0, rz - r1);
                    const sxz = Math.max(0.08 * mx, sx - 2.0 * deltaR * tanAx);
                    const xc = xk + handSign * zVal * tanGama;
                    ptsR.push({ x: xc + sxz / 2.0, z: zVal });
                    ptsL.push({ x: xc - sxz / 2.0, z: zVal });
                }

                // Only draw if inside [-L/2, L/2]
                const xMid = xk;
                if (xMid >= -L / 2.0 - px && xMid <= L / 2.0 + px) {
                    for (let i = 0; i < ptsR.length - 1; i++) {
                        addLine(ptsR[i].x, ptsR[i].z, ptsR[i + 1].x, ptsR[i + 1].z, 'OUTLINE');
                    }
                    for (let i = 0; i < ptsL.length - 1; i++) {
                        addLine(ptsL[i].x, ptsL[i].z, ptsL[i + 1].x, ptsL[i + 1].z, 'OUTLINE');
                    }
                    addLine(ptsL[ptsL.length - 1].x, wt, ptsR[ptsR.length - 1].x, wt, 'OUTLINE');
                    addLine(ptsL[0].x, -wt, ptsR[0].x, -wt, 'OUTLINE');

                    if (xk >= -L / 2.0 && xk <= L / 2.0) {
                        addCircle(xk, 0, 0.6 * mx, 'PITCH_LINE');
                    }
                }
            }

            // Dimensions on DIMS layer
            addLine(-L / 2.0, wt + 8.0, L / 2.0, wt + 8.0, 'DIMS');
            addText(0, wt + 10.0, 3.5, `L = ${L.toFixed(3)} mm`, 'DIMS');

            addLine(-L / 2.0 - 15, -wt, -L / 2.0 - 15, wt, 'DIMS');
            addText(-L / 2.0 - 25, 0, 3.5, `Bt = ${bt.toFixed(3)} mm`, 'DIMS');

            addLine(0, 0, px, 0, 'DIMS');
            addText(px / 2.0, 1.5, 3.0, `px = ${px.toFixed(4)} mm`, 'DIMS');

            addLine(-sx / 2.0, -2.5, sx / 2.0, -2.5, 'DIMS');
            addText(0, -5.5, 3.0, `sx = ${sx.toFixed(4)} mm`, 'DIMS');

            // Manufacturing Parameter Table on MFG_TABLE layer
            const tblX = l2 + 15;
            let tblY = wt + 8.0;
            const rows = [
                `WORM PITCH CYLINDER TANGENT SECTION T-T (DIN 3975)`,
                `Tangent Plane Position y: ${(d1 / 2.0).toFixed(4)} mm`,
                `Contact Slice Width Bt: ${bt.toFixed(4)} mm`,
                `Lead Angle gama: ${gama.toFixed(4)} deg`,
                `Axial Module mx: ${mx.toFixed(4)} mm`,
                `Axial Pitch px: ${px.toFixed(4)} mm`,
                `Normal Module mn: ${mn.toFixed(4)} mm`,
                `Normal Pitch pn: ${pn.toFixed(4)} mm`,
                `Axial Tooth Thickness sx: ${sx.toFixed(4)} mm`,
                `Normal Tooth Thickness sn: ${sn.toFixed(4)} mm`,
                `Pitch Diameter d1: ${d1.toFixed(3)} mm`,
                `Tip Diameter da1: ${da1.toFixed(3)} mm`,
                `Thread Length L: ${L.toFixed(3)} mm`,
                `Number of Threads z1: ${g.z1}`
            ];
            rows.forEach(r => {
                addText(tblX, tblY, 3.2, r, 'MFG_TABLE');
                tblY -= 6.5;
            });
        } else if (mode === 'worm_left') {
            dxfWheel(0, 0, g.da1, g.d1, g.df1, 0, true);
        } else if (mode === 'worm_front' || mode === 'worm') {
            dxfWorm(0, 0);
        } else if (mode === 'gear_front') {
            dxfWheel(0, 0, g.de2, g.d2, g.da2, g.df2, false);
        } else if (mode === 'gear_left' || mode === 'wheel') {
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
