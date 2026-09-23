import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # 1. Preset 'mesh' (zoomed in to contact zone)
    page.evaluate('''() => {
        window.appUI.visualizer3D.setViewPreset('mesh');
        window.appUI.visualizer3D.toggleFlankOnly();
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/view_mesh_flank.png')

    # 2. Preset 'iso' with flank only
    page.evaluate('''() => {
        window.appUI.visualizer3D.setViewPreset('iso');
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/view_iso_flank.png')

    # 3. Preset 'front' (axial cross section) with flank only
    page.evaluate('''() => {
        window.appUI.visualizer3D.setViewPreset('front');
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/view_front_flank.png')

    b.close()
    print("Screenshots taken successfully!")
