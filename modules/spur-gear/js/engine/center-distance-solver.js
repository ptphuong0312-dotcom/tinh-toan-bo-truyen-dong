/**
 * MITCalc Web App - Center Distance Solver (Section 14)
 * Finds optimal gear tooth combinations and profile shifts for a requested axis distance aw_req
 */

import { MathUtils } from './math-utils.js';

export const CenterDistanceSolver = {
    /**
     * Solves for tooth combinations (z1, z2, SumX, beta) given a target working center distance aw_req
     * @param {Object} p - parameters: aw_req, target_i, mn, alfa_n, beta
     * @returns {Array} list of valid solutions sorted by minimum ratio deviation
     */
    findSolutions(p) {
        const aw_req = parseFloat(p.aw_req) || 200.0;
        const target_i = parseFloat(p.target_i) || 2.5;
        const mn = parseFloat(p.mn) || 6.0;
        const alfa_n = parseFloat(p.alfa_n) || 20.0;
        const beta = parseFloat(p.beta) || 0.0;

        const betaRad = MathUtils.degToRad(beta);
        const alfanRad = MathUtils.degToRad(alfa_n);
        const cosBeta = Math.cos(betaRad);
        const mt = cosBeta !== 0 ? mn / cosBeta : mn;

        const tanAlfan = Math.tan(alfanRad);
        const tanAlfat = cosBeta !== 0 ? tanAlfan / cosBeta : tanAlfan;
        const alfatRad = Math.atan(tanAlfat);
        const invAlfat = MathUtils.invRad(alfatRad);
        const cosAlfat = Math.cos(alfatRad);

        const solutions = [];

        // Search range for pinion teeth z1
        const z1_min = 12;
        const z1_max = 50;

        for (let z1 = z1_min; z1 <= z1_max; z1++) {
            // Check several integer z2 around target ratio
            const z2_base = Math.round(z1 * target_i);
            const z2_candidates = [z2_base - 1, z2_base, z2_base + 1];

            for (const z2 of z2_candidates) {
                if (z2 < z1) continue;

                // Reference center distance a
                const a = (z1 + z2) * mt / 2.0;

                // Ratio cos(alfat) * a / aw_req
                const cosAlfawt = (a * cosAlfat) / aw_req;

                // cosAlfawt must be between 0.70 and 0.999 (angles ~ 10° to 45°)
                if (cosAlfawt > 0.70 && cosAlfawt <= 1.0) {
                    const alfawtRad = Math.acos(cosAlfawt);
                    const invAlfawt = MathUtils.invRad(alfawtRad);

                    // Required sum of profile shift coefficients: SumX = x1 + x2
                    const sumX = ((z1 + z2) * (invAlfawt - invAlfat)) / (2.0 * tanAlfan);

                    // Practical limit for SumX is typically -0.6 to +1.2
                    if (sumX >= -0.8 && sumX <= 1.5) {
                        const actual_i = z2 / z1;
                        const dev_i = ((actual_i - target_i) / target_i) * 100.0;

                        // Distribution of SumX: x1 and x2
                        // Balanced specific sliding approximation
                        const x1 = MathUtils.round(sumX * 0.55, 4);
                        const x2 = MathUtils.round(sumX - x1, 4);

                        solutions.push({
                            id: solutions.length + 1,
                            z1,
                            z2,
                            sumZ: z1 + z2,
                            actual_i: MathUtils.round(actual_i, 3),
                            deviation_i: MathUtils.round(dev_i, 2),
                            alfawt: MathUtils.round(MathUtils.radToDeg(alfawtRad), 2),
                            sumX: MathUtils.round(sumX, 4),
                            x1,
                            x2,
                            aw: aw_req
                        });
                    }
                }
            }
        }

        // Sort by absolute deviation from target transmission ratio
        solutions.sort((a, b) => Math.abs(a.deviation_i) - Math.abs(b.deviation_i));

        return solutions.slice(0, 15); // Return top 15 solutions
    }
};
