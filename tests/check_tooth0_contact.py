from playwright.sync_api import sync_playwright
import os

target = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto(target)
    pg.wait_for_load_state('networkidle')
    pg.click('.tab-btn[data-target="tabCanvas"]')
    pg.wait_for_timeout(200)
    pg.click('#btnMode3D')
    pg.wait_for_timeout(500)
    
    res = pg.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.scene.updateMatrixWorld(true);
        const pMesh = v.pinionMesh;
        const gMesh = v.gearMesh;
        
        // Pinion tooth 0 vertices in world space
        const ptsPerFlank = 6;
        const ptsPerTooth = 2 + ptsPerFlank + 1 + ptsPerFlank + 1; // 16
        const numSlices = 10;
        const N = 18 * ptsPerTooth;
        
        const pPos = pMesh.geometry.attributes.position;
        const gPos = gMesh.geometry.attributes.position;
        const tempV = new THREE.Vector3();
        
        const pPts = [];
        for (let s = 0; s <= numSlices; s++) {
            for (let k = 0; k < ptsPerTooth; k++) {
                const idx = s * N + k;
                tempV.fromBufferAttribute(pPos, idx);
                tempV.applyMatrix4(pMesh.matrixWorld);
                pPts.push({ x: tempV.x, y: tempV.y, z: tempV.z });
            }
        }
        
        // Gear teeth near tooth 0
        const Nz = 45 * ptsPerTooth;
        const gPts = [];
        for (let s = 0; s <= numSlices; s++) {
            for (let t of [0, 44]) {
                for (let k = 0; k < ptsPerTooth; k++) {
                    const idx = s * Nz + t * ptsPerTooth + k;
                    tempV.fromBufferAttribute(gPos, idx);
                    tempV.applyMatrix4(gMesh.matrixWorld);
                    gPts.push({ x: tempV.x, y: tempV.y, z: tempV.z });
                }
            }
        }
        
        let minD = 999;
        let pClosest = null, gClosest = null;
        for (let p of pPts) {
            for (let g of gPts) {
                const d = Math.hypot(p.x - g.x, p.y - g.y, p.z - g.z);
                if (d < minD) {
                    minD = d;
                    pClosest = p;
                    gClosest = g;
                }
            }
        }
        return { minD, pClosest, gClosest, pCount: pPts.length, gCount: gPts.length };
    }''')
    print('Pinion Tooth 0 points:', res['pCount'])
    print('Gear Mating points:', res['gCount'])
    print(f'Closest clearance minD: {res["minD"]:.4f} mm')
    print('Contact point Pinion:', res['pClosest'])
    print('Contact point Gear:', res['gClosest'])
    b.close()
