from playwright.sync_api import sync_playwright
import os

url = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1200, 'height': 800})
    page.goto(url)
    page.wait_for_timeout(1000)
    
    # Input parameters
    page.fill('#inp_z1', '11')
    page.dispatch_event('#inp_z1', 'input')
    page.fill('#inp_z2', '16')
    page.dispatch_event('#inp_z2', 'input')
    page.fill('#inp_alfa', '25.0')
    page.dispatch_event('#inp_alfa', 'input')
    page.fill('#inp_beta', '0.0')
    page.dispatch_event('#inp_beta', 'input')
    page.select_option('#selModuleType', 'transverse_outer')
    page.fill('#inp_mmn', '8.0')
    page.dispatch_event('#inp_mmn', 'input')
    page.fill('#inp_b', '30.0')
    page.dispatch_event('#inp_b', 'input')
    page.wait_for_timeout(500)
    
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.click('#btnMode3D')
    page.wait_for_timeout(1500)
    
    # Zoom camera directly onto the gears
    page.evaluate('''() => {
        const vis = window.ui ? window.ui.visualizer3D : null;
        if (vis && vis.camera && vis.controls) {
            const Re = vis.geom ? parseFloat(vis.geom.Re) : 77.7;
            const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 62.7;
            const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.6;
            const mx = Rm * Math.cos(delta1);
            const my = Rm * Math.sin(delta1);
            const cenX = mx * 0.7;
            const cenY = my * 0.9;
            const dist = Re * 1.0;
            vis.controls.target.set(cenX, cenY, 0);
            vis.camera.position.set(cenX + dist * 0.65, cenY + dist * 0.45, dist * 0.75);
            vis.controls.update();
        }
    }''')
    page.wait_for_timeout(500)
    
    z2 = 16
    pitch = 2.0 * 3.141592653589793 / z2
    for i in range(8):
        offset = (i / 8.0) * pitch
        page.evaluate(f'''() => {{
            const vis = window.ui ? window.ui.visualizer3D : null;
            if (vis) {{
                vis.gearAngle = {offset};
                vis.updateGearRotations();
            }}
        }}''')
        page.wait_for_timeout(200)
        page.screenshot(path=f'test_zoom_angle_{i}.png')
        print(f'Saved test_zoom_angle_{i}.png with angle {offset:.4f} (fraction {i}/8)')

    browser.close()
