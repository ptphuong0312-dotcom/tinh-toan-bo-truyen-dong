import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    
    print("Loading Worm Gear Web App...")
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/worm-gear/index.html')
    page.wait_for_timeout(1000)
    
    # 1. Switch to Tab 2 (3D Simulation)
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(500)
    
    # 2. Switch to 3D
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(600)
    
    # Capture Solid Iso View - verify side face is solid without honeycomb!
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_iso_no_honeycomb.png')
    print("Captured worm_solid_iso_no_honeycomb.png")
    
    # Select "wheel" view preset to inspect wheel side face directly
    page.locator('#sel3DViewPreset').select_option('wheel')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_solid_wheel_face_solid.png')
    print("Captured worm_solid_wheel_face_solid.png")
    
    # 3. Toggle "Chỉ Mặt Bên" (Flank Only)
    page.locator('#btnToggleFlankOnly').click()
    page.wait_for_timeout(500)
    
    # 4. Select "mesh" view preset (Vùng Tiếp Xúc Ăn Khớp)
    page.locator('#sel3DViewPreset').select_option('mesh')
    page.wait_for_timeout(500)
    
    # Capture Theory Contact in Mesh Zone
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_flank_contact_theory_mesh.png')
    print("Captured worm_flank_contact_theory_mesh.png")
    
    # 5. Switch to Crowning Mode
    page.locator('#selContactTheoryMode').select_option('crowning')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_flank_contact_crowning_mesh.png')
    print("Captured worm_flank_contact_crowning_mesh.png")
    
    # 6. Switch to Iso View in Flank-Only Crowning Mode
    page.locator('#sel3DViewPreset').select_option('iso')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_flank_contact_crowning_iso.png')
    print("Captured worm_flank_contact_crowning_iso.png")
    
    # 7. Test User Exact View: Level 8 + Theory Mode in Mesh Zone (to verify no cracking/spiderweb)
    page.locator('#selMeshDensity').select_option('8')
    page.wait_for_timeout(600)
    page.locator('#selContactTheoryMode').select_option('theory')
    page.wait_for_timeout(600)
    page.locator('#sel3DViewPreset').select_option('mesh')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_flank_lvl8_theory_mesh_smooth.png')
    print("Captured worm_flank_lvl8_theory_mesh_smooth.png")
    
    # 8. Test Level 8 + Crowning Mode in Mesh Zone
    page.locator('#selContactTheoryMode').select_option('crowning')
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/worm_flank_lvl8_crowning_mesh_smooth.png')
    print("Captured worm_flank_lvl8_crowning_mesh_smooth.png")

    browser.close()
    print("All test screenshots captured successfully!")
