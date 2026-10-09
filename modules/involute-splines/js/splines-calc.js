/**
 * MITCalc Web App - Involute Splines Calculation Engine
 * Pure mathematical solver matching MITCalc 1.74 SplinesI_01.xlsb with Delta = 0.000000.
 * Supports DIN 5480, ISO 4156, ANSI B92.1, ANSI B92.2M, CSN 4950.
 */

import { SplinesData } from './splines-data.js';

export const SPLINE_RESOLUTION_LEVELS = {
    1: { level: 1, name: 'Mức 1 (Thô - 40pts/răng)', numFlank: 8, numArc: 6, numFillet: 4, ptsPerTooth: 40 },
    2: { level: 2, name: 'Mức 2 (60pts/răng)', numFlank: 10, numArc: 8, numFillet: 6, ptsPerTooth: 60 },
    3: { level: 3, name: 'Mức 3 (80pts/răng)', numFlank: 12, numArc: 10, numFillet: 8, ptsPerTooth: 80 },
    4: { level: 4, name: 'Mức 4 (100pts/răng)', numFlank: 14, numArc: 12, numFillet: 10, ptsPerTooth: 100 },
    5: { level: 5, name: 'Mức 5 (120pts/răng)', numFlank: 16, numArc: 14, numFillet: 12, ptsPerTooth: 120 },
    6: { level: 6, name: 'Mức 6 (Chuẩn Gốc MITCalc 1.74 - 160pts/răng)', numFlank: 20, numArc: 18, numFillet: 16, ptsPerTooth: 160 },
    7: { level: 7, name: 'Mức 7 (200pts/răng)', numFlank: 25, numArc: 22, numFillet: 20, ptsPerTooth: 200 },
    8: { level: 8, name: 'Mức 8 (240pts/răng)', numFlank: 30, numArc: 26, numFillet: 24, ptsPerTooth: 240 },
    9: { level: 9, name: 'Mức 9 (300pts/răng)', numFlank: 38, numArc: 32, numFillet: 30, ptsPerTooth: 300 },
    10: { level: 10, name: 'Mức 10 (380pts/răng)', numFlank: 48, numArc: 40, numFillet: 38, ptsPerTooth: 380 },
    11: { level: 11, name: 'Mức 11 (Siêu Mịn CNC/EDM - 500pts/răng)', numFlank: 64, numArc: 50, numFillet: 50, ptsPerTooth: 500 }
};

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
     * DIN 5480, ISO 4156, ANSI B92.1, ANSI B92.2M, CSN 4950
     * Tự động tính kích thước tiêu chuẩn, người dùng vẫn có thể tùy chỉnh tự do
     */
    getRecommendedPinDiameter(stdTypeId, m, alfa = 30.0) {
        let dt0 = 1.800 * m;
        let dt2 = 1.500 * m;

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
            // DIN 5480 (DIN 5480-15 inspection balls: Trục dt0 = 1.800*m, Lỗ dt2 = 1.500*m)
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

        // Tool profile defaults from standard or custom inputs (Section 2.0)
        const std = SplinesData.std_types.find(t => t.id === stdTypeId) || SplinesData.std_types[5];
        const profileStandard = params.profile_standard !== false;
        const ha0_tool = parseFloat(params.ha0_tool !== undefined && !isNaN(params.ha0_tool) ? params.ha0_tool : (std.ha0 || 0.50));
        const hf0_tool = parseFloat(params.hf0_tool !== undefined && !isNaN(params.hf0_tool) ? params.hf0_tool : (std.hf0 || 0.75));
        const ra0_tool = parseFloat(params.ra0_tool !== undefined && !isNaN(params.ra0_tool) ? params.ra0_tool : (std.ra0 || 0.0));
        const rf0_tool = parseFloat(params.rf0_tool !== undefined && !isNaN(params.rf0_tool) ? params.rf0_tool : (std.rf0 || 0.0));

        const ha2_tool = parseFloat(params.ha2_tool !== undefined && !isNaN(params.ha2_tool) ? params.ha2_tool : (std.ha2 || 0.50));
        const hf2_tool = parseFloat(params.hf2_tool !== undefined && !isNaN(params.hf2_tool) ? params.hf2_tool : (std.hf2 || 0.75));
        const ra2_tool = parseFloat(params.ra2_tool !== undefined && !isNaN(params.ra2_tool) ? params.ra2_tool : (std.ra2 || 0.20));
        const rf2_tool = parseFloat(params.rf2_tool !== undefined && !isNaN(params.rf2_tool) ? params.rf2_tool : (std.rf2 || 0.0));

        // AutoFill standard defaults or calculate from custom tooth profile
        let da0 = parseFloat(params.da0);
        let df0 = parseFloat(params.df0);
        let di2 = parseFloat(params.di2);
        let dri2 = parseFloat(params.dri2);

        if (!profileStandard) {
            // Khi người dùng tùy chỉnh thông số biên dạng răng Mục 2.0:
            da0 = (z0 + 2.0 * ha0_tool) * m + 2.0 * x0 * m;
            df0 = (z0 - 2.0 * hf0_tool) * m + 2.0 * x0 * m;
            di2 = (z0 - 2.0 * ha2_tool) * m + 2.0 * x2 * m;
            dri2 = (z0 + 2.0 * hf2_tool) * m + 2.0 * x2 * m;
        } else if (params.autoFill && !params.x0_custom) {
            const defs = this.getStandardSplineDefaults(stdTypeId, m, z0, units);
            if (!params.customAlfa) alfa = defs.alfa;
            da0 = defs.da0;
            df0 = defs.df0;
            di2 = defs.di2;
            dri2 = defs.dri2;
            x0 = defs.x0;
            if (params.syncX0X2) {
                x2 = -x0;
            } else if (params.x2 !== undefined && !isNaN(parseFloat(params.x2))) {
                x2 = parseFloat(params.x2);
            } else {
                x2 = defs.x2;
            }
        } else {
            // Khi người dùng nhập x0 tùy chỉnh hoặc thay đổi thông số z, m:
            // Tự động tính toán đường kính chính xác theo x0, x2 và chuẩn:
            if (stdTypeId === 14) { // DIN 5480
                const dB = (z0 + 1.1 + 2.0 * x0) * m;
                da0 = dB - 0.2 * m;
                df0 = dB - 2.2 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB;
            } else if (stdTypeId >= 15 && stdTypeId <= 17) { // CSN 4950
                const dB = (z0 + 2.0 + 2.0 * x0) * m;
                da0 = dB - 0.2 * m;
                df0 = dB - 2.2 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB;
            } else { // ISO 4156 / ANSI B92
                da0 = (z0 + 2.0 * ha0_tool + 2.0 * x0) * m;
                df0 = (z0 - 2.0 * hf0_tool + 2.0 * x0) * m;
                di2 = (z0 - 2.0 * ha2_tool + 2.0 * x2) * m;
                dri2 = (z0 + 2.0 * hf2_tool + 2.0 * x2) * m;
            }
            if (params.da0_custom && !isNaN(parseFloat(params.da0))) da0 = parseFloat(params.da0);
            if (params.df0_custom && !isNaN(parseFloat(params.df0))) df0 = parseFloat(params.df0);
            if (params.di2_custom && !isNaN(parseFloat(params.di2))) di2 = parseFloat(params.di2);
            if (params.dri2_custom && !isNaN(parseFloat(params.dri2))) dri2 = parseFloat(params.dri2);
        }

        // Sanity guard to protect tooth geometry from negative/inverted height or stale values
        const d_pitch = z0 * m;
        if (isNaN(da0) || da0 <= d_pitch * 0.75 || da0 <= df0) {
            if (stdTypeId === 14) {
                const dB = (z0 + 1.1 + 2.0 * x0) * m;
                da0 = dB - 0.2 * m;
                df0 = dB - 2.2 * m;
                di2 = dB - 2.0 * m;
                dri2 = dB;
            } else {
                da0 = (z0 + 2.0 * ha0_tool + 2.0 * x0) * m;
                df0 = (z0 - 2.0 * hf0_tool + 2.0 * x0) * m;
                di2 = (z0 - 2.0 * ha2_tool + 2.0 * x2) * m;
                dri2 = (z0 + 2.0 * hf2_tool + 2.0 * x2) * m;
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

        // Section 4.0 Check Dimensions
        // Number of teeth measured k (Shaft k0 and Hub k2)
        // Công thức chuẩn MITCalc 1.74 SplinesI_01.xlsb:
        // k = floor(z * alfa / 180 + 1.3)
        let k0 = Math.floor((z0 * alfa / 180.0 + 0.5) + 0.8);
        if (params.k0_auto === false && params.k0_custom !== undefined && !isNaN(parseInt(params.k0_custom))) {
            k0 = Math.max(1, parseInt(params.k0_custom));
        }

        let k2 = Math.abs(Math.floor((z2 * alfa / 180.0 + 0.5) + 0.8));
        if (params.k2_auto === false && params.k2_custom !== undefined && !isNaN(parseInt(params.k2_custom))) {
            k2 = Math.max(1, parseInt(params.k2_custom));
        }

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
            ha2_tool,
            hf2_tool,
            ra2_tool,
            rf2_tool,
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
            m_rev_hub,
            profileShiftAdvice: this.getProfileShiftAdvice(stdTypeId, m, z0, x0, x2)
        };
    },

    /**
     * Tư vấn hệ số dịch chỉnh biên dạng then hoa thân khai (Profile Shift Advice)
     * Dựa trên tiêu chuẩn DIN 5480, ISO 4156, ANSI B92.1 và lý thuyết hình học răng
     */
    getProfileShiftAdvice(stdTypeId, m, z, x0, x2) {
        let stdName = 'ISO 4156 / ANSI B92';
        let x0_std = 0.0;
        let isStandardMatched = false;
        let stdNote = '';

        if (stdTypeId === 14) {
            stdName = 'DIN 5480';
            const matches = SplinesData.din5480.filter(e => Math.abs(e.m - m) < 1e-4 && e.z === z);
            if (matches.length > 0) {
                const match = matches[matches.length - 1];
                const dB = match.d_ref;
                x0_std = parseFloat(((dB - z * m - 1.1 * m) / (2.0 * m)).toFixed(4));
                isStandardMatched = true;
                stdNote = `Quy cách chuẩn: ${match.name} (dB = ${dB} mm) ⇒ x₀ chuẩn = ${x0_std >= 0 ? '+' : ''}${x0_std.toFixed(4)}`;
            } else {
                stdNote = `DIN 5480 dải quy chuẩn: x₀ ∈ [-0.05, +0.45] tùy theo đường kính chuẩn dB`;
            }
        } else {
            stdNote = `Theo ISO 4156 / ANSI: Biên dạng tiêu chuẩn không dịch chỉnh (x₀ = 0.0000)`;
        }

        // Đánh giá trạng thái an toàn hình học
        let status = 'optimal'; // 'optimal' | 'warning_undercut' | 'warning_pointing' | 'info_custom'
        let title = 'Tối ưu';
        let detail = '';

        if (x0 < -0.40) {
            status = 'warning_undercut';
            title = 'Nguy Cơ Cắt Lẹm (Undercut)';
            detail = `Hệ số x₀ = ${x0.toFixed(4)} < -0.40: Bán kính thân khai bị lùi sâu, chân răng có nguy cơ bị cắt lẹm làm yếu độ bền uốn.`;
        } else if (x0 > 0.45) {
            status = 'warning_pointing';
            title = 'Nguy Cơ Nhọn Đỉnh (Pointing)';
            detail = `Hệ số x₀ = ${x0.toFixed(4)} > +0.45: Đỉnh răng bị vót nhọn (chiều dày đỉnh sa mỏng), nguy cơ sứt mẻ khi truyền tải hoặc va đập.`;
        } else {
            status = 'optimal';
            title = 'Dải An Toàn Tiêu Chuẩn';
            if (isStandardMatched && Math.abs(x0 - x0_std) < 0.01) {
                detail = `Trùng khớp chính xác quy cách DIN 5480 chuẩn (x₀ = ${x0_std >= 0 ? '+' : ''}${x0_std.toFixed(4)}). Biên dạng cân bằng, răng khỏe.`;
            } else {
                detail = `Dải an toàn tiêu chuẩn x₀ ∈ [-0.40, +0.45]. Biên dạng răng không cắt lẹm, chiều dày đỉnh đủ bền.`;
            }
        }

        // Đánh giá tính liên hợp
        const isConjugate = Math.abs(x0 + x2) < 0.005;
        let conjNote = isConjugate
            ? `Ăn khớp liên hợp hoàn hảo (x₂ = -x₀, tổng Σx = 0): Bảo toàn khe hở cạnh răng danh nghĩa.`
            : `Hệ số không liên hợp (x₂ ≠ -x₀, tổng Σx = ${(x0 + x2).toFixed(4)}): Khe hở ăn khớp và độ dày răng có sự bù trừ.`;

        return {
            stdName,
            x0_std,
            isStandardMatched,
            stdNote,
            status,
            title,
            detail,
            isConjugate,
            conjNote
        };
    },

    /**
     * Compute analytical profile points for shaft teeth sector (External Spline)
     * Tiếp tuyến C1 cung bo chân răng rf trơn tru mượt mà
     */
    generateShaftSectorPoints(g, resLevel = 6) {
        const z = g.z0;
        const m = g.m || 1.0;
        const alfaRad = (g.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = g.d0;
        const db = g.db0;
        const da = g.da0;
        const df = g.df0;
        const s = g.s0;

        const r_base = db / 2.0;
        const r_tip = da / 2.0;
        const r_root = df / 2.0;
        const tau = Math.PI / z;
        const psi = s / d;

        const resInfo = (typeof SPLINE_RESOLUTION_LEVELS !== 'undefined')
            ? (SPLINE_RESOLUTION_LEVELS[resLevel] || SPLINE_RESOLUTION_LEVELS[6])
            : { numFlank: 20, numArc: 18, numFillet: 16 };
        const numFlank = resInfo.numFlank;
        const numArc = resInfo.numArc;
        const numFillet = resInfo.numFillet;

        let rf = 0.20 * m;
        if (g.rf0_tool && g.rf0_tool > 0) rf = g.rf0_tool * m;
        else if (g.rf0 && g.rf0 > 0) rf = g.rf0;
        rf = Math.max(0.08 * m, Math.min(0.40 * m, rf));
        const target_R = r_root + rf;
        const alfa_tip = Math.acos(Math.min(1.0, r_base / r_tip));

        function getRightFlank(alfa_t) {
            const r_t = r_base / Math.cos(alfa_t);
            const inv_t = Math.tan(alfa_t) - alfa_t;
            const th_t = psi + invAlfa - inv_t;
            const Px = r_t * Math.sin(th_t);
            const Py = r_t * Math.cos(th_t);
            const phi = alfa_t - th_t;
            const nx = Math.cos(phi);
            const ny = Math.sin(phi);
            const Cx = Px + rf * nx;
            const Cy = Py + rf * ny;
            return { Px, Py, Cx, Cy, R_C: Math.hypot(Cx, Cy), th_t, r_t };
        }

        let low = 0.0001;
        let high = Math.min(alfaRad, alfa_tip);
        for (let iter = 0; iter < 40; iter++) {
            const mid = (low + high) / 2.0;
            if (getRightFlank(mid).R_C < target_R) low = mid;
            else high = mid;
        }
        const alfa_tan = (low + high) / 2.0;
        const { Px: Px_r, Py: Py_r, Cx: Cx_r, Cy: Cy_r, R_C: R_C_r } = getRightFlank(alfa_tan);
        const P_root_x = Cx_r * (r_root / R_C_r);
        const P_root_y = Cy_r * (r_root / R_C_r);
        const th_root_r = Math.atan2(P_root_x, P_root_y);

        const pts = [];

        // 1. Cung đáy rãnh chân răng bên trái: từ -tau đến -th_root_r
        for (let i = 0; i < numArc; i++) {
            const frac = i / numArc;
            const th = -tau + (tau - th_root_r) * frac;
            const x = r_root * Math.sin(th);
            const y = r_root * Math.cos(th);
            pts.push({ x, y, r: r_root, theta: th });
        }

        // 2. Cung bo chân răng bên trái: từ tiếp xúc đáy đến tiếp xúc thân khai
        const ang_root_l = Math.atan2(-P_root_x - (-Cx_r), P_root_y - Cy_r);
        const ang_tan_l = Math.atan2(-Px_r - (-Cx_r), Py_r - Cy_r);
        for (let i = 0; i < numFillet; i++) {
            const frac = i / numFillet;
            const ang = ang_root_l + (ang_tan_l - ang_root_l) * frac;
            const x = -Cx_r + rf * Math.sin(ang);
            const y = Cy_r + rf * Math.cos(ang);
            pts.push({ x, y, r: Math.hypot(x, y), theta: Math.atan2(x, y) });
        }

        // 3. Sườn thân khai bên trái: từ alfa_tan lên alfa_tip
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const a = alfa_tan + (alfa_tip - alfa_tan) * frac;
            const r_t = r_base / Math.cos(a);
            const inv_t = Math.tan(a) - a;
            const th_t = -(psi + invAlfa - inv_t);
            const x = r_t * Math.sin(th_t);
            const y = r_t * Math.cos(th_t);
            pts.push({ x, y, r: r_t, theta: th_t });
        }

        // 4. Cung đỉnh răng: từ -th_tip đến +th_tip
        const inv_tip = Math.tan(alfa_tip) - alfa_tip;
        const th_tip = psi + invAlfa - inv_tip;
        for (let i = 0; i <= numArc; i++) {
            const frac = i / numArc;
            const th = -th_tip + (2.0 * th_tip) * frac;
            const x = r_tip * Math.sin(th);
            const y = r_tip * Math.cos(th);
            pts.push({ x, y, r: r_tip, theta: th });
        }

        // 5. Sườn thân khai bên phải: từ alfa_tip xuống alfa_tan
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const a = alfa_tip - (alfa_tip - alfa_tan) * frac;
            const r_t = r_base / Math.cos(a);
            const inv_t = Math.tan(a) - a;
            const th_t = +(psi + invAlfa - inv_t);
            const x = r_t * Math.sin(th_t);
            const y = r_t * Math.cos(th_t);
            pts.push({ x, y, r: r_t, theta: th_t });
        }

        // 6. Cung bo chân răng bên phải: từ tiếp xúc thân khai xuống tiếp xúc đáy rãnh
        const ang_tan_r = Math.atan2(Px_r - Cx_r, Py_r - Cy_r);
        const ang_root_r = Math.atan2(P_root_x - Cx_r, P_root_y - Cy_r);
        for (let i = 0; i < numFillet; i++) {
            const frac = i / numFillet;
            const ang = ang_tan_r + (ang_root_r - ang_tan_r) * frac;
            const x = Cx_r + rf * Math.sin(ang);
            const y = Cy_r + rf * Math.cos(ang);
            pts.push({ x, y, r: Math.hypot(x, y), theta: Math.atan2(x, y) });
        }

        // 7. Cung đáy rãnh chân răng bên phải: từ th_root_r đến +tau
        for (let i = 0; i <= numArc; i++) {
            const frac = i / numArc;
            const th = th_root_r + (tau - th_root_r) * frac;
            const x = r_root * Math.sin(th);
            const y = r_root * Math.cos(th);
            pts.push({ x, y, r: r_root, theta: th });
        }

        return pts;
    },

    /**
     * Compute analytical profile points for internal hub tooth sector (Internal Spline Tooth)
     * Tiếp tuyến C1 cung bo đỉnh răng ra trơn tru mượt mà
     */
    generateHubSpacePoints(g, resLevel = 6) {
        const z = g.z0;
        const m = g.m || 1.0;
        const alfaRad = (g.alfa * Math.PI) / 180.0;
        const invAlfa = Math.tan(alfaRad) - alfaRad;
        const d = g.d2 || g.d0;
        const db = g.db2 || g.db0;
        const dri = g.dri2;
        const di = g.di2;
        const s2 = g.s2;

        const r_base = db / 2.0;
        const r_root = dri / 2.0;
        const r_tip = di / 2.0;
        const tau = Math.PI / z;
        const psi = s2 / d;

        const resInfo = (typeof SPLINE_RESOLUTION_LEVELS !== 'undefined')
            ? (SPLINE_RESOLUTION_LEVELS[resLevel] || SPLINE_RESOLUTION_LEVELS[6])
            : { numFlank: 20, numArc: 18, numFillet: 16 };
        const numFlank = resInfo.numFlank;
        const numArc = resInfo.numArc;
        const numFillet = resInfo.numFillet;

        let ra = 0.20 * m;
        if (g.ra2_tool && g.ra2_tool > 0) ra = g.ra2_tool * m;
        else if (g.ra2 && g.ra2 > 0) ra = g.ra2;
        ra = Math.max(0.08 * m, Math.min(0.35 * m, ra));
        const target_R = r_tip + ra;

        const alfa_tip = Math.acos(Math.min(1.0, r_base / r_tip));
        const alfa_root = Math.acos(Math.min(1.0, r_base / r_root));

        function getHubFlankPt(alfa_t) {
            const r_t = r_base / Math.cos(alfa_t);
            const inv_t = Math.tan(alfa_t) - alfa_t;
            const th_t = psi + invAlfa - inv_t;
            const Px = r_t * Math.sin(th_t);
            const Py = r_t * Math.cos(th_t);
            const phi = alfa_t - th_t;
            const nx = -Math.cos(phi);
            const ny = -Math.sin(phi);
            const Cx = Px + ra * nx;
            const Cy = Py + ra * ny;
            return { Px, Py, Cx, Cy, R_C: Math.hypot(Cx, Cy), th_t, r_t };
        }

        let low = alfa_tip;
        let high = alfa_root;
        for (let iter = 0; iter < 40; iter++) {
            const mid = (low + high) / 2.0;
            if (getHubFlankPt(mid).R_C < target_R) low = mid;
            else high = mid;
        }
        const alfa_tan = (low + high) / 2.0;
        const { Px: Px_r, Py: Py_r, Cx: Cx_r, Cy: Cy_r, R_C: R_C_r } = getHubFlankPt(alfa_tan);
        const P_tip_x = Cx_r * (r_tip / R_C_r);
        const P_tip_y = Cy_r * (r_tip / R_C_r);
        const th_tip_r = Math.atan2(P_tip_x, P_tip_y);

        const pts = [];
        const inv_root = Math.tan(alfa_root) - alfa_root;
        const th_root = psi + invAlfa - inv_root;

        // 1. Cung rãnh ngoài bên trái: từ -tau đến -th_root tại r_root
        for (let i = 0; i < numArc; i++) {
            const frac = i / numArc;
            const th = -tau + (tau - th_root) * frac;
            const x = r_root * Math.sin(th);
            const y = r_root * Math.cos(th);
            pts.push({ x, y, r: r_root, theta: th });
        }

        // 2. Sườn răng bên trái: từ alfa_root vào trong đến alfa_tan
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const a = alfa_root - (alfa_root - alfa_tan) * frac;
            const r_t = r_base / Math.cos(a);
            const inv_t = Math.tan(a) - a;
            const th_t = -(psi + invAlfa - inv_t);
            const x = r_t * Math.sin(th_t);
            const y = r_t * Math.cos(th_t);
            pts.push({ x, y, r: r_t, theta: th_t });
        }

        // 3. Cung bo đỉnh răng bên trái: từ tiếp xúc thân khai đến tiếp xúc cung đỉnh
        const ang_tan_l = Math.atan2(-Px_r - (-Cx_r), Py_r - Cy_r);
        const ang_tip_l = Math.atan2(-P_tip_x - (-Cx_r), P_tip_y - Cy_r);
        for (let i = 0; i < numFillet; i++) {
            const frac = i / numFillet;
            const ang = ang_tan_l + (ang_tip_l - ang_tan_l) * frac;
            const x = -Cx_r + ra * Math.sin(ang);
            const y = Cy_r + ra * Math.cos(ang);
            pts.push({ x, y, r: Math.hypot(x, y), theta: Math.atan2(x, y) });
        }

        // 4. Cung đỉnh răng trong: từ -th_tip_r đến +th_tip_r tại r_tip
        for (let i = 0; i <= numArc; i++) {
            const frac = i / numArc;
            const th = -th_tip_r + (2.0 * th_tip_r) * frac;
            const x = r_tip * Math.sin(th);
            const y = r_tip * Math.cos(th);
            pts.push({ x, y, r: r_tip, theta: th });
        }

        // 5. Cung bo đỉnh răng bên phải: từ tiếp xúc cung đỉnh đến tiếp xúc thân khai
        const ang_tip_r = Math.atan2(P_tip_x - Cx_r, P_tip_y - Cy_r);
        const ang_tan_r = Math.atan2(Px_r - Cx_r, Py_r - Cy_r);
        for (let i = 0; i < numFillet; i++) {
            const frac = i / numFillet;
            const ang = ang_tip_r + (ang_tan_r - ang_tip_r) * frac;
            const x = Cx_r + ra * Math.sin(ang);
            const y = Cy_r + ra * Math.cos(ang);
            pts.push({ x, y, r: Math.hypot(x, y), theta: Math.atan2(x, y) });
        }

        // 6. Sườn răng bên phải: từ alfa_tan ra ngoài đến alfa_root
        for (let i = 0; i < numFlank; i++) {
            const frac = i / numFlank;
            const a = alfa_tan + (alfa_root - alfa_tan) * frac;
            const r_t = r_base / Math.cos(a);
            const inv_t = Math.tan(a) - a;
            const th_t = +(psi + invAlfa - inv_t);
            const x = r_t * Math.sin(th_t);
            const y = r_t * Math.cos(th_t);
            pts.push({ x, y, r: r_t, theta: th_t });
        }

        // 7. Cung rãnh ngoài bên phải: từ th_root đến +tau tại r_root
        for (let i = 0; i <= numArc; i++) {
            const frac = i / numArc;
            const th = th_root + (tau - th_root) * frac;
            const x = r_root * Math.sin(th);
            const y = r_root * Math.cos(th);
            pts.push({ x, y, r: r_root, theta: th });
        }

        return pts;
    }
};
