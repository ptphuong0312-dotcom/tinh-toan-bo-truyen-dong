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
            '0', 'TABLE', '2', 'LAYER', '70', '15',
            '0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'MESH_OUTER_PINION', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'MESH_OUTER_GEAR', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'MESH_INNER_PINION', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'MESH_INNER_GEAR', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'SLOT_PINION_OUTER', '70', '0', '62', '4', '6', 'CONTINUOUS', // Cyan
            '0', 'LAYER', '2', 'SLOT_PINION_INNER', '70', '0', '62', '140', '6', 'CONTINUOUS', // Light Blue/Cyan
            '0', 'LAYER', '2', 'SLOT_GEAR_OUTER', '70', '0', '62', '30', '6', 'CONTINUOUS',   // Orange
            '0', 'LAYER', '2', 'SLOT_GEAR_INNER', '70', '0', '62', '40', '6', 'CONTINUOUS',   // Light Orange
            '0', 'LAYER', '2', 'PITCH_CIRCLES', '70', '0', '62', '2', '6', 'CENTER',          // Yellow
            '0', 'LAYER', '2', 'ROOT_CIRCLES', '70', '0', '62', '3', '6', 'DASHED',          // Green
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

        const ptsFlank = res.ptsPerFlank;
        const ptsFillet = Math.max(6, Math.round(ptsFlank * 0.4));

        // Generate Slices for Outer (Re) and Inner (Ri)
        const slice1_e = Bevel3DGenerator.generateSliceToothContour({
            z: z1, mmn, Rm, R_s: Re, delta: delta1, alfa, beta, isSpiral,
            ha_s: hae1, hf_s: hfe1, sn_s: sne1, ptsPerFlank: ptsFlank, ptsFillet
        });
        slice1_e.z = z1;

        const slice2_e = Bevel3DGenerator.generateSliceToothContour({
            z: z2, mmn, Rm, R_s: Re, delta: delta2, alfa, beta, isSpiral,
            ha_s: hae2, hf_s: hfe2, sn_s: sne2, ptsPerFlank: ptsFlank, ptsFillet
        });
        slice2_e.z = z2;

        const slice1_i = Bevel3DGenerator.generateSliceToothContour({
            z: z1, mmn, Rm, R_s: Ri, delta: delta1, alfa, beta, isSpiral,
            ha_s: hai1, hf_s: hfi1, sn_s: sni1, ptsPerFlank: ptsFlank, ptsFillet
        });
        slice1_i.z = z1;

        const slice2_i = Bevel3DGenerator.generateSliceToothContour({
            z: z2, mmn, Rm, R_s: Ri, delta: delta2, alfa, beta, isSpiral,
            ha_s: hai2, hf_s: hfi2, sn_s: sni2, ptsPerFlank: ptsFlank, ptsFillet
        });
        slice2_i.z = z2;

        const rve1 = slice1_e.rv, rvae1 = slice1_e.rva, rvfe1 = slice1_e.rvf;
        const rve2 = slice2_e.rv, rvae2 = slice2_e.rva, rvfe2 = slice2_e.rvf;
        const rvi1 = slice1_i.rv, rvai1 = slice1_i.rva, rvfi1 = slice1_i.rvf;
        const rvi2 = slice2_i.rv, rvai2 = slice2_i.rva, rvfi2 = slice2_i.rvf;

        // Slot Generator: Closed Polyline Loop Centered at cx, cy, Symmetric about Vertical Axis
        const buildClosedSlot = (slice, cx, cy) => {
            const half_pitch = Math.PI / slice.z;
            const cosD = slice.cosD;
            const rv = slice.rv;
            const rva = slice.rva;
            const midIdx = Math.floor(slice.toothContour.length / 2);

            const leftPts = [];
            for (let i = midIdx; i < slice.toothContour.length; i++) {
                const tc = slice.toothContour[i];
                if (i === midIdx && tc.zone === 'tip_land') continue;
                const r = rv + tc.h;
                const psi = (tc.theta - half_pitch) * cosD;
                leftPts.push({
                    x: cx + r * Math.sin(psi),
                    y: cy + r * Math.cos(psi)
                });
            }

            const rightPts = [];
            for (let i = leftPts.length - 2; i >= 0; i--) {
                rightPts.push({
                    x: cx - (leftPts[i].x - cx),
                    y: leftPts[i].y
                });
            }

            const tipPts = [];
            const rightTip = rightPts[rightPts.length - 1];
            const psiTip = Math.atan2(rightTip.x - cx, rightTip.y - cy);
            const nSteps = 10;
            for (let s = 1; s < nSteps; s++) {
                const psi = psiTip - (s / nSteps) * (2.0 * psiTip);
                tipPts.push({
                    x: cx + rva * Math.sin(psi),
                    y: cy + rva * Math.cos(psi)
                });
            }

            return [...leftPts, ...rightPts, ...tipPts];
        };

        // Multi-Tooth Sector Generator (5-7 Teeth)
        const buildToothSector = (slice, isPinion, cx, cy, kMin = -3, kMax = 3, phase = 0) => {
            const rv = slice.rv;
            const rvf = slice.rvf;
            const cosD = slice.cosD;
            const z = slice.z;
            const pPsi = (2.0 * Math.PI / z) * cosD;
            const rimDepth = Math.max(10.0, (slice.rva - slice.rvf) * 1.15);
            const rInnerRim = Math.max(2.0, rvf - rimDepth);

            const toPt = (r, psi) => ({
                x: cx + r * Math.sin(psi),
                y: isPinion ? (cy + r * Math.cos(psi)) : (cy - r * Math.cos(psi))
            });

            const contourPts = [];
            for (let k = kMin; k <= kMax; k++) {
                const centerPsi = isPinion ? (k + phase) * pPsi : (k + 0.5 + phase) * pPsi;
                for (let idx = 0; idx < slice.toothContour.length; idx++) {
                    if (k > kMin && idx === 0) continue;
                    const tc = slice.toothContour[idx];
                    const r = rv + tc.h;
                    const psi = centerPsi + tc.theta * cosD;
                    contourPts.push(toPt(r, psi));
                }
            }

            const maxPsi = (isPinion ? (kMax + phase) : (kMax + 0.5 + phase)) * pPsi + slice.half_pitch * cosD;
            const minPsi = (isPinion ? (kMin + phase) : (kMin + 0.5 + phase)) * pPsi - slice.half_pitch * cosD;
            const fullPoly = [...contourPts];
            const rimSteps = 24;
            for (let s = 0; s <= rimSteps; s++) {
                const psi = maxPsi - (s / rimSteps) * (maxPsi - minPsi);
                fullPoly.push(toPt(rInnerRim, psi));
            }
            return { fullPoly, minPsi, maxPsi, toPt };
        };

        // Compact, Non-Overlapping Balanced Spacing
        const cx_mesh_out = 0;
        const cy_mesh_out = 0;

        const cx_mesh_in = cx_mesh_out + 350;
        const cy_mesh_in = 0;

        const cx_slot1 = cx_mesh_in + 320;
        const cy_slot1 = 0;

        const cx_slot2 = cx_slot1 + 220;
        const cy_slot2 = 0;

        // =========================================================================
        // BLOCK 1: CẶP ĂN KHỚP 2D MẶT NGOÀI (Outer Cone Re, met, 5-7 răng)
        // =========================================================================
        const sec1_e = buildToothSector(slice1_e, true, cx_mesh_out, cy_mesh_out - rve1, -3, 3, 0);
        const sec2_e = buildToothSector(slice2_e, false, cx_mesh_out, cy_mesh_out + rve2, -3, 3, 0);
        addPolyline(sec1_e.fullPoly, 'MESH_OUTER_PINION', true);
        addPolyline(sec2_e.fullPoly, 'MESH_OUTER_GEAR', true);

        const arcPtsOuter = (radius, isPinion) => {
            const arr = [];
            const sec = isPinion ? sec1_e : sec2_e;
            for (let s = 0; s <= 32; s++) {
                const psi = sec.minPsi + (s / 32) * (sec.maxPsi - sec.minPsi);
                arr.push(sec.toPt(radius, psi));
            }
            return arr;
        };
        addPolyline(arcPtsOuter(rve1, true), 'PITCH_CIRCLES', false);
        addPolyline(arcPtsOuter(rvfe1, true), 'ROOT_CIRCLES', false);
        addPolyline(arcPtsOuter(rvae1, true), 'DIMENSIONS', false);
        addPolyline(arcPtsOuter(rve2, false), 'PITCH_CIRCLES', false);
        addPolyline(arcPtsOuter(rvfe2, false), 'ROOT_CIRCLES', false);
        addPolyline(arcPtsOuter(rvae2, false), 'DIMENSIONS', false);

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
        // BLOCK 2: CẶP ĂN KHỚP 2D MẶT TRONG (Inner Cone Ri, mit, 5-7 răng)
        // =========================================================================
        const sec1_i = buildToothSector(slice1_i, true, cx_mesh_in, cy_mesh_in - rvi1, -3, 3, 0);
        const sec2_i = buildToothSector(slice2_i, false, cx_mesh_in, cy_mesh_in + rvi2, -3, 3, 0);
        addPolyline(sec1_i.fullPoly, 'MESH_INNER_PINION', true);
        addPolyline(sec2_i.fullPoly, 'MESH_INNER_GEAR', true);

        const arcPtsInner = (radius, isPinion) => {
            const arr = [];
            const sec = isPinion ? sec1_i : sec2_i;
            for (let s = 0; s <= 32; s++) {
                const psi = sec.minPsi + (s / 32) * (sec.maxPsi - sec.minPsi);
                arr.push(sec.toPt(radius, psi));
            }
            return arr;
        };
        addPolyline(arcPtsInner(rvi1, true), 'PITCH_CIRCLES', false);
        addPolyline(arcPtsInner(rvfi1, true), 'ROOT_CIRCLES', false);
        addPolyline(arcPtsInner(rvai1, true), 'DIMENSIONS', false);
        addPolyline(arcPtsInner(rvi2, false), 'PITCH_CIRCLES', false);
        addPolyline(arcPtsInner(rvfi2, false), 'ROOT_CIRCLES', false);
        addPolyline(arcPtsInner(rvai2, false), 'DIMENSIONS', false);

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
        // BLOCK 3: CẶP RÃNH RĂNG ĐỒNG TÂM BÁNH DẪN 1 (Pinion 1 - Outer & Inner Slots)
        // Both share virtual center (cx_slot1, cy_slot1)
        // =========================================================================
        const slot1_outer = buildClosedSlot(slice1_e, cx_slot1, cy_slot1);
        const slot1_inner = buildClosedSlot(slice1_i, cx_slot1, cy_slot1);
        addPolyline(slot1_outer, 'SLOT_PINION_OUTER', true);
        addPolyline(slot1_inner, 'SLOT_PINION_INNER', true);

        // Center axis for Pinion 1 Slots
        addLine(cx_slot1, cy_slot1 + rvfi1 - 30, cx_slot1, cy_slot1 + rvae1 + 30, 'CENTER_AXES');

        // Concentric Reference Arcs for Pinion 1 Slots
        const addRefSlotArc = (radius, layer) => {
            const arr = [];
            const spanPsi = 0.22;
            for (let s = 0; s <= 24; s++) {
                const psi = -spanPsi + (s / 24) * (2 * spanPsi);
                arr.push({ x: cx_slot1 + radius * Math.sin(psi), y: cy_slot1 + radius * Math.cos(psi) });
            }
            addPolyline(arr, layer, false);
        };
        addRefSlotArc(rve1, 'PITCH_CIRCLES');
        addRefSlotArc(rvfe1, 'ROOT_CIRCLES');
        addRefSlotArc(rvi1, 'PITCH_CIRCLES');
        addRefSlotArc(rvfi1, 'ROOT_CIRCLES');

        addText('CUM 3: CAP RANH RANG DONG TAM BANH DAN 1 (Pinion 1 Slots)', cx_slot1 - 95, rvae1 + 45, 4.0, 'MFG_TABLE');
        addText(`Goc non chia delta1 = ${(delta1 * 180 / Math.PI).toFixed(4)} deg`, cx_slot1 - 95, rvae1 + 35, 3.2, 'MFG_TABLE');
        addText(`LOFT CAM: Profile Ngoai (Re) va Profile Trong (Ri) dong tam tai (0,0)`, cx_slot1 - 95, rvae1 + 25, 3.0, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 4: CẶP RÃNH RĂNG ĐỒNG TÂM BÁNH BỊ DẪN 2 (Gear 2 - Outer & Inner Slots)
        // Both share virtual center (cx_slot2, cy_slot2)
        // =========================================================================
        const slot2_outer = buildClosedSlot(slice2_e, cx_slot2, cy_slot2);
        const slot2_inner = buildClosedSlot(slice2_i, cx_slot2, cy_slot2);
        addPolyline(slot2_outer, 'SLOT_GEAR_OUTER', true);
        addPolyline(slot2_inner, 'SLOT_GEAR_INNER', true);

        // Center axis for Gear 2 Slots
        addLine(cx_slot2, cy_slot2 + rvfi2 - 30, cx_slot2, cy_slot2 + rvae2 + 30, 'CENTER_AXES');

        // Concentric Reference Arcs for Gear 2 Slots
        const addRefSlotArc2 = (radius, layer) => {
            const arr = [];
            const spanPsi = 0.16;
            for (let s = 0; s <= 24; s++) {
                const psi = -spanPsi + (s / 24) * (2 * spanPsi);
                arr.push({ x: cx_slot2 + radius * Math.sin(psi), y: cy_slot2 + radius * Math.cos(psi) });
            }
            addPolyline(arr, layer, false);
        };
        addRefSlotArc2(rve2, 'PITCH_CIRCLES');
        addRefSlotArc2(rvfe2, 'ROOT_CIRCLES');
        addRefSlotArc2(rvi2, 'PITCH_CIRCLES');
        addRefSlotArc2(rvfi2, 'ROOT_CIRCLES');

        addText('CUM 4: CAP RANH RANG DONG TAM BANH BI DAN 2 (Gear 2 Slots)', cx_slot2 - 95, rvae2 + 45, 4.0, 'MFG_TABLE');
        addText(`Goc non chia delta2 = ${(delta2 * 180 / Math.PI).toFixed(4)} deg`, cx_slot2 - 95, rvae2 + 35, 3.2, 'MFG_TABLE');
        addText(`LOFT CAM: Profile Ngoai (Re) va Profile Trong (Ri) dong tam tai (0,0)`, cx_slot2 - 95, rvae2 + 25, 3.0, 'MFG_TABLE');

        // =========================================================================
        // BLOCK 5: BẢNG THÔNG SỐ CHẾ TẠO & HƯỚNG DẪN DỰNG HÌNH SOLIDWORKS / MASTERCAM
        // =========================================================================
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
        tblY -= rowH;
        addText(`- Huong dan CAM / SolidWorks: Nhap Cum 3 (Banh 1) hoac Cum 4 (Banh 2), dung 2 profile ranh dong tam de Loft Cut theo goc non!`, tblX, tblY, 3.5, 'MFG_TABLE');

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
