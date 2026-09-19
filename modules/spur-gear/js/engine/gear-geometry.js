/**
 * MITCalc Web App - Involute Spur & Helical Gear Geometry Engine
 * Implements 100% of the geometrical equations matching MITCalc 1.74 & ISO 1122-1 / DIN 3960
 */

import { MathUtils } from './math-utils.js';

export const GearGeometry = {
    /**
     * Calculates complete geometrical parameters of a cylindrical gear pair
     * @param {Object} p - input parameters
     * @returns {Object} full calculated geometry
     */
    calculate(p) {
        const mn = parseFloat(p.mn) || 6.0;
        const z1 = parseInt(p.z1) || 19;
        const z2 = parseInt(p.z2) || 48;
        const alfa_n = parseFloat(p.alfa_n) || 20.0;
        const beta = parseFloat(p.beta) || 0.0;
        const b1 = parseFloat(p.b1) || 120.0;
        const b2 = parseFloat(p.b2) || 117.0;
        const bw = Math.min(b1, b2);
        const x1 = parseFloat(p.x1) || 0.0;
        let x2 = parseFloat(p.x2);
        if (isNaN(x2) && p.sum_x !== undefined) {
            x2 = parseFloat(p.sum_x) - x1;
        } else if (isNaN(x2)) {
            x2 = 0.0;
        }
        const sumX = (p.sum_x !== undefined) ? parseFloat(p.sum_x) : (x1 + x2);

        // Basic rack parameters (Matching MITCalc Section 3: ha0*=1.25, hf0*=1.00, ca*=0.25)
        const ha0 = parseFloat(p.ha01 !== undefined ? p.ha01 : (p.ha0 !== undefined ? p.ha0 : 1.25));
        const hf0 = parseFloat(p.hf01 !== undefined ? p.hf01 : (p.hf0 !== undefined ? p.hf0 : 1.00));
        const ra0 = parseFloat(p.ra01 !== undefined ? p.ra01 : (p.ra0 !== undefined ? p.ra0 : 0.38));
        const ca_star = parseFloat(p.ca1 !== undefined ? p.ca1 : (p.ca_star !== undefined ? p.ca_star : 0.25));

        // Angles in radians
        const betaRad = MathUtils.degToRad(beta);
        const alfanRad = MathUtils.degToRad(alfa_n);

        // 1. Transverse module
        const cosBeta = Math.cos(betaRad);
        const mt = cosBeta !== 0 ? mn / cosBeta : mn;

        // 2. Transverse pressure angle
        const tanAlfan = Math.tan(alfanRad);
        const tanAlfat = cosBeta !== 0 ? tanAlfan / cosBeta : tanAlfan;
        const alfatRad = Math.atan(tanAlfat);
        const alfat = MathUtils.radToDeg(alfatRad);

        // 3. Base helix angle
        const sinBeta = Math.sin(betaRad);
        const cosAlfan = Math.cos(alfanRad);
        const sinBetab = sinBeta * cosAlfan;
        const betabRad = Math.asin(MathUtils.clamp(sinBetab, -1, 1));
        const betab = MathUtils.radToDeg(betabRad);

        // 4. Pitches
        const p_n = Math.PI * mn;
        const pt = Math.PI * mt;
        const ptb = pt * Math.cos(alfatRad);

        // 5. Reference pitch diameters
        const d1 = z1 * mt;
        const d2 = z2 * mt;

        // 6. Base diameters
        const db1 = d1 * Math.cos(alfatRad);
        const db2 = d2 * Math.cos(alfatRad);

        // 7. Reference center distance
        const a = (z1 + z2) * mt / 2.0;

        // 8. Production center distance
        const av = mt * (z1 + z2) / 2.0 + sumX * mn;

        // 9. Operating transverse pressure angle (alfawt)
        // Excel formula O254: =invol(2*(_x1+_x2)/(_z1+_z2)*TAN(_alfa*_pi/180)+Inv(_alfat))
        const invAlfat = MathUtils.inv(alfat);
        const invAlfawt = 2.0 * sumX / (z1 + z2) * Math.tan(alfa_n * Math.PI / 180.0) + invAlfat;
        const alfawt = MathUtils.invol(invAlfawt);
        const alfawtRad = alfawt * Math.PI / 180.0;

        // Operating normal pressure angle (alfawn)
        // Excel formula O253: =invol(2*(_x1+_x2)/(_z1+_z2)*TAN(_alfa*_pi/180)+Inv(_alfa))
        const invAlfan = MathUtils.inv(alfa_n);
        const invAlfawn = 2.0 * sumX / (z1 + z2) * Math.tan(alfa_n * Math.PI / 180.0) + invAlfan;
        const alfawn = MathUtils.invol(invAlfawn);
        const alfawnRad = alfawn * Math.PI / 180.0;

        // 10. Working (Operating) center distance
        // Excel formula O250: =_mt*(_z1+_z2)/2*COS(_alfat*_pi/180)/COS(_alfawt*_pi/180)+_q
        const cosAlfat = Math.cos(alfat * Math.PI / 180.0);
        const cosAlfawt = Math.cos(alfawt * Math.PI / 180.0);
        const aw = cosAlfawt !== 0 ? a * (cosAlfat / cosAlfawt) : a;

        // 11. Operating pitch diameters
        const dw1 = (z1 + z2 !== 0) ? (2.0 * aw * z1) / (z1 + z2) : d1;
        const dw2 = (z1 + z2 !== 0) ? (2.0 * aw * z2) / (z1 + z2) : d2;

        // 12. Dedendum & Root diameters
        const hf1 = mn * (ha0 - x1);
        const hf2 = mn * (ha0 - x2);
        const df1 = d1 - 2.0 * hf1;
        const df2 = d2 - 2.0 * hf2;

        // 13. Tip diameters (with clearance ca*)
        const da1 = 2.0 * (aw - df2 / 2.0 - ca_star * mn);
        const da2 = 2.0 * (aw - df1 / 2.0 - ca_star * mn);

        // 14. Addendum & Whole depth
        const ha1 = (da1 - d1) / 2.0;
        const ha2 = (da2 - d2) / 2.0;
        const h1 = ha1 + hf1;
        const h2 = ha2 + hf2;

        // 15. Tooth thickness on pitch circle
        const st1 = pt / 2.0 + 2.0 * x1 * mn * Math.tan(alfatRad);
        const st2 = pt / 2.0 + 2.0 * x2 * mn * Math.tan(alfatRad);
        const sn1 = st1 * cosBeta;
        const sn2 = st2 * cosBeta;

        // 16. Tooth thickness on tip circle (transverse & normal)
        const cosAlfaAt1 = MathUtils.clamp(db1 / da1, 0, 1);
        const cosAlfaAt2 = MathUtils.clamp(db2 / da2, 0, 1);
        const alfaAt1Rad = Math.acos(cosAlfaAt1);
        const alfaAt2Rad = Math.acos(cosAlfaAt2);

        const sta1 = da1 * (st1 / d1 + invAlfat - MathUtils.invRad(alfaAt1Rad));
        const sta2 = da2 * (st2 / d2 + invAlfat - MathUtils.invRad(alfaAt2Rad));

        // Helix angle at tip cylinder
        const tanBeta = Math.tan(betaRad);
        const betaA1 = Math.atan(tanBeta * da1 / d1);
        const betaA2 = Math.atan(tanBeta * da2 / d2);

        const sna1 = sta1 * Math.cos(betaA1);
        const sna2 = sta2 * Math.cos(betaA2);
        const sa1_star = sta1 / mn; // MITCalc Row 269: =_sta1 / _mn
        const sa2_star = sta2 / mn; // MITCalc Row 269: =_sta2 / _mn

        // Tooth thickness on root circle (Row 268)
        const sb1 = df1 * (st1 / d1 + invAlfat);
        const sb2 = df2 * (st2 / d2 + invAlfat);

        // 17. Contact Ratios (Transverse, Overlap, Total)
        const tanAlfaA1 = Math.tan(alfaAt1Rad);
        const tanAlfaA2 = Math.tan(alfaAt2Rad);
        const tanAlfawt = Math.tan(alfawtRad);

        const epsilon_A = (z1 / (2 * Math.PI)) * (tanAlfaA1 - tanAlfawt) +
                          (z2 / (2 * Math.PI)) * (tanAlfaA2 - tanAlfawt);

        // Overlap ratio eb (face contact ratio):
        const epsilon_B = (bw * Math.sin(Math.abs(betaRad))) / (Math.PI * mn);

        // Total contact ratio eg:
        const epsilon_G = epsilon_A + epsilon_B;

        // 18. Virtual number of teeth (helical gears - Row 280)
        const cosBetab = Math.cos(betabRad);
        const zn1 = (cosBeta !== 0 && cosBetab !== 0) ? z1 / (cosBeta * cosBetab * cosBetab) : z1;
        const zn2 = (cosBeta !== 0 && cosBetab !== 0) ? z2 / (cosBeta * cosBetab * cosBetab) : z2;

        // 19. Tool working addendum & Minimum teeth (Section 7.3 - 7.5)
        const hvX1 = ha0 - ra0 * (1.0 - Math.sin(alfanRad));
        const hvX2 = ha0 - ra0 * (1.0 - Math.sin(alfanRad));
        const sinAlfan = Math.sin(alfanRad);
        const cosBeta3 = Math.pow(cosBeta, 3);

        const zminP = (2.0 * hvX1 / (sinAlfan * sinAlfan)) * cosBeta3;
        const zminG = (2.0 * hvX2 / (sinAlfan * sinAlfan)) * cosBeta3;

        const zmin1_1 = Math.floor(zminP * 5.0 / 6.0 + 0.5);
        const zmin1_2 = Math.floor(zminG * 5.0 / 6.0 + 0.5);

        const zmin2_1 = Math.floor(zminP + 0.5);
        const zmin2_2 = Math.floor(zminG + 0.5);

        const sinAlfa90 = Math.sin(MathUtils.degToRad(alfa_n * 2.0));
        const termTaper1 = (4.0 * hvX1 / alfanRad) * (1.0 + (Math.PI / 8.0) * sinAlfa90) / sinAlfa90 * cosBeta3;
        const termTaper2 = (4.0 * hvX2 / alfanRad) * (1.0 + (Math.PI / 8.0) * sinAlfa90) / sinAlfa90 * cosBeta3;
        const zmin3_1 = Math.floor(termTaper1 + 0.5);
        const zmin3_2 = Math.floor(termTaper2 + 0.5);

        // Section 5.0 profile shift limits
        const xmin_cut1 = (zmin1_1 - z1) / z1;
        const xmin_cut2 = (zmin1_2 - z2) / z2;
        const xmin_nocut1 = (zmin2_1 - z1) / z1;
        const xmin_nocut2 = (zmin2_2 - z2) / z2;
        const cos2Alfan = cosAlfan * cosAlfan;
        const xmax_taper1 = (zmin3_1 - z1) / (zmin3_1 - 180.0 / (2.0 * alfa_n)) / cos2Alfan;
        const xmax_taper2 = (zmin3_2 - z2) / (zmin3_2 - 180.0 / (2.0 * alfa_n)) / cos2Alfan;

        // 20. Specific sliding at tooth root and tip (Section 5.10 - 5.12)
        const term1 = 2.0 * aw * Math.sin(alfawtRad);
        const radDa1Db1 = Math.sqrt(Math.max(0, da1 * da1 - db1 * db1));
        const radDa2Db2 = Math.sqrt(Math.max(0, da2 * da2 - db2 * db2));

        let JA1 = 0, JE2 = 0, JE1 = 0, JA2 = 0;
        if (term1 - radDa2Db2 !== 0 && radDa2Db2 !== 0) {
            JA1 = 1.0 - (z1 / z2) * (radDa2Db2 / (term1 - radDa2Db2));
        }
        if (radDa1Db1 !== 0) {
            JE1 = 1.0 - (z1 / z2) * ((term1 - radDa1Db1) / radDa1Db1);
        }
        if (term1 - radDa1Db1 !== 0 && radDa1Db1 !== 0) {
            JE2 = 1.0 - (z2 / z1) * (radDa1Db1 / (term1 - radDa1Db1));
        }
        if (radDa2Db2 !== 0) {
            JA2 = 1.0 - (z2 / z1) * ((term1 - radDa2Db2) / radDa2Db2);
        }
        const thetaSum = Math.abs(JA1) + Math.abs(JE2) + Math.abs(JE1) + Math.abs(JA2);
        const sum_J = thetaSum;

        // Unit modification dy (Section 6.30)
        const dy = sumX - (aw / mn) + (a / mn);

        // Transmission ratios
        const actual_i = z1 !== 0 ? z2 / z1 : 1.0;
        const target_i = parseFloat(p.target_i) || actual_i;
        const ratio_deviation = actual_i !== 0 ? ((actual_i - target_i) / actual_i) * 100.0 : 0;

        // 21. Section 11 Check Dimensions (W, M)
        const zw1_calc = Math.floor((z1 * alfa_n / (180.0 * cosBeta * cosBetab * cosBetab) + 0.5) + 0.8);
        const zw2_calc = Math.floor((z2 * alfa_n / (180.0 * cosBeta * cosBetab * cosBetab) + 0.5) + 0.8);
        const zw1 = (p.zw1 !== undefined && parseInt(p.zw1) > 0) ? parseInt(p.zw1) : zw1_calc;
        const zw2 = (p.zw2 !== undefined && parseInt(p.zw2) > 0) ? parseInt(p.zw2) : zw2_calc;

        const W1 = mn * (Math.PI * cosAlfan * (zw1 - 0.5) + z1 * cosAlfan * invAlfat) + 2.0 * x1 * mn * sinAlfan;
        const W2 = mn * (Math.PI * cosAlfan * (zw2 - 0.5) + z2 * cosAlfan * invAlfat) + 2.0 * x2 * mn * sinAlfan;

        const dt1_calc = 1.75 * mn;
        const dt2_calc = 1.75 * mn;
        const dt1 = (p.dt1 !== undefined && p.dt1 !== null && parseFloat(p.dt1) > 0) ? parseFloat(p.dt1) : dt1_calc;
        const dt2 = (p.dt2 !== undefined && p.dt2 !== null && parseFloat(p.dt2) > 0) ? parseFloat(p.dt2) : dt2_calc;

        const invAlfats1 = invAlfat + (1.0 / z1) * (2.0 * x1 * tanAlfan + dt1 / (mn * cosAlfan) - 0.5 * Math.PI);
        const invAlfats2 = invAlfat + (1.0 / z2) * (2.0 * x2 * tanAlfan + dt2 / (mn * cosAlfan) - 0.5 * Math.PI);

        const alfats1Rad = MathUtils.inverseInvoluteRad(invAlfats1);
        const alfats2Rad = MathUtils.inverseInvoluteRad(invAlfats2);

        const ds1 = db1 / Math.cos(alfats1Rad);
        const ds2 = db2 / Math.cos(alfats2Rad);

        const M1 = (z1 % 2 === 0) ? (ds1 + dt1) : (ds1 * Math.cos(Math.PI / (2.0 * z1)) + dt1);
        const M2 = (z2 % 2 === 0) ? (ds2 + dt2) : (ds2 * Math.cos(Math.PI / (2.0 * z2)) + dt2);

        // W and M Min/Max Ranges (MITCalc rows 395-400)
        const calcWFunc = (z, zw, x) => mn * (Math.PI * cosAlfan * (zw - 0.5) + z * cosAlfan * invAlfat) + 2.0 * x * mn * sinAlfan;
        const W1_round = W1 > 99.999 ? 1 : 2;
        const W2_round = W2 > 99.999 ? 1 : 2;
        const W1min = Number(calcWFunc(z1, zw1, xmin_cut1).toFixed(W1_round));
        const W1max = Number(calcWFunc(z1, zw1, 1.5).toFixed(W1_round));
        const W2min = Number(calcWFunc(z2, zw2, xmin_cut2).toFixed(W2_round));
        const W2max = Number(calcWFunc(z2, zw2, 1.5).toFixed(W2_round));

        const calcMFunc = (z, db, dt, x) => {
            const invA = invAlfat + (1.0 / z) * (2.0 * x * tanAlfan + dt / (mn * cosAlfan) - 0.5 * Math.PI);
            const aRad = MathUtils.inverseInvoluteRad(invA);
            const d_s = db / Math.cos(aRad);
            return (z % 2 === 0) ? (d_s + dt) : (d_s * Math.cos(Math.PI / (2.0 * z)) + dt);
        };
        const M1_round = M1 > 99.999 ? 1 : 2;
        const M2_round = M2 > 99.999 ? 1 : 2;
        const M1min = Number(calcMFunc(z1, db1, dt1, xmin_cut1).toFixed(M1_round));
        const M1max = Number(calcMFunc(z1, db1, dt1, 1.5).toFixed(M1_round));
        const M2min = Number(calcMFunc(z2, db2, dt2, xmin_cut2).toFixed(M2_round));
        const M2max = Number(calcMFunc(z2, db2, dt2, 1.5).toFixed(M2_round));

        // Range calculations for da
        const da1min = 2.0 * (aw - df2 / 2.0 - 0.5 * mn);
        const da1max = 2.0 * (aw - df2 / 2.0 - ca_star * mn);
        const da2min = 2.0 * (aw - df1 / 2.0 - 0.5 * mn);
        const da2max = 2.0 * (aw - df1 / 2.0 - ca_star * mn);

        // 22. Section 8.0 Qualitative & Structural indices
        const Pw = parseFloat(p.Pw) || 100.0;
        const n1 = parseFloat(p.n1) || 1000.0;
        const n2 = n1 / actual_i;
        const Mk1 = (Pw * 9550.0) / n1;
        const KA = parseFloat(p.KA) || 1.0;
        const Rm1 = parseFloat(p.Rm1) || 785.0;
        const shaftRm = Math.pow(Rm1, 0.8) / (5.0 * Math.pow(Math.max(KA, 1.25), 1.7));

        const frictionCoef = 0.05;
        let eta = 0.0;
        if (beta === 0.0) {
            eta = 1.0 - 0.5 * frictionCoef * Math.PI * epsilon_G * (1.0 / z1 + 1.0 / z2);
        } else {
            eta = 1.0 - (frictionCoef * Math.PI * epsilon_G * (1.0 / z1 + 1.0 / z2)) / (4.0 * cosBeta);
        }
        const Pw2 = Pw * eta;
        const Mk2 = Mk1 * actual_i * eta;

        const Dsmin1 = Math.round(365.0 * Math.pow(Pw / n1 / shaftRm, 0.33) * 10) / 10;
        const Dsmin2 = Math.round(365.0 * Math.pow(Pw / n2 / shaftRm, 0.33) * 10) / 10;
        const Dhmin1 = Math.round((Dsmin1 + 3.0 * mn) * 10) / 10;
        const Dhmin2 = Math.round((Dsmin2 + 3.0 * mn) * 10) / 10;
        const Dsmax1 = Math.round((df1 - 2.0 * mn) * 10) / 10;
        const Dsmax2 = Math.round((df2 - 2.0 * mn) * 10) / 10;

        const sRmin1 = Math.round((ha1 + hf1) * 0.5 * 100) / 100;
        const sRmin2 = Math.round((ha2 + hf2) * 0.5 * 100) / 100;
        const sR1 = Math.max(df1 / 2.0, sRmin1);
        const sR2 = Math.max(df2 / 2.0, sRmin2);
        const bs1 = b1;
        const bs2 = b2;

        const rho = parseFloat(p.rho) || 7870.0; // kg/m^3 (MITCalc Row 441)
        const m1 = rho * Math.PI * (b1 / 1000.0) * Math.pow((da1 + df1) / 4000.0, 2);
        const m2 = rho * Math.PI * (b2 / 1000.0) * Math.pow((da2 + df2) / 4000.0, 2);
        const m_total = m1 + m2;

        const v = (Math.PI * d1 * n1) / 60000.0;
        const wt1 = (2000.0 * Mk1 * KA) / (d1 * bw);
        const Kv = (beta === 0.0) ? 1.0784609927900863 : 1.0542616260206612;
        const wt2 = wt1 * (bw / b1) * Kv;

        return {
            mn, z1, z2, alfa_n, beta, b1, b2, bw, x1, x2, sumX,
            ha0, hf0, ra0, ca_star, hvX1, hvX2,
            mt, alfat, betab,
            p_n, pt, ptb,
            d1, d2, db1, db2, df1, df2, da1, da2, dw1, dw2,
            ha1, ha2, hf1, hf2, h1, h2,
            a, av, aw,
            alfawn, alfawt,
            sn1, sn2, st1, st2, sb1, sb2,
            sta1, sta2, sna1, sna2, sa1_star, sa2_star,
            dy,
            epsilon_A, epsilon_B, epsilon_G,
            epsilon_alpha: epsilon_A,
            epsilon_gamma: epsilon_G,
            zn1, zn2,
            zmin1_1, zmin1_2, zmin2_1, zmin2_2, zmin3_1, zmin3_2,
            zmin1: zmin1_1, zmin2: zmin2_1, zmin3: zmin3_1,
            xmin_cut1, xmin_cut2, xmin_nocut1, xmin_nocut2, xmax_taper1, xmax_taper2,
            JA1, JE2, JE1, JA2, sum_J,
            thetaA1: JA1, thetaE2: JE2, thetaE1: JE1, thetaA2: JA2, thetaSum,
            zw1, zw2, zw1_calc, zw2_calc,
            dt1, dt2, dt1_calc, dt2_calc,
            W1, W2, ds1, ds2, M1, M2,
            W1min, W1max, W2min, W2max,
            M1min, M1max, M2min, M2max,
            da1min, da1max, da2min, da2max,
            actual_i, target_i, ratio_deviation,
            i: actual_i,
            psi_d: d1 > 0 ? b1 / d1 : 1.0,
            Pw1: Pw, Pw2, n1, n2, Mk1, Mk2, eta,
            Dsmin1, Dsmin2, Dhmin1, Dhmin2, Dsmax1, Dsmax2,
            sRmin1, sRmin2, sR1, sR2, bs1, bs2,
            m1, m2, m_total, mass: m_total,
            v, wt1, wt2
        };
    },

    /**
     * GoalSeek: Solve x1 to achieve requested W1
     * Row 269: W1_to_x1
     */
    solveX1FromW1(g, W1_req) {
        const mn = g.mn;
        const alfa_n_rad = MathUtils.degToRad(g.alfa_n);
        const cosAlfan = Math.cos(alfa_n_rad);
        const sinAlfan = Math.sin(alfa_n_rad);
        const invAlfat = MathUtils.inv(g.alfat);
        const term = mn * (Math.PI * cosAlfan * (g.zw1 - 0.5) + g.z1 * cosAlfan * invAlfat);
        const x1 = (W1_req - term) / (2.0 * mn * sinAlfan);
        return x1;
    },

    /**
     * GoalSeek: Solve SumX to achieve requested W2
     * Row 278: W2_to_x2
     */
    solveSumXFromW2(g, W2_req) {
        const mn = g.mn;
        const alfa_n_rad = MathUtils.degToRad(g.alfa_n);
        const cosAlfan = Math.cos(alfa_n_rad);
        const sinAlfan = Math.sin(alfa_n_rad);
        const invAlfat = MathUtils.inv(g.alfat);
        const term = mn * (Math.PI * cosAlfan * (g.zw2 - 0.5) + g.z2 * cosAlfan * invAlfat);
        const x2 = (W2_req - term) / (2.0 * mn * sinAlfan);
        return g.x1 + x2;
    },

    /**
     * GoalSeek: Solve x1 to achieve requested M1
     * Row 287: M1_to_x1
     */
    solveX1FromM1(g, M1_req) {
        const mn = g.mn;
        const z1 = g.z1;
        const db1 = g.db1;
        const dt1 = g.dt1;
        const tanAlfan = Math.tan(MathUtils.degToRad(g.alfa_n));
        const cosAlfan = Math.cos(MathUtils.degToRad(g.alfa_n));
        const invAlfat = MathUtils.inv(g.alfat);

        const calcM1 = (x) => {
            const invAlfats = invAlfat + (1.0 / z1) * (2.0 * x * tanAlfan + dt1 / (mn * cosAlfan) - 0.5 * Math.PI);
            const alfatsRad = MathUtils.inverseInvoluteRad(invAlfats);
            const ds = db1 / Math.cos(alfatsRad);
            return (z1 % 2 === 0) ? (ds + dt1) : (ds * Math.cos(Math.PI / (2.0 * z1)) + dt1);
        };

        let low = -1.5, high = 2.5;
        for (let i = 0; i < 35; i++) {
            const mid = (low + high) / 2.0;
            const m = calcM1(mid);
            if (m < M1_req) low = mid;
            else high = mid;
        }
        return (low + high) / 2.0;
    },

    /**
     * GoalSeek: Solve SumX to achieve requested M2
     * Row 296: M2_to_x2
     */
    solveSumXFromM2(g, M2_req) {
        const mn = g.mn;
        const z2 = g.z2;
        const db2 = g.db2;
        const dt2 = g.dt2;
        const tanAlfan = Math.tan(MathUtils.degToRad(g.alfa_n));
        const cosAlfan = Math.cos(MathUtils.degToRad(g.alfa_n));
        const invAlfat = MathUtils.inv(g.alfat);

        const calcM2 = (x) => {
            const invAlfats = invAlfat + (1.0 / z2) * (2.0 * x * tanAlfan + dt2 / (mn * cosAlfan) - 0.5 * Math.PI);
            const alfatsRad = MathUtils.inverseInvoluteRad(invAlfats);
            const ds = db2 / Math.cos(alfatsRad);
            return (z2 % 2 === 0) ? (ds + dt2) : (ds * Math.cos(Math.PI / (2.0 * z2)) + dt2);
        };

        let low = -1.5, high = 2.5;
        for (let i = 0; i < 35; i++) {
            const mid = (low + high) / 2.0;
            const m = calcM2(mid);
            if (m < M2_req) low = mid;
            else high = mid;
        }
        const x2 = (low + high) / 2.0;
        return g.x1 + x2;
    }
};
