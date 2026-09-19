import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_bevel_webapp():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
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

        # Expand all sections to test all controls
        btn_expand = page.locator('#btnExpandAll')
        if btn_expand.count() > 0:
            btn_expand.click()
            page.wait_for_timeout(300)

        # Tab 1: Calculator
        print("1. Testing Bevel Tab Calculator...")
        btn_i = page.locator('#btn_i_z1z2')
        if btn_i.count() > 0:
            btn_i.click()
            page.wait_for_timeout(200)

        # Test Section 15.0 Auxiliary Calculation Buttons
        print("1.1 Testing Section 15.0 Auxiliary OK Buttons...")
        btn_aux1 = page.locator('#btn_aux_ok_15_1')
        if btn_aux1.count() > 0:
            btn_aux1.click()
            page.wait_for_timeout(100)

        btn_aux2 = page.locator('#btn_aux_ok_15_2')
        if btn_aux2.count() > 0:
            btn_aux2.click()
            page.wait_for_timeout(100)

        btn_aux3 = page.locator('#btn_aux_ok_15_3')
        if btn_aux3.count() > 0:
            btn_aux3.click()
            page.wait_for_timeout(100)

        # Tab 2: 2D Canvas CAD Simulation
        print("2. Testing Bevel Tab 2: 2D Canvas CAD Simulation...")
        page.click('button[data-target="tabCanvas"]')
        page.wait_for_timeout(500)

        # Verify Canvas rendered
        canvas = page.locator('#bevelCanvas')
        print("Canvas present:", canvas.count() > 0)

        # Test speed slider
        slider = page.locator('#sliderAnimSpeed')
        if slider.count() > 0:
            slider.fill("1.5")
            page.wait_for_timeout(200)

        print("Console errors count:", len(console_errors))
        if console_errors:
            for err in console_errors:
                print("   ERROR:", err)
        else:
            print("ZERO JAVASCRIPT ERRORS! 100% CLEAN RUN!")

        b.close()

if __name__ == '__main__':
    test_bevel_webapp()
