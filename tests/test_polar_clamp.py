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

    # Test what happens when dragging mouse vertically across 1000 pixels
    # With current OrbitControls
    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const cam = v.camera;
        const controls = v.controls;

        const positions = [];
        // Simulate dragging down vertically
        const canvas = v.renderer.domElement;
        const rect = canvas.getBoundingClientRect();

        positions.push({ stage: 'start', y: cam.position.y, z: cam.position.z });

        // Let's inspect controls.getPolarAngle()
        const polarAngles = [];
        for (let i = 0; i <= 10; i++) {
            // rotateUp
            controls.rotateUp(0.3);
            controls.update();
            polarAngles.push(controls.getPolarAngle() * 180 / Math.PI);
        }

        return {
            polarAngles,
            minPolarAngle: controls.minPolarAngle * 180 / Math.PI,
            maxPolarAngle: controls.maxPolarAngle * 180 / Math.PI
        };
    }''')

    print("Polar angles when rotating up:", res)
    b.close()
