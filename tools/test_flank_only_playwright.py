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

        # Listen to console messages
        page.on("console", lambda msg: print(f"[Browser Console] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[Browser Error] {err}"))

        page.goto(url)
        page.wait_for_timeout(1000)

        # 1. Switch to Tab 2 (Canvas / 3D)
        print("Switching to Tab 2...")
        tab_btn = page.locator("button[data-target='tabCanvas']")
        tab_btn.click()
        page.wait_for_timeout(800)

        # 2. Switch to 3D mode
        print("Switching to 3D mode...")
        btn_3d = page.locator("#btnMode3D")
        btn_3d.click()
        page.wait_for_timeout(1500)

        # Take screenshot of Solid Mode
        solid_path = os.path.join(artifact_dir, "worm_solid_verified.png")
        page.screenshot(path=solid_path)
        print(f"Saved: {solid_path}")

        # Check button btnToggleFlankOnly exists
        btn_flank = page.locator("#btnToggleFlankOnly")
        flank_text_before = btn_flank.inner_text()
        print(f"btnToggleFlankOnly text before click: '{flank_text_before}'")
        assert "Chỉ Mặt Bên" in flank_text_before

        # Verify solid meshes visible, flank meshes hidden
        vis_state_1 = page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v) return null;
            return {
                flankOnlyMode: v.flankOnlyMode,
                wormMeshVis: v.wormMesh ? v.wormMesh.visible : null,
                wheelMeshVis: v.wheelMesh ? v.wheelMesh.visible : null,
                wormSurfVis: v.wormSurfMesh ? v.wormSurfMesh.visible : null,
                wheelSurfVis: v.wheelSurfMesh ? v.wheelSurfMesh.visible : null
            };
        }""")
        print(f"State before click: {vis_state_1}")
        assert vis_state_1["flankOnlyMode"] == False
        assert vis_state_1["wormMeshVis"] == True
        assert vis_state_1["wheelMeshVis"] == True
        assert vis_state_1["wormSurfVis"] == False
        assert vis_state_1["wheelSurfVis"] == False

        # 3. Click btnToggleFlankOnly
        print("Clicking btnToggleFlankOnly...")
        btn_flank.click()
        page.wait_for_timeout(800)

        flank_text_after = btn_flank.inner_text()
        print(f"btnToggleFlankOnly text after click: '{flank_text_after}'")
        assert "Đang Xem Mặt Bên" in flank_text_after

        vis_state_2 = page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v) return null;
            return {
                flankOnlyMode: v.flankOnlyMode,
                wormMeshVis: v.wormMesh ? v.wormMesh.visible : null,
                wheelMeshVis: v.wheelMesh ? v.wheelMesh.visible : null,
                wormSurfVis: v.wormSurfMesh ? v.wormSurfMesh.visible : null,
                wheelSurfVis: v.wheelSurfMesh ? v.wheelSurfMesh.visible : null
            };
        }""")
        print(f"State after click: {vis_state_2}")
        assert vis_state_2["flankOnlyMode"] == True
        assert vis_state_2["wormMeshVis"] == False
        assert vis_state_2["wheelMeshVis"] == False
        assert vis_state_2["wormSurfVis"] == True
        assert vis_state_2["wheelSurfVis"] == True

        # Take screenshot of Flank Only Mode in Iso view
        flank_iso_path = os.path.join(artifact_dir, "worm_flank_only_iso.png")
        page.screenshot(path=flank_iso_path)
        print(f"Saved: {flank_iso_path}")

        # 4. Switch to close-up mesh zone view
        print("Switching to mesh zone view...")
        sel_preset = page.locator("#sel3DViewPreset")
        sel_preset.select_option("mesh")
        page.wait_for_timeout(600)
        flank_mesh_path = os.path.join(artifact_dir, "worm_flank_only_meshing_zone.png")
        page.screenshot(path=flank_mesh_path)
        print(f"Saved: {flank_mesh_path}")

        # 5. Switch to side throat view (along worm X-axis)
        print("Switching to worm side throat view...")
        sel_preset.select_option("worm")
        page.wait_for_timeout(600)
        flank_worm_path = os.path.join(artifact_dir, "worm_flank_only_side.png")
        page.screenshot(path=flank_worm_path)
        print(f"Saved: {flank_worm_path}")

        # 6. Switch to wheel view (direct front of wheel)
        print("Switching to wheel view...")
        sel_preset.select_option("wheel")
        page.wait_for_timeout(600)
        flank_wheel_path = os.path.join(artifact_dir, "worm_flank_only_wheel.png")
        page.screenshot(path=flank_wheel_path)
        print(f"Saved: {flank_wheel_path}")

        # 7. Step animation forward 3 times in Flank Only mode
        print("Stepping forward 3 times in Flank Only mode...")
        btn_step = page.locator("#btn3DStepFwd")
        btn_step.click()
        page.wait_for_timeout(300)
        btn_step.click()
        page.wait_for_timeout(300)
        btn_step.click()
        page.wait_for_timeout(500)

        sel_preset.select_option("mesh")
        page.wait_for_timeout(600)
        flank_step_path = os.path.join(artifact_dir, "worm_flank_only_stepped_mesh.png")
        page.screenshot(path=flank_step_path)
        print(f"Saved: {flank_step_path}")

        # 8. Click btnToggleFlankOnly again to return to Solid mode
        print("Toggling back to solid mode...")
        btn_flank.click()
        page.wait_for_timeout(600)

        flank_text_final = btn_flank.inner_text()
        print(f"btnToggleFlankOnly text after toggling back: '{flank_text_final}'")
        assert "Chỉ Mặt Bên" in flank_text_final

        vis_state_3 = page.evaluate("""() => {
            const v = window.worm3DVisualizer || (window.WormUI && window.WormUI.visualizer3D);
            if (!v) return null;
            return {
                flankOnlyMode: v.flankOnlyMode,
                wormMeshVis: v.wormMesh ? v.wormMesh.visible : null,
                wheelMeshVis: v.wheelMesh ? v.wheelMesh.visible : null,
                wormSurfVis: v.wormSurfMesh ? v.wormSurfMesh.visible : null,
                wheelSurfVis: v.wheelSurfMesh ? v.wheelSurfMesh.visible : null
            };
        }""")
        print(f"State after toggling back: {vis_state_3}")
        assert vis_state_3["flankOnlyMode"] == False
        assert vis_state_3["wormMeshVis"] == True
        assert vis_state_3["wheelMeshVis"] == True
        assert vis_state_3["wormSurfVis"] == False
        assert vis_state_3["wheelSurfVis"] == False

        sel_preset.select_option("iso")
        page.wait_for_timeout(600)
        solid_return_path = os.path.join(artifact_dir, "worm_solid_returned_iso.png")
        page.screenshot(path=solid_return_path)
        print(f"Saved: {solid_return_path}")

        browser.close()
        print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_test()
