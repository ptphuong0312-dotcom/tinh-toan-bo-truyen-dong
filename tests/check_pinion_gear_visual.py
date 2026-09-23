import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # Let's inspect where the teeth are in the visualizer at pinionAngle = 0
    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.pinionAngle = 0;
        v.gearAngle = v.initialGearAngle;
        v.updateGearRotations();
        v.scene.updateMatrixWorld(true);

        const Rm = v.geom.Rm;
        const delta1 = v.geom.delta1;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);
        
        // Find teeth that have vertices near [mx, my, 0] (within 50mm)
        const pMesh = v.pinionSurfMesh || v.pinionMesh;
        const gMesh = v.gearSurfMesh || v.gearMesh;
        
        return {
            targetPitchPoint: [mx.toFixed(1), my.toFixed(1), 0],
            cameraPos: [v.camera.position.x.toFixed(1), v.camera.position.y.toFixed(1), v.camera.position.z.toFixed(1)],
            controlsTarget: [v.controls.target.x.toFixed(1), v.controls.target.y.toFixed(1), v.controls.target.z.toFixed(1)],
            pinionAngleDeg: (v.pinionAngle * 180 / Math.PI).toFixed(2),
            gearAngleDeg: (v.gearAngle * 180 / Math.PI).toFixed(2)
        };
    }''')
    print('State:', res)
    b.close()
