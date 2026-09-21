import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
file_url = "file:///" + target_path.replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # Pause animation immediately
    page.click('#btnToggle3DAnim')
    page.wait_for_timeout(200)

    # Set pinion angle = 0, gear angle = initialGearAngle
    page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.pinionAngle = 0;
        v.gearAngle = v.initialGearAngle;
        v.updateGearRotations();
    }''')
    page.wait_for_timeout(200)

    for preset in ['iso', 'front', 'top', 'mesh']:
        page.select_option('#sel3DViewPreset', preset)
        page.wait_for_timeout(400)
        shot_path = os.path.join(base_dir, "tests", f"view_{preset}.png")
        page.screenshot(path=shot_path)
        print(f"Saved {preset} to {shot_path}")

    b.close()
