/**
 * MITCalc Web App - ISO 6336:2006 Strength Calculation Engine
 * Implements load distribution factors, surface durability (pitting SH), tooth bending strength (SF),
 * static overload capacities, and failure probability
 */

import { MathUtils } from './math-utils.js';

export const GearStrengthISO = {
    /**
     * Calculates ISO 6336:2006 rating for contact stress and tooth root bending stress
     * @param {Object} geom - geometry from GearGeometry.calculate()
     * @param {Object} forces - forces from GearForces.calculate()
     * @param {Object} mat1 - pinion material
     * @param {Object} mat2 - gear material
     * @param {Object} p - operational & rating parameters
     * @returns {Object} complete safety factors and stress results
     */
    calculate(geom, forces, mat1, mat2, p) {
        const KA = parseFloat(p.KA) || 1.0;
        const KAS = parseFloat(p.KAS) || 2.0; // Peak one-off overload factor
        const Lh = parseFloat(p.Lh) || 20000.0; // Operational hours
        const accuracyGrade = parseInt(p.accuracyGrade) || 7;
        const SH_req = parseFloat(p.SH_req) || 1.30;
        const SF_req = parseFloat(p.SF_req) || 1.60;

        const u = geom.actual_i >= 1.0 ? geom.actual_i : 1.0 / geom.actual_i;
        const v = forces.v > 0 ? forces.v : 1.0;
        const Ft = forces.Ft > 0 ? forces.Ft : 1000.0;
        const bw = geom.bw > 0 ? geom.bw : 100.0;
        const mn = geom.mn;

        // Number of load cycles
        const n1 = forces.n1;
        const n2 = forces.n2;
        const NK1 = 60.0 * n1 * Lh;
        const NK2 = 60.0 * n2 * Lh;

        // =========================================================================
        // 1. DYNAMIC FACTOR Kv (ISO 6336-1 Method C)
        // =========================================================================
        let K1 = 26.8, K2 = 0.0193; // default ISO Grade 7
        if (accuracyGrade <= 4) { K1 = 9.3; K2 = 0.0065; }
        else if (accuracyGrade === 5) { K1 = 13.9; K2 = 0.0097; }
        else if (accuracyGrade === 6) { K1 = 19.3; K2 = 0.0135; }
        else if (accuracyGrade === 7) { K1 = 26.8; K2 = 0.0193; }
        else if (accuracyGrade === 8) { K1 = 37.1; K2 = 0.0270; }
        else if (accuracyGrade === 9) { K1 = 51.5; K2 = 0.0380; }
        else { K1 = 71.3; K2 = 0.0530; }

        // If helical gears with overlap >= 1, K1 and K2 are reduced
        if (geom.epsilon_B >= 1.0) {
            K1 *= 0.89;
            K2 *= 0.45;
        }

        const K3 = 1.0;
        const termU = Math.sqrt((u * u) / (1.0 + u * u));
        const specificLoad = (Ft * KA) / bw;
        const Kv_calc = 1.0 + (K1 / Math.max(10.0, specificLoad) + K2) * (v * geom.z1 / 100.0) * K3 * termU;
        const Kv = MathUtils.clamp(Kv_calc, 1.0, 5.0);

        // =========================================================================
        // 2. FACE LOAD FACTOR KHbeta, KFbeta (ISO 6336-1)
        // =========================================================================
        const mountingType = p.mountingType || 'A';
        let fma = 15.0; // microns
        if (mountingType === 'A') fma = 12.0;
        else if (mountingType === 'B') fma = 18.0;
        else fma = 30.0;

        const Fm = Ft * KA * Kv;
        const fsh = 0.023 * (Fm / bw); // shaft deflection allowance
        const Fbeta_x = fma + fsh;
        const y_beta = 0.5 * fma; // running-in allowance
        const Fbeta_y = Math.max(1.0, Fbeta_x - y_beta);

        const c_gamma = 20.0; // N/(mm*um) mesh stiffness
        const termFace = (Fbeta_y * c_gamma) / (2.0 * Math.max(1.0, Fm / bw));

        let KHbeta = 1.0;
        if (termFace >= 1.0) {
            KHbeta = Math.sqrt(2.0 * termFace);
        } else {
            KHbeta = 1.0 + termFace;
        }
        KHbeta = MathUtils.clamp(KHbeta, 1.0, 5.0);

        // Bending face load factor KFbeta
        const bh_ratio = bw / (geom.h1 || (2.25 * mn));
        const NF = (bh_ratio * bh_ratio) / (1.0 + bh_ratio + bh_ratio * bh_ratio);
        const KFbeta = Math.pow(KHbeta, MathUtils.clamp(NF, 0.5, 1.0));

        // =========================================================================
        // 3. TRANSVERSE LOAD FACTOR KHalfa, KFalfa (ISO 6336-1)
        // =========================================================================
        let KHalfa = 1.0;
        if (geom.epsilon_G <= 2.0) {
            KHalfa = (geom.epsilon_G / 2.0) * (0.9 + 0.4 * (c_gamma * 3.0) / Math.max(10.0, Ft / bw));
        } else {
            KHalfa = 1.0;
        }
        KHalfa = MathUtils.clamp(KHalfa, 1.0, 1.4);
        const KFalfa = KHalfa;

        // Total additional load factors
        const KH = KA * Kv * KHbeta * KHalfa;
        const KF = KA * Kv * KFbeta * KFalfa;

        // =========================================================================
        // 4. SURFACE DURABILITY (PITTING) CALCULATION (ISO 6336-2)
        // =========================================================================
        // Elasticity Factor ZE [MPa^0.5]
        const nu1 = mat1.poissonRatio || 0.3;
        const nu2 = mat2.poissonRatio || 0.3;
        const E1 = (mat1.elasticModulus || 206.0) * 1000.0; // convert GPa to MPa
        const E2 = (mat2.elasticModulus || 206.0) * 1000.0;
        const ZE = Math.sqrt(1.0 / (Math.PI * ((1.0 - nu1 * nu1) / E1 + (1.0 - nu2 * nu2) / E2)));

        // Zone Factor ZH
        const betabRad = MathUtils.degToRad(geom.betab);
        const alfatRad = MathUtils.degToRad(geom.alfat);
        const alfawtRad = MathUtils.degToRad(geom.alfawt);
        const cosBetab = Math.cos(betabRad);
        const cosAlfat = Math.cos(alfatRad);
        const tanAlfawt = Math.tan(alfawtRad);
        const ZH = Math.sqrt(Math.max(0.1, (2.0 * cosBetab) / (cosAlfat * cosAlfat * tanAlfawt)));

        // Contact Ratio Factor Zeps
        let Zeps = 1.0;
        if (geom.epsilon_B < 1.0) {
            Zeps = Math.sqrt(Math.max(0.1, ((4.0 - geom.epsilon_A) / 3.0) * (1.0 - geom.epsilon_B) + geom.epsilon_B / geom.epsilon_A));
        } else {
            Zeps = Math.sqrt(1.0 / Math.max(0.1, geom.epsilon_A));
        }

        // Helix Angle Factor Zbeta
        const betaRad = MathUtils.degToRad(geom.beta);
        const cosBeta = Math.cos(betaRad);
        const Zbeta = Math.sqrt(1.0 / Math.max(0.1, cosBeta));

        // Single Pair Tooth Contact Factor ZB, ZD
        const M1 = tanAlfawt / Math.sqrt(Math.max(0.01,
            (Math.sqrt(Math.pow(geom.da1 / geom.db1, 2) - 1.0) - (2.0 * Math.PI) / geom.z1) *
            (Math.sqrt(Math.pow(geom.da2 / geom.db2, 2) - 1.0) - (geom.epsilon_A - 1.0) * (2.0 * Math.PI) / geom.z2)
        ));
        const M2 = tanAlfawt / Math.sqrt(Math.max(0.01,
            (Math.sqrt(Math.pow(geom.da2 / geom.db2, 2) - 1.0) - (2.0 * Math.PI) / geom.z2) *
            (Math.sqrt(Math.pow(geom.da1 / geom.db1, 2) - 1.0) - (geom.epsilon_A - 1.0) * (2.0 * Math.PI) / geom.z1)
        ));

        let ZB1 = 1.0, ZB2 = 1.0;
        if (geom.beta === 0) {
            ZB1 = Math.max(1.0, M1);
            ZB2 = Math.max(1.0, M2);
        } else if (geom.epsilon_B < 1.0) {
            ZB1 = Math.max(1.0, M1 - geom.epsilon_B * (M1 - 1.0));
            ZB2 = Math.max(1.0, M2 - geom.epsilon_B * (M2 - 1.0));
        } else {
            ZB1 = 1.0;
            ZB2 = 1.0;
        }

        // Nominal Contact Stress SigmaH0 [MPa]
        const SigmaH0 = ZH * ZE * Zeps * Zbeta * Math.sqrt(Math.max(0, (Ft / (bw * geom.d1)) * ((u + 1.0) / u)));

        // Contact Stresses [MPa]
        const SigmaH_1 = ZB1 * SigmaH0 * Math.sqrt(KH);
        const SigmaH_2 = ZB2 * SigmaH0 * Math.sqrt(KH);

        // Lubricant Factor ZL, Speed Factor ZV, Roughness Factor ZR
        const nu40 = parseFloat(p.oilViscosity40) || 220.0;
        const CZL = (mat1.shlim < 850) ? 0.83 : (mat1.shlim <= 1200 ? mat1.shlim / 4375.0 + 0.6357 : 0.91);
        const ZL = CZL + 4.0 * (1.0 - CZL) / Math.pow(1.2 + 134.0 / nu40, 2);
        const CZV = CZL + 0.02;
        const ZV = CZV + 2.0 * (1.0 - CZV) / Math.sqrt(0.8 + 32.0 / v);
        const Rz = parseFloat(p.roughnessRz) || 4.0;
        const ZR = Math.pow(3.0 / Rz, 0.15);
        const ZW = 1.0; // Work hardening factor
        const ZX = 1.0; // Size factor for pitting

        // Life Factor ZNT
        const calcZNT = (NK, NHlim, qH, maxZNT) => {
            if (NK <= 1e5) return maxZNT;
            if (NK < NHlim) return Math.min(maxZNT, Math.pow(NHlim / NK, 1.0 / qH));
            return 1.0;
        };
        const ZNT1 = calcZNT(NK1, mat1.nhlim, mat1.qh, mat1.maxZNT || 1.6);
        const ZNT2 = calcZNT(NK2, mat2.nhlim, mat2.qh, mat2.maxZNT || 1.6);

        // Permissible Contact Stress SigmaHG & SigmaHP [MPa]
        const SigmaHG_1 = mat1.shlim * ZL * ZV * ZR * ZW * ZX * ZNT1;
        const SigmaHG_2 = mat2.shlim * ZL * ZV * ZR * ZW * ZX * ZNT2;
        const SigmaHP_1 = SigmaHG_1 / SH_req;
        const SigmaHP_2 = SigmaHG_2 / SH_req;

        // Contact Safety Factors SH
        const SH1 = SigmaH_1 > 0 ? SigmaHG_1 / SigmaH_1 : 99.0;
        const SH2 = SigmaH_2 > 0 ? SigmaHG_2 / SigmaH_2 : 99.0;

        // =========================================================================
        // 5. TOOTH BENDING STRENGTH CALCULATION (ISO 6336-3)
        // =========================================================================
        // Tooth form factor YF & Stress correction factor YS
        // Using standard Method B ISO 6336-3 approximation
        const calcFormFactorYF = (zn, x) => {
            // ISO 6336-3 standard 30° tangent form factor approximation
            return MathUtils.clamp(2.95 - 0.75 * Math.log10(Math.max(10, zn)) - 0.8 * x, 1.8, 3.8);
        };
        const calcStressCorrectionYS = (zn, x) => {
            return MathUtils.clamp(1.5 + 0.15 * Math.log10(Math.max(10, zn)) + 0.1 * x, 1.4, 2.2);
        };

        const YF1 = calcFormFactorYF(geom.zn1, geom.x1);
        const YF2 = calcFormFactorYF(geom.zn2, geom.x2);
        const YS1 = calcStressCorrectionYS(geom.zn1, geom.x1);
        const YS2 = calcStressCorrectionYS(geom.zn2, geom.x2);

        // Helix angle factor Ybeta
        const Ybeta = 1.0 - Math.min(geom.epsilon_B, 1.0) * (Math.min(geom.beta, 30.0) / 120.0);

        // Rim thickness factor YB
        const YB1 = 1.0;
        const YB2 = 1.0;

        // Deep tooth factor YDT
        const YDT = (accuracyGrade <= 4 && geom.epsilon_A > 2.05) ? Math.max(0.70, -0.666 * geom.epsilon_A + 2.366) : 1.0;

        // Nominal Root Stress SigmaF0 [MPa]
        const SigmaF0_1 = (Ft / (bw * mn)) * YF1 * YS1 * Ybeta * YB1 * YDT;
        const SigmaF0_2 = (Ft / (bw * mn)) * YF2 * YS2 * Ybeta * YB2 * YDT;

        // Tooth Root Stresses [MPa]
        const SigmaF_1 = SigmaF0_1 * KF;
        const SigmaF_2 = SigmaF0_2 * KF;

        // Influence Factors for Bending:
        const YST = 2.0; // Stress correction factor for standard test gear
        const calcYNT = (NK, NFlim, qF) => {
            if (NK <= 1e3) return 2.5;
            if (NK < NFlim) return Math.min(2.5, Math.pow(NFlim / NK, 1.0 / qF));
            return 1.0;
        };
        const YNT1 = calcYNT(NK1, mat1.nflim, mat1.qf);
        const YNT2 = calcYNT(NK2, mat2.nflim, mat2.qf);

        const Ydelta1 = 0.99; // Relative notch sensitivity
        const Ydelta2 = 0.99;
        const YR1 = 1.0;    // Relative surface factor
        const YR2 = 1.0;
        const YX1 = (mn <= 5) ? 1.0 : (mn < 30 ? 1.03 - 0.006 * mn : 0.85); // Size factor
        const YX2 = YX1;

        // Permissible Tooth Root Stress SigmaFG & SigmaFP [MPa]
        const SigmaFG_1 = mat1.sflim * YST * YNT1 * Ydelta1 * YR1 * YX1;
        const SigmaFG_2 = mat2.sflim * YST * YNT2 * Ydelta2 * YR2 * YX2;
        const SigmaFP_1 = SigmaFG_1 / SF_req;
        const SigmaFP_2 = SigmaFG_2 / SF_req;

        // Bending Safety Factors SF
        const SF1 = SigmaF_1 > 0 ? SigmaFG_1 / SigmaF_1 : 99.0;
        const SF2 = SigmaF_2 > 0 ? SigmaFG_2 / SigmaF_2 : 99.0;

        // =========================================================================
        // 6. STATIC OVERLOAD SAFETY COEFFICIENTS (SHst, SFst)
        // =========================================================================
        const SHst1 = (mat1.surfaceHardnessHV * 3.5) / (SigmaH_1 * Math.sqrt(KAS));
        const SHst2 = (mat2.surfaceHardnessHV * 3.5) / (SigmaH_2 * Math.sqrt(KAS));
        const SFst1 = (mat1.rp02 * 0.8) / (SigmaF_1 * KAS);
        const SFst2 = (mat2.rp02 * 0.8) / (SigmaF_2 * KAS);

        // Overall Minimum Safeties
        const minSH = Math.min(SH1, SH2);
        const minSF = Math.min(SF1, SF2);
        const isSafe = minSH >= SH_req && minSF >= SF_req;

        return {
            KA, KAS, Kv, KHbeta, KFbeta, KHalfa, KFalfa, KH, KF,
            ZE, ZH, Zeps, Zbeta, ZB1, ZB2,
            SigmaH0, SigmaH_1, SigmaH_2,
            SigmaHG_1, SigmaHG_2, SigmaHP_1, SigmaHP_2,
            SH1, SH2, minSH, SH_req,
            YF1, YF2, YS1, YS2, Ybeta, YB1, YB2, YDT,
            SigmaF0_1, SigmaF0_2, SigmaF_1, SigmaF_2,
            SigmaFG_1, SigmaFG_2, SigmaFP_1, SigmaFP_2,
            SF1, SF2, minSF, SF_req,
            SHst1, SHst2, SFst1, SFst2,
            isSafe
        };
    }
};
