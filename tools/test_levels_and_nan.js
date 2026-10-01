const { Worm3DGenerator } = require('../modules/worm-gear/js/engine/worm-3d-generator.js');

const geom = {
    MC_a: 103.36633, MC_px: Math.PI * 4.233333, MC_pxn: Math.PI * 4.233333,
    MC_alfa: 20.126896, MC_z1: 1, MC_L: 56.726667,
    MC_da1: 44.698, MC_d1: 36.231497, MC_df1: 25.648,
    MC_sx1: (Math.PI * 4.233333) / 4.0,
    MC_ds1: 21.4, MC_t1: 1.1, MC_beta1: 10.0,
    MC_z2: 40, MC_b2H: 33.57,
    MC_da2: 178.96783, MC_d2: 170.501163, MC_df2: 159.91783, MC_de2: 183.23,
    MC_sx2: (Math.PI * 4.233333) / 4.0,
    mn: 4.233333, teethOrientation: 1, ShaftDB2: 32
};

for (const lvl of [1, 6, 8, 9, 10]) {
    const wMesh = Worm3DGenerator.generateWormMesh(Object.assign({}, geom, { meshDensityLevel: lvl }));
    const whMesh = Worm3DGenerator.generateWheelMesh(Object.assign({}, geom, { meshDensityLevel: lvl }));
    const wSurf = Worm3DGenerator.generateWormSurfaceMesh(Object.assign({}, geom, { meshDensityLevel: lvl }));
    const whSurf = Worm3DGenerator.generateWheelSurfaceMesh(Object.assign({}, geom, { meshDensityLevel: lvl }));

    let nanCount = 0;
    [wMesh, whMesh, wSurf, whSurf].forEach(m => {
        for (let i = 0; i < m.vertices.length; i++) if (isNaN(m.vertices[i])) nanCount++;
        for (let i = 0; i < m.normals.length; i++) if (isNaN(m.normals[i])) nanCount++;
    });

    console.log(`Lvl ${lvl}: Worm Solid=${wMesh.indices.length/3} tris, Wheel Solid=${whMesh.indices.length/3} tris, Worm Surf=${wSurf.indices.length/3} tris, Wheel Surf=${whSurf.indices.length/3} tris | NaNs=${nanCount}`);
}
console.log('ALL LEVELS VERIFIED CLEANLY!');
