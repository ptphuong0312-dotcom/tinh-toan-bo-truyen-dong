from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    
    print("Opening bevel-gear page...")
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/bevel-gear/index.html')
    page.wait_for_timeout(1000)
    
    print("Switching to bevel tabCanvas...")
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(1000)
    
    page.screenshot(path='bevel_tab2_canvas_initial.png')

    # Zoom in mesh view if available
    preset = page.locator("#sel3DViewPreset")
    if preset.count() > 0:
        preset.select_option("mesh")
        page.wait_for_timeout(1000)
    
    page.screenshot(path='bevel_tab2_3d_mesh_preset.png')

    # Click Flank Only
    flank_btn = page.locator("#btnToggleFlankOnly")
    if flank_btn.count() > 0:
        flank_btn.dispatch_event('click')
        page.wait_for_timeout(1000)
        page.screenshot(path='bevel_tab2_3d_flank_only.png')
    
    browser.close()
    print("Bevel screenshots done!")
