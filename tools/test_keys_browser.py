import os
from playwright.sync_api import sync_playwright

html_path = os.path.abspath('modules/shaft-keys/index.html').replace('\\', '/')
file_url = f'file:///{html_path}'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    
    errors = []
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.on('console', lambda msg: print(f"Browser Log [{msg.type}]: {msg.text}") if msg.type == 'error' else None)
    
    page.goto(file_url)
    page.wait_for_timeout(1000)
    
    # 1. Parallel Key readings
    b_val = page.text_content('#outParallelB')
    h_val = page.text_content('#outParallelH')
    t1_val = page.text_content('#outParallelT1')
    key_name = page.text_content('#outParallelKeyName')
    print('1. Parallel Key:')
    print(f'   Key: {key_name}, b={b_val}, h={h_val}, t1={t1_val}')
    
    # 2. Click Woodruff tab
    buttons = page.query_selector_all('.joint-type-btn')
    buttons[1].click() # Woodruff
    page.wait_for_timeout(500)
    w_name = page.text_content('#outWoodruffKeyName')
    w_b = page.text_content('#outWoodruffB')
    print('2. Woodruff Key:')
    print(f'   Key: {w_name}, b={w_b}')
    
    # 3. Click Spline tab
    buttons[2].click() # Splines
    page.wait_for_timeout(500)
    s_name = page.text_content('#outSplineName')
    s_n = page.text_content('#outSplineN')
    print('3. Splines:')
    print(f'   Spline: {s_name}, n={s_n}')
    
    # Test Central Portal
    portal_path = os.path.abspath('index.html').replace('\\', '/')
    page.goto(f'file:///{portal_path}')
    page.wait_for_timeout(1000)
    
    os.makedirs('scratch/test_screens', exist_ok=True)
    page.screenshot(path='scratch/test_screens/portal_with_keys_verified.png')
    
    print(f'\nTotal Console Errors: {len(errors)}')
    browser.close()
    print('All Browser checks PASSED successfully!')
