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

    # Test kinematic collision across one tooth pitch of rotation
    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const geom = v.geom;
        const z1 = geom.z1;
        const z2 = geom.z2;
        const pitch1 = 2 * Math.PI / z1;

        const pMesh = v.pinionMesh;
        const gMesh = v.gearMesh;
        const pPos = pMesh.geometry.attributes.position;
        const gPos = gMesh.geometry.attributes.position;
        const tempV = new THREE.Vector3();

        // Sample vertices on Pinion tooth 0 flank
        // Sample vertices on Gear tooth spaces
        // Test 11 rotation steps from -0.5 * pitch1 to +0.5 * pitch1
        const results = [];
        for (let step = -5; step <= 5; step++) {
            const rot1 = (step / 10) * pitch1;
            v.pinionAngle = rot1;
            v.gearAngle = v.initialGearAngle - rot1 / v.gearRatio;
            v.updateGearRotations();
            v.scene.updateMatrixWorld(true);

            // Collect points near the contact zone (x: 200..340, y: 70..140, |z| < 30)
            const pPts = [];
            for (let k = 0; k < pPos.count; k += 2) {
                tempV.fromBufferAttribute(pPos, k).applyMatrix4(pMesh.matrixWorld);
                if (tempV.x > 200 && tempV.x < 340 && tempV.y > 70 && tempV.y < 140 && Math.abs(tempV.z) < 30) {
                    pPts.push({ x: tempV.x, y: tempV.y, z: tempV.z });
                }
            }

            const gPts = [];
            for (let k = 0; k < gPos.count; k += 2) {
                tempV.fromBufferAttribute(gPos, k).applyMatrix4(gMesh.matrixWorld);
                if (tempV.x > 200 && tempV.x < 340 && tempV.y > 70 && tempV.y < 140 && Math.abs(tempV.z) < 30) {
                    gPts.push({ x: tempV.x, y: tempV.y, z: tempV.z });
                }
            }

            // Find minimum distance between Pinion and Gear vertices
            let minD = 999;
            for (let p of pPts) {
                for (let g of gPts) {
                    const d = Math.hypot(p.x - g.x, p.y - g.y, p.z - g.z);
                    if (d < minD) minD = d;
                }
            }

            results.push({
                step,
                rot1Deg: (rot1 * 180 / Math.PI).toFixed(1),
                pPts: pPts.length,
                gPts: gPts.length,
                minD: minD.toFixed(2)
            });
        }
        return results;
    }''')

    print(f"{'Step':>5} | {'Rot1 (deg)':>10} | {'pPts':>6} | {'gPts':>6} | {'Min Dist (mm)':>14}")
    print("-" * 55)
    for r in res:
        print(f"{r['step']:5d} | {r['rot1Deg']:>10} | {r['pPts']:6d} | {r['gPts']:6d} | {r['minD']:>14}")

    b.close()
