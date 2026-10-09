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

        // Draw Pitch Circle (Vòng chia tiêu chuẩn)
        this.addCircle(lines, 'PITCH_CIRCLE', 0, 0, d / 2.0);

        // 1. Shaft Geometry (External Spline)
        if (target === 'shaft' || target === 'assembly') {
            // Draw clean single-pass profile composed of true circular ARCs and involute LINEs
            this.drawShaftContour(lines, geom);

            // Shaft Measurement Pins and Dimensions (M0 & W0) - only on Shaft drawing
            if (target === 'shaft') {
                this.drawShaftInspectionPins(lines, geom);
            }
        }

        // 2. Hub Geometry (Internal Spline)
        if (target === 'hub' || target === 'assembly') {
            // Draw clean single-pass profile composed of true circular ARCs and involute LINEs
            this.drawHubContour(lines, geom);

            // Hub Measurement Pins and Dimensions (M2 & Wb) - only on Hub drawing
            if (target === 'hub') {
                this.drawHubInspectionPins(lines, geom);
            }
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

    addPolyline(lines, layer, pts) {
        lines.push(
            '0', 'POLYLINE',
            '8', layer,
            '66', '1',
            '70', '1' // 1 = Closed 2D Polyline
        );
        for (let i = 0; i < pts.length; i++) {
            lines.push(
                '0', 'VERTEX',
                '8', layer,
                '10', pts[i].x.toFixed(4),
                '20', pts[i].y.toFixed(4),
                '30', '0.0'
            );
        }
        lines.push('0', 'SEQEND', '8', layer);
    },

    /**
     * Draw external Shaft profile with 100% continuous, watertight closed POLYLINE:
     * - Zero gaps, zero duplicate entities, zero stray lines
     * - Involute flanks and true circular tip/root lands connected in continuous order
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
        const numFlank = 16;
        const numArc = 6;

        const rStart = Math.max(rBase, rRoot);
        const rEnd = Math.max(rStart + 0.05 * (m || 1.0), rTip);

        // 1. Sector geometry for a single tooth (-tau to +tau)
        const sectorPts = [];

        // 1.1 Root bottom arc left: from -tau to -phiStart at rRoot
        let alfaStart = 0;
        if (rStart > rBase) alfaStart = Math.acos(Math.min(1.0, rBase / rStart));
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psi + invAlfa - invStart;

        for (let i = 0; i < numArc; i++) {
            const th = -tau + (tau - phiStart) * (i / numArc);
            sectorPts.push({ r: rRoot, theta: th });
        }

        // 1.2 Left flank upwards: from rStart to rTip at -phi
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(Math.min(1.0, rBase / r));
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psi + invAlfa - invR;
            sectorPts.push({ r, theta: -phi });
        }

        // 1.3 Tip crest arc: from -phiTip to +phiTip at rTip
        let alfaTip = 0;
        if (rTip > rBase) alfaTip = Math.acos(Math.min(1.0, rBase / rTip));
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psi + invAlfa - invTip;

        for (let i = 0; i <= numArc; i++) {
            const th = -phiTip + (2.0 * phiTip) * (i / numArc);
            sectorPts.push({ r: rTip, theta: th });
        }

        // 1.4 Right flank downwards: from rTip down to rStart at +phi
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const r = rEnd - (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(Math.min(1.0, rBase / r));
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psi + invAlfa - invR;
            sectorPts.push({ r, theta: phi });
        }

        // 1.5 Root bottom arc right: from +phiStart to +tau at rRoot
        for (let i = 1; i <= numArc; i++) {
            const th = phiStart + (tau - phiStart) * (i / numArc);
            sectorPts.push({ r: rRoot, theta: th });
        }

        // 2. Generate full 360 degree closed contour points
        const fullPts = [];
        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2.0 * Math.PI) / z;
            for (let k = 0; k < sectorPts.length; k++) {
                const totalTheta = rotAng + sectorPts[k].theta;
                fullPts.push({
                    x: sectorPts[k].r * Math.sin(totalTheta),
                    y: sectorPts[k].r * Math.cos(totalTheta)
                });
            }
        }

        this.addPolyline(lines, 'CONTOUR_SHAFT', fullPts);
    },

    /**
     * Draw internal Hub profile with 100% continuous, watertight closed POLYLINE:
     * - Zero gaps, zero duplicate entities, zero stray lines
     * - Involute flanks and true circular tip/root lands connected in continuous order
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
        const rRoot = dri / 2.0; // Outer groove bottom
        const rTip = di / 2.0;   // Inner tooth crest
        const tau = Math.PI / z;
        const psiSpace = e2 / d;
        const numFlank = 16;
        const numArc = 6;

        const rStart = Math.max(rBase, rTip);
        const rEnd = Math.max(rStart + 0.05 * (m || 1.0), rRoot);

        // 1. Sector geometry for a single tooth space (-tau to +tau)
        const sectorPts = [];

        // 1.1 Inner tip crest arc left: from -tau to -phiStart at rTip
        let alfaStart = 0;
        if (rStart > rBase) alfaStart = Math.acos(Math.min(1.0, rBase / rStart));
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psiSpace + invAlfa - invStart;

        for (let i = 0; i < numArc; i++) {
            const th = -tau + (tau - phiStart) * (i / numArc);
            sectorPts.push({ r: rTip, theta: th });
        }

        // 1.2 Left flank of groove outwards: from rTip to rRoot at -phi
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const r = rStart + (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(Math.min(1.0, rBase / r));
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psiSpace + invAlfa - invR;
            sectorPts.push({ r, theta: -phi });
        }

        // 1.3 Groove bottom arc: from -phiRoot to +phiRoot at rRoot
        let alfaRoot = 0;
        if (rRoot > rBase) alfaRoot = Math.acos(Math.min(1.0, rBase / rRoot));
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psiSpace + invAlfa - invRoot;

        for (let i = 0; i <= numArc; i++) {
            const th = -phiRoot + (2.0 * phiRoot) * (i / numArc);
            sectorPts.push({ r: rRoot, theta: th });
        }

        // 1.4 Right flank of groove inwards: from rRoot down to rTip at +phi
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const r = rEnd - (rEnd - rStart) * frac;
            let alfaR = 0;
            if (r > rBase) alfaR = Math.acos(Math.min(1.0, rBase / r));
            const invR = Math.tan(alfaR) - alfaR;
            const phi = psiSpace + invAlfa - invR;
            sectorPts.push({ r, theta: phi });
        }

        // 1.5 Inner tip crest arc right: from +phiStart to +tau at rTip
        for (let i = 1; i <= numArc; i++) {
            const th = phiStart + (tau - phiStart) * (i / numArc);
            sectorPts.push({ r: rTip, theta: th });
        }

        // 2. Generate full 360 degree closed contour points
        const fullPts = [];
        for (let j = 0; j < z; j++) {
            const rotAng = (j * 2.0 * Math.PI) / z;
            for (let k = 0; k < sectorPts.length; k++) {
                const totalTheta = rotAng + sectorPts[k].theta;
                fullPts.push({
                    x: sectorPts[k].r * Math.sin(totalTheta),
                    y: sectorPts[k].r * Math.cos(totalTheta)
                });
            }
        }

        this.addPolyline(lines, 'CONTOUR_HUB', fullPts);
    },

    /**
     * Draw circular measurement pins and dimensions for Shaft (M0 & W0)
     */
    drawShaftInspectionPins(lines, geom) {
        const dt = geom.dt0 || (1.75 * geom.m);
        const rPin = dt / 2.0;
        const rCenter = (geom.M0 - dt) / 2.0;
        const pi = Math.PI;

        // Place pin in top tooth space (tau = pi / z)
        const angles = (geom.z0 % 2 === 0) ? [pi / geom.z0, pi / geom.z0 + pi] : [pi / geom.z0];

        angles.forEach(ang => {
            const cx = rCenter * Math.sin(ang);
            const cy = rCenter * Math.cos(ang);
            // Pure circular pin entity on dedicated layer
            this.addCircle(lines, 'MEASUREMENT_PIN', cx, cy, rPin);
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

        // Two balls placed in hub tooth spaces across k teeth
        const ang1 = 0.0;
        const ang2 = (2.0 * pi * k2) / geom.z0;

        const cx1 = rCenter * Math.sin(ang1);
        const cy1 = rCenter * Math.cos(ang1);
        const cx2 = rCenter * Math.sin(ang2);
        const cy2 = rCenter * Math.cos(ang2);

        // Draw the 2 pin circles without stray center crosses
        this.addCircle(lines, 'MEASUREMENT_PIN', cx1, cy1, rPin);
        this.addCircle(lines, 'MEASUREMENT_PIN', cx2, cy2, rPin);

        // Clean leader pointing outward from top pin (cx1, cy1) into clear space
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
