from playwright.sync_api import sync_playwright
import os, sys

url = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')
print('Loading:', url)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1600, 'height': 900})
    
    # Capture console messages
    page.on('console', lambda msg: print(f'[CONSOLE {msg.type}]: {msg.text}'))
    page.on('pageerror', lambda err: print(f'[PAGE ERROR]: {err}'))
    
    page.goto(url)
    page.wait_for_timeout(1000)
    
    # Input parameters
    # z1 = 11
    page.fill('#inp_z1', '11')
    page.dispatch_event('#inp_z1', 'input')
    page.dispatch_event('#inp_z1', 'change')
    
    # z2 = 16
    page.fill('#inp_z2', '16')
    page.dispatch_event('#inp_z2', 'input')
    page.dispatch_event('#inp_z2', 'change')
    
    # alfa = 25.0
    page.fill('#inp_alfa', '25.0')
    page.dispatch_event('#inp_alfa', 'input')
    page.dispatch_event('#inp_alfa', 'change')
    
    # beta = 0.0
    page.fill('#inp_beta', '0.0')
    page.dispatch_event('#inp_beta', 'input')
    page.dispatch_event('#inp_beta', 'change')
    
    # selModuleType transverse_outer
    page.select_option('#selModuleType', 'transverse_outer')
    
    # mmn / met = 8.0
    page.fill('#inp_mmn', '8.0')
    page.dispatch_event('#inp_mmn', 'input')
    page.dispatch_event('#inp_mmn', 'change')
    
    # b = 30.0
    page.fill('#inp_b', '30.0')
    page.dispatch_event('#inp_b', 'input')
    page.dispatch_event('#inp_b', 'change')
    
    page.wait_for_timeout(500)
    
    # Switch to Canvas tab
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(1000)
    
    page.screenshot(path='test_2d_canvas.png')
    print('Saved test_2d_canvas.png')
    
    # Check dimensions in DOM or canvas
    # Also test clicking Tredgold dual mesh mode button
    page.click('#btn2DViewMesh')
    page.wait_for_timeout(500)
    page.screenshot(path='test_2d_mesh_mode.png')
    print('Saved test_2d_mesh_mode.png')
    
    # Switch to 3D mode
    page.click('#btnMode3D')
    page.wait_for_timeout(2000)
    page.screenshot(path='test_3d_webgl.png')
    print('Saved test_3d_webgl.png')
    
    browser.close()
