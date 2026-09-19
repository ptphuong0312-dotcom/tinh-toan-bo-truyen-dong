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
     * Involute function for angle in degrees
     * @param {number} alphaDeg - angle in degrees
     * @returns {number} involute value
     */
    inv(alphaDeg) {
        const rad = this.degToRad(alphaDeg);
        return Math.tan(rad) - rad;
    },

    /**
     * High-precision Inverse Involute solver: finds alpha (in radians) such that inv(alpha) = invVal
     * Uses Newton-Raphson iteration with cubic root initial approximation
     * @param {number} invVal - involute value
     * @returns {number} alpha in radians
     */
    inverseInvoluteRad(invVal) {
        if (invVal <= 0) return 0;

        // Initial approximation: for small angles, inv(alpha) ~ alpha^3 / 3 => alpha ~ (3 * invVal)^(1/3)
        let alpha = Math.pow(3 * invVal, 1 / 3);

        // Newton-Raphson iterations: f(alpha) = tan(alpha) - alpha - invVal
        // f'(alpha) = sec^2(alpha) - 1 = tan^2(alpha)
        for (let i = 0; i < 20; i++) {
            const tanA = Math.tan(alpha);
            const f = tanA - alpha - invVal;
            const df = tanA * tanA; // tan^2(alpha)
            if (Math.abs(df) < 1e-14) break;
            const delta = f / df;
            alpha -= delta;
            if (Math.abs(delta) < 1e-12) break;
        }
        return alpha;
    },

    /**
     * High-precision Inverse Involute solver: returns angle in degrees
     * @param {number} invVal - involute value
     * @returns {number} alpha in degrees
     */
    invol(invVal) {
        return this.radToDeg(this.inverseInvoluteRad(invVal));
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
