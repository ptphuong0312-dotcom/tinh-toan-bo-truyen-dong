import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    
    print("Loading Worm Gear Web App...")
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/worm-gear/index.html')
    page.wait_for_timeout(1000)
    
    # 1. Switch to Tab 2 (2D/3D Canvas)
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(500)
    
    # 2. Switch to 3D WebGL Mode
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(800)
    
    # 3. Capture Isometric View
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_iso_clean.png')
    print("Captured worm_solid_iso_clean.png")

    # Capture Wireframe View
    page.locator('#btnToggleWireframe').click()
    page.wait_for_timeout(400)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_wireframe.png')
    print("Captured worm_solid_wireframe.png")
    page.locator('#btnToggleWireframe').click()
    page.wait_for_timeout(300)
    
    # 4. Capture Front View
    page.locator('#sel3DViewPreset').select_option('front')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_front_clean.png')
    print("Captured worm_solid_front_clean.png")
    
    # 5. Capture Worm Side / Throat View (+X)
    page.locator('#sel3DViewPreset').select_option('worm')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_worm_cross_clean.png')
    print("Captured worm_solid_worm_cross_clean.png")
    
    # 6. Capture Wheel Face View (+Z)
    page.locator('#sel3DViewPreset').select_option('wheel')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_wheel_face_clean.png')
    print("Captured worm_solid_wheel_face_clean.png")
    
    # 7. Capture Meshing Zone Close-up
    page.locator('#sel3DViewPreset').select_option('mesh')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_meshing_zone_clean.png')
    print("Captured worm_solid_meshing_zone_clean.png")
    
    # 8. Step Forward 3 times to rotate the worm and wheel in animation
    page.locator('#btn3DStepFwd').click()
    page.wait_for_timeout(200)
    page.locator('#btn3DStepFwd').click()
    page.wait_for_timeout(200)
    page.locator('#btn3DStepFwd').click()
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_meshing_step3.png')
    print("Captured worm_solid_meshing_step3.png")

    # 9. Isometric View after rotation
    page.locator('#sel3DViewPreset').select_option('iso')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_iso_after_rotation.png')
    print("Captured worm_solid_iso_after_rotation.png")

    browser.close()
    print("All verification screenshots captured successfully!")
