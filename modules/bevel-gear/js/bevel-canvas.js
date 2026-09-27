/**
 * MITCalc Web App - 2D Interactive Bevel Gear Canvas Visualizer
 * 1-to-1 Synchronized with 3D WebGL Model (Blank Geometry, Colors & C1 Root Fillet R_chan = 0.38*mmn)
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
        this.animDirection = 1; // 1: Thuận, -1: Nghịch
        this.isRunning = true;
        this.profileResolution = 6;

        // Layer visibility toggles
        this.showDimensions = true;
        this.showHatching = true;
        this.showAxes = true;
        this.showStripes = true;
        this.showDataCard = true;

        this.initEvents();
        this.animate();
    }

    setProfileResolution(level) {
        this.profileResolution = Math.max(1, Math.min(11, parseInt(level) || 6));
        this.render();
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.01, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    setAnimDirection(dir) {
        this.animDirection = (dir === -1 || dir < 0) ? -1 : 1;
        return this.animDirection;
    }

    toggleAnimDirection() {
        this.animDirection = (this.animDirection === 1) ? -1 : 1;
        return this.animDirection;
    }

    stepAnimation(direction = 1) {
        this.isRunning = false;
        const z1 = this.geom ? (parseInt(this.geom.z1) || 18) : 18;
        const stepRad = (Math.PI / (10.0 * z1)) * direction;
        this.angle1 = (this.angle1 || 0) + stepRad;
        this.render();
        return this.angle1;
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
        requestAnimationFrame(() => this.animate());
        if (!this.canvas || this.canvas.clientWidth === 0 || this.canvas.clientHeight === 0) {
            return;
        }
        if (this.isRunning && this.geom) {
            this.angle1 += 0.015 * (this.animSpeed || 1.0) * (this.animDirection || 1);
            this.render();
        }
    }

    /**
     * Computes the exact 3D-matched blank parameters for Pinion 1 and Gear 2
     * (Matches Bevel3DGenerator & Bevel3DVisualizer 1-to-1)
     */
    _get3DMatchedBlankParams(g) {
        const z1 = parseInt(g.z1) || 18;
        const z2 = parseInt(g.z2) || 45;
        const mmn = parseFloat(g.mmn) || 10.0;
        const b = parseFloat(g.b) || 117.0;
        const Re = parseFloat(g.Re) || 338.0;
        const Rm = parseFloat(g.Rm) || (Re - b / 2.0);
        const Ri = parseFloat(g.Ri) || (Re - b);

        const Sigma_deg = parseFloat(g.Sigma_deg !== undefined ? g.Sigma_deg : g.Sigma) || 90.0;
        const sigmaRad = (Sigma_deg * Math.PI) / 180.0;
        const d1 = parseFloat(g.delta1) || Math.atan(Math.sin(sigmaRad) / ((z2 / z1) + Math.cos(sigmaRad)));
        const d2 = sigmaRad - d1;

        const s1 = Math.sin(d1), c1 = Math.cos(d1);
        const s2 = Math.sin(d2), c2 = Math.cos(d2);

        const hae1 = parseFloat(g.hae1) || (mmn * 1.32 * (Re / Rm));
        const hfe1 = parseFloat(g.hfe1) || (mmn * 0.88 * (Re / Rm));
        const hai1 = hae1 * (Ri / Re);
        const hfi1 = hfe1 * (Ri / Re);

        const hae2 = parseFloat(g.hae2) || (mmn * 0.68 * (Re / Rm));
        const hfe2 = parseFloat(g.hfe2) || (mmn * 1.52 * (Re / Rm));
        const hai2 = hae2 * (Ri / Re);
        const hfi2 = hfe2 * (Ri / Re);

        const Hin1 = parseFloat(g.H1in || g.a_offset1) || 4.836;
        const Hout1 = parseFloat(g.H1out || g.b_offset1) || 13.300;
        const Hin2 = parseFloat(g.H2in || g.a_offset2) || 5.911;
        const Hout2 = parseFloat(g.H2out || g.b_offset2) || 19.950;

        const r_root_toe1 = Ri * s1 - hfi1 * c1;
        const defaultBore1 = Math.max(10.0, r_root_toe1 * 0.9);
        const dBore1 = Math.min(r_root_toe1 * 0.85 * 2.0, Math.max(6.0, parseFloat(g.dBore1) || 50.0 || defaultBore1));
        const rBore1 = dBore1 / 2.0;

        const r_root_toe2 = Ri * s2 - hfi2 * c2;
        const defaultBore2 = Math.max(10.0, r_root_toe2 * 0.9);
        const dBore2 = Math.min(r_root_toe2 * 0.85 * 2.0, Math.max(6.0, parseFloat(g.dBore2) || 100.0 || defaultBore2));
        const rBore2 = dBore2 / 2.0;

        return {
            z1, z2, mmn, b, Re, Rm, Ri, Sigma_deg, sigmaRad,
            d1, d2, s1, c1, s2, c2,
            hae1, hfe1, hai1, hfi1,
            hae2, hfe2, hai2, hfi2,
            Hin1, Hout1, Hin2, Hout2,
            dBore1, rBore1, dBore2, rBore2
        };
    }

    render() {
        if (!this.ctx || !this.geom) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        this.drawGrid(ctx, w, h);

        const g = this.geom;
        const bp = this._get3DMatchedBlankParams(g);

        // Split viewport layout:
        // Left Viewport (0 .. 730): 2D Axial Cross-Section (1-to-1 with 3D Blank & Colors)
        // Right Viewport (736 .. w-14): 2D Conjugate Tooth Profile (Tredgold Virtual Gear with R chân)
        const leftW = Math.round(w * 0.61);

        // Compute bounding box of 3D-matched axial section for auto-centering in Left Viewport
        const z_heel_hub1 = bp.Re * bp.c1 + (bp.hfe1 + bp.Hout1) * bp.s1;
        const z_heel_hub2 = bp.Re * bp.c2 + (bp.hfe2 + bp.Hout2) * bp.s2;
        const dae1 = g.dae1 || (2.0 * (bp.Re * bp.s1 + bp.hae1 * bp.c1));
        const dae2 = g.dae2 || (2.0 * (bp.Re * bp.s2 + bp.hae2 * bp.c2));

        // Transform Gear 2 extreme corners by shaft angle sigmaRad
        const uAx2 = { x: Math.cos(bp.sigmaRad), y: -Math.sin(bp.sigmaRad) };
        const uRad2 = { x: Math.sin(bp.sigmaRad), y: Math.cos(bp.sigmaRad) };
        const g2LeftTip = {
            x: bp.Re * bp.c2 * uAx2.x - (dae2 / 2.0) * uRad2.x,
            y: bp.Re * bp.c2 * uAx2.y - (dae2 / 2.0) * uRad2.y
        };
        const g2RightTip = {
            x: bp.Re * bp.c2 * uAx2.x + (dae2 / 2.0) * uRad2.x,
            y: bp.Re * bp.c2 * uAx2.y + (dae2 / 2.0) * uRad2.y
        };
        const g2Back = {
            x: z_heel_hub2 * uAx2.x,
            y: z_heel_hub2 * uAx2.y
        };

        const xMin = Math.min(g2LeftTip.x, g2RightTip.x, g2Back.x, -40) - 55;
        const xMax = Math.max(z_heel_hub1, g2RightTip.x, dae2 / 2.0) + 70;
        const yMin = Math.min(g2LeftTip.y, g2RightTip.y, g2Back.y, -dae1 / 2.0) - 55;
        const yMax = Math.max(dae1 / 2.0, 40) + 45;

        const wGeom = Math.max(120, xMax - xMin);
        const hGeom = Math.max(120, yMax - yMin);
        const cxGeom = (xMin + xMax) / 2.0;
        const cyGeom = (yMin + yMax) / 2.0;

        const scale = Math.min(((leftW - 20) * 0.84) / wGeom, (h * 0.80) / hGeom);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, leftW, h);
        ctx.clip();

        ctx.translate(leftW / 2.0 + 15 + this.panX, h / 2.0 + 25 + this.panY);
        ctx.scale(this.zoom * scale, this.zoom * scale);
        ctx.translate(-cxGeom, -cyGeom);

        this.drawAxialSection(ctx, bp);

        ctx.restore();

        // Draw Right Panel: Live 2D Tredgold Conjugate Tooth Profile with Root Fillet R chân
        this.draw2DToothProfileInset(ctx, bp, leftW + 8, 14, w - leftW - 22, h - 28);

        if (this.showDataCard) {
            this.drawDataCard(ctx, g, bp);
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

    /**
     * Draws the 2D Axial Cross-Section matching the 3D Bevel Gear Blank 1-to-1
     * (Exact 8-point conical ring blank from Bevel3DGenerator, Cobalt-Cyan Blue & Coral-Orange)
     */
    drawAxialSection(ctx, bp) {
        const g = this.geom;
        const {
            Re, Ri, b, sigmaRad,
            d1, d2, s1, c1, s2, c2,
            hae1, hfe1, hai1, hfi1,
            hae2, hfe2, hai2, hfi2,
            Hin1, Hout1, Hin2, Hout2,
            rBore1, rBore2
        } = bp;

        const dae1 = g.dae1 || (2.0 * (Re * s1 + hae1 * c1));
        const dae2 = g.dae2 || (2.0 * (Re * s2 + hae2 * c2));

        // -------------------------------------------------------------------------
        // 1. PINION 1 KEY COORDINATES (Apex at (0,0), Axis along +X)
        // Exact 1-to-1 match with Bevel3DGenerator (z_toe_hub, r_toe_rim, z_heel_hub, r_heel_rim, rBore)
        // -------------------------------------------------------------------------
        const z_toe_hub1 = Ri * c1 + (hfi1 + Hin1) * s1;
        const r_toe_rim1 = Math.max(rBore1 + 2.0, Ri * s1 - (hfi1 + Hin1) * c1);
        const z_heel_hub1 = Re * c1 + (hfe1 + Hout1) * s1;
        const r_heel_rim1 = Math.max(rBore1 + 5.0, Re * s1 - (hfe1 + Hout1) * c1);

        const p1_toe_root  = { x: Ri * c1 + hfi1 * s1, y: -(Ri * s1 - hfi1 * c1) };
        const p1_toe_tip   = { x: Ri * c1 - hai1 * s1, y: -(Ri * s1 + hai1 * c1) };
        const p1_heel_tip  = { x: Re * c1 - hae1 * s1, y: -(Re * s1 + hae1 * c1) };
        const p1_heel_root = { x: Re * c1 + hfe1 * s1, y: -(Re * s1 - hfe1 * c1) };
        const p1_heel_rim  = { x: z_heel_hub1, y: -r_heel_rim1 };
        const p1_heel_bore = { x: z_heel_hub1, y: -rBore1 };
        const p1_toe_bore  = { x: z_toe_hub1, y: -rBore1 };
        const p1_toe_rim   = { x: z_toe_hub1, y: -r_toe_rim1 };

        // Pinion Upper Half Cross-Section (8-point 3D conical ring blank)
        const pinion_upper = [
            p1_toe_root, p1_toe_tip, p1_heel_tip, p1_heel_root,
            p1_heel_rim, p1_heel_bore, p1_toe_bore, p1_toe_rim
        ];

        // Pinion Lower Half Cross-Section (Symmetric across X-axis)
        const pinion_lower = pinion_upper.map(pt => ({ x: pt.x, y: -pt.y }));
        const p1_toe_root_b  = { x: p1_toe_root.x,  y: -p1_toe_root.y };
        const p1_toe_tip_b   = { x: p1_toe_tip.x,   y: -p1_toe_tip.y };
        const p1_heel_tip_b  = { x: p1_heel_tip.x,  y: -p1_heel_tip.y };
        const p1_heel_root_b = { x: p1_heel_root.x, y: -p1_heel_root.y };

        // -------------------------------------------------------------------------
        // 2. GEAR 2 KEY COORDINATES (Apex at (0,0), Axis at Shaft Angle Sigma)
        // Exact 1-to-1 match with Bevel3DGenerator & Bevel3DVisualizer
        // -------------------------------------------------------------------------
        const z_toe_hub2 = Ri * c2 + (hfi2 + Hin2) * s2;
        const r_toe_rim2 = Math.max(rBore2 + 2.0, Ri * s2 - (hfi2 + Hin2) * c2);
        const z_heel_hub2 = Re * c2 + (hfe2 + Hout2) * s2;
        const r_heel_rim2 = Math.max(rBore2 + 5.0, Re * s2 - (hfe2 + Hout2) * c2);

        const uAx2 = { x: Math.cos(sigmaRad), y: -Math.sin(sigmaRad) };
        const uRad2 = { x: Math.sin(sigmaRad), y: Math.cos(sigmaRad) };
        const toGearWorld = (zL, rL) => ({
            x: zL * uAx2.x + rL * uRad2.x,
            y: zL * uAx2.y + rL * uRad2.y
        });

        const g2_local = [
            { z: Ri * c2 + hfi2 * s2, r: Ri * s2 - hfi2 * c2 }, // 0: toe_root
            { z: Ri * c2 - hai2 * s2, r: Ri * s2 + hai2 * c2 }, // 1: toe_tip
            { z: Re * c2 - hae2 * s2, r: Re * s2 + hae2 * c2 }, // 2: heel_tip
            { z: Re * c2 + hfe2 * s2, r: Re * s2 - hfe2 * c2 }, // 3: heel_root
            { z: z_heel_hub2,         r: r_heel_rim2 },         // 4: heel_rim
            { z: z_heel_hub2,         r: rBore2 },              // 5: heel_bore
            { z: z_toe_hub2,          r: rBore2 },              // 6: toe_bore
            { z: z_toe_hub2,          r: r_toe_rim2 }           // 7: toe_rim
        ];

        const gear_right = g2_local.map(pt => toGearWorld(pt.z, +pt.r));
        const gear_left  = g2_local.map(pt => toGearWorld(pt.z, -pt.r));

        const p2_toe_root    = gear_right[0];
        const p2_toe_tip     = gear_right[1];
        const p2_heel_tip    = gear_right[2];
        const p2_heel_root   = gear_right[3];
        const p2_toe_root_l  = gear_left[0];
        const p2_toe_tip_l   = gear_left[1];
        const p2_heel_tip_l  = gear_left[2];
        const p2_heel_root_l = gear_left[3];

        // -------------------------------------------------------------------------
        // 3. DRAW 3D-MATCHED BORE & RIM CONNECTING LINES (Back/Front faces across bore)
        // -------------------------------------------------------------------------
        // Pinion 1 Bore Shading (Cobalt-Cyan Blue theme matching 3D Pinion)
        ctx.fillStyle = 'rgba(7, 89, 133, 0.22)';
        ctx.fillRect(z_toe_hub1, -rBore1, z_heel_hub1 - z_toe_hub1, 2.0 * rBore1);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(z_toe_hub1, -rBore1, z_heel_hub1 - z_toe_hub1, 2.0 * rBore1);

        // Gear 2 Bore Shading (Coral-Orange theme matching 3D Gear)
        const g2BorePoly = [gear_right[5], gear_right[6], gear_left[6], gear_left[5]];
        ctx.beginPath();
        ctx.moveTo(g2BorePoly[0].x, g2BorePoly[0].y);
        for (let i = 1; i < g2BorePoly.length; i++) ctx.lineTo(g2BorePoly[i].x, g2BorePoly[i].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(154, 52, 18, 0.22)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // -------------------------------------------------------------------------
        // 4. DRAW PINION 1 SECTIONS (Vivid Cobalt-Cyan Blue #0284c7 / #38bdf8 matching 3D)
        // -------------------------------------------------------------------------
        for (const poly of [pinion_upper, pinion_lower]) {
            this.drawPolygonSection(ctx, poly, '#083344', '#38bdf8', Math.PI / 4, 'rgba(56, 189, 248, 0.48)');
        }

        // -------------------------------------------------------------------------
        // 5. DRAW GEAR 2 SECTIONS (Vivid Coral-Orange #ea580c / #fb923c matching 3D)
        // -------------------------------------------------------------------------
        for (const poly of [gear_right, gear_left]) {
            this.drawPolygonSection(ctx, poly, '#431407', '#fb923c', -Math.PI / 4, 'rgba(251, 146, 60, 0.48)');
        }

        // -------------------------------------------------------------------------
        // 6. TOOTH ROOT & PITCH CONE LINES ON THE TEETH
        // -------------------------------------------------------------------------
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(p1_toe_root.x, p1_toe_root.y);
        ctx.lineTo(p1_heel_root.x, p1_heel_root.y);
        ctx.moveTo(p1_toe_root_b.x, p1_toe_root_b.y);
        ctx.lineTo(p1_heel_root_b.x, p1_heel_root_b.y);
        ctx.stroke();

        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(p2_toe_root.x, p2_toe_root.y);
        ctx.lineTo(p2_heel_root.x, p2_heel_root.y);
        ctx.moveTo(p2_toe_root_l.x, p2_toe_root_l.y);
        ctx.lineTo(p2_heel_root_l.x, p2_heel_root_l.y);
        ctx.stroke();

        // -------------------------------------------------------------------------
        // 7. ANIMATED CONJUGATE MESHING STRIPES
        // -------------------------------------------------------------------------
        if (this.showStripes) {
            this.drawToothStripes(ctx, p1_toe_root, p1_heel_root, p1_toe_tip, p1_heel_tip, '#38bdf8', this.angle1);
            this.drawToothStripes(ctx, p1_toe_root_b, p1_heel_root_b, p1_toe_tip_b, p1_heel_tip_b, '#38bdf8', -this.angle1);
            this.drawToothStripes(ctx, p2_toe_root, p2_heel_root, p2_toe_tip, p2_heel_tip, '#fb923c', -this.angle1 / (g.i || 2.5));
            this.drawToothStripes(ctx, p2_toe_root_l, p2_heel_root_l, p2_toe_tip_l, p2_heel_tip_l, '#fb923c', this.angle1 / (g.i || 2.5));
        }

        // -------------------------------------------------------------------------
        // 8. CENTERLINES & PITCH CONE GENERATORS (Apex V(0,0))
        // -------------------------------------------------------------------------
        if (this.showAxes) {
            ctx.save();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([14, 4, 3, 4]);

            // Pinion 1 Axis (Horizontal +X)
            ctx.beginPath();
            ctx.moveTo(-35, 0);
            ctx.lineTo(z_heel_hub1 + 45, 0);
            ctx.stroke();

            // Gear 2 Axis (Along shaft angle Sigma)
            ctx.beginPath();
            ctx.moveTo(-35 * uAx2.x, -35 * uAx2.y);
            ctx.lineTo((z_heel_hub2 + 45) * uAx2.x, (z_heel_hub2 + 45) * uAx2.y);
            ctx.stroke();

            // Shared Pitch Cone Contact Generator (Meshing Line)
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([10, 4, 3, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.12, -Re * s1 * 1.12);
            ctx.stroke();

            // Outer non-meshing pitch cone generators
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([6, 4]);
            const g2PitchLeft = toGearWorld(Re * c2 * 1.08, -Re * s2 * 1.08);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(g2PitchLeft.x, g2PitchLeft.y);
            ctx.moveTo(0, 0);
            ctx.lineTo(Re * c1 * 1.08, Re * s1 * 1.08);
            ctx.stroke();

            ctx.restore();
        }

        // 9. APEX V(0,0) INDICATOR
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.fillText('Apex V(0,0)', -30, 18);

        // 10. CAD ENGINEERING DIMENSIONS
        if (this.showDimensions) {
            this.drawCadDimensions(ctx, {
                g, Re, Ri, b, d1, d2, s1, c1, s2, c2, sigmaRad,
                dae1, dae2, x_hub_end1: z_heel_hub1,
                y_back2: Math.min(gear_left[4].y, gear_right[4].y),
                p1_heel_tip, p1_heel_tip_b,
                p2_heel_tip, p2_heel_tip_l
            });
        }
    }

    /**
     * Renders the Live 2D Tredgold Conjugate Tooth Profile Viewport on the right side of the canvas
     * Uses the exact same Bevel3DGenerator.generateSliceToothContour function as the 3D WebGL model,
     * displaying the C1-tangent circular root fillet R_chan = 0.38 * mmn and preserved root land arc!
     */
    draw2DToothProfileInset(ctx, bp, panelX, panelY, panelW, panelH) {
        if (typeof Bevel3DGenerator === 'undefined' || !Bevel3DGenerator.generateSliceToothContour) return;
        const g = this.geom;
        const { z1, z2, mmn, Rm, d1, d2 } = bp;

        const alfa = ((parseFloat(g.alfa_deg !== undefined ? g.alfa_deg : 20.0)) * Math.PI) / 180.0;
        const beta_deg = (g.beta_deg !== undefined ? parseFloat(g.beta_deg) : (g.beta !== undefined ? parseFloat(g.beta) : 0.0));
        const beta = (beta_deg * Math.PI) / 180.0;
        const isSpiral = Math.abs(beta) > 1e-4;
        const x1 = parseFloat(g.x1 !== undefined ? g.x1 : 0.32);
        const x2 = parseFloat(g.x2 !== undefined ? g.x2 : -x1);
        const xt1 = parseFloat(g.xt1 !== undefined ? g.xt1 : 0.04);
        const xt2 = parseFloat(g.xt2 !== undefined ? g.xt2 : -xt1);

        const ha1 = parseFloat(g.ha1) || (mmn * (1.0 + x1));
        const hf1 = parseFloat(g.hf1) || (mmn * (1.2 - x1));
        const sn1 = parseFloat(g.sn1) || (mmn * (Math.PI / 2.0 + 2.0 * x1 * Math.tan(alfa) + xt1));

        const ha2 = parseFloat(g.ha2) || (mmn * (1.0 + x2));
        const hf2 = parseFloat(g.hf2) || (mmn * (1.2 - x2));
        const sn2 = parseFloat(g.sn2) || (mmn * (Math.PI / 2.0 + 2.0 * x2 * Math.tan(alfa) + xt2));

        const resMap = (typeof BEVEL_PROFILE_RESOLUTIONS !== 'undefined') ? BEVEL_PROFILE_RESOLUTIONS[this.profileResolution] : null;
        const ptsPerFlank = resMap ? resMap.ptsPerFlank : 20;

        // Generate exact 2D slice tooth contours at mean cone distance Rm (with C1 circular root fillet Rf = 0.38 * mmn)
        const slice1 = Bevel3DGenerator.generateSliceToothContour({
            z: z1, mmn, Rm, R_s: Rm, delta: d1, alfa, beta, isSpiral,
            ha_s: ha1, hf_s: hf1, sn_s: sn1, ptsPerFlank, ptsFillet: 10
        });
        const slice2 = Bevel3DGenerator.generateSliceToothContour({
            z: z2, mmn, Rm, R_s: Rm, delta: d2, alfa, beta, isSpiral,
            ha_s: ha2, hf_s: hf2, sn_s: sn2, ptsPerFlank, ptsFillet: 10
        });

        ctx.save();

        // 1. Panel Background & Frame
        ctx.fillStyle = 'rgba(11, 17, 30, 0.94)';
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(panelX, panelY, panelW, panelH, 8);
        else ctx.rect(panelX, panelY, panelW, panelH);
        ctx.fill();
        ctx.stroke();

        // Panel Header
        const hdrH = 32;
        ctx.fillStyle = '#172554';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(panelX, panelY, panelW, hdrH, [8, 8, 0, 0]);
        else ctx.rect(panelX, panelY, panelW, hdrH);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11.5px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦷 BIÊN DẠNG RĂNG ĂN KHỚP 2D (TREDGOLD - CÓ R CHÂN)', panelX + 12, panelY + hdrH / 2);

        // Clip inside viewport body
        const viewX = panelX + 2;
        const viewY = panelY + hdrH + 2;
        const viewW = panelW - 4;
        const viewH = panelH - hdrH - 64;

        ctx.save();
        ctx.beginPath();
        ctx.rect(viewX, viewY, viewW, viewH);
        ctx.clip();

        // Subtle CAD grid inside tooth profile viewport
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        for (let gx = viewX; gx < viewX + viewW; gx += 24) {
            ctx.moveTo(gx, viewY);
            ctx.lineTo(gx, viewY + viewH);
        }
        for (let gy = viewY; gy < viewY + viewH; gy += 24) {
            ctx.moveTo(viewX, gy);
            ctx.lineTo(viewX + viewW, gy);
        }
        ctx.stroke();

        // Coordinate system centered at Pitch Contact Point P(0, 0):
        // Pinion 1 (Blue) virtual center Ov1 is at (0, +rv1) below P (teeth point UP, matching 3D view!)
        // Gear 2 (Orange) virtual center Ov2 is at (0, -rv2) above P (teeth point DOWN, matching 3D view!)
        const pitchScreenX = viewX + viewW * 0.50;
        const pitchScreenY = viewY + viewH * 0.50;
        // Scale so ~3.2 tooth pitches fit across viewW
        const pitchLinear = Math.PI * (g.mmt || (mmn / Math.max(0.2, Math.cos(beta))));
        const toothScale = Math.min(viewW / (3.15 * pitchLinear), viewH / (4.4 * mmn));

        ctx.translate(pitchScreenX, pitchScreenY);
        ctx.scale(toothScale, toothScale);

        const rv1 = slice1.rv, rvb1 = slice1.rvb, rva1 = slice1.rva, rvf1 = slice1.rvf;
        const rv2 = slice2.rv, rvb2 = slice2.rvb, rva2 = slice2.rva, rvf2 = slice2.rvf;
        const pPsi1 = (2.0 * Math.PI / z1) * slice1.cosD;
        const pPsi2 = (2.0 * Math.PI / z2) * slice2.cosD;

        // Periodic tooth pitch phase in [-0.5, +0.5]
        const rawPhase = ((this.angle1 * z1) / (2.0 * Math.PI)) % 1.0;
        const phase = rawPhase > 0.5 ? rawPhase - 1.0 : (rawPhase < -0.5 ? rawPhase + 1.0 : rawPhase);

        // Helper to build & draw multi-tooth segment around pitch point P(0,0)
        const drawVirtualGearBand = (slice, isPinion, fillColor, strokeColor, filletColor) => {
            const rv = slice.rv;
            const rvf = slice.rvf;
            const cosD = slice.cosD;
            const pPsi = isPinion ? pPsi1 : pPsi2;
            const rimDepth = Math.max(mmn * 2.2, (slice.rva - slice.rvf) * 1.15);
            const rInnerRim = Math.max(2.0, rvf - rimDepth);
            const kMin = -3, kMax = 3;

            const toPt = (r, psi) => {
                if (isPinion) {
                    // Center at (0, +rv), psi = 0 points UP to (0, 0)
                    return { x: r * Math.sin(psi), y: rv - r * Math.cos(psi) };
                } else {
                    // Center at (0, -rv), psi = 0 points DOWN to (0, 0)
                    return { x: r * Math.sin(psi), y: -rv + r * Math.cos(psi) };
                }
            };

            const contourPts = [];
            const filletArcs = [];

            for (let k = kMin; k <= kMax; k++) {
                const centerPsi = isPinion ? (k + phase) * pPsi : (k + 0.5 + phase) * pPsi;
                let curFillet = [];
                for (let idx = 0; idx < slice.toothContour.length; idx++) {
                    if (k > kMin && idx === 0) continue;
                    const tc = slice.toothContour[idx];
                    const r = rv + tc.h;
                    const psi = centerPsi + tc.theta * cosD;
                    const pt = toPt(r, psi);
                    contourPts.push(pt);

                    if (tc.zone === 'fillet') {
                        curFillet.push(pt);
                    } else if (curFillet.length > 0) {
                        filletArcs.push(curFillet);
                        curFillet = [];
                    }
                }
                if (curFillet.length > 0) filletArcs.push(curFillet);
            }

            // Close polygon along inner rim arc from maxPsi back to minPsi
            const maxPsi = (isPinion ? (kMax + phase) : (kMax + 0.5 + phase)) * pPsi + slice.half_pitch * cosD;
            const minPsi = (isPinion ? (kMin + phase) : (kMin + 0.5 + phase)) * pPsi - slice.half_pitch * cosD;
            const fullPoly = [...contourPts];
            const rimSteps = 28;
            for (let s = 0; s <= rimSteps; s++) {
                const psi = maxPsi - (s / rimSteps) * (maxPsi - minPsi);
                fullPoly.push(toPt(rInnerRim, psi));
            }

            // Fill gear body
            ctx.beginPath();
            ctx.moveTo(fullPoly[0].x, fullPoly[0].y);
            for (let i = 1; i < fullPoly.length; i++) ctx.lineTo(fullPoly[i].x, fullPoly[i].y);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();

            // Stroke active tooth contour (involute flanks + root lands + tip lands)
            ctx.beginPath();
            ctx.moveTo(contourPts[0].x, contourPts[0].y);
            for (let i = 1; i < contourPts.length; i++) ctx.lineTo(contourPts[i].x, contourPts[i].y);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2.0 / toothScale;
            ctx.stroke();

            // Highlight C1 Circular Root Fillet Arcs (R chân = 0.38 * mmn)
            ctx.strokeStyle = filletColor;
            ctx.lineWidth = 3.0 / toothScale;
            for (const arc of filletArcs) {
                if (arc.length < 2) continue;
                ctx.beginPath();
                ctx.moveTo(arc[0].x, arc[0].y);
                for (let i = 1; i < arc.length; i++) ctx.lineTo(arc[i].x, arc[i].y);
                ctx.stroke();
            }
        };

        // Draw Gear 2 (Top - Vivid Coral-Orange matching 3D Gear 2)
        drawVirtualGearBand(slice2, false, 'rgba(234, 88, 12, 0.36)', '#fb923c', '#facc15');

        // Draw Pinion 1 (Bottom - Vivid Cobalt-Cyan Blue matching 3D Pinion 1)
        drawVirtualGearBand(slice1, true, 'rgba(2, 132, 199, 0.40)', '#38bdf8', '#10b981');

        // Draw Reference Circles (Tip Circles rva1, rva2, Pitch Circles rv1, rv2, Root Circles rvf1, rvf2)
        ctx.save();
        // Tip circles (subtle dashed)
        ctx.setLineDash([5 / toothScale, 4 / toothScale]);
        ctx.lineWidth = 1.0 / toothScale;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
        ctx.beginPath();
        ctx.arc(0, rv1, rva1, -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.38)';
        ctx.beginPath();
        ctx.arc(0, -rv2, rva2, Math.PI * 0.22, Math.PI * 0.78);
        ctx.stroke();

        // Root circles (dotted)
        ctx.setLineDash([3 / toothScale, 3 / toothScale]);
        ctx.lineWidth = 1.0 / toothScale;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.arc(0, rv1, rvf1, -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
        ctx.beginPath();
        ctx.arc(0, -rv2, rvf2, Math.PI * 0.22, Math.PI * 0.78);
        ctx.stroke();

        // Pitch circles (amber dash-dot)
        ctx.setLineDash([10 / toothScale, 4 / toothScale, 2 / toothScale, 4 / toothScale]);
        ctx.lineWidth = 1.4 / toothScale;
        ctx.strokeStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, rv1, rv1, -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -rv2, rv2, Math.PI * 0.22, Math.PI * 0.78);
        ctx.stroke();

        // Line of Action through Pitch Point P(0,0)
        const alfa_t = slice1.alfa_t;
        const loaLen = mmn * 2.2;
        ctx.setLineDash([5 / toothScale, 3 / toothScale]);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
        ctx.lineWidth = 1.3 / toothScale;
        ctx.beginPath();
        ctx.moveTo(-loaLen * Math.cos(alfa_t), -loaLen * Math.sin(alfa_t));
        ctx.lineTo(loaLen * Math.cos(alfa_t), loaLen * Math.sin(alfa_t));
        ctx.stroke();
        ctx.restore();

        // Pitch Point P(0,0) Marker
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 3.8 / toothScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2 / toothScale;
        ctx.stroke();

        // Callout annotation for Root Fillet Center & Radius Rf on Pinion 1 Tooth 0
        const centerPsi0 = phase * pPsi1;
        const fSol1 = slice1.fillet;
        if (fSol1) {
            const rCf = Math.hypot(fSol1.Cfx, fSol1.Cfy);
            const psiCf = centerPsi0 + Math.atan2(fSol1.Cfx, fSol1.Cfy);
            const cfx = rCf * Math.sin(psiCf);
            const cfy = rv1 - rCf * Math.cos(psiCf);

            // Dashed fillet circle preview at tooth 0 right root fillet
            ctx.save();
            ctx.setLineDash([2.5 / toothScale, 2.5 / toothScale]);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.2 / toothScale;
            ctx.beginPath();
            ctx.arc(cfx, cfy, fSol1.Rf, 0, Math.PI * 2);
            ctx.stroke();

            // Center dot of Rf circle
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(cfx, cfy, 2.2 / toothScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.restore(); // End viewport clip

        // Footer Legend & R chân Readout inside Panel
        const footY = panelY + panelH - 58;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(panelX + 2, footY, panelW - 4, 56);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(panelX + 2, footY);
        ctx.lineTo(panelX + panelW - 2, footY);
        ctx.stroke();

        const rf1Val = slice1.fillet ? slice1.fillet.Rf : (0.38 * mmn);
        const rf2Val = slice2.fillet ? slice2.fillet.Rf : (0.38 * mmn);

        ctx.font = 'bold 10.5px Consolas, monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#10b981';
        ctx.fillText(`● R chân Bánh 1 (Rf1) = ${rf1Val.toFixed(2)} mm (0.38·mmn)`, panelX + 12, footY + 18);
        ctx.fillStyle = '#facc15';
        ctx.fillText(`● R chân Bánh 2 (Rf2) = ${rf2Val.toFixed(2)} mm | Cung đáy rãnh dfv`, panelX + 12, footY + 36);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('■ Bánh dẫn 1', panelX + panelW - 12, footY + 18);
        ctx.fillStyle = '#fb923c';
        ctx.fillText('■ Bánh bị dẫn 2', panelX + panelW - 12, footY + 36);

        ctx.restore();
    }

    drawCadDimensions(ctx, d) {
        const { g, Re, Ri, b, d1, d2, s1, c1, s2, c2, dae1, dae2, x_hub_end1, y_back2, p1_heel_tip, p1_heel_tip_b, p2_heel_tip, p2_heel_tip_l } = d;

        // A. Pinion Tip Diameter dae1 (Vertical dimension on right side)
        const x_dim_dae1 = x_hub_end1 + 28;
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
            '#38bdf8',
            { x: 8, y: 0 },
            'left'
        );

        // B. Gear Tip Diameter dae2 (Cleanly above Gear 2 back face)
        const topEdgeY = y_back2 !== undefined ? Math.min(p2_heel_tip_l.y, p2_heel_tip.y, y_back2) : Math.min(p2_heel_tip_l.y, p2_heel_tip.y);
        const y_dim_dae2 = topEdgeY - 26;
        const x_left_dae2 = p2_heel_tip_l.x;
        const x_right_dae2 = p2_heel_tip.x;

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
            '#fb923c',
            { x: 0, y: -10 },
            'center'
        );

        // C. Face Width b & Outer Cone Distance Re (Placed cleanly along lower pitch cone generator in open space)
        const nx_low = -s1, ny_low = c1;
        const b_off = 30;
        const p_b1 = { x: Ri * c1 + b_off * nx_low, y: Ri * s1 + b_off * ny_low };
        const p_b2 = { x: Re * c1 + b_off * nx_low, y: Re * s1 + b_off * ny_low };

        ctx.beginPath();
        ctx.moveTo(Ri * c1, Ri * s1);
        ctx.lineTo(p_b1.x + 8 * nx_low, p_b1.y + 8 * ny_low);
        ctx.moveTo(Re * c1, Re * s1);
        ctx.lineTo(p_b2.x + 8 * nx_low, p_b2.y + 8 * ny_low);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_b1, p_b2,
            'b = ' + b.toFixed(1),
            '#f59e0b',
            { x: 12 * nx_low, y: 12 * ny_low },
            'center'
        );

        // D. Outer Cone Distance Re
        const re_off = 56;
        const p_re1 = { x: re_off * nx_low, y: re_off * ny_low };
        const p_re2 = { x: Re * c1 + re_off * nx_low, y: Re * s1 + re_off * ny_low };

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p_re1.x + 8 * nx_low, p_re1.y + 8 * ny_low);
        ctx.moveTo(Re * c1, Re * s1);
        ctx.lineTo(p_re2.x + 8 * nx_low, p_re2.y + 8 * ny_low);
        ctx.stroke();

        this.drawDimensionLine(ctx,
            p_re1, p_re2,
            'Re = ' + Re.toFixed(1),
            '#fbbf24',
            { x: 12 * nx_low, y: 12 * ny_low },
            'center'
        );

        // E. Pitch Cone Angles (δ1, δ2)
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 85, -d1, 0);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('\u03B41 = ' + (g.delta1_deg || (d1 * 180 / Math.PI)).toFixed(1) + '°', 92, -12);

        ctx.strokeStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc(0, 0, 115, -d.sigmaRad, -d1);
        ctx.stroke();
        ctx.fillStyle = '#fb923c';
        ctx.fillText('\u03B42 = ' + (g.delta2_deg || (d2 * 180 / Math.PI)).toFixed(1) + '°', 18, -122);
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

    drawDataCard(ctx, g, bp) {
        ctx.save();
        const cx = 14, cy = 14;
        const cardW = 248, cardH = 188;

        ctx.fillStyle = 'rgba(11, 19, 41, 0.90)';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, cardH, 6) : ctx.rect(cx, cy, cardW, cardH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx, cy, cardW, 25, [6, 6, 0, 0]) : ctx.rect(cx, cy, cardW, 25);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10.5px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('📐 MẶT CẮT TRỤC KHỚP 3D (ISO 23509)', cx + 10, cy + 12.5);

        const x1_str = (g.x1 >= 0 ? '+' : '') + (g.x1 || 0).toFixed(2);
        const x2_str = (g.x2 >= 0 ? '+' : '') + (g.x2 || 0).toFixed(2);
        const rf_val = (0.38 * (bp.mmn || 10)).toFixed(2);
        const items = [
            ['Tỉ số truyền i', (g.i || (g.z2 / g.z1)).toFixed(3)],
            ['Số răng z1 / z2', g.z1 + ' / ' + g.z2],
            ['Mô-đun pháp mmn', (g.mmn || 10).toFixed(1) + ' mm'],
            ['Bán kính lượn R chân', rf_val + ' mm (0.38·m)'],
            ['Góc nón chia δ1 / δ2', (g.delta1_deg || 0).toFixed(1) + '° / ' + (g.delta2_deg || 0).toFixed(1) + '°'],
            ['Bề rộng vành răng b', (g.b || 0).toFixed(1) + ' mm'],
            ['Góc xoắn răng β', (g.beta_deg || 0).toFixed(1) + '°'],
            ['Dịch chỉnh x1 / x2', x1_str + ' / ' + x2_str]
        ];

        ctx.font = '10px system-ui, sans-serif';
        items.forEach((item, idx) => {
            const rowY = cy + 38 + idx * 18;
            ctx.fillStyle = idx === 3 ? '#10b981' : '#94a3b8';
            ctx.fillText(item[0], cx + 10, rowY);
            ctx.fillStyle = idx === 3 ? '#10b981' : '#f1f5f9';
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
