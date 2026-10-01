const { Worm3DGenerator } = require('../modules/worm-gear/js/engine/worm-3d-generator.js');
const mc = Worm3DGenerator.extractMC3DParams({ a: 103.366, d1: 36.23, da1: 44.698, df1: 25.648, d2: 170.5, da2: 178.97, df2: 159.92, de2: 183.23, mn: 4.233, z1: 1, z2: 40, b2H: 33.57, alfa: 20 });

const worm = Worm3DGenerator.generateWormMesh({ meshDensityLevel: 4 });
const wheel = Worm3DGenerator.generateWheelMesh({ meshDensityLevel: 4 });

const a = mc.MC_a;
const i = mc.MC_z2 / mc.MC_z1;
const pitchAngle = (2.0 * Math.PI) / mc.MC_z2;

for (let deg = 0; deg <= 360; deg += 30) {
    const wormAng = (deg * Math.PI) / 180.0;
    const wheelAng = -wormAng / i;

    let penetrations = 0;
    let maxPen = 0;

    for (let v = 0; v < worm.vertices.length; v += 3) {
        let wx = worm.vertices[v];
        let wy = worm.vertices[v + 1];
        let wz = worm.vertices[v + 2];

        // Rotate worm around X:
        const wy_rot = wy * Math.cos(wormAng) - wz * Math.sin(wormAng);
        const wz_rot = wy * Math.sin(wormAng) + wz * Math.cos(wormAng);

        // Global position:
        const gx = wx;
        const gy = wy_rot - a;
        const gz = wz_rot;

        // Check if inside wheel region:
        const rWheel = Math.hypot(gx, gy);
        if (rWheel < mc.MC_df2 * 0.5 - 1.0 || rWheel > mc.MC_da2 * 0.5 + 2.0) continue;
        if (Math.abs(gz) > mc.MC_b2H * 0.5) continue;

        // In wheel frame (rotated by wheelAng around Z):
        const x2 = gx * Math.cos(wheelAng) + gy * Math.sin(wheelAng);
        const y2 = -gx * Math.sin(wheelAng) + gy * Math.cos(wheelAng);
        const z2 = gz;

        const th2 = Math.atan2(y2, x2);
        let normTh = th2 - (-Math.PI * 0.5);
        normTh = ((normTh % pitchAngle) + pitchAngle) % pitchAngle;
        if (normTh > pitchAngle * 0.5) normTh -= pitchAngle;

        const thSpaceR = Worm3DGenerator.evalConjugateFlankTheta(rWheel, z2, +1, mc);
        const thSpaceL = Worm3DGenerator.evalConjugateFlankTheta(rWheel, z2, -1, mc);

        if (thSpaceR !== null && thSpaceL !== null) {
            const relR = thSpaceR - (-Math.PI * 0.5);
            const relL = thSpaceL - (-Math.PI * 0.5);
            if (normTh > relR + 0.0005) {
                penetrations++;
                const penDist = (normTh - relR) * rWheel;
                if (penDist > maxPen) maxPen = penDist;
            } else if (normTh < relL - 0.0005) {
                penetrations++;
                const penDist = (relL - normTh) * rWheel;
                if (penDist > maxPen) maxPen = penDist;
            }
        }
    }
    console.log('deg=' + deg + ': penetrations=' + penetrations + ', maxPen=' + maxPen.toFixed(3) + ' mm');
}
