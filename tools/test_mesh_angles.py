import os
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/spur-gear/index.html')
    page.wait_for_timeout(1000)
    
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(500)
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(500)
    page.locator('#btnToggleFlankOnly').click()
    page.wait_for_timeout(500)
    
    # Pause animation at exact initial conjugate kiss contact
    page.locator('#btnToggle3DAnim').click()
    page.wait_for_timeout(300)
    
    positions = [
        ("mesh_dist_75", 25, -60, 40),
        ("mesh_dist_95", 30, -75, 50),
        ("mesh_dist_120", 35, -95, 65),
        ("mesh_dist_140", 40, -110, 75)
    ]
    
    for name, dx, dy, dz in positions:
        # 1. Theory
        page.locator('#selContactTheoryMode').select_option('theory')
        page.wait_for_timeout(300)
        page.evaluate(f'''() => {{
            const viz = window.spurApp.visualizer3D;
            const pitchPtX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
            viz.controls.target.set(pitchPtX, 0, 0);
            viz.camera.position.set(pitchPtX + {dx}, {dy}, {dz});
            viz.camera.up.set(0, 0, 1);
            viz.controls.update();
            viz.renderer.render(viz.scene, viz.camera);
        }}''')
        page.wait_for_timeout(300)
        path_theory = f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/{name}_theory.png'
        page.screenshot(path=path_theory)
        
        # 2. Crowning
        page.locator('#selContactTheoryMode').select_option('crowning')
        page.wait_for_timeout(300)
        page.evaluate(f'''() => {{
            const viz = window.spurApp.visualizer3D;
            const pitchPtX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
            viz.controls.target.set(pitchPtX, 0, 0);
            viz.camera.position.set(pitchPtX + {dx}, {dy}, {dz});
            viz.camera.up.set(0, 0, 1);
            viz.controls.update();
            viz.renderer.render(viz.scene, viz.camera);
        }}''')
        page.wait_for_timeout(300)
        path_crown = f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/{name}_crowning.png'
        page.screenshot(path=path_crown)
        
        print(f"Captured {name} theory & crowning")

    browser.close()
    print("Done testing angles!")
