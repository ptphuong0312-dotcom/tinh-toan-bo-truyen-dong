import os
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
html_path = os.path.abspath(r"modules/worm-gear/index.html")
url = f"file:///{html_path.replace(os.sep, '/')}"

def run_test():
    print(f"Opening {url}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()

        page.goto(url)
        page.wait_for_timeout(1000)

        # Switch to Tab 2
        page.locator("button[data-target='tabCanvas']").click()
        page.wait_for_timeout(600)

        # Switch to 3D mode
        page.locator("#btnMode3D").click()
        page.wait_for_timeout(1500)

        # Click Flank Only
        page.locator("#btnToggleFlankOnly").click()
        page.wait_for_timeout(800)

        # Set to Mesh Zone view
        page.locator("#sel3DViewPreset").select_option("mesh")
        page.wait_for_timeout(800)

        p1 = os.path.join(artifact_dir, "worm_flank_imprint_mesh_front.png")
        page.screenshot(path=p1)
        print(f"Saved: {p1}")

        # Now let's set the camera to look at the REAR of the tooth at the meshing zone!
        # Meshing zone is at (0, -a + r1, 0) ~ (0, -85.25, 0)
        # Looking from behind/inside the wheel: camera placed at (0, -50, -45) looking at (0, -85, 0)
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const a = v.centerDistA || 103.366;
            const d1 = v.geom ? (parseFloat(v.geom.d1) || 36.23) : 36.23;
            const meshY = -a + d1 * 0.5;
            
            // View from behind the tooth (looking down and slightly forward into the rear flank)
            v.camera.position.set(15, meshY + 35, -45);
            v.controls.target.set(0, meshY, 0);
            v.camera.lookAt(0, meshY, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(600)
        p2 = os.path.join(artifact_dir, "worm_flank_imprint_rear_view1.png")
        page.screenshot(path=p2)
        print(f"Saved: {p2}")

        # Another rear angle looking through the hollow tooth space
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const a = v.centerDistA || 103.366;
            const d1 = v.geom ? (parseFloat(v.geom.d1) || 36.23) : 36.23;
            const meshY = -a + d1 * 0.5;
            
            // View from back (+Z side looking toward -Z through the tooth back-face)
            v.camera.position.set(-18, meshY + 20, 48);
            v.controls.target.set(0, meshY, 0);
            v.camera.lookAt(0, meshY, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(600)
        p3 = os.path.join(artifact_dir, "worm_flank_imprint_rear_view2.png")
        page.screenshot(path=p3)
        print(f"Saved: {p3}")

        # Step animation forward 2 times
        btn_step = page.locator("#btn3DStepFwd")
        btn_step.click()
        page.wait_for_timeout(300)
        btn_step.click()
        page.wait_for_timeout(500)

        p4 = os.path.join(artifact_dir, "worm_flank_imprint_stepped_rear.png")
        page.screenshot(path=p4)
        print(f"Saved: {p4}")

        # Step 2 more times and take Mesh view
        btn_step.click()
        page.wait_for_timeout(300)
        btn_step.click()
        page.wait_for_timeout(500)

        page.locator("#sel3DViewPreset").select_option("mesh")
        page.wait_for_timeout(600)
        p5 = os.path.join(artifact_dir, "worm_flank_imprint_stepped_mesh.png")
        page.screenshot(path=p5)
        print(f"Saved: {p5}")

        browser.close()
        print("Done!")

if __name__ == "__main__":
    run_test()
