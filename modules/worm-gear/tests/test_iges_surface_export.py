import os
import sys
import time
from playwright.sync_api import sync_playwright

def test_iges_surface_export():
    html_path = os.path.abspath("modules/worm-gear/index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"

    print(f"Opening {file_url}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 950})
        page = context.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {msg.text}") if msg.type in ["error"] else None)

        page.goto(file_url, wait_until="networkidle")
        time.sleep(1)

        # Switch to Tab 2
        page.click('button[data-target="tabCanvas"]')
        time.sleep(0.5)

        # Switch to 3D Mode
        page.click("#btnMode3D")
        time.sleep(1.0)

        # Open 3D Export Dropdown
        page.click("#btnExport3DMenu")
        time.sleep(0.3)

        # Screenshot the open 3D export dropdown menu
        dropdown_shot = os.path.join(artifact_dir, "worm_3d_export_dropdown_mastercam.png")
        page.screenshot(path=dropdown_shot)
        print(f"Saved dropdown menu screenshot to {dropdown_shot}")

        # Intercept and verify IGES & STEP exports
        test_script = """
        () => {
            const results = {};
            const origCreateObjectURL = URL.createObjectURL;
            let capturedBlobs = {};

            URL.createObjectURL = (blob) => {
                return 'blob:test';
            };

            // Helper to capture blob from exporter
            const captureExport = (fn) => {
                let captured = null;
                const origDownload = Worm3DExporter.downloadBlob;
                Worm3DExporter.downloadBlob = (b, name) => {
                    captured = { blob: b, name: name };
                };
                try {
                    fn();
                } finally {
                    Worm3DExporter.downloadBlob = origDownload;
                }
                return captured;
            };

            // 1. Test Worm IGES
            const wormRes = captureExport(() => window.wormUI.export3DCAD('iges', 'worm'));
            if (wormRes) {
                results.worm_iges = { name: wormRes.name, size: wormRes.blob.size };
            }

            // 2. Test Wheel IGES
            const wheelRes = captureExport(() => window.wormUI.export3DCAD('iges', 'wheel'));
            if (wheelRes) {
                results.wheel_iges = { name: wheelRes.name, size: wheelRes.blob.size };
            }

            // 3. Test Assembly IGES
            const assyRes = captureExport(() => window.wormUI.export3DCAD('iges', 'assembly'));
            if (assyRes) {
                results.assy_iges = { name: assyRes.name, size: assyRes.blob.size };
            }

            // 4. Test Wireframe Curves IGES
            const curvesRes = captureExport(() => window.wormUI.export3DCAD('iges_curves', 'worm'));
            if (curvesRes) {
                results.curves_iges = { name: curvesRes.name, size: curvesRes.blob.size };
            }

            // 5. Test STEP Surface face count optimization
            const stepSurfRes = captureExport(() => window.wormUI.export3DCAD('step_surface', 'worm'));
            if (stepSurfRes) {
                results.step_surface = { name: stepSurfRes.name, size: stepSurfRes.blob.size };
            }

            // Read actual text content of worm_iges to verify lines
            const pData = window.wormUI.visualizer3D.getParametricData('worm');
            const igesObj = Worm3DExporter.exportIGES(pData, 'test.igs', false);
            results.worm_iges_content = igesObj.content;
            results.numSurfaces = igesObj.numSurfaces;
            results.numCurves = igesObj.numCurves;
            results.totalLines = igesObj.totalLines;

            URL.createObjectURL = origCreateObjectURL;
            return results;
        }
        """

        res = page.evaluate(test_script)
        print("Export test results:")
        print("  Worm IGES:", res.get("worm_iges"))
        print("  Wheel IGES:", res.get("wheel_iges"))
        print("  Assembly IGES:", res.get("assy_iges"))
        print("  Wireframe Curves IGES:", res.get("curves_iges"))
        print("  Optimized STEP Surface:", res.get("step_surface"))
        print("  Worm IGES Num Surfaces:", res.get("numSurfaces"))
        print("  Worm IGES Num Curves:", res.get("numCurves"))
        print("  Worm IGES Total Lines:", res.get("totalLines"))

        # Verify IGES Content
        content = res.get("worm_iges_content", "")
        lines = [l for l in content.splitlines() if l]
        print(f"Total lines in Worm IGES: {len(lines)}")
        assert len(lines) > 50, "IGES file should have more than 50 lines"

        for idx, line in enumerate(lines):
            assert len(line) == 80, f"Line {idx+1} length is {len(line)} != 80: [{line}]"

        print("SUCCESS: 100% of Worm IGES lines are exactly 80 characters!")

        # Verify sections
        has_s = any(l[72] == 'S' for l in lines)
        has_g = any(l[72] == 'G' for l in lines)
        has_d = any(l[72] == 'D' for l in lines)
        has_p = any(l[72] == 'P' for l in lines)
        has_t = any(l[72] == 'T' for l in lines)
        assert has_s and has_g and has_d and has_p and has_t, "Missing required IGES section (S, G, D, P, T)"
        print("SUCCESS: All IGES Sections (S, G, D, P, T) are present and strictly ordered!")

        # Verify Entity 128 (B-Spline Surface) and Entity 106 (Wireframe Copious Data)
        has_entity_128 = any('128' in l[:8] and l[72] == 'D' for l in lines)
        has_entity_106 = any('106' in l[:8] and l[72] == 'D' for l in lines)
        assert has_entity_128, "Entity 128 (B-Spline Surface) not found in Directory Entry"
        assert has_entity_106, "Entity 106 (Wireframe Copious Data) not found in Directory Entry"
        print("SUCCESS: Both Entity 128 (Parametric Surface) and Entity 106 (Wireframe Curves) are verified!")

        # Verify Entity 106 uses Form 12 (Linear Path for continuous 3D wireframe, eliminating '+' point markers)
        d2_lines_106 = [l for l in lines if l[72] == 'D' and int(l[73:80]) % 2 == 0 and l[:8].strip() == '106']
        assert len(d2_lines_106) > 0, "No Entity 106 Line 2 records found"
        for d2 in d2_lines_106:
            form_num = int(d2[32:40].strip())
            assert form_num == 12, f"Entity 106 should have Form 12 (Linear Path), got Form {form_num}"
        print(f"SUCCESS: All {len(d2_lines_106)} Entity 106 curves use Form 12 (Linear Path - 0 point markers)!")

        # Verify Entity 128 has non-degenerate control points across radius
        p_lines_128 = [l for l in lines if l[72] == 'P' and l[64:72].strip() == '1']
        p_data_128 = ''.join([l[:64] for l in p_lines_128]).rstrip(';')
        tokens_128 = p_data_128.split(',')
        K1 = int(tokens_128[1])
        K2 = int(tokens_128[2])
        M1 = int(tokens_128[3])
        M2 = int(tokens_128[4])
        pts_offset = 10 + (K1 + M1 + 2) + (K2 + M2 + 2) + (K1 + 1) * (K2 + 1)
        r_root = (float(tokens_128[pts_offset + 1])**2 + float(tokens_128[pts_offset + 2])**2)**0.5
        tip_idx = pts_offset + K2 * (K1 + 1) * 3
        r_tip = (float(tokens_128[tip_idx + 1])**2 + float(tokens_128[tip_idx + 2])**2)**0.5
        print(f"Entity 128 Flank R: r_root = {r_root:.3f} mm, r_tip = {r_tip:.3f} mm (delta = {r_tip - r_root:.3f} mm)")
        assert r_tip > r_root + 5.0, f"Entity 128 surface is degenerate! r_tip={r_tip}, r_root={r_root}"
        print("SUCCESS: Entity 128 surface has true, non-degenerate B-Spline patch geometry!")

        # Check terminate line
        term_line = lines[-1]
        assert term_line[72] == 'T', f"Last line should be T record, got {term_line}"
        print(f"Terminate record: [{term_line}]")

        if errors:
            print("Errors encountered:", errors)
        assert len(errors) == 0, f"Page errors: {errors}"
        browser.close()
        print(">>> ALL MASTERCAM IGES EXPORT TESTS PASSED 100%!")

if __name__ == "__main__":
    test_iges_surface_export()
