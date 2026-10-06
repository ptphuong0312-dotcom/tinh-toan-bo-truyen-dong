from playwright.sync_api import sync_playwright
import os, json

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
    
    res = page.evaluate('''() => {
        const vis = window.appUI ? window.appUI.visualizer3D : null;
        if (!vis || !vis.pinionMesh || !vis.gearMesh) return 'No meshes';
        
        return {
            initialGearAngle: vis.initialGearAngle,
            pinionAngle: vis.pinionAngle,
            gearAngle: vis.gearAngle,
            gearRatio: vis.gearRatio,
            delta1_deg: vis.geom ? vis.geom.delta1_deg : null,
            delta2_deg: vis.geom ? vis.geom.delta2_deg : null,
            Sigma_deg: vis.geom ? vis.geom.Sigma_deg : null,
            Re: vis.geom ? vis.geom.Re : null,
            Rm: vis.geom ? vis.geom.Rm : null
        };
    }''')
    print('Visualizer state:\n', json.dumps(res, indent=2))
    browser.close()
