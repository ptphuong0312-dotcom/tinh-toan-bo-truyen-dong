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

    # Inspect the clearance at Heel (s=0), Mid (s=5), Toe (s=10)
    # when Pinion and Gear are at contact
    detail = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.pinionAngle = 0;
        v.gearAngle = v.initialGearAngle;
        v.updateGearRotations();
        v.scene.updateMatrixWorld(true);

        const pMesh = v.pinionMesh;
        const gMesh = v.gearMesh;
        const pPos = pMesh.geometry.attributes.position;
        const gPos = gMesh.geometry.attributes.position;
        const tempV = new THREE.Vector3();

        // Pinion tooth 0 has pts 0..15 in each layer
        // Let's get the world coords of Pinion tooth 0 at s=0 (Heel), s=5 (Mid), s=10 (Toe)
        const N_tooth = 16;
        const z1 = v.geom.z1;
        const numSlices = 10;
        const N_layer = z1 * N_tooth;

        function getTooth0World(mesh, z, s) {
            const pos = mesh.geometry.attributes.position;
            const pts = [];
            // In layer s, tooth 0 is index s * (z * N_tooth) .. s * (z * N_tooth) + N_tooth - 1
            const startIdx = s * (z * N_tooth);
            for (let k = 0; k < N_tooth; k++) {
                tempV.fromBufferAttribute(pos, startIdx + k).applyMatrix4(mesh.matrixWorld);
                pts.push({ x: tempV.x, y: tempV.y, z: tempV.z });
            }
            return pts;
        }

        const pHeel = getTooth0World(pMesh, z1, 0);
        const pMid = getTooth0World(pMesh, z1, 5);
        const pToe = getTooth0World(pMesh, z1, 10);

        return {
            pHeelTip: pHeel[8], // crest
            pMidTip: pMid[8],
            pToeTip: pToe[8],
            pHeelFlank1: pHeel[4],
            pHeelFlank2: pHeel[12]
        };
    }''')

    print("Pinion tooth 0 world points:")
    for k, v in detail.items():
        print(f"  {k}: {v}")

    b.close()
