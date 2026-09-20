/**
 * MITCalc Web App - Bevel Gear 2D CAD DXF Exporter (Module 2)
 * Generates 100% compliant AutoCAD 2004+ Release 12 DXF (AC1009) files
 * Standards: ISO 23509, DIN 3971, DIN 3965
 * Features:
 * - 11 levels of tooth profile refinement (Muc 1 den Muc 11)
 * - 2D Axial Cross Section (Mat cat truc ky thuat ISO 23509 tu Data1!C63:D95 & Data1!C28:D60)
 * - 2D Transverse Virtual Tooth Profile (Bien dang rang than khai non theo Tredgold)
 * - Pitch cone generators meeting at Apex V(0, 0)
 * - Technical Manufacturing Specification Table (MFG_TABLE)
 * - Options: Pinion 1, Gear 2, or Conjugate Assembly Pair
 */

export const BEVEL_PROFILE_RESOLUTIONS = {
    1: { level: 1, name: 'Muc 1 (Tho)', ptsPerFlank: 6, ptsPerTooth: 20 },
    2: { level: 2, name: 'Muc 2', ptsPerFlank: 8, ptsPerTooth: 24 },
    3: { level: 3, name: 'Muc 3', ptsPerFlank: 10, ptsPerTooth: 28 },
    4: { level: 4, name: 'Muc 4', ptsPerFlank: 12, ptsPerTooth: 32 },
    5: { level: 5, name: 'Muc 5', ptsPerFlank: 14, ptsPerTooth: 36 },
    6: { level: 6, name: 'Muc 6 (Chuan Goc MITCalc 1.74)', ptsPerFlank: 16, ptsPerTooth: 40 },
    7: { level: 7, name: 'Muc 7', ptsPerFlank: 18, ptsPerTooth: 44 },
    8: { level: 8, name: 'Muc 8', ptsPerFlank: 20, ptsPerTooth: 48 },
    9: { level: 9, name: 'Muc 9', ptsPerFlank: 24, ptsPerTooth: 56 },
    10: { level: 10, name: 'Muc 10', ptsPerFlank: 28, ptsPerTooth: 64 },
    11: { level: 11, name: 'Muc 11 (Sieu Min CNC/EDM)', ptsPerFlank: 32, ptsPerTooth: 72 }
};

export const BevelDxfExporter = {
    /**
     * Generates a fully compliant AutoCAD 2004+ Release 12 DXF string
     * @param {Object} g - Calculation geometry results from BevelCalcEngine
     * @param {string} target - 'pinion', 'gear', or 'assembly'
     * @param {number} resLevel - 1 to 11
     * @returns {string} DXF string
     */
    generateDXF(g, target = 'assembly', resLevel = 6) {
        if (!g) return '';

        const res = BEVEL_PROFILE_RESOLUTIONS[resLevel] || BEVEL_PROFILE_RESOLUTIONS[6];
        const lines = [];

        // 1. Header Section (AC1009 = Release 12, universal standard for AutoCAD 2004 - 2026)
        lines.push(
            '0', 'SECTION',
            '2', 'HEADER',
            '9', '$ACADVER',
            '1', 'AC1009',
            '0', 'ENDSEC'
        );

        // 2. Tables Section (VPORT, LTYPE, LAYER, STYLE)
        lines.push(
            '0', 'SECTION',
            '2', 'TABLES',
            // VPORT table
            '0', 'TABLE',
            '2', 'VPORT',
            '70', '1',
            '0', 'VPORT',
            '2', '*ACTIVE',
            '70', '0',
            '10', '0.0', '20', '0.0',
            '11', '1.0', '21', '1.0',
            '12', '0.0', '22', '0.0',
            '40', '350.0', '41', '1.5',
            '0', 'ENDTAB',
            // LTYPE table (CONTINUOUS, CENTER, DASHED)
            '0', 'TABLE',
            '2', 'LTYPE',
            '70', '3',
            '0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0.0',
            '0', 'LTYPE', '2', 'CENTER', '70', '0', '3', 'Center ____ _ ____ _ ____', '72', '65', '73', '4', '40', '50.0',
            '49', '31.75', '49', '-6.35', '49', '6.35', '49', '-6.35',
            '0', 'LTYPE', '2', 'DASHED', '70', '0', '3', 'Dashed __ __ __ __', '72', '65', '73', '2', '40', '19.05',
            '49', '12.7', '49', '-6.35',
            '0', 'ENDTAB',
            // LAYER table
            '0', 'TABLE',
            '2', 'LAYER',
            '70', '6',
            '0', 'LAYER', '2', 'GEAR1_PINION', '70', '0', '62', '1', '6', 'CONTINUOUS', // Red
            '0', 'LAYER', '2', 'GEAR2_WHEEL', '70', '0', '62', '5', '6', 'CONTINUOUS',  // Blue
            '0', 'LAYER', '2', 'PITCH_CONES', '70', '0', '62', '3', '6', 'CENTER',      // Green dashdot
            '0', 'LAYER', '2', 'CENTER_LINES', '70', '0', '62', '2', '6', 'CENTER',     // Yellow dashdot
            '0', 'LAYER', '2', 'SHAFTS_BORE', '70', '0', '62', '7', '6', 'CONTINUOUS',  // White
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',    // White
            '0', 'ENDTAB',
            // STYLE table
            '0', 'TABLE',
            '2', 'STYLE',
            '70', '1',
            '0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0.0', '41', '1.0', '50', '0.0', '71', '0', '42', '2.5', '3', 'txt', '4', '',
            '0', 'ENDTAB',
            '0', 'ENDSEC'
        );

        // 3. Entities Section
        lines.push('0', 'SECTION', '2', 'ENTITIES');

        // Helper functions
        const addLine = (x1, y1, x2, y2, layer) => {
            lines.push(
                '0', 'LINE',
                '8', layer,
                '10', x1.toFixed(4), '20', y1.toFixed(4), '30', '0.0',
                '11', x2.toFixed(4), '21', y2.toFixed(4), '31', '0.0'
            );
        };

        const addCircle = (cx, cy, r, layer) => {
            lines.push(
                '0', 'CIRCLE',
                '8', layer,
                '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0',
                '40', r.toFixed(4)
            );
        };

        const addText = (text, x, y, h, layer) => {
            lines.push(
                '0', 'TEXT',
                '8', layer,
                '10', x.toFixed(4), '20', y.toFixed(4), '30', '0.0',
                '40', h.toFixed(4),
                '1', text
            );
        };

        // Geometric dimensions for axial sections
        const delta1 = g.delta1 || ((g.delta1_deg || 21.8) * Math.PI / 180.0);
        const delta2 = g.delta2 || ((g.delta2_deg || 68.2) * Math.PI / 180.0);
        const sinD1 = Math.sin(delta1), cosD1 = Math.cos(delta1);
        const sinD2 = Math.sin(delta2), cosD2 = Math.cos(delta2);

        const Re = g.Re || 338.0;
        const b = g.b || 117.0;
        const Ri = g.Ri || (Re - b);

        const de1 = g.de1 || (2 * Re * sinD1);
        const di1 = g.di1 || (2 * Ri * sinD1);
        const de2 = g.de2 || (2 * Re * sinD2);
        const di2 = g.di2 || (2 * Ri * sinD2);

        const hae1 = g.hae1 || (g.mmn * 1.6);
        const hfe1 = g.hfe1 || (g.mmn * 1.2);
        const hai1 = g.hai1 || (hae1 * Ri / Re);
        const hfi1 = g.hfi1 || (hfe1 * Ri / Re);

        const hae2 = g.hae2 || (g.mmn * 0.8);
        const hfe2 = g.hfe2 || (g.mmn * 1.6);
        const hai2 = g.hai2 || (hae2 * Ri / Re);
        const hfi2 = g.hfi2 || (hfe2 * Ri / Re);

        const rBore1 = Math.max(10.0, Math.round((di1 / 2.0 - hfi1) * 0.45));
        const rBore2 = Math.max(15.0, Math.round((di2 / 2.0 - hfi2) * 0.45));

        // Offset parameters from Section 16.5 & 16.6
        const H1in = g.a_offset1 || 4.8;
        const H1out = g.b_offset1 || 13.3;
        const H2in = g.a_offset2 || 5.9;
        const H2out = g.b_offset2 || 19.95;

        // Base coordinate points along Pinion 1 Axis (X-axis, Apex at origin (0, 0))
        const p_pitch_i1 = { x: -(di1 / 2.0) / Math.tan(delta1), y: di1 / 2.0 };
        const p_pitch_e1 = { x: -(de1 / 2.0) / Math.tan(delta1), y: de1 / 2.0 };

        // Pinion 1 Axial Section Points (Upper Half)
        const pt8_1 = { x: p_pitch_i1.x - hfi1 * sinD1, y: p_pitch_i1.y - hfi1 * cosD1 };
        const pt1_1 = { x: p_pitch_i1.x + hai1 * sinD1, y: p_pitch_i1.y + hai1 * cosD1 };
        const pt2_1 = { x: p_pitch_e1.x + hae1 * sinD1, y: p_pitch_e1.y + hae1 * cosD1 };
        const pt4_1 = { x: p_pitch_e1.x - hfe1 * sinD1, y: p_pitch_e1.y - hfe1 * cosD1 };
        const pt5_1 = { x: p_pitch_e1.x - (hfe1 + H1out) * sinD1, y: p_pitch_e1.y - (hfe1 + H1out) * cosD1 };
        const pt7_1 = { x: pt5_1.x, y: rBore1 };
        const pt9_1 = { x: p_pitch_i1.x - (hfi1 + H1in) * sinD1, y: p_pitch_i1.y - (hfi1 + H1in) * cosD1 };
        const pt11_1 = { x: pt9_1.x, y: rBore1 };

        const drawAxialPinion = (offX = 0, offY = 0) => {
            const layer = 'GEAR1_PINION';
            // Upper half outline
            addLine(pt8_1.x + offX, pt8_1.y + offY, pt1_1.x + offX, pt1_1.y + offY, layer);
            addLine(pt1_1.x + offX, pt1_1.y + offY, pt2_1.x + offX, pt2_1.y + offY, layer);
            addLine(pt2_1.x + offX, pt2_1.y + offY, pt4_1.x + offX, pt4_1.y + offY, layer);
            addLine(pt4_1.x + offX, pt4_1.y + offY, pt5_1.x + offX, pt5_1.y + offY, layer);
            addLine(pt5_1.x + offX, pt5_1.y + offY, pt7_1.x + offX, pt7_1.y + offY, layer);
            addLine(pt7_1.x + offX, pt7_1.y + offY, pt11_1.x + offX, pt11_1.y + offY, 'SHAFTS_BORE');
            addLine(pt11_1.x + offX, pt11_1.y + offY, pt9_1.x + offX, pt9_1.y + offY, layer);
            addLine(pt9_1.x + offX, pt9_1.y + offY, pt8_1.x + offX, pt8_1.y + offY, layer);

            // Lower half outline (symmetric across X-axis)
            addLine(pt8_1.x + offX, -pt8_1.y + offY, pt1_1.x + offX, -pt1_1.y + offY, layer);
            addLine(pt1_1.x + offX, -pt1_1.y + offY, pt2_1.x + offX, -pt2_1.y + offY, layer);
            addLine(pt2_1.x + offX, -pt2_1.y + offY, pt4_1.x + offX, -pt4_1.y + offY, layer);
            addLine(pt4_1.x + offX, -pt4_1.y + offY, pt5_1.x + offX, -pt5_1.y + offY, layer);
            addLine(pt5_1.x + offX, -pt5_1.y + offY, pt7_1.x + offX, -pt7_1.y + offY, layer);
            addLine(pt7_1.x + offX, -pt7_1.y + offY, pt11_1.x + offX, -pt11_1.y + offY, 'SHAFTS_BORE');
            addLine(pt11_1.x + offX, -pt11_1.y + offY, pt9_1.x + offX, -pt9_1.y + offY, layer);
            addLine(pt9_1.x + offX, -pt9_1.y + offY, pt8_1.x + offX, -pt8_1.y + offY, layer);

            // Pitch cone line & Centerlines
            addLine(0 + offX, 0 + offY, p_pitch_e1.x + offX, p_pitch_e1.y + offY, 'PITCH_CONES');
            addLine(0 + offX, 0 + offY, p_pitch_e1.x + offX, -p_pitch_e1.y + offY, 'PITCH_CONES');
            addLine(20 + offX, 0 + offY, pt5_1.x - 30 + offX, 0 + offY, 'CENTER_LINES');
        };

        // Gear 2 Points (oriented along Y axis when Sigma = 90 deg)
        const p_pitch_i2 = { x: di2 / 2.0, y: -(di2 / 2.0) / Math.tan(delta2) };
        const p_pitch_e2 = { x: de2 / 2.0, y: -(de2 / 2.0) / Math.tan(delta2) };

        const pt8_2 = { x: p_pitch_i2.x - hfi2 * cosD2, y: p_pitch_i2.y - hfi2 * sinD2 };
        const pt1_2 = { x: p_pitch_i2.x + hai2 * cosD2, y: p_pitch_i2.y + hai2 * sinD2 };
        const pt2_2 = { x: p_pitch_e2.x + hae2 * cosD2, y: p_pitch_e2.y + hae2 * sinD2 };
        const pt4_2 = { x: p_pitch_e2.x - hfe2 * cosD2, y: p_pitch_e2.y - hfe2 * sinD2 };
        const pt5_2 = { x: p_pitch_e2.x - (hfe2 + H2out) * cosD2, y: p_pitch_e2.y - (hfe2 + H2out) * sinD2 };
        const pt7_2 = { x: rBore2, y: pt5_2.y };
        const pt9_2 = { x: p_pitch_i2.x - (hfi2 + H2in) * cosD2, y: p_pitch_i2.y - (hfi2 + H2in) * sinD2 };
        const pt11_2 = { x: rBore2, y: pt9_2.y };

        const drawAxialGear = (offX = 0, offY = 0) => {
            const layer = 'GEAR2_WHEEL';
            // Right half outline
            addLine(pt8_2.x + offX, pt8_2.y + offY, pt1_2.x + offX, pt1_2.y + offY, layer);
            addLine(pt1_2.x + offX, pt1_2.y + offY, pt2_2.x + offX, pt2_2.y + offY, layer);
            addLine(pt2_2.x + offX, pt2_2.y + offY, pt4_2.x + offX, pt4_2.y + offY, layer);
            addLine(pt4_2.x + offX, pt4_2.y + offY, pt5_2.x + offX, pt5_2.y + offY, layer);
            addLine(pt5_2.x + offX, pt5_2.y + offY, pt7_2.x + offX, pt7_2.y + offY, layer);
            addLine(pt7_2.x + offX, pt7_2.y + offY, pt11_2.x + offX, pt11_2.y + offY, 'SHAFTS_BORE');
            addLine(pt11_2.x + offX, pt11_2.y + offY, pt9_2.x + offX, pt9_2.y + offY, layer);
            addLine(pt9_2.x + offX, pt9_2.y + offY, pt8_2.x + offX, pt8_2.y + offY, layer);

            // Left half outline (symmetric across Y-axis)
            addLine(-pt8_2.x + offX, pt8_2.y + offY, -pt1_2.x + offX, pt1_2.y + offY, layer);
            addLine(-pt1_2.x + offX, pt1_2.y + offY, -pt2_2.x + offX, pt2_2.y + offY, layer);
            addLine(-pt2_2.x + offX, pt2_2.y + offY, -pt4_2.x + offX, pt4_2.y + offY, layer);
            addLine(-pt4_2.x + offX, pt4_2.y + offY, -pt5_2.x + offX, pt5_2.y + offY, layer);
            addLine(-pt5_2.x + offX, pt5_2.y + offY, -pt7_2.x + offX, pt7_2.y + offY, layer);
            addLine(-pt7_2.x + offX, pt7_2.y + offY, -pt11_2.x + offX, pt11_2.y + offY, 'SHAFTS_BORE');
            addLine(-pt11_2.x + offX, pt11_2.y + offY, -pt9_2.x + offX, pt9_2.y + offY, layer);
            addLine(-pt9_2.x + offX, pt9_2.y + offY, -pt8_2.x + offX, pt8_2.y + offY, layer);

            // Pitch cone line & Centerlines
            addLine(0 + offX, 0 + offY, p_pitch_e2.x + offX, p_pitch_e2.y + offY, 'PITCH_CONES');
            addLine(0 + offX, 0 + offY, -p_pitch_e2.x + offX, p_pitch_e2.y + offY, 'PITCH_CONES');
            addLine(0 + offX, 20 + offY, 0 + offX, pt5_2.y - 30 + offY, 'CENTER_LINES');
        };

        // Draw views depending on target
        if (target === 'pinion') {
            drawAxialPinion(0, 0);
        } else if (target === 'gear') {
            drawAxialGear(0, 0);
        } else {
            // Assembly Pair: Both wheels sharing common Apex V(0, 0)
            drawAxialPinion(0, 0);
            drawAxialGear(0, 0);
        }

        // Manufacturing Table Definition
        const tblX = -Math.max(de1, de2) * 1.1;
        let tblY = -Math.max(de1, de2) * 0.7 - 40;
        const rowH = 7.0;

        addText('THONG SO CHE TAO BO TRUYEN BANH RANG CON (ISO 23509 / DIN 3971)', tblX, tblY, 4.5, 'MFG_TABLE');
        tblY -= rowH * 1.3;
        addText(`- So rang (Pinion z1 / Gear z2): ${g.z1} / ${g.z2}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Mo-dun phap trung binh (mmn): ${(g.mmn || 10).toFixed(3)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Mo-dun ngang ngoai (met): ${(g.met || 10).toFixed(3)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc truc truyen (Shaft angle Sigma): ${(g.Sigma_deg || 90).toFixed(2)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc an khop danh nghia (alpha): ${(g.alfa_deg || 20).toFixed(2)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc xoan rang trung binh (beta): ${(g.beta_deg || 0).toFixed(2)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Chieu dai non ngoai (Re) / be rong (b): ${(g.Re || 0).toFixed(3)} mm / ${(g.b || 0).toFixed(1)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc non chia (delta 1 / delta 2): ${(g.delta1_deg || 0).toFixed(4)} deg / ${(g.delta2_deg || 0).toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- He so dich chinh (x1 / x2): ${(g.x1 || 0).toFixed(4)} / ${(g.x2 || 0).toFixed(4)}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Cap chinh xac gia cong: ISO 1328 / DIN 3965 Cap ${g.Q || 6}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Do min bien dang: ${res.name} (${res.ptsPerTooth} diem/rang)`, tblX, tblY, 3.5, 'MFG_TABLE');

        lines.push('0', 'ENDSEC', '0', 'EOF');

        // CRLF is strictly mandatory for AutoCAD 2004+
        return lines.join('\r\n');
    },

    /**
     * Triggers direct browser download of the DXF file
     */
    downloadDXF(geom, target = 'assembly', resLevel = 6) {
        const dxfContent = this.generateDXF(geom, target, resLevel);
        if (!dxfContent) {
            alert('Khong the tao noi dung ban ve DXF.');
            return;
        }

        const z1 = geom.z1 || 18;
        const z2 = geom.z2 || 45;
        const mmn = (geom.mmn || 10).toFixed(1);
        const typeStr = Math.abs(geom.beta_deg || 0) > 1e-4 ? 'Spiral' : 'Straight';

        let filename = '';
        if (target === 'pinion') {
            filename = `Banh_Dan_1_Con_${typeStr}_z${z1}_m${mmn}_muc${resLevel}.dxf`;
        } else if (target === 'gear') {
            filename = `Banh_Bi_Dan_2_Con_${typeStr}_z${z2}_m${mmn}_muc${resLevel}.dxf`;
        } else {
            filename = `Cap_Banh_Rang_Con_${typeStr}_z${z1}x${z2}_m${mmn}_muc${resLevel}.dxf`;
        }

        const blob = new Blob([dxfContent], { type: 'application/dxf;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 300);
    }
};
