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
    
    # Set camera looking directly at the contact zone along +Z
    page.evaluate('''() => {
        const vis = window.appUI.visualizer3D;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 62.7;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.602;
        const mx = Rm * Math.cos(delta1); // ~51.6
        const my = Rm * Math.sin(delta1); // ~35.5
        
        // Target is the pitch contact point at Rm
        vis.controls.target.set(mx, my, 0);
        // Camera looking from +Z down onto XY plane
        vis.camera.position.set(mx, my, 85);
        vis.camera.up.set(0, 1, 0);
        vis.camera.lookAt(mx, my, 0);
        vis.controls.update();
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='test_contact_from_z.png')
    print('Saved test_contact_from_z.png')
    
    # Also look from +Y (radial direction of pinion / axial of gear)
    page.evaluate('''() => {
        const vis = window.appUI.visualizer3D;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 62.7;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.602;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);
        
        vis.controls.target.set(mx, my, 0);
        // Camera looking along contact line from heel (outside) towards apex (0,0)
        vis.camera.position.set(mx * 1.8, my * 1.8, 20);
        vis.camera.up.set(0, 0, 1);
        vis.camera.lookAt(mx, my, 0);
        vis.controls.update();
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='test_contact_along_cone.png')
    print('Saved test_contact_along_cone.png')
    
    browser.close()
