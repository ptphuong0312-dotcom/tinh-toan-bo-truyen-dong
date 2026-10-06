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
    
    # Use front view or mesh view
    page.evaluate('''() => {
        const vis = window.ui ? window.ui.visualizer3D : null;
        if (vis) {
            vis.setViewPreset('mesh');
        }
    }''')
    page.wait_for_timeout(500)
    
    # Test setting different gear angles
    z2 = 16
    pitch = 2.0 * 3.141592653589793 / z2
    for i in range(5):
        offset = (i / 4.0) * pitch
        page.evaluate(f'''() => {{
            const vis = window.ui ? window.ui.visualizer3D : null;
            if (vis) {{
                vis.gearAngle = {offset};
                vis.updateGearRotations();
            }}
        }}''')
        page.wait_for_timeout(200)
        page.screenshot(path=f'test_mesh_view_{i}.png')
        print(f'Saved test_mesh_view_{i}.png with angle {offset:.4f} (fraction {i}/4)')

    browser.close()
