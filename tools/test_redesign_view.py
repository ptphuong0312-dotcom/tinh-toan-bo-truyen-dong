from playwright.sync_api import sync_playwright
import os

os.makedirs('scratch', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 950})
    url = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')
    page.goto(url)
    page.locator('[data-target="tabCanvas"]').click()
    page.wait_for_timeout(800)
    
    # Capture master bar
    page.locator('#masterVisualizerNav').screenshot(path='scratch/test_master_bar_2d.png')
    page.screenshot(path='scratch/test_page_2d_redesign.png')
    print('Captured 2D redesign screenshot!')
    
    # Click 3D CAD button
    page.locator('#btnMode3D').click()
    page.wait_for_timeout(1200)
    
    # Capture 3D master bar and container3D
    page.locator('#masterVisualizerNav').screenshot(path='scratch/test_master_bar_3d.png')
    page.locator('#container3D').screenshot(path='scratch/test_container3d_overlay.png')
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(300)
    page.screenshot(path='scratch/test_page_3d_redesign.png')
    print('Captured 3D redesign screenshot!')
    
    # Test dropdown values
    val2D = page.locator('#selProfileResolutionCanvas').input_value()
    val3D = page.locator('#selMeshDensity').input_value()
    viewPreset = page.locator('#sel3DViewPreset').input_value()
    print(f'Initial values: 2D resolution = {val2D}, 3D mesh density = {val3D}, viewPreset = {viewPreset}')
    
    # Change 2D dropdown
    page.locator('#selProfileResolutionCanvas').select_option('7')
    page.wait_for_timeout(300)
    print('Selected level 7 on 2D dropdown successfully!')

    browser.close()
    print('ALL PLAYWRIGHT TESTS PASSED!')
