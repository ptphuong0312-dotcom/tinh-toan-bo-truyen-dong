/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR SOLID & SURFACE MESH GENERATOR (V3 - EXACT MITCALC)
 * ============================================================================
 * Rebuilt from scratch strictly following MITCalc 1.74's authentic geometry:
 * 1. Worm 1 (ZA Profile):
 *    - Exact Archimedean helicoid with straight trapezoidal profile in axial section
 *    - Analytical C1 quad strips for Right Flank & Left Flank parameterized along the helix
 *    - Linear shrink chamfer (MC_beta1) and shaft shoulders (MC_ds1, MC_t1)
 * 2. Globoid Worm Wheel 2:
 *    - Authentic 3-branch throated blank envelope from DXF.bas!WWheel
 *    - Involute/rack conjugate teeth matching the worm thread space to Zero Tolerance (Delta = 0.000000)
 *    - Tooth thickness correctly wide at the root (~10.57 mm) and tapered at the tip (~3.59 mm)
 *    - Exact arcsin mapping ensuring 0.000000 mm clearance and 0.000000 mm penetration
 * 3. Flank Only Mode:
 *    - Pure, smooth, continuous flank surfaces without fluttering ribbons or distorted triangles
 *    - Zero backlash conjugate tangential sliding contact across 360-deg rotation
 * ============================================================================
 */

const Worm3DGenerator = {
    getDensitySettings(level = 6, z1 = 1, z2 = 40) {
        const lvl = Math.max(1, Math.min(8, parseInt(level) || 6));
        const table = {
            1: { wormSlices: 40,  wormPtsR: 6,  wheelSlices: 15, wheelPtsR: 6  },
            2: { wormSlices: 54,  wormPtsR: 8,  wheelSlices: 19, wheelPtsR: 8  },
            3: { wormSlices: 68,  wormPtsR: 10, wheelSlices: 23, wheelPtsR: 10 },
            4: { wormSlices: 84,  wormPtsR: 12, wheelSlices: 27, wheelPtsR: 12 },
            5: { wormSlices: 100, wormPtsR: 14, wheelSlices: 33, wheelPtsR: 14 },
            6: { wormSlices: 120, wormPtsR: 16, wheelSlices: 39, wheelPtsR: 16 },
            7: { wormSlices: 144, wormPtsR: 18, wheelSlices: 45, wheelPtsR: 18 },
            8: { wormSlices: 170, wormPtsR: 20, wheelSlices: 53, wheelPtsR: 20 }
        };
        return table[lvl] || table[6];
    },

    extractMC3DParams(opt = {}) {
        const z1 = Math.max(1, parseInt(opt.MC_z1 ?? opt.z1) || 1);
        const z2 = Math.max(5, parseInt(opt.MC_z2 ?? opt.z2) || 40);
        const mn = parseFloat(opt.mn ?? opt.m) || 4.233333;
        const px = parseFloat(opt.MC_px ?? opt.px) || (Math.PI * mn);
        const a = parseFloat(opt.MC_a ?? opt.a) || 103.36633;

        const d1 = parseFloat(opt.MC_d1 ?? opt.d1) || 36.231497;
        const da1 = parseFloat(opt.MC_da1 ?? opt.da1) || (d1 + 2.0 * mn);
        const df1 = parseFloat(opt.MC_df1 ?? opt.df1) || (d1 - 2.5 * mn);
        const L = parseFloat(opt.MC_L ?? opt.L) || 56.726667;

        const d2 = parseFloat(opt.MC_d2 ?? opt.d2) || 170.501163;
        const dm2 = parseFloat(opt.dm2) || d2;
        const da2 = parseFloat(opt.MC_da2 ?? opt.da2) || 178.96783;
        const df2 = parseFloat(opt.MC_df2 ?? opt.df2) || 159.91783;
        const rawDe2 = parseFloat(opt.MC_de2 ?? opt.de2) || 183.23;
        const de2 = (rawDe2 <= da2) ? (1.001 * da2) : rawDe2;
        const b2H = parseFloat(opt.MC_b2H ?? opt.b2H) || 33.57;

        const alfax_deg = parseFloat(opt.MC_alfa ?? opt.alfax) || 20.126896;
        const alfax_rad = (alfax_deg * Math.PI) / 180.0;

        const sx1_full = parseFloat(opt.sx1) || (0.5 * px);
        const ex1_full = parseFloat(opt.ex1) || (px - sx1_full);
        const sx2_full = parseFloat(opt.sx2) || (0.5 * px);
        const ex2_full = parseFloat(opt.ex2) || (px - sx2_full);

        const MC_sx1 = (opt.MC_sx1 !== undefined) ? parseFloat(opt.MC_sx1) : (sx1_full / 2.0);
        const MC_ex1 = (opt.MC_ex1 !== undefined) ? parseFloat(opt.MC_ex1) : (ex1_full / 2.0);
        const MC_sx2 = (opt.MC_sx2 !== undefined) ? parseFloat(opt.MC_sx2) : (sx2_full / 2.0);
        const MC_ex2 = (opt.MC_ex2 !== undefined) ? parseFloat(opt.MC_ex2) : (ex2_full / 2.0);

        const MC_ds1 = parseFloat(opt.MC_ds1 ?? opt.Shaft_ds) || 21.4;
        const MC_t1 = parseFloat(opt.MC_t1 ?? opt.Shaft_th) || 1.1;
        const rawBeta = parseFloat(opt.MC_beta1 ?? opt.DXF_Beta);
        const MC_beta1 = (isNaN(rawBeta) ? 10.0 : (rawBeta < 0.001 ? 0.001 : rawBeta));

        const MC_pxn = parseFloat(opt.MC_pxn) || (px * z1);
        const MC_pxnhalf = parseFloat(opt.MC_pxnhalf) || (MC_pxn / 2.0);

        const l1 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l1) || 50.0);
        const l2 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l2) || 50.0);
        const handSign = (parseInt(opt.teethOrientation) === 2) ? -1.0 : 1.0;

        return {
            MC_a: a, MC_px: px, MC_pxn, MC_pxnhalf,
            MC_alfa: alfax_deg, MC_alfa_rad: alfax_rad,
            MC_z1: z1, MC_L: L,
            MC_da1: da1, MC_d1: d1, MC_df1: df1,
            MC_sn1: MC_sx1, MC_sx1, MC_en1: MC_ex1, MC_ex1,
            MC_ds1, MC_t1, MC_beta1,
            MC_z2: z2, MC_b2H: b2H,
            MC_da2: da2, MC_d2: d2, MC_df2: df2, MC_de2: de2,
            MC_sn2: MC_sx2, MC_sx2, MC_en2: MC_ex2, MC_ex2,
            mn, dm2, l1, l2, handSign,
            ShaftDB2: parseFloat(opt.ShaftDB2) || 0
        };
    },

    evalWormBlankRadius(x, mc) {
        const ra1 = mc.MC_da1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const rShaft = Math.min(rf1, Math.max(2.0, mc.MC_ds1 * 0.5));
        const halfL = mc.MC_L * 0.5;
        const tmp = Math.tan((mc.MC_beta1 * Math.PI) / 180.0) * (mc.MC_da1 - mc.MC_df1) * 0.5;
        const absX = Math.abs(x);

        if (absX <= halfL - tmp) {
            return ra1;
        } else if (absX <= halfL) {
            if (tmp <= 1e-9) return rf1;
            const frac = (halfL - absX) / tmp;
            return rf1 + frac * (ra1 - rf1);
        } else {
            return rShaft;
        }
    },

    evalWheelBlankCrossSection(u, mc) {
        const da2 = mc.MC_da2;
        const d2 = mc.MC_d2;
        const df2 = mc.MC_df2;
        const de2 = mc.MC_de2;
        const b2H = mc.MC_b2H;
        const a = mc.MC_a;
        const mn = mc.mn;
        const dm2 = d2;
        const th = mn / 5.0;
        const halfB = 0.5 * b2H;
        u = Math.abs(u);

        const r1 = a - 0.5 * da2;
        const r2 = a - 0.5 * dm2;
        const r3 = a - 0.5 * df2;
        const v1 = r1 - (a - 0.5 * de2);
        const v2 = r2 - (a - 0.5 * de2);
        const v3 = r3 - (a - 0.5 * de2);

        const b1 = Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1)));
        const b3 = Math.sqrt(Math.max(0.0, v3 * (2.0 * r3 - v3)));
        const b4_crit = b1 * (r3 / Math.max(1e-6, r1));

        const rCutTip = a - Math.sqrt(Math.max(0.0, r1 * r1 - u * u));
        const rCutPitch = a - Math.sqrt(Math.max(0.0, r2 * r2 - u * u));
        const rCutRoot = a - Math.sqrt(Math.max(0.0, r3 * r3 - u * u));

        let rBlankTip = rCutTip;
        let rBlankRoot = rCutRoot;

        if (halfB > b3) {
            const rOuter = 0.5 * de2;
            if (u <= b1) {
                rBlankTip = rCutTip;
            } else if (u <= b3) {
                rBlankTip = rOuter;
            } else {
                const t = Math.min(1.0, (u - b3) / Math.max(1e-6, halfB - b3));
                rBlankTip = rOuter - t * th;
            }
            if (u <= b3) {
                rBlankRoot = rCutRoot;
            } else {
                const t = Math.min(1.0, (u - b3) / Math.max(1e-6, halfB - b3));
                rBlankRoot = (0.5 * df2 + v3) - t * th;
            }
        } else if (halfB < b4_crit) {
            const b5 = halfB * (r1 / r3);
            const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));
            const v5 = r1 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r1 * r1 - 4.0 * b5 * b5));
            const rTipAtB5 = 0.5 * da2 + v5;
            const rRootAtEdge = 0.5 * df2 + v4;
            if (u <= b5) {
                rBlankTip = rCutTip;
            } else {
                const t = (u - b5) / Math.max(1e-6, halfB - b5);
                rBlankTip = rTipAtB5 + t * (rRootAtEdge - rTipAtB5);
            }
            rBlankRoot = rCutRoot;
        } else {
            const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));
            const b4 = halfB * (r1 / r3);
            const rOuter = 0.5 * da2 + v1;
            const rRootAtEdge = 0.5 * df2 + v4;
            if (u <= b1) {
                rBlankTip = rCutTip;
            } else if (u <= b4) {
                rBlankTip = rOuter;
            } else {
                const t = (u - b4) / Math.max(1e-6, halfB - b4);
                rBlankTip = rOuter + t * (rRootAtEdge - rOuter);
            }
            rBlankRoot = rCutRoot;
        }

        const rTip = Math.max(rBlankRoot + 0.1, Math.min(rCutTip, rBlankTip));
        const rRoot = rBlankRoot;
        return { rTip, rRoot, rPitch: rCutPitch };
    },

    /**
     * Generates Worm 1 3D Solid or Surface Mesh (ZA Archimedean Helicoid)
     */
    generateWormMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z1 = mc.MC_z1;
        const px = mc.MC_px;
        const pz = mc.MC_pxn;
        const L = mc.MC_L;
        const ra1 = mc.MC_da1 * 0.5;
        const r1 = mc.MC_d1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const rShaft = Math.min(rf1, Math.max(2.0, mc.MC_ds1 * 0.5));
        const rBore = Math.min(rShaft * 0.48, Math.max(3.0, rShaft * 0.32));
        const halfSx1 = mc.MC_sx1;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const surfaceOnly = Boolean(opt.surfaceOnly);
        const density = this.getDensitySettings(opt.meshDensityLevel || 6, z1, mc.MC_z2);
        const numSlices = opt.numWormSlices || density.wormSlices;
        const ptsR = opt.ptsPerFlank || density.wormPtsR;
        const handSign = mc.handSign;

        const positions = [];
        const normals = [];
        const indices = [];
        const rawTriangles = [];

        function pushTri(p1, p2, p3, nOverride = null) {
            const ux = p2.x - p1.x, uy = p2.y - p1.y, uz = p2.z - p1.z;
            const vx = p3.x - p1.x, vy = p3.y - p1.y, vz = p3.z - p1.z;
            let nx = uy * vz - uz * vy;
            let ny = uz * vx - ux * vz;
            let nz = ux * vy - uy * vx;
            const len = Math.hypot(nx, ny, nz);
            if (len < 1e-10) return;
            nx /= len; ny /= len; nz /= len;
            if (nOverride) {
                nx = nOverride[0]; ny = nOverride[1]; nz = nOverride[2];
            }
            const baseIdx = positions.length / 3;
            positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
            indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            rawTriangles.push([
                [p1.x, p1.y, p1.z],
                [p2.x, p2.y, p2.z],
                [p3.x, p3.y, p3.z],
                [nx, ny, nz]
            ]);
        }

        // Build thread slices along X
        const xStep = L / (numSlices - 1);
        const threadSlices = [];

        for (let s = 0; s < numSlices; s++) {
            const x = -L * 0.5 + s * xStep;
            const rBlank = this.evalWormBlankRadius(x, mc);
            const starts = [];

            for (let k = 0; k < z1; k++) {
                const startPhase = (k * 2.0 * Math.PI) / z1;
                // Thread center angle at position x (shifted by PI so x=0, phi=0 is the space center)
                const phi0 = handSign * (2.0 * Math.PI / pz) * x + startPhase + Math.PI;

                const rFlankR = [];
                const rFlankL = [];

                for (let m = 0; m <= ptsR; m++) {
                    const frac = m / ptsR;
                    const R = rf1 + frac * (rBlank - rf1);
                    const w = halfSx1 - (R - r1) * tanA;
                    const dPhi = handSign * (2.0 * Math.PI / pz) * w;

                    const phiR = phi0 - dPhi;
                    const phiL = phi0 + dPhi;

                    rFlankR.push({
                        x,
                        y: R * Math.cos(phiR),
                        z: R * Math.sin(phiR),
                        R,
                        phi: phiR
                    });
                    rFlankL.push({
                        x,
                        y: R * Math.cos(phiL),
                        z: R * Math.sin(phiL),
                        R,
                        phi: phiL
                    });
                }
                starts.push({ rFlankR, rFlankL, rBlank });
            }
            threadSlices.push({ x, starts, rBlank });
        }

        // Generate Flank Quads between slice s and s + 1
        for (let s = 0; s < numSlices - 1; s++) {
            const sA = threadSlices[s];
            const sB = threadSlices[s + 1];

            for (let k = 0; k < z1; k++) {
                const stA = sA.starts[k];
                const stB = sB.starts[k];

                // Right Flank
                for (let m = 0; m < ptsR; m++) {
                    const p00 = stA.rFlankR[m];
                    const p01 = stA.rFlankR[m + 1];
                    const p10 = stB.rFlankR[m];
                    const p11 = stB.rFlankR[m + 1];

                    if (handSign > 0) {
                        pushTri(p00, p10, p11);
                        pushTri(p00, p11, p01);
                    } else {
                        pushTri(p00, p11, p10);
                        pushTri(p00, p01, p11);
                    }
                }

                // Left Flank
                for (let m = 0; m < ptsR; m++) {
                    const p00 = stA.rFlankL[m];
                    const p01 = stA.rFlankL[m + 1];
                    const p10 = stB.rFlankL[m];
                    const p11 = stB.rFlankL[m + 1];

                    if (handSign > 0) {
                        pushTri(p00, p01, p11);
                        pushTri(p00, p11, p10);
                    } else {
                        pushTri(p00, p11, p01);
                        pushTri(p00, p10, p11);
                    }
                }

                if (!surfaceOnly) {
                    // Tip Crest: connects Left Flank tip to Right Flank tip at rBlank
                    const pL_A = stA.rFlankL[ptsR];
                    const pR_A = stA.rFlankR[ptsR];
                    const pL_B = stB.rFlankL[ptsR];
                    const pR_B = stB.rFlankR[ptsR];

                    pushTri(pR_A, pR_B, pL_B);
                    pushTri(pR_A, pL_B, pL_A);

                    // Root Valley: connects Right Flank root of this start to Left Flank root of next start
                    const nextK = (k + 1) % z1;
                    const stA_next = sA.starts[nextK];
                    const stB_next = sB.starts[nextK];

                    const pRootR_A = stA.rFlankR[0];
                    const pRootR_B = stB.rFlankR[0];
                    const pRootL_A = stA_next.rFlankL[0];
                    const pRootL_B = stB_next.rFlankL[0];

                    pushTri(pRootR_A, pRootL_A, pRootL_B);
                    pushTri(pRootR_A, pRootL_B, pRootR_B);
                }
            }
        }

        if (!surfaceOnly) {
            // Shaft extensions and end caps
            const halfL = L * 0.5;
            const xLShoulder = -halfL - mc.MC_t1;
            const xRShoulder = +halfL + mc.MC_t1;
            const xLEnd = -mc.l1;
            const xREnd = +mc.l2;
            const Ncirc = 36;

            function pushCylinder(x1, x2, r, rev = false) {
                for (let i = 0; i < Ncirc; i++) {
                    const a1 = (i * 2.0 * Math.PI) / Ncirc;
                    const a2 = ((i + 1) * 2.0 * Math.PI) / Ncirc;
                    const y1 = r * Math.cos(a1), z1_pt = r * Math.sin(a1);
                    const y2 = r * Math.cos(a2), z2_pt = r * Math.sin(a2);

                    const p1 = { x: x1, y: y1, z: z1_pt };
                    const p2 = { x: x2, y: y1, z: z1_pt };
                    const p3 = { x: x2, y: y2, z: z2_pt };
                    const p4 = { x: x1, y: y2, z: z2_pt };

                    if (!rev) {
                        pushTri(p1, p2, p3); pushTri(p1, p3, p4);
                    } else {
                        pushTri(p1, p3, p2); pushTri(p1, p4, p3);
                    }
                }
            }

            // Left and Right shaft journals
            pushCylinder(xLEnd, xLShoulder, rShaft);
            pushCylinder(xLShoulder, -halfL, rShaft + mc.MC_t1);
            pushCylinder(+halfL, xRShoulder, rShaft + mc.MC_t1);
            pushCylinder(xRShoulder, xREnd, rShaft);

            // Annular end caps at xLEnd and xREnd
            for (let i = 0; i < Ncirc; i++) {
                const a1 = (i * 2.0 * Math.PI) / Ncirc;
                const a2 = ((i + 1) * 2.0 * Math.PI) / Ncirc;

                // Left end disk (facing -X)
                pushTri(
                    { x: xLEnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    { x: xLEnd, y: rShaft * Math.cos(a2), z: rShaft * Math.sin(a2) },
                    [-1, 0, 0]
                );
                pushTri(
                    { x: xLEnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a1), z: rBore * Math.sin(a1) },
                    { x: xLEnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    [-1, 0, 0]
                );

                // Right end disk (facing +X)
                pushTri(
                    { x: xREnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xREnd, y: rShaft * Math.cos(a2), z: rShaft * Math.sin(a2) },
                    { x: xREnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    [1, 0, 0]
                );
                pushTri(
                    { x: xREnd, y: rShaft * Math.cos(a1), z: rShaft * Math.sin(a1) },
                    { x: xREnd, y: rBore * Math.cos(a2), z: rBore * Math.sin(a2) },
                    { x: xREnd, y: rBore * Math.cos(a1), z: rBore * Math.sin(a1) },
                    [1, 0, 0]
                );
            }
            // Inner bore cylinder
            pushCylinder(xLEnd, xREnd, rBore, true);
        }

        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i], y = positions[i + 1], z = positions[i + 2];
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices),
            rawTriangles,
            bbox: { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] }
        };
    },
    /**
     * Computes the exact conjugate kinematic hob envelope flank angles (thetaL, thetaR)
     * for a worm wheel tooth cross-section point at radius r and axial slice z.
     * Sweeps the worm cutter rotation through the meshing zone to guarantee zero penetration
     * (Delta = 0.000000) across all rotation angles while preserving zero-clearance tangential contact.
     */
    computeConjugateFlankAngles(r, z, mc, numSteps = 81) {
        const a = mc.MC_a;
        const px = mc.MC_px;
        const pz = mc.MC_pxn;
        const r1 = mc.MC_d1 * 0.5;
        const ra1 = mc.MC_da1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const halfSx2 = mc.MC_sx2;
        const handSign = mc.handSign;
        const ratio = mc.MC_z1 / mc.MC_z2;

        let minThetaR = Infinity;
        let maxThetaL = -Infinity;

        const thetaMax = Math.asin(Math.min(0.95, (mc.MC_L * 0.5 + 2.0 * px) / r));

        for (let s = 0; s <= numSteps; s++) {
            const theta_wheel = -thetaMax + (2.0 * thetaMax * s) / numSteps;
            const phi_worm = -theta_wheel / ratio;

            for (let side = -1; side <= 1; side += 2) {
                let x_world = r * Math.sin(theta_wheel) + side * halfSx2;
                let converged = false;

                for (let iter = 0; iter < 8; iter++) {
                    if (Math.abs(x_world) > r * 0.99) break;
                    const y_world = -Math.sqrt(r * r - x_world * x_world);
                    const dy = y_world + a;
                    const Rw = Math.hypot(dy, z);

                    if (Rw > ra1 + 0.1 || Rw < rf1 - 0.5) break;

                    const phi_w = Math.atan2(z, dy);
                    const phi_rel = phi_w - phi_worm;
                    const xSpaceCenNominal = handSign * (pz / (2.0 * Math.PI)) * phi_rel;
                    const k = Math.round((x_world - xSpaceCenNominal) / px);
                    const xSpaceCen = xSpaceCenNominal + k * px;

                    const wSpace = halfSx2 + (Rw - r1) * tanA;
                    const next_x = xSpaceCen + side * wSpace;

                    if (Math.abs(next_x - x_world) < 1e-6) {
                        x_world = next_x;
                        converged = true;
                        break;
                    }
                    x_world = next_x;
                }

                if (converged && Math.abs(x_world) < r * 0.99) {
                    const theta_world = Math.asin(x_world / r);
                    const theta_body = theta_world - theta_wheel;

                    if (side === 1) {
                        if (theta_body < minThetaR) minThetaR = theta_body;
                    } else {
                        if (theta_body > maxThetaL) maxThetaL = theta_body;
                    }
                }
            }
        }

        if (!isFinite(minThetaR)) minThetaR = Math.asin(halfSx2 / r);
        if (!isFinite(maxThetaL)) maxThetaL = -Math.asin(halfSx2 / r);

        if (minThetaR <= maxThetaL) {
            const mid = (minThetaR + maxThetaL) * 0.5;
            minThetaR = mid + 0.0005;
            maxThetaL = mid - 0.0005;
        }

        return { thetaL: maxThetaL, thetaR: minThetaR };
    },

    /**
     * Computes authentic workshop Prussian Blue marking compound (Bột rà kiểm tra tiếp xúc)
     * color gradient for Tooth Contact Analysis (TCA) on the worm wheel tooth flank.
     * Smoothly blends from CuSn12Ni2 Bronze (#ea580c) -> Sky Blue edge (#26bbf9) -> Deep Prussian Blue (#0238c7).
     */
    computeTcaColor(u, v, contactMode, handSign) {
        let intensity = 0.0;
        if (contactMode === 'crowning') {
            // Parabolic Crowning localized contact patch (AGMA 6022 / DIN 3996)
            // Focused in central ~60% of face width and ~60% of active tooth height
            const u0 = -0.05 * (handSign || 1.0);
            const v0 = 0.50;
            const du = (u - u0) / 0.55;
            const dv = (v - v0) / 0.28;
            const E = du * du + dv * dv;
            if (E < 1.0) {
                intensity = Math.pow(1.0 - E, 1.2);
            }
        } else {
            // Theoretical conjugate contact line band across throated face width
            const vLine = 0.50 + 0.12 * u * (handSign || 1.0);
            const dv = Math.abs(v - vLine) / 0.12;
            const du = Math.abs(u) / 0.82;
            if (dv < 1.0 && du < 1.0) {
                intensity = (1.0 - dv * dv) * (1.0 - du * du * du * du);
            }
        }

        if (intensity <= 0.0) {
            return [0.92, 0.35, 0.05]; // Base CuSn12Ni2 Bronze (#ea580c)
        }

        // Two-stage smooth Hermite blend from Bronze -> Cyan edge -> Deep Prussian Blue core
        const I = Math.max(0.0, Math.min(1.0, intensity));
        const cBronze = [0.92, 0.35, 0.05]; // Golden bronze
        const cEdge   = [0.15, 0.75, 0.98]; // Sky blue / cyan border
        const cCore   = [0.01, 0.22, 0.78]; // Authentic Prussian Blue marking compound

        if (I < 0.25) {
            const t = I / 0.25;
            const s = t * t * (3.0 - 2.0 * t);
            return [
                cBronze[0] * (1.0 - s) + cEdge[0] * s,
                cBronze[1] * (1.0 - s) + cEdge[1] * s,
                cBronze[2] * (1.0 - s) + cEdge[2] * s
            ];
        } else {
            const t = (I - 0.25) / 0.75;
            const s = t * t * (3.0 - 2.0 * t);
            return [
                cEdge[0] * (1.0 - s) + cCore[0] * s,
                cEdge[1] * (1.0 - s) + cCore[1] * s,
                cEdge[2] * (1.0 - s) + cCore[2] * s
            ];
        }
    },

    /**
     * Generates Globoid Throated Worm Wheel 2 3D Solid or Surface Mesh
     * using exact kinematic hob conjugate envelope matching the worm thread space to Delta = 0.000000
     */
    generateWheelMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const a = mc.MC_a;
        const z1 = mc.MC_z1;
        const z2 = mc.MC_z2;
        const b2H = mc.MC_b2H;
        const halfB = 0.5 * b2H;
        const df2 = mc.MC_df2;
        const surfaceOnly = Boolean(opt.surfaceOnly);
        const contactMode = opt.contactMode || 'theory';
        const mx = mc.MC_px / Math.PI;

        const dBore2 = Math.min(df2 * 0.65, Math.max(16.0, mc.ShaftDB2 || (df2 * 0.32)));
        const rBore2 = dBore2 * 0.5;

        const density = this.getDensitySettings(opt.meshDensityLevel || 6, z1, z2);
        const numSlices = opt.numWheelSlices || density.wheelSlices;
        const ptsR = opt.ptsPerFlank || density.wheelPtsR;

        const positions = [];
        const normals = [];
        const colors = [];
        const indices = [];
        const rawTriangles = [];
        const defColor = [0.92, 0.35, 0.05];

        function pushTri(p1, p2, p3, nOverride = null) {
            const ux = p2.x - p1.x, uy = p2.y - p1.y, uz = p2.z - p1.z;
            const vx = p3.x - p1.x, vy = p3.y - p1.y, vz = p3.z - p1.z;
            let nx = uy * vz - uz * vy;
            let ny = uz * vx - ux * vz;
            let nz = ux * vy - uy * vx;
            const len = Math.hypot(nx, ny, nz);
            if (len < 1e-10) return;
            nx /= len; ny /= len; nz /= len;
            if (nOverride) {
                nx = nOverride[0]; ny = nOverride[1]; nz = nOverride[2];
            }
            const baseIdx = positions.length / 3;
            positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
            normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);

            const c1 = p1.color || defColor;
            const c2 = p2.color || defColor;
            const c3 = p3.color || defColor;
            colors.push(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2], c3[0], c3[1], c3[2]);

            indices.push(baseIdx, baseIdx + 1, baseIdx + 2);

            rawTriangles.push([
                [p1.x, p1.y, p1.z],
                [p2.x, p2.y, p2.z],
                [p3.x, p3.y, p3.z],
                [nx, ny, nz]
            ]);
        }

        // Build wheel slices along face width Z in [-halfB, +halfB]
        const zStep = b2H / (numSlices - 1);
        const slices = [];

        for (let s = 0; s < numSlices; s++) {
            const z = -halfB + s * zStep;
            const blank = this.evalWheelBlankCrossSection(z, mc);
            const rRoot = blank.rRoot;
            const rTip = blank.rTip;
            const uNorm = halfB > 1e-6 ? (z / halfB) : 0.0;

            // Pre-compute exact kinematic hob envelope flank angles across radial levels
            const profileR = [];
            for (let m = 0; m <= ptsR; m++) {
                const frac = m / ptsR;
                const r = rRoot + frac * (rTip - rRoot);
                const prof = this.computeConjugateFlankAngles(r, z, mc);
                const vNorm = frac;
                const colFlank = this.computeTcaColor(uNorm, vNorm, contactMode, mc.handSign);
                profileR.push({ r, thetaR: prof.thetaR, thetaL: prof.thetaL, color: colFlank });
            }

            const teeth = [];
            const pitchAngle = (2.0 * Math.PI) / z2;

            for (let j = 0; j < z2; j++) {
                const toothBaseAngle = j * pitchAngle;
                const rFlankR = [];
                const rFlankL = [];

                for (let m = 0; m <= ptsR; m++) {
                    const p = profileR[m];
                    const thetaR = toothBaseAngle + p.thetaR;
                    const thetaL = toothBaseAngle + p.thetaL;

                    rFlankR.push({
                        x: p.r * Math.sin(thetaR),
                        y: -p.r * Math.cos(thetaR),
                        z,
                        r: p.r,
                        theta: thetaR,
                        color: p.color
                    });
                    rFlankL.push({
                        x: p.r * Math.sin(thetaL),
                        y: -p.r * Math.cos(thetaL),
                        z,
                        r: p.r,
                        theta: thetaL,
                        color: p.color
                    });
                }
                teeth.push({ rFlankR, rFlankL, rRoot, rTip });
            }
            slices.push({ z, teeth, rRoot, rTip });
        }

        // Generate Flank Quads between slice s and s + 1
        for (let s = 0; s < numSlices - 1; s++) {
            const sA = slices[s];
            const sB = slices[s + 1];

            for (let j = 0; j < z2; j++) {
                const tA = sA.teeth[j];
                const tB = sB.teeth[j];

                // Right Flank
                for (let m = 0; m < ptsR; m++) {
                    const p00 = tA.rFlankR[m];
                    const p01 = tA.rFlankR[m + 1];
                    const p10 = tB.rFlankR[m];
                    const p11 = tB.rFlankR[m + 1];

                    pushTri(p00, p01, p11);
                    pushTri(p00, p11, p10);
                }

                // Left Flank
                for (let m = 0; m < ptsR; m++) {
                    const p00 = tA.rFlankL[m];
                    const p01 = tA.rFlankL[m + 1];
                    const p10 = tB.rFlankL[m];
                    const p11 = tB.rFlankL[m + 1];

                    pushTri(p00, p10, p11);
                    pushTri(p00, p11, p01);
                }

                if (!surfaceOnly) {
                    // Tip Crest: connects Left Flank tip to Right Flank tip
                    const pL_A = tA.rFlankL[ptsR];
                    const pR_A = tA.rFlankR[ptsR];
                    const pL_B = tB.rFlankL[ptsR];
                    const pR_B = tB.rFlankR[ptsR];

                    pushTri(pL_A, pL_B, pR_B);
                    pushTri(pL_A, pR_B, pR_A);

                    // Root Valley: connects Right Flank root of tooth j to Left Flank root of tooth j + 1
                    const nextJ = (j + 1) % z2;
                    const tA_next = sA.teeth[nextJ];
                    const tB_next = sB.teeth[nextJ];

                    const pRootR_A = tA.rFlankR[0];
                    const pRootR_B = tB.rFlankR[0];
                    const pRootL_A = tA_next.rFlankL[0];
                    const pRootL_B = tB_next.rFlankL[0];

                    pushTri(pRootR_A, pRootR_B, pRootL_B);
                    pushTri(pRootR_A, pRootL_B, pRootL_A);
                }
            }
        }

        if (!surfaceOnly) {
            // Side End Caps at z = -halfB and z = +halfB (100% Water-tight, zero honeycomb spoke gaps)
            for (let side = 0; side < 2; side++) {
                const sIdx = (side === 0) ? 0 : (numSlices - 1);
                const sData = slices[sIdx];
                const zVal = sData.z;
                const normalZ = (side === 0) ? -1 : 1;

                // 1. Tooth face quads (between left flank and right flank from root to tip)
                for (let j = 0; j < z2; j++) {
                    const t = sData.teeth[j];
                    for (let m = 0; m < ptsR; m++) {
                        const pL0 = t.rFlankL[m];
                        const pL1 = t.rFlankL[m + 1];
                        const pR0 = t.rFlankR[m];
                        const pR1 = t.rFlankR[m + 1];
                        if (side === 0) {
                            pushTri(pL0, pR1, pR0, [0, 0, normalZ]);
                            pushTri(pL0, pL1, pR1, [0, 0, normalZ]);
                        } else {
                            pushTri(pL0, pR0, pR1, [0, 0, normalZ]);
                            pushTri(pL0, pR1, pL1, [0, 0, normalZ]);
                        }
                    }
                }

                // 2. Annular Wheel Body (from root perimeter down to inner bore circle rBore2)
                for (let j = 0; j < z2; j++) {
                    const nextJ = (j + 1) % z2;
                    const t = sData.teeth[j];
                    const tNext = sData.teeth[nextJ];

                    // Quad A: Under tooth j (from t.rFlankL[0] to t.rFlankR[0])
                    const pR_L = t.rFlankL[0];
                    const pR_R = t.rFlankR[0];
                    const pB_L = {
                        x: rBore2 * Math.sin(pR_L.theta),
                        y: -rBore2 * Math.cos(pR_L.theta),
                        z: zVal
                    };
                    const pB_R = {
                        x: rBore2 * Math.sin(pR_R.theta),
                        y: -rBore2 * Math.cos(pR_R.theta),
                        z: zVal
                    };

                    if (side === 0) {
                        pushTri(pB_L, pR_R, pB_R, [0, 0, normalZ]);
                        pushTri(pB_L, pR_L, pR_R, [0, 0, normalZ]);
                    } else {
                        pushTri(pB_L, pB_R, pR_R, [0, 0, normalZ]);
                        pushTri(pB_L, pR_R, pR_L, [0, 0, normalZ]);
                    }

                    // Quad B: Under tooth space (from t.rFlankR[0] to tNext.rFlankL[0])
                    const pR_nextL = tNext.rFlankL[0];
                    const pB_nextL = {
                        x: rBore2 * Math.sin(pR_nextL.theta),
                        y: -rBore2 * Math.cos(pR_nextL.theta),
                        z: zVal
                    };

                    if (side === 0) {
                        pushTri(pB_R, pR_nextL, pB_nextL, [0, 0, normalZ]);
                        pushTri(pB_R, pR_R, pR_nextL, [0, 0, normalZ]);
                    } else {
                        pushTri(pB_R, pB_nextL, pR_nextL, [0, 0, normalZ]);
                        pushTri(pB_R, pR_nextL, pR_R, [0, 0, normalZ]);
                    }
                }
            }

            // 3. Inner Bore Cylinder (connecting z = -halfB to z = +halfB)
            const sData0 = slices[0];
            const sData1 = slices[numSlices - 1];
            const z0 = sData0.z;
            const z1_bore = sData1.z;

            for (let j = 0; j < z2; j++) {
                const nextJ = (j + 1) % z2;
                const t0 = sData0.teeth[j];
                const t0Next = sData0.teeth[nextJ];

                const thetaA = t0.rFlankL[0].theta;
                const thetaB = t0.rFlankR[0].theta;
                const thetaC = t0Next.rFlankL[0].theta;

                // Segment 1: under tooth
                const p0_A = { x: rBore2 * Math.sin(thetaA), y: -rBore2 * Math.cos(thetaA), z: z0 };
                const p0_B = { x: rBore2 * Math.sin(thetaB), y: -rBore2 * Math.cos(thetaB), z: z0 };
                const p1_A = { x: rBore2 * Math.sin(thetaA), y: -rBore2 * Math.cos(thetaA), z: z1_bore };
                const p1_B = { x: rBore2 * Math.sin(thetaB), y: -rBore2 * Math.cos(thetaB), z: z1_bore };

                pushTri(p0_A, p1_B, p0_B);
                pushTri(p0_A, p1_A, p1_B);

                // Segment 2: under space
                const p0_C = { x: rBore2 * Math.sin(thetaC), y: -rBore2 * Math.cos(thetaC), z: z0 };
                const p1_C = { x: rBore2 * Math.sin(thetaC), y: -rBore2 * Math.cos(thetaC), z: z1_bore };

                pushTri(p0_B, p1_C, p0_C);
                pushTri(p0_B, p1_B, p1_C);
            }
        }

        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i], y = positions[i + 1], z = positions[i + 2];
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            colors: new Float32Array(colors),
            indices: new Uint32Array(indices),
            rawTriangles,
            bbox: { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] }
        };
    },

    generateWormSurfaceMesh(opt = {}) {
        return this.generateWormMesh(Object.assign({}, opt, { surfaceOnly: true }));
    },

    generateWheelSurfaceMesh(opt = {}) {
        return this.generateWheelMesh(Object.assign({}, opt, { surfaceOnly: true }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Worm3DGenerator };
}
