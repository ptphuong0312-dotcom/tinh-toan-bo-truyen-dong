const { BevelCalcEngine } = require('../modules/bevel-gear/js/bevel-calc-engine.js');

// Standard MITCalc 1.74 test case:
// Pinion z1=18, Gear z2=45, mmn=10, b=117, alfa=20, beta=30, x1=0.32, x2=-0.32, Sigma=90
const geom = BevelCalcEngine.calculate({
    z1: 18, z2: 45, mmn: 10, b: 117,
    alfa: 20, beta: 30, gearingType: 'gleason',
    x1: 0.32
});

const z1 = 18, z2 = 45;
const gearRatio = z2 / z1; // 2.5
const delta1 = geom.delta1, delta2 = geom.delta2;
const sinD1 = Math.sin(delta1), cosD1 = Math.cos(delta1);
const sinD2 = Math.sin(delta2), cosD2 = Math.cos(delta2);

const mmn = geom.mmn, b = geom.b, Re = geom.Re, Rm = geom.Rm, Ri = geom.Ri;
const alfa = geom.alfa_deg * Math.PI / 180;
const beta = geom.beta_deg * Math.PI / 180;
const cos_beta = Math.cos(beta);
const tan_alfa_t = Math.tan(alfa) / cos_beta;
const alfa_t = Math.atan(tan_alfa_t);
const inv_alfa_t = tan_alfa_t - alfa_t;

const R_tool = 1.5 * b; // MITCalc Section 16.4
const ForceSign = -1; // Left-Hand Pinion

console.log('MITCalc Exact 3D Geometry:');
console.log(`Re=${Re.toFixed(3)}, Rm=${Rm.toFixed(3)}, Ri=${Ri.toFixed(3)}, b=${b}`);
console.log(`R_tool=${R_tool.toFixed(3)}, beta=${geom.beta_deg} deg, alfa=${geom.alfa_deg} deg`);

// 5 MITCalc sections:
const sections = [
    { name: 'Section A (Toe)', u: -0.5, Rs: Ri },
    { name: 'Section B',       u: -0.25, Rs: Rm - 0.25 * b },
    { name: 'Section C (Mid)', u: 0.0,  Rs: Rm },
    { name: 'Section D',       u: +0.25, Rs: Rm + 0.25 * b },
    { name: 'Section E (Heel)', u: +0.5, Rs: Re }
];

console.log('\n--- MITCalc Section Table Calculation ---');
console.log('Section | u | Rs | dL(mm) | Ang1(deg) | Ang2(deg) | Ratio');
for (let sec of sections) {
    const u = sec.u;
    const Rs = sec.Rs;
    const term = u * b + R_tool * Math.sin(beta);
    const dL = ForceSign * (R_tool * Math.cos(beta) - Math.sqrt(Math.max(0.0, R_tool * R_tool - term * term)));
    const Rz1 = Rs * sinD1;
    const Rz2 = Rs * sinD2;
    const ang1 = (Math.PI + dL / Rz1) * 180 / Math.PI;
    const ang2 = (Math.PI - dL / Rz2) * 180 / Math.PI;
    const dAng1 = (dL / Rz1) * 180 / Math.PI;
    const dAng2 = (-dL / Rz2) * 180 / Math.PI;
    const ratio = Math.abs(dAng1 / dAng2);
    console.log(`${sec.name.padEnd(16)} | ${u.toFixed(2).padStart(5)} | ${Rs.toFixed(1).padStart(5)} | ${dL.toFixed(3).padStart(7)} | ${ang1.toFixed(3).padStart(9)} | ${ang2.toFixed(3).padStart(9)} | ${ratio.toFixed(4)}`);
}
