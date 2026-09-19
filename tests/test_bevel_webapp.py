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

        # Tab 1: Calculator
        print("1. Testing Bevel Tab Calculator...")
        btn_i = page.locator('#btnCalcRatio')
        if btn_i.count() > 0:
            btn_i.click()
            page.wait_for_timeout(200)

        # Tab 2: Live Audit
        print("2. Testing Bevel Tab Live Audit...")
        page.click('button[data-target="tabAudit"]')
        page.wait_for_timeout(500)
        badge = page.locator('#auditSummaryBadge').text_content()
        print("Bevel Audit summary badge:", badge.strip())

        # Tab 3: Canvas
        print("3. Testing Bevel Tab Canvas...")
        page.click('button[data-target="tabCanvas"]')
        page.wait_for_timeout(500)

        # Tab 4: Materials
        print("4. Testing Bevel Tab Materials...")
        page.click('button[data-target="tabMaterials"]')
        page.wait_for_timeout(300)

        print("Console errors count:", len(console_errors))
        if console_errors:
            for err in console_errors:
                print("   ERROR:", err)
        else:
            print("ZERO JAVASCRIPT ERRORS! 100% CLEAN RUN!")

        b.close()

if __name__ == '__main__':
    test_bevel_webapp()
