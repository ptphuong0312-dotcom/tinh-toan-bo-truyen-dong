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
const cos_beta = Math.cos(beta);
const tan_alfa_t = Math.tan(alfa) / cos_beta;
const alfa_t = Math.atan(tan_alfa_t);
const inv_alfa_t = tan_alfa_t - alfa_t;

const R_tool = 1.5 * b;

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

// Coordinate transforms:
// Pinion rotates around X: base orientation transforms local (x,y,z) where z is along axis
// Pinion axis is X, pitch contact line is in XY at angle delta1 from X:
// Local Z -> X, Local X -> Y, Local Y -> Z (cyclic permutation)
// When theta=0, tooth 0 is at contact line (Y > 0, Z = 0)
const M_p0 = [[0, 0, 1], [1, 0, 0], [0, 1, 0]];

// Gear rotates around Y:
// Gear axis is Y, pitch contact line is in XY at angle delta2 from Y (or delta1 from X)
// Local Z -> Y, Local X -> X, Local Y -> -Z
// When theta=0, tooth space 0 is at contact line (X > 0, Z = 0)
const M_g0 = [[1, 0, 0], [0, 0, 1], [0, -1, 0]];

const numSlices = 10;
const ptsPerFlank = 15;

function getPureFlank(opt) {
    const z = opt.z, delta = opt.delta, isPinion = opt.isPinion;
    const sinD = Math.sin(delta), cosD = Math.cos(delta);
    const ha_e = opt.ha_e, hf_e = opt.hf_e, sn_e = opt.sn_e;

    const slices = [];
    for (let s = 0; s <= numSlices; s++) {
        const frac = s / numSlices;
        const R_s = Re - frac * (Re - Ri);
        const scale_s = R_s / Re;
        const u = (R_s - Rm) / b;

        // MITCalc formula for dL
        const term = u * b + R_tool * Math.sin(beta);
        const dL = -1 * (R_tool * Math.cos(beta) - Math.sqrt(Math.max(0.0, R_tool * R_tool - term * term)));
        
        // Pure angle offset from MITCalc table
        const spiralAngle = isPinion ? (dL / (R_s * sinD)) : (-dL / (R_s * sinD));

        const r_pitch = R_s * sinD;
        const z_pitch = R_s * cosD;
        const ha_s = ha_e * scale_s;
        const hf_s = hf_e * scale_s;
        
        // PURE standard tooth thickness, NO artificial thinning
        const sn_s = sn_e * scale_s;
        const sn_t = sn_s / cos_beta;

        const rv = (R_s * sinD) / cosD;
        const rvb = rv * Math.cos(alfa_t);
        const rva = rv + ha_s;
        const rvf = Math.max(0.1, rv - hf_s);
        const psi_v = sn_t / (2.0 * rv);

        function eval_flank(t) {
            const r_c = rvf + t * (rva - rvf);
            let psi_c;
            if (r_c >= rvb) {
                const alpha_c = Math.acos(Math.min(1.0, rvb / r_c));
                const inv_c = Math.tan(alpha_c) - alpha_c;
                psi_c = psi_v + inv_alfa_t - inv_c;
            } else {
                psi_c = psi_v + inv_alfa_t;
            }
            const h = r_c - rv;
            const theta = psi_c / cosD;
            return { h, theta };
        }

        const driveFlank = [], coastFlank = [];
        const centerAngle = spiralAngle;
        for (let k = 0; k < ptsPerFlank; k++) {
            const t = k / (ptsPerFlank - 1);
            const pt = eval_flank(t);
            const r_pt = r_pitch + pt.h * cosD;
            const z_pt = z_pitch - pt.h * sinD;

            // Pinion drive flank is at -pt.theta, Gear mating flank is at +pt.theta
            const angDrive = centerAngle - pt.theta;
            const angCoast = centerAngle + pt.theta;

            driveFlank.push({
                x: r_pt * Math.cos(angDrive),
                y: r_pt * Math.sin(angDrive),
                z: z_pt,
                t, u
            });
            coastFlank.push({
                x: r_pt * Math.cos(angCoast),
                y: r_pt * Math.sin(angCoast),
                z: z_pt,
                t, u
            });
        }
        slices.push({ s, u, R_s, driveFlank, coastFlank });
    }
    return slices;
}

const pSlices = getPureFlank({ z: z1, delta: delta1, isPinion: true, ha_e: geom.hae1, hf_e: geom.hfe1, sn_e: geom.sne1 });
const gSlices = getPureFlank({ z: z2, delta: delta2, isPinion: false, ha_e: geom.hae2, hf_e: geom.hfe2, sn_e: geom.sne2 });

console.log('--- Pure Involute Flank Distance Sweep ---');
console.log('Pinion deg | Heel (s=0) | Mid (s=5) | Toe (s=10) | Min Dist Across Flank');

// At pinion angle = 0, Gear tooth space is at contact point.
// Gear tooth 0 center is at half pitch: -pi/z2.
const initialGearAngle = -Math.PI / z2;

for (let deg = -2.0; deg <= 2.0; deg += 0.5) {
    const a = deg * Math.PI / 180;
    const Mp = matMul(rotX(a), M_p0);
    const Mg = matMul(rotY(initialGearAngle - a / gearRatio), M_g0);

    const dists = [];
    for (let s = 0; s <= numSlices; s++) {
        let minD_s = 999;
        // Compare pinion drive flank to gear mating flank
        for (let p of pSlices[s].driveFlank) {
            const pw = applyMat(Mp, [p.x, p.y, p.z]);
            for (let g of gSlices[s].coastFlank) {
                const gw = applyMat(Mg, [g.x, g.y, g.z]);
                const d = Math.hypot(pw[0]-gw[0], pw[1]-gw[1], pw[2]-gw[2]);
                if (d < minD_s) minD_s = d;
            }
        }
        dists.push(minD_s);
    }
    let minD_all = 999, minS = 0;
    dists.forEach((d, s) => { if (d < minD_all) { minD_all = d; minS = s; } });
    console.log(`${deg.toFixed(1).padStart(10)} | ${dists[0].toFixed(3).padStart(10)} | ${dists[5].toFixed(3).padStart(10)} | ${dists[10].toFixed(3).padStart(10)} | Min at s=${minS}: d=${minD_all.toFixed(3)} mm`);
}
