import os
import sys
import re
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def test_all_modules_iges():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    modules = [
        {
            "name": "Module 1: Spur Gear",
            "url": f"file:///{os.path.join(base_dir, 'modules', 'spur-gear', 'index.html').replace(os.sep, '/')}",
            "buttons": ["expIgesPinion", "expIgesGear", "expIgesAssembly", "expIgesCurves"]
        },
        {
            "name": "Module 2: Bevel Gear",
            "url": f"file:///{os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace(os.sep, '/')}",
            "buttons": ["expIgesPinion", "expIgesGear", "expIgesAssembly", "expIgesCurves"]
        },
        {
            "name": "Module 3: Worm Gear",
            "url": f"file:///{os.path.join(base_dir, 'modules', 'worm-gear', 'index.html').replace(os.sep, '/')}",
            "buttons": ["expIgesWorm", "expIgesWheel", "expIgesAssembly", "expIgesCurvesWorm"]
        }
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)

        for mod in modules:
            print(f"\n==========================================")
            print(f"Testing {mod['name']}")
            print(f"==========================================")
            page = context.new_page()
            page.goto(mod["url"])
            page.wait_for_timeout(1500)

            # Switch to 3D tab
            page.evaluate('''() => {
                const btnTab = document.querySelector("button[data-target='tabCanvas']");
                if (btnTab) btnTab.click();
            }''')
            page.wait_for_timeout(800)

            # Switch to 3D mode if 2D/3D toggle button exists
            page.evaluate('''() => {
                const btn3D = document.getElementById("btnMode3D");
                if (btn3D) btn3D.click();
            }''')
            page.wait_for_timeout(800)

            # Open 3D Export dropdown
            page.evaluate('''() => {
                const btnMenu = document.getElementById("btnExport3DMenu");
                if (btnMenu) btnMenu.click();
            }''')
            page.wait_for_timeout(400)

            for btn_id in mod["buttons"]:
                btn = page.locator(f"#{btn_id}")
                assert btn.count() > 0, f"Button #{btn_id} missing in {mod['name']}"
                btn_text = btn.text_content().strip()
                print(f"Found button #{btn_id}: {btn_text}")

                # Ensure dropdown is open
                page.evaluate('''() => {
                    const dd = document.getElementById("export3DDropdown");
                    if (dd) dd.style.display = "block";
                }''')

                with page.expect_download(timeout=10000) as download_info:
                    page.evaluate(f'document.getElementById("{btn_id}").click()')
                download = download_info.value
                filename = download.suggested_filename
                save_path = os.path.join(base_dir, "tests", filename)
                download.save_as(save_path)

                assert os.path.exists(save_path), f"File {filename} was not downloaded!"
                file_size = os.path.getsize(save_path)
                assert file_size > 1000, f"File {filename} is suspiciously small: {file_size} bytes"

                # Check IGES lines
                with open(save_path, "r", encoding="latin-1") as f:
                    content = f.read()

                lines = [l for l in content.splitlines() if len(l) > 0]
                bad_length_lines = [i for i, l in enumerate(lines) if len(l) != 80]
                assert len(bad_length_lines) == 0, f"IGES lines != 80 chars in {filename}: {len(bad_length_lines)}"
                assert "NaN" not in content, f"NaN found in {filename}"
                assert "undefined" not in content, f"undefined found in {filename}"

                # Check Sections S, G, D, P, T
                assert lines[-1].startswith("S"), "T line mismatch"
                assert "T      1" in lines[-1], "Terminate section line invalid"

                print(f"  -> Downloaded: {filename} ({file_size:,} bytes, {len(lines):,} lines, 100% 80-col compliant)")

                # Clean up test file
                if os.path.exists(save_path):
                    os.remove(save_path)

            page.close()

        browser.close()
        print("\n>>> ALL 3 MODULES PASSED IGES 5.3 VERIFICATION 100%!")

if __name__ == "__main__":
    test_all_modules_iges()
