/**
 * MITCalc Web App - Mathematical Utilities & Involute Functions
 * Implements high-precision involute geometry and numerical solvers
 */

export const MathUtils = {
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    degToRad(degrees) {
        return degrees * this.DEG_TO_RAD;
    },

    radToDeg(radians) {
        return radians * this.RAD_TO_DEG;
    },

    /**
     * Standard Involute function: inv(alpha) = tan(alpha) - alpha (radians)
     * @param {number} alphaRad - angle in radians
     * @returns {number} involute value
     */
    invRad(alphaRad) {
        return Math.tan(alphaRad) - alphaRad;
    },

    /**
     * Exact MITCalc VBA Involute function: Inv(a)
     * a in degrees. Matches MITCalc 1.74 GearFunctions.bas line 764:
     * Inv = Tan(a * 3.141592653 / 180) - a * 3.141592653 / 180
     * @param {number} aDeg - angle in degrees
     * @returns {number} involute value
     */
    inv(aDeg) {
        const rad = aDeg * 3.141592653 / 180.0;
        return Math.tan(rad) - rad;
    },

    /**
     * Exact MITCalc VBA Involute inverse solver: Invol(X)
     * Direct 1-to-1 match with MITCalc 1.74 GearFunctions.bas line 770
     * @param {number} X - involute value
     * @returns {number} angle in degrees
     */
    invol(X) {
        const pi = 3.14159265358979;
        X = Math.abs(X);
        if (X < 0.00000001) X = 0.00000001;
        if (X > 1.5707963) X = 1.5707963;
        let pom = 1;
        let alfa = 0.0;
        let delta = X / 2.0;
        const presnost = 0.0000001;
        while (true) {
            alfa = alfa + delta;
            const x1 = Math.tan(alfa) - alfa;
            const rozdil = X - x1;
            if (Math.abs(rozdil) < presnost) break;
            if (pom > 1000000) break;
            if (rozdil < 0) {
                alfa = alfa - delta;
                delta = delta / 2.0;
            }
            pom++;
        }
        return alfa * 180.0 / pi;
    },

    /**
     * Inverse Involute solver returning radians
     * @param {number} invVal - involute value
     * @returns {number} alpha in radians
     */
    inverseInvoluteRad(invVal) {
        return this.invol(invVal) * Math.PI / 180.0;
    },

    /**
     * Linear interpolation helper
     */
    lerp(x, x0, x1, y0, y1) {
        if (x1 === x0) return y0;
        return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    },

    /**
     * Clamp a number between min and max
     */
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    /**
     * Round number to specified decimal places
     */
    round(val, decimals = 4) {
        if (val === null || val === undefined || isNaN(val)) return 0;
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
};
