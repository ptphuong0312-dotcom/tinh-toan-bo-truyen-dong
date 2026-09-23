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
        
        // Exact camera from user_exact_meshing_centered_4.png:
        // Positioned close to tooth
        const Rm = v.geom.Rm;
        const delta1 = v.geom.delta1;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);
        
        // Camera setup that matches user's close-up view:
        v.camera.position.set(mx + 80, my + 60, 160);
        v.controls.target.set(mx, my, 0);
        v.controls.update();
    }''')
    page.wait_for_timeout(500)

    for deg in [-2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0]:
        page.evaluate(f'''() => {{
            const v = window.appUI.visualizer3D;
            v.pinionAngle = ({deg}) * Math.PI / 180.0;
            v.gearAngle = v.initialGearAngle - v.pinionAngle / v.gearRatio;
            v.updateGearRotations();
        }}''')
        page.wait_for_timeout(200)
        deg_str = f"deg_{deg:+04.1f}".replace('.', '_')
        page.screenshot(path=f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/zoom_tooth_{deg_str}.png')

    b.close()
    print("Zoomed screenshots captured!")
