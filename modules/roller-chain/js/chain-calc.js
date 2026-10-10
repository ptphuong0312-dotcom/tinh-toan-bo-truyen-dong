/**
 * MITCalc Web App - Roller Chain Engineering Calculation Engine (Module 9)
 * Standards: ISO 606 / DIN 8187 / DIN 8188 / ASME B29.1M
 * Rule 1: Zero-Force Scope Protocol (No forces/stresses, pure kinematics & geometry).
 * Rule 6: Zero-Tolerance Precision Delta = 0.000000.
 */

const ChainCalc = {
    /**
     * Core transmission calculation
     * @param {Object} params
     *   - units: 1 (Metric mm/kW/Nm) or 2 (Imperial in/HP/lb-in)
     *   - stdId: 'EU_STD', 'US_STD', 'US_ASME', 'US_HEAVY'
     *   - chainId: chain ID or code
     *   - P: Power [kW or HP]
     *   - n1: Driver speed [rpm]
     *   - n2_req: Desired driven speed [rpm]
     *   - z1: Number of teeth on sprocket 1
     *   - z2: Number of teeth on sprocket 2
     *   - a_req: Desired axis distance [mm or in]
     *   - linksMode: 'even', 'odd', or 'auto'
     *   - linksCustom: custom number of links (optional)
     *   - drivingType: 'A', 'B', 'C'
     *   - drivenType: 'A', 'B', 'C', 'D'
     */
    calculate(params) {
        const units = params.units || 1; // 1: Metric, 2: Imperial
        const isMetric = units === 1;

        // 1. Get chain record from ChainData
        let chain = null;
        if (typeof ChainData !== 'undefined') {
            const std = ChainData.standards.find(s => s.id === (params.stdId || 'EU_STD')) || ChainData.standards[0];
            if (std && std.chains) {
                if (typeof params.chainId === 'number') {
                    chain = std.chains.find(c => c.id === params.chainId) || std.chains[0];
                } else if (typeof params.chainId === 'string') {
                    chain = std.chains.find(c => c.code === params.chainId || c.name === params.chainId) || std.chains[0];
                } else {
                    chain = std.chains[0];
                }
            }
        }

        // Fallback default: ISO 08B-1 (p=12.7mm)
        if (!chain) {
            chain = {
                id: 4,
                name: '08B - 1  (0.5)',
                code: '08B-1',
                pitch: 12.7,
                strands: 1,
                fb: 18000,
                mass: 0.70,
                area: 50.0,
                b1: 7.75,
                b2: 11.30,
                d1: 4.45,
                d3: 8.51,
                l: 17.0,
                lc: 18.2,
                g: 11.8,
                s1: 1.6,
                s2: 1.6,
                e: 0.0
            };
        }

        // Unit conversion factors
        const p_mm = chain.pitch; // mm
        const p = isMetric ? p_mm : p_mm / 25.4; // pitch in active units

        // Section 1.0 Input Power & Kinematics
        const P = Math.max(0.001, parseFloat(params.P) || 5.5);
        const n1 = Math.max(1.0, parseFloat(params.n1) || 1450.0);
        let n2_req = parseFloat(params.n2_req);
        if (isNaN(n2_req) || n2_req <= 0) n2_req = n1 / 2.0;

        const i_req = n1 / n2_req;

        // Teeth numbers
        const z1 = Math.max(7, parseInt(params.z1) || 19);
        let z2 = parseInt(params.z2);
        if (isNaN(z2) || z2 < 7) {
            z2 = Math.round(z1 * i_req);
        }

        const i_act = z2 / z1;
        const n2_act = n1 / i_act;
        const i_diff_pct = Math.abs(i_act - i_req) / i_req * 100.0;

        // Torques
        const eta = 0.98; // Chain transmission efficiency
        const Mk1 = isMetric ? (P * 9550.0 / n1) : (P * 5252.0 / n1 * 12.0); // Nm or lb-in
        const Mk2 = isMetric ? (P * 9550.0 / n2_act * eta) : (P * 5252.0 / n2_act * eta * 12.0);

        // Section 3.0 Geometry & Pitch Diameters
        const d1 = p / Math.sin(Math.PI / z1);
        const d2 = p / Math.sin(Math.PI / z2);

        // Desired axis distance
        let a_req = parseFloat(params.a_req);
        if (isNaN(a_req) || a_req <= 0) {
            a_req = 40.0 * p; // Recommended optimum 40 * pitch
        }

        // Theoretical number of links
        const kx_geom = ((z2 - z1) / (2.0 * Math.PI)) ** 2;
        const X_exact = (2.0 * a_req / p) + ((z1 + z2) / 2.0) + (kx_geom * p / a_req);

        // Selected link count
        let X;
        if (params.linksCustom && parseInt(params.linksCustom) > 0) {
            X = parseInt(params.linksCustom);
        } else if (params.linksMode === 'odd') {
            X = Math.round(X_exact);
            if (X % 2 === 0) X += 1;
        } else {
            // Default: Even link count (standard)
            X = Math.floor(X_exact / 2.0 + 0.5) * 2;
        }

        // Min constructional axis distance
        const a_min = (d1 + d2) / 2.0 + (p * 0.5);
        const a_max = 80.0 * p;

        // Actual axis distance a based on integer link count X
        const Kx = X - (z1 + z2) / 2.0;
        const discr = Kx * Kx - (2.0 * (z2 - z1) * (z2 - z1)) / (Math.PI * Math.PI);
        let a = a_req;
        if (discr >= 0) {
            a = (p / 4.0) * (Kx + Math.sqrt(discr));
        }

        // Chain length
        const L = X * p;

        // Peripheral chain speed
        const v = isMetric ? (z1 * p * n1 / 60000.0) : (z1 * p * n1 / (12.0 * 60.0)); // m/s or ft/s
        const v_metric = (z1 * p_mm * n1) / 60000.0; // always m/s for checks

        // Max speed recommendations
        const v_max_metric = 25.0; // m/s with force lubrication

        // Section 4.0 Operating & Quality Indexes
        // Angle of wrap on sprocket 1
        const sin_phi = Math.min(1.0, Math.max(-1.0, (d2 - d1) / (2.0 * a)));
        const phi_rad = Math.asin(sin_phi);
        const phi_deg = phi_rad * 180.0 / Math.PI;
        const alpha1 = 180.0 - 2.0 * phi_deg;
        const alpha2 = 180.0 + 2.0 * phi_deg;

        // Speed variation (Polygonal effect)
        const speed_var_pct = (1.0 / Math.cos(Math.PI / z1) - 1.0) * 100.0;

        // Max slackness / sag y
        const y_slack = 0.02 * a; // 2% of axis distance

        // Joint impact frequency
        const f_impact = (z1 * n1) / (60.0 * X); // 1/s

        // Lubrication recommendation
        let rec_lub_id = 1;
        if (v_metric > 12.0) rec_lub_id = 4;
        else if (v_metric > 7.0) rec_lub_id = 3;
        else if (v_metric > 4.0) rec_lub_id = 2;

        // Section 5.0 ISO 606 / DIN 8187 / DIN 8196 / TCVN 1785-76 Sprocket Dimensions
        const d3 = isMetric ? chain.d3 : chain.d3 / 25.4;
        const d1_pin = isMetric ? chain.d1 : chain.d1 / 25.4;
        const b1 = isMetric ? chain.b1 : chain.b1 / 25.4;
        const b2 = isMetric ? chain.b2 : chain.b2 / 25.4;
        const strands = chain.strands || 1;
        const e_trans = isMetric ? chain.e : chain.e / 25.4;
        const RA = isMetric ? 2 : 3;

        // 1. Tip diameter Da Limits [Min, Max]
        const da1_min = d1 + 0.5 * d3;
        const da1_max = d1 + 1.25 * p - d3;
        const da2_min = d2 + 0.5 * d3;
        const da2_max = d2 + 1.25 * p - d3;

        // 2. Root radius R1 Limits [Min, Max] (ISO 606 / DIN 8196 / TCVN 1785-76)
        const d3_mm = chain.d3;
        const r1_min_mm = 0.505 * d3_mm;
        const r1_max_mm = 0.505 * d3_mm + 0.069 * (d3_mm ** 0.33);
        const r1_min = isMetric ? r1_min_mm : r1_min_mm / 25.4;
        const r1_max = isMetric ? r1_max_mm : r1_max_mm / 25.4;
        const R1_mean = (r1_min + r1_max) / 2.0;

        // TCVN 1785-76 specific root radius (0.5025 * d3 + 0.05 mm)
        const r1_tcvn_mm = 0.5025 * d3_mm + 0.05;
        const r1_tcvn = isMetric ? r1_tcvn_mm : r1_tcvn_mm / 25.4;

        // 3. Flank radius R2 Limits [Min, Max]
        const r2_1_min_mm = 0.12 * d3_mm * (z1 + 2);
        const r2_1_max_mm = 0.008 * d3_mm * (z1 * z1 + 180);
        const r2_1_min = isMetric ? r2_1_min_mm : r2_1_min_mm / 25.4;
        const r2_1_max = isMetric ? r2_1_max_mm : r2_1_max_mm / 25.4;
        const R2_1_mean = (r2_1_min + r2_1_max) / 2.0;

        const r2_2_min_mm = 0.12 * d3_mm * (z2 + 2);
        const r2_2_max_mm = 0.008 * d3_mm * (z2 * z2 + 180);
        const r2_2_min = isMetric ? r2_2_min_mm : r2_2_min_mm / 25.4;
        const r2_2_max = isMetric ? r2_2_max_mm : r2_2_max_mm / 25.4;
        const R2_2_mean = (r2_2_min + r2_2_max) / 2.0;

        // 4. Flank angle alpha Limits [Min, Max] [deg]
        const flank_alpha1_min = 120.0 - 90.0 / z1;
        const flank_alpha1_max = 140.0 - 90.0 / z1;
        const flank_alpha1_mean = 130.0 - 90.0 / z1;

        const flank_alpha2_min = 120.0 - 90.0 / z2;
        const flank_alpha2_max = 140.0 - 90.0 / z2;
        const flank_alpha2_mean = 130.0 - 90.0 / z2;

        // Tolerance Range Selection Protocol
        // Default: useMeanTolerance = true -> 100% identical to MITCalc 1.74!
        // When unchecked (useMeanTolerance = false), supports 'tcvn', 'min', 'max', or 'custom'
        const useMeanTolerance = params.useMeanTolerance !== false;
        let profileMode = params.profileMode || (useMeanTolerance ? 'mean' : 'custom');
        if (useMeanTolerance) {
            profileMode = 'mean';
        }

        let da1, da2, R1, R2_1, R2_2, flank_alpha1, flank_alpha2;

        if (profileMode === 'mean') {
            da1 = Number(((da1_min + da1_max) / 2.0).toFixed(RA));
            da2 = Number(((da2_min + da2_max) / 2.0).toFixed(RA));
            R1 = Number(R1_mean.toFixed(RA));
            R2_1 = Number(R2_1_mean.toFixed(RA));
            R2_2 = Number(R2_2_mean.toFixed(RA));
            flank_alpha1 = Number(flank_alpha1_mean.toFixed(2));
            flank_alpha2 = Number(flank_alpha2_mean.toFixed(2));
        } else if (profileMode === 'tcvn') {
            // TCVN 1785-76 / GOST 591-69 (Extreme Boundary Case within ISO 606 envelope)
            da1 = Number(da1_max.toFixed(RA));
            da2 = Number(da2_max.toFixed(RA));
            R1 = Number(r1_tcvn.toFixed(RA));
            R2_1 = Number(r2_1_min.toFixed(RA));
            R2_2 = Number(r2_2_min.toFixed(RA));
            flank_alpha1 = Number(flank_alpha1_max.toFixed(2));
            flank_alpha2 = Number(flank_alpha2_max.toFixed(2));
        } else if (profileMode === 'min') {
            da1 = Number(da1_min.toFixed(RA));
            da2 = Number(da2_min.toFixed(RA));
            R1 = Number(r1_min.toFixed(RA));
            R2_1 = Number(r2_1_min.toFixed(RA));
            R2_2 = Number(r2_2_min.toFixed(RA));
            flank_alpha1 = Number(flank_alpha1_min.toFixed(2));
            flank_alpha2 = Number(flank_alpha2_min.toFixed(2));
        } else if (profileMode === 'max') {
            da1 = Number(da1_max.toFixed(RA));
            da2 = Number(da2_max.toFixed(RA));
            R1 = Number(r1_max.toFixed(RA));
            R2_1 = Number(r2_1_max.toFixed(RA));
            R2_2 = Number(r2_2_max.toFixed(RA));
            flank_alpha1 = Number(flank_alpha1_max.toFixed(2));
            flank_alpha2 = Number(flank_alpha2_max.toFixed(2));
        } else {
            // Custom values within [Min, Max]
            da1 = params.customDa1 !== undefined ? Number(Number(params.customDa1).toFixed(RA)) : Number(((da1_min + da1_max) / 2.0).toFixed(RA));
            da2 = params.customDa2 !== undefined ? Number(Number(params.customDa2).toFixed(RA)) : Number(((da2_min + da2_max) / 2.0).toFixed(RA));
            R1 = params.customR1 !== undefined ? Number(Number(params.customR1).toFixed(RA)) : Number(R1_mean.toFixed(RA));
            R2_1 = params.customR2_1 !== undefined ? Number(Number(params.customR2_1).toFixed(RA)) : Number(R2_1_mean.toFixed(RA));
            R2_2 = params.customR2_2 !== undefined ? Number(Number(params.customR2_2).toFixed(RA)) : Number(R2_2_mean.toFixed(RA));
            flank_alpha1 = params.customAlpha1 !== undefined ? Number(Number(params.customAlpha1).toFixed(2)) : Number(flank_alpha1_mean.toFixed(2));
            flank_alpha2 = params.customAlpha2 !== undefined ? Number(Number(params.customAlpha2).toFixed(2)) : Number(flank_alpha2_mean.toFixed(2));
        }

        // Root diameter Df (Bottom of tooth gullet): Df = d - 2 * R1
        const df1 = Number((d1 - 2.0 * R1).toFixed(RA));
        const df2 = Number((d2 - 2.0 * R1).toFixed(RA));

        const limits = {
            da1_min: Number(da1_min.toFixed(RA)),
            da1_max: Number(da1_max.toFixed(RA)),
            da2_min: Number(da2_min.toFixed(RA)),
            da2_max: Number(da2_max.toFixed(RA)),
            r1_min: Number(r1_min.toFixed(RA)),
            r1_max: Number(r1_max.toFixed(RA)),
            r1_tcvn: Number(r1_tcvn.toFixed(RA)),
            r2_1_min: Number(r2_1_min.toFixed(RA)),
            r2_1_max: Number(r2_1_max.toFixed(RA)),
            r2_2_min: Number(r2_2_min.toFixed(RA)),
            r2_2_max: Number(r2_2_max.toFixed(RA)),
            alpha1_min: Number(flank_alpha1_min.toFixed(2)),
            alpha1_max: Number(flank_alpha1_max.toFixed(2)),
            alpha2_min: Number(flank_alpha2_min.toFixed(2)),
            alpha2_max: Number(flank_alpha2_max.toFixed(2))
        };

        // Tooth width bf
        let bf_factor = 0.95;
        if (p_mm < 12.7) {
            bf_factor = strands === 1 ? 0.93 : (strands === 2 ? 0.91 : (strands === 3 ? 0.88 : 0.85));
        } else {
            bf_factor = strands === 1 ? 0.95 : (strands === 2 ? 0.93 : (strands === 3 ? 0.93 : 0.90));
        }
        const bf = Number((bf_factor * b1).toFixed(RA));

        // Total width for multi-strand sprockets
        const B_tot = Number((strands === 1 ? bf : (strands - 1) * e_trans + bf).toFixed(RA));

        // Chamfer width ba & radius rx
        const ba = Number((0.125 * d3).toFixed(RA));
        const rx = Number((1.5 * d1_pin).toFixed(RA));

        // Tooth depth f & Rim diameter Dg
        const f = Number((0.7 * p).toFixed(RA));
        const Dg1 = Number((d1 - 2.0 * f).toFixed(RA));
        const Dg2 = Number((d2 - 2.0 * f).toFixed(RA));

        // Weight estimation
        const chain_weight = (L * (chain.mass || 0.70)) / (isMetric ? 1000.0 : 1.0);

        // Nested sprocket objects for direct access
        const sprocket1 = {
            d: d1,
            da: da1,
            df: df1,
            R1: R1,
            R2: R2_1,
            bf1: bf,
            rx: rx,
            Dg: Dg1,
            p: p,
            d3: d3,
            alphaDeg: flank_alpha1,
            limits: {
                da_min: limits.da1_min,
                da_max: limits.da1_max,
                r1_min: limits.r1_min,
                r1_max: limits.r1_max,
                r1_tcvn: limits.r1_tcvn,
                r2_min: limits.r2_1_min,
                r2_max: limits.r2_1_max,
                alpha_min: limits.alpha1_min,
                alpha_max: limits.alpha1_max
            }
        };

        const sprocket2 = {
            d: d2,
            da: da2,
            df: df2,
            R1: R1,
            R2: R2_2,
            bf1: bf,
            rx: rx,
            Dg: Dg2,
            p: p,
            d3: d3,
            alphaDeg: flank_alpha2,
            limits: {
                da_min: limits.da2_min,
                da_max: limits.da2_max,
                r1_min: limits.r1_min,
                r1_max: limits.r1_max,
                r1_tcvn: limits.r1_tcvn,
                r2_min: limits.r2_2_min,
                r2_max: limits.r2_2_max,
                alpha_min: limits.alpha2_min,
                alpha_max: limits.alpha2_max
            }
        };

        // Recommended lubrication description string
        let lubrication = 'Bôi trơn nhỏ giọt (Drip lubrication)';
        if (rec_lub_id === 2) lubrication = 'Bôi trơn ngâm dầu (Oil bath)';
        else if (rec_lub_id === 3) lubrication = 'Bôi trơn cưỡng bức áp lực (Force-feed / Pressure spray)';

        return {
            units,
            isMetric,
            chain,
            p,
            p_mm,
            strands,

            // Kinematics (Section 1.0)
            P,
            n1,
            n2_req,
            n2_act,
            n2: n2_act,
            i_req,
            i_act,
            i: i_act,
            i_diff_pct,
            Mk1,
            Mk2,

            // Transmission Geometry (Section 3.0)
            z1,
            z2,
            d1,
            d2,
            a_req,
            a,
            a_min,
            a_max,
            X_exact,
            X,
            X_even: X,
            L,
            v,
            v_metric,
            v_max_metric,

            // Quality & Operating Indexes (Section 4.0)
            alpha1,
            alpha2,
            speed_var_pct,
            y_slack,
            y: y_slack,
            f_impact,
            rec_lub_id,
            lubrication,

            // ISO 606 Sprocket Dimensions (Section 5.0)
            d3,
            d1_pin,
            b1,
            b2,
            da1,
            da2,
            df1,
            df2,
            R1,
            R2_1,
            R2_2,
            flank_alpha1,
            flank_alpha2,
            bf,
            B_tot,
            ba,
            rx,
            f,
            Dg1,
            Dg2,
            chain_weight,

            // Tolerance limits & selection mode
            limits,
            useMeanTolerance,
            profileMode,

            // Nested sprocket structures
            sprocket1,
            sprocket2
        };
    },

    /**
     * Generate 2D Profile Points for a Sprocket Tooth (ISO 606)
     */
    /**
     * Generate 2D Profile Points for a Sprocket Tooth (ISO 606 / DIN 8196 / ASME B29.1M)
    /**
     * Generate 2D Profile Points for a Sprocket Tooth (ISO 606 / DIN 8196 / MITCalc 1.74)
     * Authentic closed analytical contour matching Sub View4 from MITCalc chains_01.xlsb!DXF.bas:
     * - Roller seating arc R1 (subtending angle alpha = 130 - 90/z deg, center at P1(rp, 0))
     * - Flank arc R2 tangent C1 to R1 at P3 (center at P7)
     * - Crest arc along tip circle da/2 (Top Land) connecting flanks across tooth centerline (NO artificial dome/topping bulb)
     * - 100% conjugate alignment with roller meshing positions (Space 0 at angle 0.0 rad)
     */
    generateSprocket2DPoints(z, pOrData, d3, da, df, R1, R2, alphaDeg) {
        let p, d3_val, da_val, df_val, R1_val, R2_val, alpha_val;
        if (typeof pOrData === 'object' && pOrData !== null) {
            p = pOrData.p || 12.7;
            d3_val = pOrData.d3 || 8.51;
            da_val = pOrData.da || (p / Math.sin(Math.PI / z) + 0.625 * p - 0.25 * d3_val);
            df_val = pOrData.df || (p / Math.sin(Math.PI / z) - 2.0 * (0.505 * d3_val));
            R1_val = pOrData.R1 || (0.505 * d3_val);
            R2_val = pOrData.R2 || (0.12 * d3_val * (z + 2) + 0.008 * d3_val * (z * z + 180)) / 2.0;
            alpha_val = pOrData.alphaDeg || (130.0 - 90.0 / z);
        } else {
            p = pOrData || 12.7;
            d3_val = d3 || 8.51;
            da_val = da || (p / Math.sin(Math.PI / z) + 0.625 * p - 0.25 * d3_val);
            df_val = df || (p / Math.sin(Math.PI / z) - 2.0 * (0.505 * d3_val));
            R1_val = R1 || (0.505 * d3_val);
            R2_val = R2 || (0.12 * d3_val * (z + 2) + 0.008 * d3_val * (z * z + 180)) / 2.0;
            alpha_val = alphaDeg || (130.0 - 90.0 / z);
        }

        const dp = p / Math.sin(Math.PI / z);
        const rp = dp / 2.0;
        const ra = da_val / 2.0;
        const alpha = (alpha_val * Math.PI) / 180.0;
        const pitch_ang = (2.0 * Math.PI) / z;
        const half_pitch = Math.PI / z;

        // MITCalc analytical geometry aligned to space-0 at (rp, 0)
        // Tangency point between R1 and R2 (P3_top)
        const p3_x = rp - R1_val * Math.cos(alpha / 2.0);
        const p3_y = R1_val * Math.sin(alpha / 2.0);

        // Curvature center of flank arc R2 (P7_top)
        const p7_x = p3_x - R2_val * Math.cos(alpha / 2.0);
        const p7_y = p3_y + R2_val * Math.sin(alpha / 2.0);

        // Law of cosines for triangle O(0, 0) - P7_top - P5_top
        const b = Math.hypot(p7_x, p7_y);
        const c = ra;
        const a_side = R2_val;
        const cos_alf = Math.max(-1.0, Math.min(1.0, (b * b + c * c - a_side * a_side) / (2.0 * b * c)));
        const alf_triangle = Math.acos(cos_alf);

        // Polar angle of P7_top from origin
        const psi_7 = Math.atan2(p7_y, p7_x);
        const th5 = psi_7 - alf_triangle; // Polar angle of flank-crest junction P5_top

        // Angles of flank arc on circle R2 centered at P7_top
        const p5_top_x = ra * Math.cos(th5);
        const p5_top_y = ra * Math.sin(th5);
        const phi_top_start = Math.atan2(p3_y - p7_y, p3_x - p7_x);
        const phi_top_end = Math.atan2(p5_top_y - p7_y, p5_top_x - p7_x);

        // Discretization resolutions
        const n_tip = 3;
        const n_flank = 8;
        const n_seat = 8;

        // Build continuous, strictly monotonic sector [-half_pitch, +half_pitch]
        const sector = [];

        if (th5 < half_pitch) {
            // 1. Bottom crest land on circle ra: [-half_pitch -> -th5]
            for (let j = 0; j < n_tip; j++) {
                const u = j / n_tip;
                const th = -half_pitch + u * (half_pitch - th5);
                sector.push({ x: ra * Math.cos(th), y: ra * Math.sin(th) });
            }
            // 2. Bottom flank arc: [-th5 -> P3_bot] on circle R2 with center (p7_x, -p7_y)
            const phi_bot_start = -phi_top_end;
            const phi_bot_end = -phi_top_start;
            for (let j = 0; j < n_flank; j++) {
                const u = j / n_flank;
                const phi = phi_bot_start + u * (phi_bot_end - phi_bot_start);
                sector.push({ x: p7_x + R2_val * Math.cos(phi), y: -p7_y + R2_val * Math.sin(phi) });
            }
        } else {
            // Pointed tooth case: flank intersects crest centerline before ra
            for (let j = 0; j <= n_flank; j++) {
                const u = j / n_flank;
                const phi = -phi_top_end + u * (phi_top_end - (-phi_top_start));
                sector.push({ x: p7_x + R2_val * Math.cos(phi), y: -p7_y + R2_val * Math.sin(phi) });
            }
        }

        // 3. Gullet seating arc: [P3_bot -> P3_top] on circle R1 with center (rp, 0)
        for (let j = 0; j <= n_seat; j++) {
            const u = j / n_seat;
            const beta = -alpha / 2.0 + u * alpha;
            sector.push({ x: rp - R1_val * Math.cos(beta), y: R1_val * Math.sin(beta) });
        }

        if (th5 < half_pitch) {
            // 4. Top flank arc: [P3_top -> P5_top] on circle R2 with center (p7_x, p7_y)
            for (let j = 1; j <= n_flank; j++) {
                const u = j / n_flank;
                const phi = phi_top_start + u * (phi_top_end - phi_top_start);
                sector.push({ x: p7_x + R2_val * Math.cos(phi), y: p7_y + R2_val * Math.sin(phi) });
            }
            // 5. Top crest land on circle ra: [th5 -> +half_pitch]
            for (let j = 1; j <= n_tip; j++) {
                const u = j / n_tip;
                const th = th5 + u * (half_pitch - th5);
                sector.push({ x: ra * Math.cos(th), y: ra * Math.sin(th) });
            }
        }

        // Replicate across all z teeth:
        // Space 0 is at angle 0.0 rad, perfectly matching roller conjugate meshing!
        const pts = [];
        for (let k = 0; k < z; k++) {
            const ang_k = k * pitch_ang;
            const cos_k = Math.cos(ang_k);
            const sin_k = Math.sin(ang_k);
            for (let j = 0; j < sector.length; j++) {
                const pt = sector[j];
                pts.push({
                    x: pt.x * cos_k - pt.y * sin_k,
                    y: pt.x * sin_k + pt.y * cos_k
                });
            }
        }

        return pts;
    },

    /**
     * Generate Chain Transmission Kinematic Path & Roller Positions (Zero-Deviation Conjugate Meshing)
     */
    generateChainKinematics(d1, d2, a, p, X, rotationAngle = 0.0, z1_param, z2_param) {
        const r1 = d1 / 2.0;
        const r2 = d2 / 2.0;
        const z1 = z1_param || Math.round(Math.PI / Math.asin(p / (2.0 * r1)));
        const z2 = z2_param || Math.round(Math.PI / Math.asin(p / (2.0 * r2)));

        const sin_phi = (r2 - r1) / a;
        const phi = Math.asin(Math.min(1.0, Math.max(-1.0, sin_phi)));

        const c1 = { x: 0, y: 0 };
        const c2 = { x: a, y: 0 };

        // Common tangent points (symmetric across x-axis)
        const t1_top = { x: -r1 * Math.sin(phi), y: r1 * Math.cos(phi) };
        const t2_top = { x: a - r2 * Math.sin(phi), y: r2 * Math.cos(phi) };
        const t1_bot = { x: -r1 * Math.sin(phi), y: -r1 * Math.cos(phi) };
        const t2_bot = { x: a - r2 * Math.sin(phi), y: -r2 * Math.cos(phi) };

        const L_span = a * Math.cos(phi);

        // Link counts in each region
        const n_top = L_span / p;
        const n_sp2 = z2 * (Math.PI + 2.0 * phi) / (2.0 * Math.PI);
        const n_bot = L_span / p;
        const n_sp1 = z1 * (Math.PI - 2.0 * phi) / (2.0 * Math.PI);

        const psi1_top = Math.PI / 2.0 + phi;
        const psi1_bot = -Math.PI / 2.0 - phi;
        const psi2_top = Math.PI / 2.0 + phi;
        const psi2_bot = -Math.PI / 2.0 - phi;

        // Continuous link movement offset: u_move in units of links [0, X)
        // rotationAngle is the continuous angular rotation of Sprocket 1
        // One full tooth rotation of Sprocket 1 is 2*PI / z1, which corresponds to 1 link
        const u_move = (rotationAngle / ((2.0 * Math.PI) / z1)) % X;

        // Synchronized Sprocket Rotation Angles
        const theta1 = psi1_bot + (2.0 * n_top + n_sp2 - u_move) * ((2.0 * Math.PI) / z1);
        const theta2 = psi2_top + (n_top - u_move) * ((2.0 * Math.PI) / z2);

        // Position of each roller i along articulated path
        const rollers = [];
        for (let i = 0; i < X; i++) {
            let u = (i + u_move) % X;
            if (u < 0) u += X;

            let pos = { x: 0, y: 0, angle: 0 };

            if (u < n_top) {
                // Top straight span from t1_top to t2_top
                const tau = u / n_top;
                pos.x = t1_top.x + tau * (t2_top.x - t1_top.x);
                pos.y = t1_top.y + tau * (t2_top.y - t1_top.y);
                pos.angle = phi;
            } else if (u < n_top + n_sp2) {
                // Sprocket 2 wrap (CW from psi2_top to psi2_bot)
                const delta_u = u - n_top;
                const th = psi2_top - delta_u * ((2.0 * Math.PI) / z2);
                pos.x = c2.x + r2 * Math.cos(th);
                pos.y = c2.y + r2 * Math.sin(th);
                pos.angle = th - Math.PI / 2.0;
            } else if (u < 2.0 * n_top + n_sp2) {
                // Bottom straight span from t2_bot to t1_bot (with realistic catenary sag)
                const delta_u = u - (n_top + n_sp2);
                const tau = delta_u / n_top;
                const sag = 0.012 * a * Math.sin(tau * Math.PI);
                pos.x = t2_bot.x + tau * (t1_bot.x - t2_bot.x);
                pos.y = t2_bot.y + tau * (t1_bot.y - t2_bot.y) - sag;
                pos.angle = -phi + Math.PI;
            } else {
                // Sprocket 1 wrap (CW from psi1_bot to psi1_top)
                const delta_u = u - (2.0 * n_top + n_sp2);
                const th = psi1_bot - delta_u * ((2.0 * Math.PI) / z1);
                pos.x = c1.x + r1 * Math.cos(th);
                pos.y = c1.y + r1 * Math.sin(th);
                pos.angle = th - Math.PI / 2.0;
            }

            rollers.push(pos);
        }

        return {
            c1,
            c2,
            r1,
            r2,
            z1,
            z2,
            phi,
            t1_top,
            t2_top,
            t1_bot,
            t2_bot,
            L_span,
            theta1,
            theta2,
            rollers
        };
    }
};

// CommonJS support for Node.js test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChainCalc };
}
