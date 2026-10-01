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
        page.wait_for_timeout(500)
        page.locator("#btnMode3D").click()
        page.wait_for_timeout(1500)

        # Enable Flank Only mode
        page.locator("#btnToggleFlankOnly").click()
        page.wait_for_timeout(800)

        # Test preset 'rear' directly from UI dropdown
        page.locator("#sel3DViewPreset").select_option("rear")
        page.wait_for_timeout(800)
        p_rear = os.path.join(artifact_dir, "worm_preset_rear_flank_imprint.png")
        page.screenshot(path=p_rear)
        print(f"Saved preset rear: {p_rear}")

        # Test preset 'mesh'
        page.locator("#sel3DViewPreset").select_option("mesh")
        page.wait_for_timeout(800)
        p_mesh = os.path.join(artifact_dir, "worm_preset_mesh_flank_imprint.png")
        page.screenshot(path=p_mesh)
        print(f"Saved preset mesh: {p_mesh}")

        # Step forward 2 steps and capture in rear preset
        page.locator("#btn3DStepFwd").click()
        page.wait_for_timeout(300)
        page.locator("#btn3DStepFwd").click()
        page.wait_for_timeout(500)
        page.locator("#sel3DViewPreset").select_option("rear")
        page.wait_for_timeout(500)
        p_stepped = os.path.join(artifact_dir, "worm_preset_rear_stepped.png")
        page.screenshot(path=p_stepped)
        print(f"Saved stepped rear: {p_stepped}")

        # Also let's view from directly inside the back-face of the tooth space
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const a = v.centerDistA || 103.366;
            const d1 = v.geom ? (parseFloat(v.geom.d1) || 36.23) : 36.23;
            const meshY = -a + d1 * 0.5;
            
            // Look directly into the rear back-face of the meshing tooth
            v.camera.position.set(-10, meshY + 22, -42);
            v.controls.target.set(0, meshY, 0);
            v.camera.lookAt(0, meshY, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(600)
        p_close_rear = os.path.join(artifact_dir, "worm_close_rear_tooth_imprint.png")
        page.screenshot(path=p_close_rear)
        print(f"Saved close rear: {p_close_rear}")

        browser.close()
    print("Done!")

if __name__ == "__main__":
    run()
