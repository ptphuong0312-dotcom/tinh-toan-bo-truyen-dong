from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    
    page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    print("Opening page...")
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/spur-gear/index.html')
    page.wait_for_timeout(1000)
    
    print("Switching to tabCanvas...")
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(1000)
    
    print("Clicking btnMode3D with dispatch_event...")
    # Use dispatch_event('click') or evaluate to avoid playwright waiting for navigation if any
    page.locator("#btnMode3D").dispatch_event('click')
    page.wait_for_timeout(2000)
    
    page.screenshot(path='spur_tab2_3d_solid.png')
    print("Saved spur_tab2_3d_solid.png")

    page.locator("#sel3DViewPreset").select_option("mesh")
    page.wait_for_timeout(1000)
    page.screenshot(path='spur_tab2_3d_mesh_preset.png')
    print("Saved spur_tab2_3d_mesh_preset.png")

    page.locator("#btnToggleFlankOnly").dispatch_event('click')
    page.wait_for_timeout(1000)
    page.screenshot(path='spur_tab2_3d_flank_only.png')
    print("Saved spur_tab2_3d_flank_only.png")

    browser.close()
    print("Done!")
