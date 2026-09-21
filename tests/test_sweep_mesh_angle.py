import os
import math
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

    # Sweep gearAngle around 0 with pinionAngle = 0
    # to find where the space of Gear 2 aligns with Pinion Tooth 0
    sweep = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.pinionAngle = 0;
        const geom = v.geom;
        const z2 = geom.z2;
        const pitch2 = 2 * Math.PI / z2;
        const halfPitch2 = Math.PI / z2;

        const results = [];
        // Test 40 angles from -2 * halfPitch2 to +2 * halfPitch2
        for (let i = -20; i <= 20; i++) {
            const testAngle = (i / 10) * halfPitch2;
            v.gearAngle = testAngle;
            v.updateGearRotations();
            v.scene.updateMatrixWorld(true);

            // Compute distance between Pinion tooth 0 tip at u=0 and Gear
            // Pinion tooth 0 tip at u=0:
            const pMesh = v.pinionMesh;
            const gMesh = v.gearMesh;

            // Pinion tooth 0 tip at u=0 in world space:
            // At u=0, Rs = Rm. delta = delta1.
            const Rm = geom.Rm;
            const delta1 = geom.delta1;
            const ha1 = geom.ha1 || 10.0;
            const rTip1 = Rm * Math.sin(delta1) + ha1 * Math.cos(delta1);
            const zTip1 = Rm * Math.cos(delta1) - ha1 * Math.sin(delta1);
            const pTipLoc = new THREE.Vector3(rTip1, 0, zTip1);
            const pTipW = pTipLoc.clone().applyMatrix4(pMesh.matrixWorld);

            // Find closest vertex in Gear mesh to pTipW
            const gPos = gMesh.geometry.attributes.position;
            const tempV = new THREE.Vector3();
            let minD = 9999;
            for (let k = 0; k < gPos.count; k += 3) {
                tempV.fromBufferAttribute(gPos, k);
                tempV.applyMatrix4(gMesh.matrixWorld);
                const d = tempV.distanceTo(pTipW);
                if (d < minD) minD = d;
            }

            results.push({
                i,
                angleDeg: (testAngle * 180 / Math.PI).toFixed(2),
                distToTip: minD.toFixed(2),
                pTipW: { x: pTipW.x.toFixed(1), y: pTipW.y.toFixed(1), z: pTipW.z.toFixed(1) }
            });
        }
        return results;
    }''')

    print("Angle sweep results (Pinion tip to nearest Gear surface):")
    for r in sweep:
        print(f"i={r['i']:+3d} | angle={r['angleDeg']:>7}° | distToTip={r['distToTip']:>6} mm | TipW={r['pTipW']}")

    b.close()
