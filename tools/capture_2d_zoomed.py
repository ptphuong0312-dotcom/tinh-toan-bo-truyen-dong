from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/spur-gear/index.html')
    page.wait_for_timeout(1000)
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(1000)

    # Click zoom in 6 times
    for _ in range(6):
        page.locator('#btnZoomIn').click()
        page.wait_for_timeout(200)

    page.screenshot(path='spur_tab2_2d_zoomed.png')
    browser.close()
    print('Zoomed 2D taken')
