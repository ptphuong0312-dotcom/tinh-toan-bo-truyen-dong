import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def inspect_spiral():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
    file_url = "file:///" + target_path.replace("\\", "/")

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={'width': 1400, 'height': 1200})
        page.goto(file_url)
        page.wait_for_timeout(1000)

        # Switch to 3D tab
        page.click('button[data-target="tabCanvas"]')
        page.wait_for_timeout(300)
        page.click('#btnMode3D')
        page.wait_for_timeout(500)

        res = page.evaluate('''() => {
            const v = window.appUI.visualizer3D;
            v.pinionAngle = 0;
            v.gearAngle = 0;
            v.updateGearRotations();
            v.scene.updateMatrixWorld(true);

            const pMesh = v.pinionMesh;
            const gMesh = v.gearMesh;

            const pApex = new THREE.Vector3(0, 0, 0).applyMatrix4(pMesh.matrixWorld);
            const pShaft = new THREE.Vector3(0, 0, 100).applyMatrix4(pMesh.matrixWorld);
            const pTooth0 = new THREE.Vector3(100, 0, 0).applyMatrix4(pMesh.matrixWorld);
            const pTooth90 = new THREE.Vector3(0, 100, 0).applyMatrix4(pMesh.matrixWorld);

            const gApex = new THREE.Vector3(0, 0, 0).applyMatrix4(gMesh.matrixWorld);
            const gShaft = new THREE.Vector3(0, 0, 100).applyMatrix4(gMesh.matrixWorld);
            const gTooth0 = new THREE.Vector3(100, 0, 0).applyMatrix4(gMesh.matrixWorld);
            const gTooth90 = new THREE.Vector3(0, 100, 0).applyMatrix4(gMesh.matrixWorld);

            return {
                pApex, pShaft, pTooth0, pTooth90,
                gApex, gShaft, gTooth0, gTooth90
            };
        }''')

        print("PINION in World Space:")
        print("  Apex (0,0,0)  :", res['pApex'])
        print("  Shaft (0,0,100):", res['pShaft'])
        print("  Tooth0 (100,0,0):", res['pTooth0'])
        print("  Tooth90 (0,100,0):", res['pTooth90'])

        print("\nGEAR in World Space:")
        print("  Apex (0,0,0)  :", res['gApex'])
        print("  Shaft (0,0,100):", res['gShaft'])
        print("  Tooth0 (100,0,0):", res['gTooth0'])
        print("  Tooth90 (0,100,0):", res['gTooth90'])

        b.close()



if __name__ == '__main__':
    inspect_spiral()
