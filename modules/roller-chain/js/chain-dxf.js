/**
 * MITCalc Web App - Roller Chain 2D CAD DXF Exporter (Module 9)
 * Generates 100% compliant AutoCAD Release 12 (AC1009) DXF files.
 * Offline Blob download (Zero-CORS).
 */

const ChainDxf = {
    /**
     * Generate complete DXF file content
     * @param {Object} res Calculation result from ChainCalc.calculate()
     * @param {string} target 'assembly', 'sprocket1', 'sprocket2'
     */
    generateDXF(res, target = 'assembly') {
        if (!res) return '';

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
            '10', '-1000.0', '20', '-1000.0', '30', '0.0',
            '9', '$EXTMAX',
            '10', '2000.0', '20', '1000.0', '30', '0.0',
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
            '0', 'LAYER', '2', 'SPROCKET1_CONTOUR', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'SPROCKET2_CONTOUR', '70', '0', '62', '2', '6', 'CONTINUOUS', // Yellow
            '0', 'LAYER', '2', 'PITCH_CIRCLES', '70', '0', '62', '3', '6', 'CENTER',        // Green
            '0', 'LAYER', '2', 'CHAIN_PATH', '70', '0', '62', '1', '6', 'DASHED',           // Red
            '0', 'LAYER', '2', 'CENTER_LINES', '70', '0', '62', '1', '6', 'CENTER',         // Red
            '0', 'LAYER', '2', 'DIMENSIONS', '70', '0', '62', '6', '6', 'CONTINUOUS',       // Magenta
            '0', 'LAYER', '2', 'DXF_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',        // White
            '0', 'ENDTAB',
            '0', 'ENDSEC'
        );

        // 3. Entities Section
        lines.push('0', 'SECTION', '2', 'ENTITIES');

        const a = res.a || 300;
        const d1 = res.d1 || 100;
        const d2 = res.d2 || 200;
        const z1 = res.z1 || 19;
        const z2 = res.z2 || 40;
        const p = res.chain ? res.chain.pitch : 12.7;

        if (target === 'assembly' || target === 'sprocket1') {
            // Draw Sprocket 1 at (0, 0)
            this.addSprocketPolyline(lines, 0, 0, z1, res.sprocket1, 'SPROCKET1_CONTOUR');
            // Pitch circle
            this.addCircle(lines, 0, 0, d1 / 2, 'PITCH_CIRCLES');
            // Bore hole
            this.addCircle(lines, 0, 0, (res.sprocket1.df / 2) * 0.35, 'SPROCKET1_CONTOUR');
            // Center cross
            this.addCross(lines, 0, 0, (d1 / 2) * 0.4, 'CENTER_LINES');
        }

        if (target === 'assembly' || target === 'sprocket2') {
            // Draw Sprocket 2 at (a, 0) for assembly, or (0, 0) for single view
            const cx2 = (target === 'assembly') ? a : 0;
            const cy2 = 0;
            this.addSprocketPolyline(lines, cx2, cy2, z2, res.sprocket2, 'SPROCKET2_CONTOUR');
            // Pitch circle
            this.addCircle(lines, cx2, cy2, d2 / 2, 'PITCH_CIRCLES');
            // Bore hole
            this.addCircle(lines, cx2, cy2, (res.sprocket2.df / 2) * 0.35, 'SPROCKET2_CONTOUR');
            // Center cross
            this.addCross(lines, cx2, cy2, (d2 / 2) * 0.4, 'CENTER_LINES');
        }

        if (target === 'assembly') {
            // Center Line connecting axes
            lines.push(
                '0', 'LINE',
                '8', 'CENTER_LINES',
                '10', (-d1 * 0.65).toFixed(4), '20', '0.0', '30', '0.0',
                '11', (a + d2 * 0.65).toFixed(4), '21', '0.0', '31', '0.0'
            );

            // Chain Pitch Path
            if (ChainCalc && ChainCalc.generateChainKinematics) {
                const kine = ChainCalc.generateChainKinematics(d1, d2, a, p, res.X_even || 100, 0);
                if (kine && kine.t1_top) {
                    // Top straight strand
                    this.addLine(lines, kine.t1_top.x, kine.t1_top.y, kine.t2_top.x, kine.t2_top.y, 'CHAIN_PATH');
                    // Bottom straight strand
                    this.addLine(lines, kine.t2_bot.x, kine.t2_bot.y, kine.t1_bot.x, kine.t1_bot.y, 'CHAIN_PATH');

                    // Arcs of wrap around sprockets
                    const ang1_start = Math.atan2(kine.t1_bot.y, kine.t1_bot.x) * 180 / Math.PI;
                    const ang1_end = Math.atan2(kine.t1_top.y, kine.t1_top.x) * 180 / Math.PI;
                    this.addArc(lines, 0, 0, d1 / 2, ang1_start, ang1_end, 'CHAIN_PATH');

                    const ang2_start = Math.atan2(kine.t2_top.y - a, kine.t2_top.x - a) * 180 / Math.PI;
                    const ang2_end = Math.atan2(kine.t2_bot.y - a, kine.t2_bot.x - a) * 180 / Math.PI;
                    this.addArc(lines, a, 0, d2 / 2, ang2_start, ang2_end, 'CHAIN_PATH');
                }
            }

            // Dimension: Axis distance a
            const dimY = -(Math.max(res.sprocket1.da, res.sprocket2.da) / 2 + 30);
            this.addDimension(lines, 0, 0, a, 0, dimY, `a = ${a.toFixed(2)}`, 'DIMENSIONS');
        }

        if (target === 'axial') {
            // Authentic MITCalc Sub View3 Axial Rim Cross-Section (ISO 606 / DIN 8187)
            const sp = res.sprocket1;
            const da = sp.da;
            const dp = res.d1;
            const df = sp.df;
            const dg = sp.Dg;
            const bf = sp.bf1;
            const rx = sp.rx;
            const ba = Math.max(0, rx - Math.sqrt(Math.max(0, rx * rx - Math.pow((da - dp) / 2, 2))));
            const ee = (res.chain && res.chain.e && res.chain.e > 0) ? res.chain.e : bf;
            const rows = res.strands || 1;
            let BPx = 0;

            for (let i = 0; i < rows; i++) {
                const px1 = BPx - ee / 2, py1 = dg / 2;
                const px2 = BPx - bf / 2, py2 = py1;
                const px3 = px2, py3 = df / 2;
                const px4 = BPx, py4 = py3;
                const px5 = px3, py5 = dp / 2;
                const px6 = BPx - (bf - ba) / 2, py6 = da / 2;
                const px7 = BPx, py7 = py6;

                // 4-way symmetry lines: left/right of BPx, top/bottom of Y=0
                this.addMirroredAxialLine(lines, px1, py1, px2, py2, BPx, 'SPROCKET1_CONTOUR');
                this.addMirroredAxialLine(lines, px2, py2, px3, py3, BPx, 'SPROCKET1_CONTOUR');
                this.addMirroredAxialLine(lines, px3, py3, px4, py4, BPx, 'SPROCKET1_CONTOUR');
                this.addMirroredAxialLine(lines, px3, py3, px5, py5, BPx, 'SPROCKET1_CONTOUR');
                this.addMirroredAxialLine(lines, px5, py5, px6, py6, BPx, 'SPROCKET1_CONTOUR');
                this.addMirroredAxialLine(lines, px6, py6, px7, py7, BPx, 'SPROCKET1_CONTOUR');

                // Row tooth centerline
                this.addLine(lines, BPx, -da / 2 - 12, BPx, da / 2 + 12, 'CENTER_LINES');
                BPx += ee;
            }

            BPx -= ee;
            const lap = 20;
            // Horizontal rotation axis Y = 0
            this.addLine(lines, -ee / 2 - lap, 0, BPx + ee / 2 + lap, 0, 'CENTER_LINES');
            // Pitch line Y = +/- dp/2
            this.addLine(lines, -ee / 2 - 8, dp / 2, BPx + ee / 2 + 8, dp / 2, 'PITCH_CIRCLES');
            this.addLine(lines, -ee / 2 - 8, -dp / 2, BPx + ee / 2 + 8, -dp / 2, 'PITCH_CIRCLES');
        }

        // Add Manufacturing Table (DXFTables)
        this.addDXFTable(lines, res, target);

        // End Entities
        lines.push('0', 'ENDSEC', '0', 'EOF');

        return lines.join('\n');
    },

    addCircle(lines, cx, cy, r, layer) {
        lines.push(
            '0', 'CIRCLE',
            '8', layer,
            '10', cx.toFixed(4),
            '20', cy.toFixed(4),
            '30', '0.0',
            '40', r.toFixed(4)
        );
    },

    addLine(lines, x1, y1, x2, y2, layer) {
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

    addArc(lines, cx, cy, r, startAngle, endAngle, layer) {
        let s = startAngle % 360;
        let e = endAngle % 360;
        if (s < 0) s += 360;
        if (e < 0) e += 360;
        lines.push(
            '0', 'ARC',
            '8', layer,
            '10', cx.toFixed(4),
            '20', cy.toFixed(4),
            '30', '0.0',
            '40', r.toFixed(4),
            '50', s.toFixed(4),
            '51', e.toFixed(4)
        );
    },

    addCross(lines, cx, cy, len, layer) {
        this.addLine(lines, cx - len, cy, cx + len, cy, layer);
        this.addLine(lines, cx, cy - len, cx, cy + len, layer);
    },

    addSprocketPolyline(lines, cx, cy, z, sprocketData, layer) {
        if (!ChainCalc || !ChainCalc.generateSprocket2DPoints) return;
        const pts = ChainCalc.generateSprocket2DPoints(z, sprocketData, 4);
        if (!pts || pts.length === 0) return;

        lines.push(
            '0', 'POLYLINE',
            '8', layer,
            '66', '1', // Vertices follow
            '70', '1', // Closed polyline
            '10', '0.0', '20', '0.0', '30', '0.0'
        );

        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            const wx = cx + p.x;
            const wy = cy + p.y;
            lines.push(
                '0', 'VERTEX',
                '8', layer,
                '10', wx.toFixed(4),
                '20', wy.toFixed(4),
                '30', '0.0'
            );
        }

        lines.push('0', 'SEQEND');
    },

    addMirroredAxialLine(lines, x1, y1, x2, y2, xc, layer) {
        // Upper left
        this.addLine(lines, x1, y1, x2, y2, layer);
        // Upper right (mirrored across xc)
        this.addLine(lines, xc + (xc - x1), y1, xc + (xc - x2), y2, layer);
        // Lower left (mirrored across rotation axis Y = 0)
        this.addLine(lines, x1, -y1, x2, -y2, layer);
        // Lower right
        this.addLine(lines, xc + (xc - x1), -y1, xc + (xc - x2), -y2, layer);
    },

    addDimension(lines, x1, y1, x2, y2, dimY, text, layer) {
        // Simple linear dimension representation in R12
        this.addLine(lines, x1, y1, x1, dimY, layer);
        this.addLine(lines, x2, y2, x2, dimY, layer);
        this.addLine(lines, x1, dimY, x2, dimY, layer);

        // Center text
        const midX = (x1 + x2) / 2;
        lines.push(
            '0', 'TEXT',
            '8', layer,
            '10', midX.toFixed(4),
            '20', (dimY + 4).toFixed(4),
            '30', '0.0',
            '40', '6.0', // text height
            '1', text,
            '72', '1', // centered
            '11', midX.toFixed(4),
            '21', (dimY + 4).toFixed(4),
            '31', '0.0'
        );
    },

    addDXFTable(lines, res, target) {
        const tableX = (target === 'axial') ? 80 : ((target === 'sprocket2') ? 150 : (res.a ? res.a + res.sprocket2.da / 2 + 60 : 250));
        const tableY = (res.sprocket1.da ? res.sprocket1.da / 2 + 50 : 150);
        const rowH = 10;
        const colW = 120;

        const tableData = [
            ['THONG SO CHE TAO BO TRUYEN XICH CON LAN (ISO 606 / DIN 8187)', ''],
            ['Tieu chuan xich', res.chain ? res.chain.code : 'ISO 606 / DIN 8187'],
            ['Buoc xich p [mm]', res.chain ? res.chain.pitch.toFixed(3) : '12.700'],
            ['Duong kinh con lan d3 [mm]', res.chain ? res.chain.d3.toFixed(2) : '8.51'],
            ['Chieu rong trong b1 [mm]', res.chain ? res.chain.b1.toFixed(2) : '7.75'],
            ['So rang dia dan z1', String(res.z1 || 19)],
            ['So rang dia bi dan z2', String(res.z2 || 40)],
            ['Khoang cach truc a [mm]', res.a ? res.a.toFixed(2) : '300.00'],
            ['So mat xich X', String(res.X_even || res.X_exact || 100)],
            ['Chieu dai xich L [mm]', res.L ? res.L.toFixed(1) : '1270.0'],
            ['Duong kinh chia d1 / d2 [mm]', `${res.d1.toFixed(2)} / ${res.d2.toFixed(2)}`],
            ['Duong kinh dinh da1 / da2 [mm]', `${res.sprocket1.da.toFixed(2)} / ${res.sprocket2.da.toFixed(2)}`],
            ['Duong kinh day df1 / df2 [mm]', `${res.sprocket1.df.toFixed(2)} / ${res.sprocket2.df.toFixed(2)}`],
            ['Ban kinh luon day R1_1 / R1_2 [mm]', `${res.sprocket1.R1.toFixed(2)} / ${res.sprocket2.R1.toFixed(2)}`],
            ['Chieu rong rang dia bf1 [mm]', res.sprocket1.bf1.toFixed(2)],
            ['He thong phan mem', 'MITCalc 1.74 Web App Offline (Zero-Tolerance)']
        ];

        // Draw Table Box
        const totalH = tableData.length * rowH;
        const totalW = colW * 2;

        lines.push(
            '0', 'POLYLINE', '8', 'DXF_TABLE', '66', '1', '70', '1',
            '10', '0.0', '20', '0.0', '30', '0.0',
            '0', 'VERTEX', '8', 'DXF_TABLE', '10', tableX.toFixed(4), '20', tableY.toFixed(4), '30', '0.0',
            '0', 'VERTEX', '8', 'DXF_TABLE', '10', (tableX + totalW).toFixed(4), '20', tableY.toFixed(4), '30', '0.0',
            '0', 'VERTEX', '8', 'DXF_TABLE', '10', (tableX + totalW).toFixed(4), '20', (tableY - totalH).toFixed(4), '30', '0.0',
            '0', 'VERTEX', '8', 'DXF_TABLE', '10', tableX.toFixed(4), '20', (tableY - totalH).toFixed(4), '30', '0.0',
            '0', 'SEQEND'
        );

        // Divider vertical line
        this.addLine(lines, tableX + colW, tableY - rowH, tableX + colW, tableY - totalH, 'DXF_TABLE');

        // Rows and Text
        for (let r = 0; r < tableData.length; r++) {
            const currentY = tableY - r * rowH;
            // Horizontal row line
            this.addLine(lines, tableX, currentY, tableX + totalW, currentY, 'DXF_TABLE');

            const item = tableData[r];
            const textY = currentY - rowH + 3.0;

            if (r === 0) {
                // Header span
                lines.push(
                    '0', 'TEXT', '8', 'DXF_TABLE',
                    '10', (tableX + 4).toFixed(4), '20', textY.toFixed(4), '30', '0.0',
                    '40', '4.5',
                    '1', item[0]
                );
            } else {
                lines.push(
                    '0', 'TEXT', '8', 'DXF_TABLE',
                    '10', (tableX + 4).toFixed(4), '20', textY.toFixed(4), '30', '0.0',
                    '40', '4.0',
                    '1', item[0],
                    '0', 'TEXT', '8', 'DXF_TABLE',
                    '10', (tableX + colW + 4).toFixed(4), '20', textY.toFixed(4), '30', '0.0',
                    '40', '4.0',
                    '1', item[1]
                );
            }
        }
    },

    /**
     * Trigger browser offline download
     */
    download(content, filename = 'MITCalc_Roller_Chain.dxf') {
        const blob = new Blob([content], { type: 'application/dxf;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

if (typeof window !== 'undefined') {
    window.ChainDxf = ChainDxf;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChainDxf };
}
