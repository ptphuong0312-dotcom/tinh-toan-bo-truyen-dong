/**
 * MITCalc Web App - Involute Splines 2D CAD DXF Exporter
 * Generates 100% compliant AutoCAD Release 12 (AC1009) DXF files.
 * Supports Shaft, Hub, and Assembly with manufacturing specification table.
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
            '70', '8',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'CONTOUR_SHAFT', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'CONTOUR_HUB', '70', '0', '62', '1', '6', 'CONTINUOUS',   // Red
            '0', 'LAYER', '2', 'PITCH_CIRCLE', '70', '0', '62', '3', '6', 'CENTER',       // Green
            '0', 'LAYER', '2', 'BASE_CIRCLE', '70', '0', '62', '6', '6', 'DASHED',       // Magenta
            '0', 'LAYER', '2', 'TIP_CIRCLE', '70', '0', '62', '5', '6', 'CONTINUOUS',    // Blue
            '0', 'LAYER', '2', 'ROOT_CIRCLE', '70', '0', '62', '8', '6', 'CONTINUOUS',   // Gray
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

        const pi = Math.PI;
        const z = geom.z0;
        const m = geom.m;
        const alfa = (geom.alfa * pi) / 180.0;
        const d = geom.d0;
        const db = geom.db0;

        // Draw Centerlines
        const rMax = Math.max(geom.da0, geom.dri2) * 0.75;
        this.addLine(lines, 'CENTER', -rMax, 0, rMax, 0);
        this.addLine(lines, 'CENTER', 0, -rMax, 0, rMax);

        // Draw Reference Circles
        this.addCircle(lines, 'PITCH_CIRCLE', 0, 0, d / 2.0);
        this.addCircle(lines, 'BASE_CIRCLE', 0, 0, db / 2.0);

        // Draw Shaft
        if (target === 'shaft' || target === 'assembly') {
            this.addCircle(lines, 'TIP_CIRCLE', 0, 0, geom.da0 / 2.0);
            this.addCircle(lines, 'ROOT_CIRCLE', 0, 0, geom.df0 / 2.0);
            this.drawSplineToothing(lines, 'CONTOUR_SHAFT', geom, true);
        }

        // Draw Hub
        if (target === 'hub' || target === 'assembly') {
            this.addCircle(lines, 'TIP_CIRCLE', 0, 0, geom.di2 / 2.0);
            this.addCircle(lines, 'ROOT_CIRCLE', 0, 0, geom.dri2 / 2.0);
            this.drawSplineToothing(lines, 'CONTOUR_HUB', geom, false);
        }

        // Draw Manufacturing Table
        this.drawMfgTable(lines, geom, target);

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

    addText(lines, layer, text, x, y, height = 3.5) {
        lines.push(
            '0', 'TEXT',
            '8', layer,
            '10', x.toFixed(4),
            '20', y.toFixed(4),
            '30', '0.0',
            '40', height.toFixed(4),
            '1', text
        );
    },

    drawSplineToothing(lines, layer, geom, isShaft) {
        const z = geom.z0;
        const d = geom.d0;
        const db = geom.db0;
        const da = isShaft ? geom.da0 : geom.dri2;
        const df = isShaft ? geom.df0 : geom.di2;
        const s = isShaft ? geom.s0 : geom.s2;
        const alfaDeg = geom.alfa;

        const pi = Math.PI;
        const alfa = (alfaDeg * pi) / 180.0;
        const invAlfa = Math.tan(alfa) - alfa;

        const r_base = db / 2.0;
        const r_tip = da / 2.0;
        const r_root = df / 2.0;
        const psi = s / d;

        const numFlankPts = 16;
        const r_start = Math.max(r_base, r_root);
        const r_end = r_tip;

        const halfPitch = isShaft ? 0 : (pi / z);

        for (let j = 0; j < z; j++) {
            const rotAngle = (j * 2 * pi) / z + halfPitch;
            const cosA = Math.cos(rotAngle);
            const sinA = Math.sin(rotAngle);

            const rot = (r, phi) => ({
                x: (r * Math.sin(phi)) * cosA - (r * Math.cos(phi)) * sinA,
                y: (r * Math.sin(phi)) * sinA + (r * Math.cos(phi)) * cosA
            });

            // Trace left flank up
            let prevPt = null;
            for (let i = 0; i <= numFlankPts; i++) {
                const frac = i / numFlankPts;
                const r = r_start + (r_end - r_start) * frac;
                let alfa_r = 0;
                if (r > r_base) alfa_r = Math.acos(r_base / r);
                const invAlfa_r = Math.tan(alfa_r) - alfa_r;
                const phi = -psi - invAlfa + invAlfa_r;
                const pt = rot(r, phi);
                if (prevPt) {
                    this.addLine(lines, layer, prevPt.x, prevPt.y, pt.x, pt.y);
                }
                prevPt = pt;
            }

            // Trace right flank down
            const tipLeft = prevPt;
            prevPt = null;
            for (let i = numFlankPts; i >= 0; i--) {
                const frac = i / numFlankPts;
                const r = r_start + (r_end - r_start) * frac;
                let alfa_r = 0;
                if (r > r_base) alfa_r = Math.acos(r_base / r);
                const invAlfa_r = Math.tan(alfa_r) - alfa_r;
                const phi = psi + invAlfa - invAlfa_r;
                const pt = rot(r, phi);
                if (prevPt) {
                    this.addLine(lines, layer, prevPt.x, prevPt.y, pt.x, pt.y);
                }
                prevPt = pt;
            }
        }
    },

    drawMfgTable(lines, geom, target) {
        const x0 = (geom.da0 / 2.0) + 40.0;
        let y0 = (geom.da0 / 2.0);
        const wCol = 140.0;
        const rowH = 7.0;

        this.addText(lines, 'MFG_TABLE', 'BANG THONG SO CHE TAO THEN HOA THAN KHAI', x0, y0 + 10, 4.5);

        const rows = [
            ['Tieu Chuan / Standard', 'DIN 5480 / ISO 4156 / ANSI B92.1'],
            ['So Rang / Number of teeth (z)', `${geom.z0}`],
            ['Mo-dun / Module (m)', `${geom.m.toFixed(4)} mm`],
            ['Goc An Khop / Pressure angle (alpha)', `${geom.alfa.toFixed(2)} deg`],
            ['Duong Kinh Chia / Pitch diameter (d)', `${geom.d0.toFixed(4)} mm`],
            ['Duong Kinh Co So / Base diameter (db)', `${geom.db0.toFixed(4)} mm`],
            ['Duong Kinh Dinh Truc / Shaft tip (da0)', `${geom.da0.toFixed(4)} mm`],
            ['Duong Kinh Day Truc / Shaft root (df0)', `${geom.df0.toFixed(4)} mm`],
            ['Duong Kinh Dinh Lo / Hub tip (Di)', `${geom.di2.toFixed(4)} mm`],
            ['Duong Kinh Day Lo / Hub root (Dri)', `${geom.dri2.toFixed(4)} mm`],
            ['Chieu Day Rang / Tooth thickness (s0)', `${geom.s0.toFixed(4)} mm`],
            ['Chieu Dai Phap Tuyen Chung (W0)', `${geom.W0.toFixed(4)} mm (k=${geom.k0})`],
            ['Kich Thuoc Qua Bi/Dua Do (M0)', `${geom.M0.toFixed(4)} mm (dp=${geom.dt0.toFixed(3)})`],
            ['Do Bi Trong Lo / Hub pin measure (M2)', `${geom.M2.toFixed(4)} mm (dp=${geom.dt2.toFixed(3)})`]
        ];

        rows.forEach((r, idx) => {
            const y = y0 - idx * rowH;
            this.addText(lines, 'MFG_TABLE', r[0], x0, y, 3.0);
            this.addText(lines, 'MFG_TABLE', r[1], x0 + 80.0, y, 3.0);
            this.addLine(lines, 'MFG_TABLE', x0 - 2, y - 2, x0 + wCol, y - 2);
        });
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
