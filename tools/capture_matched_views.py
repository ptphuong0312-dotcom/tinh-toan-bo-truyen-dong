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

        # 3D tab
        page.locator("button[data-target='tabCanvas']").click()
        page.wait_for_timeout(500)
        page.locator("#btnMode3D").click()
        page.wait_for_timeout(1500)

        # Set Level 10
        page.locator("#selMeshDensity").select_option("10")
        page.wait_for_timeout(1000)

        # 1. Close-up on the WORM TEETH at Front XY (reproducing user's media_1790866149461.png)
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const a = v.centerDistA || 103.366;
            v.camera.position.set(0, -a + 5, 140);
            v.controls.target.set(0, -a + 5, 0);
            v.camera.lookAt(0, -a + 5, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(800)
        p_worm_crest = os.path.join(artifact_dir, "worm_front_crest_user_view_matched.png")
        page.screenshot(path=p_worm_crest)
        print(f"Saved: {p_worm_crest}")

        # 2. Close-up on the WHEEL THROAT & CHAMFER from +X (reproducing user's media_1790866175362.png)
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const de2 = v.geom ? (parseFloat(v.geom.de2) || 183.23) : 183.23;
            const topY = de2 * 0.5 - 15;
            // View from +X looking at the top throat / rim of the wheel
            v.camera.position.set(75, topY, 0);
            v.controls.target.set(0, topY, 0);
            v.camera.lookAt(0, topY, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(800)
        p_chamfer_top = os.path.join(artifact_dir, "worm_wheel_chamfer_user_view_matched.png")
        page.screenshot(path=p_chamfer_top)
        print(f"Saved: {p_chamfer_top}")

        # 3. View from +X at the meshing throat area with the worm
        page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v || !v.camera || !v.controls) return;
            const a = v.centerDistA || 103.366;
            const d1 = v.geom ? (parseFloat(v.geom.d1) || 36.23) : 36.23;
            const meshY = -a + d1 * 0.5;
            v.camera.position.set(85, meshY, 0);
            v.controls.target.set(0, meshY, 0);
            v.camera.lookAt(0, meshY, 0);
            v.controls.update();
        }""")
        page.wait_for_timeout(800)
        p_throat_mesh = os.path.join(artifact_dir, "worm_throat_mesh_chamfer.png")
        page.screenshot(path=p_throat_mesh)
        print(f"Saved: {p_throat_mesh}")

        browser.close()
    print("Done capturing matched views!")

if __name__ == "__main__":
    run()
