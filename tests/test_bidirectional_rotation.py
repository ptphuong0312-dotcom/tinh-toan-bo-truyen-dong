import os
import sys
import time
from playwright.sync_api import sync_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

base_dir = r"F:\Antigravity\MITCalc-Gear-Engineering"

def test_bevel_bidirectional():
    file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')
    print(f"\n--- Testing Bevel Gear Bidirectional Rotation ---")
    print(f"URL: {file_url}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1600, 'height': 900})
        
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        
        page.goto(file_url)
        page.wait_for_timeout(1000)
        
        # Switch to Tab 2
        page.click('.tab-btn[data-target="tabCanvas"]')
        page.wait_for_timeout(500)
        
        # 1. Test 2D Direction Toggle Button
        btn2D = page.locator('#btn2DAnimDirection')
        assert btn2D.is_visible(), "Button #btn2DAnimDirection not visible!"
        text_init = btn2D.inner_text()
        print(f"2D Initial button text: '{text_init}'")
        assert "Thuận" in text_init, f"Expected 'Thuận' in initial text, got '{text_init}'"
        
        # Click to reverse
        btn2D.click()
        page.wait_for_timeout(200)
        text_rev = btn2D.inner_text()
        print(f"2D Reversed button text: '{text_rev}'")
        assert "Nghịch" in text_rev, f"Expected 'Nghịch' in reversed text, got '{text_rev}'"
        
        dir_2d = page.evaluate('() => window.appUI.canvasController.animDirection')
        print(f"2D animDirection value: {dir_2d}")
        assert dir_2d == -1, f"Expected animDirection == -1, got {dir_2d}"
        
        # Click back to forward
        btn2D.click()
        page.wait_for_timeout(200)
        text_fwd = btn2D.inner_text()
        print(f"2D Back to forward text: '{text_fwd}'")
        assert "Thuận" in text_fwd
        dir_2d_fwd = page.evaluate('() => window.appUI.canvasController.animDirection')
        assert dir_2d_fwd == 1
        
        # 2. Test 3D Direction Toggle Button
        page.evaluate("() => document.getElementById('btnMode3D').click()")
        page.wait_for_timeout(800)
        
        btn3D = page.locator('#btn3DAnimDirection')
        assert btn3D.is_visible(), "Button #btn3DAnimDirection not visible!"
        text_3d_init = btn3D.inner_text()
        print(f"3D Initial button text: '{text_3d_init}'")
        assert "Thuận" in text_3d_init
        
        # Click to reverse
        btn3D.click()
        page.wait_for_timeout(200)
        text_3d_rev = btn3D.inner_text()
        print(f"3D Reversed button text: '{text_3d_rev}'")
        assert "Nghịch" in text_3d_rev
        
        dir_3d = page.evaluate('() => window.bevel3DVisualizer.animDirection')
        print(f"3D animDirection value: {dir_3d}")
        assert dir_3d == -1, f"Expected 3D animDirection == -1, got {dir_3d}"
        
        # Let it run for 400ms and check angle decreases
        angle_start = page.evaluate('() => window.bevel3DVisualizer.pinionAngle')
        page.wait_for_timeout(400)
        angle_after = page.evaluate('() => window.bevel3DVisualizer.pinionAngle')
        print(f"Angle start: {angle_start:.4f}, Angle after 400ms reverse: {angle_after:.4f}")
        assert angle_after < angle_start, f"Expected angle to decrease in reverse rotation, got start={angle_start}, after={angle_after}"
        
        # Take screenshot of 3D reverse rotation
        screenshot_path = os.path.join(base_dir, 'scratch', 'bevel_3d_reverse_rotation.png')
        os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved: {screenshot_path}")
        
        # Also copy to artifacts dir
        artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
        page.screenshot(path=os.path.join(artifacts_dir, 'bevel_3d_reverse_rotation.png'))
        
        # Click back to forward
        btn3D.click()
        page.wait_for_timeout(200)
        text_3d_fwd = btn3D.inner_text()
        print(f"3D Back to forward text: '{text_3d_fwd}'")
        assert "Thuận" in text_3d_fwd
        
        angle_fwd_start = page.evaluate('() => window.bevel3DVisualizer.pinionAngle')
        page.wait_for_timeout(400)
        angle_fwd_after = page.evaluate('() => window.bevel3DVisualizer.pinionAngle')
        print(f"Angle start forward: {angle_fwd_start:.4f}, after 400ms: {angle_fwd_after:.4f}")
        assert angle_fwd_after > angle_fwd_start, "Expected angle to increase in forward rotation"
        
        page.screenshot(path=os.path.join(artifacts_dir, 'bevel_3d_forward_rotation.png'))
        
        print(f"Console errors: {len(console_errors)}")
        assert len(console_errors) == 0, f"Console errors found: {console_errors}"
        browser.close()
        print("✅ BEVEL GEAR BIDIRECTIONAL TEST PASSED 100%!")

def test_spur_bidirectional():
    file_url = 'file:///' + os.path.join(base_dir, 'modules', 'spur-gear', 'index.html').replace('\\', '/')
    print(f"\n--- Testing Spur Gear Bidirectional Rotation ---")
    print(f"URL: {file_url}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1600, 'height': 900})
        
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        
        page.goto(file_url)
        page.wait_for_timeout(1000)
        
        # Switch to Tab 2
        page.click('.tab-btn[data-target="tabCanvas"]')
        page.wait_for_timeout(500)
        
        # 1. Test 2D Direction Toggle Button
        btn2D = page.locator('#btn2DAnimDirection')
        assert btn2D.is_visible(), "Spur #btn2DAnimDirection not visible!"
        text_init = btn2D.inner_text()
        print(f"Spur 2D Initial text: '{text_init}'")
        assert "Thuận" in text_init
        
        btn2D.click()
        page.wait_for_timeout(200)
        text_rev = btn2D.inner_text()
        print(f"Spur 2D Reversed text: '{text_rev}'")
        assert "Nghịch" in text_rev
        
        dir_2d = page.evaluate('() => window.appUI.canvasController.animDirection')
        print(f"Spur 2D animDirection: {dir_2d}")
        assert dir_2d == -1
        
        # 2. Test 3D Direction Toggle Button
        page.evaluate("() => document.getElementById('btnMode3D').click()")
        page.wait_for_timeout(800)
        
        btn3D = page.locator('#btn3DAnimDirection')
        assert btn3D.is_visible(), "Spur #btn3DAnimDirection not visible!"
        text_3d_init = btn3D.inner_text()
        print(f"Spur 3D Initial text: '{text_3d_init}'")
        assert "Thuận" in text_3d_init
        
        btn3D.click()
        page.wait_for_timeout(200)
        text_3d_rev = btn3D.inner_text()
        print(f"Spur 3D Reversed text: '{text_3d_rev}'")
        assert "Nghịch" in text_3d_rev
        
        dir_3d = page.evaluate('() => window.appUI.visualizer3D.animDirection')
        print(f"Spur 3D animDirection: {dir_3d}")
        assert dir_3d == -1
        
        artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
        page.screenshot(path=os.path.join(artifacts_dir, 'spur_3d_reverse_rotation.png'))
        
        print(f"Console errors: {len(console_errors)}")
        assert len(console_errors) == 0, f"Console errors: {console_errors}"
        browser.close()
        print("✅ SPUR GEAR BIDIRECTIONAL TEST PASSED 100%!")

if __name__ == '__main__':
    test_bevel_bidirectional()
    test_spur_bidirectional()
    print("\n🎉 ALL BIDIRECTIONAL ROTATION TESTS PASSED 100%!")
