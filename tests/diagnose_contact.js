const { Bevel3DGenerator } = require('../modules/bevel-gear/js/engine/bevel-3d-generator.js');
const { BevelCalcEngine } = require('../modules/bevel-gear/js/bevel-calc-engine.js');

const geom = BevelCalcEngine.calculate({
    z1: 18, z2: 45, mmn: 10, b: 117,
    alfa: 20, beta: 30, gearingType: 'gleason',
    x1: 0.32
});

const z1 = 18, z2 = 45;
const gearRatio = z2 / z1;
const delta1 = geom.delta1, delta2 = geom.delta2;
const mmn = geom.mmn, b = geom.b, Re = geom.Re, Rm = geom.Rm, Ri = geom.Ri;
const alfa = geom.alfa_deg * Math.PI / 180;
const beta = geom.beta_deg * Math.PI / 180;

function rotX(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [[1, 0, 0], [0, c, -s], [0, s, c]];
}
function rotY(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
}
function rotZ(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}
function matMul(A, B) {
    const C = [[0,0,0],[0,0,0],[0,0,0]];
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            for(let k=0; k<3; k++) C[i][j] += A[i][k] * B[k][j];
        }
    }
    return C;
}
function applyMat(M, v) {
    return [
        M[0][0]*v[0] + M[0][1]*v[1] + M[0][2]*v[2],
        M[1][0]*v[0] + M[1][1]*v[1] + M[1][2]*v[2],
        M[2][0]*v[0] + M[2][1]*v[1] + M[2][2]*v[2]
    ];
}

const M_p0 = matMul(rotY(Math.PI/2), rotZ(Math.PI/2));
const M_g0 = rotX(-Math.PI/2);

function getToothSlices(opt) {
    const z = opt.z, mmn = opt.mmn, delta = opt.delta;
    const sinD = Math.sin(delta), cosD = Math.cos(delta);
    const Re = opt.Re, Ri = opt.Ri, Rm = opt.Rm, b = opt.b;
    const alfa = opt.alfa, beta = opt.beta;
    const ha_e = opt.ha_e, hf_e = opt.hf_e, sn_e = opt.sn_e;
    const hand = opt.hand || 1;
    const isSpiral = Math.abs(beta) > 1e-4;
    const R_tool = 1.5 * b;
    const numSlices = 10;
    const ptsPerFlank = 10;

    const slices = [];
    for (let s = 0; s <= numSlices; s++) {
        const frac = s / numSlices;
        const R_s = Re - frac * (Re - Ri);
        const scale_s = R_s / Re;
        const u = (R_s - Rm) / b;

        let spiralAngle = 0.0;
        if (isSpiral) {
            const term = u * b + R_tool * Math.sin(beta);
            const W = hand * (R_tool * Math.cos(beta) - Math.sqrt(Math.max(0.0, R_tool * R_tool - term * term)));
            const sin_spiral = W / Math.max(1.0, R_s * sinD);
            spiralAngle = Math.asin(Math.max(-0.99, Math.min(0.99, sin_spiral)));
        }

        const r_pitch = R_s * sinD;
        const z_pitch = R_s * cosD;
        const ha_s = ha_e * scale_s;
        const hf_s = hf_e * scale_s;

        const C_L = isSpiral ? (mmn * 0.020) : (mmn * 0.005);
        const crown_L = C_L * Math.pow(2.0 * u, 2.0);
        const jn_cad = mmn * 0.010;
        const sn_s = Math.max(0.1, (sn_e * scale_s) - crown_L - (jn_cad / 2.0));

        const cos_beta = isSpiral ? Math.max(0.2, Math.cos(beta)) : 1.0;
        const tan_alfa_t = Math.tan(alfa) / cos_beta;
        const alfa_t = Math.atan(tan_alfa_t);
        const inv_alfa_t = tan_alfa_t - alfa_t;
        const sn_t = sn_s / cos_beta;

        const rv = (R_s * sinD) / cosD;
        const rvb = rv * Math.cos(alfa_t);
        const rva = rv + ha_s;
        const rvf = Math.max(0.1, rv - hf_s);
        const psi_v = sn_t / (2.0 * rv);

        function eval_flank(t) {
            let r_drop = 0.0;
            if (t > 0.65) {
                const u_drop = (t - 0.65) / 0.35;
                r_drop = (0.150 * mmn) * (u_drop * u_drop);
            }
            const r_c = rvf + t * (rva - rvf) - r_drop;
            let psi_c;
            if (r_c >= rvb) {
                const alpha_c = Math.acos(Math.min(1.0, rvb / r_c));
                const inv_c = Math.tan(alpha_c) - alpha_c;
                psi_c = psi_v + inv_alfa_t - inv_c;
            } else {
                const under_t = (rvb - r_c) / Math.max(1.0, rvb - rvf);
                const root_relief = (mmn * 0.060 / rv) * under_t;
                psi_c = Math.max(0.0001, (psi_v + inv_alfa_t) - root_relief);
            }
            if (t < 0.35) {
                const u_root = (0.35 - t) / 0.35;
                const root_easing = (0.220 * mmn / rv) * (u_root * u_root);
                psi_c = Math.max(0.0001, psi_c - root_easing);
            }
            if (t > 0.65) {
                const u_tip = (t - 0.65) / 0.35;
                const tip_easing = (0.180 * mmn / rv) * (u_tip * u_tip);
                psi_c = Math.max(0.0001, psi_c - tip_easing);
            }
            const h = r_c - rv;
            const theta = psi_c / cosD;
            return { h, theta };
        }

        // Generate all teeth
        const allTeeth = [];
        for (let tooth = 0; tooth < z; tooth++) {
            const centerAngle = (tooth * 2.0 * Math.PI) / z + spiralAngle;
            const flank1 = [];
            const flank2 = [];
            for (let k = 0; k < ptsPerFlank; k++) {
                const t = k / (ptsPerFlank - 1);
                const pt = eval_flank(t);
                const ang1 = centerAngle - pt.theta;
                const r1 = r_pitch + pt.h * cosD;
                const z1_pt = z_pitch - pt.h * sinD;
                flank1.push([r1 * Math.cos(ang1), r1 * Math.sin(ang1), z1_pt, t]);

                const ang2 = centerAngle + pt.theta;
                const r2 = r_pitch + pt.h * cosD;
                const z2_pt = z_pitch - pt.h * sinD;
                flank2.push([r2 * Math.cos(ang2), r2 * Math.sin(ang2), z2_pt, t]);
            }
            allTeeth.push({ tooth, flank1, flank2 });
        }
        slices.push({ s, frac, R_s, u, allTeeth });
    }
    return slices;
}

const opt1 = {
    z: z1, mmn, delta: delta1,
    Re, Ri, Rm, b, alfa, beta,
    ha_e: geom.hae1, hf_e: geom.hfe1, sn_e: geom.sne1,
    hand: -1
};
const opt2 = {
    z: z2, mmn, delta: delta2,
    Re, Ri, Rm, b, alfa, beta,
    ha_e: geom.hae2, hf_e: geom.hfe2, sn_e: geom.sne2,
    hand: 1
};

const slices1 = getToothSlices(opt1);
const slices2 = getToothSlices(opt2);

const initialGearAngle = -Math.PI / z2;

// Let's test at pinionAngle = 0: which gear tooth is closest to pinion tooth 0?
const Mp0_w = applyMat(matMul(rotX(0), M_p0), [slices1[5].allTeeth[0].flank1[5][0], slices1[5].allTeeth[0].flank1[5][1], slices1[5].allTeeth[0].flank1[5][2]]);

let closestGearTooth = 0;
let minD = 999;
const Mg0_w = matMul(rotY(initialGearAngle), M_g0);
for (let gt = 0; gt < z2; gt++) {
    for (let p of slices2[5].allTeeth[gt].flank1) {
        const gw = applyMat(Mg0_w, [p[0], p[1], p[2]]);
        const d = Math.hypot(Mp0_w[0]-gw[0], Mp0_w[1]-gw[1], Mp0_w[2]-gw[2]);
        if (d < minD) {
            minD = d;
            closestGearTooth = gt;
        }
    }
}
console.log('Closest gear tooth at Mid (s=5) is tooth:', closestGearTooth, 'min dist:', minD.toFixed(3));

// Now for each slice s, find the minimum clearance between Pinion tooth 0 and Gear tooth closestGearTooth
console.log('\nContact analysis along tooth width (Pinion tooth 0 vs Gear tooth ' + closestGearTooth + '):');
for (let s = 0; s <= 10; s++) {
    const pTeeth = slices1[s].allTeeth[0];
    const gTeeth = slices2[s].allTeeth[closestGearTooth];
    
    let minD_slice = 999;
    let minAngle = 0;
    let contactP = null, contactG = null;

    // Sweep pinion angle across contact range [-0.08, +0.08]
    for (let a = -0.08; a <= 0.08; a += 0.001) {
        const Mp = matMul(rotX(a), M_p0);
        const Mg = matMul(rotY(initialGearAngle - a / gearRatio), M_g0);
        
        // Pinion flank2 meshes with Gear flank1 (or flank1 with flank2)
        for (let p of pTeeth.flank2) {
            const pw = applyMat(Mp, [p[0], p[1], p[2]]);
            for (let g of gTeeth.flank1) {
                const gw = applyMat(Mg, [g[0], g[1], g[2]]);
                const d = Math.hypot(pw[0]-gw[0], pw[1]-gw[1], pw[2]-gw[2]);
                if (d < minD_slice) {
                    minD_slice = d;
                    minAngle = a;
                    contactP = p;
                    contactG = g;
                }
            }
        }
    }
    const label = s === 0 ? 'Heel (Nón ngoài)' : (s === 5 ? 'Mid (Khu giữa)' : (s === 10 ? 'Toe (Nón trong)' : ''));
    console.log(`s=${s.toString().padStart(2)}: min clearance = ${minD_slice.toFixed(3)} mm at pinion angle = ${(minAngle*180/Math.PI).toFixed(2).padStart(6)} deg | p_t=${contactP[3].toFixed(2)}, g_t=${contactG[3].toFixed(2)} ${label}`);
}
