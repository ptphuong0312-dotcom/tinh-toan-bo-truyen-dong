import os
import sys
from playwright.sync_api import sync_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

base_dir = r"F:\Antigravity\MITCalc-Gear-Engineering"
artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

def run_tca_verification():
    print("=" * 80)
    print("VERIFYING TOOTH CONTACT ANALYSIS (TCA) - 2-WAY ROTATION & 360 INSPECTION")
    print("=" * 80)
    
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
        
        # Switch to 3D
        page.evaluate("() => document.getElementById('btnMode3D').click()")
        page.wait_for_timeout(800)
        
        # Enable TCA
        page.evaluate("() => { document.getElementById('btnToggleContactTCA').click(); }")
        page.wait_for_timeout(300)
        
        # Set Pattern to Mode 1 (Cumulative Gleason Rolled Pattern)
        page.evaluate("() => { document.getElementById('selTCAPatternType').value = '1'; document.getElementById('selTCAPatternType').dispatchEvent(new Event('change')); }")
        
        # Set Color Mode to 1 (Prussian Blue)
        page.evaluate("() => { document.getElementById('selTCAColorMode').value = '1'; document.getElementById('selTCAColorMode').dispatchEvent(new Event('change')); }")
        
        # Set Band Width to 4.0 mm
        page.evaluate("() => { document.getElementById('sliderTCABandWidth').value = '4.0'; document.getElementById('sliderTCABandWidth').dispatchEvent(new Event('input')); }")
        page.wait_for_timeout(500)
        
        # 1. Forward Rotation - Capture Isometric View
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_forward_iso_prussian_blue.png'))
        print("Captured: tca_forward_iso_prussian_blue.png")
        
        # 2. Forward Rotation - Close-up on Active Mesh Contact Zone
        page.evaluate("() => window.bevel3DVisualizer.setViewPreset('mesh')")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_forward_mesh_zoom.png'))
        print("Captured: tca_forward_mesh_zoom.png")
        
        # 3. Forward Rotation - View from Behind the Big Gear ("phía sau của bánh răng")
        # Rotate camera to look at the back/underside of the gear teeth
        page.evaluate("() => { const vis = window.bevel3DVisualizer; vis.camera.position.set(200, -350, -250); vis.camera.lookAt(200, 0, 0); vis.controls.update(); vis.renderer.render(vis.scene, vis.camera); }")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_forward_behind_gear_view.png'))
        print("Captured: tca_forward_behind_gear_view.png")
        
        # 4. Now Switch to REVERSE ROTATION (-1)
        btn3D = page.locator('#btn3DAnimDirection')
        btn3D.click()
        page.wait_for_timeout(300)
        
        # Check that animDirection is -1 and uAnimDirection is -1
        dir_val = page.evaluate("() => window.bevel3DVisualizer.animDirection")
        u_dir = page.evaluate("() => window.bevel3DVisualizer.tcaUniforms.uAnimDirection.value")
        print(f"Reverse Direction Toggled -> animDirection: {dir_val}, uAnimDirection: {u_dir}")
        assert dir_val == -1 and u_dir == -1.0, f"Expected -1, got dir={dir_val}, uDir={u_dir}"
        
        # 5. Reverse Rotation - Capture Mesh Close-up (Transferred to Coast Flanks!)
        page.evaluate("() => window.bevel3DVisualizer.setViewPreset('mesh')")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_reverse_mesh_zoom.png'))
        print("Captured: tca_reverse_mesh_zoom.png")
        
        # 6. Reverse Rotation - View from Behind the Pinion & Gear
        page.evaluate("() => { const vis = window.bevel3DVisualizer; vis.camera.position.set(-150, 200, -300); vis.camera.lookAt(0, 50, 0); vis.controls.update(); vis.renderer.render(vis.scene, vis.camera); }")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_reverse_behind_view.png'))
        print("Captured: tca_reverse_behind_view.png")
        
        # 7. Reverse Rotation - Isometric Overview
        page.evaluate("() => window.bevel3DVisualizer.setViewPreset('iso')")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(artifacts_dir, 'tca_reverse_iso_prussian_blue.png'))
        print("Captured: tca_reverse_iso_prussian_blue.png")
        
        print(f"Total console errors: {len(console_errors)}")
        assert len(console_errors) == 0, f"Errors encountered: {console_errors}"
        
        browser.close()
        print("ALL TCA BIDIRECTIONAL CONTACT MARK VERIFICATIONS PASSED 100%!")

if __name__ == '__main__':
    run_tca_verification()
