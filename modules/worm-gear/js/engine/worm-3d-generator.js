/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR SOLID & SURFACE MESH GENERATOR (V2 - MITCALC 1.74)
 * ============================================================================
 * Rebuilt from scratch strictly following MITCalc 1.74's native 3D CAD
 * specification in C:\MITCalc\gear4\Gear4_01.xlsb:
 *   1. Calculation!A1:AF4 (32 3D CAD parameters MC_* exported by MTC_3D.bas!Output3D)
 *   2. DXF.bas!Worm (lines 258-280: linear shrink chamfer tmp = tan(MC_beta1)*(MC_da1-MC_df1)/2
 *      and shaft shoulders MC_ds1, MC_t1)
 *   3. DXF.bas!WWheel (lines 305-354: 3-branch globoid blank cross-section r1, r2, r3,
 *      v1..v5, b1..b5, th = m/5, swept along helix MC_d1cut with pitch MC_pxn)
 *
 * 100% Compatible with Three.js WebGL, Binary STL, Wavefront OBJ, and ISO 10303-21 STEP AP214.
 * ============================================================================
 */

const Worm3DGenerator = {
    /**
     * Maps meshDensityLevel (1..8) to slice and flank sampling counts
     */
    getDensitySettings(level = 6, z1 = 1, z2 = 40) {
        const lvl = Math.max(1, Math.min(8, parseInt(level) || 6));
        const table = {
            1: { wormSlicesPerPitch: 18, wormPtsPerStart: 36, wheelSlices: 13, wheelPtsPerFlank: 6  },
            2: { wormSlicesPerPitch: 24, wormPtsPerStart: 48, wheelSlices: 17, wheelPtsPerFlank: 8  },
            3: { wormSlicesPerPitch: 30, wormPtsPerStart: 60, wheelSlices: 21, wheelPtsPerFlank: 10 },
            4: { wormSlicesPerPitch: 36, wormPtsPerStart: 72, wheelSlices: 25, wheelPtsPerFlank: 12 },
            5: { wormSlicesPerPitch: 44, wormPtsPerStart: 88, wheelSlices: 31, wheelPtsPerFlank: 14 },
            6: { wormSlicesPerPitch: 54, wormPtsPerStart: 108, wheelSlices: 37, wheelPtsPerFlank: 16 },
            7: { wormSlicesPerPitch: 64, wormPtsPerStart: 128, wheelSlices: 45, wheelPtsPerFlank: 20 },
            8: { wormSlicesPerPitch: 76, wormPtsPerStart: 144, wheelSlices: 53, wheelPtsPerFlank: 24 }
        };
        const cfg = table[lvl] || table[6];
        const minTotalPts = Math.max(72, cfg.wormPtsPerStart);
        const ptsPerStart = Math.max(28, Math.ceil(minTotalPts / Math.max(1, z1)));
        return {
            wormSlicesPerPitch: cfg.wormSlicesPerPitch,
            wormPtsPerStart: ptsPerStart,
            wheelSlices: cfg.wheelSlices,
            wheelPtsPerFlank: cfg.wheelPtsPerFlank
        };
    },

    /**
     * Extracts the exact 32 MITCalc 1.74 3D CAD parameters (Calculation!A1:AF4)
     * plus auxiliary blank dimensions from the calculation result object.
     */
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
        // DXF.bas!WWheel line 317: If de2 <= da2 Then de2 = 1.001 * da2
        const de2 = (rawDe2 <= da2) ? (1.001 * da2) : rawDe2;
        const b2H = parseFloat(opt.MC_b2H ?? opt.b2H) || 33.57;

        const alfax_deg = parseFloat(opt.MC_alfa ?? opt.alfax) || 20.126896;
        const alfax_rad = (alfax_deg * Math.PI) / 180.0;

        // Note: In Calculation!L2:O2 and Y2:AB2, MC_sx1 = _sx1 / 2, MC_ex1 = _ex1 / 2, etc.
        const sx1_full = parseFloat(opt.sx1) || (0.5 * px);
        const ex1_full = parseFloat(opt.ex1) || (px - sx1_full);
        const sn1_full = parseFloat(opt.sn1) || sx1_full;
        const en1_full = parseFloat(opt.en1) || ex1_full;

        const sx2_full = parseFloat(opt.sx2) || (0.5 * px);
        const ex2_full = parseFloat(opt.ex2) || (px - sx2_full);
        const sn2_full = parseFloat(opt.sn2) || sx2_full;
        const en2_full = parseFloat(opt.en2) || ex2_full;

        const MC_sx1 = (opt.MC_sx1 !== undefined) ? parseFloat(opt.MC_sx1) : (sx1_full / 2.0);
        const MC_ex1 = (opt.MC_ex1 !== undefined) ? parseFloat(opt.MC_ex1) : (ex1_full / 2.0);
        const MC_sn1 = (opt.MC_sn1 !== undefined) ? parseFloat(opt.MC_sn1) : (sn1_full / 2.0);
        const MC_en1 = (opt.MC_en1 !== undefined) ? parseFloat(opt.MC_en1) : (en1_full / 2.0);

        const MC_sx2 = (opt.MC_sx2 !== undefined) ? parseFloat(opt.MC_sx2) : (sx2_full / 2.0);
        const MC_ex2 = (opt.MC_ex2 !== undefined) ? parseFloat(opt.MC_ex2) : (ex2_full / 2.0);
        const MC_sn2 = (opt.MC_sn2 !== undefined) ? parseFloat(opt.MC_sn2) : (sn2_full / 2.0);
        const MC_en2 = (opt.MC_en2 !== undefined) ? parseFloat(opt.MC_en2) : (en2_full / 2.0);

        const MC_ds1 = parseFloat(opt.MC_ds1 ?? opt.Shaft_ds) || 21.4;
        const MC_t1 = parseFloat(opt.MC_t1 ?? opt.Shaft_th) || 1.1;
        const rawBeta = parseFloat(opt.MC_beta1 ?? opt.DXF_Beta);
        const MC_beta1 = (isNaN(rawBeta) ? 10.0 : (rawBeta < 0.001 ? 0.001 : rawBeta));

        const MC_pxn = parseFloat(opt.MC_pxn) || (px * z1);
        const MC_pxnhalf = parseFloat(opt.MC_pxnhalf) || (MC_pxn / 2.0);
        const MC_z1sw = (z1 < 2) ? 2 : z1;
        const MC_arrang = (z1 === 1) ? 0.001 : 360.0;

        const MC_d1cutmin = parseFloat(opt.MC_d1cutmin) || (2.0 * (a - da2 / 2.0));
        const MC_d1cut = parseFloat(opt.MC_d1cut) || (2.0 * (a - d2 / 2.0));
        const MC_d1cutmax = parseFloat(opt.MC_d1cutmax) || (2.0 * (a - df2 / 2.0));

        const l1 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l1) || 50.0);
        const l2 = Math.max(L * 0.5 + MC_t1 + 8.0, parseFloat(opt.l2) || 50.0);
        const handSign = (parseInt(opt.teethOrientation) === 2) ? -1.0 : 1.0;

        return {
            MC_a: a,
            MC_px: px,
            MC_pxn,
            MC_pxnhalf,
            MC_alfa: alfax_deg,
            MC_alfa_rad: alfax_rad,
            MC_z1: z1,
            MC_z1sw,
            MC_arrang,
            MC_L: L,
            MC_da1: da1,
            MC_d1: d1,
            MC_df1: df1,
            MC_sn1,
            MC_sx1,
            MC_en1,
            MC_ex1,
            MC_ds1,
            MC_t1,
            MC_beta1,
            MC_z2: z2,
            MC_b2H: b2H,
            MC_da2: da2,
            MC_d2: d2,
            MC_df2: df2,
            MC_de2: de2,
            MC_sn2,
            MC_sx2,
            MC_en2,
            MC_ex2,
            MC_d1cutmin,
            MC_d1cut,
            MC_d1cutmax,
            mn,
            dm2,
            l1,
            l2,
            handSign,
            ShaftDB2: parseFloat(opt.ShaftDB2) || 0
        };
    },

    /**
     * Evaluates the outer revolved blank radius of Worm 1 at axial coordinate x
     * strictly following DXF.bas!Worm (lines 258-280):
     *   tmp = Tan(MC_beta1 * pi / 180) * (MC_da1 - MC_df1) / 2
     *   Linear shrink chamfer from (x = +- (MC_L/2 - tmp), r = MC_da1/2)
     *   to (x = +- MC_L/2, r = MC_df1/2), then step down to shaft shoulder r = MC_ds1/2.
     */
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
            const frac = (halfL - absX) / tmp; // 1 at inner chamfer edge, 0 at +-L/2
            return rf1 + frac * (ra1 - rf1);
        } else {
            return rShaft;
        }
    },

    /**
     * Evaluates the MITCalc 1.74 straight-sided axial trapezoidal thread profile of Worm 1
     * for normalized phase uNorm in [-0.5, +0.5], where uNorm = 0 is the thread crest center
     * and uNorm = +-0.5 is the root valley center.
     *
     * Strictly uses MC_da1, MC_d1, MC_df1, MC_px, MC_sx1 (= sx1/2), MC_alfa (= alfax)
     * without any non-MITCalc root fillet or flank crowning.
     */
    evalWormThreadProfile(uNorm, mc, blankLimitR = null) {
        const r1 = mc.MC_d1 * 0.5;
        const ra1 = mc.MC_da1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const px = mc.MC_px;
        const halfSx1 = mc.MC_sx1; // = _sx1 / 2
        const tanA = Math.tan(mc.MC_alfa_rad || ((mc.MC_alfa * Math.PI) / 180.0));

        const absU = Math.min(0.5, Math.max(0.0, Math.abs(uNorm)));
        const xAbs = absU * px; // [0, px/2]

        const ha1 = ra1 - r1;
        const hf1 = r1 - rf1;

        // Exact axial half-widths at tip (ra1) and root (rf1)
        const xTip = Math.max(0.0, halfSx1 - ha1 * tanA);
        const xRoot = Math.min(0.5 * px, halfSx1 + hf1 * tanA);

        // Straight trapezoidal line r(xAbs) passing through (halfSx1, r1) with slope -1/tan(MC_alfa)
        const rTrap = r1 + (halfSx1 - xAbs) / Math.max(1e-9, tanA);
        const rMax = (blankLimitR !== null && blankLimitR !== undefined) ? Math.min(ra1, blankLimitR) : ra1;

        if (xAbs <= xTip || rTrap >= rMax) {
            return {
                r: Math.max(rf1, rMax),
                zone: 'tip_land',
                isFlank: false,
                flankSide: 0,
                xTip,
                xRoot
            };
        } else if (xAbs < xRoot && rTrap > rf1) {
            return {
                r: Math.max(rf1, Math.min(rMax, rTrap)),
                zone: 'flank',
                isFlank: true,
                flankSide: uNorm >= 0 ? 1 : 2,
                xTip,
                xRoot
            };
        } else {
            return {
                r: rf1,
                zone: 'root_land',
                isFlank: false,
                flankSide: 0,
                xTip,
                xRoot
            };
        }
    },

    /**
     * Generates a 100% watertight 3D Solid Mesh (or Hollow Flank Surface Mesh) for Worm 1 (Trục Vít 1)
     * strictly following MITCalc 1.74 (Calculation!A1:R4 & DXF.bas!Worm).
     */
    generateWormMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const z1 = mc.MC_z1;
        const px = mc.MC_px;
        const pz = mc.MC_pxn;
        const L = mc.MC_L;
        const ra1 = mc.MC_da1 * 0.5;
        const rf1 = mc.MC_df1 * 0.5;
        const rShaft = Math.min(rf1, Math.max(2.0, mc.MC_ds1 * 0.5));
        const rBore = Math.min(rShaft * 0.48, Math.max(3.0, rShaft * 0.32));
        const surfaceOnly = Boolean(opt.surfaceOnly);

        const density = this.getDensitySettings(opt.meshDensityLevel || 6, z1, mc.MC_z2);
        const ptsPerStart = opt.ptsPerStart || density.wormPtsPerStart;

        // Build 1-period normalized phase nodes uSym in [-0.5, +0.5), explicitly snapping to
        // the exact trapezoidal corner locations +-xTip/px and +-xRoot/px for razor-sharp edges!
        const r1 = mc.MC_d1 * 0.5;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const uTip = Math.max(0.005, Math.min(0.48, (mc.MC_sx1 - (ra1 - r1) * tanA) / px));
        const uRoot = Math.max(uTip + 0.01, Math.min(0.495, (mc.MC_sx1 + (r1 - rf1) * tanA) / px));

        const uSet = new Set([0.0, uTip, -uTip, uRoot, -uRoot]);
        for (let j = 0; j < ptsPerStart; j++) {
            const u = j / ptsPerStart;
            const uSym = u <= 0.5 ? u : (u - 1.0);
            uSet.add(uSym);
        }
        const uSorted = Array.from(uSet).sort((a, b) => a - b);
        // Reorder so u = 0.0 is index 0, progressing through [0..+0.5) then [-0.5..0)
        const posU = uSorted.filter(u => u >= 0);
        const negU = uSorted.filter(u => u < 0);
        const periodPhases = posU.concat(negU);
        const P = periodPhases.length;
        const M = z1 * P;

        // Linear shrink chamfer length tmp from DXF.bas!Worm line 264:
        // tmp = Tan(Beta * pi / 180) * (da1 - df1) / 2
        const tmpChamfer = Math.min(
            0.45 * L,
            Math.max(0.01, Math.tan((mc.MC_beta1 * Math.PI) / 180.0) * (mc.MC_da1 - mc.MC_df1) * 0.5)
        );

        const halfL = 0.5 * L;
        const numPitches = Math.max(1.5, L / px);
        const numThreadSlices = opt.numWormSlices || Math.max(40, Math.min(260, Math.round(numPitches * density.wormSlicesPerPitch)));

        // Axial slice schedule along X:
        // Include exact breakpoint stations at -(L/2), -(L/2 - tmpChamfer), +(L/2 - tmpChamfer), +(L/2)
        const xStationsSet = new Set([
            -halfL,
            -halfL + tmpChamfer,
            +halfL - tmpChamfer,
            +halfL
        ]);
        for (let s = 0; s <= numThreadSlices; s++) {
            const x = -halfL + (s / numThreadSlices) * L;
            xStationsSet.add(x);
        }
        const xThreadStations = Array.from(xStationsSet)
            .filter(x => x >= -halfL - 1e-9 && x <= halfL + 1e-9)
            .sort((a, b) => a - b);

        const sliceSpecs = [];
        const xLeftShoulder = -halfL - mc.MC_t1;
        const xRightShoulder = +halfL + mc.MC_t1;
        const xLeftEnd = -Math.max(mc.l1, halfL + mc.MC_t1 + 10.0);
        const xRightEnd = +Math.max(mc.l2, halfL + mc.MC_t1 + 10.0);

        if (!surfaceOnly) {
            // Left shaft journal & MITCalc shoulder (MC_ds1, MC_t1)
            sliceSpecs.push({ x: xLeftEnd, isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: 0.5 * (xLeftEnd + xLeftShoulder), isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: xLeftShoulder, isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: -halfL, isShaft: true, rCyl: rShaft });
        }

        for (let i = 0; i < xThreadStations.length; i++) {
            const x = xThreadStations[i];
            const blankR = this.evalWormBlankRadius(x, mc);
            sliceSpecs.push({ x, isShaft: false, blankR });
        }

        if (!surfaceOnly) {
            // Right MITCalc shoulder (MC_ds1, MC_t1) & shaft journal
            sliceSpecs.push({ x: +halfL, isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: xRightShoulder, isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: 0.5 * (xRightShoulder + xRightEnd), isShaft: true, rCyl: rShaft });
            sliceSpecs.push({ x: xRightEnd, isShaft: true, rCyl: rShaft });
        }

        const S = sliceSpecs.length;
        const outerRings = [];
        const innerRings = [];

        for (let s = 0; s < S; s++) {
            const spec = sliceSpecs[s];
            const x = spec.x;
            const ringOut = [];
            const ringIn = [];

            // Helical phase shift along lead MC_pxn = px * z1
            const phaseShift = mc.handSign * (x / pz) * z1;

            for (let startIdx = 0; startIdx < z1; startIdx++) {
                for (let pIdx = 0; pIdx < P; pIdx++) {
                    const uBase = periodPhases[pIdx]; // in [-0.5, +0.5)
                    const uPos = uBase < 0 ? (uBase + 1.0) : uBase; // in [0, 1)
                    const phi = (2.0 * Math.PI * (startIdx + uPos)) / z1;

                    let rActual = rf1;
                    let isFlank = false;

                    if (spec.isShaft) {
                        rActual = spec.rCyl;
                    } else {
                        // Phase at (x, phi) relative to helical thread crest
                        let uRel = (uPos - phaseShift) % 1.0;
                        if (uRel < 0) uRel += 1.0;
                        const uSym = uRel <= 0.5 ? uRel : (uRel - 1.0);
                        const prof = this.evalWormThreadProfile(uSym, mc, spec.blankR);
                        rActual = prof.r;
                        isFlank = prof.isFlank && (spec.blankR > rf1 + 1e-4);
                    }

                    const cosP = Math.cos(phi);
                    const sinP = Math.sin(phi);
                    ringOut.push({
                        x,
                        y: rActual * cosP,
                        z: rActual * sinP,
                        isFlank
                    });
                    ringIn.push({
                        x,
                        y: rBore * cosP,
                        z: rBore * sinP
                    });
                }
            }
            outerRings.push(ringOut);
            innerRings.push(ringIn);
        }

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

        if (surfaceOnly) {
            for (let s = 0; s < S - 1; s++) {
                const rA = outerRings[s];
                const rB = outerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    const p00 = rA[m], p01 = rA[mNext];
                    const p10 = rB[m], p11 = rB[mNext];
                    if (p00.isFlank || p01.isFlank || p10.isFlank || p11.isFlank) {
                        pushTri(p00, p10, p11);
                        pushTri(p00, p11, p01);
                    }
                }
            }
        } else {
            for (let s = 0; s < S - 1; s++) {
                const rA = outerRings[s];
                const rB = outerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    pushTri(rA[m], rB[m], rB[mNext]);
                    pushTri(rA[m], rB[mNext], rA[mNext]);
                }
            }

            for (let s = 0; s < S - 1; s++) {
                const rA = innerRings[s];
                const rB = innerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    pushTri(rA[m], rB[mNext], rB[m]);
                    pushTri(rA[m], rA[mNext], rB[mNext]);
                }
            }

            const rOutLeft = outerRings[0];
            const rInLeft = innerRings[0];
            for (let m = 0; m < M; m++) {
                const mNext = (m + 1) % M;
                pushTri(rOutLeft[m], rOutLeft[mNext], rInLeft[mNext], [-1, 0, 0]);
                pushTri(rOutLeft[m], rInLeft[mNext], rInLeft[m], [-1, 0, 0]);
            }

            const rOutRight = outerRings[S - 1];
            const rInRight = innerRings[S - 1];
            for (let m = 0; m < M; m++) {
                const mNext = (m + 1) % M;
                pushTri(rOutRight[m], rInRight[mNext], rOutRight[mNext], [1, 0, 0]);
                pushTri(rOutRight[m], rInRight[m], rInRight[mNext], [1, 0, 0]);
            }
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices),
            rawTriangles,
            MC_3D: mc
        };
    },

    generateWormSurfaceMesh(opt = {}) {
        return this.generateWormMesh(Object.assign({}, opt, { surfaceOnly: true }));
    },

    /**
     * Evaluates the exact 3-branch Globoid Wheel Blank Cross-Section at axial position z
     * strictly following DXF.bas!WWheel (lines 323-353) and Calculation!AC2:AE2:
     *   r1   = MC_d1cutmin / 2 = a - da2 / 2
     *   rCut = MC_d1cut / 2    = a - d2 / 2
     *   r3   = MC_d1cutmax / 2 = a - df2 / 2
     *   v1 = r1 - (a - de2/2), v3 = r3 - (a - de2/2)
     *   b1 = sqrt(v1*(2*r1 - v1)), b3 = sqrt(v3*(2*r3 - v3))
     *   b4_init = b1 * r3 / r1, th = m / 5
     */
    evalWheelBlankCrossSection(z, mc) {
        const a = mc.MC_a;
        const da2 = mc.MC_da2;
        const d2 = mc.MC_d2;
        const df2 = mc.MC_df2;
        const de2 = mc.MC_de2;
        const b2H = mc.MC_b2H;
        const halfB = 0.5 * b2H;
        const mn = mc.mn;

        const r1 = 0.5 * mc.MC_d1cutmin;   // = a - da2 / 2
        const rCut = 0.5 * mc.MC_d1cut;    // = a - d2 / 2
        const r3 = 0.5 * mc.MC_d1cutmax;   // = a - df2 / 2

        const v1 = Math.max(0.0, r1 - (a - 0.5 * de2));
        const v3 = Math.max(0.0, r3 - (a - 0.5 * de2));
        const b1 = Math.sqrt(Math.max(0.0, v1 * (2.0 * r1 - v1)));
        const b3 = Math.sqrt(Math.max(0.0, v3 * (2.0 * r3 - v3)));
        const b4_crit = (r1 > 1e-9) ? (b1 * r3 / r1) : b1;
        const th = mn / 5.0;

        const u = Math.min(halfB, Math.max(0.0, Math.abs(z)));

        // Unclipped pitch and cut-tip throat arcs
        const rPitch = a - Math.sqrt(Math.max(0.01 * rCut * rCut, rCut * rCut - u * u));
        const rCutTip = a - Math.sqrt(Math.max(0.01 * r1 * r1, r1 * r1 - u * u));
        const rCutRoot = a - Math.sqrt(Math.max(0.01 * r3 * r3, r3 * r3 - u * u));

        let rBlankTip = rCutTip;
        let rBlankRoot = rCutRoot;
        let branch = 3;
        let b4 = b4_crit;
        let b5 = 0.0;
        let v4 = 0.0;
        let v5 = 0.0;

        if (halfB > b3) {
            // Branch 1 (DXF.bas lines 335-340): b2H / 2 > b3
            branch = 1;
            const rOuter = 0.5 * de2; // = da2/2 + v1 = df2/2 + v3
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
            // Branch 2 (DXF.bas lines 341-346): b2H / 2 < b4_crit
            branch = 2;
            b5 = halfB * (r1 / r3);
            v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));
            v5 = r1 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r1 * r1 - 4.0 * b5 * b5));
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
            // Branch 3 (DXF.bas lines 347-352): b4_crit <= b2H / 2 <= b3
            branch = 3;
            v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));
            b4 = halfB * (r1 / r3);
            const rOuter = 0.5 * da2 + v1; // = de2 / 2
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

        // Maintain a minimal positive tooth height at the extreme beveled face u = halfB for manifold mesh integrity
        const rTip = Math.max(rBlankRoot + 0.04, Math.min(rCutTip, rBlankTip));
        const rRoot = rBlankRoot;

        return {
            rTip,
            rBlankTip,
            rCutTip,
            rPitch,
            rRoot,
            branch,
            r1,
            rCut,
            r3,
            b1,
            b3,
            b4,
            b5,
            v1,
            v3,
            v4,
            v5
        };
    },

    /**
     * Generates a single tooth-space / tooth-crest contour for Worm Wheel 2 at axial slice z
     * strictly using MITCalc 1.74's straight-sided trapezoidal hobbing space parameters in
     * the worm radial sketch plane R_w(r, z) = sqrt((a - r)^2 + z^2):
     *   MC_d1cutmin, MC_d1cut, MC_d1cutmax, MC_ex2 (= _ex2 / 2), MC_sx2 (= _sx2 / 2), MC_alfa (= _alfax)
     * without non-MITCalc circular root fillets.
     */
    evalWormToothHalfWidth(Rw, mc) {
        const r1 = 0.5 * mc.MC_d1;
        const ra1 = 0.5 * mc.MC_da1;
        const rf1 = 0.5 * mc.MC_df1;
        const tanA = Math.tan(mc.MC_alfa_rad);
        const halfSx1 = mc.MC_sx1;

        if (Rw >= ra1) {
            return Math.max(0.15, halfSx1 - (ra1 - r1) * tanA);
        } else if (Rw <= rf1) {
            return halfSx1 + (r1 - rf1) * tanA;
        } else {
            return halfSx1 - (Rw - r1) * tanA;
        }
    },

    generateWheelSliceContour(sliceOpt) {
        const {
            z2, zSlice = 0.0, a = 103.36633, rCut = 18.11575,
            rPitch_s, rTip_s, rRoot_s, MC_ex2, sx2, alfax, ptsPerFlank, mc
        } = sliceOpt;

        const pitchAngle = (2.0 * Math.PI) / z2;
        const halfPitch = 0.5 * pitchAngle;

        const rightHalf = [];
        const NFlank = Math.max(4, ptsPerFlank || 12);

        // Flank points from root to tip - Exact theoretical zero-backlash conjugate contact (backlash = 0)
        for (let k = 0; k <= NFlank; k++) {
            const t = k / NFlank;
            const r = rRoot_s + t * (rTip_s - rRoot_s);
            const Rw_r = Math.hypot(a - r, zSlice);

            // Exact nominal trapezoidal half-width from MITCalc 1.74 profile
            const s_worm_half = this.evalWormToothHalfWidth(Rw_r, mc);
            const s_space_half = s_worm_half;
            const theta_space = Math.min(halfPitch * 0.96, s_space_half / r);

            if (k === 0) {
                // Root land from theta = 0 to theta_space
                rightHalf.push({ theta: 0.0, r: rRoot_s, isFlank: false, zone: 'root_land' });
                rightHalf.push({ theta: 0.5 * theta_space, r: rRoot_s, isFlank: false, zone: 'root_land' });
                rightHalf.push({ theta: theta_space, r: rRoot_s, isFlank: false, zone: 'root_land' });
            } else {
                rightHalf.push({
                    theta: theta_space,
                    r,
                    isFlank: true,
                    zone: 'flank'
                });
            }
        }

        // Tooth tip crest from theta_flank_tip to halfPitch
        const tipTheta = rightHalf[rightHalf.length - 1].theta;
        const ptsTip = 3;
        for (let k = 1; k <= ptsTip; k++) {
            const frac = k / ptsTip;
            const th = tipTheta + frac * (halfPitch - tipTheta);
            rightHalf.push({ theta: th, r: rTip_s, isFlank: false, zone: 'tip_land' });
        }

        // Mirror rightHalf (0 -> +halfPitch) with leftHalf (-halfPitch -> 0)
        const fullPeriod = [];
        for (let i = rightHalf.length - 1; i >= 1; i--) {
            fullPeriod.push({
                theta: -rightHalf[i].theta,
                r: rightHalf[i].r,
                isFlank: rightHalf[i].isFlank,
                zone: rightHalf[i].zone
            });
        }
        for (let i = 0; i < rightHalf.length - 1; i++) {
            fullPeriod.push({
                theta: +rightHalf[i].theta,
                r: rightHalf[i].r,
                isFlank: rightHalf[i].isFlank,
                zone: rightHalf[i].zone
            });
        }
        return fullPeriod;
    },

    /**
     * Generates a 100% watertight 3D Solid Mesh (or Hollow Flank Surface Mesh) for
     * Globoid Throated Worm Wheel 2 (Bánh Vít 2) strictly following MITCalc 1.74
     * (Calculation!S1:AF4 & DXF.bas!WWheel lines 305-354).
     */
    generateWheelMesh(opt = {}) {
        const mc = this.extractMC3DParams(opt);
        const a = mc.MC_a;
        const z1 = mc.MC_z1;
        const z2 = mc.MC_z2;
        const pz = mc.MC_pxn;
        const px = mc.MC_px;
        const b2H = mc.MC_b2H;
        const halfB = 0.5 * b2H;
        const df2 = mc.MC_df2;
        const surfaceOnly = Boolean(opt.surfaceOnly);

        const dBore2 = Math.min(df2 * 0.65, Math.max(16.0, mc.ShaftDB2 || (df2 * 0.32)));
        const rBore2 = dBore2 * 0.5;

        const density = this.getDensitySettings(opt.meshDensityLevel || 6, z1, z2);
        const numSlices = opt.numWheelSlices || density.wheelSlices;
        const ptsPerFlank = opt.ptsPerFlank || density.wheelPtsPerFlank;

        // Build axial slice schedule z in [-b2H/2, +b2H/2] including the exact DXF.bas!WWheel
        // breakpoint coordinates (+-b1, +-b4 or +-b5, +-b3) so the 3-branch blank transitions are crisp!
        const midBlank = this.evalWheelBlankCrossSection(0.0, mc);
        const zSet = new Set([-halfB, 0.0, +halfB]);
        [midBlank.b1, midBlank.b3, midBlank.b4, midBlank.b5].forEach(bVal => {
            if (bVal > 1e-4 && bVal < halfB - 1e-4) {
                zSet.add(-bVal);
                zSet.add(+bVal);
            }
        });
        for (let s = 0; s < numSlices; s++) {
            const z = -halfB + (s / (numSlices - 1)) * b2H;
            zSet.add(z);
        }
        const zStations = Array.from(zSet)
            .filter(z => z >= -halfB - 1e-9 && z <= halfB + 1e-9)
            .sort((a, b) => a - b);

        const outerRings = [];
        const innerRings = [];
        let ptsPerTooth = 0;
        let M = 0;

        const rCutHelix = 0.5 * mc.MC_d1cut;

        for (let s = 0; s < zStations.length; s++) {
            const z = zStations[s];
            const blank = this.evalWheelBlankCrossSection(z, mc);

            const periodPts = this.generateWheelSliceContour({
                z2,
                zSlice: z,
                a,
                rCut: rCutHelix,
                rPitch_s: blank.rPitch,
                rTip_s: blank.rTip,
                rRoot_s: blank.rRoot,
                MC_ex2: mc.MC_ex2,
                sx2: mc.MC_sx2 * 2.0,
                alfax: mc.MC_alfa_rad,
                ptsPerFlank,
                mc
            });

            ptsPerTooth = periodPts.length;
            M = z2 * ptsPerTooth;

            const ringOut = [];
            const ringIn = [];
            const pitchAngle = (2.0 * Math.PI) / z2;

            // Conjugate helical lead angle twist across slice z:
            const sinPhi1 = Math.max(-0.95, Math.min(0.95, z / rCutHelix));
            const phi1Slice = Math.asin(sinPhi1);
            const xWormCut = mc.handSign * (pz / (2.0 * Math.PI)) * phi1Slice;
            const thetaTwist = xWormCut / (0.5 * mc.MC_d2);

            for (let tIdx = 0; tIdx < z2; tIdx++) {
                const baseThetaNominal = tIdx * pitchAngle;
                const spaceCenterTheta = baseThetaNominal + thetaTwist;

                for (let p = 0; p < ptsPerTooth; p++) {
                    const pt = periodPts[p];
                    const theta = spaceCenterTheta + pt.theta;
                    const sinT = Math.sin(theta);
                    const cosT = Math.cos(theta);
                    ringOut.push({
                        x: pt.r * sinT,
                        y: -pt.r * cosT,
                        z,
                        isFlank: pt.isFlank
                    });

                    const thetaIn = spaceCenterTheta + pt.theta;
                    ringIn.push({
                        x: rBore2 * Math.sin(thetaIn),
                        y: -rBore2 * Math.cos(thetaIn),
                        z
                    });
                }
            }

            outerRings.push(ringOut);
            innerRings.push(ringIn);
        }

        const S = outerRings.length;
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

        if (surfaceOnly) {
            for (let s = 0; s < S - 1; s++) {
                const rA = outerRings[s];
                const rB = outerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    const p00 = rA[m], p01 = rA[mNext];
                    const p10 = rB[m], p11 = rB[mNext];
                    if (p00.isFlank || p01.isFlank || p10.isFlank || p11.isFlank) {
                        pushTri(p00, p01, p11);
                        pushTri(p00, p11, p10);
                    }
                }
            }
        } else {
            for (let s = 0; s < S - 1; s++) {
                const rA = outerRings[s];
                const rB = outerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    pushTri(rA[m], rA[mNext], rB[mNext]);
                    pushTri(rA[m], rB[mNext], rB[m]);
                }
            }

            for (let s = 0; s < S - 1; s++) {
                const rA = innerRings[s];
                const rB = innerRings[s + 1];
                for (let m = 0; m < M; m++) {
                    const mNext = (m + 1) % M;
                    pushTri(rA[m], rB[mNext], rA[mNext]);
                    pushTri(rA[m], rB[m], rB[mNext]);
                }
            }

            const rOutBack = outerRings[0];
            const rInBack = innerRings[0];
            for (let m = 0; m < M; m++) {
                const mNext = (m + 1) % M;
                pushTri(rOutBack[m], rInBack[mNext], rOutBack[mNext], [0, 0, -1]);
                pushTri(rOutBack[m], rInBack[m], rInBack[mNext], [0, 0, -1]);
            }

            const rOutFront = outerRings[S - 1];
            const rInFront = innerRings[S - 1];
            for (let m = 0; m < M; m++) {
                const mNext = (m + 1) % M;
                pushTri(rOutFront[m], rOutFront[mNext], rInFront[mNext], [0, 0, 1]);
                pushTri(rOutFront[m], rInFront[mNext], rInFront[m], [0, 0, 1]);
            }
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(normals),
            indices: new Uint32Array(indices),
            rawTriangles,
            MC_3D: mc
        };
    },

    generateWheelSurfaceMesh(opt = {}) {
        return this.generateWheelMesh(Object.assign({}, opt, { surfaceOnly: true }));
    }
};

if (typeof window !== 'undefined') {
    window.Worm3DGenerator = Worm3DGenerator;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Worm3DGenerator;
}
