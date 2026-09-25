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
    
    # Pause animation
    page.locator('#btnToggle3DAnim').click()
    page.wait_for_timeout(300)
    
    # Set calibrated camera position
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const mn = viz.geom.mn || 6.0;
        const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchX, 0, 0);
        viz.camera.position.set(pitchX - 15, -(45 + 3.0 * mn), 35 + 2.5 * mn);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/calibrated_mesh_theory.png')
    
    # Now switch to crowning mode
    page.locator('#selContactTheoryMode').select_option('crowning')
    page.wait_for_timeout(500)
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const mn = viz.geom.mn || 6.0;
        const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchX, 0, 0);
        viz.camera.position.set(pitchX - 15, -(45 + 3.0 * mn), 35 + 2.5 * mn);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/calibrated_mesh_crowning.png')

    browser.close()
    print("Calibrated mesh screenshots captured successfully!")
