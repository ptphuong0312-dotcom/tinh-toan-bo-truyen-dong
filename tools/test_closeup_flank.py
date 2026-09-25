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
    
    # Pause animation so tooth is locked at exact conjugate contact position!
    page.locator('#btnToggle3DAnim').click()
    page.wait_for_timeout(300)
    
    # Set camera directly looking into tooth mesh gap
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchPtX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchPtX, 0, 0);
        viz.camera.position.set(pitchPtX + 20, -40, 35);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_flank_closeup_40.png')
    
    # Also test from the other side looking into the tooth gap
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchPtX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchPtX, 0, 0);
        viz.camera.position.set(pitchPtX - 20, -40, 35);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_flank_closeup_other.png')
    
    # Also test looking straight from the top-front into the tooth groove
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchPtX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchPtX, 0, 0);
        viz.camera.position.set(pitchPtX, -30, 45);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_flank_closeup_top.png')
    
    browser.close()
    print("Close-up screenshots captured!")
