import os
import sys
import subprocess
import json
import win32com.client as win32

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def log(msg):
    print(msg, flush=True)

def verify_mitcalc_tooth_profile():
    log('=' * 80)
    log('[+] VERIFYING 1-TO-1 MITCALC 1.74 TOOTH PROFILE SOLVER (ZERO-TOLERANCE QC)')
    log('=' * 80)

    log('[1] Fetching reference coordinates from MITCalc 1.74 (Gear1_01.xlsb)...')
    excel = win32.Dispatch('Excel.Application')
    excel.Visible = False
    wb = excel.Workbooks.Open(r"C:\MITCalc\gear1\Gear1_01.xlsb")
    excel.Run('Gear1_01.xlsb!FillCoordinates')
    ws_coord = wb.Sheets('Coordinates')

    pinion_ref = []
    gear_ref = []
    for idx in range(1, 121):
        r = idx + 5
        px = float(ws_coord.Cells(r, 3).Value)
        py = float(ws_coord.Cells(r, 4).Value)
        gx = float(ws_coord.Cells(r, 5).Value)
        gy = float(ws_coord.Cells(r, 6).Value)
        pinion_ref.append({'id': idx, 'x': px, 'y': py})
        gear_ref.append({'id': idx, 'x': gx, 'y': gy})

    wb.Close(False)
    excel.Quit()
    log('[+] Read 120 reference points for Pinion 1 and 120 for Gaar 2 from Excel.')

    log('[2] Computing tooth profile coordinates via Playwright browser context...')
    from playwright.sync_api import sync_playwright
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_url = 'file:///' + os.path.join(base_dir, 'modules', 'spur-gear', 'index.html').replace("\\", "/")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(html_url)

        js_eval = """() => {
            const pPts = window.MitcalcToothSolver.calculateToothCoordinates({
                id: 1, z: 19.0, mn: 6.0, alfa_n: 20.0, beta: 0.0, x: 0.0,
                d: 114.0, db: 107.12495876959356, da: 126.00000336609281, df: 99.0,
                ha0: 1.25, hf0: 1.0, ra0: 0.38, rf0: 0.0, noPtHead: 20, noPtEv: 100, cuttStep: 0.5
            });

            const gPts = window.MitcalcToothSolver.calculateToothCoordinates({
                id: 2, z: 48.0, mn: 6.0, alfa_n: 20.0, beta: 0.0, x: 0.0,
                d: 288.0, db: 270.63147478634164, da: 300.0000033660928, df: 273.0,
                ha0: 1.25, hf0: 1.0, ra0: 0.38, rf0: 0.0, noPtHead: 20, noPtEv: 100, cuttStep: 0.5
            });

            return { pinion: pPts, gear: gPts };
        }"""
        js_data = page.evaluate(js_eval)
        browser.close()

    p_js = js_data['pinion']
    g_js = js_data['gear']

    log('[3] Comparing Pinion 1 (z=19, mn=6, beta=0, x=0)...')
    max_p_dx = 0.0
    max_p_dy = 0.0
    for i in range(120):
        ref = pinion_ref[i]
        calc = p_js[i]
        dx = abs(calc['x'] - ref['x'])
        dy = abs(calc['y'] - ref['y'])
        if dx > max_p_dx: max_p_dx = dx
        if dy > max_p_dy: max_p_dy = dy

    log(f'  [+] Pinion Max Delta X: {max_p_dx:.12f} mm')
    log(f'  [+] Pinion Max Delta Y: {max_p_dy:.12f} mm')
    assert max_p_dx < 1e-6 and max_p_dy < 1e-6, 'Pinion error too high'
    log('  ==> PINION 1: 100% PASS (Delta = 0.000000 mm)!')

    log('[4] Comparing Gear 2 (z=48, mn=6, beta=0, x=0)...')
    max_g_dx = 0.0
    max_g_dy = 0.0
    for i in range(120):
        ref = gear_ref[i]
        calc = g_js[i]
        dx = abs(calc['x'] - ref['x'])
        dy = abs(calc['y'] - ref['y'])
        if dx > max_g_dx: max_g_dx = dx
        if dy > max_g_dy: max_g_dy = dy

    log(f'  [+] Gear Max Delta X: {max_g_dx:.12f} mm')
    log(f'  [+] Gear Max Delta Y: {max_g_dy:.12f} mm')
    assert max_g_dx < 1e-6 and max_g_dy < 1e-6, 'Gear error too high'
    log('  ==> GEAR 2: 100% PASS (Delta = 0.000000 mm)!')

    log('=' * 80)
    log('>>> ALL 240 TOOTH PROFILE COORDINATE CHECKS PASSED WITH DELTA = 0.000000 mm!')
    log('=' * 80)

if __name__ == '__main__':
    verify_mitcalc_tooth_profile()
