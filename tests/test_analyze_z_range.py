import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
file_url = "file:///" + target_path.replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # Let's inspect the tooth mesh vertices at each slice s from 0 to numSlices
    # for Pinion tooth 0 and Gear mating tooth space
    analysis = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.pinionAngle = 0;
        v.gearAngle = v.initialGearAngle;
        v.updateGearRotations();
        v.scene.updateMatrixWorld(true);

        const pMesh = v.pinionMesh;
        const gMesh = v.gearMesh;
        const geom = v.geom;

        // Extract raw layer vertices from visualizer meshes
        const pPos = pMesh.geometry.attributes.position;
        const gPos = gMesh.geometry.attributes.position;
        const tempV = new THREE.Vector3();

        // Pinion tooth 0 vertices at each slice
        // In bevel-3d-generator: each tooth has (2 + 2*ptsPerFlank + 2) vertices = 2 + 12 + 2 = 16 pts
        // Slices s = 0 (heel) to numSlices (toe)
        // Let's sample points along the pitch line in world space:
        const slices = [];
        const numSlices = 10;
        const ptsPerTooth = 16; // pts per tooth contour
        const z1 = geom.z1;
        const z2 = geom.z2;

        // Find vertices of Pinion tooth 0
        // Tooth 0 in layer s starts at index: (s * z1 * ptsPerTooth + 0)
        // Flank 1: pt index 2 to 7
        // Flank 2: pt index 8 to 13
        for (let s = 0; s <= numSlices; s++) {
            const Rs = geom.Re - (s / numSlices) * (geom.Re - geom.Ri);
            const u = (Rs - geom.Rm) / geom.b;

            // Sample Pinion tooth 0 tip, left flank, right flank
            // Vertex indices in geometry for layer s, tooth 0:
            // Let's find vertices in world space near x = Rs*cos(delta1), y = Rs*sin(delta1)
            const xc = Rs * Math.cos(geom.delta1);
            const yc = Rs * Math.sin(geom.delta1);

            const pNear = [];
            for (let k = 0; k < pPos.count; k++) {
                tempV.fromBufferAttribute(pPos, k).applyMatrix4(pMesh.matrixWorld);
                if (Math.hypot(tempV.x - xc, tempV.y - yc) < 15) {
                    pNear.push({ x: tempV.x, y: tempV.y, z: tempV.z });
                }
            }

            const gNear = [];
            for (let k = 0; k < gPos.count; k++) {
                tempV.fromBufferAttribute(gPos, k).applyMatrix4(gMesh.matrixWorld);
                if (Math.hypot(tempV.x - xc, tempV.y - yc) < 15) {
                    gNear.push({ x: tempV.x, y: tempV.y, z: tempV.z });
                }
            }

            // Min and max Z of Pinion tooth and Gear teeth near contact
            let pMinZ = 999, pMaxZ = -999;
            for (let p of pNear) {
                if (p.z < pMinZ) pMinZ = p.z;
                if (p.z > pMaxZ) pMaxZ = p.z;
            }
            let gMinZ = 999, gMaxZ = -999;
            for (let g of gNear) {
                if (g.z < gMinZ) gMinZ = g.z;
                if (g.z > gMaxZ) gMaxZ = g.z;
            }

            slices.push({
                s, u: u.toFixed(2), Rs: Rs.toFixed(1),
                pNearCount: pNear.length, gNearCount: gNear.length,
                pZRange: [pMinZ.toFixed(1), pMaxZ.toFixed(1)],
                gZRange: [gMinZ.toFixed(1), gMaxZ.toFixed(1)],
                pMidZ: ((pMinZ + pMaxZ) / 2).toFixed(1),
                gMidZ: ((gMinZ + gMaxZ) / 2).toFixed(1)
            });
        }
        return slices;
    }''')

    print(f"{'s':>2} | {'u':>5} | {'Rs':>6} | {'Pinion Z Range':>16} | {'Gear Z Range':>16} | {'pMidZ':>7} | {'gMidZ':>7}")
    print("-" * 75)
    for sl in analysis:
        print(f"{sl['s']:2d} | {sl['u']:>5} | {sl['Rs']:>6} | {str(sl['pZRange']):>16} | {str(sl['gZRange']):>16} | {sl['pMidZ']:>7} | {sl['gMidZ']:>7}")

    b.close()
