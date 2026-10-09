/**
 * MITCalc Web App - Involute Splines 2D CAD DXF Exporter
 * Generates 100% compliant AutoCAD Release 12 (AC1009) DXF files.
 * Supports Shaft, Hub, and Assembly with:
 *  - True circular arcs for tooth tip and root
 *  - Circular measurement pins (CIRCLE)
 *  - Complete inspection dimensions (M0, M2, W0, Wb)
 *  - Non-overlapping manufacturing specification table
 */

export const SplinesDxf = {
    generateDXF(geom, target = 'assembly') {
        if (!geom) return '';

        const lines = [];

        // 1. Header Section
        lines.push(
            '0', 'SECTION',
            '2', 'HEADER',
            '9', '$ACADVER',
            '1', 'AC1009',
            '9', '$INSBASE',
            '10', '0.0', '20', '0.0', '30', '0.0',
            '9', '$EXTMIN',
            '10', '-500.0', '20', '-500.0', '30', '0.0',
            '9', '$EXTMAX',
            '10', '500.0', '20', '500.0', '30', '0.0',
            '9', '$DWGCODEPAGE',
            '3', 'ANSI_1252',
            '0', 'ENDSEC'
        );

        // 2. Tables Section
        lines.push(
            '0', 'SECTION',
            '2', 'TABLES',
            '0', 'TABLE',
            '2', 'LTYPE',
            '70', '3',
            '0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0.0',
            '0', 'LTYPE', '2', 'CENTER', '70', '0', '3', 'Center ____ _ ____', '72', '65', '73', '4', '40', '50.0',
            '49', '31.75', '49', '-6.35', '49', '6.35', '49', '-6.35',
            '0', 'LTYPE', '2', 'DASHED', '70', '0', '3', 'Dashed __ __ __', '72', '65', '73', '2', '40', '19.05',
            '49', '12.7', '49', '-6.35',
            '0', 'ENDTAB',
            '0', 'TABLE',
            '2', 'LAYER',
            '70', '10',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'CONTOUR_SHAFT', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'CONTOUR_HUB', '70', '0', '62', '1', '6', 'CONTINUOUS',   // Red
            '0', 'LAYER', '2', 'PITCH_CIRCLE', '70', '0', '62', '3', '6', 'CENTER',       // Green
            '0', 'LAYER', '2', 'BASE_CIRCLE', '70', '0', '62', '6', '6', 'DASHED',       // Magenta
            '0', 'LAYER', '2', 'CENTER', '70', '0', '62', '2', '6', 'CENTER',             // Yellow
            '0', 'LAYER', '2', 'MEASUREMENT_PIN', '70', '0', '62', '2', '6', 'CONTINUOUS',// Yellow circle pins
            '0', 'LAYER', '2', 'INSPECTION_DIM', '70', '0', '62', '1', '6', 'CONTINUOUS', // Red inspection dims
            '0', 'LAYER', '2', 'INSPECTION_DASH', '70', '0', '62', '1', '6', 'DASHED',    // Red dashed inspection circles
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',     // White
            '0', 'ENDTAB',
            '0', 'ENDSEC'
        );

        // 3. Blocks Section
        lines.push(
            '0', 'SECTION',
            '2', 'BLOCKS',
            '0', 'ENDSEC'
        );

        // 4. Entities Section
        lines.push(
            '0', 'SECTION',
            '2', 'ENTITIES'
        );

        const z = geom.z0;
        const m = geom.m;
        const d = geom.d0;
        const db = geom.db0;
        const rMax = Math.max(geom.da0, geom.dri2) * 0.75;

        // Draw Centerlines
        this.addLine(lines, 'CENTER', -rMax * 1.25, 0, rMax * 1.25, 0);
        this.addLine(lines, 'CENTER', 0, -rMax * 1.25, 0, rMax * 1.25);

        // Draw Pitch Circle & Base Circle
        this.addCircle(lines, 'PITCH_CIRCLE', 0, 0, d / 2.0);
        this.addCircle(lines, 'BASE_CIRCLE', 0, 0, db / 2.0);

        // 1. Shaft Geometry (External Spline)
        if (target === 'shaft' || target === 'assembly') {
            const shaftPoints = this.buildShaftContour(geom);
            this.addPolyline(lines, 'CONTOUR_SHAFT', shaftPoints, true);
            
            // Add explicit true circular arcs for shaft tip and root
            this.addShaftTrueArcs(lines, geom);

            // Inner shaft bore (hole)
            const rBore = (geom.df0 / 2.0) * 0.5;
            this.addCircle(lines, 'CONTOUR_SHAFT', 0, 0, rBore);

            // Shaft Measurement Pins and Dimensions (M0 & W0)
            this.drawShaftInspectionPins(lines, geom);
        }

        // 2. Hub Geometry (Internal Spline)
        if (target === 'hub' || target === 'assembly') {
            const hubPoints = this.buildHubContour(geom);
            this.addPolyline(lines, 'CONTOUR_HUB', hubPoints, true);

            // Add explicit true circular arcs for hub tip and root
            this.addHubTrueArcs(lines, geom);

            // Outer hub collar
            const rCollar = (geom.dri2 / 2.0) * 1.35;
            this.addCircle(lines, 'CONTOUR_HUB', 0, 0, rCollar);

            // Hub Measurement Pins and Dimensions (M2 & Wb)
            this.drawHubInspectionPins(lines, geom);
        }

        // 3. Manufacturing Specification Table
        this.drawMfgTable(lines, geom, target, rMax);

        lines.push(
            '0', 'ENDSEC',
            '0', 'EOF'
        );

        return lines.join('\n');
    },

    addLine(lines, layer, x1, y1, x2, y2) {
        lines.push(
            '0', 'LINE',
            '8', layer,
            '10', x1.toFixed(4),
            '20', y1.toFixed(4),
            '30', '0.0',
            '11', x2.toFixed(4),
            '21', y2.toFixed(4),
            '31', '0.0'
        );
    },

    addCircle(lines, layer, cx, cy, r) {
        lines.push(
            '0', 'CIRCLE',
            '8', layer,
            '10', cx.toFixed(4),
            '20', cy.toFixed(4),
            '30', '0.0',
            '40', r.toFixed(4)
        );
    },

    addArc(lines, layer, cx, cy, r, startAngleDeg, endAngleDeg) {
        let a1 = startAngleDeg % 360;
        if (a1 < 0) a1 += 360;
        let a2 = endAngleDeg % 360;
        if (a2 < 0) a2 += 360;
        lines.push(
            '0', 'ARC',
            '8', layer,
            '10', cx.toFixed(4),
            '20', cy.toFixed(4),
            '30', '0.0',
            '40', r.toFixed(4),
            '50', a1.toFixed(4),
            '51', a2.toFixed(4)
        );
    },

    addText(lines, layer, text, x, y, height = 2.5) {
        lines.push(
            '0', 'TEXT',
            '8', layer,
            '10', x.toFixed(4),
            '20', y.toFixed(4),
            '30', '0.0',
            '40', height.toFixed(4),
            '1', String(text)
        );
    },

    addPolyline(lines, layer, pts, isClosed = true) {
        lines.push(
            '0', 'POLYLINE',
            '8', layer,
            '66', '1',
            '70', isClosed ? '1' : '0'
        );
        pts.forEach(p => {
            lines.push(
                '0', 'VERTEX',
                '8', layer,
                '10', p[0].toFixed(4),
                '20', p[1].toFixed(4),
                '30', '0.0'
            );
        });
        lines.push('0', 'SEQEND', '8', layer);
    },

    /**
     * Add true circular arcs for Shaft tip crests and root lands
     */
    addShaftTrueArcs(lines, geom) {
        const z = geom.z0;
        const alfaRad = (geom.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = geom.d0;
        const db = geom.db0;
        const da = geom.da0;
        const df = geom.df0;
        const s = geom.s0;

        const rBase = db / 2.0;
        const rTip = da / 2.0;
        const rRoot = df / 2.0;
        const tau = Math.PI / z;
        const psi = s / d;

        let alfaTip = Math.acos(Math.min(1.0, rBase / rTip));
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psi + invAlfa - invTip;

        let alfaStart = rRoot > rBase ? Math.acos(rBase / rRoot) : 0;
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psi + invAlfa - invStart;

        // Radians to DXF standard degrees (counter-clockwise from +X axis)
        // In our polar representation: X = r*sin(theta), Y = r*cos(theta), so polar angle from +X is 90 deg - theta
        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2 * Math.PI) / z;
            
            // Tip crest arc: from -phiTip to +phiTip around rotAng
            const tipAngleCenter = (Math.PI / 2.0 - rotAng) * (180.0 / Math.PI);
            const tipSpanDeg = (2.0 * phiTip) * (180.0 / Math.PI);
            this.addArc(lines, 'CONTOUR_SHAFT', 0, 0, rTip, tipAngleCenter - tipSpanDeg / 2.0, tipAngleCenter + tipSpanDeg / 2.0);

            // Root land arc between teeth: from +phiStart of tooth j to (2*tau - phiStart) of next tooth
            const rootAngleCenter = (Math.PI / 2.0 - (rotAng + tau)) * (180.0 / Math.PI);
            const rootSpanDeg = (2.0 * (tau - phiStart)) * (180.0 / Math.PI);
            if (rootSpanDeg > 0.1) {
                this.addArc(lines, 'CONTOUR_SHAFT', 0, 0, rRoot, rootAngleCenter - rootSpanDeg / 2.0, rootAngleCenter + rootSpanDeg / 2.0);
            }
        }
    },

    /**
     * Add true circular arcs for Hub tip crests and root lands
     */
    addHubTrueArcs(lines, geom) {
        const z = geom.z0;
        const m = geom.m;
        const alfaRad = (geom.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = geom.d2 || geom.d0;
        const db = geom.db2 || geom.db0;
        const dri = geom.dri2;
        const di = geom.di2;
        const s2 = geom.s2;
        const e2 = Math.PI * m - s2;

        const rBase = db / 2.0;
        const rRoot = dri / 2.0;
        const rTip = di / 2.0;
        const tau = Math.PI / z;
        const psiSpace = e2 / d;

        let alfaStart = rTip > rBase ? Math.acos(rBase / rTip) : 0;
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psiSpace + invAlfa - invStart;

        let alfaRoot = rRoot > rBase ? Math.acos(rBase / rRoot) : 0;
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psiSpace + invAlfa - invRoot;

        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2 * Math.PI) / z;

            // Groove bottom arc: from -phiRoot to +phiRoot around rotAng
            const grooveAngleCenter = (Math.PI / 2.0 - rotAng) * (180.0 / Math.PI);
            const grooveSpanDeg = (2.0 * phiRoot) * (180.0 / Math.PI);
            this.addArc(lines, 'CONTOUR_HUB', 0, 0, rRoot, grooveAngleCenter - grooveSpanDeg / 2.0, grooveAngleCenter + grooveSpanDeg / 2.0);

            // Inner crest arc between grooves: around rotAng + tau
            const crestAngleCenter = (Math.PI / 2.0 - (rotAng + tau)) * (180.0 / Math.PI);
            const crestSpanDeg = (2.0 * (tau - phiStart)) * (180.0 / Math.PI);
            if (crestSpanDeg > 0.1) {
                this.addArc(lines, 'CONTOUR_HUB', 0, 0, rTip, crestAngleCenter - crestSpanDeg / 2.0, crestAngleCenter + crestSpanDeg / 2.0);
            }
        }
    },

    /**
     * Draw circular measurement pins and dimensions for Shaft
     */
    drawShaftInspectionPins(lines, geom) {
        const dt = geom.dt0 || (1.75 * geom.m);
        const rPin = dt / 2.0;
        const rCenter = (geom.M0 - dt) / 2.0;
        const pi = Math.PI;

        // Concentric measurement circle through outermost point (Radius = M0 / 2)
        this.addCircle(lines, 'INSPECTION_DASH', 0, 0, geom.M0 / 2.0);

        // Place pins: top space at pi/z, and opposite space if even z
        const angles = (geom.z0 % 2 === 0) ? [pi / geom.z0, pi / geom.z0 + pi] : [pi / geom.z0];

        angles.forEach(ang => {
            const cx = rCenter * Math.sin(ang);
            const cy = rCenter * Math.cos(ang);
            // Circle pin entity
            this.addCircle(lines, 'MEASUREMENT_PIN', cx, cy, rPin);
            // Center cross
            const s = rPin * 0.35;
            this.addLine(lines, 'MEASUREMENT_PIN', cx - s, cy, cx + s, cy);
            this.addLine(lines, 'MEASUREMENT_PIN', cx, cy - s, cx, cy + s);
        });

        // Dimension leader and text for M0
        const lblAng = pi / geom.z0;
        const pOuterX = (geom.M0 / 2.0) * Math.sin(lblAng);
        const pOuterY = (geom.M0 / 2.0) * Math.cos(lblAng);
        const pExtX = pOuterX + 15.0;
        const pExtY = pOuterY + 12.0;
        this.addLine(lines, 'INSPECTION_DIM', pOuterX, pOuterY, pExtX, pExtY);
        this.addLine(lines, 'INSPECTION_DIM', pExtX, pExtY, pExtX + 35.0, pExtY);
        this.addText(lines, 'INSPECTION_DIM', `M0 = ${geom.M0.toFixed(4)} mm (dp = ${dt.toFixed(3)})`, pExtX + 2.0, pExtY + 1.5, 2.8);

        // Common normal length dimension W0 leader and text
        const w0ExtX = -rCenter * 0.8;
        const w0ExtY = (geom.da0 / 2.0) * 1.05;
        this.addText(lines, 'INSPECTION_DIM', `W0 = ${geom.W0.toFixed(4)} mm (k = ${geom.k0})`, w0ExtX, w0ExtY, 2.8);
    },

    /**
     * Draw circular measurement pins and dimensions for Hub (M2 & Wb)
     */
    drawHubInspectionPins(lines, geom) {
        const dt = geom.dt2 || geom.dt0 || (1.75 * geom.m);
        const rPin = dt / 2.0;
        const rCenter = (geom.ds2 || Math.abs(geom.M2 + dt)) / 2.0;
        const k2 = geom.k2 || 3;
        const pi = Math.PI;

        // Concentric measurement circle through innermost point (Radius = M2 / 2)
        this.addCircle(lines, 'INSPECTION_DASH', 0, 0, geom.M2 / 2.0);

        // Two balls placed in hub tooth spaces across k teeth
        const ang1 = 0.0;
        const ang2 = (2.0 * pi * k2) / geom.z0;

        const cx1 = rCenter * Math.sin(ang1);
        const cy1 = rCenter * Math.cos(ang1);
        const cx2 = rCenter * Math.sin(ang2);
        const cy2 = rCenter * Math.cos(ang2);

        // Draw the 2 pin circles
        this.addCircle(lines, 'MEASUREMENT_PIN', cx1, cy1, rPin);
        this.addCircle(lines, 'MEASUREMENT_PIN', cx2, cy2, rPin);

        // Pin center crosses
        const s = rPin * 0.35;
        this.addLine(lines, 'MEASUREMENT_PIN', cx1 - s, cy1, cx1 + s, cy1);
        this.addLine(lines, 'MEASUREMENT_PIN', cx1, cy1 - s, cx1, cy1 + s);
        this.addLine(lines, 'MEASUREMENT_PIN', cx2 - s, cy2, cx2 + s, cy2);
        this.addLine(lines, 'MEASUREMENT_PIN', cx2, cy2 - s, cx2, cy2 + s);

        // Calculate furthest outermost points of the two balls (Wb)
        const dx = cx2 - cx1;
        const dy = cy2 - cy1;
        const dist = Math.hypot(dx, dy) || 1e-6;
        const ux = dx / dist;
        const uy = dy / dist;

        const pOut1X = cx1 - ux * rPin;
        const pOut1Y = cy1 - uy * rPin;
        const pOut2X = cx2 + ux * rPin;
        const pOut2Y = cy2 + uy * rPin;

        // Dimension line across 2 balls (Wb)
        this.addLine(lines, 'INSPECTION_DIM', pOut1X, pOut1Y, pOut2X, pOut2Y);

        // Perpendicular boundary ticks
        const tickLen = 6.0;
        const nx = -uy * tickLen;
        const ny = ux * tickLen;
        this.addLine(lines, 'INSPECTION_DIM', pOut1X - nx, pOut1Y - ny, pOut1X + nx, pOut1Y + ny);
        this.addLine(lines, 'INSPECTION_DIM', pOut2X - nx, pOut2Y - ny, pOut2X + nx, pOut2Y + ny);

        // Wb Dimension text
        const midX = (pOut1X + pOut2X) / 2.0;
        const midY = (pOut1Y + pOut2Y) / 2.0;
        const wbVal = (geom.W_bi2 || geom.W2).toFixed(4);
        this.addText(lines, 'INSPECTION_DIM', `Wb = ${wbVal} mm (k = ${k2})`, midX + nx * 0.8, midY + ny * 0.8, 2.8);

        // M2 Dimension leader and text
        const m2ExtX = -(geom.di2 / 2.0) * 1.1;
        const m2ExtY = -(geom.di2 / 2.0) * 0.8;
        this.addText(lines, 'INSPECTION_DIM', `M2 = ${geom.M2.toFixed(4)} mm (dp = ${dt.toFixed(3)})`, m2ExtX, m2ExtY, 2.8);
    },

    /**
     * Build full 360-degree closed conjugate contour for external shaft spline
     */
    buildShaftContour(geom) {
        const z = geom.z0;
        const alfaRad = (geom.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = geom.d0;
        const db = geom.db0;
        const da = geom.da0;
        const df = geom.df0;
        const s = geom.s0;

        const rBase = db / 2.0;
        const rTip = da / 2.0;
        const rRoot = df / 2.0;
        const tau = Math.PI / z;
        const psi = s / d;

        const rStart = Math.max(rBase, rRoot);
        const rEnd = rTip;
        const numFlank = 16;

        // 1. One tooth sector in polar (r, theta)
        const secPts = [];
        let alfaStart = 0;
        if (rStart > rBase) alfaStart = Math.acos(rBase / rStart);
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psi + invAlfa - invStart;

        // Root bottom arc on left
        secPts.push([rRoot, -tau]);
        if (phiStart < tau) {
            secPts.push([rRoot, -phiStart]);
        }

        // Left involute flank
        for (let i = 0; i <= numFlank; i++) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(rBase / r);
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psi + invAlfa - invR;
            secPts.push([r, -phi]);
        }

        // Pure smooth circular crest arc at rTip
        let alfaTip = Math.acos(Math.min(1.0, rBase / rTip));
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psi + invAlfa - invTip;

        secPts.push([rTip, -phiTip]);
        secPts.push([rTip, 0.0]);
        secPts.push([rTip, phiTip]);

        // Right involute flank
        for (let i = numFlank; i >= 0; i--) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(rBase / r);
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psi + invAlfa - invR;
            secPts.push([r, phi]);
        }

        // Root bottom arc on right
        if (phiStart < tau) {
            secPts.push([rRoot, phiStart]);
        }
        secPts.push([rRoot, tau]);

        // 2. Replicate sector around 360 degrees
        const fullPts = [];
        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2 * Math.PI) / z;
            for (let i = 0; i < secPts.length; i++) {
                const totalTheta = rotAng + secPts[i][1];
                const px = secPts[i][0] * Math.sin(totalTheta);
                const py = secPts[i][0] * Math.cos(totalTheta);
                fullPts.push([px, py]);
            }
        }
        return fullPts;
    },

    /**
     * Build full 360-degree closed conjugate contour for internal hub spline
     */
    buildHubContour(geom) {
        const z = geom.z0;
        const m = geom.m;
        const alfaRad = (geom.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = geom.d2 || geom.d0;
        const db = geom.db2 || geom.db0;
        const dri = geom.dri2;
        const di = geom.di2;
        const s2 = geom.s2;
        const e2 = Math.PI * m - s2;

        const rBase = db / 2.0;
        const rRoot = dri / 2.0;
        const rTip = di / 2.0;
        const tau = Math.PI / z;
        const psiSpace = e2 / d;

        const rStart = Math.max(rBase, rTip);
        const rEnd = rRoot;
        const numFlank = 16;

        const secPts = [];
        let alfaStart = 0;
        if (rStart > rBase) alfaStart = Math.acos(rBase / rStart);
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psiSpace + invAlfa - invStart;

        // Inner crest arc on left: pure smooth circular arc at rTip
        secPts.push([rTip, -tau]);
        if (phiStart < tau) {
            secPts.push([rTip, -phiStart]);
        }

        // Left internal flank
        for (let i = 0; i <= numFlank; i++) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(rBase / r);
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psiSpace + invAlfa - invR;
            secPts.push([r, -phi]);
        }

        // Outer root groove bottom: pure smooth circular arc at rRoot
        let alfaRoot = 0;
        if (rRoot > rBase) alfaRoot = Math.acos(rBase / rRoot);
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psiSpace + invAlfa - invRoot;
        secPts.push([rRoot, -phiRoot]);
        secPts.push([rRoot, 0.0]);
        secPts.push([rRoot, phiRoot]);

        // Right internal flank
        for (let i = numFlank; i >= 0; i--) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(rBase / r);
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psiSpace + invAlfa - invR;
            secPts.push([r, phi]);
        }

        // Inner crest arc on right: pure smooth circular arc at rTip
        if (phiStart < tau) {
            secPts.push([rTip, phiStart]);
        }
        secPts.push([rTip, tau]);

        // Replicate space around 360 degrees
        const fullPts = [];
        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2 * Math.PI) / z;
            for (let i = 0; i < secPts.length; i++) {
                const totalTheta = rotAng + secPts[i][1];
                const px = secPts[i][0] * Math.sin(totalTheta);
                const py = secPts[i][0] * Math.cos(totalTheta);
                fullPts.push([px, py]);
            }
        }
        return fullPts;
    },

    /**
     * Draw manufacturing specification table with non-overlapping columns and grid lines
     */
    drawMfgTable(lines, geom, target, rMax) {
        const xTable = rMax * 1.25 + 20.0;
        const yTable = rMax * 0.85;
        const wCol1 = 118.0;
        const wCol2 = 82.0;
        const wTotal = wCol1 + wCol2; // 200.0 mm
        const rowH = 7.0;

        const tableRows = [
            ['Tieu Chuan / Standard', 'DIN 5480 / ISO 4156 / ANSI B92.1'],
            ['So Rang / Number of teeth (z)', `${geom.z0}`],
            ['Mo-dun / Module (m)', `${geom.m.toFixed(4)} mm`],
            ['Goc An Khop / Pressure angle', `${geom.alfa.toFixed(2)} deg`],
            ['Duong Kinh Chia / Pitch diam. (d)', `${geom.d0.toFixed(4)} mm`],
            ['Duong Kinh Co So / Base diam. (db)', `${geom.db0.toFixed(4)} mm`],
            ['Duong Kinh Dinh Truc / Shaft tip (da0)', `${geom.da0.toFixed(4)} mm`],
            ['Duong Kinh Day Truc / Shaft root (df0)', `${geom.df0.toFixed(4)} mm`],
            ['Duong Kinh Dinh Lo / Hub tip (Di)', `${geom.di2.toFixed(4)} mm`],
            ['Duong Kinh Day Lo / Hub root (Dri)', `${geom.dri2.toFixed(4)} mm`],
            ['Chieu Day Rang / Tooth thickness (s0)', `${geom.s0.toFixed(4)} mm`],
            ['Phap Tuyen Chung / Norm. length (W0)', `${geom.W0.toFixed(4)} mm (k=${geom.k0})`],
            ['Do Bi Ngoai Truc / Over-pin (M0)', `${geom.M0.toFixed(4)} mm (dp=${geom.dt0.toFixed(3)})`],
            ['Do Bi Trong Lo / Between-pin (M2)', `${geom.M2.toFixed(4)} mm (dp=${geom.dt2.toFixed(3)})`],
            ['Phap Tuyen 2 Bi Lo / 2-Pin Dist (Wb)', `${(geom.W_bi2 || geom.W2).toFixed(4)} mm (k=${geom.k2})`]
        ];

        // Table Title Box
        this.addLine(lines, 'MFG_TABLE', xTable, yTable + 11.0, xTable + wTotal, yTable + 11.0);
        this.addText(lines, 'MFG_TABLE', 'BANG THONG SO CHE TAO THEN HOA THAN KHAI', xTable + 12.0, yTable + 3.5, 3.8);
        this.addLine(lines, 'MFG_TABLE', xTable, yTable, xTable + wTotal, yTable);

        // Table Rows & Cells
        let yCurr = yTable;
        tableRows.forEach(r => {
            const yNext = yCurr - rowH;
            // Column 1 text (Param name)
            this.addText(lines, 'MFG_TABLE', r[0], xTable + 4.0, yCurr - 5.0, 2.5);
            // Column 2 text (Value)
            this.addText(lines, 'MFG_TABLE', r[1], xTable + wCol1 + 4.0, yCurr - 5.0, 2.5);
            // Horizontal grid line
            this.addLine(lines, 'MFG_TABLE', xTable, yNext, xTable + wTotal, yNext);
            yCurr = yNext;
        });

        // Vertical Column Divider line
        this.addLine(lines, 'MFG_TABLE', xTable + wCol1, yTable, xTable + wCol1, yCurr);

        // Outer Borders
        this.addLine(lines, 'MFG_TABLE', xTable, yTable + 11.0, xTable, yCurr);
        this.addLine(lines, 'MFG_TABLE', xTable + wTotal, yTable + 11.0, xTable + wTotal, yCurr);
    },

    downloadDxf(geom, target = 'assembly') {
        const dxfText = this.generateDXF(geom, target);
        const blob = new Blob([dxfText], { type: 'application/dxf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `splines_${target}_z${geom.z0}_m${geom.m}.dxf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
