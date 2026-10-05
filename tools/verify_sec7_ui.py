import os
from playwright.sync_api import sync_playwright

html_path = os.path.abspath('modules/bevel-gear/index.html')
file_url = 'file:///' + html_path.replace('\\', '/')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 1200})
    page.goto(file_url)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(800)
    
    # Check Section 7.0 elements
    sec7 = page.locator('div.calc-section').filter(has_text='7.0 Bánh Răng Trụ Tương Đương').first
    sec7.locator('.section-header').click()
    page.wait_for_timeout(500)
    
    out_path = os.path.abspath(r'C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0\sec7_verified.png')
    sec7.screenshot(path=out_path)
    print('Screenshot saved successfully:', os.path.exists(out_path), out_path)
    
    # Print values
    for key in ['out_sve1', 'out_sve2', 'out_svm1', 'out_svm2', 'out_svi1', 'out_svi2',
                'out_eve1', 'out_eve2', 'out_evm1', 'out_evm2', 'out_evi1', 'out_evi2',
                'out_svc1', 'out_svc2', 'out_hvc1', 'out_hvc2', 'out_xeq1', 'out_xeq2']:
        el = page.locator(f'#{key}')
        val = el.inner_text() if el.count() > 0 else 'NOT FOUND'
        print(f'{key}: {val}')
        
    browser.close()
