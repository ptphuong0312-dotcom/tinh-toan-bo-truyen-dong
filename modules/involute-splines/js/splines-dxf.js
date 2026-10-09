/**
 * MITCalc Web App - Involute Splines 2D CAD DXF Exporter
 * Generates 100% compliant AutoCAD Release 12 (AC1009) DXF files.
 * Supports Shaft, Hub, and Assembly with:
 *  - True circular arcs (ARC) for tooth tip crests and root lands
 *  - True circular measurement pins (CIRCLE) on dedicated layer
 *  - Clean inspection leader dimensioning (M0, M2, W0, Wb) without intersecting tooth profiles
 *  - Mathematically continuous, single-pass contours without duplicate or stray lines
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
            '0', 'LAYER', '2', 'INSPECTION_DIM', '70', '0', '62', '3', '6', 'CONTINUOUS', // Green dims (distinct from Red Hub)
            '0', 'LAYER', '2', 'INSPECTION_DASH', '70', '0', '62', '6', '6', 'DASHED',    // Magenta dashed circles
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
            // Draw clean single-pass profile composed of true circular ARCs and involute LINEs
            this.drawShaftContour(lines, geom);

            // Inner shaft bore (hole)
            const rBore = (geom.df0 / 2.0) * 0.5;
            this.addCircle(lines, 'CONTOUR_SHAFT', 0, 0, rBore);

            // Shaft Measurement Pins and Dimensions (M0 & W0)
            this.drawShaftInspectionPins(lines, geom);
        }

        // 2. Hub Geometry (Internal Spline)
        if (target === 'hub' || target === 'assembly') {
            // Draw clean single-pass profile composed of true circular ARCs and involute LINEs
            this.drawHubContour(lines, geom);

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

    toCadAngle(x, y) {
        let ang = (Math.atan2(y, x) * 180.0) / Math.PI;
        return (ang % 360.0 + 360.0) % 360.0;
    },

    /**
     * Draw external Shaft profile with zero duplicate/stray lines:
     * - Every tooth tip crest is a true AutoCAD ARC
     * - Every root land between teeth is a true AutoCAD ARC
     * - Involute flanks are discretized LINE segments touching arc endpoints exactly
     */
    drawShaftContour(lines, geom) {
        const z = geom.z0;
        const m = geom.m;
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
        const numFlank = 14;

        const alfaTip = rTip > rBase ? Math.acos(Math.min(1.0, rBase / rTip)) : 0;
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psi + invAlfa - invTip;

        const alfaRoot = rRoot > rBase ? Math.acos(Math.min(1.0, rBase / rRoot)) : 0;
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psi + invAlfa - invRoot;

        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2.0 * Math.PI) / z;

            // 1. Tooth crest ARC at rTip (spans from rotAng - phiTip to rotAng + phiTip)
            const pTipL = [rTip * Math.sin(rotAng - phiTip), rTip * Math.cos(rotAng - phiTip)];
            const pTipR = [rTip * Math.sin(rotAng + phiTip), rTip * Math.cos(rotAng + phiTip)];
            const angTipL = this.toCadAngle(pTipL[0], pTipL[1]);
            const angTipR = this.toCadAngle(pTipR[0], pTipR[1]);
            // In AutoCAD CCW across rotAng (+Y direction): start at right, end at left
            this.addArc(lines, 'CONTOUR_SHAFT', 0, 0, rTip, angTipR, angTipL);

            // 2. Right flank of tooth j: from pTipR down to root land
            let prevP = pTipR;
            for (let step = 1; step <= numFlank; step++) {
                const frac = step / numFlank;
                const r = rTip - (rTip - rRoot) * frac;
                const alfaR = r > rBase ? Math.acos(Math.min(1.0, rBase / r)) : 0;
                const invR = Math.tan(alfaR) - alfaR;
                const phiR = psi + invAlfa - invR;
                const curP = [r * Math.sin(rotAng + phiR), r * Math.cos(rotAng + phiR)];
                this.addLine(lines, 'CONTOUR_SHAFT', prevP[0], prevP[1], curP[0], curP[1]);
                prevP = curP;
            }

            // 3. Root land ARC between tooth j and tooth j+1 (centered at rotAng + tau)
            // Spans from rotAng + phiRoot to rotAng + 2*tau - phiRoot
            const pRootStart = prevP;
            const pRootEnd = [rRoot * Math.sin(rotAng + 2.0 * tau - phiRoot), rRoot * Math.cos(rotAng + 2.0 * tau - phiRoot)];
            const angRootStart = this.toCadAngle(pRootStart[0], pRootStart[1]);
            const angRootEnd = this.toCadAngle(pRootEnd[0], pRootEnd[1]);
            // In AutoCAD CCW: start at angRootEnd, end at angRootStart
            this.addArc(lines, 'CONTOUR_SHAFT', 0, 0, rRoot, angRootEnd, angRootStart);

            // 4. Left flank of tooth j+1: from pRootEnd up to tooth j+1 tip
            const rotNext = rotAng + 2.0 * tau;
            prevP = pRootEnd;
            for (let step = 1; step <= numFlank; step++) {
                const frac = step / numFlank;
                const r = rRoot + (rTip - rRoot) * frac;
                const alfaR = r > rBase ? Math.acos(Math.min(1.0, rBase / r)) : 0;
                const invR = Math.tan(alfaR) - alfaR;
                const phiR = psi + invAlfa - invR;
                const curP = [r * Math.sin(rotNext - phiR), r * Math.cos(rotNext - phiR)];
                this.addLine(lines, 'CONTOUR_SHAFT', prevP[0], prevP[1], curP[0], curP[1]);
                prevP = curP;
            }
        }
    },

    /**
     * Draw internal Hub profile with zero duplicate/stray lines:
     * - Every groove root land is a true AutoCAD ARC
     * - Every internal tooth crest is a true AutoCAD ARC
     * - Involute flanks are discretized LINE segments touching arc endpoints exactly
     */
    drawHubContour(lines, geom) {
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
        const numFlank = 14;

        const alfaTip = rTip > rBase ? Math.acos(Math.min(1.0, rBase / rTip)) : 0;
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psiSpace + invAlfa - invTip;

        const alfaRoot = rRoot > rBase ? Math.acos(Math.min(1.0, rBase / rRoot)) : 0;
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psiSpace + invAlfa - invRoot;

        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2.0 * Math.PI) / z;

            // 1. Groove root ARC at rRoot (spans from rotAng - phiRoot to rotAng + phiRoot)
            const pRootL = [rRoot * Math.sin(rotAng - phiRoot), rRoot * Math.cos(rotAng - phiRoot)];
            const pRootR = [rRoot * Math.sin(rotAng + phiRoot), rRoot * Math.cos(rotAng + phiRoot)];
            const angRootL = this.toCadAngle(pRootL[0], pRootL[1]);
            const angRootR = this.toCadAngle(pRootR[0], pRootR[1]);
            // In AutoCAD CCW across rotAng: start at right, end at left
            this.addArc(lines, 'CONTOUR_HUB', 0, 0, rRoot, angRootR, angRootL);

            // 2. Right flank of groove j: from pRootR down to inner tip crest
            let prevP = pRootR;
            for (let step = 1; step <= numFlank; step++) {
                const frac = step / numFlank;
                const r = rRoot - (rRoot - rTip) * frac;
                const alfaR = r > rBase ? Math.acos(Math.min(1.0, rBase / r)) : 0;
                const invR = Math.tan(alfaR) - alfaR;
                const phiR = psiSpace + invAlfa - invR;
                const curP = [r * Math.sin(rotAng + phiR), r * Math.cos(rotAng + phiR)];
                this.addLine(lines, 'CONTOUR_HUB', prevP[0], prevP[1], curP[0], curP[1]);
                prevP = curP;
            }

            // 3. Tooth crest ARC at rTip between groove j and groove j+1 (centered at rotAng + tau)
            // Spans from rotAng + phiTip to rotAng + 2*tau - phiTip
            const pCrestStart = prevP;
            const pCrestEnd = [rTip * Math.sin(rotAng + 2.0 * tau - phiTip), rTip * Math.cos(rotAng + 2.0 * tau - phiTip)];
            const angCrestStart = this.toCadAngle(pCrestStart[0], pCrestStart[1]);
            const angCrestEnd = this.toCadAngle(pCrestEnd[0], pCrestEnd[1]);
            // In AutoCAD CCW: start at angCrestEnd, end at angCrestStart
            this.addArc(lines, 'CONTOUR_HUB', 0, 0, rTip, angCrestEnd, angCrestStart);

            // 4. Left flank of groove j+1: from pCrestEnd up to groove j+1 root
            const rotNext = rotAng + 2.0 * tau;
            prevP = pCrestEnd;
            for (let step = 1; step <= numFlank; step++) {
                const frac = step / numFlank;
                const r = rTip + (rRoot - rTip) * frac;
                const alfaR = r > rBase ? Math.acos(Math.min(1.0, rBase / r)) : 0;
                const invR = Math.tan(alfaR) - alfaR;
                const phiR = psiSpace + invAlfa - invR;
                const curP = [r * Math.sin(rotNext - phiR), r * Math.cos(rotNext - phiR)];
                this.addLine(lines, 'CONTOUR_HUB', prevP[0], prevP[1], curP[0], curP[1]);
                prevP = curP;
            }
        }
    },

    /**
     * Draw circular measurement pins and dimensions for Shaft (M0 & W0)
     */
    drawShaftInspectionPins(lines, geom) {
        const dt = geom.dt0 || (1.75 * geom.m);
        const rPin = dt / 2.0;
        const rCenter = (geom.M0 - dt) / 2.0;
        const pi = Math.PI;

        // Concentric measurement circle through outermost point (Radius = M0 / 2)
        this.addCircle(lines, 'INSPECTION_DASH', 0, 0, geom.M0 / 2.0);

        // Place pin in top tooth space (tau = pi / z)
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

        // Clean leader pointing outward from top pin into empty space (no lines crossing profile)
        const lblAng = pi / geom.z0;
        const pOuterX = (geom.M0 / 2.0) * Math.sin(lblAng);
        const pOuterY = (geom.M0 / 2.0) * Math.cos(lblAng);
        const pExtX = pOuterX + 15.0;
        const pExtY = pOuterY + 12.0;
        this.addLine(lines, 'INSPECTION_DIM', pOuterX, pOuterY, pExtX, pExtY);
        this.addLine(lines, 'INSPECTION_DIM', pExtX, pExtY, pExtX + 35.0, pExtY);
        this.addText(lines, 'INSPECTION_DIM', `M0 = ${geom.M0.toFixed(4)} mm (dp = ${dt.toFixed(3)})`, pExtX + 2.0, pExtY + 1.5, 2.8);

        // Common normal length dimension W0 note in clear space
        const w0ExtX = pExtX + 2.0;
        const w0ExtY = pExtY - 4.5;
        this.addText(lines, 'INSPECTION_DIM', `W0 = ${geom.W0.toFixed(4)} mm (k = ${geom.k0})`, w0ExtX, w0ExtY, 2.5);
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

        // Clean leader pointing outward from top pin (cx1, cy1) into clear space
        // NO lines crossing through the hub body!
        const pOuterX = 0.0;
        const pOuterY = cy1 + rPin;
        const pExtX = pOuterX + 15.0;
        const pExtY = pOuterY + 12.0;
        this.addLine(lines, 'INSPECTION_DIM', pOuterX, pOuterY, pExtX, pExtY);
        this.addLine(lines, 'INSPECTION_DIM', pExtX, pExtY, pExtX + 38.0, pExtY);
        this.addText(lines, 'INSPECTION_DIM', `M2 = ${geom.M2.toFixed(4)} mm (dp = ${dt.toFixed(3)})`, pExtX + 2.0, pExtY + 1.5, 2.8);

        // Wb note placed cleanly right below M2 shelf
        const wbVal = (geom.W_bi2 || geom.W2).toFixed(4);
        this.addText(lines, 'INSPECTION_DIM', `Wb = ${wbVal} mm (k = ${k2})`, pExtX + 2.0, pExtY - 4.5, 2.5);
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
        this.addText(lines, 'MFG_TABLE', '', xTable, yCurr, 2.0); // anchor
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
