/**
 * MITCalc Web App - 3D Bevel Gear Solid & Surface Mesh Generator (Module 2)
 * Generates 100% watertight closed manifold 3D Solid Meshes and Open Flank Surface Meshes
 * for both Straight Bevel Gears (beta = 0) and Spiral Bevel Gears (beta != 0)
 * 1-to-1 Authentic Port from MITCalc 1.74 (Calculation!U197:AQ202, Data1!C70:D87, Data1!H35:I52)
 * Standards: ISO 23509, DIN 3971, DIN 3965, AGMA 2005.
 * Features:
 * - Authentic Conical Gear Blank Body from MITCalc Data1 (Hub, Rim, Bore & Conical Faces)
 * - Tredgold Equivalent Virtual Involute Flanks with Pressure Angle alpha
 * - Analytical C1-Tangent Circular Root Fillet (R_chan = 0.38 * m_n) & Preserved Root Land Arc
 * - Linear Cone Convergence toward Apex V(0, 0, 0)
 * - Tapered Tooth Thickness & Addendum/Dedendum along face width b (Re -> Ri)
 * - Authentic Gleason Spiral Circular Arc Tooth Trace (beta > 0, R_tool = 1.5 * b)
 * - Vertex Splitting (Zero-Ripple Planar Hub Faces & Conical Back/Front Faces)
 * - Open Flank Surface Mesh (Mastercam 5-axis Surface Toolpaths & SolidWorks)
 * - 100% Compatible with Three.js, Binary STL, and STEP AP214 (ISO 10303-21)
 */

export const Bevel3DGenerator = {
    /**
     * Generates the exact 2D single-tooth contour (with C1 circular root fillet R = 0.38 * m_s
     * and preserved root land arc) on the Tredgold virtual spur gear at cone distance R_s.
     * Shared 1-to-1 between 3D Mesh Generation, 2D Interactive Canvas, and 2D DXF Export.
     */
    generateSliceToothContour(sliceOpt) {
        const z = parseInt(sliceOpt.z) || 20;
        const mmn = parseFloat(sliceOpt.mmn) || 10.0;
        const Rm = parseFloat(sliceOpt.Rm) || 279.82;
        const R_s = parseFloat(sliceOpt.R_s) || Rm;
        const delta = parseFloat(sliceOpt.delta) || (Math.PI / 4.0);
        const cosD = Math.cos(delta);
        const sinD = Math.sin(delta);
        const alfa = parseFloat(sliceOpt.alfa) || (20.0 * Math.PI / 180.0);
        const beta = parseFloat(sliceOpt.beta) || 0.0;
        const isSpiral = Math.abs(beta) > 1e-4;
        const ha_s = parseFloat(sliceOpt.ha_s) || mmn;
        const hf_s = parseFloat(sliceOpt.hf_s) || (1.2 * mmn);
        const sn_s = parseFloat(sliceOpt.sn_s) || (mmn * Math.PI / 2.0);
        const ptsPerFlank = Math.max(6, parseInt(sliceOpt.ptsPerFlank) || 20);
        const dThetaKiss = parseFloat(sliceOpt.dThetaKiss) || 0.0;

        // Transverse tooth parameters for virtual gear (Tredgold ISO 23509)
        const cos_beta = isSpiral ? Math.max(0.2, Math.cos(beta)) : 1.0;
        const tan_alfa_t = Math.tan(alfa) / cos_beta;
        const alfa_t = Math.atan(tan_alfa_t);
        const inv_alfa_t = tan_alfa_t - alfa_t;
        const sn_t = sn_s / cos_beta;

        // Tredgold virtual spur gear at cone distance R_s
        const rv = (R_s * sinD) / cosD;
        const rvb = rv * Math.cos(alfa_t);
        const rva = rv + ha_s;
        const rvf = Math.max(0.1, rv - hf_s);
        const psi_v = sn_t / (2.0 * rv);
        const psi_b = psi_v + inv_alfa_t;

        const half_pitch = Math.PI / z;
        const psi_half_pitch = half_pitch * cosD;

        // Local normal module at slice R_s and standard root fillet radius R = 0.38 * m_s (Rule 4)
        const m_s = mmn * (R_s / Math.max(1.0, Rm));
        const Rf_nom = Math.min(0.38 * m_s, 0.75 * hf_s);

        // Analytical C1-tangent circular root fillet solver in 2D virtual plane (xv = r*sin(psi), yv = r*cos(psi))
        function solveFillet(r_f) {
            let rt, alfa_f, psi_t, hasStem;
            const sqDiff = (rvf + r_f) * (rvf + r_f) - rvb * rvb;
            if (sqDiff >= r_f * r_f) {
                // Fillet circle is directly C1-tangent to the involute flank at rt >= rvb
                const Lt = Math.sqrt(sqDiff) - r_f;
                rt = Math.sqrt(rvb * rvb + Lt * Lt);
                alfa_f = Math.acos(Math.min(1.0, rvb / rt));
                psi_t = psi_b - (Math.tan(alfa_f) - alfa_f);
                hasStem = false;
            } else {
                // Deep root below base circle: involute reaches rvb, radial stem to rt < rvb
                rt = Math.sqrt(rvf * rvf + 2.0 * rvf * r_f);
                alfa_f = 0.0;
                psi_t = psi_b;
                hasStem = true;
            }
            const Ptx = rt * Math.sin(psi_t);
            const Pty = rt * Math.cos(psi_t);
            const Cfx = Ptx + r_f * Math.cos(psi_t - alfa_f);
            const Cfy = Pty - r_f * Math.sin(psi_t - alfa_f);
            const psi_root = Math.atan2(Cfx, Cfy);
            const Prx = rvf * Math.sin(psi_root);
            const Pry = rvf * Math.cos(psi_root);
            const gamma0 = Math.atan2(Pty - Cfy, Ptx - Cfx); // at flank tangency point Pt
            const gamma1 = Math.atan2(Pry - Cfy, Prx - Cfx); // at root circle tangency point Pr
            let dGamma = gamma1 - gamma0;
            while (dGamma > Math.PI) dGamma -= 2.0 * Math.PI;
            while (dGamma < -Math.PI) dGamma += 2.0 * Math.PI;
            return {
                Rf: r_f, rt, alfa_f, psi_t, hasStem,
                Ptx, Pty, Cfx, Cfy, psi_root, Prx, Pry, gamma0, dGamma
            };
        }

        let fSol = solveFillet(Rf_nom);
        const maxPsiRoot = psi_half_pitch * 0.98;
        if (fSol.psi_root > maxPsiRoot && fSol.psi_root > fSol.psi_t) {
            const scaleRf = Math.max(0.15, (maxPsiRoot - fSol.psi_t) / (fSol.psi_root - fSol.psi_t));
            fSol = solveFillet(Rf_nom * scaleRf);
        }

        const theta_root = Math.min(half_pitch * 0.99, fSol.psi_root / cosD);
        const ptsFillet = sliceOpt.ptsFillet || Math.max(5, Math.min(8, Math.round(ptsPerFlank * 0.25)));
        const r_inv_start = Math.max(fSol.rt, rvb);
        const hSpan = Math.max(0.1, rva - rvf);

        // Evaluate right-side involute flank from r_inv_start to rva
        function evalInvolute(t) {
            const r_c = r_inv_start + t * (rva - r_inv_start);
            const alpha_c = Math.acos(Math.min(1.0, rvb / r_c));
            const inv_c = Math.tan(alpha_c) - alpha_c;
            const psi_c = Math.max(0.0001, psi_b - inv_c);
            const h = r_c - rv;
            const theta = psi_c / cosD;
            const flankT = (r_c - rvf) / hSpan;
            return { h, theta, r_c, psi_c, flankT };
        }

        const tipPt = evalInvolute(1.0);
        const toothContour = [];

        // 1. Left Root Land Start (-half_pitch)
        toothContour.push({ h: -hf_s, theta: -half_pitch, flankT: 0.0, isEngageFlank: false, flankId: 0.0, zone: 'root_land' });

        // 2. Left Circular Root Fillet Arc (Cung lượn chân răng R chân trái: tau = 1 -> 1/ptsFillet)
        for (let m = ptsFillet; m >= 1; m--) {
            const tau = m / ptsFillet;
            const gamma = fSol.gamma0 + tau * fSol.dGamma;
            const xv = fSol.Cfx + fSol.Rf * Math.cos(gamma);
            const yv = fSol.Cfy + fSol.Rf * Math.sin(gamma);
            const rc = Math.hypot(xv, yv);
            const psic = Math.atan2(xv, yv);
            const h = rc - rv;
            const theta = (psic / cosD) + dThetaKiss * (1.0 - tau);
            const flankT = Math.max(0.0, (rc - rvf) / hSpan);
            toothContour.push({ h, theta: -theta, flankT, isEngageFlank: false, flankId: 0.0, zone: 'fillet' });
        }

        // Optional radial stem if root circle is far below base circle (fSol.hasStem)
        if (fSol.hasStem && fSol.rt < rvb - 1e-4) {
            for (let m = 0; m < 2; m++) {
                const frac = m / 2.0;
                const rc = fSol.rt + frac * (rvb - fSol.rt);
                const h = rc - rv;
                const theta = (psi_b / cosD) + dThetaKiss;
                const flankT = Math.max(0.0, (rc - rvf) / hSpan);
                toothContour.push({ h, theta: -theta, flankT, isEngageFlank: false, flankId: 1.0, zone: 'stem' });
            }
        }

        // 3. Left Involute Flank (Flank 1: t = 0 -> 1)
        for (let k = 0; k < ptsPerFlank; k++) {
            const t = k / (ptsPerFlank - 1);
            const pt = evalInvolute(t);
            toothContour.push({
                h: pt.h,
                theta: -(pt.theta + dThetaKiss),
                flankT: pt.flankT,
                isEngageFlank: true,
                flankId: 1.0,
                zone: k === ptsPerFlank - 1 ? 'tip_corner' : 'flank'
            });
        }

        // 4. Tooth Tip Land Arc (Cung đỉnh răng tròn đều trên mặt nón đỉnh: -tipTheta -> +tipTheta)
        const tipTheta = tipPt.theta + dThetaKiss;
        const ptsTip = 5;
        for (let m = 1; m <= ptsTip; m++) {
            const frac = m / (ptsTip + 1);
            const th = -tipTheta + frac * (2.0 * tipTheta);
            toothContour.push({ h: tipPt.h, theta: th, flankT: 1.0, isEngageFlank: false, flankId: 0.0, zone: 'tip_land' });
        }

        // 5. Right Involute Flank (Flank 2: t = 1 -> 0)
        for (let k = ptsPerFlank - 1; k >= 0; k--) {
            const t = k / (ptsPerFlank - 1);
            const pt = evalInvolute(t);
            toothContour.push({
                h: pt.h,
                theta: +(pt.theta + dThetaKiss),
                flankT: pt.flankT,
                isEngageFlank: true,
                flankId: 2.0,
                zone: k === ptsPerFlank - 1 ? 'tip_corner' : 'flank'
            });
        }

        // Optional radial stem on right side
        if (fSol.hasStem && fSol.rt < rvb - 1e-4) {
            for (let m = 1; m >= 0; m--) {
                const frac = m / 2.0;
                const rc = fSol.rt + frac * (rvb - fSol.rt);
                const h = rc - rv;
                const theta = (psi_b / cosD) + dThetaKiss;
                const flankT = Math.max(0.0, (rc - rvf) / hSpan);
                toothContour.push({ h, theta: +theta, flankT, isEngageFlank: false, flankId: 2.0, zone: 'stem' });
            }
        }

        // 6. Right Circular Root Fillet Arc (Cung lượn chân răng R chân phải: tau = 1/ptsFillet -> 1)
        for (let m = 1; m <= ptsFillet; m++) {
            const tau = m / ptsFillet;
            const gamma = fSol.gamma0 + tau * fSol.dGamma;
            const xv = fSol.Cfx + fSol.Rf * Math.cos(gamma);
            const yv = fSol.Cfy + fSol.Rf * Math.sin(gamma);
            const rc = Math.hypot(xv, yv);
            const psic = Math.atan2(xv, yv);
            const h = rc - rv;
            const theta = (psic / cosD) + dThetaKiss * (1.0 - tau);
            const flankT = Math.max(0.0, (rc - rvf) / hSpan);
            toothContour.push({ h, theta: +theta, flankT, isEngageFlank: false, flankId: 0.0, zone: 'fillet' });
        }

        // 7. Right Root Land End (+half_pitch)
        toothContour.push({ h: -hf_s, theta: +half_pitch, flankT: 0.0, isEngageFlank: false, flankId: 0.0, zone: 'root_land' });

        return {
            toothContour,
            rv, rvb, rva, rvf, alfa_t, psi_v, psi_b, half_pitch, cosD, sinD,
            fillet: fSol
        };
    },

    /**
     * Generates 2D Tredgold Virtual Gear Polygon Points (in 2D XY plane around virtual center)
     * with exact C1 circular root fillet R_chan = 0.38 * mmn, used by 2D Canvas & DXF Exporter.
     */
    generate2DVirtualGearProfile(opt) {
        const sliceRes = this.generateSliceToothContour(opt);
        const { toothContour, rv, rvb, rva, rvf, alfa_t, cosD, fillet } = sliceRes;
        const z = parseInt(opt.z) || 20;
        const z_virtual = z / cosD;
        const numTeethToDraw = opt.numTeeth || Math.max(5, Math.min(z, Math.round(z_virtual)));
        const pitchAngleVirtual = (2.0 * Math.PI) / z_virtual;

        // Build multi-tooth 2D points around the virtual gear center (0, 0)
        // Tooth 0 is centered at angle 0 (pointing along +X or +Y as needed)
        const halfCount = Math.floor(numTeethToDraw / 2);
        const points = [];
        for (let tIdx = -halfCount; tIdx <= halfCount; tIdx++) {
            const basePsi = tIdx * pitchAngleVirtual;
            for (let p = 0; p < toothContour.length; p++) {
                // Skip duplicate boundary point between consecutive teeth
                if (tIdx > -halfCount && p === 0) continue;
                const pt = toothContour[p];
                const rc = rv + pt.h;
                const psi = basePsi + pt.theta * cosD;
                points.push({
                    x: rc * Math.cos(psi),
                    y: rc * Math.sin(psi),
                    r: rc,
                    psi,
                    zone: pt.zone
                });
            }
        }

        return {
            points,
            toothContour,
            rv, rvb, rva, rvf, alfa_t, cosD, z_virtual, pitchAngleVirtual,
            fillet
        };
    },

    /**
     * Generates a complete 3D solid mesh or open surface mesh for a bevel gear
     * @param {Object} opt - Gear geometry parameters
     * @returns {Object} Mesh data: { vertices, normals, indices, rawTriangles, bbox, isSurfaceOnly }
     */
    generateGearMesh(opt) {
        const z = parseInt(opt.z) || 20;
        const mmn = parseFloat(opt.mmn) || 10.0;
        const delta = parseFloat(opt.delta) || (Math.PI / 4.0);
        const cosD = Math.cos(delta);
        const sinD = Math.sin(delta);

        const Re = Math.max(10.0, parseFloat(opt.Re) || 100.0);
        const b = Math.max(2.0, parseFloat(opt.b) || 30.0);
        const Ri = Math.max(2.0, opt.Ri !== undefined ? parseFloat(opt.Ri) : (Re - b));
        const Rm = opt.Rm !== undefined ? parseFloat(opt.Rm) : (Re - b / 2.0);

        const alfa = parseFloat(opt.alfa) || (20.0 * Math.PI / 180.0);
        const beta = (opt.beta !== undefined && opt.beta !== null) ? parseFloat(opt.beta) : 0.0;
        const x = parseFloat(opt.x) || 0.0;
        const xt = parseFloat(opt.xt) || 0.0;
        const hand = opt.hand !== undefined ? parseInt(opt.hand) : 1;
        const gearingType = opt.gearingType || 'gleason';

        const isSpiral = Math.abs(beta) > 1e-4;
        const isSurfaceOnly = !!opt.surfaceOnly;

        // Addendum and dedendum at outer cone Re (Heel)
        let ha_e = opt.ha_e !== undefined ? parseFloat(opt.ha_e) : (opt.ha !== undefined ? parseFloat(opt.ha) * (Re / Rm) : mmn * (1.0 + x) * (Re / Rm));
        let hf_e = opt.hf_e !== undefined ? parseFloat(opt.hf_e) : (opt.hf !== undefined ? parseFloat(opt.hf) * (Re / Rm) : mmn * (1.2 - x) * (Re / Rm));

        // Tooth thickness at outer cone Re (Heel)
        const sn_e = opt.sn_e !== undefined ? parseFloat(opt.sn_e) : (opt.sn !== undefined ? parseFloat(opt.sn) * (Re / Rm) : mmn * (Math.PI / 2.0 + 2.0 * x * Math.tan(alfa) + xt) * (Re / Rm));
        const sa_e = opt.sa_e !== undefined ? parseFloat(opt.sa_e) : (opt.sa !== undefined ? parseFloat(opt.sa) * (Re / Rm) : sn_e * 0.45);

        // MITCalc Section 16 blank offset parameters (Data1!C75, C84, H40, H49)
        const Hin = parseFloat(opt.Hin) || (mmn * (z < 30 ? 0.48 : 0.59));
        const Hout = parseFloat(opt.Hout) || (mmn * (z < 30 ? 1.33 : 1.995));

        const scale_i = Ri / Re;
        const ha_i = ha_e * scale_i;
        const hf_i = hf_e * scale_i;

        // Shaft bore diameter (standard ISO 23509 shaft bore)
        const r_root_toe = Ri * sinD - hf_i * cosD;
        const defaultBore = Math.max(10.0, r_root_toe * 0.9);
        const dBore = Math.min(r_root_toe * 0.85 * 2.0, Math.max(6.0, parseFloat(opt.dBore) || defaultBore));
        const rBore = dBore / 2.0;

        // Authentic MITCalc Data1 Blank Coordinates (Z along axis from apex, R radial):
        const z_toe_hub = Ri * cosD + (hf_i + Hin) * sinD;
        const r_toe_rim = Math.max(rBore + 2.0, Ri * sinD - (hf_i + Hin) * cosD);
        const z_toe_root = Ri * cosD + hf_i * sinD;
        const r_toe_root = Ri * sinD - hf_i * cosD;

        const z_heel_root = Re * cosD + hf_e * sinD;
        const r_heel_root = Re * sinD - hf_e * cosD;
        const z_heel_hub = Re * cosD + (hf_e + Hout) * sinD;
        const r_heel_rim = Math.max(rBore + 5.0, Re * sinD - (hf_e + Hout) * cosD);

        // 8 Cấp Độ Mịn Lưới Thân Khai (Tối ưu hóa độ mịn cao & hiệu năng 60 FPS mượt mà)
        const densityPresets = {
            1: { pts: 10, slicesSpiral: 14, slicesStraight: 12 }, // Cấp 1: Tiêu Chuẩn Nhanh
            2: { pts: 12, slicesSpiral: 18, slicesStraight: 16 }, // Cấp 2: Mịn Mức 2
            3: { pts: 16, slicesSpiral: 22, slicesStraight: 20 }, // Cấp 3: Mịn Mức 3
            4: { pts: 20, slicesSpiral: 26, slicesStraight: 24 }, // Cấp 4: Mịn Mức 4 (Cân Bằng)
            5: { pts: 24, slicesSpiral: 30, slicesStraight: 28 }, // Cấp 5: Rất Mịn Mức 5
            6: { pts: 28, slicesSpiral: 36, slicesStraight: 32 }, // Cấp 6: Siêu Mịn Mức 6 (CAM/CNC) [Mặc Định Cao]
            7: { pts: 34, slicesSpiral: 42, slicesStraight: 38 }, // Cấp 7: Cực Mịn Mức 7 (Độ Nét Cao)
            8: { pts: 40, slicesSpiral: 48, slicesStraight: 44 }  // Cấp 8: Tuyệt Đối Mức 8 (Ultra Precision CAD)
        };

        const dLevel = Math.max(1, Math.min(8, parseInt(opt.meshDensityLevel) || 6));
        const preset = densityPresets[dLevel] || densityPresets[6];

        const defaultSlices = isSpiral ? preset.slicesSpiral : preset.slicesStraight;
        const numSlices = opt.numSlices !== undefined ? Math.max(1, Math.min(64, parseInt(opt.numSlices))) : defaultSlices;
        const ptsPerFlank = opt.ptsPerFlank !== undefined ? Math.max(4, Math.min(50, parseInt(opt.ptsPerFlank))) : preset.pts;
        const ptsFillet = opt.ptsFillet !== undefined ? Math.max(2, Math.min(20, parseInt(opt.ptsFillet))) : undefined;
        const R_tool = 1.5 * b; // MITCalc Section 16.4 cutter radius

        // 1. Generate tooth rings for all slices along face width b (Re -> Ri)
        const layers = [];

        for (let s = 0; s <= numSlices; s++) {
            const frac = s / numSlices;
            const R_s = Re - frac * (Re - Ri);
            const scale_s = R_s / Re;
            const u = (R_s - Rm) / b;

            let spiralAngle = 0.0;
            if (isSpiral) {
                if (gearingType === 'straight_type1') {
                    const V = hand * u * b * Math.tan(beta);
                    spiralAngle = V / Math.max(1.0, R_s * sinD);
                } else {
                    const term = u * b + R_tool * Math.sin(beta);
                    const W = hand * (R_tool * Math.cos(beta) - Math.sqrt(Math.max(0.0, R_tool * R_tool - term * term)));
                    // Conical circumferential development: arc angle theta = W / r_pitch (exact conjugate ratio z2/z1 across all slices)
                    spiralAngle = W / Math.max(1.0, R_s * sinD);
                }
            } else {
                spiralAngle = 0.0;
            }

            const r_pitch = R_s * sinD;
            const z_pitch = R_s * cosD;
            const ha_s = ha_e * scale_s;
            const hf_s = hf_e * scale_s;
            const sn_s = sn_e * scale_s;

            // Conjugate Mesh Contact Mode in Flank-Only Mode:
            const contactMode = opt.contactMode || 'theory';
            const isPinion = (opt.hand === -1) || (opt.isPinion === true);
            let dThetaKiss = 0.0;
            if (isPinion && isSurfaceOnly) {
                if (contactMode === 'gleason') {
                    const K_kiss = Math.max(0.0, 1.0 - 4.0 * u * u);
                    dThetaKiss = (0.065 * K_kiss) / Math.max(1.0, r_pitch);
                } else {
                    const linearScale = R_s / Rm;
                    dThetaKiss = (0.028 * linearScale) / Math.max(1.0, r_pitch);
                }
            }

            // Build exact single-tooth contour with C1 circular root fillet R_chan = 0.38 * m_s
            const { toothContour } = this.generateSliceToothContour({
                z, mmn, Rm, R_s, delta, alfa, beta, isSpiral,
                ha_s, hf_s, sn_s, ptsPerFlank, ptsFillet, dThetaKiss
            });

            const ring = [];
            for (let tooth = 0; tooth < z; tooth++) {
                const centerAngle = (tooth * 2.0 * Math.PI) / z + spiralAngle;
                // Exclude the last point of toothContour (which equals the first point of the next tooth at +half_pitch)
                // to prevent zero-area degenerate triangles at tooth space boundaries!
                for (let p = 0; p < toothContour.length - 1; p++) {
                    const pt = toothContour[p];
                    const ang = centerAngle + pt.theta;
                    const r_pt = r_pitch + pt.h * cosD;
                    const z_pt = z_pitch - pt.h * sinD;
                    ring.push({
                        x: r_pt * Math.cos(ang),
                        y: r_pt * Math.sin(ang),
                        z: z_pt,
                        r: r_pt,
                        h: pt.h,
                        uFace: u,
                        flankT: pt.flankT,
                        isEngageFlank: pt.isEngageFlank ? 1.0 : 0.0,
                        flankId: pt.flankId || 0.0,
                        zone: pt.zone
                    });
                }
            }
            layers.push(ring);
        }

        const N = layers[0].length;
        const vertices = [];
        const normals = [];
        const indices = [];
        const rawTriangles = [];
        const tcaParams = [];

        function addTri(p1, p2, p3, nExplicit = null) {
            const ax = p2.x - p1.x, ay = p2.y - p1.y, az = p2.z - p1.z;
            const bx = p3.x - p1.x, by = p3.y - p1.y, bz = p3.z - p1.z;
            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const len = Math.hypot(nx, ny, nz);
            if (len > 1e-9) { nx /= len; ny /= len; nz /= len; }
            else { nx = 0; ny = 0; nz = 1; }

            const n = nExplicit || { x: nx, y: ny, z: nz };
            const idx = vertices.length / 3;

            vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
            indices.push(idx, idx + 1, idx + 2);

            tcaParams.push(
                p1.uFace !== undefined ? p1.uFace : 0.0,
                p1.flankT !== undefined ? p1.flankT : -1.0,
                p1.flankId !== undefined ? p1.flankId : (p1.isEngageFlank ? 1.0 : 0.0),
                p2.uFace !== undefined ? p2.uFace : 0.0,
                p2.flankT !== undefined ? p2.flankT : -1.0,
                p2.flankId !== undefined ? p2.flankId : (p2.isEngageFlank ? 1.0 : 0.0),
                p3.uFace !== undefined ? p3.uFace : 0.0,
                p3.flankT !== undefined ? p3.flankT : -1.0,
                p3.flankId !== undefined ? p3.flankId : (p3.isEngageFlank ? 1.0 : 0.0)
            );

            rawTriangles.push([
                [p1.x, p1.y, p1.z],
                [p2.x, p2.y, p2.z],
                [p3.x, p3.y, p3.z],
                [n.x, n.y, n.z]
            ]);
        }

        function addQuad(p1, p2, p3, p4, nExplicit = null) {
            addTri(p1, p2, p3, nExplicit);
            addTri(p1, p3, p4, nExplicit);
        }

        // GROUP 1: TOOTH FLANK SURFACES, CIRCULAR ROOT FILLETS (R CHAN) & ROOT/TIP LANDS (ALONG FACE WIDTH b)
        for (let s = 0; s < numSlices; s++) {
            const L1 = layers[s];
            const L2 = layers[s + 1];
            for (let j = 0; j < N; j++) {
                const nextJ = (j + 1) % N;
                addQuad(L1[j], L2[j], L2[nextJ], L1[nextJ]);
            }
        }

        // Return open flank shell if surfaceOnly requested (Mastercam 5-axis toolpaths)
        if (isSurfaceOnly) {
            const bbox = Bevel3DGenerator._computeBBox(vertices);
            return {
                vertices: new Float32Array(vertices),
                normals: new Float32Array(normals),
                indices: new Uint32Array(indices),
                tcaParams: new Float32Array(tcaParams),
                rawTriangles,
                bbox,
                isSurfaceOnly: true,
                z, mmn, b, Re, Ri, dBore
            };
        }

        // GROUP 2: OUTER HEEL BLANK BODY (R = Re, SLICE 0)
        const L_heel = layers[0];
        const heelRimPts = [];
        const heelBorePts = [];

        for (let j = 0; j < N; j++) {
            const ang = Math.atan2(L_heel[j].y, L_heel[j].x);
            heelRimPts.push({ x: r_heel_rim * Math.cos(ang), y: r_heel_rim * Math.sin(ang), z: z_heel_hub });
            heelBorePts.push({ x: rBore * Math.cos(ang), y: rBore * Math.sin(ang), z: z_heel_hub });
        }

        const nHeelFace = { x: 0, y: 0, z: 1.0 };
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            const angMid = Math.atan2(
                0.5 * (L_heel[j].y + L_heel[nextJ].y),
                0.5 * (L_heel[j].x + L_heel[nextJ].x)
            );
            const nHeelCone = { x: sinD * Math.cos(angMid), y: sinD * Math.sin(angMid), z: cosD };
            addQuad(heelRimPts[j], L_heel[j], L_heel[nextJ], heelRimPts[nextJ], nHeelCone);
            addQuad(heelBorePts[j], heelRimPts[j], heelRimPts[nextJ], heelBorePts[nextJ], nHeelFace);
        }

        // GROUP 3: INNER TOE BLANK BODY (R = Ri, SLICE numSlices)
        const L_toe = layers[numSlices];
        const toeRimPts = [];
        const toeBorePts = [];

        for (let j = 0; j < N; j++) {
            const ang = Math.atan2(L_toe[j].y, L_toe[j].x);
            toeRimPts.push({ x: r_toe_rim * Math.cos(ang), y: r_toe_rim * Math.sin(ang), z: z_toe_hub });
            toeBorePts.push({ x: rBore * Math.cos(ang), y: rBore * Math.sin(ang), z: z_toe_hub });
        }

        const nToeFace = { x: 0, y: 0, z: -1.0 };
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            const angMid = Math.atan2(
                0.5 * (L_toe[j].y + L_toe[nextJ].y),
                0.5 * (L_toe[j].x + L_toe[nextJ].x)
            );
            const nToeCone = { x: -sinD * Math.cos(angMid), y: -sinD * Math.sin(angMid), z: -cosD };
            addQuad(L_toe[j], toeRimPts[j], toeRimPts[nextJ], L_toe[nextJ], nToeCone);
            addQuad(toeRimPts[j], toeBorePts[j], toeBorePts[nextJ], toeRimPts[nextJ], nToeFace);
        }

        // GROUP 4: INNER CYLINDRICAL SHAFT BORE (RADIUS rBore, FROM z_toe TO z_heel)
        for (let j = 0; j < N; j++) {
            const nextJ = (j + 1) % N;
            const angMid = Math.atan2(heelBorePts[j].y, heelBorePts[j].x);
            const nBore = { x: -Math.cos(angMid), y: -Math.sin(angMid), z: 0 };
            addQuad(heelBorePts[j], heelBorePts[nextJ], toeBorePts[nextJ], toeBorePts[j], nBore);
        }

        const bbox = Bevel3DGenerator._computeBBox(vertices);
        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices),
            tcaParams: new Float32Array(tcaParams),
            rawTriangles,
            bbox,
            isSurfaceOnly: false,
            z, mmn, b, Re, Ri, dBore,
            z_toe_hub, z_heel_hub, rBore
        };
    },

    /**
     * Generates an Open Flank Surface Mesh directly (CAM Drive Surfaces)
     */
    generateGearSurfaceMesh(opt) {
        return this.generateGearMesh({ ...opt, surfaceOnly: true });
    },

    /**
     * Computes 3D Bounding Box
     * @private
     */
    _computeBBox(vertices) {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i], y = vertices[i + 1], z = vertices[i + 2];
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
        }
        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
            size: [maxX - minX, maxY - minY, maxZ - minZ]
        };
    }
};

if (typeof window !== 'undefined') {
    window.Bevel3DGenerator = Bevel3DGenerator;
}
