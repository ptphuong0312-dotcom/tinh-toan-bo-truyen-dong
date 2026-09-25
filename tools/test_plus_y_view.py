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
    
    # Ensure animation is stopped and angles reset to initial conjugate mesh
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        viz.isAnimating = false;
        viz.pinionAngle = viz.initialPinionAngle;
        viz.gearAngle = viz.initialGearAngle;
        viz.pinionGroup.rotation.z = viz.pinionAngle;
        viz.gearGroup.rotation.z = viz.gearAngle;
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(300)
    
    # Looking from +Y (where Pinion penetrates through the Gear flank!)
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchX, 0, 0);
        viz.camera.position.set(pitchX, 70, 60);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(300)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_view_from_plus_Y.png')
    
    # Looking from top +Z looking straight down into the mesh line
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchX, 0, 0);
        viz.camera.position.set(pitchX, -15, 80);
        viz.camera.up.set(0, 1, 0);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(300)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_view_from_top_Z.png')
    
    # Looking obliquely along the tooth flank from X=57, Y=-40, Z=15 (looking along the tooth axis Z)
    page.evaluate('''() => {
        const viz = window.spurApp.visualizer3D;
        const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
        viz.controls.target.set(pitchX, 0, 0);
        viz.camera.position.set(pitchX - 15, -40, 20);
        viz.camera.up.set(0, 0, 1);
        viz.controls.update();
        viz.renderer.render(viz.scene, viz.camera);
    }''')
    page.wait_for_timeout(300)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/test_view_along_axis.png')

    browser.close()
    print("Test views captured!")
