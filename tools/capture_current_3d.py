from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/'))
    page.locator('[data-target="tabCanvas"]').click()
    page.wait_for_timeout(500)
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(1000)
    page.locator('#bevel3DContainer').screenshot(path='scratch/current_3d_view.png')
    browser.close()
    print("Done capture 3D view!")
