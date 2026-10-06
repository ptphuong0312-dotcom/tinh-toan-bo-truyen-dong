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
    
    z2 = 16
    pitch = 2.0 * 3.141592653589793 / z2
    angles = [0.0, pitch * 0.25, pitch * 0.50, pitch * 0.75]
    names = ['0_00', '0_25', '0_50', '0_75']
    
    for ang, name in zip(angles, names):
        page.evaluate(f'''() => {{
            const vis = window.appUI.visualizer3D;
            vis.gearAngle = {ang};
            vis.updateGearRotations();
            
            const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 62.7;
            const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.602;
            const mx = Rm * Math.cos(delta1);
            const my = Rm * Math.sin(delta1);
            
            vis.controls.target.set(mx, my, 0);
            vis.camera.position.set(mx * 1.5, my * 1.5, 30);
            vis.camera.up.set(0, 0, 1);
            vis.camera.lookAt(mx, my, 0);
            vis.controls.update();
        }}''')
        page.wait_for_timeout(300)
        page.screenshot(path=f'test_cross_{name}.png')
        print(f'Saved test_cross_{name}.png')
        
    browser.close()
