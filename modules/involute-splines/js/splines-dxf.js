/**
 * MITCalc Web App - Involute Splines 2D CAD DXF Exporter
 * Generates 100% compliant AutoCAD Release 12 (AC1009) DXF files.
 * Supports Shaft, Hub, and Assembly with continuous closed tooth contour and non-overlapping manufacturing table.
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
            '70', '7',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'CONTOUR_SHAFT', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'CONTOUR_HUB', '70', '0', '62', '1', '6', 'CONTINUOUS',   // Red
            '0', 'LAYER', '2', 'PITCH_CIRCLE', '70', '0', '62', '3', '6', 'CENTER',       // Green
            '0', 'LAYER', '2', 'BASE_CIRCLE', '70', '0', '62', '6', '6', 'DASHED',       // Magenta
            '0', 'LAYER', '2', 'CENTER', '70', '0', '62', '2', '6', 'CENTER',             // Yellow
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
        this.addLine(lines, 'CENTER', -rMax * 1.2, 0, rMax * 1.2, 0);
        this.addLine(lines, 'CENTER', 0, -rMax * 1.2, 0, rMax * 1.2);

        // Draw Pitch Circle & Base Circle
        this.addCircle(lines, 'PITCH_CIRCLE', 0, 0, d / 2.0);
        this.addCircle(lines, 'BASE_CIRCLE', 0, 0, db / 2.0);

        // 1. Shaft Geometry (External Spline)
        if (target === 'shaft' || target === 'assembly') {
            const shaftPoints = this.buildShaftContour(geom);
            this.addPolyline(lines, 'CONTOUR_SHAFT', shaftPoints, true);
            // Inner shaft bore (hole)
            const rBore = (geom.df0 / 2.0) * 0.5;
            this.addCircle(lines, 'CONTOUR_SHAFT', 0, 0, rBore);
        }

        // 2. Hub Geometry (Internal Spline)
        if (target === 'hub' || target === 'assembly') {
            const hubPoints = this.buildHubContour(geom);
            this.addPolyline(lines, 'CONTOUR_HUB', hubPoints, true);
            // Outer hub collar
            const rCollar = (geom.dri2 / 2.0) * 1.35;
            this.addCircle(lines, 'CONTOUR_HUB', 0, 0, rCollar);
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
        const ra0 = (geom.ra0_tool || 0.0) * geom.m;

        const rBase = db / 2.0;
        const rTip = da / 2.0;
        const rRoot = df / 2.0;
        const tau = Math.PI / z;
        const psi = s / d;

        const rStart = Math.max(rBase, rRoot);
        const rEnd = rTip;
        const numFlank = 12;

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

        // Tip arc (with corner fillet if ra0 > 0)
        let alfaTip = Math.acos(rBase / rTip);
        const invTip = Math.tan(alfaTip) - alfaTip;
        const phiTip = psi + invAlfa - invTip;

        if (ra0 > 0.01 && ra0 < (rTip - rStart) * 0.5) {
            // Left tip corner fillet
            secPts.push([rTip - ra0 * 0.3, -(phiTip - (ra0 * 0.4) / rTip)]);
            secPts.push([rTip, -(phiTip - (ra0 * 0.9) / rTip)]);
            // Crest center
            secPts.push([rTip, 0.0]);
            // Right tip corner fillet
            secPts.push([rTip, phiTip - (ra0 * 0.9) / rTip]);
            secPts.push([rTip - ra0 * 0.3, phiTip - (ra0 * 0.4) / rTip]);
        } else {
            secPts.push([rTip, -phiTip]);
            secPts.push([rTip, phiTip]);
        }

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
        const ra2 = (geom.ra2_tool || 0.2) * m;

        const rBase = db / 2.0;
        const rRoot = dri / 2.0;
        const rTip = di / 2.0;
        const tau = Math.PI / z;
        const psiSpace = e2 / d;

        const rStart = Math.max(rBase, rTip);
        const rEnd = rRoot;
        const numFlank = 12;

        const secPts = [];
        let alfaStart = 0;
        if (rStart > rBase) alfaStart = Math.acos(rBase / rStart);
        const invStart = Math.tan(alfaStart) - alfaStart;
        const phiStart = psiSpace + invAlfa - invStart;

        // Inner crest arc on left
        secPts.push([rTip, -tau]);
        if (phiStart < tau) {
            if (ra2 > 0.01) {
                secPts.push([rTip, -(phiStart + (ra2 * 0.8) / rTip)]);
                secPts.push([rTip + ra2 * 0.3, -(phiStart + (ra2 * 0.3) / rTip)]);
            } else {
                secPts.push([rTip, -phiStart]);
            }
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

        // Outer root groove bottom
        let alfaRoot = 0;
        if (rRoot > rBase) alfaRoot = Math.acos(rBase / rRoot);
        const invRoot = Math.tan(alfaRoot) - alfaRoot;
        const phiRoot = psiSpace + invAlfa - invRoot;
        secPts.push([rRoot, -phiRoot]);
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

        // Inner crest arc on right
        if (phiStart < tau) {
            if (ra2 > 0.01) {
                secPts.push([rTip + ra2 * 0.3, phiStart + (ra2 * 0.3) / rTip]);
                secPts.push([rTip, phiStart + (ra2 * 0.8) / rTip]);
            } else {
                secPts.push([rTip, phiStart]);
            }
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
            ['Do Bi Trong Lo / Between-pin (M2)', `${geom.M2.toFixed(4)} mm (dp=${geom.dt2.toFixed(3)})`]
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
        a.click();
        URL.revokeObjectURL(url);
    }
};
