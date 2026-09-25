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
    
    # Stop anim and align to conjugate kiss contact
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
    
    angles = [
        ("angle_120_35", pitch_offset_x := 0, -35, 120),
        ("angle_140_50", 0, -50, 140),
        ("angle_160_60", 0, -60, 160),
        ("angle_perspective_oblique", -15, -45, 95)
    ]
    
    for name, dx, dy, dz in angles:
        page.evaluate(f'''() => {{
            const viz = window.spurApp.visualizer3D;
            const pitchX = (viz.geom.dw1 || viz.geom.d1 || 100) / 2.0;
            viz.controls.target.set(pitchX, 0, 0);
            viz.camera.position.set(pitchX + {dx}, {dy}, {dz});
            viz.camera.up.set(0, 1, 0);
            viz.controls.update();
            viz.renderer.render(viz.scene, viz.camera);
        }}''')
        page.wait_for_timeout(300)
        page.screenshot(path=f'C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/{name}.png')
        print(f"Captured {name}.png")

    browser.close()
    print("Done angle testing!")
