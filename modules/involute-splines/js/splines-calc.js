/**
 * MITCalc Web App - Involute Splines Calculation Engine
 * Pure mathematical solver matching MITCalc 1.74 SplinesI_01.xlsb with Delta = 0.000000.
 * Supports DIN 5480, ISO 4156, ANSI B92.1, ANSI B92.2M, CSN 4950.
 */

import { SplinesData } from './splines-data.js';

export const SplinesCalc = {
    PI: 3.14159265358979,

    degToRad(deg) {
        return (deg * this.PI) / 180.0;
    },

    radToDeg(rad) {
        return (rad * 180.0) / this.PI;
    },

    /**
     * Exact MITCalc Involute function Inv(a)
     * a in degrees, returns involute value
     */
    inv(aDeg) {
        const rad = (aDeg * 3.141592653) / 180.0;
        return Math.tan(rad) - rad;
    },

    /**
     * Exact MITCalc Involute inverse solver Invol(X)
     * Matches MITCalc 1.74 GearFunctions.bas:770
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
        return (alfa * 180.0) / pi;
    },

    /**
     * Recommended pin/ball diameter dp according to international standards
     * ISO 4156, ANSI B92.1, DIN 5480
     */
    getRecommendedPinDiameter(stdTypeId, m, alfa = 30.0) {
        let dt0 = 1.75 * m;
        let dt2 = 1.75 * m;

        // ISO 4156 / ANSI B92.1 / ANSI B92.2M
        if (stdTypeId >= 1 && stdTypeId <= 13) {
            if (Math.abs(alfa - 30.0) < 0.1) {
                const isFillet = (stdTypeId === 3 || stdTypeId === 7 || stdTypeId === 11);
                dt0 = isFillet ? 1.920 * m : 1.728 * m;
                dt2 = isFillet ? 1.728 * m : 1.440 * m;
            } else if (Math.abs(alfa - 37.5) < 0.1) {
                dt0 = 1.728 * m;
                dt2 = 1.440 * m;
            } else if (Math.abs(alfa - 45.0) < 0.1) {
                dt0 = 1.920 * m;
                dt2 = 1.440 * m;
            }
        } else if (stdTypeId === 14) {
            // DIN 5480 (DIN 5480-15 standard inspection balls)
            dt0 = 1.800 * m;
            dt2 = 1.500 * m;
        } else if (stdTypeId >= 15 && stdTypeId <= 17) {
            // CSN 4950
            dt0 = 1.750 * m;
            dt2 = 1.500 * m;
        }

        return {
            dt0: parseFloat(dt0.toFixed(4)),
            dt2: parseFloat(dt2.toFixed(4))
        };
    },

    /**
     * Look up standard diameters and shift for standard types
     */
    getStandardSplineDefaults(stdTypeId, m, z, units = 1) {
        const std = SplinesData.std_types.find(t => t.id === stdTypeId) || SplinesData.std_types[5]; // Default ISO 4156 30 Flat
        const pi = this.PI;
        const P = m > 0 ? 25.4 / m : 10;
        let alfa = 30.0;
        if (stdTypeId === 4 || stdTypeId === 8 || stdTypeId === 12) alfa = 37.5;
        if (stdTypeId === 5 || stdTypeId === 9 || stdTypeId === 13) alfa = 45.0;

        const alfaRad = this.degToRad(alfa);
        let da0 = 0, df0 = 0, di2 = 0, dri2 = 0, xm = 0, x0 = 0, x2 = 0;
        const D = z * m;

        // Metric ISO 4156 / ANSI B92.2M
        if (stdTypeId >= 6 && stdTypeId <= 13) {
            const cf = 0.1 * m; // metric clearance factor = 0.1 * m
            if (stdTypeId === 6 || stdTypeId === 10) { // 30 Flat root
                da0 = (z + 1.0) * m;
                df0 = (z - 1.5) * m;
                dri2 = (z + 1.5) * m;
                const radVal = Math.pow(0.5 * D * Math.cos(alfaRad), 2) + Math.pow(0.5 * D * Math.sin(alfaRad) - 0.6 * m / Math.sin(alfaRad), 2);
                di2 = 2.0 * Math.sqrt(Math.max(0, radVal)) + 2.0 * cf;
            } else if (stdTypeId === 7 || stdTypeId === 11) { // 30 Fillet root
                da0 = (z + 1.0) * m;
                df0 = (z - 1.8) * m;
                dri2 = (z + 1.8) * m;
                const radVal = Math.pow(0.5 * D * Math.cos(alfaRad), 2) + Math.pow(0.5 * D * Math.sin(alfaRad) - 0.6 * m / Math.sin(alfaRad), 2);
                di2 = 2.0 * Math.sqrt(Math.max(0, radVal)) + 2.0 * cf;
            } else if (stdTypeId === 8 || stdTypeId === 12) { // 37.5 Fillet root
                da0 = (z + 0.9) * m;
                df0 = (z - 1.4) * m;
                dri2 = (z + 1.4) * m;
                const radVal = Math.pow(0.5 * D * Math.cos(alfaRad), 2) + Math.pow(0.5 * D * Math.sin(alfaRad) - 0.55 * m / Math.sin(alfaRad), 2);
                di2 = 2.0 * Math.sqrt(Math.max(0, radVal)) + 2.0 * cf;
            } else if (stdTypeId === 9 || stdTypeId === 13) { // 45 Fillet root
                da0 = (z + 0.8) * m;
                df0 = (z - 1.2) * m;
                dri2 = (z + 1.2) * m;
                const radVal = Math.pow(0.5 * D * Math.cos(alfaRad), 2) + Math.pow(0.5 * D * Math.sin(alfaRad) - 0.5 * m / Math.sin(alfaRad), 2);
                di2 = 2.0 * Math.sqrt(Math.max(0, radVal)) + 2.0 * cf;
            }
        } else if (stdTypeId === 14) { // DIN 5480 - 30 deg
            // Search in din5480 table for match (matches Excel VLOOKUP)
            const matches = SplinesData.din5480.filter(e => Math.abs(e.m - m) < 1e-4 && e.z === z);
            const match = matches.length > 0 ? matches[matches.length - 1] : null;
            let dB = match ? match.d_ref : (z * m + 2.0 * m); // fallback if not in table
            xm = (dB - D - 1.1 * m) / 2.0;
            x0 = xm / m;
            x2 = 0.0;
            da0 = dB - 0.2 * m;
            df0 = dB - 2.2 * m;
            di2 = dB - 2.0 * m;
            dri2 = dB;
        } else if (stdTypeId >= 1 && stdTypeId <= 5) { // ANSI B92.1 (Inch standard)
            const DP = 25.4 / m;
            const D_in = z / DP;
            let Do_in = 0, Dre_in = 0, Di_in = 0, Dri_in = 0;
            if (stdTypeId === 1) { // 30 Flat side fit
                Do_in = (z + 1.0) / DP;
                Dre_in = (z - 1.35) / DP;
                Di_in = (z - 1.0) / DP;
                Dri_in = (z + 1.35) / DP;
            } else if (stdTypeId === 2) { // 30 Flat major fit
                Do_in = (z + 1.0) / DP;
                Dre_in = (z - 1.35) / DP;
                Di_in = (z - 1.0) / DP;
                Dri_in = (z + 1.0) / DP;
            } else if (stdTypeId === 3) { // 30 Fillet side fit
                Do_in = (z + 1.0) / DP;
                Dre_in = DP < 16 ? (z - 1.8) / DP : (z - 2.0) / DP;
                Di_in = (z - 1.0) / DP;
                Dri_in = (z + 1.8) / DP;
            } else if (stdTypeId === 4) { // 37.5 Fillet
                Do_in = (z + 1.0) / DP;
                Dre_in = (z - 1.3) / DP;
                Di_in = (z - 0.8) / DP;
                Dri_in = (z + 1.6) / DP;
            } else if (stdTypeId === 5) { // 45 Fillet
                Do_in = (z + 1.0) / DP;
                Dre_in = (z - 1.0) / DP;
                Di_in = (z - 0.6) / DP;
                Dri_in = (z + 1.4) / DP;
            }
            da0 = Do_in * 25.4;
            df0 = Dre_in * 25.4;
            di2 = Di_in * 25.4;
            dri2 = Dri_in * 25.4;
        } else if (stdTypeId >= 15 && stdTypeId <= 17) { // CSN 4950
            const dB = z * m + 2.0 * m;
            if (stdTypeId === 15) { // 30 Flat Side
                da0 = dB - 0.2 * m;
                df0 = dB - 2.2 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB;
            } else if (stdTypeId === 16) { // 30 Flat Major
                da0 = dB;
                df0 = dB - 2.2 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB + 0.44 * m;
            } else if (stdTypeId === 17) { // 30 Fillet Side
                da0 = dB - 0.2 * m;
                df0 = dB - 2.76 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB;
            }
        }

        return {
            alfa,
            da0,
            df0,
            di2,
            dri2,
            x0,
            x2,
            xm
        };
    },

    /**
     * Complete Geometry and Dimensions Solver (Sections 1.0, 2.0, 3.0, 4.0)
     */
    calculate(params) {
        const units = params.units || 1; // 1 = SI [mm], 2 = Imperial [in]
        const unt = units === 1 ? 1.0 : 25.4;

        const stdTypeId = parseInt(params.stdType || 6);
        let m = parseFloat(params.m || 10.0);
        if (units === 2 && params.DP) {
            m = 25.4 / parseFloat(params.DP);
        }
        const z0 = parseInt(params.z || 20);
        const z2 = -z0; // Hub tooth count is negative in MITCalc internal convention
        let alfa = parseFloat(params.alfa || 30.0);

        let x0 = parseFloat(params.x0 !== undefined ? params.x0 : 0.0);
        let x2 = parseFloat(params.x2 !== undefined ? params.x2 : 0.0);

        // AutoFill standard defaults if requested
        let da0 = parseFloat(params.da0);
        let df0 = parseFloat(params.df0);
        let di2 = parseFloat(params.di2);
        let dri2 = parseFloat(params.dri2);

        if (params.autoFill) {
            const defs = this.getStandardSplineDefaults(stdTypeId, m, z0, units);
            alfa = defs.alfa;
            da0 = defs.da0;
            df0 = defs.df0;
            di2 = defs.di2;
            dri2 = defs.dri2;
            if (stdTypeId === 14) {
                x0 = defs.x0;
                x2 = defs.x2;
            }
        }

        const pi = this.PI;
        const alfaRad = this.degToRad(alfa);
        const cosAlfa = Math.cos(alfaRad);
        const sinAlfa = Math.sin(alfaRad);
        const tanAlfa = Math.tan(alfaRad);

        // Section 1.0 & 3.0 Dimensions
        const d0 = z0 * m;
        const d2 = d0;
        const db0 = d0 * cosAlfa;
        const db2 = db0;

        const p = pi * m;
        const pb = p * cosAlfa;

        // Tooth thickness on pitch diameter
        const s0 = p / 2.0 + 2.0 * x0 * m * tanAlfa;
        const s2 = p / 2.0 + 2.0 * x2 * m * tanAlfa;

        // Space / groove width
        const e0 = pi * m - s0;
        const e2 = pi * m - s2;

        // Normal backlash
        const backlash = ((e2 - s0) / 2.0) * cosAlfa;

        // Heights
        const ha0 = (da0 - d0) / 2.0;
        const hf0 = (d0 - df0) / 2.0;
        const ha2 = (d2 - di2) / 2.0;
        const hf2 = (dri2 - d2) / 2.0;

        // Tooth thickness on tip diameter
        const invAlfa = this.inv(alfa);
        let sa0 = 0.0;
        if (da0 > db0) {
            const alfa_a0 = Math.acos(db0 / da0);
            const invAlfa_a0 = Math.tan(alfa_a0) - alfa_a0;
            sa0 = da0 * (s0 / d0 + invAlfa - invAlfa_a0);
        }

        let sa2 = 0.0;
        if (di2 > db2) {
            const alfa_a2 = Math.acos(db2 / di2);
            const invAlfa_a2 = Math.tan(alfa_a2) - alfa_a2;
            sa2 = di2 * (s2 / d2 + invAlfa - invAlfa_a2);
        }

        // Tooth thickness on root diameter
        const sb0 = df0 * (s0 / d0 + invAlfa);
        let sb2 = 0.0;
        if (dri2 > db2) {
            const alfa_f2 = Math.acos(db2 / dri2);
            sb2 = dri2 * (s2 / d2 + invAlfa - (Math.tan(alfa_f2) - alfa_f2));
        }

        // Head clearances
        const c0 = (dri2 - da0) / 2.0; // Shaft tip clearance
        const c2 = (di2 - df0) / 2.0;  // Hub tip clearance

        // Unit dimensions
        const sa0_m = sa0 / m;
        const sa2_m = sa2 / m;
        const c0_m = c0 / m;
        const c2_m = c2 / m;

        // Tool profile defaults (Section 2.0)
        const ha0_tool = params.ha0_tool !== undefined ? parseFloat(params.ha0_tool) : 0.75;
        const hf0_tool = params.hf0_tool !== undefined ? parseFloat(params.hf0_tool) : 0.75;
        const ra0_tool = params.ra0_tool !== undefined ? parseFloat(params.ra0_tool) : 0.20;
        const rf0_tool = params.rf0_tool !== undefined ? parseFloat(params.rf0_tool) : 0.0;

        // Section 4.0 Check Dimensions
        // Number of teeth measured k
        const k0 = Math.floor((z0 * alfa / 180.0 + 0.5) + 0.8);
        const k2 = Math.abs(Math.floor((z2 * alfa / 180.0 + 0.5) + 0.8));

        // Common normal length W
        const W0 = m * (pi * cosAlfa * (k0 - 0.5) + z0 * cosAlfa * invAlfa) + 2.0 * x0 * m * sinAlfa;
        const W2 = Math.abs(m * (pi * cosAlfa * (-k2 - 0.5) + z2 * cosAlfa * invAlfa) + 2.0 * x2 * m * sinAlfa);

        // Pin / ball diameter
        const recPin = this.getRecommendedPinDiameter(stdTypeId, m, alfa);
        const dt0 = (params.dt0 !== undefined && parseFloat(params.dt0) > 0) ? parseFloat(params.dt0) : recPin.dt0;
        const dt2 = (params.dt2 !== undefined && parseFloat(params.dt2) > 0) ? parseFloat(params.dt2) : recPin.dt2;

        // Measurement over pins M
        // Shaft:
        const invAlfaM0 = invAlfa + (2.0 * x0 * tanAlfa + dt0 / (m * cosAlfa) - 0.5 * pi) / z0;
        const alfaM0_deg = this.invol(invAlfaM0);
        const alfaM0_rad = this.degToRad(alfaM0_deg);
        const ds0 = db0 / Math.cos(alfaM0_rad);
        let M0 = 0.0;
        if (z0 % 2 === 0) {
            M0 = ds0 + dt0;
        } else {
            M0 = ds0 * Math.cos(pi / (2.0 * z0)) + dt0;
        }

        // Hub:
        const invAlfaM2 = invAlfa + (2.0 * x2 * tanAlfa + dt2 / (m * cosAlfa) - 0.5 * pi) / z2;
        const alfaM2_deg = this.invol(invAlfaM2);
        const alfaM2_rad = this.degToRad(alfaM2_deg);
        const ds2 = db2 / Math.cos(alfaM2_rad);
        const absDs2 = Math.abs(ds2);
        let M2 = 0.0;
        if (Math.abs(z2) % 2 === 0) {
            M2 = Math.abs(-ds2 + dt2);
        } else {
            M2 = Math.abs(-ds2 * Math.cos(pi / (2.0 * Math.abs(z2))) + dt2);
        }

        // Hub 2-ball measurement across k teeth: W_bi2 (furthest distance between 2 pins)
        const Lc2 = absDs2 * Math.sin((pi * k2) / z0);
        const W_bi2 = Lc2 + dt2;

        // Section 5.0 Approximate Module Calculation
        const z_rev_shaft = params.z_rev_shaft !== undefined ? parseInt(params.z_rev_shaft) : 24;
        const da_rev_shaft = params.da_rev_shaft !== undefined ? parseFloat(params.da_rev_shaft) : 20.0;
        const u_rev_shaft = params.u_rev_shaft !== undefined ? parseFloat(params.u_rev_shaft) : 0.0;

        const z_rev_hub = params.z_rev_hub !== undefined ? parseInt(params.z_rev_hub) : 24;
        const da_rev_hub = params.da_rev_hub !== undefined ? parseFloat(params.da_rev_hub) : 20.0;
        const u_rev_hub = params.u_rev_hub !== undefined ? parseFloat(params.u_rev_hub) : 0.0;

        const daxx_shaft = da_rev_shaft + (da_rev_shaft > 0 ? (u_rev_shaft * u_rev_shaft) / (4.0 * da_rev_shaft) : 0.0);
        const m_rev_shaft = daxx_shaft / (z_rev_shaft + 2.0);

        const daxx_hub = da_rev_hub + (da_rev_hub > 0 ? (u_rev_hub * u_rev_hub) / (4.0 * da_rev_hub) : 0.0);
        const m_rev_hub = Math.abs(-daxx_hub / (-z_rev_hub + 2.0));

        return {
            units,
            unt,
            stdTypeId,
            m,
            DP: 25.4 / m,
            z0,
            z2: Math.abs(z2),
            alfa,
            d0,
            d2,
            db0,
            db2,
            da0,
            df0,
            di2,
            dri2,
            x0,
            x2,
            xm0: x0 * m,
            xm2: x2 * m,
            p,
            pb,
            s0,
            s2,
            e0,
            e2,
            backlash,
            ha0,
            hf0,
            ha2,
            hf2,
            sa0,
            sa2,
            sb0,
            sb2,
            c0,
            c2,
            sa0_m,
            sa2_m,
            c0_m,
            c2_m,
            ha0_tool,
            hf0_tool,
            ra0_tool,
            rf0_tool,
            k0,
            k2,
            W0,
            W2,
            dt0,
            dt2,
            dt0_rec: recPin.dt0,
            dt2_rec: recPin.dt2,
            ds0,
            ds2: absDs2,
            Lc2,
            W_bi2,
            M0,
            M2,
            z_rev_shaft,
            da_rev_shaft,
            u_rev_shaft,
            daxx_shaft,
            m_rev_shaft,
            z_rev_hub,
            da_rev_hub,
            u_rev_hub,
            daxx_hub,
            m_rev_hub
        };
    }
};
