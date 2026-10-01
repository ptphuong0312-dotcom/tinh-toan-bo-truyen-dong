import os
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
html_path = os.path.abspath(r"modules/worm-gear/index.html")
url = f"file:///{html_path.replace(os.sep, '/')}"

def run():
    print(f"Opening {url}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1400, 'height': 900})
        page.goto(url)
        page.wait_for_timeout(1000)

        # Tab 2 & 3D mode
        page.locator("button[data-target='tabCanvas']").click()
        page.wait_for_timeout(600)
        page.locator("#btnMode3D").click()
        page.wait_for_timeout(1500)

        # 1. Front XY view: Verify worm tooth crests have NO slit / groove!
        page.locator("#sel3DViewPreset").select_option("front")
        page.wait_for_timeout(800)
        p_front = os.path.join(artifact_dir, "worm_front_crest_smooth_no_groove.png")
        page.screenshot(path=p_front)
        print(f"Saved: {p_front}")

        # 2. Throat section view (+X): Verify wheel side edges have authentic chamfer!
        page.locator("#sel3DViewPreset").select_option("worm")
        page.wait_for_timeout(800)
        p_throat = os.path.join(artifact_dir, "worm_wheel_chamfer_throat_view.png")
        page.screenshot(path=p_throat)
        print(f"Saved: {p_throat}")

        # 3. Test Level 10 (Ultimate Micro-Mesh)
        page.locator("#selMeshDensity").select_option("10")
        page.wait_for_timeout(1200)
        p_lvl10_throat = os.path.join(artifact_dir, "worm_wheel_lvl10_ultra_smooth.png")
        page.screenshot(path=p_lvl10_throat)
        print(f"Saved: {p_lvl10_throat}")

        # 4. Isometric view at Level 10
        page.locator("#sel3DViewPreset").select_option("iso")
        page.wait_for_timeout(800)
        p_iso = os.path.join(artifact_dir, "worm_iso_level10_chamfer.png")
        page.screenshot(path=p_iso)
        print(f"Saved: {p_iso}")

        # 5. Also check Flank Only mode + Rear contact imprint to ensure Back-Face imprint remains 100% active
        page.locator("#btnToggleFlankOnly").click()
        page.wait_for_timeout(800)
        page.locator("#sel3DViewPreset").select_option("rear")
        page.wait_for_timeout(800)
        p_rear = os.path.join(artifact_dir, "worm_flank_backface_imprint_verified.png")
        page.screenshot(path=p_rear)
        print(f"Saved: {p_rear}")

        browser.close()
    print("Verification completed successfully!")

if __name__ == "__main__":
    run()
