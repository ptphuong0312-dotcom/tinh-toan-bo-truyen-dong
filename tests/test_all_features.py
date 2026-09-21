import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_all_features():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
    file_url = "file:///" + target_path.replace("\\", "/")
    print("Navigating to:", file_url)

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={'width': 1400, 'height': 1000})

        console_errors = []
        page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: console_errors.append(str(e)))

        page.goto(file_url)
        page.wait_for_timeout(1000)

        # 1. Switch to Canvas Tab
        print("\n--- 1. Switching to Tab Canvas ---")
        page.click('button[data-target="tabCanvas"]')
        page.wait_for_timeout(500)

        # Test 2D Speed slider & 2-decimal display
        print("Testing 2D ultra-slow speed slider (0.02x)...")
        slider_2d = page.locator('#sliderAnimSpeed')
        slider_2d.fill("0.02")
        slider_2d.dispatch_event('input')
        page.wait_for_timeout(100)
        speed_2d_text = page.locator('#animSpeedVal').text_content()
        print(f"2D Speed label: '{speed_2d_text}' (Expected: '0.02x')")
        assert speed_2d_text == "0.02x", f"Expected '0.02x', got '{speed_2d_text}'"

        # Test 2D Step Jog
        print("Testing 2D Step Jog (btn2DStepFwd & btn2DStepBack)...")
        page.evaluate("window.appUI.canvasController.isRunning = false;")
        init_angle1 = page.evaluate("window.appUI.canvasController.angle1")
        page.click('#btn2DStepFwd')
        page.wait_for_timeout(100)
        fwd_angle1 = page.evaluate("window.appUI.canvasController.angle1")
        print(f"2D Angle after forward step: {fwd_angle1} (Initial: {init_angle1})")
        assert fwd_angle1 > init_angle1, "Forward step should advance angle1"

        page.click('#btn2DStepBack')
        page.wait_for_timeout(100)
        back_angle1 = page.evaluate("window.appUI.canvasController.angle1")
        print(f"2D Angle after backward step: {back_angle1}")
        assert abs(back_angle1 - init_angle1) < 1e-5, "Backward step should return angle1"

        # 2. Switch to 3D Mode
        print("\n--- 2. Switching to 3D Mode ---")
        page.click('#btnMode3D')
        page.wait_for_timeout(800)

        # Test 3D Speed slider & 2-decimal display
        print("Testing 3D ultra-slow speed slider (0.01x and 0.05x)...")
        slider_3d = page.locator('#slider3DAnimSpeed')
        slider_3d.fill("0.02")
        slider_3d.dispatch_event('input')
        page.wait_for_timeout(100)
        speed_3d_text = page.locator('#anim3DSpeedVal').text_content()
        print(f"3D Speed label: '{speed_3d_text}' (Expected: '0.02x')")
        assert speed_3d_text == "0.02x", f"Expected '0.02x', got '{speed_3d_text}'"

        speed_3d_engine = page.evaluate("window.appUI.visualizer3D.animSpeed")
        print(f"3D Visualizer animSpeed: {speed_3d_engine}")
        assert abs(speed_3d_engine - 0.02) < 1e-4

        # Test 3D Step Jog
        print("Testing 3D Step Jog (btn3DStepFwd & btn3DStepBack)...")
        page.evaluate("window.appUI.visualizer3D.isAnimating = false;")
        init_p_angle = page.evaluate("window.appUI.visualizer3D.pinionAngle")
        init_g_angle = page.evaluate("window.appUI.visualizer3D.gearAngle")

        page.click('#btn3DStepFwd')
        page.wait_for_timeout(100)
        fwd_p_angle = page.evaluate("window.appUI.visualizer3D.pinionAngle")
        fwd_g_angle = page.evaluate("window.appUI.visualizer3D.gearAngle")
        print(f"3D Pinion angle after forward step: {fwd_p_angle:.4f} rad (Initial: {init_p_angle:.4f})")
        print(f"3D Gear angle after forward step: {fwd_g_angle:.4f} rad (Initial: {init_g_angle:.4f})")
        assert fwd_p_angle > init_p_angle, "3D Pinion angle should increase on step forward"

        page.click('#btn3DStepBack')
        page.wait_for_timeout(100)
        back_p_angle = page.evaluate("window.appUI.visualizer3D.pinionAngle")
        print(f"3D Pinion angle after backward step: {back_p_angle:.4f} rad")
        assert abs(back_p_angle - init_p_angle) < 1e-5, "3D Pinion angle should return on step backward"

        # 3. Test 360-degree rotation around base
        print("\n--- 3. Testing 360-degree CAD Orbit Controls around base ---")
        cam_info = page.evaluate("""() => {
            const vis = window.appUI.visualizer3D;
            const controls = vis.controls;
            const cam = vis.camera;
            controls.enableDamping = false;
            
            // Initial position (Top / Iso)
            const pos0 = { x: cam.position.x, y: cam.position.y, z: cam.position.z };
            
            // Rotate 180 degrees vertically
            controls.rotateUp(Math.PI);
            controls.update();
            const pos180 = { x: cam.position.x, y: cam.position.y, z: cam.position.z, upY: cam.up.y };
            
            // Rotate another 90 degrees (total 270 degrees)
            controls.rotateUp(Math.PI / 2.0);
            controls.update();
            const pos270 = { x: cam.position.x, y: cam.position.y, z: cam.position.z };

            // Rotate back to 360 degrees full circle
            controls.rotateUp(Math.PI / 2.0);
            controls.update();
            const pos360 = { x: cam.position.x, y: cam.position.y, z: cam.position.z };

            controls.enableDamping = true;
            return { pos0, pos180, pos270, pos360, cadOrbit360: controls.cadOrbit360 };
        }""")
        print(f"Orbit cadOrbit360 enabled: {cam_info['cadOrbit360']}")
        print(f"Pos 0: {cam_info['pos0']}")
        print(f"Pos 180 (underneath large gear base): {cam_info['pos180']}")
        print(f"Pos 270: {cam_info['pos270']}")
        print(f"Pos 360 (full circle): {cam_info['pos360']}")

        assert cam_info['cadOrbit360'] is True, "cadOrbit360 should be active"
        assert cam_info['pos180']['y'] < -100, f"Camera should tumble below gear base (Y < -100), got {cam_info['pos180']['y']}"

        # 4. Capture 3D mesh screenshot
        print("\n--- 4. Capturing 3D Spiral Bevel Gear Meshing Screenshot ---")
        page.evaluate("window.appUI.visualizer3D.setViewPreset('mesh');")
        page.wait_for_timeout(300)
        screenshot_path = os.path.join(base_dir, "tests", "spiral_mesh_verified.png")
        page.locator('#bevel3DContainer canvas').screenshot(path=screenshot_path)
        print(f"Saved verified screenshot to: {screenshot_path}")

        # 5. Check Console Errors
        print("\n--- 5. Checking Console Errors ---")
        print(f"Total Console Errors: {len(console_errors)}")
        if console_errors:
            for err in console_errors:
                print("   ERROR:", err)
        assert len(console_errors) == 0, f"Found {len(console_errors)} console errors!"
        print("\n>>> ALL TESTS PASSED! ZERO JAVASCRIPT ERRORS! 100% SUCCESS! <<<")

        b.close()

if __name__ == '__main__':
    test_all_features()
