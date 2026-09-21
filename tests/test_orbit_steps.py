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
    
    info = page.evaluate('''() => {
        const vis = window.appUI.visualizer3D;
        const c = vis.controls;
        c.enableDamping = false;
        const cam = vis.camera;
        const res = [];
        res.push({ step: 0, y: cam.position.y, pos: { x: cam.position.x, y: cam.position.y, z: cam.position.z } });
        
        for (let s = 1; s <= 8; s++) {
            c.rotateUp(Math.PI / 4.0);
            c.update();
            res.push({ step: s, y: cam.position.y, upY: cam.up.y, pos: { x: cam.position.x, y: cam.position.y, z: cam.position.z } });
        }
        return res;
    }''')
    for pt in info:
        print(f"Step {pt['step']}: Y={pt['y']:.1f}, upY={pt.get('upY', 0):.2f}, pos=({pt['pos']['x']:.1f}, {pt['pos']['y']:.1f}, {pt['pos']['z']:.1f})")
    b.close()
