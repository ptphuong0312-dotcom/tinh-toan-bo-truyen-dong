/**
 * MITCalc Web App - Worm Gear Geometry, Kinematics & Efficiency Engine (Module 3)
 * Standards: DIN 3975, DIN 3996 (1998 & 2005), AGMA 6022-C93
 * 100% Cell-by-Cell Math Match with MITCalc 1.74 (C:\MITCalc\gear4\Gear4_01.xlsb)
 * ZERO-FORCE SCOPE: Strictly geometric, kinematic, efficiency/self-locking, AGMA, and CAD calculations.
 */

const WormCalcEngine = {
    getWormMaterial(matP) {
        const id = parseInt(matP) || 41;
        const db = (typeof MATERIALS_DB !== 'undefined') ? MATERIALS_DB : ((typeof Materials !== 'undefined') ? Materials : []);
        const found = db.find(m => m.id === id);
        if (found) {
            return {
                id: found.id,
                name: found.name,
                designation: (found.standards && (found.standards.din || found.standards.en || found.standards.iso)) || found.standard || found.name,
                density: found.density || 7870.0,
                elasticModulus: found.elasticModulus || 206.0,
                poissonRatio: found.poissonRatio || 0.3,
                rm: found.rm || 785.0,
                rp02: found.rp02 || 588.0,
                shlim: found.shlim || 1270.0,
                sflim: found.sflim || 700.0,
                vhv: found.surfaceHardnessHV || 650.0,
                jhv: found.coreHardnessHV || 250.0,
                nhlim: found.nhlim || 100000000.0,
                nflim: found.nflim || 3000000.0,
                qh: found.qh || 10.0,
                qf: found.qf || 9.0
            };
        }
        return {
            id: 41,
            name: "Alloy structural steel",
            designation: "16MnCr5",
            density: 7870.0,
            elasticModulus: 206.0,
            poissonRatio: 0.3,
            rm: 785.0,
            rp02: 588.0,
            shlim: 1270.0,
            sflim: 700.0,
            vhv: 650.0,
            jhv: 250.0,
            nhlim: 100000000.0,
            nflim: 3000000.0,
            qh: 10.0,
            qf: 9.0
        };
    },

    getWheelMaterial(matW) {
        const id = parseInt(matW) || 7;
        const db = (typeof WORM_WHEEL_MATERIALS !== 'undefined') ? WORM_WHEEL_MATERIALS : [];
        const found = db.find(m => m.id === id);
        if (found) return found;
        return {
            id: 7,
            fullName: "Bronze (centrifugal cast) CuSn12Ni2-C-GZ (DIN EN 1982) (Rm=300 MPa)",
            name: "Bronze (centrifugal cast)",
            designation: "CuSn12Ni2-C-GZ (DIN EN 1982)",
            density: 8800.0,
            matTypeW: 1,
            rm: 300.0,
            rp02: 180.0,
            coreHardnessHV: 230.0,
            surfaceHardnessHV: 230.0,
            shlim: 510.0,
            sflim: 325.0,
            nhlim: 50000000.0,
            nflim: 3000000.0,
            qh: 10.0,
            qf: 6.0,
            elasticModulus: 98.1,
            poissonRatio: 0.35,
            wml: [1.0, 1.0, 1.75],
            yw: 0.95,
            sigmaHlimT: 520.0,
            tauFlimT: 100.0
        };
    },

    calculate(p = {}) {
        // 1.0 Basic Input Parameters (Rows 117-123)
        const poweredWoWh = parseInt(p.poweredWoWh !== undefined ? p.poweredWoWh : 1); // 1=Worm driving, 2=Gear driving
        const Pw2 = (p.Pw2 !== undefined && p.Pw2 !== null && String(p.Pw2).trim() !== '') ? parseFloat(p.Pw2) : 3.0;
        const n1 = (p.n1 !== undefined && p.n1 !== null && String(p.n1).trim() !== '') ? parseFloat(p.n1) : 1500.0;
        const iin = (p.iin !== undefined && p.iin !== null && String(p.iin).trim() !== '') ? parseFloat(p.iin) : 40.0;

        // 2.0 Material, Loading, Lubrication & Production Parameters (Rows 126-139)
        const matP = parseInt(p.matP !== undefined ? p.matP : 41);
        const matW = parseInt(p.matW !== undefined ? p.matW : 7);
        const wormMat = this.getWormMaterial(matP);
        const wheelMat = this.getWheelMaterial(matW);
        const MatTypeW = wheelMat.matTypeW || 1; // X128: 1=Bronze, 2=Cast Iron, 3=Al Bronze

        const toothType = parseInt(p.toothType !== undefined ? p.toothType : 2); // 1=ZA, 2=ZN, 3=ZI, 4=ZK, 5=ZH
        const loadTypeA = parseInt(p.loadTypeA !== undefined ? p.loadTypeA : 1); // 1..4
        const loadTypeB = parseInt(p.loadTypeB !== undefined ? p.loadTypeB : 1); // 1..4
        const designCooling = parseInt(p.designCooling !== undefined ? p.designCooling : 1); // 1=Worm bath, 2=Gear bath, 3=Oil-spray
        const oilType = parseInt(p.oilType !== undefined ? p.oilType : 3); // 1=Mineral, 2=PAO, 3=PEG
        const lubricant = parseInt(p.lubricant !== undefined ? p.lubricant : 6); // 1..10 (6=ISO VG 220)

        const ny40 = (p.ny40 !== undefined && p.ny40 !== null && String(p.ny40).trim() !== '') ? parseFloat(p.ny40) : 220.0;
        const ny100 = (p.ny100 !== undefined && p.ny100 !== null && String(p.ny100).trim() !== '') ? parseFloat(p.ny100) : 40.0;
        const rooil15 = (p.rooil15 !== undefined && p.rooil15 !== null && String(p.rooil15).trim() !== '') ? parseFloat(p.rooil15) : 1.06;
        const Ra1 = (p.Ra1 !== undefined && p.Ra1 !== null && String(p.Ra1).trim() !== '') ? parseFloat(p.Ra1) : 0.5;

        const kaTable = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_KAcoef)
            ? WORM_STD_TABLES.T_KAcoef
            : [[1.0, 1.25, 1.5, 1.75], [1.1, 1.35, 1.6, 1.85], [1.25, 1.5, 1.75, 2.0], [1.5, 1.75, 2.0, 2.25]];
        const KA_Prop = (kaTable[loadTypeA - 1] && kaTable[loadTypeA - 1][loadTypeB - 1]) || 1.0;
        const kaFlag = (p.kaFlag !== undefined) ? Boolean(p.kaFlag) : true;
        const KA = kaFlag ? KA_Prop : ((p.KA !== undefined && String(p.KA).trim() !== '') ? parseFloat(p.KA) : KA_Prop);
        const Lh = (p.Lh !== undefined && p.Lh !== null && String(p.Lh).trim() !== '') ? parseFloat(p.Lh) : 25000.0;

        // 3.0 Parameters of the Tooth Profile (Rows 147-150)
        const haXP = (p.haXP !== undefined && p.haXP !== null && String(p.haXP).trim() !== '') ? parseFloat(p.haXP) : 1.0;
        const haXG = haXP;
        const caXP = (p.caXP !== undefined && p.caXP !== null && String(p.caXP).trim() !== '') ? parseFloat(p.caXP) : 0.25;
        const caXG = caXP;
        const alfa_temp = (p.alfa_temp !== undefined && p.alfa_temp !== null && String(p.alfa_temp).trim() !== '') ? parseFloat(p.alfa_temp) : 20.0;
        const alfa0 = alfa_temp; // X222
        const rf1_rec = caXG / (1.0 - Math.sin((alfa0 * Math.PI) / 180.0)); // O149
        const rf1Flag = (p.rf1Flag !== undefined) ? Boolean(p.rf1Flag) : true; // B149
        const rf1 = rf1Flag ? rf1_rec : ((p.rf1 !== undefined && String(p.rf1).trim() !== '') ? parseFloat(p.rf1) : rf1_rec); // O150
        const rf2 = rf1; // X150

        // 4.0 Design of a Geometry of Toothing (Rows 160-185)
        const z1 = Math.max(1, parseInt(p.z1 !== undefined ? p.z1 : 1)); // O161
        // T161: _z2 = INT(_iin * _z1 + 0.5)
        const z2 = (p.z2_direct !== undefined && p.z2_direct !== null) ? parseInt(p.z2_direct) : Math.floor(iin * z1 + 0.5);
        const i = z2 / z1; // O123
        const i_dev = (i - iin) / i; // P123
        const i_dev_pct = i_dev * 100.0;
        const n2 = n1 / i; // P120

        const m_Input = (p.m_Input !== undefined && p.m_Input !== null && String(p.m_Input).trim() !== '') ? parseFloat(p.m_Input) : (25.4 / 6.0); // O167 (4.233333333333333)
        const m_temp = m_Input; // T167 (SI)
        const CP = (m_temp * Math.PI) / 25.4; // O168
        const DP = 25.4 / m_temp; // P168

        const teethOrientation = parseInt(p.teethOrientation !== undefined ? p.teethOrientation : 1); // 1=Right, 2=Left
        const calc_q = parseInt(p.calc_q !== undefined ? p.calc_q : 1); // F163: 1=q input, 2=d1 input, 3=gama input

        let q = (p.q !== undefined && p.q !== null && String(p.q).trim() !== '') ? parseFloat(p.q) : 8.5;
        let d1_Input = (p.d1_Input !== undefined && p.d1_Input !== null && String(p.d1_Input).trim() !== '') ? parseFloat(p.d1_Input) : 36.23149719358681;
        let gama = (p.gama !== undefined && p.gama !== null && String(p.gama).trim() !== '') ? parseFloat(p.gama) : 6.709836807756933;

        let mn, mx, d1;
        if (calc_q === 1) {
            // Mode 1: q is input -> compute gama and d1
            gama = (Math.atan(z1 / q) * 180.0) / Math.PI; // X165
            const gama_rad_1 = (gama * Math.PI) / 180.0;
            if (toothType === 1) {
                mx = m_temp;
                mn = mx * Math.cos(gama_rad_1);
                d1 = (mx * z1) / Math.tan(gama_rad_1);
            } else {
                mn = m_temp;
                mx = mn / Math.cos(gama_rad_1);
                d1 = (mn * z1) / Math.sin(gama_rad_1);
            }
            d1_Input = d1;
        } else if (calc_q === 2) {
            // Mode 2: d1 is input -> compute q and gama via exact CellTransmitVal fixed-point
            d1 = d1_Input;
            if (toothType === 1) {
                mx = m_temp;
                q = d1 / mx;
                gama = (Math.atan(z1 / q) * 180.0) / Math.PI;
                mn = mx * Math.cos((gama * Math.PI) / 180.0);
            } else {
                mn = m_temp;
                for (let iter = 0; iter < 40; iter++) {
                    mx = mn / Math.cos((gama * Math.PI) / 180.0);
                    q = d1 / mx;
                    gama = (Math.atan(z1 / q) * 180.0) / Math.PI;
                }
                mx = mn / Math.cos((gama * Math.PI) / 180.0);
                q = d1 / mx;
            }
        } else {
            // Mode 3: gama is input -> compute d1 and q
            const gama_rad_3 = (gama * Math.PI) / 180.0;
            if (toothType === 1) {
                mx = m_temp;
                mn = mx * Math.cos(gama_rad_3);
                d1 = (mx * z1) / Math.tan(gama_rad_3);
            } else {
                mn = m_temp;
                mx = mn / Math.cos(gama_rad_3);
                d1 = (mn * z1) / Math.sin(gama_rad_3);
            }
            d1_Input = d1;
            q = d1 / mx;
        }

        const gama_rad = (gama * Math.PI) / 180.0;
        const q_calc = d1 / mx; // X163
        const d1_calc = (toothType === 1) ? ((mx * z1) / Math.tan(gama_rad)) : ((mn * z1) / Math.sin(gama_rad)); // X164
        const gama_calc = (Math.atan(z1 / q) * 180.0) / Math.PI; // X165

        // Recommended q and d1 (X160, Y160)
        const q_rec = 2.0 * (1.4 + 2.0 * Math.sqrt(z1)); // X160
        const d1_rec = Math.round(q_rec * m_temp * 100.0) / 100.0; // Y160

        // 5.0 Basic Dimensions of Gearing (DIN 3975) (Rows 220-238)
        const mt = mn / Math.sin(gama_rad); // U220
        const pn = Math.PI * mn; // T221
        const pt = pn / Math.sin(gama_rad); // U221
        const px = pt * Math.tan(gama_rad); // V221

        // Pressure angles (Row 222)
        const alfax = (toothType === 1)
            ? alfa_temp
            : (Math.atan(Math.tan((alfa_temp * Math.PI) / 180.0) / Math.cos(gama_rad)) * 180.0) / Math.PI; // P222
        const alfan = (toothType === 1)
            ? (Math.atan(Math.tan((alfax * Math.PI) / 180.0) * Math.cos(gama_rad)) * 180.0) / Math.PI
            : alfa_temp; // M222
        const alfat = (Math.atan(Math.tan((alfan * Math.PI) / 180.0) / Math.sin(gama_rad)) * 180.0) / Math.PI; // O222

        const x1 = 0.0; // X172
        const x2 = (p.x2 !== undefined && p.x2 !== null && String(p.x2).trim() !== '') ? parseFloat(p.x2) : 0.0; // O173

        // Diameters (Rows 224-228)
        const d2 = (toothType === 1) ? (mx * z2) : ((mn * z2) / Math.cos(gama_rad)); // U225
        const da1 = (toothType === 1) ? (d1 + 2.0 * mx * (haXP + x1)) : (d1 + 2.0 * mn * (haXP + x1)); // T224
        const da2 = (toothType === 1) ? (d2 + 2.0 * mx * (haXG + x2)) : (d2 + 2.0 * mn * (haXG + x2)); // U224
        const df1 = (toothType === 1) ? (d1 - 2.0 * mx * (haXP + caXP)) : (d1 - 2.0 * mn * (haXP + caXP)); // T226
        const df2 = (toothType === 1) ? (d2 - 2.0 * mx * (haXG + caXG - x2)) : (d2 - 2.0 * mn * (haXG + caXG - x2)); // U226
        const dw1 = (toothType === 1) ? (d1 + 2.0 * mx * x2) : (d1 - 2.0 * mn * x2); // T227
        const dw2 = (toothType === 1) ? (d2 + 2.0 * mx * x1) : (d2 + 2.0 * mn * x1); // U227
        const dm1 = q * mx; // T228
        const dm2 = mx * z2 + 2.0 * x2 * mx; // U228

        const ha1 = (da1 - d1) / 2.0; // T230
        const ha2 = (da2 - d2) / 2.0; // U230
        const hf1 = (d1 - df1) / 2.0; // T231
        const hf2 = (d2 - df2) / 2.0; // U231
        const a = (toothType === 1) ? (0.5 * (d1 + d2) + x2 * mx) : (0.5 * (d1 + d2) + x2 * mn); // T232

        // Bearing distances l1, l2 & Face widths L, b2H (Rows 169-172)
        const l1_proc = (p.l1_proc !== undefined && p.l1_proc !== null && String(p.l1_proc).trim() !== '') ? parseFloat(p.l1_proc) : 50.0; // O169
        const l2_proc = (p.l2_proc !== undefined && p.l2_proc !== null && String(p.l2_proc).trim() !== '') ? parseFloat(p.l2_proc) : 50.0; // P169
        const l1_Units = (da2 * l1_proc) / 100.0; // T169
        const l2_Units = (da2 * l2_proc) / 100.0; // U169
        const l1l2_flag = (p.l1l2_flag !== undefined) ? Boolean(p.l1l2_flag) : true; // B170
        const l1_input = l1l2_flag ? l1_Units : ((p.l1_input !== undefined && String(p.l1_input).trim() !== '') ? parseFloat(p.l1_input) : l1_Units); // O170
        const l2_input = l1l2_flag ? l2_Units : ((p.l2_input !== undefined && String(p.l2_input).trim() !== '') ? parseFloat(p.l2_input) : l2_Units); // P170
        const l1 = l1_input; // T170
        const l2 = l2_input; // U170

        const L_Proposal = (toothType === 1)
            ? ((z1 < 4) ? (11.0 + 0.06 * z2) * mx : (12.5 + 0.09 * z2) * mx)
            : ((z1 < 4) ? (11.0 + 0.06 * z2) * mn : (12.5 + 0.09 * z2) * mn); // P171
        const FlagL = (p.FlagL !== undefined) ? Boolean(p.FlagL) : true; // B171
        const L_Input = FlagL ? L_Proposal : ((p.L_Input !== undefined && String(p.L_Input).trim() !== '') ? parseFloat(p.L_Input) : L_Proposal); // O171
        const L = L_Input; // T171

        const b2H_Proposal = Math.round(((z1 < 4) ? 0.75 * (1.0 + 2.0 / q) * d1 : 0.67 * (1.0 + 2.0 / q) * d1) * 100.0) / 100.0; // P172
        const Flagb2H = (p.Flagb2H !== undefined) ? Boolean(p.Flagb2H) : true; // B172
        const b2H_Input = Flagb2H ? b2H_Proposal : ((p.b2H_Input !== undefined && String(p.b2H_Input).trim() !== '') ? parseFloat(p.b2H_Input) : b2H_Proposal); // O172
        const b2H = b2H_Input; // T172

        // Outside diameter of wormgear de2 (Rows 229, 231, 232)
        const X231 = Math.sqrt(Math.max(0.0, Math.pow(a - df2 / 2.0, 2) - Math.pow(b2H / 2.0, 2)));
        const Y231 = a - df2 / 2.0 - X231;
        const de2min = df2 + 2.0 * Y231 + 0.02 * mn; // Z231
        const AA231 = ((b2H / 2.0) * (a - da2 / 2.0)) / (a - df2 / 2.0);
        const AB231 = Math.sqrt(Math.max(0.0, Math.pow(a - da2 / 2.0, 2) - Math.pow(AA231, 2)));
        const AC231 = a - df2 / 2.0 - AB231;
        const de2max = df2 + 2.0 * AC231 - 0.02 * mn; // AD231
        const AA229 = da2 + mx;
        const de2Prop = Math.round(Math.min(Math.max(de2min, AA229), de2max) * 100.0) / 100.0; // Z229
        const de2Flag = (p.de2Flag !== undefined) ? Boolean(p.de2Flag) : true; // B229
        const de2Input = de2Flag ? de2Prop : ((p.de2Input !== undefined && String(p.de2Input).trim() !== '') ? parseFloat(p.de2Input) : de2Prop); // O229
        const de2 = de2Input; // U229
        const de2_range_str = `${(Math.round(de2min * 10.0) / 10.0).toFixed(1)}-${(Math.round(de2max * 10.0) / 10.0).toFixed(1)}`; // P229

        // Pitch angle on pitch diameter & Tooth thicknesses (Rows 234-238)
        const gamaw = (Math.atan((d1 / dw1) * Math.tan(gama_rad)) * 180.0) / Math.PI; // P234
        const gamab = (Math.acos(Math.cos(gama_rad) * Math.cos((alfan * Math.PI) / 180.0)) * 180.0) / Math.PI; // X234

        const sn1 = (toothType === 1) ? (0.5 * Math.PI * mx * Math.cos(gama_rad)) : (0.5 * Math.PI * mn); // T235
        const sx1 = (toothType === 1) ? (0.5 * Math.PI * mx) : ((0.5 * Math.PI * mn) / Math.cos(gama_rad)); // T236
        let sn2, sx2, en2, ex2;
        if (toothType === 1) {
            sx2 = 0.5 * Math.PI * mx + 2.0 * x2 * mx * Math.tan((alfax * Math.PI) / 180.0); // U236
            sn2 = sx2 * Math.cos(gama_rad); // U235
            ex2 = 0.5 * Math.PI * mx - 2.0 * x2 * mx * Math.tan((alfax * Math.PI) / 180.0); // U238
            en2 = ex2 * Math.cos(gama_rad); // U237
        } else {
            sn2 = 0.5 * Math.PI * mn + 2.0 * x2 * mn * Math.tan((alfan * Math.PI) / 180.0); // U235
            sx2 = sn2 / Math.cos(gama_rad); // U236
            en2 = 0.5 * Math.PI * mn - 2.0 * x2 * mn * Math.tan((alfan * Math.PI) / 180.0); // U237
            ex2 = en2 / Math.cos(gama_rad); // U238
        }
        const en1 = sn1; // T237
        const ex1 = sx1; // T238

        // Undercutting & Axis Distance Fitting Helpers (Rows 169-184)
        const z2minTh = (2.0 * haXP) / Math.pow(Math.sin((alfa_temp * Math.PI) / 180.0), 2); // X169
        const Y170 = (alfa_temp <= 15.0) ? 0.2 : ((alfa_temp >= 20.0) ? 0.3 : (((alfa_temp - 15.0) / 5.0) * 0.1 + 0.2));
        const z2minPr = (1.0 + Y170 / haXP) * z2minTh; // X170
        const xmin = Math.round(Math.max((haXP * (z2minPr - z2)) / z2minTh, -1.0) * 1000.0) / 1000.0; // X171
        const Flag_z2min = (z2 < z2minPr && x2 < xmin) ? 1 : 0; // U161

        const a_req1_Input = (p.a_req1_Input !== undefined && p.a_req1_Input !== null && String(p.a_req1_Input).trim() !== '') ? parseFloat(p.a_req1_Input) : 100.0; // O176
        const a_req1 = a_req1_Input; // T177
        const x_for_a = (toothType === 1)
            ? (a_req1 / mx - 0.5 * q - 0.5 * z2)
            : (a_req1 / mn - (0.5 * z1) / Math.sin(gama_rad) - (0.5 * z2) / Math.cos(gama_rad)); // X174
        const amin_dx = (toothType === 1) ? (0.5 * (d1 + d2) - 0.5 * mx) : (0.5 * (d1 + d2) - 0.5 * mn); // X175
        const amax_dx = (toothType === 1) ? (0.5 * (d1 + d2) + 1.0 * mx) : (0.5 * (d1 + d2) + 1.0 * mn); // Y175
        const Y176 = (a_req1_Input * 2.0) / (q + z2 + 2.0 * x2);
        const Z176 = (2.0 * a_req1_Input) / (z1 / Math.sin(gama_rad) + z2 / Math.cos(gama_rad) + x2);
        const m_for_a = (toothType === 1) ? Y176 : Z176; // X176
        const q_for_a = (toothType === 1)
            ? ((a_req1 - 0.5 * mx * z2 - mx * x2) / (0.5 * mx))
            : ((a_req1 - (0.5 * mn * z2) / Math.cos(gama_rad) - x2 * mn) / (0.5 * mx)); // X177

        const X183 = (Math.atan(z1 / 6.0) * 180.0) / Math.PI;
        const Y183 = mn / Math.cos((X183 * Math.PI) / 180.0);
        const Z183 = 0.5 * (Y183 * 6.0 + (mn * z2) / Math.cos((X183 * Math.PI) / 180.0) + 2.0 * x2 * mn);
        const X184 = (Math.atan(z1 / 25.0) * 180.0) / Math.PI;
        const Y184 = mn / Math.cos((X184 * Math.PI) / 180.0);
        const Z184 = 0.5 * (Y184 * 25.0 + (mn * z2) / Math.cos((X184 * Math.PI) / 180.0) + 2.0 * x2 * mn);
        const amin_q = (toothType === 1) ? (0.5 * mx * (6.0 + z2 + 2.0 * x2)) : Z183; // Y177
        const amax_q = (toothType === 1) ? (0.5 * mx * (25.0 + z2 + 2.0 * x2)) : Z184; // Z177

        // 6.0 Efficiency and Losses (DIN 3996) (Rows 240-255)
        const Mk2 = (30.0 / Math.PI) * (Pw2 / n1) * (z2 / z1) * 1000.0; // U121
        const T2 = Mk2 * KA; // Y259
        const vgm = (dm1 * n1) / (19098.0 * Math.cos(gama_rad)); // T241
        const YS = Math.sqrt(100.0 / Math.min(Math.max(65.0, a), 250.0)); // O242

        const B_coef = Math.sqrt(Math.max(0.0, 6.0 * mx * dm1 - 9.0 * mx * mx + mx)); // Y243
        const Z243 = -0.393 + 0.0000029157 * Math.pow(z2, -0.0847) * Math.pow(alfa0, 0.0595)
            * (0.0000007947 * x2 + 0.00005927) * ((1.0 - 0.038 * q) * q + 65.576)
            * (((108.8547 * z1) / q - 1.0) * (z1 / q) - 3294.921)
            * ((0.003291 * B_coef + 1.0) * B_coef - 13064.58);
        const AA243 = -0.511 + 0.0000037904 * Math.pow(z2, -0.0847) * Math.pow(alfa0, 0.0595)
            * (0.0000007947 * x2 + 0.00005927) * ((1.0 - 0.038 * q) * q + 65.576)
            * (((108.8547 * z1) / q - 1.0) * (z1 / q) - 3294.921)
            * ((0.003291 * B_coef + 1.0) * B_coef - 13064.58);
        const h_x_1998 = 0.018 + q / (7.86 * (q + z2)) + 1.0 / z2 + x2 / 110.0 - (z2 / z1) / 36300.0 + b2H / (370.4 * mx) - Math.sqrt(2.0 * q - 1.0) / 213.9; // X244
        const dinVersion = parseInt(p.dinVersion !== undefined ? p.dinVersion : 1); // Options!F5 = 1
        const h_x = Math.max((dinVersion === 1) ? h_x_1998 : ((toothType === 5) ? AA243 : Z243), 1e-9); // X243
        const YG = Math.min(Math.sqrt(0.07 / h_x), 2.0); // O243
        const YW = wheelMat.yw; // O244
        const YR = Math.pow(Ra1 / 0.5, 0.25); // O245

        // Lubrication index X132 = INDEX(T_DesignCooling, _DesignCooling, 2) + _OilType
        const lubricationIndex = ((designCooling === 3) ? 0 : 3) + oilType; // 1..6
        let X246, Y246;
        switch (lubricationIndex) {
            case 1: // Oil-spray + Mineral
                X246 = Math.min(0.028 + 0.026 / Math.pow(vgm + 0.17, 0.76), 0.1);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 2: // Oil-spray + PAO
                X246 = Math.min(0.026 + 0.017 / Math.pow(vgm + 0.17, 0.92), 0.096);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 3: // Oil-spray + PEG
                X246 = Math.min(0.02 + 0.02 / Math.pow(vgm + 0.2, 0.97), 0.094);
                Y246 = Math.min(0.034 + 0.015 / Math.pow(vgm + 0.19, 0.97), 0.1);
                break;
            case 4: // Oil bath + Mineral
                X246 = Math.min(0.033 + 0.079 / Math.pow(vgm + 0.2, 1.55), 0.1);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 5: // Oil bath + PAO
                X246 = Math.min(0.027 + 0.0056 / Math.pow(vgm + 0.15, 1.63), 0.096);
                Y246 = Math.min(0.055 + 0.015 / Math.pow(vgm + 0.2, 0.87), 0.1);
                break;
            case 6: // Oil bath + PEG
            default:
                X246 = Math.min(0.024 + 0.0032 / Math.pow(vgm + 0.1, 1.71), 0.094);
                Y246 = Math.min(0.034 + 0.015 / Math.pow(vgm + 0.19, 0.97), 0.1);
                break;
        }
        const eta0T = (MatTypeW === 2) ? Y246 : X246; // O246
        const etazm = eta0T * YS * YG * YW * YR; // O247
        const roz = (Math.atan(etazm) * 180.0) / Math.PI; // O248
        const etaz = Math.max(
            0.0001,
            (poweredWoWh === 1)
                ? (Math.tan(gama_rad) / Math.tan(((gama + roz) * Math.PI) / 180.0))
                : (Math.tan(((gama - roz) * Math.PI) / 180.0) / Math.tan(gama_rad))
        ); // O249

        const PV0_W = 0.000089 * a * Math.pow(n1, 4.0 / 3.0); // U250
        const PV0 = PV0_W * 0.001; // O250

        const bearingType = parseInt(p.bearingType !== undefined ? p.bearingType : 1); // F251
        const X251 = (0.03 * Pw2 * 1000.0 * Math.pow(a, 0.44) * (z2 / z1)) / dm2;
        const Y251 = (0.013 * Pw2 * 1000.0 * Math.pow(a, 0.44) * (z2 / z1)) / dm2;
        const AG251 = ((Mk2 / i) / etaz) * KA;
        const AH251 = Math.pow((0.83 * 1e7 * Pw2) / etaz / n1, 0.333);
        const ShaftDB2 = Math.pow((0.83 * 1e7 * Pw2) / n2, 0.333); // P405
        const Ftm2 = (2000.0 * T2) / dm2; // U373
        const AF251 = (2000.0 * AG251) / dm1;
        const AE251 = (AF251 * Math.tan((alfan * Math.PI) / 180.0)) / Math.sin(((gama + roz) * Math.PI) / 180.0);
        const AD251 = Math.sqrt(AE251 * AE251 + AF251 * AF251);
        const AC251 = Math.sqrt(AE251 * AE251 + Ftm2 * Ftm2);
        const AA251 = ((AD251 * 0.01 * (AH251 / 1000.0)) / 2.0) * (n1 / 9550.0) * 1000.0 * 2.0;
        const AB251 = ((AC251 * 0.01 * (ShaftDB2 / 1000.0)) / 2.0) * (n2 / 9550.0) * 1000.0 * 2.0;
        const Z251 = AA251 + AB251;
        const PVLP_W = (bearingType === 1) ? X251 : ((bearingType === 2) ? Y251 : Z251); // U251
        const PVLP = PVLP_W * 0.001; // O251

        const PVD_W = 0.00001178 * dm1 * dm1 * n1 * 2.0; // U252
        const PVD = PVD_W * 0.001; // O252

        const PVz_W = ((0.1 * Mk2 * n1) / (z2 / z1)) * (1.0 / etaz - 1.0); // U253
        const PVz = PVz_W * 0.001; // O253

        const PV_W = PVz_W + PV0_W + PVLP_W + PVD_W; // U254
        const PV = PV_W * 0.001; // O254

        const etages = (poweredWoWh === 1) ? (Pw2 / (Pw2 + PV_W / 1000.0)) : ((Pw2 - PV_W / 1000.0) / Pw2); // O255

        // Back-couple Pw1, Mk1, etages_pct, etamax_pct, SelfLock, and Mass (Rows 119, 121, 178-185)
        const Pw1 = (poweredWoWh === 1) ? (Pw2 / etages) : (Pw2 * etages); // T119, O119
        const Mk1 = (poweredWoWh === 1) ? (Mk2 / (i * etages)) : (Mk2 / (i / etages)); // T121, O121
        const etages_pct = etages * 100.0; // O179
        const etamax_pct = (Math.tan(((45.0 - roz / 2.0) * Math.PI) / 180.0) / Math.tan(((45.0 + roz / 2.0) * Math.PI) / 180.0) - (etaz - etages)) * 100.0; // P179

        const Z185 = (MatTypeW === 1) ? 0.13 : ((MatTypeW === 2) ? 0.18 : 0.15);
        const etaStatic = Z185 * Math.sqrt(YS) * YW * YR; // Y185
        const gama_SelfLock = Math.round(((Math.atan(etaStatic) * 180.0) / Math.PI) * 100.0) / 100.0; // X185
        const isSelfLocking = gama <= gama_SelfLock;

        const ShaftDA1 = Math.pow((1.77 * 1e7 * Pw1) / n1, 0.333); // O404
        const ShaftDA2 = Math.pow((1.77 * 1e7 * Pw2) / n2, 0.333); // P404
        const ShaftDB1 = Math.pow((0.83 * 1e7 * Pw1) / n1, 0.333); // O405
        const Flag_d1min = (df1 < ShaftDB1) ? 1 : 0; // U164

        const Ro1 = wormMat.density; // O380
        const Ro2 = wheelMat.density; // P380
        const SK_Proposal = Math.round(mx * 2.0 * 1.001 * 1000.0) / 1000.0; // P301
        const SK = SK_Proposal; // T301
        const mass1 = (((Math.PI * df1 * df1) / 4.0) * (l1 - L / 2.0) + ((Math.PI * d1 * d1) / 4.0) * L + ((Math.PI * df1 * df1) / 4.0) * (l2 - L / 2.0)) * (Ro1 / 1e9); // X179
        const mass2 = Math.PI * b2H * (Math.pow(da2 - ha2, 2) / 4.0 - Math.pow(da2 - 2.0 * (ha2 + hf2) - 2.0 * SK, 2) / 4.0) * (Ro2 / 1e9)
            + (Math.PI * b2H * 0.25 * (Math.pow(da2 - 2.0 * (ha2 + hf2) - SK, 2) / 4.0 - Math.pow(ShaftDB2, 2) / 4.0)
                + Math.PI * b2H * (Math.pow(ShaftDB2 + 3.0 * SK, 2) / 4.0 - Math.pow(ShaftDB2, 2) / 4.0)) * (Ro1 / 1e9)
            + Math.PI * b2H * 2.5 * (Math.pow(ShaftDB2, 2) / 4.0) * (Ro1 / 1e9); // X180
        const GboxArea = (Math.PI * Math.pow(da2 + 4.0 * mn, 2)) / 2.0 + Math.pow(da2 + mn * 4.0, 2)
            + ((Math.PI * (da2 + mn * 4.0)) / 2.0 + da2) * (b2H + mn * 4.0)
            + (l1 + l2) * (da1 + mn * 4.0) * 3.0 + Math.pow(da1 + mn * 4.0, 2) * 2.0; // Y181
        const mass3 = ((GboxArea * Math.sqrt(mn) * 5.0) / 1e9) * 7250.0; // X181
        const mass_gears = mass1 + mass2; // P178
        const mass = mass1 + mass2 + mass3; // O178

        // 12.0 Dimensions of Cylindrical Wormgearing (AGMA 6022-C93) (Rows 334-344)
        const NW = z1; // O334
        const NG = z2; // P334
        const mG = i; // O335
        const C_agma = a / 25.4; // O336
        const d_LC = d1 / 25.4; // O338
        const D_UC = 2.0 * C_agma - d_LC; // P338
        const pitchx = (Math.PI * D_UC) / NG; // P336
        const dmin_agma = Math.round((Math.pow(C_agma, 0.875) / 3.0) * 1000.0) / 1000.0;
        const dmax_agma = Math.round((Math.pow(C_agma, 0.875) / 1.6) * 1000.0) / 1000.0;
        const d_rec_agma_str = `${dmin_agma} - ${dmax_agma}`; // O337
        const Lead_agma = NW * pitchx; // O339
        const leadAngle_agma = (Math.atan(Lead_agma / (Math.PI * d_LC)) * 180.0) / Math.PI; // P339
        const addendum_agma = pitchx / Math.PI; // O340
        const dedendum_agma = (pitchx > 0.16) ? ((1.157 * pitchx) / Math.PI) : ((1.2 * pitchx) / Math.PI + 0.002); // P340
        const Dt_agma = D_UC + 2.0 * addendum_agma; // P342
        const do1_agma = d_LC + 2.0 * addendum_agma; // O341
        const Do2_agma = Dt_agma + addendum_agma; // P341
        const dr_agma = d_LC - 2.0 * dedendum_agma; // O342
        const clearance_agma = dedendum_agma - addendum_agma; // O343
        const FWmax_agma = 2.0 * Math.sqrt(Math.max(0.0, Math.pow(Dt_agma / 2.0, 2) - Math.pow(D_UC / 2.0 - addendum_agma, 2))); // O344
        const FG_agma = 1.125 * Math.sqrt(Math.max(0.0, Math.pow(do1_agma + 2.0 * clearance_agma, 2) - Math.pow(do1_agma - 4.0 * addendum_agma, 2))); // P344
        const FWmax_agma_mm = FWmax_agma * 25.4; // T344
        const FG_agma_mm = FG_agma * 25.4; // U344

        // Peripheral speeds v1, v2 (Row 372)
        const v1 = ((Math.PI * d1) / 1000.0) * (n1 / 60.0); // O372
        const v2 = ((Math.PI * d2) / 1000.0) * (n2 / 60.0); // P372

        // 16.0 Calculation of Gearing for Given Axis Distance (Rows 397-400)
        const z1_req = Math.max(1, parseInt(p.z1_req !== undefined ? p.z1_req : 1)); // O397
        const z2_req = Math.max(5, parseInt(p.z2_req !== undefined ? p.z2_req : 50)); // P397
        const a_req = (p.a_req !== undefined && p.a_req !== null && String(p.a_req).trim() !== '') ? parseFloat(p.a_req) : 180.0; // O398
        const axisDistSolutions = this.computeAxisDistTable(z1_req, z2_req, a_req, toothType);

        // 18.0 Auxiliary Calculations (Rows 408-410)
        const XX_z1 = (p.XX_z1 !== undefined && String(p.XX_z1).trim() !== '') ? parseFloat(p.XX_z1) : 2.0; // O408
        const XX_z2 = (p.XX_z2 !== undefined && String(p.XX_z2).trim() !== '') ? parseFloat(p.XX_z2) : 41.0; // P408
        const XXX_i = XX_z2 / (XX_z1 || 1.0); // R408
        const XX_n1 = (p.XX_n1 !== undefined && String(p.XX_n1).trim() !== '') ? parseFloat(p.XX_n1) : 1600.0; // O409
        const XX_n2_ratio = (p.XX_n2_ratio !== undefined && String(p.XX_n2_ratio).trim() !== '') ? parseFloat(p.XX_n2_ratio) : 80.0; // P409
        const XX_i = XX_n1 / (XX_n2_ratio || 1.0); // R409
        const XX_Mk2 = (p.XX_Mk2 !== undefined && String(p.XX_Mk2).trim() !== '') ? parseFloat(p.XX_Mk2) : 300.0; // O410
        const XX_n2 = (p.XX_n2 !== undefined && String(p.XX_n2).trim() !== '') ? parseFloat(p.XX_n2) : 3.75; // P410
        const XX_Pw2 = (XX_Mk2 * XX_n2) / 9550.0; // R410

        // 19.0 Graphical Output, CAD Systems & DXFTables (Rows 412-427, DXFTables!B2:D29)
        const Shaft_ds_prop = Math.round((df1 - mn) * 10.0) / 10.0; // X416
        const Shaft_th_prop = Math.round((mn / 4.0) * 10.0) / 10.0; // X417
        const dstFlag = (p.dstFlag !== undefined) ? Boolean(p.dstFlag) : true; // B416
        const Shaft_ds = dstFlag ? Shaft_ds_prop : ((p.Shaft_ds !== undefined && String(p.Shaft_ds).trim() !== '') ? parseFloat(p.Shaft_ds) : Shaft_ds_prop); // O416
        const Shaft_th = dstFlag ? Shaft_th_prop : ((p.Shaft_th !== undefined && String(p.Shaft_th).trim() !== '') ? parseFloat(p.Shaft_th) : Shaft_th_prop); // P416
        const DXF_Beta = (p.DXF_Beta !== undefined && String(p.DXF_Beta).trim() !== '') ? parseFloat(p.DXF_Beta) : 10.0; // O417
        const DXF_AutoScale = a / 100.0; // X415

        // Worm Wheel Rim Chamfer according to DIN 3975 / DXF.bas lines 168-198
        const r1_chamfer = a - da2 / 2.0;
        const r3_chamfer = a - df2 / 2.0;
        const v1_chamfer = r1_chamfer - (a - de2 / 2.0);
        const b1_chamfer = Math.sqrt(Math.max(0.0, v1_chamfer * (2.0 * r1_chamfer - v1_chamfer)));
        const halfB_chamfer = b2H / 2.0;
        const b4_chamfer_prop = (halfB_chamfer * r1_chamfer) / r3_chamfer;
        const v4_chamfer = r3_chamfer - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3_chamfer * r3_chamfer - b2H * b2H));
        const rEdge_chamfer = df2 / 2.0 + v4_chamfer;
        const dz_chamfer_prop = halfB_chamfer - b4_chamfer_prop;
        const dr_chamfer_prop = de2 / 2.0 - rEdge_chamfer;
        const theta_chamfer_prop = Math.round(((Math.atan2(dr_chamfer_prop, Math.max(1e-4, dz_chamfer_prop)) * 180.0) / Math.PI) * 10.0) / 10.0; // deg so với trục

        const DXF_WheelChamferFlag = (p.DXF_WheelChamferFlag !== undefined) ? Boolean(p.DXF_WheelChamferFlag) : true;
        const rawChamferVal = (p.DXF_WheelChamfer !== undefined && String(p.DXF_WheelChamfer).trim() !== '') ? parseFloat(p.DXF_WheelChamfer) : theta_chamfer_prop;
        const DXF_WheelChamfer = DXF_WheelChamferFlag ? theta_chamfer_prop : (isNaN(rawChamferVal) ? theta_chamfer_prop : rawChamferVal);

        let b4_actual = b4_chamfer_prop;
        let rEdge_actual = rEdge_chamfer;
        if (!DXF_WheelChamferFlag) {
            if (DXF_WheelChamfer <= 0.1) {
                b4_actual = halfB_chamfer; // 0 deg: Không vát mép (cạnh vành vuông phẳng)
                rEdge_actual = de2 / 2.0;
            } else if (DXF_WheelChamfer < 89.9) {
                const tanAngle = Math.tan((DXF_WheelChamfer * Math.PI) / 180.0);
                b4_actual = Math.max(b1_chamfer, halfB_chamfer - (dr_chamfer_prop / tanAngle));
                rEdge_actual = Math.max(rEdge_chamfer, (de2 / 2.0) - (halfB_chamfer - b4_actual) * tanAngle);
            }
        }
        const dz_actual = Math.max(0.0, halfB_chamfer - b4_actual);
        const dr_actual = Math.max(0.0, (de2 / 2.0) - rEdge_actual);

        const ABOM01 = "Worm gear - Worm";
        const ABOM02 = `z1=${z1}, mn=${Math.round(mn * 100.0) / 100.0}`;
        const ABOM03 = `Material: ${wormMat.designation}`;
        const BBOM01 = "Worm gear - Gear";
        const BBOM02 = `z2=${z2}, mn=${Math.round(mn * 100.0) / 100.0}`;
        const BBOM03 = `Material: ${wheelMat.designation}`;

        // DXFTables values (DXFTables!D4:D29)
        const dxf_worm_m = mn; // D4
        const dxf_worm_z1 = z1; // D5
        const dxf_worm_alfa = alfa0; // D6
        const dxf_worm_d1 = Math.round(d1 * 1000.0) / 1000.0; // D7
        const dxf_worm_da1 = Math.round(da1 * 1000.0) / 1000.0; // D8
        const dxf_worm_L = Math.round(L_Input * 1000.0) / 1000.0; // D9
        const dxf_worm_mat = wormMat.designation; // C11
        const dxf_worm_a = Math.round(a * 1000.0) / 1000.0; // D12
        const dxf_worm_z2 = z2; // D14

        const dxf_wheel_m = mn; // D18
        const dxf_wheel_z2 = z2; // D19
        const dxf_wheel_alfa = alfa0; // D20
        const dxf_wheel_d2 = Math.round(d2 * 1000.0) / 1000.0; // D21
        const dxf_wheel_da2 = Math.round(da2 * 1000.0) / 1000.0; // D22
        const dxf_wheel_b2H = Math.round(b2H_Input * 1000.0) / 1000.0; // D23
        const dxf_wheel_x2 = Math.round(x2 * 1000.0) / 1000.0; // D24
        const dxf_wheel_mat = wheelMat.designation; // C26
        const dxf_wheel_a = Math.round(a * 1000.0) / 1000.0; // D27
        const dxf_wheel_z1 = z1; // D29

        // 32 MITCalc 1.74 3D CAD Parameters (Calculation!A1:AF4 exported by MTC_3D.bas!Output3D)
        const MC_a = a;                                                 // A2: =_a
        const MC_px = px;                                               // B2: =_px
        const MC_pxn = px * z1;                                         // C2: =_px*_z1
        const MC_alfa = alfax;                                          // D2: =_alfax
        const MC_z1 = z1;                                               // E2: =_z1
        const MC_z1sw = (z1 < 2) ? 2 : z1;                              // F2: =IF(_z1<2,2,_z1)
        const MC_arrang = (z1 === 1) ? 0.001 : 360.0;                   // G2: =IF(_z1=1,0.001,360)
        const MC_L = L;                                                 // H2: =_L
        const MC_da1 = da1;                                             // I2: =_da1
        const MC_d1 = d1;                                               // J2: =_d1
        const MC_df1 = df1;                                             // K2: =_df1
        const MC_sn1 = sn1 / 2.0;                                       // L2: =_sn1/2
        const MC_sx1 = sx1 / 2.0;                                       // M2: =_sx1/2
        const MC_en1 = en1 / 2.0;                                       // N2: =_en1/2
        const MC_ex1 = ex1 / 2.0;                                       // O2: =_ex1/2
        const MC_ds1 = Shaft_ds;                                        // P2: =_Shaft_ds
        const MC_t1 = Shaft_th;                                         // Q2: =_Shaft_th
        const MC_beta1 = (DXF_Beta < 0.001) ? 0.001 : DXF_Beta;         // R2: =IF(_DXF_Beta<0.001,0.001,_DXF_Beta)
        const MC_z2 = z2;                                               // S2: =_z2
        const MC_b2H = b2H;                                             // T2: =_b2H
        const MC_da2 = da2;                                             // U2: =_da2
        const MC_d2 = d2;                                               // V2: =_d2
        const MC_df2 = df2;                                             // W2: =_df2
        const MC_de2 = de2;                                             // X2: =_de2
        const MC_sn2 = sn2 / 2.0;                                       // Y2: =_sn2/2
        const MC_sx2 = sx2 / 2.0;                                       // Z2: =_sx2/2
        const MC_en2 = en2 / 2.0;                                       // AA2: =_en2/2
        const MC_ex2 = ex2 / 2.0;                                       // AB2: =_ex2/2
        const MC_d1cutmin = 2.0 * (a - da2 / 2.0);                      // AC2: =2*(_a-_da2/2)
        const MC_d1cut = 2.0 * (a - d2 / 2.0);                          // AD2: =2*(_a-_d2/2)
        const MC_d1cutmax = 2.0 * (a - df2 / 2.0);                      // AE2: =2*(_a-_df2/2)
        const MC_pxnhalf = (px * z1) / 2.0;                             // AF2: =_px*_z1/2

        const MC_3D = {
            MC_a, MC_px, MC_pxn, MC_alfa, MC_z1, MC_z1sw, MC_arrang, MC_L,
            MC_da1, MC_d1, MC_df1, MC_sn1, MC_sx1, MC_en1, MC_ex1, MC_ds1, MC_t1, MC_beta1,
            MC_z2, MC_b2H, MC_da2, MC_d2, MC_df2, MC_de2, MC_sn2, MC_sx2, MC_en2, MC_ex2,
            MC_d1cutmin, MC_d1cut, MC_d1cutmax, MC_pxnhalf,
            MC_b4: b4_actual, MC_rEdge: rEdge_actual, MC_chamferAngle: DXF_WheelChamfer
        };

        // Data1 coordinates for Section 4.0 Dynamic Plot (Chart 1963)
        const BeSi = Math.min(
            Math.min(
                Math.max(
                    (1.0 + (0.001 * (Ftm2 / 2.0) + 0.8 * Math.pow(Ftm2 / 2.0, 0.33))) * (1.0 + 0.000051 * Math.pow(n1, 1.19)),
                    4.0
                ),
                200.0
            ) / 2.0,
            d2 / 4.0
        ); // Data1!F45
        const chartData1 = this.computeChartData1({
            a, da1, d1, df1, da2, d2, df2, de2, L, b2H, l1, l2, BeSi,
            b4: b4_actual, b1: b1_chamfer, rEdge: rEdge_actual
        });

        return {
            // Section 1.0
            poweredWoWh, Pw1, Pw2, n1, n2, Mk1, Mk2, iin, i, i_dev, i_dev_pct,
            // Section 2.0 & 15.0
            matP, matW, wormMat, wheelMat, MatTypeW,
            Ro1, Ro2,
            E1: wormMat.elasticModulus, E2: wheelMat.elasticModulus,
            Rm1: wormMat.rm, Rm2: wheelMat.rm,
            Rp02_1: wormMat.rp02, Rp02_2: wheelMat.rp02,
            Poison1: wormMat.poissonRatio, Poison2: wheelMat.poissonRatio,
            SHlim1: wormMat.shlim, SHlim2: wheelMat.shlim,
            SFlim1: wormMat.sflim, SFlim2: wheelMat.sflim,
            VHV1: wormMat.vhv, VHV2: wheelMat.surfaceHardnessHV,
            JHV1: wormMat.jhv, JHV2: wheelMat.coreHardnessHV,
            toothType, loadTypeA, loadTypeB, designCooling, oilType, lubricant,
            ny40, ny100, rooil15, Ra1, kaFlag, KA, KA_Prop, Lh,
            // Section 3.0
            haXP, haXG, caXP, caXG, rf1Flag, rf1_rec, rf1, rf2,
            // Section 4.0
            z1, z2, alfa_temp, alfa0, calc_q, q, q_calc, q_rec,
            d1_Input, d1, d1_calc, d1_rec, Flag_d1min,
            gama, gama_calc, gama_SelfLock, etaStatic, isSelfLocking,
            teethOrientation, m_Input, m_temp, CP, DP,
            l1_proc, l2_proc, l1_Units, l2_Units, l1l2_flag, l1_input, l2_input, l1, l2,
            FlagL, L_Proposal, L_Input, L,
            Flagb2H, b2H_Proposal, b2H_Input, b2H,
            x1, x2, z2minTh, z2minPr, xmin, Flag_z2min,
            a_req1_Input, a_req1, x_for_a, amin_dx, amax_dx, m_for_a, q_for_a, amin_q, amax_q,
            mass1, mass2, mass3, mass_gears, mass,
            etages_pct, etamax_pct,
            // Section 5.0 (DIN 3975)
            mn, mt, mx, pn, pt, px, alfan, alfat, alfax,
            da1, da2, d2, df1, df2, dw1, dw2, dm1, dm2,
            de2Flag, de2min, de2max, de2Prop, de2Input, de2, de2_range_str,
            ha1, ha2, hf1, hf2, a, gamaw, gamab,
            sn1, sn2, sx1, sx2, en1, en2, ex1, ex2,
            // Section 6.0 (DIN 3996 Efficiency & Losses)
            vgm, YS, h_x, YG, YW, YR, lubricationIndex, eta0T, etazm, roz, etaz,
            PV0, PV0_W, bearingType, PVLP, PVLP_W, PVD, PVD_W, PVz, PVz_W, PV, PV_W, etages,
            v1, v2,
            // Section 12.0 (AGMA 6022-C93)
            NW, NG, mG, C_agma, pitchx, dmin_agma, dmax_agma, d_rec_agma_str,
            d_LC, D_UC, Lead_agma, leadAngle_agma, addendum_agma, dedendum_agma,
            do1_agma, Do2_agma, dr_agma, Dt_agma, clearance_agma,
            FWmax_agma, FG_agma, FWmax_agma_mm, FG_agma_mm,
            // Section 16.0 (Axis Distance Table)
            z1_req, z2_req, a_req, axisDistSolutions,
            // Section 17.0 (Shaft Diameters helper)
            ShaftDA1, ShaftDA2, ShaftDB1, ShaftDB2,
            // Section 18.0 (Auxiliary Calculations)
            XX_z1, XX_z2, XXX_i, XX_n1, XX_n2_ratio, XX_i, XX_Mk2, XX_n2, XX_Pw2,
            // Section 19.0 (CAD & DXFTables)
            dstFlag, Shaft_ds_prop, Shaft_th_prop, Shaft_ds, Shaft_th, DXF_Beta, DXF_AutoScale,
            DXF_WheelChamferFlag, DXF_WheelChamfer, DXF_WheelChamfer_b4: b4_actual, DXF_WheelChamfer_dz: dz_actual, DXF_WheelChamfer_dr: dr_actual, DXF_WheelChamfer_b1: b1_chamfer, DXF_WheelChamfer_rEdge: rEdge_actual,
            MC_b4: b4_actual, MC_rEdge: rEdge_actual, MC_chamferAngle: DXF_WheelChamfer,
            ABOM01, ABOM02, ABOM03, BBOM01, BBOM02, BBOM03,
            dxf_worm_m, dxf_worm_z1, dxf_worm_alfa, dxf_worm_d1, dxf_worm_da1, dxf_worm_L, dxf_worm_mat, dxf_worm_a, dxf_worm_z2,
            dxf_wheel_m, dxf_wheel_z2, dxf_wheel_alfa, dxf_wheel_d2, dxf_wheel_da2, dxf_wheel_b2H, dxf_wheel_x2, dxf_wheel_mat, dxf_wheel_a, dxf_wheel_z1,
            // 32 MITCalc 1.74 3D CAD Parameters (Calculation!A1:AF4)
            MC_a, MC_px, MC_pxn, MC_alfa, MC_z1, MC_z1sw, MC_arrang, MC_L,
            MC_da1, MC_d1, MC_df1, MC_sn1, MC_sx1, MC_en1, MC_ex1, MC_ds1, MC_t1, MC_beta1,
            MC_z2, MC_b2H, MC_da2, MC_d2, MC_df2, MC_de2, MC_sn2, MC_sx2, MC_en2, MC_ex2,
            MC_d1cutmin, MC_d1cut, MC_d1cutmax, MC_pxnhalf, MC_3D,
            // Chart 1963 Data1
            BeSi, chartData1
        };
    },

    // Exact reproduction of VBA AxisDistTbl (GearFunctions.bas lines 757-835)
    computeAxisDistTable(z1_req, z2_req, a_req, toothType) {
        const modules = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_Module_Excel21)
            ? WORM_STD_TABLES.T_Module_Excel21
            : [0.5, 0.6, 0.8, 1.0, 1.25, 1.6, 2.0, 2.5, 3.15, 4.0, 5.0, 6.3, 8.0, 10.0, 12.5, 16.0, 20.0, 25.0, 32.0, 40.0, 50.0];
        const qList = (typeof WORM_STD_TABLES !== 'undefined' && WORM_STD_TABLES.T_Diam_q)
            ? WORM_STD_TABLES.T_Diam_q
            : [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0];

        const solutions = [];
        const PI_VBA = 3.141592653;
        for (let z2_c = z2_req - 1; z2_c <= z2_req + 1; z2_c++) {
            if (z2_c < 1) continue;
            for (let m_idx = 0; m_idx < modules.length; m_idx++) {
                const m_c = modules[m_idx];
                for (let q_idx = 0; q_idx < qList.length; q_idx++) {
                    const q_c = qList[q_idx];
                    const gama_c = (Math.atan(z1_req / q_c) * 180.0) / PI_VBA;
                    const gama_rad_c = (gama_c * PI_VBA) / 180.0;
                    let X;
                    if (toothType === 1) {
                        X = a_req / m_c - 0.5 * q_c - 0.5 * z2_c;
                    } else {
                        X = a_req / m_c - (0.5 * z1_req) / Math.sin(gama_rad_c) - (0.5 * z2_c) / Math.cos(gama_rad_c);
                    }
                    if (X >= -0.5 && X <= 1.0) {
                        const dp_c = 25.4 / m_c;
                        const i_c = z2_c / z1_req;
                        solutions.push({
                            id: solutions.length + 1,
                            z1: z1_req,
                            z2: z2_c,
                            m: m_c,
                            dp: dp_c,
                            q: q_c,
                            i: i_c,
                            x2: X,
                            label: `z1=${z1_req} | z2=${z2_c} | m=${m_c.toFixed(2)} | DP=${dp_c.toFixed(2)} | q=${q_c.toFixed(2)} | i=${i_c.toFixed(2)} | x=${X.toFixed(4)}`
                        });
                    }
                }
            }
        }
        return solutions;
    },

    // Exact reproduction of Data1!C3:J86 for Section 4.0 Dynamic Plot (Chart 1963)
    computeChartData1(g) {
        const { a, da1, d1, df1, da2, d2, L, b2H, l1, l2, BeSi } = g;
        const C3 = -Math.max(da2 * 0.55, l1 + df1 * 0.6);
        const C9 = Math.max(da2 * 0.55, l2 + BeSi) + 1.0 * da1;
        const C4 = C9 + 0.6 * da1;
        const D7 = da2 * 0.55;
        const D8 = -a - df1;
        const C11 = -l1;
        const D11 = -a + df1 / 2.0 + BeSi * 2.0;
        const D12 = -a - df1 / 2.0 - BeSi * 2.0;
        const C13 = l2;

        // Axis segments (Data1!C3:D14)
        const axisLines = [
            [{ x: C3, y: 0.0 }, { x: C4, y: 0.0 }],
            [{ x: C4, y: -a }, { x: C3, y: -a }],
            [{ x: 0.0, y: D7 }, { x: 0.0, y: D8 }],
            [{ x: C9, y: D8 }, { x: C9, y: D7 }],
            [{ x: C11, y: D11 }, { x: C11, y: D12 }],
            [{ x: C13, y: D12 }, { x: C13, y: D11 }]
        ];

        // Worm shaft outline (Data1!C45:D57)
        const C45 = -L / 2.0;
        const D45 = -a + df1 / 2.0;
        const C46 = -l1 - BeSi;
        const D47 = D45 - df1;
        const D49 = -a - da1 / 2.0;
        const C50 = L / 2.0;
        const D51 = D49 + da1;
        const C55 = l2 + BeSi;

        const shaftPolyline = [
            { x: C45, y: D45 },
            { x: C46, y: D45 },
            { x: C46, y: D47 },
            { x: C45, y: D47 },
            { x: C45, y: D49 },
            { x: C50, y: D49 },
            { x: C50, y: D51 },
            { x: C45, y: D51 },
            { x: C45, y: D47 },
            { x: C50, y: D45 },
            { x: C55, y: D45 },
            { x: C55, y: D47 },
            { x: C50, y: D47 }
        ];

        // Wheel throat contour with dynamic rim chamfer (Chart 1963)
        const halfB = b2H / 2.0;
        const b4 = Math.min(halfB, Math.max(0, g.b4 !== undefined ? g.b4 : halfB));
        const b1 = Math.min(b4, Math.max(0, g.b1 !== undefined ? g.b1 : 0));
        const de2 = g.de2 || (da2 + 1.6);
        const df2 = g.df2 || (da2 - 4.8 * (g.mn || 4));
        const r1 = a - da2 / 2.0;
        const r3 = a - df2 / 2.0;
        const v4 = r3 - 0.5 * Math.sqrt(Math.max(0.0, 4.0 * r3 * r3 - b2H * b2H));
        const rRootEdge = df2 / 2.0 + v4;
        const yTopOuter = de2 / 2.0;
        const yTopEdge = (g.rEdge !== undefined) 
            ? g.rEdge 
            : ((b4 >= halfB - 1e-4) ? yTopOuter : rRootEdge);

        // Top contour points (from -halfB to +halfB)
        const topPts = [];
        topPts.push({ x: C9 - halfB, y: yTopEdge });
        if (b4 < halfB - 0.05) {
            topPts.push({ x: C9 - b4, y: yTopOuter });
        }
        if (b1 < b4 - 0.05) {
            topPts.push({ x: C9 - b1, y: yTopOuter });
        }
        // Throat arc samples across [-b1, +b1]
        const numArc = 10;
        for (let i = 0; i <= numArc; i++) {
            const z = -b1 + (2.0 * b1 * i) / numArc;
            const yArc = a - Math.sqrt(Math.max(0.0, r1 * r1 - z * z));
            topPts.push({ x: C9 + z, y: yArc });
        }
        if (b1 < b4 - 0.05) {
            topPts.push({ x: C9 + b1, y: yTopOuter });
        }
        if (b4 < halfB - 0.05) {
            topPts.push({ x: C9 + b4, y: yTopOuter });
        }
        topPts.push({ x: C9 + halfB, y: yTopEdge });

        // Symmetrical bottom contour points
        const bottomPts = topPts.map(pt => ({ x: pt.x, y: -pt.y })).reverse();
        const wheelBox = [...topPts, ...bottomPts, topPts[0]];

        // 4 Bearing boxes (Data1!C67:D86)
        const C67 = C11 + BeSi;
        const D67 = D45 + df1 / 10.0;
        const D68 = D67 + BeSi * 2.0;
        const C69 = C11 - BeSi;
        const D72 = D47 - df1 / 10.0;
        const D73 = D72 - BeSi * 2.0;
        const C77 = C13 - BeSi;
        const C79 = C13 + BeSi;

        const bearingBoxes = [
            [{ x: C67, y: D67 }, { x: C67, y: D68 }, { x: C69, y: D68 }, { x: C69, y: D67 }, { x: C67, y: D67 }],
            [{ x: C67, y: D72 }, { x: C67, y: D73 }, { x: C69, y: D73 }, { x: C69, y: D72 }, { x: C67, y: D72 }],
            [{ x: C77, y: D67 }, { x: C77, y: D68 }, { x: C79, y: D68 }, { x: C79, y: D67 }, { x: C77, y: D67 }],
            [{ x: C77, y: D72 }, { x: C77, y: D73 }, { x: C79, y: D73 }, { x: C79, y: D72 }, { x: C77, y: D72 }]
        ];

        return {
            C3, C4, C9, D7, D8, D11, D12,
            wheelCenter: { x: 0.0, y: 0.0, r_da2: da2 / 2.0, r_d2: d2 / 2.0 },
            wormSideCenter: { x: C9, y: -a, r_da1: da1 / 2.0, r_d1: d1 / 2.0 },
            axisLines,
            shaftPolyline,
            wheelBox,
            bearingBoxes
        };
    }
};

if (typeof window !== 'undefined') {
    window.WormCalcEngine = WormCalcEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WormCalcEngine;
}
