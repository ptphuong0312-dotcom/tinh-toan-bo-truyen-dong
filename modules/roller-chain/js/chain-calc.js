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

        // Section 5.0 ISO 606 / DIN 8187 Sprocket Dimensions
        const d3 = isMetric ? chain.d3 : chain.d3 / 25.4;
        const d1_pin = isMetric ? chain.d1 : chain.d1 / 25.4;
        const b1 = isMetric ? chain.b1 : chain.b1 / 25.4;
        const b2 = isMetric ? chain.b2 : chain.b2 / 25.4;
        const strands = chain.strands || 1;
        const e_trans = isMetric ? chain.e : chain.e / 25.4;

        // Tip diameter Da (ISO 606)
        const da1_min = d1 + 0.5 * d3;
        const da1_max = d1 + 1.25 * p - d3;
        const da1 = (da1_min + da1_max) / 2.0;

        const da2_min = d2 + 0.5 * d3;
        const da2_max = d2 + 1.25 * p - d3;
        const da2 = (da2_min + da2_max) / 2.0;

        // Root radius R1 (ISO 606 / MITCalc: power 0.33)
        const d3_mm = chain.d3;
        const r1_min_mm = 0.505 * d3_mm;
        const r1_max_mm = 0.505 * d3_mm + 0.069 * (d3_mm ** 0.33);
        const R1_raw = (r1_min_mm + r1_max_mm) / 2.0;
        const R1_val = isMetric ? R1_raw : R1_raw / 25.4;
        const RA = isMetric ? 2 : 3;
        const R1 = Number(R1_val.toFixed(RA));

        // Root diameter Df (Bottom of tooth gullet): Df = d - 2 * R1
        const df1 = Number((d1 - 2.0 * R1).toFixed(RA));
        const df2 = Number((d2 - 2.0 * R1).toFixed(RA));

        // Flank radius R2
        const r2_1_min_mm = 0.12 * d3_mm * (z1 + 2);
        const r2_1_max_mm = 0.008 * d3_mm * (z1 * z1 + 180);
        const R2_1_mm = (r2_1_min_mm + r2_1_max_mm) / 2.0;
        const R2_1 = isMetric ? R2_1_mm : R2_1_mm / 25.4;

        const r2_2_min_mm = 0.12 * d3_mm * (z2 + 2);
        const r2_2_max_mm = 0.008 * d3_mm * (z2 * z2 + 180);
        const R2_2_mm = (r2_2_min_mm + r2_2_max_mm) / 2.0;
        const R2_2 = isMetric ? R2_2_mm : R2_2_mm / 25.4;

        // Flank angle alpha
        const flank_alpha1 = 130.0 - 90.0 / z1;
        const flank_alpha2 = 130.0 - 90.0 / z2;

        // Tooth width bf
        let bf_factor = 0.95;
        if (p_mm < 12.7) {
            bf_factor = strands === 1 ? 0.93 : (strands === 2 ? 0.91 : 0.88);
        } else {
            bf_factor = strands === 1 ? 0.95 : (strands === 2 ? 0.93 : 0.93);
        }
        const bf = bf_factor * b1;

        // Total width for multi-strand sprockets
        const B_tot = strands === 1 ? bf : (strands - 1) * e_trans + bf;

        // Chamfer width ba & radius rx
        const ba = 0.125 * d3;
        const rx = 1.5 * d1_pin;

        // Tooth depth f & Rim diameter Dg
        const f = 0.7 * p;
        const Dg1 = d1 - 2.0 * f;
        const Dg2 = d2 - 2.0 * f;

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
            alphaDeg: flank_alpha1
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
            alphaDeg: flank_alpha2
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

            // Nested sprocket structures
            sprocket1,
            sprocket2
        };
    },

    /**
     * Generate 2D Profile Points for a Sprocket Tooth (ISO 606)
     */
    generateSprocket2DPoints(z, pOrData, d3, da, df, R1, R2, alphaDeg, numPointsPerTooth = 24) {
        let p, d3_val, da_val, df_val, R1_val;
        if (typeof pOrData === 'object' && pOrData !== null) {
            p = pOrData.p || 12.7;
            d3_val = pOrData.d3 || 8.51;
            da_val = pOrData.da || (p / Math.sin(Math.PI / z) + 10);
            df_val = pOrData.df || (p / Math.sin(Math.PI / z) - 10);
            R1_val = pOrData.R1 || 4.25;
        } else {
            p = pOrData || 12.7;
            d3_val = d3 || 8.51;
            da_val = da || (p / Math.sin(Math.PI / z) + 10);
            df_val = df || (p / Math.sin(Math.PI / z) - 10);
            R1_val = R1 || 4.25;
        }

        const d = p / Math.sin(Math.PI / z);
        const pitchAngle = (2.0 * Math.PI) / z;
        const halfPitch = pitchAngle / 2.0;

        const points = [];
        const r_root = df_val / 2.0;
        const r_tip = da_val / 2.0;
        const r_pitch = d / 2.0;

        // Angular spread of roller gullet
        const gamma = Math.asin(Math.min(1.0, (d3_val / 2.0) / r_pitch));

        for (let i = 0; i < z; i++) {
            const centerAngle = i * pitchAngle;

            // Roller center on pitch circle
            const rc_x = r_pitch * Math.cos(centerAngle);
            const rc_y = r_pitch * Math.sin(centerAngle);

            // Bottom gullet arc (around roller center)
            const gulletSteps = 8;
            for (let j = -gulletSteps / 2; j <= gulletSteps / 2; j++) {
                const subAng = centerAngle + Math.PI + (j / (gulletSteps / 2)) * (Math.PI / 4.0);
                const gx = rc_x + R1 * Math.cos(subAng);
                const gy = rc_y + R1 * Math.sin(subAng);
                points.push({ x: gx, y: gy });
            }

            // Tooth flank rising to tip
            const flankSteps = 6;
            const tipAngle = centerAngle + halfPitch;
            for (let j = 1; j <= flankSteps; j++) {
                const t = j / flankSteps;
                const r = r_root + t * (r_tip - r_root);
                const ang = centerAngle + gamma + t * (halfPitch - gamma);
                points.push({
                    x: r * Math.cos(ang),
                    y: r * Math.sin(ang)
                });
            }
        }

        return points;
    },

    /**
     * Generate Chain Transmission Kinematic Path & Roller Positions
     */
    generateChainKinematics(d1, d2, a, p, X, rotationAngle = 0.0) {
        const r1 = d1 / 2.0;
        const r2 = d2 / 2.0;

        // Tangent angle between two sprockets
        const sin_phi = (r2 - r1) / a;
        const phi = Math.asin(Math.min(1.0, Math.max(-1.0, sin_phi)));

        // Sprocket centers: Sprocket 1 at (0, 0), Sprocket 2 at (a, 0)
        const c1 = { x: 0, y: 0 };
        const c2 = { x: a, y: 0 };

        // Tangent contact points
        // Top span (Tension strand)
        const t1_top = {
            x: c1.x - r1 * Math.sin(phi),
            y: c1.y + r1 * Math.cos(phi)
        };
        const t2_top = {
            x: c2.x - r2 * Math.sin(phi),
            y: c2.y + r2 * Math.cos(phi)
        };

        // Bottom span (Slack strand)
        const t1_bot = {
            x: c1.x + r1 * Math.sin(phi),
            y: c1.y - r1 * Math.cos(phi)
        };
        const t2_bot = {
            x: c2.x + r2 * Math.sin(phi),
            y: c2.y - r2 * Math.cos(phi)
        };

        // Length of straight span
        const L_span = Math.hypot(t2_top.x - t1_top.x, t2_top.y - t1_top.y);

        // Arcs of wrap
        const arc1_len = r1 * (Math.PI - 2.0 * phi);
        const arc2_len = r2 * (Math.PI + 2.0 * phi);
        const total_perimeter = 2.0 * L_span + arc1_len + arc2_len;

        // Rollers positioned along the closed chain loop
        const rollers = [];
        const roller_count = X;
        const link_step = total_perimeter / roller_count;

        for (let i = 0; i < roller_count; i++) {
            let s = ((i * link_step) + rotationAngle * r1) % total_perimeter;
            if (s < 0) s += total_perimeter;

            let pos = { x: 0, y: 0 };

            if (s < L_span) {
                // On top straight span (t1_top -> t2_top)
                const u = s / L_span;
                pos.x = t1_top.x + u * (t2_top.x - t1_top.x);
                pos.y = t1_top.y + u * (t2_top.y - t1_top.y);
            } else if (s < L_span + arc2_len) {
                // Wrapping around sprocket 2 (counter-clockwise)
                const s_arc = s - L_span;
                const theta = (Math.PI / 2.0 - phi) - (s_arc / r2);
                pos.x = c2.x + r2 * Math.cos(theta);
                pos.y = c2.y + r2 * Math.sin(theta);
            } else if (s < 2.0 * L_span + arc2_len) {
                // On bottom return span (t2_bot -> t1_bot) with slight catenary sag
                const s_span = s - (L_span + arc2_len);
                const u = s_span / L_span;
                const sag = 0.02 * a * Math.sin(u * Math.PI); // Parabolic catenary sag
                pos.x = t2_bot.x + u * (t1_bot.x - t2_bot.x);
                pos.y = t2_bot.y + u * (t1_bot.y - t2_bot.y) - sag;
            } else {
                // Wrapping around sprocket 1
                const s_arc = s - (2.0 * L_span + arc2_len);
                const theta = (-Math.PI / 2.0 - phi) - (s_arc / r1);
                pos.x = c1.x + r1 * Math.cos(theta);
                pos.y = c1.y + r1 * Math.sin(theta);
            }

            rollers.push(pos);
        }

        return {
            c1,
            c2,
            r1,
            r2,
            phi,
            t1_top,
            t2_top,
            t1_bot,
            t2_bot,
            L_span,
            total_perimeter,
            rollers
        };
    }
};

// CommonJS support for Node.js test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChainCalc };
}
