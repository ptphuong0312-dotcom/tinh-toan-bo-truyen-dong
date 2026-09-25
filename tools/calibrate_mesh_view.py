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
    
    views = [
        ("view_A", 0, -80, 80),      # Directly in front, looking down at 45 deg
        ("view_B", -20, -70, 70),    # Pinion side looking into mesh
        ("view_C", 20, -70, 70),     # Gear side looking into mesh
        ("view_D", 0, -100, 110),    # Slightly further back
        ("view_E", -30, -50, 45)     # Close up into pinion tooth flank
    ]
    
    for name, dx, dy, dz in views:
        page.evaluate(f'''() => {{
            const viz = window.spurApp.visualizer3D;
            const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
            viz.controls.target.set(pitchX, 0, 0);
            viz.camera.position.set(pitchX + {dx}, {dy}, {dz});
            viz.camera.up.set(0, 0, 1);
            viz.controls.update();
            viz.renderer.render(viz.scene, viz.camera);
        }}''')
        page.wait_for_timeout(300)
        page.screenshot(path=f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/calibrate_{name}.png')
        print(f"Captured calibrate_{name}.png")

    browser.close()
    print("Done calibration!")
