import os
import sys
from playwright.sync_api import sync_playwright

base_dir = r"F:\Antigravity\MITCalc-Gear-Engineering"
html_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
url = "file:///" + html_path.replace("\\", "/")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    page.goto(url)
    page.wait_for_timeout(1000)

    # Switch to 3D tab
    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(500)
    page.click('#btnMode3D')
    page.wait_for_timeout(800)

    # Click Contact button if not active
    contact_btn = page.locator('#btnToggleContact')
    print("Contact button text:", contact_btn.inner_text())
    page.click('#btnToggleContact')
    page.wait_for_timeout(500)

    # Take screenshot of current state
    page.screenshot(path="scratch/current_bevel_view.png")
    print("Saved scratch/current_bevel_view.png")
    browser.close()
