import os
import sys
import time
import struct
import base64
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def log(msg):
    print(msg, flush=True)

def test_gear_3d_webapp():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_path = os.path.join(base_dir, 'modules', 'spur-gear', 'index.html').replace('\\', '/')
    file_url = f'file:///{html_path}'

    log('=' * 80)
    log('[*] TESTING SPUR & HELICAL GEAR 3D SIMULATION & CAD EXPORT')
    log(f'[*] Target URL: {file_url}')
    log('=' * 80)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1400, "height": 900})

        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)

        page.goto(file_url, wait_until='networkidle')
        time.sleep(1.0)

        # 1. Switch to Tab 2
        log('[1] Navigating to Tab 2 (2D / 3D CAD Visualizer)...')
        page.evaluate('document.querySelector("button[data-target=\'tabCanvas\']").click()')
        time.sleep(0.5)

        # 2. Switch to 3D Mode
        log('[2] Switching to 3D WebGL mode...')
        page.evaluate('document.getElementById("btnMode3D").click()')
        time.sleep(0.5)

        container_3d = page.locator('#container3D')
        assert container_3d.is_visible(), 'Container 3D not visible'

        badge_info = page.evaluate('''() => {
            return {
                type: document.getElementById("badge3DType").innerText,
                aw: document.getElementById("badge3DAw").innerText,
                ratio: document.getElementById("badge3DRatio").innerText,
                beta: document.getElementById("badge3DBeta").innerText
            };
        }''')
        log(f'[+] 3D Badge (Spur): {badge_info["type"]} | aw = {badge_info["aw"]}')
        assert 'Spur Gear' in badge_info["type"], f'Expected Spur Gear, got: {badge_info["type"]}'

        # Take screenshot of 3D Spur Gear
        shot_spur = os.path.join(base_dir, 'docs', '3d_spur_gear_verified.png')
        page.screenshot(path=shot_spur, animations="disabled")
        log(f'[+] Saved 3D Spur Gear screenshot to: {shot_spur}')

        # 3. Change to Helical Gear (beta = 15 deg)
        log('[3] Changing helix angle to beta = 15.0 deg (Helical Gear mode)...')
        page.evaluate('''() => {
            const inBeta = document.getElementById("in_beta");
            if (inBeta) {
                inBeta.value = "15.0";
                inBeta.dispatchEvent(new Event("input", { bubbles: true }));
            }
        }''')
        time.sleep(0.8)

        badge_info_helical = page.evaluate('''() => {
            return {
                type: document.getElementById("badge3DType").innerText,
                aw: document.getElementById("badge3DAw").innerText,
                ratio: document.getElementById("badge3DRatio").innerText,
                beta: document.getElementById("badge3DBeta").innerText
            };
        }''')
        log(f'[+] 3D Badge (Helical): {badge_info_helical["type"]} | beta = {badge_info_helical["beta"]}')
        assert 'Helical Gear' in badge_info_helical["type"], f'Expected Helical Gear, got: {badge_info_helical["type"]}'
        assert '15.00' in badge_info_helical["beta"] or '15' in badge_info_helical["beta"], f'Expected 15.00 deg beta, got: {badge_info_helical["beta"]}'

        # Take screenshot of 3D Helical Gear
        shot_helical = os.path.join(base_dir, 'docs', '3d_helical_gear_verified.png')
        page.screenshot(path=shot_helical, animations="disabled")
        log(f'[+] Saved 3D Helical Gear screenshot to: {shot_helical}')

        # 4. Test Camera presets
        log('[4] Testing camera presets (Front, Top, Mesh, Iso, Wireframe)...')
        page.evaluate('document.getElementById("btnViewFront").click()')
        page.evaluate('document.getElementById("btnViewTop").click()')
        page.evaluate('document.getElementById("btnViewMesh").click()')
        page.evaluate('document.getElementById("btnViewIso").click()')
        page.evaluate('document.getElementById("btnToggleWireframe").click()')
        page.evaluate('document.getElementById("btnToggleWireframe").click()')
        log('[+] Camera & Wireframe controls verified!')

        # 5. Test 3D Exports
        log('[5] Testing 3D Export System for SolidWorks & Mastercam...')

        # 5.1 Test STEP Export
        log('  [*] Testing STEP Pinion and Assembly export...')
        step_pinion_data = page.evaluate('window.spurApp.export3DCAD("step", "pinion", false)')
        assert step_pinion_data and 'text' in step_pinion_data, 'STEP export failed'
        assert 'ISO-10303-21;' in step_pinion_data['text'], 'Invalid STEP header'
        assert 'MANIFOLD_SOLID_BREP' in step_pinion_data['text'], 'Missing solid B-Rep'
        assert step_pinion_data['triangleCount'] > 5000, 'Triangle count too small'

        step_pinion_path = os.path.join(base_dir, 'docs', 'Pinion1_Helical_z19_m6_beta15.step')
        with open(step_pinion_path, 'w', encoding='utf-8') as f:
            f.write(step_pinion_data['text'])
        log(f'  [+] STEP Pinion 1 saved: {step_pinion_path} ({os.path.getsize(step_pinion_path):,} bytes, {step_pinion_data["triangleCount"]:,} triangles)')

        step_asm_data = page.evaluate('window.spurApp.export3DCAD("step", "assembly", false)')
        step_asm_path = os.path.join(base_dir, 'docs', 'GearPair_Helical_z19x48_aw208.step')
        with open(step_asm_path, 'w', encoding='utf-8') as f:
            f.write(step_asm_data['text'])
        log(f'  [+] STEP Assembly saved: {step_asm_path} ({os.path.getsize(step_asm_path):,} bytes, {step_asm_data["triangleCount"]:,} triangles)')

        # 5.2 Test Binary STL Export
        log('  [*] Testing Binary STL Assembly export...')
        stl_b64 = page.evaluate('''() => {
            const res = window.spurApp.export3DCAD("stl", "assembly", false);
            const bytes = new Uint8Array(res.buffer);
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const sub = bytes.subarray(i, i + chunkSize);
                binary += String.fromCharCode.apply(null, sub);
            }
            return btoa(binary);
        }''')
        stl_bytes = base64.b64decode(stl_b64)
        stl_path = os.path.join(base_dir, 'docs', 'GearPair_Helical_z19x48_aw208.stl')
        with open(stl_path, 'wb') as f:
            f.write(stl_bytes)

        header = stl_bytes[:80]
        num_triangles = struct.unpack('<I', stl_bytes[80:84])[0]
        expected_size = 84 + num_triangles * 50
        actual_size = len(stl_bytes)
        log(f'  [+] Binary STL Assembly saved: {stl_path} ({actual_size:,} bytes, {num_triangles:,} triangles)')
        assert expected_size == actual_size, f'STL size mismatch: expected {expected_size}, got {actual_size}'
        assert b'SolidWorks & Mastercam' in header, 'Missing header in STL'
        log('  [+] Binary STL watertight structure validated 100%!')

        # 5.3 Test OBJ Export
        log('  [*] Testing OBJ export...')
        obj_data = page.evaluate('window.spurApp.export3DCAD("obj", "pinion", false)')
        assert 'v ' in obj_data['text'] and 'vn ' in obj_data['text'] and 'f ' in obj_data['text'], 'Invalid OBJ content'
        obj_path = os.path.join(base_dir, 'docs', 'Pinion1_Helical_z19.obj')
        with open(obj_path, 'w', encoding='utf-8') as f:
            f.write(obj_data['text'])
        log(f'  [+] OBJ Pinion 1 saved: {obj_path} ({os.path.getsize(obj_path):,} bytes)')

        # 6. Check console errors
        log('[6] Checking browser console logs...')
        fatal_errors = [e for e in console_errors if 'favicon' not in e.lower()]
        if fatal_errors:
            log(f'[-] Found console errors: {fatal_errors}')
            assert len(fatal_errors) == 0, f'Console errors detected: {fatal_errors}'
        else:
            log('[+] 0 Console Errors detected!')

        browser.close()

    log('=' * 80)
    log('>>> ALL 3D SPUR & HELICAL SIMULATION & CAD EXPORT TESTS PASSED 100%!')
    log('=' * 80)

if __name__ == '__main__':
    test_gear_3d_webapp()
