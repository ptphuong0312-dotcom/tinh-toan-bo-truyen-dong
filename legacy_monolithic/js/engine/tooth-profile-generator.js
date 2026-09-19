/**
 * MITCalc Web App - Exact Involute Tooth Profile Generator
 * Generates continuous, 100% symmetric Cartesian (X, Y) coordinates of true involute tooth flanks,
 * smooth root fillets, tip lands, and root bottoms for 2D Canvas rendering and CAD export.
 */

import { MathUtils } from './math-utils.js';

export const ToothProfileGenerator = {
    /**
     * Generates complete 2D polygon points for an external cylindrical gear
     * @param {number} z - number of teeth
     * @param {number} m - normal module (mm)
     * @param {number} alphaDeg - pressure angle (deg)
     * @param {number} x - profile shift coefficient
     * @param {number} d - reference pitch diameter (mm)
     * @param {number} db - base diameter (mm)
     * @param {number} da - tip diameter (mm)
     * @param {number} df - root diameter (mm)
     * @param {number} [filletFactor=0.38] - tool tip fillet factor (ra0*)
     * @returns {Array<{x: number, y: number}>} continuous contour points
     */
    generateProfile(z, m, alphaDeg, x, d, db, da, df, filletFactor = 0.38) {
        const ra = da / 2.0;
        const rf = df / 2.0;
        const rb = db / 2.0;

        const alphaRad = MathUtils.degToRad(alphaDeg);
        const invAlpha = MathUtils.invRad(alphaRad);
        const pitchAngle = (2.0 * Math.PI) / z;
        const halfPitch = Math.PI / z;

        // Half tooth thickness angle at reference pitch circle r:
        const psi = (Math.PI / (2.0 * z)) + (2.0 * x * Math.tan(alphaRad)) / z;

        // Involute angle at tip circle:
        const cosTip = MathUtils.clamp(rb / ra, 0.0, 1.0);
        const alphaTip = Math.acos(cosTip);
        const psiTip = psi + invAlpha - MathUtils.invRad(alphaTip);

        // Form radius where involute flank transitions to root fillet:
        // When rf < rb (pinion), involute extends down to rb.
        // When rf >= rb (gear with large z), involute extends down to rf.
        const rForm = Math.max(rb, rf);
        const cosForm = MathUtils.clamp(rb / rForm, 0.0, 1.0);
        const alphaForm = Math.acos(cosForm);
        const thForm = psi + invAlpha - MathUtils.invRad(alphaForm);

        const deltaTh = halfPitch - thForm;
        const tanAlphaForm = Math.max(1e-4, Math.tan(alphaForm));
        const drDthForm = rForm / tanAlphaForm;

        // Number of samples per segment for high-fidelity CAD rendering:
        const numTipPts = 4;
        const numFlankPts = 24;
        const numFilletPts = 16;

        // Construct right half of single tooth (from theta = 0 to +halfPitch):
        const halfTooth = [];

        // 1. Tip arc (theta from 0 to psiTip at radius ra):
        for (let i = 0; i < numTipPts; i++) {
            const u = i / (numTipPts - 1);
            const th = psiTip * u;
            halfTooth.push({ r: ra, th: th });
        }

        // 2. Involute flank (from ra down to rForm):
        for (let i = 1; i <= numFlankPts; i++) {
            const u = i / numFlankPts;
            const cr = ra - (ra - rForm) * u;
            const cosY = MathUtils.clamp(rb / cr, 0.0, 1.0);
            const ay = Math.acos(cosY);
            const th = psi + invAlpha - MathUtils.invRad(ay);
            halfTooth.push({ r: cr, th: th });
        }

        // 3. Smooth C1 root fillet (from rForm down to rf at halfPitch):
        // Connects smoothly to root circle rf with horizontal tangent (dr/dth = 0 at halfPitch):
        for (let i = 1; i <= numFilletPts; i++) {
            const t = i / numFilletPts;
            const h00 = 2.0 * t * t * t - 3.0 * t * t + 1.0;
            const h01 = -2.0 * t * t * t + 3.0 * t * t;
            const h10 = t * t * t - 2.0 * t * t + t;
            let cr = h00 * rForm + h01 * rf + h10 * (-drDthForm * deltaTh * 0.4);
            cr = Math.max(rf, Math.min(rForm, cr));
            const th = thForm + deltaTh * t;
            halfTooth.push({ r: cr, th: th });
        }

        // Build complete single symmetric tooth from -halfPitch to +halfPitch:
        // Left half (mirrored, reversed order):
        const fullTooth = [];
        for (let i = halfTooth.length - 1; i >= 1; i--) {
            const pt = halfTooth[i];
            const ang = -pt.th;
            fullTooth.push({
                x: pt.r * Math.cos(ang),
                y: pt.r * Math.sin(ang)
            });
        }
        // Right half (from center to +halfPitch):
        for (let i = 0; i < halfTooth.length; i++) {
            const pt = halfTooth[i];
            const ang = pt.th;
            fullTooth.push({
                x: pt.r * Math.cos(ang),
                y: pt.r * Math.sin(ang)
            });
        }

        // Replicate tooth pattern for all z teeth:
        const points = [];
        for (let k = 0; k < z; k++) {
            const phiK = k * pitchAngle;
            const cosK = Math.cos(phiK);
            const sinK = Math.sin(phiK);
            for (let j = 0; j < fullTooth.length; j++) {
                const pt = fullTooth[j];
                points.push({
                    x: pt.x * cosK - pt.y * sinK,
                    y: pt.x * sinK + pt.y * cosK
                });
            }
        }

        return points;
    }
};
