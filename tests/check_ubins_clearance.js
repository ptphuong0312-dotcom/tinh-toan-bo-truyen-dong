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

function buildRings(opt) {
    const z = opt.z, mmn = opt.mmn, delta = opt.delta;
    const sinD = Math.sin(delta), cosD = Math.cos(delta);
    const Re = opt.Re, Ri = opt.Ri, Rm = opt.Rm, b = opt.b;
    const alfa = opt.alfa, beta = opt.beta;
    const ha_e = opt.ha_e, hf_e = opt.hf_e, sn_e = opt.sn_e;
    const hand = opt.hand || 1;
    const isSpiral = Math.abs(beta) > 1e-4;
    const R_tool = 1.5 * b;
    const numSlices = 10;
    const ptsPerFlank = 8;

    const layers = [];
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

        const toothContour = [];
        // Flank 1
        for (let k = 0; k < ptsPerFlank; k++) {
            const t = k / (ptsPerFlank - 1);
            const pt = eval_flank(t);
            toothContour.push({ h: pt.h, theta: -pt.theta, flankT: t, isEngageFlank: true });
        }
        // Crest
        const tipPt = eval_flank(1.0);
        toothContour.push({ h: tipPt.h, theta: 0.0, flankT: 1.0, isEngageFlank: false });
        // Flank 2
        for (let k = ptsPerFlank - 1; k >= 0; k--) {
            const t = k / (ptsPerFlank - 1);
            const pt = eval_flank(t);
            toothContour.push({ h: pt.h, theta: +pt.theta, flankT: t, isEngageFlank: true });
        }

        const ring = [];
        for (let tooth = 0; tooth < z; tooth++) {
            const centerAngle = (tooth * 2.0 * Math.PI) / z + spiralAngle;
            for (let p = 0; p < toothContour.length; p++) {
                const pt = toothContour[p];
                const ang = centerAngle + pt.theta;
                const r_pt = r_pitch + pt.h * cosD;
                const z_pt = z_pitch - pt.h * sinD;
                ring.push({
                    x: r_pt * Math.cos(ang),
                    y: r_pt * Math.sin(ang),
                    z: z_pt,
                    uFace: u,
                    flankT: pt.flankT,
                    isEngageFlank: pt.isEngageFlank,
                    tooth,
                    ptIdx: p
                });
            }
        }
        layers.push(ring);
    }
    return layers;
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

const layers1 = buildRings(opt1);
const layers2 = buildRings(opt2);

// Now: For each slice s (from 0 Heel to 10 Toe),
// extract Pinion tooth 0 engage flank points,
// and compare against Gear tooth 0 & 44 engage flank points across rotation:
console.log('Comparing tooth 0 of Pinion against mating tooth of Gear along face width:');

for (let s = 0; s <= 10; s++) {
    const ring1 = layers1[s];
    const ring2 = layers2[s];
    const u = ring1[0].uFace;

    // Pinion tooth 0 engage flank
    const pPts = ring1.filter(p => p.tooth === 0 && p.isEngageFlank);
    // Gear teeth near mating zone (tooth 0, 1, 44)
    const gPts = ring2.filter(p => (p.tooth === 0 || p.tooth === 1 || p.tooth === z2 - 1) && p.isEngageFlank);

    let minD = 999;
    let minAngle = 0;
    let bestP = null, bestG = null;

    for (let a = -0.12; a <= 0.12; a += 0.001) {
        const Mp = matMul(rotX(a), M_p0);
        const Mg = matMul(rotY(initialGearAngle - a / gearRatio), M_g0);

        for (let p of pPts) {
            const pw = applyMat(Mp, [p.x, p.y, p.z]);
            for (let g of gPts) {
                const gw = applyMat(Mg, [g.x, g.y, g.z]);
                const d = Math.hypot(pw[0]-gw[0], pw[1]-gw[1], pw[2]-gw[2]);
                if (d < minD) {
                    minD = d;
                    minAngle = a;
                    bestP = p;
                    bestG = g;
                }
            }
        }
    }
    const label = s === 0 ? 'Heel (Nón ngoài - ngoài cùng to nhất)' : (s === 5 ? 'Mid (Khu giữa)' : (s === 10 ? 'Toe (Nón trong)' : ''));
    console.log(`s=${s.toString().padStart(2)} (u=${u.toFixed(2)}): min clearance = ${minD.toFixed(3)} mm at Pinion angle = ${(minAngle*180/Math.PI).toFixed(2).padStart(6)} deg | Pinion t=${bestP.flankT.toFixed(2)}, Gear t=${bestG.flankT.toFixed(2)} (Gear tooth ${bestG.tooth}) ${label}`);
}
