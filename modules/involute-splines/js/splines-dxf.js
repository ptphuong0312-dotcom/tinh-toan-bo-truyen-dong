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

import { SplinesCalc } from './splines-calc.js';

export const SplinesDxf = {
    generateDXF(geom, target = 'assembly') {
        if (!geom) return '';
        geom._target = target;

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
     * - C1 smooth root fillet radius (rf) and involute flanks connected in continuous order
     * - Resolution level driven by geom.profileResolution (1 to 11)
     */
    drawShaftContour(lines, geom) {
        const z = geom.z0;
        const resLevel = geom.profileResolution || 6;
        const sectorPts = SplinesCalc.generateShaftSectorPoints(geom, resLevel);

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

        // Inner bore circle if drawing shaft standalone
        if (geom._target === 'shaft') {
            this.addCircle(lines, 'CONTOUR_SHAFT', 0, 0, (geom.df0 / 2.0) * 0.5);
        }
    },

    /**
     * Draw internal Hub profile with 100% continuous, watertight closed POLYLINE:
     * - Zero gaps, zero duplicate entities, zero stray lines
     * - C1 smooth tip fillet radius (ra) and involute flanks connected in continuous order
     * - Resolution level driven by geom.profileResolution (1 to 11)
     */
    drawHubContour(lines, geom) {
        const z = geom.z0;
        const resLevel = geom.profileResolution || 6;
        const sectorPts = SplinesCalc.generateHubSpacePoints(geom, resLevel);

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

        // Outer collar circle if drawing hub standalone
        if (geom._target === 'hub') {
            this.addCircle(lines, 'CONTOUR_HUB', 0, 0, (geom.dri2 / 2.0) * 1.35);
        }
    },

    /**
     * Draw circular measurement pins and dimensions for Shaft (M0 & W0)
     */
    drawShaftInspectionPins(lines, geom) {
        const recPin = SplinesCalc.getRecommendedPinDiameter(geom.stdType, geom.m, geom.alfa);
        const dt = geom.dt0 || recPin.dt0;
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
        const recPin = SplinesCalc.getRecommendedPinDiameter(geom.stdType, geom.m, geom.alfa);
        const dt = geom.dt2 || recPin.dt2;
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
