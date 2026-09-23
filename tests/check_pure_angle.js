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

function rotX(a) { const c = Math.cos(a), s = Math.sin(a); return [[1,0,0],[0,c,-s],[0,s,c]]; }
function rotY(a) { const c = Math.cos(a), s = Math.sin(a); return [[c,0,s],[0,1,0],[-s,0,c]]; }
function rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return [[c,-s,0],[s,c,0],[0,0,1]]; }
function matMul(A, B) {
    const C = [[0,0,0],[0,0,0],[0,0,0]];
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) for(let k=0;k<3;k++) C[i][j]+=A[i][k]*B[k][j];
    return C;
}
function applyMat(M, v) {
    return [M[0][0]*v[0]+M[0][1]*v[1]+M[0][2]*v[2], M[1][0]*v[0]+M[1][1]*v[1]+M[1][2]*v[2], M[2][0]*v[0]+M[2][1]*v[1]+M[2][2]*v[2]];
}

const M_p0 = matMul(rotY(Math.PI/2), rotZ(Math.PI/2));
const M_g0 = rotX(-Math.PI/2);
const initialGearAngle = -Math.PI / z2;

const numSlices = 10;
const ptsPerFlank = 10;
const R_tool = 1.5 * b;

function getFlankPts(opt) {
    const z = opt.z, delta = opt.delta, hand = opt.hand;
    const sinD = Math.sin(delta), cosD = Math.cos(delta);
    const ha_e = opt.ha_e, hf_e = opt.hf_e, sn_e = opt.sn_e;
    const cos_beta = Math.cos(beta);
    const tan_alfa_t = Math.tan(alfa) / cos_beta;
    const alfa_t = Math.atan(tan_alfa_t);
    const inv_alfa_t = tan_alfa_t - alfa_t;

    const slices = [];
    for (let s = 0; s <= numSlices; s++) {
        const frac = s / numSlices;
        const R_s = Re - frac * (Re - Ri);
        const scale_s = R_s / Re;
        const u = (R_s - Rm) / b;

        const term = u * b + R_tool * Math.sin(beta);
        const W = hand * (R_tool * Math.cos(beta) - Math.sqrt(Math.max(0.0, R_tool * R_tool - term * term)));
        // PURE CONICAL DEVELOPMENT ANGLE: theta = W / r_pitch (NO ASIN!)
        const spiralAngle = W / Math.max(1.0, R_s * sinD);

        const r_pitch = R_s * sinD;
        const z_pitch = R_s * cosD;
        const ha_s = ha_e * scale_s;
        const hf_s = hf_e * scale_s;
        const C_L = mmn * 0.020;
        const crown_L = C_L * Math.pow(2.0 * u, 2.0);
        const jn_cad = mmn * 0.010;
        const sn_s = Math.max(0.1, (sn_e * scale_s) - crown_L - (jn_cad / 2.0));
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

        const f1 = [], f2 = [];
        const centerAngle = spiralAngle;
        for (let k = 0; k < ptsPerFlank; k++) {
            const t = k / (ptsPerFlank - 1);
            const pt = eval_flank(t);
            const r_pt = r_pitch + pt.h * cosD;
            const z_pt = z_pitch - pt.h * sinD;

            const ang1 = centerAngle - pt.theta;
            f1.push({ x: r_pt * Math.cos(ang1), y: r_pt * Math.sin(ang1), z: z_pt, t });

            const ang2 = centerAngle + pt.theta;
            f2.push({ x: r_pt * Math.cos(ang2), y: r_pt * Math.sin(ang2), z: z_pt, t });
        }
        slices.push({ s, u, f1, f2, R_s });
    }
    return slices;
}

const pSlices = getFlankPts({ z: z1, delta: delta1, hand: -1, ha_e: geom.hae1, hf_e: geom.hfe1, sn_e: geom.sne1 });
const gSlices = getFlankPts({ z: z2, delta: delta2, hand: 1, ha_e: geom.hae2, hf_e: geom.hfe2, sn_e: geom.sne2 });

console.log('Sweeping with pure angle formulation (no asin):');
console.log('Angle(deg) | Heel (s=0) | Mid (s=5)  | Toe (s=10) | Closest Slice');
for (let deg = -4.0; deg <= 4.0; deg += 1.0) {
    const a = deg * Math.PI / 180;
    const Mp = matMul(rotX(a), M_p0);
    const Mg = matMul(rotY(initialGearAngle - a / gearRatio), M_g0);

    const dists = [];
    for (let s = 0; s <= numSlices; s++) {
        let minD_s = 999;
        for (let p of pSlices[s].f1.concat(pSlices[s].f2)) {
            const pw = applyMat(Mp, [p.x, p.y, p.z]);
            for (let g of gSlices[s].f1.concat(gSlices[s].f2)) {
                const gw = applyMat(Mg, [g.x, g.y, g.z]);
                const d = Math.hypot(pw[0]-gw[0], pw[1]-gw[1], pw[2]-gw[2]);
                if (d < minD_s) minD_s = d;
            }
        }
        dists.push(minD_s);
    }
    let minD_all = 999, minS = 0;
    dists.forEach((d, s) => { if (d < minD_all) { minD_all = d; minS = s; } });
    console.log(`${deg.toFixed(1).padStart(9)} | ${dists[0].toFixed(3).padStart(10)} | ${dists[5].toFixed(3).padStart(10)} | ${dists[10].toFixed(3).padStart(10)} | s=${minS} (d=${minD_all.toFixed(3)})`);
}
