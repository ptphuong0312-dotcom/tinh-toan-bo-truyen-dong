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
        const invAlfat = MathUtils.invRad(alfatRad);
        const invAlfawt = 2.0 * sumX / (z1 + z2) * tanAlfan + invAlfat;
        const alfawtRad = MathUtils.inverseInvoluteRad(invAlfawt);
        const alfawt = MathUtils.radToDeg(alfawtRad);

        // Operating normal pressure angle (alfawn)
        const invAlfan = MathUtils.invRad(alfanRad);
        const invAlfawn = 2.0 * sumX / (z1 + z2) * tanAlfan + invAlfan;
        const alfawnRad = MathUtils.inverseInvoluteRad(invAlfawn);
        const alfawn = MathUtils.radToDeg(alfawnRad);

        // 10. Working (Operating) center distance
        const cosAlfat = Math.cos(alfatRad);
        const cosAlfawt = Math.cos(alfawtRad);
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
        const sn1 = mn * (Math.PI / 2.0 + 2.0 * x1 * tanAlfan);
        const sn2 = mn * (Math.PI / 2.0 + 2.0 * x2 * tanAlfan);
        const st1 = cosBeta !== 0 ? sn1 / cosBeta : sn1;
        const st2 = cosBeta !== 0 ? sn2 / cosBeta : sn2;

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

        // 17. Contact Ratios (Transverse, Overlap, Total)
        // Transverse contact ratio ea:
        const tanAlfaA1 = Math.tan(alfaAt1Rad);
        const tanAlfaA2 = Math.tan(alfaAt2Rad);
        const tanAlfawt = Math.tan(alfawtRad);

        const epsilon_A = (z1 / (2 * Math.PI)) * (tanAlfaA1 - tanAlfawt) +
                          (z2 / (2 * Math.PI)) * (tanAlfaA2 - tanAlfawt);

        // Overlap ratio eb (face contact ratio):
        const epsilon_B = (bw * Math.sin(Math.abs(betaRad))) / (Math.PI * mn);

        // Total contact ratio eg:
        const epsilon_G = epsilon_A + epsilon_B;

        // 18. Virtual number of teeth (helical gears)
        const cosBetab = Math.cos(betabRad);
        const zn1 = (cosBeta !== 0 && cosBetab !== 0) ? z1 / (cosBeta * cosBetab * cosBetab) : z1;
        const zn2 = (cosBeta !== 0 && cosBetab !== 0) ? z2 / (cosBeta * cosBetab * cosBetab) : z2;

        // 19. Minimum teeth to prevent undercutting
        const sin2Alfat = Math.sin(alfatRad) * Math.sin(alfatRad);
        const zmin_theory1 = sin2Alfat !== 0 ? (2.0 * (ha0 - x1)) / sin2Alfat : 17;
        const zmin_theory2 = sin2Alfat !== 0 ? (2.0 * (ha0 - x2)) / sin2Alfat : 17;
        const zmin_undercut1 = Math.round(zmin_theory1);
        const zmin_undercut2 = Math.round(zmin_theory2);
        const zmin_permissible1 = Math.round(zmin_theory1 * 5.0 / 6.0);
        const zmin_permissible2 = Math.round(zmin_theory2 * 5.0 / 6.0);

        // 20. Specific sliding at tooth root and tip
        const term1 = 2.0 * aw * Math.sin(alfawtRad);
        const radDa1Db1 = Math.sqrt(Math.max(0, da1 * da1 - db1 * db1));
        const radDa2Db2 = Math.sqrt(Math.max(0, da2 * da2 - db2 * db2));

        let thetaA1 = 0, thetaE1 = 0, thetaA2 = 0, thetaE2 = 0;
        if (term1 - radDa2Db2 !== 0 && radDa2Db2 !== 0) {
            thetaA1 = 1.0 - (z1 / z2) * (radDa2Db2 / (term1 - radDa2Db2));
        }
        if (radDa1Db1 !== 0) {
            thetaE1 = 1.0 - (z1 / z2) * ((term1 - radDa1Db1) / radDa1Db1);
        }
        if (term1 - radDa1Db1 !== 0 && radDa1Db1 !== 0) {
            thetaA2 = 1.0 - (z2 / z1) * (radDa1Db1 / (term1 - radDa1Db1));
        }
        if (radDa2Db2 !== 0) {
            thetaE2 = 1.0 - (z2 / z1) * ((term1 - radDa2Db2) / radDa2Db2);
        }
        const thetaSum = Math.abs(thetaA1) + Math.abs(thetaE1) + Math.abs(thetaA2) + Math.abs(thetaE2);

        // Transmission ratios
        const actual_i = z1 !== 0 ? z2 / z1 : 1.0;
        const target_i = parseFloat(p.target_i) || actual_i;
        const ratio_deviation = target_i !== 0 ? ((actual_i - target_i) / target_i) * 100 : 0;

        return {
            mn, z1, z2, alfa_n, beta, b1, b2, bw, x1, x2, sumX,
            ha0, hf0, ra0, ca_star,
            mt, alfat, betab,
            p_n, pt, ptb,
            d1, d2, db1, db2, df1, df2, da1, da2, dw1, dw2,
            ha1, ha2, hf1, hf2, h1, h2,
            a, av, aw,
            alfawn, alfawt,
            sn1, sn2, st1, st2,
            sta1, sta2, sna1, sna2, sa1_star, sa2_star,
            epsilon_A, epsilon_B, epsilon_G,
            epsilon_alpha: epsilon_A,
            epsilon_gamma: epsilon_G,
            zn1, zn2,
            zmin_undercut1, zmin_undercut2,
            zmin_permissible1, zmin_permissible2,
            zmin1: zmin_permissible1,
            zmin2: zmin_undercut1,
            zmin3: Math.round(zmin_theory1 * 1.3),
            thetaA1, thetaE1, thetaA2, thetaE2, thetaSum,
            theta_A1: thetaA1, theta_A2: thetaA2, theta_E1: thetaE1, theta_E2: thetaE2, sum_theta: thetaSum,
            actual_i, target_i, ratio_deviation,
            i: actual_i,
            psi_d: d1 > 0 ? b1 / d1 : 1.0,
            mass: MathUtils.round(Math.PI * (da1 * da1 * b1 + da2 * da2 * b2) * 7.85e-6 / 4.0, 2)
        };
    }
};
