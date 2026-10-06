from playwright.sync_api import sync_playwright
import os

url = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')
print('Loading:', url)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 850})
    
    page.goto(url)
    page.wait_for_timeout(1000)
    
    # Fill user's exact parameters
    page.fill('#inp_z1', '11')
    page.dispatch_event('#inp_z1', 'input')
    page.dispatch_event('#inp_z1', 'change')
    
    page.fill('#inp_z2', '16')
    page.dispatch_event('#inp_z2', 'input')
    page.dispatch_event('#inp_z2', 'change')
    
    page.fill('#inp_alfa', '25.0')
    page.dispatch_event('#inp_alfa', 'input')
    page.dispatch_event('#inp_alfa', 'change')
    
    page.fill('#inp_beta', '0.0')
    page.dispatch_event('#inp_beta', 'input')
    page.dispatch_event('#inp_beta', 'change')
    
    page.select_option('#selModuleType', 'transverse_outer')
    
    page.fill('#inp_mmn', '8.0')
    page.dispatch_event('#inp_mmn', 'input')
    page.dispatch_event('#inp_mmn', 'change')
    
    page.fill('#inp_b', '30.0')
    page.dispatch_event('#inp_b', 'input')
    page.dispatch_event('#inp_b', 'change')
    
    page.wait_for_timeout(500)
    
    # 1. Capture 2D Canvas in Axial Mode
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(1000)
    page.screenshot(path='final_2d_axial.png')
    print('Saved final_2d_axial.png')
    
    # 2. Capture 2D Canvas in Tredgold Dual Mesh Mode
    page.click('#btn2DViewMesh')
    page.wait_for_timeout(500)
    page.screenshot(path='final_2d_mesh.png')
    print('Saved final_2d_mesh.png')
    
    # Switch back to Axial mode
    page.click('#btn2DViewAxial')
    page.wait_for_timeout(500)
    
    # 3. Capture 3D WebGL Mode
    page.click('#btnMode3D')
    page.wait_for_timeout(1500)
    page.screenshot(path='final_3d_webgl.png')
    print('Saved final_3d_webgl.png')
    
    # 4. Capture 3D WebGL Mesh Closeup View
    page.select_option('#sel3DViewPreset', 'mesh')
    page.dispatch_event('#sel3DViewPreset', 'change')
    page.wait_for_timeout(800)
    page.screenshot(path='final_3d_mesh_closeup.png')
    print('Saved final_3d_mesh_closeup.png')
    
    # Also test animation running 10 frames smoothly
    page.click('#btnToggle3DAnim')
    page.wait_for_timeout(1200)
    page.screenshot(path='final_3d_animated.png')
    print('Saved final_3d_animated.png')

    browser.close()
