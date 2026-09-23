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

    page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.setMeshDensityLevel(8);
        if (!v.flankOnlyMode) v.toggleFlankOnly();
        v.isAnimating = false;
    }''')
    page.wait_for_timeout(500)

    for deg in [-4.0, -2.0, 0.0, 2.0, 4.0]:
        page.evaluate(f'''() => {{
            const v = window.appUI.visualizer3D;
            v.pinionAngle = ({deg}) * Math.PI / 180.0;
            v.gearAngle = v.initialGearAngle - v.pinionAngle / v.gearRatio;
            v.updateGearRotations();
            
            v.camera.position.set(380, 260, 280);
            v.controls.target.set(240, 110, 0);
            v.controls.update();
        }}''')
        page.wait_for_timeout(300)
        deg_str = f"deg_{int(deg):+03d}"
        page.screenshot(path=f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/check_angle_{deg_str}.png')

    b.close()
    print("Screenshots captured successfully!")
