from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/bevel-gear/index.html')
    page.wait_for_timeout(1000)
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(1000)
    
    # Click 3D mode
    page.locator('#btnMode3D').dispatch_event('click')
    page.wait_for_timeout(2000)
    page.screenshot(path='bevel_tab2_3d_solid.png')

    # Zoom in mesh view
    page.locator('#sel3DViewPreset').select_option('mesh')
    page.wait_for_timeout(1000)
    page.screenshot(path='bevel_tab2_3d_mesh_preset.png')

    # Click Flank Only
    page.locator('#btnToggleFlankOnly').dispatch_event('click')
    page.wait_for_timeout(1000)
    page.screenshot(path='bevel_tab2_3d_flank_only.png')

    browser.close()
    print('Bevel 3D screenshots taken!')
