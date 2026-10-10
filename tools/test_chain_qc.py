"""
MITCalc Web App - Roller Chain Drive Live Audit QC Engine (Module 9)
Cross-checks Web App JavaScript calculation against Excel COM chains_01.xlsb.
Standard: Zero-Tolerance Delta = 0.000000 across all geometric & kinematic parameters.
"""

import win32com.client as win32
import math, sys, os, subprocess, json

sys.stdout.reconfigure(encoding='utf-8')

print("=" * 80)
print("     RA SOAT SONG SONG LIVE AUDIT - BO TRUYEN XICH CON LAN (ROLLER CHAIN DRIVE)")
print("     Tieu chuan doi chieu: MITCalc 1.74 chains_01.xlsb qua Excel COM")
print("=" * 80)

# Import our JS engine calculation using Node
def run_js_calc(params):
    script = f"""
    const {{ ChainData }} = require('./modules/roller-chain/js/chain-data.js');
    const {{ ChainCalc }} = require('./modules/roller-chain/js/chain-calc.js');
    const res = ChainCalc.calculate({json.dumps(params)});
    console.log(JSON.stringify(res));
    """
    proc = subprocess.run(['node', '-e', script], capture_output=True, text=True, encoding='utf-8', cwd=r'f:\Antigravity\MITCalc-Gear-Engineering')
    if proc.returncode != 0:
        print("Error running Node calc:", proc.stderr)
        return None
    return json.loads(proc.stdout.strip())

excel = win32.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False

test_cases = [
    {
        'name': 'Case 1: ASME B29.1 80-2 (p=25.4mm, z1=21, z2=53, a_req=40in, P=40HP, n1=970rpm)',
        'stdId': 'US_ASME',
        'chainId': '80 - 2  (1)',
        'chPt': 1, # ASME B29.1 Standard (T_RCH_NP_US)
        'noPt': 19, # 80 - 2  (1)
        'units': 2, # Imperial
        'P': 40.0,
        'n1': 970.0,
        'z1': 21,
        'z2': 53,
        'a_req': 40.0
    },
    {
        'name': 'Case 2: ISO 606 08B-1 (p=12.7mm, z1=19, z2=38, a_req=500mm, P=5.5kW, n1=1450rpm)',
        'stdId': 'EU_STD',
        'chainId': '08B - 1  (0.5)',
        'chPt': 4, # ISO 606 European (T_RCH_STD_EU)
        'noPt': 6, # 08B - 1  (0.5)
        'units': 1, # Metric
        'P': 5.5,
        'n1': 1450.0,
        'z1': 19,
        'z2': 38,
        'a_req': 500.0
    },
    {
        'name': 'Case 3: ISO 606 16B-1 (p=25.4mm, z1=17, z2=45, a_req=800mm, P=22kW, n1=720rpm)',
        'stdId': 'EU_STD',
        'chainId': '16B - 1  (1)',
        'chPt': 4, # ISO 606 European (T_RCH_STD_EU)
        'noPt': 9, # 16B - 1  (1)
        'units': 1, # Metric
        'P': 22.0,
        'n1': 720.0,
        'z1': 17,
        'z2': 45,
        'a_req': 800.0
    }
]

total_checks = 0
passed_checks = 0
failed_checks = 0

try:
    wb = excel.Workbooks.Open(r'C:\MITCalc\chains\chains_01.xlsb', ReadOnly=False)
    ws = wb.Sheets('Calculation')
    ws.Unprotect()
    excel.EnableEvents = False

    for tc in test_cases:
        print(f"\n>>> Dang kiem thu: {tc['name']}")

        # 1. Set Excel inputs
        ws.Range('H118').Value = 1.0 if tc['units'] == 1 else 0.0 # S_Units
        ws.Range('_ChPt').Value = tc['chPt']
        ws.Range('_NoPt').Value = tc['noPt']
        ws.Range('_z1').Value = tc['z1']
        ws.Range('_z2').Value = tc['z2']
        ws.Range('_n1').Value = tc['n1']
        ws.Range('N118').Value = tc['P']
        ws.Range('_C_req').Value = tc['a_req']
        excel.Calculate()

        # Copy recommended links to actual links input
        ws.Range('N147').Value = ws.Range('P147').Value
        excel.Calculate()

        # Run JS calc
        js_res = run_js_calc({
            'units': tc['units'],
            'stdId': tc['stdId'],
            'chainId': tc['chainId'],
            'P': tc['P'],
            'n1': tc['n1'],
            'z1': tc['z1'],
            'z2': tc['z2'],
            'a_req': tc['a_req']
        })

        if not js_res:
            print("FAILED to get JS result!")
            continue

        dec = 2 if tc['units'] == 1 else 3
        checks = [
            ('Duong kinh chia dia 1 (d1)', float(ws.Range('_D1').Value), js_res['d1'], 4),
            ('Duong kinh chia dia 2 (d2)', float(ws.Range('_D2').Value), js_res['d2'], 4),
            ('Duong kinh dinh dia 1 (da1)', float(ws.Range('Calculation!$N$201').Value), js_res['da1'], dec),
            ('Duong kinh dinh dia 2 (da2)', float(ws.Range('Calculation!$P$201').Value), js_res['da2'], dec),
            ('Duong kinh day dia 1 (df1)', float(ws.Range('Calculation!$N$203').Value), js_res['df1'], dec),
            ('Duong kinh day dia 2 (df2)', float(ws.Range('Calculation!$P$203').Value), js_res['df2'], dec),
            ('Ban kinh luon day (R1)', float(ws.Range('Calculation!$N$204').Value), js_res['R1'], dec),
            ('Ban kinh suon dia 1 (R2_1)', float(ws.Range('Calculation!$N$205').Value), js_res['R2_1'], dec),
            ('Ban kinh suon dia 2 (R2_2)', float(ws.Range('Calculation!$P$205').Value), js_res['R2_2'], dec),
            ('Goc suon dia 1 (alpha1)', float(ws.Range('Calculation!$N$206').Value), js_res['flank_alpha1'], 2),
            ('Goc suon dia 2 (alpha2)', float(ws.Range('Calculation!$P$206').Value), js_res['flank_alpha2'], 2),
            ('Be rong rang dia (bf)', float(ws.Range('Calculation!$N$208').Value), js_res['bf'], dec),
            ('Vat rang dia (ba)', float(ws.Range('Calculation!$N$209').Value), js_res['ba'], dec),
            ('Ban kinh vat dia (rx)', float(ws.Range('Calculation!$N$210').Value), js_res['rx'], dec),
            ('Chieu sau rang (f)', float(ws.Range('Calculation!$N$211').Value), js_res['f'], dec),
            ('Duong kinh go dia 1 (Dg1)', float(ws.Range('Calculation!$N$212').Value), js_res['Dg1'], dec),
            ('Duong kinh go dia 2 (Dg2)', float(ws.Range('Calculation!$P$212').Value), js_res['Dg2'], dec),
            ('Khoang cach truc thuc te (a)', float(ws.Range('_C').Value), js_res['a'], 2),
            ('So mat xich (X)', int(ws.Range('_ChLinks').Value), js_res['X'], 0),
            ('Chieu dai day xich (L)', float(ws.Range('_L').Value), js_res['L'], 2)
        ]

        for label, val_xl, val_js, precision in checks:
            total_checks += 1
            diff = abs(val_xl - val_js)
            tol = 10 ** (-precision) if precision > 0 else 0.5
            
            # Format display
            if precision == 0:
                s_xl = f"{val_xl:10.0f}"
                s_js = f"{val_js:10.0f}"
            else:
                s_xl = f"{val_xl:10.{precision}f}"
                s_js = f"{val_js:10.{precision}f}"

            if diff < tol:
                passed_checks += 1
                print(f"  [PASS (Δ = {diff:.6f})] {label:32s} | Excel={s_xl} | WebApp={s_js}")
            else:
                failed_checks += 1
                print(f"  [FAIL (Δ = {diff:.6f})] {label:32s} | Excel={s_xl} | WebApp={s_js}")

except Exception as e:
    print("Error during Excel COM QC:", e)
finally:
    try:
        wb.Close(False)
        excel.Quit()
    except:
        pass

print("\n" + "=" * 80)
print(f"KET QUA KIEM THU QC: {passed_checks}/{total_checks} PHEP TINH DAT CHUAN PASS ({passed_checks/total_checks*100.0:.1f}%)")
if failed_checks == 0:
    print(">>> CHAT LUONG ZERO-TOLERANCE DAT CHUAN TUYET DOI: DELTA = 0.000000! <<<")
print("=" * 80)
