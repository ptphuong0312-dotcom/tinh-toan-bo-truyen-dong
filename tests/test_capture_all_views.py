from playwright.sync_api import sync_playwright
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(target)
    page.wait_for_timeout(1000)
    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(200)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # 1. Isometric view
    page.evaluate("window.appUI.visualizer3D.setViewPreset('iso');")
    page.wait_for_timeout(300)
    page.locator('#bevel3DContainer canvas').screenshot(path=os.path.join(base_dir, 'tests', 'spiral_3d_iso.png'))

    # 2. Underneath base view (Y < 0, looking up at large gear base)
    page.evaluate('''() => {
        const vis = window.appUI.visualizer3D;
        const c = vis.controls;
        c.enableDamping = false;
        c.rotateUp(Math.PI); // Orbit underneath large gear base
        c.update();
        c.enableDamping = true;
    }''')
    page.wait_for_timeout(300)
    page.locator('#bevel3DContainer canvas').screenshot(path=os.path.join(base_dir, 'tests', 'spiral_3d_underneath_base.png'))

    # 3. 2D Canvas view
    page.click('#btnMode2D')
    page.wait_for_timeout(300)
    page.locator('#bevelCanvas').screenshot(path=os.path.join(base_dir, 'tests', 'bevel_2d_canvas.png'))

    print("Screenshots captured successfully!")
    b.close()
