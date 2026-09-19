/**
 * MITCalc Web App - Gear Transmission Forces, Efficiency & Thermal Engine
 * Implements force resolution, mechanical efficiency, power dissipation, and shaft sizing
 */

import { MathUtils } from './math-utils.js';

export const GearForces = {
    /**
     * Calculates all force components, power transmission, efficiency, and thermal requirements
     * @param {Object} geom - geometry object from GearGeometry.calculate()
     * @param {Object} p - operational parameters
     * @returns {Object} calculated forces and thermal data
     */
    calculate(geom, p) {
        const Pw = parseFloat(p.Pw) || 100.0; // kW
        const n1 = parseFloat(p.n1) || 1000.0; // rpm
        const i = geom.actual_i || 2.53;
        const n2 = i !== 0 ? n1 / i : n1;

        // 1. Nominal Pinion Torque Mk1 [Nm]
        const Mk1 = n1 > 0 ? (Pw * 9550.0) / n1 : 0;

        // 2. Transverse Tangential Force Ft at operating pitch cylinder [N]
        const dw1 = geom.dw1 || geom.d1;
        const dw2 = geom.dw2 || geom.d2;
        const Ft = dw1 > 0 ? (Mk1 * 2000.0) / dw1 : 0;

        // 3. Axial Force Fa [N]
        const betabRad = MathUtils.degToRad(geom.betab);
        const alfawtRad = MathUtils.degToRad(geom.alfawt);
        const cosAlfawt = Math.cos(alfawtRad);
        const Fa = cosAlfawt !== 0 ? Ft * Math.tan(betabRad) / cosAlfawt : 0;

        // 4. Radial Force Fr [N]
        const Fr = Ft * Math.tan(alfawtRad);

        // 5. Normal Force Fn [N]
        const Fn = Math.sqrt(Ft * Ft + Fa * Fa + Fr * Fr);

        // 6. Overturning / Bending Moment Mo [Nm]
        const Mo1 = Math.abs(Fa) * (dw1 / 2000.0);
        const Mo2 = Math.abs(Fa) * (dw2 / 2000.0);

        // 7. Pitch Line Velocity v [m/s]
        const v = (Math.PI * geom.d1 * n1) / 60000.0;

        // 8. Specific Tangential Load wt [N/mm]
        const bw = geom.bw > 0 ? geom.bw : 1.0;
        const wt = Ft / bw;

        // 9. Gearing Loss Coefficient and Efficiency
        const frictionCoeff = parseFloat(p.frictionCoeff) || 0.05; // Typical for oil lubrication
        const betaRad = MathUtils.degToRad(geom.beta);
        const cosBeta = Math.cos(betaRad);

        let zeta_z = 0;
        if (geom.beta === 0) {
            // Spur gears
            zeta_z = 0.5 * frictionCoeff * Math.PI * geom.epsilon_A * (1.0 / geom.z1 + 1.0 / geom.z2);
        } else {
            // Helical gears
            zeta_z = (cosBeta !== 0)
                ? (0.25 / cosBeta) * frictionCoeff * Math.PI * geom.epsilon_G * (1.0 / geom.z1 + 1.0 / geom.z2)
                : 0.01;
        }

        // Bearing and churning losses (~1%)
        const eta = MathUtils.clamp(1.0 - zeta_z - 0.01, 0.80, 0.995);

        // Transferred power to driven gear [kW]
        const Pw2 = Pw * eta;

        // Driven gear torque [Nm]
        const Mk2 = Mk1 * i * eta;

        // 10. Thermal Calculation & Heat Dissipation
        const Tair = parseFloat(p.Tair) || 20.0; // Ambient temp [°C]
        const Toil = parseFloat(p.Toil) || 60.0; // Max oil temp [°C]
        const kt = parseFloat(p.kt) || 12.0;    // Heat dissipation coeff [W/(m^2*K)]

        const Ploss = Pw * (1.0 - eta); // Lost power [kW]
        const deltaT = Math.max(1.0, Toil - Tair);
        const Abox = kt > 0 ? (Ploss * 1000.0) / (kt * deltaT) : 0; // Minimum cooling area [m^2]

        // 11. Preliminary Shaft Diameters [mm] (steel shaft with permissible torsional stress)
        const shaftRm = parseFloat(p.shaftRm) || 500.0; // MPa
        const dsh1_min = Math.round(365.0 * Math.pow(Math.max(0.001, Pw / (n1 * shaftRm)), 0.33) * 10) / 10;
        const dsh2_min = Math.round(365.0 * Math.pow(Math.max(0.001, Pw / (n2 * shaftRm)), 0.33) * 10) / 10;

        return {
            Pw, Pw2, n1, n2, Mk1, Mk2,
            Ft, Fa, Fr, Fn, Mo1, Mo2,
            v, wt,
            zeta_z, eta,
            Ploss, Abox, Tair, Toil, kt,
            dsh1_min, dsh2_min
        };
    }
};
