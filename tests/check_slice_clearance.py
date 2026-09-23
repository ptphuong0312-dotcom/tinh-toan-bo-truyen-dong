import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const z1 = v.geom.z1;
        const z2 = v.geom.z2;
        const gearRatio = v.gearRatio;
        
        const numSlices = 10;
        const ptsPerFlank = 6;
        const ptsPerTooth = 16;
        const N1 = z1 * ptsPerTooth;
        const N2 = z2 * ptsPerTooth;
        
        const pos1 = v.pinionMesh.geometry.attributes.position;
        const pos2 = v.gearMesh.geometry.attributes.position;
        
        const v1 = new THREE.Vector3();
        const v2 = new THREE.Vector3();
        
        const sliceDistances = [];
        for (let s = 0; s <= numSlices; s++) {
            sliceDistances.push({ s, minOverallDist: 999, atAngle: 0 });
        }
        
        for (let a = -0.20; a <= 0.20; a += 0.005) {
            v.pinionAngle = a;
            v.gearAngle = v.initialGearAngle - a / gearRatio;
            v.updateGearRotations();
            v.scene.updateMatrixWorld(true);
            
            const m1 = v.pinionMesh.matrixWorld;
            const m2 = v.gearMesh.matrixWorld;
            
            for (let s = 0; s <= numSlices; s++) {
                let minDistForAngle = 999;
                for (let k1 = 2; k1 <= 14; k1++) {
                    const idx1 = s * N1 + k1;
                    v1.fromBufferAttribute(pos1, idx1).applyMatrix4(m1);
                    
                    for (let gt of [0, z2 - 1]) {
                        for (let k2 = 2; k2 <= 14; k2++) {
                            const idx2 = s * N2 + gt * ptsPerTooth + k2;
                            v2.fromBufferAttribute(pos2, idx2).applyMatrix4(m2);
                            const dist = v1.distanceTo(v2);
                            if (dist < minDistForAngle) minDistForAngle = dist;
                        }
                    }
                }
                if (minDistForAngle < sliceDistances[s].minOverallDist) {
                    sliceDistances[s].minOverallDist = minDistForAngle;
                    sliceDistances[s].atAngle = a;
                }
            }
        }
        return sliceDistances;
    }''')
    
    print('Minimum clearance per slice (s=0 is Heel/Outer, s=5 is Mid, s=10 is Toe/Inner):')
    for item in res:
        print(f"  s={item['s']:2d}: min clearance = {item['minOverallDist']:.3f} mm at pinion angle {item['atAngle']:+.3f} rad")
    b.close()
