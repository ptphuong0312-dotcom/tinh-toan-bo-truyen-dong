/**
 * MITCalc Web App - Exact Involute Tooth Profile Generator
 * Generates continuous, 100% symmetric Cartesian (X, Y) coordinates of true involute tooth flanks,
 * true circular root fillets (R = 0.38*m), root land arcs, and tip lands for 2D Canvas rendering and CAD export.
 * Standards: ISO 6336, DIN 3960, ISO 1122-1
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
        const rho = Math.max(0.05, filletFactor * m); // Fillet radius R (mm)

        const alphaRad = MathUtils.degToRad(alphaDeg);
        const invAlpha = MathUtils.invRad(alphaRad);
        const pitchAngle = (2.0 * Math.PI) / z;
        const halfPitch = Math.PI / z;

        // Half tooth thickness angle at reference pitch circle r:
        const psi = (Math.PI / (2.0 * z)) + (2.0 * x * Math.tan(alphaRad)) / z;

        // Helper to evaluate a point on the involute flank in tooth-centered polar coordinates:
        // Tooth centerline is along +X axis (theta = 0)
        const getInvolutePolar = (cr) => {
            const cosY = MathUtils.clamp(rb / cr, 0.0, 1.0);
            const ay = Math.acos(cosY);
            const invAy = Math.tan(ay) - ay;
            const th = psi + invAlpha - invAy;
            const px = cr * Math.cos(th);
            const py = cr * Math.sin(th);
            // Unit normal pointing outwards into tooth space (+theta direction):
            const angNorm = th - ay + Math.PI / 2.0;
            const nx = Math.cos(angNorm);
            const ny = Math.sin(angNorm);
            return { cr, th, px, py, nx, ny, ay };
        };

        // Involute angle at tip circle:
        const cosTip = MathUtils.clamp(rb / ra, 0.0, 1.0);
        const alphaTip = Math.acos(cosTip);
        const psiTip = psi + invAlpha - MathUtils.invRad(alphaTip);

        // 1. Tip Arc: from theta = 0 to psiTip at radius ra
        const numTipPts = 5;
        const halfTooth = [];
        for (let i = 0; i < numTipPts; i++) {
            const u = i / (numTipPts - 1);
            const th = psiTip * u;
            halfTooth.push({
                x: ra * Math.cos(th),
                y: ra * Math.sin(th)
            });
        }

        // Solve for transition point between involute and circular root fillet:
        // Target distance of fillet center to origin is Rc = rf + rho (tangent to root circle rf)
        const targetRc = rf + rho;
        const lowR = rb;
        const highR = ra;

        // Check if involute meets root fillet directly (typical when rf >= rb or close)
        const basePt = getInvolutePolar(rb);
        const baseCx = basePt.px + rho * basePt.nx;
        const baseCy = basePt.py + rho * basePt.ny;
        const baseRc = Math.sqrt(baseCx * baseCx + baseCy * baseCy);

        let rt = rb;
        let filletCenterX = baseCx;
        let filletCenterY = baseCy;
        let hasRadialSegment = false;
        let crRadial = rb;

        if (targetRc < baseRc) {
            // Fillet center lies below base circle: flank has radial extension from rb down to fillet
            hasRadialSegment = true;
            rt = rb;
            crRadial = Math.sqrt(Math.max(0.0, targetRc * targetRc - rho * rho));
            filletCenterX = crRadial * Math.cos(basePt.th) - rho * Math.sin(basePt.th);
            filletCenterY = crRadial * Math.sin(basePt.th) + rho * Math.cos(basePt.th);
        } else {
            // Solve by bisection on involute curve for Rc(cr) == targetRc
            let low = lowR;
            let high = highR;
            for (let iter = 0; iter < 40; iter++) {
                const mid = (low + high) / 2.0;
                const pt = getInvolutePolar(mid);
                const cx = pt.px + rho * pt.nx;
                const cy = pt.py + rho * pt.ny;
                const curRc = Math.sqrt(cx * cx + cy * cy);
                if (Math.abs(curRc - targetRc) < 1e-5) {
                    rt = mid;
                    break;
                }
                if (curRc > targetRc) {
                    high = mid;
                } else {
                    low = mid;
                }
                rt = mid;
            }
            const solPt = getInvolutePolar(rt);
            filletCenterX = solPt.px + rho * solPt.nx;
            filletCenterY = solPt.py + rho * solPt.ny;
        }

        // 2. Involute Flank: from ra down to rt
        const numFlankPts = 24;
        for (let i = 1; i <= numFlankPts; i++) {
            const u = i / numFlankPts;
            const cr = ra - (ra - rt) * u;
            const pt = getInvolutePolar(cr);
            halfTooth.push({ x: pt.px, y: pt.py });
        }

        // 2b. Radial segment (if applicable for small pinions where rf < rb)
        if (hasRadialSegment && crRadial < rb) {
            const numRadial = 4;
            for (let i = 1; i <= numRadial; i++) {
                const u = i / numRadial;
                const cr = rb - (rb - crRadial) * u;
                halfTooth.push({
                    x: cr * Math.cos(basePt.th),
                    y: cr * Math.sin(basePt.th)
                });
            }
        }

        // 3. True Circular Root Fillet Arc (Radius R = rho):
        // Fillet begins tangent to the flank at transition point
        const transPt = halfTooth[halfTooth.length - 1];
        const angFilletStart = Math.atan2(transPt.y - filletCenterY, transPt.x - filletCenterX);

        // Fillet ends tangent to the root circle rf
        const angCenter = Math.atan2(filletCenterY, filletCenterX);
        const rootTanX = rf * Math.cos(angCenter);
        const rootTanY = rf * Math.sin(angCenter);
        const angFilletEnd = Math.atan2(rootTanY - filletCenterY, rootTanX - filletCenterX);

        let deltaFillet = angFilletEnd - angFilletStart;
        while (deltaFillet > Math.PI) deltaFillet -= 2.0 * Math.PI;
        while (deltaFillet < -Math.PI) deltaFillet += 2.0 * Math.PI;

        const numFilletPts = 16;
        for (let i = 1; i <= numFilletPts; i++) {
            const u = i / numFilletPts;
            const curAng = angFilletStart + deltaFillet * u;
            halfTooth.push({
                x: filletCenterX + rho * Math.cos(curAng),
                y: filletCenterY + rho * Math.sin(curAng)
            });
        }

        // 4. Root Land Arc: along circle rf from angCenter to halfPitch (center of tooth gap)
        const numLandPts = 6;
        if (halfPitch > angCenter) {
            for (let i = 1; i <= numLandPts; i++) {
                const u = i / numLandPts;
                const curTh = angCenter + (halfPitch - angCenter) * u;
                halfTooth.push({
                    x: rf * Math.cos(curTh),
                    y: rf * Math.sin(curTh)
                });
            }
        }

        // 5. Construct complete symmetric single tooth:
        // Left half is mirrored across X axis (y -> -y, in reverse order):
        const fullTooth = [];
        for (let i = halfTooth.length - 1; i >= 1; i--) {
            fullTooth.push({
                x: halfTooth[i].x,
                y: -halfTooth[i].y
            });
        }
        // Right half (from tip center to +halfPitch):
        for (let i = 0; i < halfTooth.length; i++) {
            fullTooth.push({
                x: halfTooth[i].x,
                y: halfTooth[i].y
            });
        }

        // 6. Replicate tooth pattern for all z teeth:
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
