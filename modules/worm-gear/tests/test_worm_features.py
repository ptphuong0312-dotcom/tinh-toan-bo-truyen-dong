import os
import sys
import time
from playwright.sync_api import sync_playwright

def test_worm_features():
    html_path = os.path.abspath("modules/worm-gear/index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"

    print(f"Opening {file_url}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 950})
        page = context.new_page()

        # Capture console errors
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)

        page.goto(file_url, wait_until="networkidle")
        time.sleep(1)

        # Switch to Tab 2
        page.click('button[data-target="tabCanvas"]')
        time.sleep(1)

        # 1. TEST 2D NORMAL PROFILE VIEW
        print("Testing 2D Normal Profile view...")
        page.click("#btnViewNormalProfile")
        time.sleep(0.5)
        view_mode_norm = page.evaluate("window.wormUI.canvasRenderer.viewMode")
        print(f"2D View Mode after clicking Normal Profile: {view_mode_norm}")
        assert view_mode_norm == "normal_profile", f"Expected normal_profile, got {view_mode_norm}"

        norm_shot = os.path.join(artifact_dir, "worm_2d_normal_profile.png")
        page.locator("#container2D").screenshot(path=norm_shot)
        print(f"Saved Normal Profile screenshot to {norm_shot}")

        # 2. TEST 2D AXIAL PROFILE VIEW (A-A)
        print("Testing 2D Axial Profile view (A-A)...")
        page.click("#btnViewAxialProfile")
        time.sleep(0.5)
        view_mode_axial = page.evaluate("window.wormUI.canvasRenderer.viewMode")
        print(f"2D View Mode after clicking Axial Profile: {view_mode_axial}")
        assert view_mode_axial == "axial_profile", f"Expected axial_profile, got {view_mode_axial}"

        axial_shot = os.path.join(artifact_dir, "worm_2d_axial_profile.png")
        page.locator("#container2D").screenshot(path=axial_shot)
        print(f"Saved Axial Profile screenshot to {axial_shot}")

        # 3. TEST 2D TANGENTIAL PROFILE VIEW (T-T)
        print("Testing 2D Tangential Profile view (T-T)...")
        page.click("#btnViewTangentialProfile")
        time.sleep(0.5)
        view_mode_tang = page.evaluate("window.wormUI.canvasRenderer.viewMode")
        print(f"2D View Mode after clicking Tangential Profile: {view_mode_tang}")
        assert view_mode_tang == "tangential_profile", f"Expected tangential_profile, got {view_mode_tang}"

        tang_shot = os.path.join(artifact_dir, "worm_2d_tangential_profile.png")
        page.locator("#container2D").screenshot(path=tang_shot)
        print(f"Saved Tangential Profile screenshot to {tang_shot}")

        # 4. TEST 2D ASSEMBLY WITH TOGGLES
        print("Testing 2D Assembly view and Worm/Wheel toggles...")
        page.click("#btnViewAssembly")
        time.sleep(0.5)
        page.click("#btnToggleWorm2D")
        time.sleep(0.3)
        worm_vis_2d = page.evaluate("window.wormUI.canvasRenderer.showWorm")
        print(f"2D Worm visibility: {worm_vis_2d}")
        assert worm_vis_2d is False

        assy_no_worm_shot = os.path.join(artifact_dir, "worm_2d_assembly_wheel_only.png")
        page.locator("#container2D").screenshot(path=assy_no_worm_shot)

        page.click("#btnToggleWorm2D") # show worm again
        page.click("#btnToggleWheel2D") # hide wheel
        time.sleep(0.3)
        wheel_vis_2d = page.evaluate("window.wormUI.canvasRenderer.showWheel")
        print(f"2D Wheel visibility: {wheel_vis_2d}")
        assert wheel_vis_2d is False

        assy_no_wheel_shot = os.path.join(artifact_dir, "worm_2d_assembly_worm_only.png")
        page.locator("#container2D").screenshot(path=assy_no_wheel_shot)

        page.click("#btnToggleWheel2D") # show wheel again
        time.sleep(0.3)

        # 5. TEST DXF EXPORTS FOR NORMAL, AXIAL & TANGENTIAL PROFILES
        print("Testing DXF generation...")
        dxf_test_script = """
        () => {
            const renderer = window.wormUI.canvasRenderer;
            const res = {};
            
            // Intercept URL.createObjectURL and Blob
            const origCreateObjectURL = URL.createObjectURL;
            let capturedBlob = null;
            URL.createObjectURL = (blob) => {
                capturedBlob = blob;
                return 'blob:test';
            };

            // Test normal_profile DXF
            renderer.exportDXF('normal_profile');
            if (capturedBlob) {
                res.normal_profile_blob_size = capturedBlob.size;
            }

            // Test axial_profile DXF
            renderer.exportDXF('axial_profile');
            if (capturedBlob) {
                res.axial_profile_blob_size = capturedBlob.size;
            }

            // Test tangential_profile DXF
            renderer.exportDXF('tangential_profile');
            if (capturedBlob) {
                res.tangential_profile_blob_size = capturedBlob.size;
            }

            URL.createObjectURL = origCreateObjectURL;
            return res;
        }
        """
        dxf_res = page.evaluate(dxf_test_script)
        print("DXF export test result:", dxf_res)
        assert dxf_res.get("normal_profile_blob_size", 0) > 1000, "normal_profile DXF blob is too small"
        assert dxf_res.get("axial_profile_blob_size", 0) > 1000, "axial_profile DXF blob is too small"
        assert dxf_res.get("tangential_profile_blob_size", 0) > 1000, "tangential_profile DXF blob is too small"

        # 5. TEST 3D WEBGL AND VISIBILITY TOGGLES
        print("Switching to 3D WebGL mode...")
        page.click("#btnMode3D")
        time.sleep(1.5)

        # Worm 1 visibility toggle
        print("Testing 3D Worm toggle...")
        page.click("#btnToggleWorm")
        time.sleep(0.5)
        worm_vis_3d = page.evaluate("window.wormUI.visualizer3D.wormVisible")
        worm_grp_vis = page.evaluate("window.wormUI.visualizer3D.wormGroup.visible")
        print(f"3D Worm visibility: {worm_vis_3d}, group: {worm_grp_vis}")
        assert worm_vis_3d is False and worm_grp_vis is False

        wheel_only_3d_shot = os.path.join(artifact_dir, "worm_3d_wheel_only.png")
        page.locator("#container3D").screenshot(path=wheel_only_3d_shot)

        # Restore Worm, Hide Wheel
        page.click("#btnToggleWorm")
        page.click("#btnToggleWheel")
        time.sleep(0.5)
        wheel_vis_3d = page.evaluate("window.wormUI.visualizer3D.wheelVisible")
        wheel_grp_vis = page.evaluate("window.wormUI.visualizer3D.wheelGroup.visible")
        print(f"3D Wheel visibility: {wheel_vis_3d}, group: {wheel_grp_vis}")
        assert wheel_vis_3d is False and wheel_grp_vis is False

        worm_only_3d_shot = os.path.join(artifact_dir, "worm_3d_worm_only.png")
        page.locator("#container3D").screenshot(path=worm_only_3d_shot)

        # Restore Wheel (Both visible)
        page.click("#btnToggleWheel")
        time.sleep(0.5)
        both_shot = os.path.join(artifact_dir, "worm_3d_both_visible.png")
        page.locator("#container3D").screenshot(path=both_shot)

        print("All tests PASSED successfully!")
        if errors:
            print("Errors encountered:", errors)
        assert len(errors) == 0, f"Page errors: {errors}"
        browser.close()

if __name__ == "__main__":
    test_worm_features()
