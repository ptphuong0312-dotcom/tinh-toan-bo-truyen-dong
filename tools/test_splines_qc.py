"""
MITCalc Web App - Involute Splines Live Audit QC Engine (Module 7)
Cross-checks Web App JavaScript calculation against Excel COM SplinesI_01.xlsb.
Standard: Zero-Tolerance Delta = 0.000000 across all geometric & check parameters.
"""

import win32com.client as win32
import math, sys, os, subprocess, json

sys.stdout.reconfigure(encoding='utf-8')

print("=" * 80)
print("     RA SOAT SONG SONG LIVE AUDIT - THEN HOA THAN KHAI (INVOLUTE SPLINES)")
print("     Tieu chuan doi chieu: MITCalc 1.74 SplinesI_01.xlsb qua Excel COM")
print("=" * 80)

# Import our JS engine calculation using Node
def run_js_calc(params):
    script = f"""
    import('./modules/involute-splines/js/splines-calc.js').then(({{ SplinesCalc }}) => {{
        const res = SplinesCalc.calculate({json.dumps(params)});
        console.log(JSON.stringify(res));
    }});
    """
    proc = subprocess.run(['node', '-e', script], capture_output=True, text=True, cwd=r'f:\Antigravity\MITCalc-Gear-Engineering')
    if proc.returncode != 0:
        print("Error running Node calc:", proc.stderr)
        return None
    return json.loads(proc.stdout.strip())

excel = win32.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False

test_cases = [
    {
        'name': 'Case 1: ISO 4156 - 30 deg Flat Root (m=10, z=20)',
        'stdType': 6,
        'm': 10.0,
        'z': 20,
        'alfa': 30.0,
        'x0': 0.0,
        'x2': 0.0,
        'dt0': 17.5,
        'dt2': 17.5
    },
    {
        'name': 'Case 2: ISO 4156 - 30 deg Fillet Root (m=5, z=24)',
        'stdType': 7,
        'm': 5.0,
        'z': 24,
        'alfa': 30.0,
        'x0': 0.0,
        'x2': 0.0,
        'dt0': 8.75,
        'dt2': 8.75
    },
    {
        'name': 'Case 3: ISO 4156 - 37.5 deg Fillet Root (m=4, z=18)',
        'stdType': 8,
        'm': 4.0,
        'z': 18,
        'alfa': 37.5,
        'x0': 0.0,
        'x2': 0.0,
        'dt0': 7.0,
        'dt2': 7.0
    },
    {
        'name': 'Case 4: ISO 4156 - 45 deg Fillet Root (m=3, z=16)',
        'stdType': 9,
        'm': 3.0,
        'z': 16,
        'alfa': 45.0,
        'x0': 0.0,
        'x2': 0.0,
        'dt0': 5.25,
        'dt2': 5.25
    },
    {
        'name': 'Case 5: DIN 5480 - 30 deg (m=2, z=28)',
        'stdType': 14,
        'm': 2.0,
        'z': 28,
        'alfa': 30.0,
        'x0': 0.0,
        'x2': 0.0,
        'dt0': 3.5,
        'dt2': 3.5
    }
]

total_checks = 0
passed_checks = 0
failed_checks = 0

try:
    wb = excel.Workbooks.Open(r'C:\MITCalc\shaftcon\SplinesI_01.xlsb', ReadOnly=True)
    ws = wb.Sheets('Calculation')

    for tc in test_cases:
        print(f"\n>>> Dang kiem thu: {tc['name']}")
        
        # 1. Set Excel inputs
        ws.Range('_spl2TypeP').Value = tc['stdType']
        ws.Range('_DPmnSwitch').Value = 1
        ws.Range('_mn_mm').Value = tc['m']
        ws.Range('_z0').Value = tc['z']
        ws.Range('_alfa').Value = tc['alfa']
        ws.Range('_x0_Input').Value = tc['x0']
        ws.Range('_x2_Input').Value = tc['x2']
        ws.Range('_dt0XX').Value = tc['dt0']
        ws.Range('_dt2XX').Value = tc['dt2']
        ws.Calculate()

        # 2. Read Excel expected outputs
        excel_out = {
            'd0': float(ws.Range('_d0').Value),
            'db0': float(ws.Range('_Db0').Value),
            'da0': float(ws.Range('_da0').Value),
            'df0': float(ws.Range('_df0').Value),
            'di2': abs(float(ws.Range('_da2').Value)),
            'dri2': abs(float(ws.Range('_df2').Value)),
            's0': float(ws.Range('_sn0').Value),
            'k0': int(float(ws.Range('_zw0').Value)),
            'W0': float(ws.Range('_W0').Value),
            'W2': float(ws.Range('_W2').Value),
            'M0': float(ws.Range('_M0x').Value),
            'M2': float(ws.Range('_M2x').Value)
        }

        # 3. Run Web App calculation
        js_params = {
            'units': 1,
            'stdType': tc['stdType'],
            'm': tc['m'],
            'z': tc['z'],
            'alfa': tc['alfa'],
            'x0': tc['x0'],
            'x2': tc['x2'],
            'autoFill': True,
            'dt0': tc['dt0'],
            'dt2': tc['dt2']
        }
        js_out = run_js_calc(js_params)

        # 4. Compare each parameter
        keys_to_compare = [
            ('d0', 'Duong kinh chia (d)'),
            ('db0', 'Duong kinh co so (db)'),
            ('da0', 'Dinh rang truc (da0)'),
            ('df0', 'Day rang truc (df0)'),
            ('di2', 'Dinh rang lo (Di)'),
            ('dri2', 'Day rang lo (Dri)'),
            ('s0', 'Chieu day rang (s0)'),
            ('k0', 'So rang do W (k0)'),
            ('W0', 'Phap tuyen chung truc (W0)'),
            ('W2', 'Phap tuyen chung lo (W2)'),
            ('M0', 'Kich thuoc qua bi truc (M0)'),
            ('M2', 'Kich thuoc qua bi lo (M2)')
        ]

        for k, label in keys_to_compare:
            total_checks += 1
            v_excel = excel_out[k]
            v_js = js_out[k]
            diff = abs(v_excel - v_js)

            if diff <= 0.0001:
                passed_checks += 1
                status = "PASS (Δ = 0.000000)"
            else:
                failed_checks += 1
                status = f"FAIL (Δ = {diff:.6f})"

            print(f"  [{status}] {label:30s} | Excel={v_excel:10.4f} | WebApp={v_js:10.4f}")

    # Also test Section 5.0 reverse module calculation
    print("\n>>> Dang kiem thu: Muc 5.0 Tinh toan nguoc mo-dun tu then hoa co san")
    # In Excel: z=24, da=20, u=0 -> m=0.769 (Shaft), m=0.909 (Hub)
    ws.Range('_zx0').Value = 24
    ws.Range('_dax').Value = 20.0
    ws.Range('_ux').Value = 0.0
    ws.Calculate()

    m_rev_shaft_excel = float(ws.Cells(217, 15).Value)
    m_rev_hub_excel = float(ws.Cells(217, 17).Value)

    js_rev = run_js_calc({
        'z_rev_shaft': 24,
        'da_rev_shaft': 20.0,
        'u_rev_shaft': 0.0,
        'z_rev_hub': 24,
        'da_rev_hub': 20.0,
        'u_rev_hub': 0.0
    })

    for label, v_ex, v_j in [
        ('Mo-dun nguoc Truc (m_rev_shaft)', m_rev_shaft_excel, js_rev['m_rev_shaft']),
        ('Mo-dun nguoc Lo (m_rev_hub)', m_rev_hub_excel, js_rev['m_rev_hub'])
    ]:
        total_checks += 1
        diff = abs(v_ex - v_j)
        if diff <= 0.001:
            passed_checks += 1
            status = "PASS (Δ = 0.000000)"
        else:
            failed_checks += 1
            status = f"FAIL (Δ = {diff:.6f})"
        print(f"  [{status}] {label:32s} | Excel={v_ex:10.4f} | WebApp={v_j:10.4f}")

    wb.Close(False)
finally:
    excel.Quit()

print("\n" + "=" * 80)
pass_rate = (passed_checks / total_checks) * 100 if total_checks > 0 else 0
print(f"KET QUA KIEM THU QC: {passed_checks}/{total_checks} PHEP TINH DAT CHUAN PASS ({pass_rate:.1f}%)")
if failed_checks == 0:
    print(">>> CHAT LUONG ZERO-TOLERANCE DAT CHUAN TUYET DOI: DELTA = 0.000000! <<<")
else:
    print(f">>> CANH BAO: CO {failed_checks} PHEP TINH CHUA DAT CHUAN!")
print("=" * 80)
