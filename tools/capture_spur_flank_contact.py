import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    
    print("Loading Web App...")
    page.goto('file:///f:/Antigravity/MITCalc-Gear-Engineering/modules/spur-gear/index.html')
    page.wait_for_timeout(1000)
    
    # 1. Switch to Tab 2
    page.locator("button[data-target='tabCanvas']").click()
    page.wait_for_timeout(500)
    
    # 2. Switch to 3D
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(500)
    
    # 3. Toggle "Chỉ Mặt Bên"
    page.locator('#btnToggleFlankOnly').click()
    page.wait_for_timeout(500)
    
    # 4. Select "mesh" view preset
    page.locator('#sel3DViewPreset').select_option('mesh')
    page.wait_for_timeout(500)
    
    # Capture Theory Contact in Mesh Zone
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/spur_flank_contact_theory_mesh.png')
    print("Captured spur_flank_contact_theory_mesh.png")
    
    # 5. Switch to Crowning Mode
    page.locator('#selContactTheoryMode').select_option('crowning')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/spur_flank_contact_crowning_mesh.png')
    print("Captured spur_flank_contact_crowning_mesh.png")
    
    # 6. Switch back to Iso View to see overall gears
    page.locator('#sel3DViewPreset').select_option('iso')
    page.wait_for_timeout(500)
    page.screenshot(path='C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0/spur_flank_contact_crowning_iso.png')
    print("Captured spur_flank_contact_crowning_iso.png")
    
    browser.close()
    print("All screenshots captured successfully!")
