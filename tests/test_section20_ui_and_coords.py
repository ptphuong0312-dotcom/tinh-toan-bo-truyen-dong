import os
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_section20():
    print('=' * 80)
    print('[+] TESTING SECTION 20.0 CAD & 120 COORDINATES TABLE RENDERING')
    print('=' * 80)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_url = 'file:///' + os.path.join(base_dir, 'modules', 'spur-gear', 'index.html').replace('\\', '/')

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)

        print(f'[+] Navigating to: {html_url}')
        page.goto(html_url)
        page.wait_for_timeout(1000)


        sec20_header = page.locator('#section20 .section-header')
        assert sec20_header.count() > 0, 'Section 20 header not found'
        print('[+] Section 20 header found!')


        sec20_header.click()
        page.wait_for_timeout(300)
        assert page.locator('#section20').evaluate("el => !el.classList.contains('collapsed')"), 'Section 20 not expanded'
        print('[+] Section 20 expanded successfully!')


        teeth = page.locator('#in_sec20_drawn_teeth').input_value()
        pt_head = page.locator('#in_sec20_no_pt_head').input_value()
        pt_ev = page.locator('#in_sec20_no_pt_ev').input_value()
        cutt_step = page.locator('#in_sec20_cutt_step').input_value()
        print(f'[+] Section 20 inputs: drawn_teeth={teeth}, noPtHead={pt_head}, noPtEv={pt_ev}, cuttStep={cutt_step}')
        assert teeth == '4' and pt_head == '20' and pt_ev == '100' and float(cutt_step) == 0.5, 'Input defaults mismatch'


        btn_toggle = page.locator('#btnToggleCoordTable')
        btn_toggle.click()
        page.wait_for_timeout(300)

        coord_container = page.locator('#coordTableContainer')
        assert coord_container.is_visible(), 'Coordinates table container not visible after click'
        print('[+] Coordinates table container is visible!')


        rows = page.locator('#coordTableBody tr')
        row_count = rows.count()
        print(f'[+] Found {row_count} coordinate rows in table body!')
        assert row_count == 120, f'Expected 120 rows, got {row_count}'


        first_row_cells = rows.nth(0).locator('td').all_text_contents()
        last_row_cells = rows.nth(119).locator('td').all_text_contents()
        print(f'[+] Point 1 (Tip): ID={first_row_cells[0]}, X1={first_row_cells[1]}, Y1={first_row_cells[2]}, R1={first_row_cells[3]}, X2={first_row_cells[4]}, Y2={first_row_cells[5]}, R2={first_row_cells[6]}')
        print(f'[+] Point 120 (Root): ID={last_row_cells[0]}, X1={last_row_cells[1]}, Y1={last_row_cells[2]}, R1={last_row_cells[3]}, X2={last_row_cells[4]}, Y2={last_row_cells[5]}, R2={last_row_cells[6]}')


        assert float(first_row_cells[1]) == 0.0, 'Tip X1 should be 0.0'
        assert abs(float(first_row_cells[2]) - 63.0) < 1e-4, 'Tip Y1 should be da1/2 = 63.0'
        assert abs(float(first_row_cells[3]) - 63.0) < 1e-4, 'Tip R1 should be 63.0'


        print(f'[+] Console errors: {len(console_errors)}')
        assert len(console_errors) == 0, f'Console errors detected: {console_errors}'


        screenshot_path = os.path.join(base_dir, 'docs', 'section20_coordinates_table.png')
        page.locator('#section20').screenshot(path=screenshot_path)
        print(f'[+] Saved Section 20 screenshot to: {screenshot_path}')

        browser.close()

    print('=' * 80)
    print('>>> ALL SECTION 20.0 TESTS PASSED 100%!')
    print('=' * 80)

if __name__ == '__main__':
    test_section20()
