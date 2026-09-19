import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_spur_webapp():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "modules", "spur-gear", "index.html")
    file_url = "file:///" + target_path.replace("\\", "/")
    print("Navigating to:", file_url)

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={'width': 1400, 'height': 1200})

        console_errors = []
        page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: console_errors.append(str(e)))

        page.goto(file_url)
        page.wait_for_timeout(1000)

        # Tab 1: Calculator
        print("1. Testing Spur Tab Calculator...")
        btn_expand = page.locator('#btnExpandAll')
        if btn_expand.count() > 0:
            btn_expand.click()
            page.wait_for_timeout(300)

        # Tab 2: 2D Canvas CAD Simulation
        print("2. Testing Spur Tab 2: 2D Canvas CAD Simulation...")
        btn_canvas = page.locator('button[data-target="tabCanvas"]')
        if btn_canvas.count() > 0:
            btn_canvas.click()
            page.wait_for_timeout(500)

        # Verify Canvas present
        canvas = page.locator('#gearCanvas')
        print("Spur Canvas present:", canvas.count() > 0)

        print("Console errors count:", len(console_errors))
        if console_errors:
            for err in console_errors:
                print("   ERROR:", err)
        else:
            print("ZERO JAVASCRIPT ERRORS! 100% CLEAN RUN!")

        b.close()

if __name__ == '__main__':
    test_spur_webapp()
