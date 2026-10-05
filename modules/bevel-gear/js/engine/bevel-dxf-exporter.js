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

        // 1. Header Section (AC1009 = Release 12, universal standard for AutoCAD 2000/2007/2020/2026 & Mastercam)
        lines.push(
            '0', 'SECTION',
            '2', 'HEADER',
            '9', '$ACADVER',
            '1', 'AC1009',
            '9', '$INSBASE',
            '10', '0.0', '20', '0.0', '30', '0.0',
            '9', '$EXTMIN',
            '10', '-600.0', '20', '-600.0', '30', '0.0',
            '9', '$EXTMAX',
            '10', '600.0', '20', '600.0', '30', '0.0',
            '9', '$DWGCODEPAGE',
            '3', 'ANSI_1252',
            '0', 'ENDSEC'
        );

        // 2. Tables Section (Complete VPORT, LTYPE, LAYER, STYLE, VIEW, UCS, APPID, DIMSTYLE)
        lines.push(
            '0', 'SECTION',
            '2', 'TABLES',
            // VPORT table (All mandatory group codes 10..78 required by AutoCAD 2007 & 2020)
            '0', 'TABLE',
            '2', 'VPORT',
            '70', '1',
            '0', 'VPORT',
            '2', '*ACTIVE',
            '70', '0',
            '10', '0.0', '20', '0.0',
            '11', '1.0', '21', '1.0',
            '12', '250.0', '22', '120.0',
            '13', '0.0', '23', '0.0',
            '14', '10.0', '24', '10.0',
            '15', '10.0', '25', '10.0',
            '16', '0.0', '26', '0.0', '36', '1.0',
            '17', '0.0', '27', '0.0', '37', '0.0',
            '40', '950.0',
            '41', '1.8',
            '42', '50.0',
            '43', '0.0',
            '44', '0.0',
            '50', '0.0',
            '51', '0.0',
            '71', '0',
            '72', '100',
            '73', '1',
            '74', '3',
            '75', '0',
            '76', '0',
            '77', '0',
            '78', '0',
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
            // LAYER table (including mandatory default layer 0 + ROOT_CIRCLE + HATCH + DIMENSIONS)
            '0', 'TABLE',
            '2', 'LAYER',
            '70', '10',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'GEAR1_PINION', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'GEAR2_WHEEL', '70', '0', '62', '30', '6', 'CONTINUOUS',  // Orange
            '0', 'LAYER', '2', 'ROOT_CIRCLE', '70', '0', '62', '3', '6', 'DASHED',       // Green dashed (Tooth root / fillet)
            '0', 'LAYER', '2', 'PITCH_CONES', '70', '0', '62', '2', '6', 'CENTER',       // Yellow dashdot
            '0', 'LAYER', '2', 'CENTER_LINES', '70', '0', '62', '1', '6', 'CENTER',      // Red dashdot
            '0', 'LAYER', '2', 'SHAFTS_BORE', '70', '0', '62', '7', '6', 'CONTINUOUS',   // White
            '0', 'LAYER', '2', 'HATCH', '70', '0', '62', '8', '6', 'CONTINUOUS',         // Gray 45-deg section hatching
            '0', 'LAYER', '2', 'DIMENSIONS', '70', '0', '62', '6', '6', 'CONTINUOUS',    // Magenta dimensions
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',     // White
            '0', 'ENDTAB',
            // STYLE table
            '0', 'TABLE',
            '2', 'STYLE',
            '70', '1',
            '0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0.0', '41', '1.0', '50', '0.0', '71', '0', '42', '2.5', '3', 'txt', '4', '',
            '0', 'ENDTAB',
            // VIEW, UCS, APPID, DIMSTYLE tables
            '0', 'TABLE', '2', 'VIEW', '70', '0', '0', 'ENDTAB',
            '0', 'TABLE', '2', 'UCS', '70', '0', '0', 'ENDTAB',
            '0', 'TABLE', '2', 'APPID', '70', '1',
            '0', 'APPID', '2', 'ACAD', '70', '0',
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'DIMSTYLE', '70', '0', '0', 'ENDTAB',
            '0', 'ENDSEC',
            // 3. Blocks Section ($MODEL_SPACE and $PAPER_SPACE)
            '0', 'SECTION',
            '2', 'BLOCKS',
            '0', 'BLOCK', '8', '0', '2', '$MODEL_SPACE', '70', '0', '10', '0.0', '20', '0.0', '30', '0.0', '3', '$MODEL_SPACE', '1', '',
            '0', 'ENDBLK', '8', '0',
            '0', 'BLOCK', '8', '0', '2', '$PAPER_SPACE', '70', '0', '10', '0.0', '20', '0.0', '30', '0.0', '3', '$PAPER_SPACE', '1', '',
            '0', 'ENDBLK', '8', '0',
            '0', 'ENDSEC'
        );

        // 4. Entities Section
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

        const addPolyline = (pts, layer, closed = true) => {
            if (!pts || pts.length < 2) return;
            lines.push(
                '0', 'POLYLINE',
                '8', layer,
                '66', '1',
                '10', '0.0', '20', '0.0', '30', '0.0',
                '70', closed ? '1' : '0'
            );
            for (const p of pts) {
                lines.push(
                    '0', 'VERTEX',
                    '8', layer,
                    '10', p.x.toFixed(4), '20', p.y.toFixed(4), '30', '0.0'
                );
            }
            lines.push('0', 'SEQEND', '8', layer);
        };

        const addCircle = (cx, cy, r, layer) => {
            lines.push(
                '0', 'CIRCLE',
                '8', layer,
                '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0',
                '40', r.toFixed(4)
            );
        };

        const addArc = (cx, cy, r, startDeg, endDeg, layer) => {
            lines.push(
                '0', 'ARC',
                '8', layer,
                '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0',
                '40', r.toFixed(4),
                '50', startDeg.toFixed(4),
                '51', endDeg.toFixed(4)
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

        // Exact 2D scanline polygon hatch generator (ISO 128 45-degree section hatching)
        const addPolygonHatch = (poly, angleRad, step, layer = 'HATCH') => {
            if (!poly || poly.length < 3) return;
            const cosA = Math.cos(angleRad), sinA = Math.sin(angleRad);
            const rot = poly.map(p => ({
                u: p.x * cosA + p.y * sinA,
                v: -p.x * sinA + p.y * cosA
            }));
            let vMin = Infinity, vMax = -Infinity;
            for (const p of rot) {
                if (p.v < vMin) vMin = p.v;
                if (p.v > vMax) vMax = p.v;
            }
            for (let v = vMin + step * 0.5; v < vMax; v += step) {
                const uInts = [];
                for (let i = 0; i < rot.length; i++) {
                    const a = rot[i], b = rot[(i + 1) % rot.length];
                    if ((a.v <= v && b.v > v) || (b.v <= v && a.v > v)) {
                        const t = (v - a.v) / (b.v - a.v);
                        uInts.push(a.u + t * (b.u - a.u));
                    }
                }
                uInts.sort((a, b) => a - b);
                for (let k = 0; k + 1 < uInts.length; k += 2) {
                    const u1 = uInts[k], u2 = uInts[k + 1];
                    if (Math.abs(u2 - u1) > 1e-3) {
                        const x1 = u1 * cosA - v * sinA, y1 = u1 * sinA + v * cosA;
                        const x2 = u2 * cosA - v * sinA, y2 = u2 * sinA + v * cosA;
                        addLine(x1, y1, x2, y2, layer);
                    }
                }
            }
        };

        // Helper for linear dimension callout in DXF
        const addLinearDim = (x1, y1, x2, y2, label, textH = 3.5, layer = 'DIMENSIONS') => {
            addLine(x1, y1, x2, y2, layer);
            const mx = 0.5 * (x1 + x2), my = 0.5 * (y1 + y2);
            addText(label, mx - label.length * textH * 0.25, my + textH * 0.4, textH, layer);
        };

        // Obtain unified 3D-matched Blank + Extended Cylindrical Hub parameters
        const bp = (typeof BevelGearCanvas !== 'undefined' && BevelGearCanvas.computeBlankAndHubParams)
            ? BevelGearCanvas.computeBlankAndHubParams(g, g.hubOverrides)
            : null;

        const mmn = g.mmn || 10.0;
        const Re = bp ? bp.Re : (g.Re || 338.0);
        const Rm = bp ? bp.Rm : (g.Rm || (Re - (g.b || 117.0) / 2.0));
        const Ri = bp ? bp.Ri : (g.Ri || (Re - (g.b || 117.0)));
        const b = bp ? bp.b : (g.b || 117.0);

        const delta1 = bp ? bp.d1 : (g.delta1 || ((g.delta1_deg || 21.8) * Math.PI / 180.0));
        const delta2 = bp ? bp.d2 : (g.delta2 || ((g.delta2_deg || 68.2) * Math.PI / 180.0));
        const sigmaRad = bp ? bp.sigmaRad : (((g.Sigma_deg || 90.0) * Math.PI) / 180.0);
        const s1 = Math.sin(delta1), c1 = Math.cos(delta1);
        const s2 = Math.sin(delta2), c2 = Math.cos(delta2);

        const hae1 = bp ? bp.hae1 : (g.hae1 || (mmn * 1.32 * Re / Rm));
        const hfe1 = bp ? bp.hfe1 : (g.hfe1 || (mmn * 0.88 * Re / Rm));
        const hai1 = bp ? bp.hai1 : (hae1 * Ri / Re);
        const hfi1 = bp ? bp.hfi1 : (hfe1 * Ri / Re);

        const hae2 = bp ? bp.hae2 : (g.hae2 || (mmn * 0.68 * Re / Rm));
        const hfe2 = bp ? bp.hfe2 : (g.hfe2 || (mmn * 1.52 * Re / Rm));
        const hai2 = bp ? bp.hai2 : (hae2 * Ri / Re);
        const hfi2 = bp ? bp.hfi2 : (hfe2 * Ri / Re);

        const rBore1 = bp ? bp.rBore1 : (2.5 * mmn);
        const rBore2 = bp ? bp.rBore2 : (5.0 * mmn);
        const z_toe_hub1 = bp ? bp.z_toe_hub1 : (Ri * c1 + (hfi1 + 0.48 * mmn) * s1);
        const r_toe_rim1 = bp ? bp.r_toe_rim1 : Math.max(rBore1 + 2.0, Ri * s1 - (hfi1 + 0.48 * mmn) * c1);
        const z_heel_rim1 = bp ? bp.z_heel_rim1 : (Re * c1 + (hfe1 + 1.33 * mmn) * s1);
        const r_heel_rim1 = bp ? bp.r_heel_rim1 : Math.max(rBore1 + 5.0, Re * s1 - (hfe1 + 1.33 * mmn) * c1);
        const z_tip_max1 = bp ? bp.z_tip_max1 : (Re * c1 - hae1 * s1);
        const rHub1 = bp ? bp.rHub1 : (5.75 * mmn);
        const z_hub_end1 = bp ? bp.z_hub_end1 : (z_heel_rim1 + 4.5 * mmn);
        const LApex1 = bp ? bp.LApex1 : z_hub_end1;
        const LTip1 = bp ? bp.LTip1 : (z_hub_end1 - z_tip_max1);

        const z_toe_hub2 = bp ? bp.z_toe_hub2 : (Ri * c2 + (hfi2 + 0.59 * mmn) * s2);
        const r_toe_rim2 = bp ? bp.r_toe_rim2 : Math.max(rBore2 + 2.0, Ri * s2 - (hfi2 + 0.59 * mmn) * c2);
        const z_heel_rim2 = bp ? bp.z_heel_rim2 : (Re * c2 + (hfe2 + 2.0 * mmn) * s2);
        const r_heel_rim2 = bp ? bp.r_heel_rim2 : Math.max(rBore2 + 5.0, Re * s2 - (hfe2 + 2.0 * mmn) * c2);
        const z_tip_max2 = bp ? bp.z_tip_max2 : (Re * c2 - hae2 * s2);
        const rHub2 = bp ? bp.rHub2 : (9.0 * mmn);
        const z_hub_end2 = bp ? bp.z_hub_end2 : (z_heel_rim2 + 4.0 * mmn);
        const LApex2 = bp ? bp.LApex2 : z_hub_end2;
        const LTip2 = bp ? bp.LTip2 : (z_hub_end2 - z_tip_max2);

        const dae1 = g.dae1 || (2.0 * (Re * s1 + hae1 * c1));
        const dae2 = g.dae2 || (2.0 * (Re * s2 + hae2 * c2));
        const hatchStep = Math.max(2.5, 0.75 * mmn);

        // =========================================================================
        // VIEW 1: 2D AXIAL CROSS-SECTION WITH FULL TOOTH ROOT & EXTENDED HUB
        // In AutoCAD (+Y is UP): Pinion 1 along +X, Gear 2 along +Sigma (+Y when Sigma=90°)
        // Shared Pitch Cone Generator is along (+c1, +s1)
        // =========================================================================
        const drawAxialPinion = (offX = 0, offY = 0) => {
            const layer = 'GEAR1_PINION';
            const buildHalf = (signY) => {
                const toe_root     = { x: offX + Ri * c1 + hfi1 * s1, y: offY + signY * (Ri * s1 - hfi1 * c1) };
                const toe_tip      = { x: offX + Ri * c1 - hai1 * s1, y: offY + signY * (Ri * s1 + hai1 * c1) };
                const heel_tip     = { x: offX + Re * c1 - hae1 * s1, y: offY + signY * (Re * s1 + hae1 * c1) };
                const heel_root    = { x: offX + Re * c1 + hfe1 * s1, y: offY + signY * (Re * s1 - hfe1 * c1) };
                const heel_rim     = { x: offX + z_heel_rim1,         y: offY + signY * r_heel_rim1 };
                const hub_step     = { x: offX + z_heel_rim1,         y: offY + signY * rHub1 };
                const hub_end_out  = { x: offX + z_hub_end1,          y: offY + signY * rHub1 };
                const hub_end_bore = { x: offX + z_hub_end1,          y: offY + signY * rBore1 };
                const toe_bore     = { x: offX + z_toe_hub1,          y: offY + signY * rBore1 };
                const toe_rim      = { x: offX + z_toe_hub1,          y: offY + signY * r_toe_rim1 };

                // 1. Tooth Polygon (Addendum + Dedendum closed with Root Cone Line toe_root -> heel_root)
                const toothPoly = [toe_root, toe_tip, heel_tip, heel_root];
                addPolyline(toothPoly, layer, true);
                // Explicit Root Cone Line (Đường chân răng) on ROOT_CIRCLE & GEAR1_PINION
                addLine(toe_root.x, toe_root.y, heel_root.x, heel_root.y, 'ROOT_CIRCLE');

                // 2. Rim + Extended Cylindrical Hub Polygon (45-deg Cross-Hatched)
                const bodyPoly = [
                    toe_root, heel_root, heel_rim, hub_step,
                    hub_end_out, hub_end_bore, toe_bore, toe_rim
                ];
                addPolyline(bodyPoly, layer, true);
                addPolygonHatch(bodyPoly, Math.PI / 4, hatchStep, 'HATCH');

                return { toe_bore, hub_end_bore, hub_end_out, heel_tip };
            };

            const topH = buildHalf(+1);
            const botH = buildHalf(-1);

            // Bore & Hub End connecting lines across Pinion 1 shaft axis
            addLine(topH.toe_bore.x, topH.toe_bore.y, botH.toe_bore.x, botH.toe_bore.y, 'SHAFTS_BORE');
            addLine(topH.hub_end_bore.x, topH.hub_end_bore.y, botH.hub_end_bore.x, botH.hub_end_bore.y, 'SHAFTS_BORE');

            // Pitch Cone Generators & Shaft Axis
            addLine(offX, offY, offX + Re * c1 * 1.08, offY + Re * s1 * 1.08, 'PITCH_CONES');
            addLine(offX, offY, offX + Re * c1 * 1.08, offY - Re * s1 * 1.08, 'PITCH_CONES');
            addLine(offX - 25, offY, offX + z_hub_end1 + 35, offY, 'CENTER_LINES');

            // Key Dimensions for Pinion 1 (dae1, dm1, L_Tip1, L_Apex1)
            addLinearDim(offX + z_hub_end1 + 18, offY - rHub1, offX + z_hub_end1 + 18, offY + rHub1, `dm1=${(2 * rHub1).toFixed(1)}`, 3.2);
            addLinearDim(offX + z_hub_end1 + 45, offY - dae1 / 2, offX + z_hub_end1 + 45, offY + dae1 / 2, `dae1=${dae1.toFixed(1)}`, 3.2);
            addLinearDim(offX + z_tip_max1, offY - dae1 / 2 - 18, offX + z_hub_end1, offY - dae1 / 2 - 18, `L_Tip1=${LTip1.toFixed(1)}`, 3.2);
            addLinearDim(offX, offY - dae1 / 2 - 34, offX + z_hub_end1, offY - dae1 / 2 - 34, `L_Apex1=${LApex1.toFixed(1)}`, 3.2);
        };

        const drawAxialGear = (offX = 0, offY = 0) => {
            const layer = 'GEAR2_WHEEL';
            // In AutoCAD (+Y is UP): Gear 2 axis is at +sigmaRad from +X
            const uAx2 = { x: Math.cos(sigmaRad), y: Math.sin(sigmaRad) };
            const uRad2 = { x: Math.sin(sigmaRad), y: -Math.cos(sigmaRad) };
            const toGW = (zL, rL) => ({
                x: offX + zL * uAx2.x + rL * uRad2.x,
                y: offY + zL * uAx2.y + rL * uRad2.y
            });

            const buildHalf = (signR) => {
                const toe_root     = toGW(Ri * c2 + hfi2 * s2, signR * (Ri * s2 - hfi2 * c2));
                const toe_tip      = toGW(Ri * c2 - hai2 * s2, signR * (Ri * s2 + hai2 * c2));
                const heel_tip     = toGW(Re * c2 - hae2 * s2, signR * (Re * s2 + hae2 * c2));
                const heel_root    = toGW(Re * c2 + hfe2 * s2, signR * (Re * s2 - hfe2 * c2));
                const heel_rim     = toGW(z_heel_rim2,         signR * r_heel_rim2);
                const hub_step     = toGW(z_heel_rim2,         signR * rHub2);
                const hub_end_out  = toGW(z_hub_end2,          signR * rHub2);
                const hub_end_bore = toGW(z_hub_end2,          signR * rBore2);
                const toe_bore     = toGW(z_toe_hub2,          signR * rBore2);
                const toe_rim      = toGW(z_toe_hub2,          signR * r_toe_rim2);

                // 1. Tooth Polygon (Addendum + Dedendum closed with Root Cone Line toe_root -> heel_root)
                const toothPoly = [toe_root, toe_tip, heel_tip, heel_root];
                addPolyline(toothPoly, layer, true);
                addLine(toe_root.x, toe_root.y, heel_root.x, heel_root.y, 'ROOT_CIRCLE');

                // 2. Rim + Extended Cylindrical Hub Polygon (-45-deg Cross-Hatched)
                const bodyPoly = [
                    toe_root, heel_root, heel_rim, hub_step,
                    hub_end_out, hub_end_bore, toe_bore, toe_rim
                ];
                addPolyline(bodyPoly, layer, true);
                addPolygonHatch(bodyPoly, -Math.PI / 4, hatchStep, 'HATCH');

                return { toe_bore, hub_end_bore, hub_end_out, heel_tip };
            };

            const rightH = buildHalf(+1);
            const leftH  = buildHalf(-1);

            // Bore & Hub End connecting lines across Gear 2 shaft axis
            addLine(rightH.toe_bore.x, rightH.toe_bore.y, leftH.toe_bore.x, leftH.toe_bore.y, 'SHAFTS_BORE');
            addLine(rightH.hub_end_bore.x, rightH.hub_end_bore.y, leftH.hub_end_bore.x, leftH.hub_end_bore.y, 'SHAFTS_BORE');

            // Pitch Cone Generators & Shaft Axis
            const pPitchR = toGW(Re * c2 * 1.08, +Re * s2 * 1.08);
            const pPitchL = toGW(Re * c2 * 1.08, -Re * s2 * 1.08);
            addLine(offX, offY, pPitchR.x, pPitchR.y, 'PITCH_CONES');
            addLine(offX, offY, pPitchL.x, pPitchL.y, 'PITCH_CONES');
            const pAxisStart = toGW(-25, 0);
            const pAxisEnd   = toGW(z_hub_end2 + 35, 0);
            addLine(pAxisStart.x, pAxisStart.y, pAxisEnd.x, pAxisEnd.y, 'CENTER_LINES');

            // Key Dimensions for Gear 2 (dae2, dm2, L_Tip2, L_Apex2)
            const pDmL = toGW(z_hub_end2 + 16, -rHub2), pDmR = toGW(z_hub_end2 + 16, +rHub2);
            addLinearDim(pDmL.x, pDmL.y, pDmR.x, pDmR.y, `dm2=${(2 * rHub2).toFixed(1)}`, 3.2);
            const pDaeL = toGW(z_hub_end2 + 40, -dae2 / 2), pDaeR = toGW(z_hub_end2 + 40, +dae2 / 2);
            addLinearDim(pDaeL.x, pDaeL.y, pDaeR.x, pDaeR.y, `dae2=${dae2.toFixed(1)}`, 3.2);
            const pLTip1 = toGW(z_tip_max2, -dae2 / 2 - 18), pLTip2 = toGW(z_hub_end2, -dae2 / 2 - 18);
            addLinearDim(pLTip1.x, pLTip1.y, pLTip2.x, pLTip2.y, `L_Tip2=${LTip2.toFixed(1)}`, 3.2);
            const pLAp1 = toGW(0, -dae2 / 2 - 34), pLAp2 = toGW(z_hub_end2, -dae2 / 2 - 34);
            addLinearDim(pLAp1.x, pLAp1.y, pLAp2.x, pLAp2.y, `L_Apex2=${LApex2.toFixed(1)}`, 3.2);
        };

        // =========================================================================
        // VIEW 2: 2D TREDGOLD VIRTUAL TOOTH PROFILE (WITH FULL ROOT & Rf = 0.38*mmn)
        // Closed multi-tooth gear segment + Root Circle rvf + Pitch Circle rv + Tip Circle rva
        // =========================================================================
        const drawVirtualToothProfile = (isPinion, offX, offY) => {
            if (typeof Bevel3DGenerator === 'undefined' || !Bevel3DGenerator.generateSliceToothContour) return;
            const alfa = ((g.alfa_deg !== undefined ? g.alfa_deg : 20.0) * Math.PI) / 180.0;
            const beta = ((g.beta_deg !== undefined ? g.beta_deg : 0.0) * Math.PI) / 180.0;
            const isSpiral = Math.abs(beta) > 1e-4;
            const z = isPinion ? (g.z1 || 18) : (g.z2 || 45);
            const delta = isPinion ? delta1 : delta2;
            const ha_s = isPinion ? (g.ha1 || mmn * 1.32) : (g.ha2 || mmn * 0.68);
            const hf_s = isPinion ? (g.hf1 || mmn * 0.88) : (g.hf2 || mmn * 1.52);
            const sn_s = isPinion ? (g.sn1 || mmn * 1.84) : (g.sn2 || mmn * 1.30);
            const layer = isPinion ? 'GEAR1_PINION' : 'GEAR2_WHEEL';

            const slice = Bevel3DGenerator.generateSliceToothContour({
                z, mmn, Rm, R_s: Rm, delta, alfa, beta, isSpiral,
                ha_s, hf_s, sn_s, ptsPerFlank: res.ptsPerFlank, ptsFillet: 10
            });
            const rv = slice.rv, rvf = slice.rvf, rva = slice.rva, cosD = slice.cosD;
            const pPsi = (2.0 * Math.PI / z) * cosD;
            const rimDepth = Math.max(mmn * 2.2, (rva - rvf) * 1.15);
            const rInnerRim = Math.max(2.0, rvf - rimDepth);
            const kMin = -3, kMax = 3;

            // In AutoCAD (+Y is UP):
            // Pinion 1 virtual center is at (offX, offY - rv), teeth at psi=0 point UP (+Y) to (offX, offY)
            // Gear 2 virtual center is at (offX, offY + rv), teeth at psi=0 point DOWN (-Y) to (offX, offY)
            const cx = offX;
            const cy = isPinion ? (offY - rv) : (offY + rv);
            const toPt = (r, psi) => ({
                x: cx + r * Math.sin(psi),
                y: isPinion ? (cy + r * Math.cos(psi)) : (cy - r * Math.cos(psi))
            });

            const contourPts = [];
            for (let k = kMin; k <= kMax; k++) {
                const centerPsi = (isPinion ? k : (k + 0.5)) * pPsi;
                for (let idx = 0; idx < slice.toothContour.length; idx++) {
                    if (k > kMin && idx === 0) continue;
                    const tc = slice.toothContour[idx];
                    const r = rv + tc.h;
                    const psi = centerPsi + tc.theta * cosD;
                    contourPts.push(toPt(r, psi));
                }
            }

            // Close the multi-tooth segment along the inner rim arc so the tooth root & rim form a closed body
            const maxPsi = (isPinion ? kMax : (kMax + 0.5)) * pPsi + slice.half_pitch * cosD;
            const minPsi = (isPinion ? kMin : (kMin + 0.5)) * pPsi - slice.half_pitch * cosD;
            const fullPoly = [...contourPts];
            const rimSteps = 28;
            for (let s = 0; s <= rimSteps; s++) {
                const psi = maxPsi - (s / rimSteps) * (maxPsi - minPsi);
                fullPoly.push(toPt(rInnerRim, psi));
            }
            addPolyline(fullPoly, layer, true);

            // Reference Root Circle Arc (rvf - Vòng chân răng), Pitch Circle Arc (rv), Tip Circle Arc (rva)
            const refArcPts = (radius) => {
                const arr = [];
                for (let s = 0; s <= 32; s++) {
                    const psi = minPsi + (s / 32) * (maxPsi - minPsi);
                    arr.push(toPt(radius, psi));
                }
                return arr;
            };
            addPolyline(refArcPts(rvf), 'ROOT_CIRCLE', false);
            addPolyline(refArcPts(rv), 'PITCH_CONES', false);
            addPolyline(refArcPts(rva), 'DIMENSIONS', false);

            // Draw analytical C1 Root Fillet Circle preview (Rf = 0.38 * mmn) at Tooth 0
            if (slice.fillet && isPinion) {
                const rCf = Math.hypot(slice.fillet.Cfx, slice.fillet.Cfy);
                const psiCf = Math.atan2(slice.fillet.Cfx, slice.fillet.Cfy);
                const cfPt = toPt(rCf, psiCf);
                addCircle(cfPt.x, cfPt.y, slice.fillet.Rf, 'ROOT_CIRCLE');
                addText(`R_chan=${slice.fillet.Rf.toFixed(2)}`, cfPt.x + slice.fillet.Rf + 1.5, cfPt.y, 2.8, 'ROOT_CIRCLE');
            }
        };

        // =========================================================================
        // VIEW 3: FULL 360° CLOSED CROWN GEAR TOOTH WHEEL (z TEETH WITH ROOT & HUB)
        // Complete closed 360° tooth ring with z integer teeth, root circle, hub circle, and bore
        // =========================================================================
        const drawFullCrownWheel = (isPinion, centerX, centerY) => {
            if (typeof Bevel3DGenerator === 'undefined' || !Bevel3DGenerator.generateSliceToothContour) return;
            const alfa = ((g.alfa_deg !== undefined ? g.alfa_deg : 20.0) * Math.PI) / 180.0;
            const beta = ((g.beta_deg !== undefined ? g.beta_deg : 0.0) * Math.PI) / 180.0;
            const isSpiral = Math.abs(beta) > 1e-4;
            const z = isPinion ? (g.z1 || 18) : (g.z2 || 45);
            const delta = isPinion ? delta1 : delta2;
            const ha_s = isPinion ? (g.ha1 || mmn * 1.32) : (g.ha2 || mmn * 0.68);
            const hf_s = isPinion ? (g.hf1 || mmn * 0.88) : (g.hf2 || mmn * 1.52);
            const sn_s = isPinion ? (g.sn1 || mmn * 1.84) : (g.sn2 || mmn * 1.30);
            const layer = isPinion ? 'GEAR1_PINION' : 'GEAR2_WHEEL';
            const rPitch = isPinion ? (0.5 * (g.dm1 || (2 * Rm * s1))) : (0.5 * (g.dm2 || (2 * Rm * s2)));
            const rHub = isPinion ? rHub1 : rHub2;
            const rBore = isPinion ? rBore1 : rBore2;

            const slice = Bevel3DGenerator.generateSliceToothContour({
                z, mmn, Rm, R_s: Rm, delta, alfa, beta, isSpiral,
                ha_s, hf_s, sn_s, ptsPerFlank: Math.max(8, Math.round(res.ptsPerFlank * 0.75)), ptsFillet: 8
            });

            const wheelPts = [];
            for (let k = 0; k < z; k++) {
                const baseAngle = (k * 2.0 * Math.PI) / z;
                for (let idx = 0; idx < slice.toothContour.length; idx++) {
                    if (k > 0 && idx === 0) continue;
                    const tc = slice.toothContour[idx];
                    const r = Math.max(rBore + 2.0, rPitch + tc.h);
                    const ang = baseAngle + tc.theta;
                    wheelPts.push({
                        x: centerX + r * Math.cos(ang),
                        y: centerY + r * Math.sin(ang)
                    });
                }
            }
            addPolyline(wheelPts, layer, true);

            // Reference Root Circle, Pitch Circle, Tip Circle, Extended Hub Circle, and Bore Circle
            addCircle(centerX, centerY, Math.max(rBore + 2.0, rPitch - hf_s), 'ROOT_CIRCLE');
            addCircle(centerX, centerY, rPitch, 'PITCH_CONES');
            addCircle(centerX, centerY, rPitch + ha_s, 'DIMENSIONS');
            addCircle(centerX, centerY, rHub, layer);
            addCircle(centerX, centerY, rBore, 'SHAFTS_BORE');
            // Center crosshairs
            const cLen = rPitch + ha_s + 15;
            addLine(centerX - cLen, centerY, centerX + cLen, centerY, 'CENTER_LINES');
            addLine(centerX, centerY - cLen, centerX, centerY + cLen, 'CENTER_LINES');
            addText(
                isPinion ? `BANH DAN 1 (z1=${z}, dm1=${(2 * rHub).toFixed(1)}, dBore1=${(2 * rBore).toFixed(1)})`
                         : `BANH BI DAN 2 (z2=${z}, dm2=${(2 * rHub).toFixed(1)}, dBore2=${(2 * rBore).toFixed(1)})`,
                centerX - rPitch * 0.85, centerY - cLen - 12, 4.0, 'MFG_TABLE'
            );
        };

        const profileOffX = z_hub_end1 + Math.max(dae1, dae2) * 0.65 + 90;
        const profileOffY = dae2 * 0.25;
        const wheelOffX = profileOffX + Math.max(dae1, dae2) * 0.95 + 120;

        // Draw views depending on target
        addText('BIEU DO 1: MAT CAT TRUC KY THUAT & MAY-O KEO DAI (ISO 23509)', -40, dae2 * 0.65 + 45, 4.2, 'MFG_TABLE');
        addText('BIEU DO 2: BIEN DANG RANG 2D CO R CHAN = 0.38*mmn & DAY RANH', profileOffX - 75, dae2 * 0.65 + 45, 4.2, 'MFG_TABLE');
        addText('BIEU DO 3: BANH RANG CON DAY DU 360 DO (VONG CHAN RANG & MAY-O)', wheelOffX - 95, dae2 * 0.65 + 45, 4.2, 'MFG_TABLE');

        if (target === 'pinion') {
            drawAxialPinion(0, 0);
            drawVirtualToothProfile(true, profileOffX, 0);
            drawFullCrownWheel(true, wheelOffX, 0);
        } else if (target === 'gear') {
            drawAxialGear(0, 0);
            drawVirtualToothProfile(false, profileOffX, 0);
            drawFullCrownWheel(false, wheelOffX, 0);
        } else {
            // Assembly Pair: Both wheels sharing common Apex V(0, 0) + Meshing 2D Tooth Profile + Full Crown Wheels
            drawAxialPinion(0, 0);
            drawAxialGear(0, 0);
            drawVirtualToothProfile(true, profileOffX, profileOffY);
            drawVirtualToothProfile(false, profileOffX, profileOffY);
            drawFullCrownWheel(true, wheelOffX, dae2 * 0.55);
            drawFullCrownWheel(false, wheelOffX, -dae2 * 0.35);
        }

        // Manufacturing Table Definition
        const tblX = -Math.max(dae1, dae2) * 0.75 - 40;
        let tblY = -dae1 * 0.65 - 60;
        const rowH = 7.5;

        addText('THONG SO CHE TAO BO TRUYEN BANH RANG CON & MAY-O (ISO 23509 / DIN 3971)', tblX, tblY, 4.5, 'MFG_TABLE');
        tblY -= rowH * 1.3;
        addText(`- So rang (Pinion z1 / Gear z2): ${g.z1} / ${g.z2}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Mo-dun phap trung binh (mmn): ${(g.mmn || 10).toFixed(3)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Ban kinh luon chan rang (Rf = 0.38*mmn): ${(0.38 * (g.mmn || 10)).toFixed(3)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- May-o keo dai Banh 1: Duong kinh dm1 = ${(2 * rHub1).toFixed(2)} mm | L_Apex1 = ${LApex1.toFixed(2)} mm | L_Tip1 = ${LTip1.toFixed(2)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- May-o keo dai Banh 2: Duong kinh dm2 = ${(2 * rHub2).toFixed(2)} mm | L_Apex2 = ${LApex2.toFixed(2)} mm | L_Tip2 = ${LTip2.toFixed(2)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
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
     * Generates Unified DXF containing BOTH 2D Conjugate Meshing Pairs (Outer Re & Inner Ri)
     * AND Concentric Tooth Slot Profiles (Rãnh Răng Đồng Tâm) for CAM Milling / CAD Lofting (Mastercam / SolidWorks)
     * @param {Object} g - Calculation geometry results
     * @param {number} resLevel - 1 to 11
     * @returns {string} DXF string
     */
    generateUnifiedTredgoldDXF(g, resLevel = 6) {
        if (!g) return '';
        const res = BEVEL_PROFILE_RESOLUTIONS[resLevel] || BEVEL_PROFILE_RESOLUTIONS[6];
        const lines = [];

        // 1. Header Section
        lines.push(
            '0', 'SECTION', '2', 'HEADER',
            '9', '$ACADVER', '1', 'AC1009',
            '9', '$INSBASE', '10', '0.0', '20', '0.0', '30', '0.0',
            '9', '$EXTMIN', '10', '-600.0', '20', '-600.0', '30', '0.0',
            '9', '$EXTMAX', '10', '1800.0', '20', '1000.0', '30', '0.0',
            '9', '$DWGCODEPAGE', '3', 'ANSI_1252',
            '0', 'ENDSEC'
        );

        // 2. Tables Section
        lines.push(
            '0', 'SECTION', '2', 'TABLES',
            '0', 'TABLE', '2', 'VPORT', '70', '1',
            '0', 'VPORT', '2', '*ACTIVE', '70', '0',
            '10', '0.0', '20', '0.0', '11', '1.0', '21', '1.0',
            '12', '450.0', '22', '120.0', '13', '0.0', '23', '0.0',
            '14', '10.0', '24', '10.0', '15', '10.0', '25', '10.0',
            '16', '0.0', '26', '0.0', '36', '1.0', '17', '0.0', '27', '0.0', '37', '0.0',
            '40', '1200.0', '41', '1.8', '42', '50.0', '43', '0.0', '44', '0.0',
            '50', '0.0', '51', '0.0', '71', '0', '72', '100', '73', '1', '74', '3',
            '75', '0', '76', '0', '77', '0', '78', '0',
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'LTYPE', '70', '3',
            '0', 'LTYPE', '2', 'CONTINUOUS', '70', '0', '3', 'Solid line', '72', '65', '73', '0', '40', '0.0',
            '0', 'LTYPE', '2', 'CENTER', '70', '0', '3', 'Center ____ _ ____ _ ____', '72', '65', '73', '4', '40', '50.0',
            '49', '31.75', '49', '-6.35', '49', '6.35', '49', '-6.35',
            '0', 'LTYPE', '2', 'DASHED', '70', '0', '3', 'Dashed __ __ __ __', '72', '65', '73', '2', '40', '19.05',
            '49', '12.7', '49', '-6.35',
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'LAYER', '70', '22',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'MESH_OUTER_PINION', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'MESH_OUTER_GEAR', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'MESH_INNER_PINION', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'MESH_INNER_GEAR', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'MESH_TIP_ARCS', '70', '0', '62', '6', '6', 'CONTINUOUS',      // Magenta
            '0', 'LAYER', '2', 'SLOT_PINION_OUTER_R', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'SLOT_PINION_OUTER_R0', '70', '0', '62', '5', '6', 'CONTINUOUS', // Blue (R=0 sharp)
            '0', 'LAYER', '2', 'SLOT_PINION_INNER_R', '70', '0', '62', '140', '6', 'CONTINUOUS', // Light Blue
            '0', 'LAYER', '2', 'SLOT_PINION_INNER_R0', '70', '0', '62', '150', '6', 'CONTINUOUS', // Blue-violet
            '0', 'LAYER', '2', 'SLOT_GEAR_OUTER_R', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'SLOT_GEAR_OUTER_R0', '70', '0', '62', '20', '6', 'CONTINUOUS',  // Red-orange (R=0 sharp)
            '0', 'LAYER', '2', 'SLOT_GEAR_INNER_R', '70', '0', '62', '40', '6', 'CONTINUOUS',   // Light Orange
            '0', 'LAYER', '2', 'SLOT_GEAR_INNER_R0', '70', '0', '62', '42', '6', 'CONTINUOUS',  // Amber
            '0', 'LAYER', '2', 'SLOT_TIP_ARCS', '70', '0', '62', '6', '6', 'CONTINUOUS',       // Magenta
            '0', 'LAYER', '2', 'SLOT_ROOT_ARCS', '70', '0', '62', '3', '6', 'CONTINUOUS',      // Green
            '0', 'LAYER', '2', 'PITCH_CIRCLES', '70', '0', '62', '2', '6', 'CENTER',          // Yellow
            '0', 'LAYER', '2', 'ROOT_CIRCLES', '70', '0', '62', '3', '6', 'DASHED',          // Green
            '0', 'LAYER', '2', 'TIP_CIRCLES', '70', '0', '62', '6', '6', 'DASHED',           // Magenta
            '0', 'LAYER', '2', 'CENTER_AXES', '70', '0', '62', '1', '6', 'CENTER',           // Red
            '0', 'LAYER', '2', 'LINE_OF_ACTION', '70', '0', '62', '1', '6', 'DASHED',        // Red
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',         // White
            '0', 'LAYER', '2', 'DIMENSIONS', '70', '0', '62', '6', '6', 'CONTINUOUS',        // Magenta
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'STYLE', '70', '1',
            '0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0.0', '41', '1.0', '50', '0.0', '71', '0', '42', '2.5', '3', 'txt', '4', '',
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'VIEW', '70', '0', '0', 'ENDTAB',
            '0', 'TABLE', '2', 'UCS', '70', '0', '0', 'ENDTAB',
            '0', 'TABLE', '2', 'APPID', '70', '1',
            '0', 'APPID', '2', 'ACAD', '70', '0',
            '0', 'ENDTAB',
            '0', 'TABLE', '2', 'DIMSTYLE', '70', '0', '0', 'ENDTAB',
            '0', 'ENDSEC',
            '0', 'SECTION', '2', 'BLOCKS',
            '0', 'BLOCK', '8', '0', '2', '$MODEL_SPACE', '70', '0', '10', '0.0', '20', '0.0', '30', '0.0', '3', '$MODEL_SPACE', '1', '',
            '0', 'ENDBLK', '8', '0',
            '0', 'BLOCK', '8', '0', '2', '$PAPER_SPACE', '70', '0', '10', '0.0', '20', '0.0', '30', '0.0', '3', '$PAPER_SPACE', '1', '',
            '0', 'ENDBLK', '8', '0',
            '0', 'ENDSEC',
            '0', 'SECTION', '2', 'ENTITIES'
        );

        // Drawing primitives
        const addLine = (x1, y1, x2, y2, layer) => {
            lines.push(
                '0', 'LINE', '8', layer,
                '10', x1.toFixed(4), '20', y1.toFixed(4), '30', '0.0',
                '11', x2.toFixed(4), '21', y2.toFixed(4), '31', '0.0'
            );
        };

        const addArc = (cx, cy, r, startAngleDeg, endAngleDeg, layer) => {
            let sDeg = startAngleDeg % 360;
            if (sDeg < 0) sDeg += 360;
            let eDeg = endAngleDeg % 360;
            if (eDeg < 0) eDeg += 360;
            lines.push(
                '0', 'ARC', '8', layer,
                '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0',
                '40', r.toFixed(4),
                '50', sDeg.toFixed(4),
                '51', eDeg.toFixed(4)
            );
        };

        const addPolyline = (pts, layer, closed = true) => {
            if (!pts || pts.length < 2) return;
            lines.push(
                '0', 'POLYLINE', '8', layer,
                '66', '1',
                '70', closed ? '1' : '0'
            );
            for (const pt of pts) {
                lines.push(
                    '0', 'VERTEX', '8', layer,
                    '10', pt.x.toFixed(4), '20', pt.y.toFixed(4), '30', '0.0'
                );
                if (pt.bulge !== undefined && Math.abs(pt.bulge) > 1e-6) {
                    lines.push('42', pt.bulge.toFixed(6));
                }
            }
            lines.push('0', 'SEQEND');
        };

        const addText = (text, x, y, height = 3.5, layer = 'MFG_TABLE') => {
            lines.push(
                '0', 'TEXT', '8', layer,
                '10', x.toFixed(4), '20', y.toFixed(4), '30', '0.0',
                '40', height.toFixed(2),
                '1', String(text)
            );
        };

        // Extract geometry
        const z1 = parseInt(g.z1) || 18;
        const z2 = parseInt(g.z2) || 45;
        const mmn = parseFloat(g.mmn) || 10.0;
        const met = parseFloat(g.met) || (mmn * 1.0667);
        const mit = parseFloat(g.mit) || (mmn * 0.7234);
        const b = parseFloat(g.b) || 117.0;
        const Re = parseFloat(g.Re) || 338.0;
        const Ri = parseFloat(g.Ri) || (Re - b);
        const Rm = parseFloat(g.Rm) || (Re - b / 2.0);

        const delta1 = (parseFloat(g.delta1_deg) || 21.8014) * Math.PI / 180.0;
        const delta2 = (parseFloat(g.delta2_deg) || 68.1986) * Math.PI / 180.0;
        const alfa = (parseFloat(g.alfa_deg) || 20.0) * Math.PI / 180.0;
        const beta = (parseFloat(g.beta_deg) || 0.0) * Math.PI / 180.0;
        const isSpiral = Math.abs(beta) > 1e-4;

        const hae1 = parseFloat(g.hae1) || (mmn * 1.32 * Re / Rm);
        const hfe1 = parseFloat(g.hfe1) || (mmn * 0.88 * Re / Rm);
        const hai1 = parseFloat(g.hai1) || (hae1 * Ri / Re);
        const hfi1 = parseFloat(g.hfi1) || (hfe1 * Ri / Re);

        const hae2 = parseFloat(g.hae2) || (mmn * 0.68 * Re / Rm);
        const hfe2 = parseFloat(g.hfe2) || (mmn * 1.52 * Re / Rm);
        const hai2 = parseFloat(g.hai2) || (hae2 * Ri / Re);
        const hfi2 = parseFloat(g.hfi2) || (hfe2 * Ri / Re);

        const sne1 = parseFloat(g.sne1) || (mmn * 1.84 * Re / Rm);
        const sne2 = parseFloat(g.sne2) || (mmn * 1.30 * Re / Rm);
        const sni1 = parseFloat(g.sni1) || (sne1 * Ri / Re);
        const sni2 = parseFloat(g.sni2) || (sne2 * Ri / Re);

        const ptsPerFlank = res.ptsPerFlank;
        const ptsFillet = Math.max(6, Math.round(ptsPerFlank * 0.4));

        // Generate Slices
        const slice1_e = Bevel3DGenerator.generateSliceToothContour({
            z: z1, mmn, Rm, R_s: Re, delta: delta1, alfa, beta, isSpiral,
            ha_s: hae1, hf_s: hfe1, sn_s: sne1, ptsPerFlank, ptsFillet
        });
        slice1_e.z = z1;

        const slice2_e = Bevel3DGenerator.generateSliceToothContour({
            z: z2, mmn, Rm, R_s: Re, delta: delta2, alfa, beta, isSpiral,
            ha_s: hae2, hf_s: hfe2, sn_s: sne2, ptsPerFlank, ptsFillet
        });
        slice2_e.z = z2;

        const slice1_i = Bevel3DGenerator.generateSliceToothContour({
            z: z1, mmn, Rm, R_s: Ri, delta: delta1, alfa, beta, isSpiral,
            ha_s: hai1, hf_s: hfi1, sn_s: sni1, ptsPerFlank, ptsFillet
        });
        slice1_i.z = z1;

        const slice2_i = Bevel3DGenerator.generateSliceToothContour({
            z: z2, mmn, Rm, R_s: Ri, delta: delta2, alfa, beta, isSpiral,
            ha_s: hai2, hf_s: hfi2, sn_s: sni2, ptsPerFlank, ptsFillet
        });
        slice2_i.z = z2;

        const rve1 = slice1_e.rv, rvae1 = slice1_e.rva, rvfe1 = slice1_e.rvf;
        const rve2 = slice2_e.rv, rvae2 = slice2_e.rva, rvfe2 = slice2_e.rvf;
        const rvi1 = slice1_i.rv, rvai1 = slice1_i.rva, rvfi1 = slice1_i.rvf;
        const rvi2 = slice2_i.rv, rvai2 = slice2_i.rva, rvfi2 = slice2_i.rvf;

        // Slot Generator: Closed Polyline Loop With Fillet R (0.38*m)
        const buildClosedSlotWithFillet = (slice, cx, cy) => {
            const half_pitch = slice.half_pitch;
            const cosD = slice.cosD;
            const rv = slice.rv;
            const rva = slice.rva;

            let tipIdx = -1;
            for (let i = Math.floor(slice.toothContour.length / 2); i < slice.toothContour.length; i++) {
                if (slice.toothContour[i].zone === 'tip_corner') {
                    tipIdx = i;
                    break;
                }
            }

            const leftPts = [];
            for (let i = tipIdx; i < slice.toothContour.length; i++) {
                const tc = slice.toothContour[i];
                const r = rv + tc.h;
                const psi = (tc.theta - half_pitch) * cosD;
                leftPts.push({ x: cx + r * Math.sin(psi), y: cy + r * Math.cos(psi) });
            }

            const rightPts = [];
            for (let i = leftPts.length - 2; i >= 0; i--) {
                rightPts.push({ x: cx - (leftPts[i].x - cx), y: leftPts[i].y });
            }

            const topTipRight = rightPts[rightPts.length - 1];
            const psiTip = Math.atan2(topTipRight.x - cx, topTipRight.y - cy);
            topTipRight.bulge = Math.tan(psiTip / 2);

            return { poly: [...leftPts, ...rightPts], psiTip };
        };

        // Slot Generator: Closed Polyline Loop With R = 0 (Sharp Root Day Vuong Sac)
        const buildClosedSlotR0 = (slice, cx, cy) => {
            const half_pitch = slice.half_pitch;
            const cosD = slice.cosD;
            const rv = slice.rv;
            const rvb = slice.rvb;
            const rvf = slice.rvf;
            const rva = slice.rva;
            const inv_alfa_t = Math.tan(slice.alfa_t) - slice.alfa_t;
            const psi_v = slice.psi_v || (1.57 / slice.z);
            const psi_b = psi_v + inv_alfa_t;
            const psi_half_pitch = half_pitch * cosD;

            function evalInv(r_c) {
                const alpha_c = Math.acos(Math.min(1.0, rvb / r_c));
                const inv_c = Math.tan(alpha_c) - alpha_c;
                const psi_c = Math.max(0.0001, psi_b - inv_c);
                return psi_c * cosD;
            }

            const rStart = Math.max(rvb, rvf);
            const nFlank = 20;

            const leftPts = [];
            for (let i = nFlank - 1; i >= 0; i--) {
                const r = rStart + (i / (nFlank - 1)) * (rva - rStart);
                const thetaTooth = evalInv(r);
                const psiSlot = -(psi_half_pitch - thetaTooth);
                leftPts.push({ x: cx + r * Math.sin(psiSlot), y: cy + r * Math.cos(psiSlot) });
            }

            let psiRoot = 0;
            if (rvf < rvb - 1e-4) {
                const psiSlotB = -(psi_half_pitch - psi_b * cosD);
                psiRoot = Math.abs(psiSlotB);
                leftPts.push({ x: cx + rvf * Math.sin(psiSlotB), y: cy + rvf * Math.cos(psiSlotB) });
            } else {
                const thetaStart = evalInv(rvf);
                const psiSlotF = -(psi_half_pitch - thetaStart);
                psiRoot = Math.abs(psiSlotF);
            }

            leftPts[leftPts.length - 1].bulge = -Math.tan(psiRoot / 2);

            const rightPts = [];
            for (let i = leftPts.length - 1; i >= 0; i--) {
                rightPts.push({ x: cx - (leftPts[i].x - cx), y: leftPts[i].y });
            }

            const topTipRight = rightPts[rightPts.length - 1];
            const psiTip = Math.atan2(topTipRight.x - cx, topTipRight.y - cy);
            topTipRight.bulge = Math.tan(psiTip / 2);

            return { poly: [...leftPts, ...rightPts], psiTip, psiRoot };
        };

        // Multi-Tooth Sector Generator (5-7 Teeth) with TRUE CIRCULAR ARCS on Tip Lands
        const buildToothSector = (slice, isPinion, cx, cy, kMin = -3, kMax = 3) => {
            const rv = slice.rv;
            const rvf = slice.rvf;
            const rva = slice.rva;
            const cosD = slice.cosD;
            const z = slice.z;
            const pPsi = (2.0 * Math.PI / z) * cosD;
            const rimDepth = Math.max(10.0, (rva - rvf) * 1.15);
            const rInnerRim = Math.max(2.0, rvf - rimDepth);

            const toPt = (r, psi) => ({
                x: cx + r * Math.sin(psi),
                y: isPinion ? (cy + r * Math.cos(psi)) : (cy - r * Math.cos(psi))
            });

            let leftTipCornerIdx = -1;
            let rightTipCornerIdx = -1;
            for (let i = 0; i < slice.toothContour.length; i++) {
                if (slice.toothContour[i].zone === 'tip_corner') {
                    if (leftTipCornerIdx < 0) leftTipCornerIdx = i;
                    else rightTipCornerIdx = i;
                }
            }

            const contourPts = [];
            const tipArcs = [];

            for (let k = kMin; k <= kMax; k++) {
                const centerPsi = isPinion ? k * pPsi : (k + 0.5) * pPsi;
                for (let idx = 0; idx < slice.toothContour.length; idx++) {
                    if (k > kMin && idx === 0) continue;
                    if (slice.toothContour[idx].zone === 'tip_land') continue;

                    const tc = slice.toothContour[idx];
                    const r = rv + tc.h;
                    const psi = centerPsi + tc.theta * cosD;
                    const pt = toPt(r, psi);

                    if (idx === leftTipCornerIdx && rightTipCornerIdx > 0) {
                        const dPsiTip = Math.abs(slice.toothContour[rightTipCornerIdx].theta - slice.toothContour[leftTipCornerIdx].theta) * cosD;
                        pt.bulge = isPinion ? -Math.tan(dPsiTip / 4) : Math.tan(dPsiTip / 4);

                        const halfDeg = (dPsiTip * 180.0 / Math.PI) / 2.0;
                        const centerDeg = isPinion ? (90.0 - (centerPsi * 180.0 / Math.PI)) : (270.0 - (centerPsi * 180.0 / Math.PI));
                        tipArcs.push({
                            cx, cy,
                            r: rva,
                            sDeg: centerDeg - halfDeg,
                            eDeg: centerDeg + halfDeg
                        });
                    }

                    contourPts.push(pt);
                }
            }

            const maxPsi = (isPinion ? kMax : (kMax + 0.5)) * pPsi + slice.half_pitch * cosD;
            const minPsi = (isPinion ? kMin : (kMin + 0.5)) * pPsi - slice.half_pitch * cosD;
            const fullPoly = [...contourPts];
            const rimSteps = 24;
            for (let s = 0; s <= rimSteps; s++) {
                const psi = maxPsi - (s / rimSteps) * (maxPsi - minPsi);
                fullPoly.push(toPt(rInnerRim, psi));
            }
            return { fullPoly, minPsi, maxPsi, tipArcs, toPt };
        };

        // Spacing
        const cx_mesh_out = 0;
        const cy_mesh_out = 0;
        const cx_mesh_in = cx_mesh_out + 350;
        const cy_mesh_in = 0;
        const cx_slot1 = cx_mesh_in + 320;
        const cy_slot1 = 0;
        const cx_slot2 = cx_slot1 + 220;
        const cy_slot2 = 0;

        // =========================================================================
        // BLOCK 1: CẶP ĂN KHỚP 2D MẶT NGOÀI (Outer Cone Re, met)
        // =========================================================================
        const sec1_e = buildToothSector(slice1_e, true, cx_mesh_out, cy_mesh_out - rve1, -3, 3);
        const sec2_e = buildToothSector(slice2_e, false, cx_mesh_out, cy_mesh_out + rve2, -3, 3);
        addPolyline(sec1_e.fullPoly, 'MESH_OUTER_PINION', true);
        addPolyline(sec2_e.fullPoly, 'MESH_OUTER_GEAR', true);

        const psiMaxDeg1_e = Math.abs(sec1_e.maxPsi) * 180.0 / Math.PI;
        const psiMaxDeg2_e = Math.abs(sec2_e.maxPsi) * 180.0 / Math.PI;

        // TRUE ARCS: Pinion 1 Outer reference circles
        addArc(cx_mesh_out, cy_mesh_out - rve1, rve1, 90.0 - psiMaxDeg1_e, 90.0 + psiMaxDeg1_e, 'PITCH_CIRCLES');
        addArc(cx_mesh_out, cy_mesh_out - rve1, rvfe1, 90.0 - psiMaxDeg1_e, 90.0 + psiMaxDeg1_e, 'ROOT_CIRCLES');
        addArc(cx_mesh_out, cy_mesh_out - rve1, rvae1, 90.0 - psiMaxDeg1_e, 90.0 + psiMaxDeg1_e, 'TIP_CIRCLES');

        // TRUE ARCS: Gear 2 Outer reference circles
        addArc(cx_mesh_out, cy_mesh_out + rve2, rve2, 270.0 - psiMaxDeg2_e, 270.0 + psiMaxDeg2_e, 'PITCH_CIRCLES');
        addArc(cx_mesh_out, cy_mesh_out + rve2, rvfe2, 270.0 - psiMaxDeg2_e, 270.0 + psiMaxDeg2_e, 'ROOT_CIRCLES');
        addArc(cx_mesh_out, cy_mesh_out + rve2, rvae2, 270.0 - psiMaxDeg2_e, 270.0 + psiMaxDeg2_e, 'TIP_CIRCLES');

        for (const a of sec1_e.tipArcs) addArc(a.cx, a.cy, a.r, a.sDeg, a.eDeg, 'MESH_TIP_ARCS');
        for (const a of sec2_e.tipArcs) addArc(a.cx, a.cy, a.r, a.sDeg, a.eDeg, 'MESH_TIP_ARCS');

        const loaLenE = met * 3.5;
        const alfa_t = slice1_e.alfa_t;
        addLine(
            cx_mesh_out - loaLenE * Math.cos(alfa_t), cy_mesh_out - loaLenE * Math.sin(alfa_t),
            cx_mesh_out + loaLenE * Math.cos(alfa_t), cy_mesh_out + loaLenE * Math.sin(alfa_t),
            'LINE_OF_ACTION'
        );
        addLine(cx_mesh_out, cy_mesh_out - rve1 - 25, cx_mesh_out, cy_mesh_out + rve2 + 25, 'CENTER_AXES');

        addText('CUM 1: CAP AN KHOP 2D MAT NGOAI (Outer Cone Re, met)', cx_mesh_out - 120, rvae2 + 45, 4.0, 'MFG_TABLE');
        addText(`Re = ${Re.toFixed(2)} mm | met = ${met.toFixed(3)} mm | z1=${z1} / z2=${z2}`, cx_mesh_out - 120, rvae2 + 35, 3.2, 'MFG_TABLE');
        addText(`R chan dao cat: Rf1 = ${(0.38 * met).toFixed(2)} mm (0.38*met)`, cx_mesh_out - 120, rvae2 + 25, 3.2, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 2: CẶP ĂN KHỚP 2D MẶT TRONG (Inner Cone Ri, mit)
        // =========================================================================
        const sec1_i = buildToothSector(slice1_i, true, cx_mesh_in, cy_mesh_in - rvi1, -3, 3);
        const sec2_i = buildToothSector(slice2_i, false, cx_mesh_in, cy_mesh_in + rvi2, -3, 3);
        addPolyline(sec1_i.fullPoly, 'MESH_INNER_PINION', true);
        addPolyline(sec2_i.fullPoly, 'MESH_INNER_GEAR', true);

        const psiMaxDeg1_i = Math.abs(sec1_i.maxPsi) * 180.0 / Math.PI;
        const psiMaxDeg2_i = Math.abs(sec2_i.maxPsi) * 180.0 / Math.PI;

        // TRUE ARCS: Pinion 1 Inner reference circles
        addArc(cx_mesh_in, cy_mesh_in - rvi1, rvi1, 90.0 - psiMaxDeg1_i, 90.0 + psiMaxDeg1_i, 'PITCH_CIRCLES');
        addArc(cx_mesh_in, cy_mesh_in - rvi1, rvfi1, 90.0 - psiMaxDeg1_i, 90.0 + psiMaxDeg1_i, 'ROOT_CIRCLES');
        addArc(cx_mesh_in, cy_mesh_in - rvi1, rvai1, 90.0 - psiMaxDeg1_i, 90.0 + psiMaxDeg1_i, 'TIP_CIRCLES');

        // TRUE ARCS: Gear 2 Inner reference circles
        addArc(cx_mesh_in, cy_mesh_in + rvi2, rvi2, 270.0 - psiMaxDeg2_i, 270.0 + psiMaxDeg2_i, 'PITCH_CIRCLES');
        addArc(cx_mesh_in, cy_mesh_in + rvi2, rvfi2, 270.0 - psiMaxDeg2_i, 270.0 + psiMaxDeg2_i, 'ROOT_CIRCLES');
        addArc(cx_mesh_in, cy_mesh_in + rvi2, rvai2, 270.0 - psiMaxDeg2_i, 270.0 + psiMaxDeg2_i, 'TIP_CIRCLES');

        for (const a of sec1_i.tipArcs) addArc(a.cx, a.cy, a.r, a.sDeg, a.eDeg, 'MESH_TIP_ARCS');
        for (const a of sec2_i.tipArcs) addArc(a.cx, a.cy, a.r, a.sDeg, a.eDeg, 'MESH_TIP_ARCS');

        const loaLenI = mit * 3.5;
        addLine(
            cx_mesh_in - loaLenI * Math.cos(alfa_t), cy_mesh_in - loaLenI * Math.sin(alfa_t),
            cx_mesh_in + loaLenI * Math.cos(alfa_t), cy_mesh_in + loaLenI * Math.sin(alfa_t),
            'LINE_OF_ACTION'
        );
        addLine(cx_mesh_in, cy_mesh_in - rvi1 - 25, cx_mesh_in, cy_mesh_in + rvi2 + 25, 'CENTER_AXES');

        addText('CUM 2: CAP AN KHOP 2D MAT TRONG (Inner Cone Ri, mit)', cx_mesh_in - 120, rvai2 + 45, 4.0, 'MFG_TABLE');
        addText(`Ri = ${Ri.toFixed(2)} mm | mit = ${mit.toFixed(3)} mm | z1=${z1} / z2=${z2}`, cx_mesh_in - 120, rvai2 + 35, 3.2, 'MFG_TABLE');
        addText(`R chan dao cat: Rf1 = ${(0.38 * mit).toFixed(2)} mm (0.38*mit)`, cx_mesh_in - 120, rvai2 + 25, 3.2, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 3: CẶP RÃNH RĂNG ĐỒNG TÂM BÁNH DẪN 1 (Pinion 1 Slots: R & R=0)
        // =========================================================================
        const slot1_e_R = buildClosedSlotWithFillet(slice1_e, cx_slot1, cy_slot1);
        const slot1_i_R = buildClosedSlotWithFillet(slice1_i, cx_slot1, cy_slot1);
        addPolyline(slot1_e_R.poly, 'SLOT_PINION_OUTER_R', true);
        addPolyline(slot1_i_R.poly, 'SLOT_PINION_INNER_R', true);

        const slot1_e_R0 = buildClosedSlotR0(slice1_e, cx_slot1, cy_slot1);
        const slot1_i_R0 = buildClosedSlotR0(slice1_i, cx_slot1, cy_slot1);
        addPolyline(slot1_e_R0.poly, 'SLOT_PINION_OUTER_R0', true);
        addPolyline(slot1_i_R0.poly, 'SLOT_PINION_INNER_R0', true);

        // TRUE ARCS for Slot Tip & Root
        const tipDeg1_e = slot1_e_R.psiTip * 180.0 / Math.PI;
        const tipDeg1_i = slot1_i_R.psiTip * 180.0 / Math.PI;
        addArc(cx_slot1, cy_slot1, rvae1, 90.0 - tipDeg1_e, 90.0 + tipDeg1_e, 'SLOT_TIP_ARCS');
        addArc(cx_slot1, cy_slot1, rvai1, 90.0 - tipDeg1_i, 90.0 + tipDeg1_i, 'SLOT_TIP_ARCS');

        const rootDeg1_e = slot1_e_R0.psiRoot * 180.0 / Math.PI;
        const rootDeg1_i = slot1_i_R0.psiRoot * 180.0 / Math.PI;
        addArc(cx_slot1, cy_slot1, rvfe1, 90.0 - rootDeg1_e, 90.0 + rootDeg1_e, 'SLOT_ROOT_ARCS');
        addArc(cx_slot1, cy_slot1, rvfi1, 90.0 - rootDeg1_i, 90.0 + rootDeg1_i, 'SLOT_ROOT_ARCS');

        // Concentric Reference Arcs (TRUE ARCS)
        const spanArcDeg1 = 14.0;
        addArc(cx_slot1, cy_slot1, rve1, 90.0 - spanArcDeg1, 90.0 + spanArcDeg1, 'PITCH_CIRCLES');
        addArc(cx_slot1, cy_slot1, rvi1, 90.0 - spanArcDeg1, 90.0 + spanArcDeg1, 'PITCH_CIRCLES');
        addArc(cx_slot1, cy_slot1, rvfe1, 90.0 - spanArcDeg1, 90.0 + spanArcDeg1, 'ROOT_CIRCLES');
        addArc(cx_slot1, cy_slot1, rvfi1, 90.0 - spanArcDeg1, 90.0 + spanArcDeg1, 'ROOT_CIRCLES');
        addLine(cx_slot1, cy_slot1 + rvfi1 - 30, cx_slot1, cy_slot1 + rvae1 + 30, 'CENTER_AXES');

        addText('CUM 3: CAP RANH RANG DONG TAM BANH DAN 1 (Pinion 1 Slots: R & R=0)', cx_slot1 - 95, rvae1 + 45, 4.0, 'MFG_TABLE');
        addText(`Goc non chia delta1 = ${(delta1 * 180 / Math.PI).toFixed(4)} deg`, cx_slot1 - 95, rvae1 + 35, 3.2, 'MFG_TABLE');
        addText(`Co 2 Layer: Layer *_R (bo cung R=0.38*m) & Layer *_R0 (day vuong R=0)`, cx_slot1 - 95, rvae1 + 25, 3.0, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 4: CẶP RÃNH RĂNG ĐỒNG TÂM BÁNH BỊ DẪN 2 (Gear 2 Slots: R & R=0)
        // =========================================================================
        const slot2_e_R = buildClosedSlotWithFillet(slice2_e, cx_slot2, cy_slot2);
        const slot2_i_R = buildClosedSlotWithFillet(slice2_i, cx_slot2, cy_slot2);
        addPolyline(slot2_e_R.poly, 'SLOT_GEAR_OUTER_R', true);
        addPolyline(slot2_i_R.poly, 'SLOT_GEAR_INNER_R', true);

        const slot2_e_R0 = buildClosedSlotR0(slice2_e, cx_slot2, cy_slot2);
        const slot2_i_R0 = buildClosedSlotR0(slice2_i, cx_slot2, cy_slot2);
        addPolyline(slot2_e_R0.poly, 'SLOT_GEAR_OUTER_R0', true);
        addPolyline(slot2_i_R0.poly, 'SLOT_GEAR_INNER_R0', true);

        // TRUE ARCS for Slot Tip & Root
        const tipDeg2_e = slot2_e_R.psiTip * 180.0 / Math.PI;
        const tipDeg2_i = slot2_i_R.psiTip * 180.0 / Math.PI;
        addArc(cx_slot2, cy_slot2, rvae2, 90.0 - tipDeg2_e, 90.0 + tipDeg2_e, 'SLOT_TIP_ARCS');
        addArc(cx_slot2, cy_slot2, rvai2, 90.0 - tipDeg2_i, 90.0 + tipDeg2_i, 'SLOT_TIP_ARCS');

        const rootDeg2_e = slot2_e_R0.psiRoot * 180.0 / Math.PI;
        const rootDeg2_i = slot2_i_R0.psiRoot * 180.0 / Math.PI;
        addArc(cx_slot2, cy_slot2, rvfe2, 90.0 - rootDeg2_e, 90.0 + rootDeg2_e, 'SLOT_ROOT_ARCS');
        addArc(cx_slot2, cy_slot2, rvfi2, 90.0 - rootDeg2_i, 90.0 + rootDeg2_i, 'SLOT_ROOT_ARCS');

        // Concentric Reference Arcs (TRUE ARCS)
        const spanArcDeg2 = 10.0;
        addArc(cx_slot2, cy_slot2, rve2, 90.0 - spanArcDeg2, 90.0 + spanArcDeg2, 'PITCH_CIRCLES');
        addArc(cx_slot2, cy_slot2, rvi2, 90.0 - spanArcDeg2, 90.0 + spanArcDeg2, 'PITCH_CIRCLES');
        addArc(cx_slot2, cy_slot2, rvfe2, 90.0 - spanArcDeg2, 90.0 + spanArcDeg2, 'ROOT_CIRCLES');
        addArc(cx_slot2, cy_slot2, rvfi2, 90.0 - spanArcDeg2, 90.0 + spanArcDeg2, 'ROOT_CIRCLES');
        addLine(cx_slot2, cy_slot2 + rvfi2 - 30, cx_slot2, cy_slot2 + rvae2 + 30, 'CENTER_AXES');

        addText('CUM 4: CAP RANH RANG DONG TAM BANH BI DAN 2 (Gear 2 Slots: R & R=0)', cx_slot2 - 95, rvae2 + 45, 4.0, 'MFG_TABLE');
        addText(`Goc non chia delta2 = ${(delta2 * 180 / Math.PI).toFixed(4)} deg`, cx_slot2 - 95, rvae2 + 35, 3.2, 'MFG_TABLE');
        addText(`Co 2 Layer: Layer *_R (bo cung R=0.38*m) & Layer *_R0 (day vuong R=0)`, cx_slot2 - 95, rvae2 + 25, 3.0, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 5: BẢNG THÔNG SỐ CHẾ TẠO & HƯỚNG DẪN DỰNG HÌNH SOLIDWORKS / MASTERCAM
        // =========================================================================
        const cosD1 = Math.cos(delta1);
        const cosD2 = Math.cos(delta2);
        const deltaZ_cut1 = b / cosD1;
        const deltaZ_cut2 = b / cosD2;
        const Ze1_star = -Re / cosD1;
        const Zi1_star = -Ri / cosD1;
        const Ze2_star = -Re / cosD2;
        const Zi2_star = -Ri / cosD2;
        const deltaZ_pitch1 = b * cosD1;
        const deltaZ_pitch2 = b * cosD2;

        const tblX = -120;
        let tblY = -rve1 - 60;
        const rowH = 7.5;

        addText('BANG THONG SO DUNG HINH & GIA CONG CAM BO TRUYEN BANH RANG CON (ISO 23509)', tblX, tblY, 4.5, 'MFG_TABLE');
        tblY -= rowH * 1.3;
        addText(`- So rang (Pinion z1 / Gear z2): ${z1} / ${z2} | Ti so truyen i: ${(z2 / z1).toFixed(4)}`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc truc truyen (Shaft angle Sigma): ${(parseFloat(g.Sigma_deg) || 90).toFixed(2)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Goc non chia (delta 1 / delta 2): ${(delta1 * 180 / Math.PI).toFixed(4)} deg / ${(delta2 * 180 / Math.PI).toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Chieu dai non ngoai Re = ${Re.toFixed(3)} mm | Ri = ${Ri.toFixed(3)} mm | Be rong vanh rang b = ${b.toFixed(2)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Mo-dun 3 mat cat: Ngoai met = ${met.toFixed(3)} mm | TB mmn = ${mmn.toFixed(3)} mm | Trong mit = ${mit.toFixed(3)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- Ban kinh luon dao cat: Ngoai Rf_e = ${(0.38 * met).toFixed(3)} mm | Trong Rf_i = ${(0.38 * mit).toFixed(3)} mm (0.38*m)`, tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH;
        addText(`- So rang ao Tredgold: Banh 1 zv1_e = ${(z1 / Math.cos(delta1)).toFixed(2)} | Banh 2 zv2_e = ${(z2 / Math.cos(delta2)).toFixed(2)}`, tblX, tblY, 3.5, 'MFG_TABLE');

        tblY -= rowH * 1.4;
        addText('=========================================================================================', tblX, tblY, 3.5, 'MFG_TABLE');
        tblY -= rowH * 1.0;
        addText('THONG SO KHONG GIAN 3D (KHI DAT BANH RANG TREN MAT PHANG XY, TAM X=0 Y=0, CHOP NON HUONG +Z):', tblX, tblY, 4.0, 'MFG_TABLE');
        tblY -= rowH * 1.2;

        addText(`[ BANH DAN 1 - PINION ]:`, tblX, tblY, 3.6, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  1. Goc hop giua mat phang chua bien dang rang (ngoai & trong) voi mat phang XY: delta1 = ${(delta1 * 180 / Math.PI).toFixed(4)} deg`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  2. Khoang cach giua 2 diem cat cua 2 mat phang tren truc Z: delta_Z_cut1 = b / cos(delta1) = ${deltaZ_cut1.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`     - Giao diem mat phang ngoai (Re) cat truc Z (so voi Apex V): Z_e1* = -Re / cos(delta1) = ${Ze1_star.toFixed(3)} mm`, tblX, tblY, 3.0, 'MFG_TABLE');
        tblY -= rowH;
        addText(`     - Giao diem mat phang trong (Ri) cat truc Z (so voi Apex V): Z_i1* = -Ri / cos(delta1) = ${Zi1_star.toFixed(3)} mm`, tblX, tblY, 3.0, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  3. Khoang cach vuong goc giua 2 mat phang: d_normal = b = ${b.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  4. Khoang cach doc truc Z giua 2 vong chia: delta_Z_pitch1 = b * cos(delta1) = ${deltaZ_pitch1.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');

        tblY -= rowH * 1.2;
        addText(`[ BANH BI DAN 2 - GEAR ]:`, tblX, tblY, 3.6, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  1. Goc hop giua mat phang chua bien dang rang (ngoai & trong) voi mat phang XY: delta2 = ${(delta2 * 180 / Math.PI).toFixed(4)} deg`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  2. Khoang cach giua 2 diem cat cua 2 mat phang tren truc Z: delta_Z_cut2 = b / cos(delta2) = ${deltaZ_cut2.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`     - Giao diem mat phang ngoai (Re) cat truc Z (so voi Apex V): Z_e2* = -Re / cos(delta2) = ${Ze2_star.toFixed(3)} mm`, tblX, tblY, 3.0, 'MFG_TABLE');
        tblY -= rowH;
        addText(`     - Giao diem mat phang trong (Ri) cat truc Z (so voi Apex V): Z_i2* = -Ri / cos(delta2) = ${Zi2_star.toFixed(3)} mm`, tblX, tblY, 3.0, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  3. Khoang cach vuong goc giua 2 mat phang: d_normal = b = ${b.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  4. Khoang cach doc truc Z giua 2 vong chia: delta_Z_pitch2 = b * cos(delta2) = ${deltaZ_pitch2.toFixed(3)} mm`, tblX, tblY, 3.3, 'MFG_TABLE');

        tblY -= rowH * 1.2;
        addText(`HUONG DAN SOLIDWORKS / MASTERCAM LOFT CUT:`, tblX, tblY, 3.6, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  - Chon Cum 3 (Pinion 1) hoac Cum 4 (Gear 2). Nhap 2 Sketch ranh rang dong tam vao 2 Plane cach nhau delta_Z_cut tren truc Z.`, tblX, tblY, 3.2, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  - Layer *_R: bien dang ranh co bo cung dao cat R = 0.38*m (dung kiem thu 3D & phay tinh dung dao profile).`, tblX, tblY, 3.2, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  - Layer *_R0: bien dang ranh day vuong R = 0 (khong bo R), chuyen dung Mastercam CAM tu dong offset bu ban kinh dao phay!`, tblX, tblY, 3.2, 'MFG_TABLE');
        tblY -= rowH;
        addText(`  - Thuc hien Lofted Cut giua 2 Sketch theo huong non de tao ranh rang chuan xac 100%!`, tblX, tblY, 3.2, 'MFG_TABLE');

        lines.push('0', 'ENDSEC', '0', 'EOF');
        return lines.join('\r\n');
    },

    /**
     * Triggers direct browser download of the Unified DXF file
     */
    downloadUnifiedTredgoldDXF(geom, resLevel = 6) {
        const dxfContent = this.generateUnifiedTredgoldDXF(geom, resLevel);
        if (!dxfContent) {
            alert('Khong the tao noi dung ban ve DXF Tong Hop.');
            return;
        }

        const z1 = geom.z1 || 18;
        const z2 = geom.z2 || 45;
        const mmn = (geom.mmn || 10).toFixed(1);
        const filename = `Cap_Banh_Rang_Con_An_Khop_va_Ranh_Dong_Tam_CAM_z${z1}x${z2}_m${mmn}_muc${resLevel}.dxf`;

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
