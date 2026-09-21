import os
import sys
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
file_url = "file:///" + target_path.replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    # Switch to 3D tab
    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # Pause animation immediately
    page.click('#btnToggle3DAnim')
    page.wait_for_timeout(200)

    # Set mesh view preset
    page.select_option('#sel3DViewPreset', 'mesh')
    page.wait_for_timeout(500)

    # Take screenshot of mesh contact zone
    shot_path = os.path.join(base_dir, "tests", "spiral_mesh_current.png")
    page.screenshot(path=shot_path)
    print("Screenshot saved to:", shot_path)

    # Get geom info
    info = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        return {
            beta_deg: v.geom.beta_deg,
            beta: v.geom.beta,
            gearingType: v.geom.gearingType,
            z1: v.geom.z1,
            z2: v.geom.z2,
            initialGearAngle: v.initialGearAngle,
            pinionAngle: v.pinionAngle,
            gearAngle: v.gearAngle
        };
    }''')
    print("Geom info:", info)
    b.close()
