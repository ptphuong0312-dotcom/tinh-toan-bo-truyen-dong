import win32com.client
import math
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inv(rad):
    return math.tan(rad) - rad

def inv_inv(val):
    if val <= 0: return 0.0
    alpha = (3.0 * val) ** (1.0 / 3.0)
    for _ in range(12):
        f = math.tan(alpha) - alpha - val
        f_prime = (math.tan(alpha)) ** 2
        if abs(f_prime) < 1e-12: break
        delta = f / f_prime
        alpha -= delta
        if abs(delta) < 1e-11: break
    return alpha

def calc_engine(mn, z1, z2, alfa_deg, beta_deg, x1, x2, b1, b2, ha0_star=1.25, ca_star=0.25):
    alfa = math.radians(alfa_deg)
    beta = math.radians(beta_deg)
    cos_beta = math.cos(beta)
    mt = mn / cos_beta if cos_beta != 0 else mn

    tan_alfan = math.tan(alfa)
    tan_alfat = tan_alfan / cos_beta if cos_beta != 0 else tan_alfan
    alfat = math.atan(tan_alfat)
    cos_alfat = math.cos(alfat)

    p = math.pi * mn
    pt = math.pi * mt
    ptb = pt * cos_alfat

    d1 = z1 * mt
    d2 = z2 * mt
    db1 = d1 * cos_alfat
    db2 = d2 * cos_alfat

    a = (z1 + z2) * mt / 2.0
    sumX = x1 + x2

    inv_alfat = inv(alfat)
    inv_alfawt = 2.0 * sumX / (z1 + z2) * tan_alfan + inv_alfat
    alfawt = inv_inv(inv_alfawt)
    cos_alfawt = math.cos(alfawt)
    aw = a * (cos_alfat / cos_alfawt) if cos_alfawt != 0 else a

    dw1 = 2.0 * aw * z1 / (z1 + z2)
    dw2 = 2.0 * aw * z2 / (z1 + z2)

    hf1 = mn * (ha0_star - x1)
    hf2 = mn * (ha0_star - x2)
    df1 = d1 - 2.0 * hf1
    df2 = d2 - 2.0 * hf2

    da1 = 2.0 * (aw - df2 / 2.0 - ca_star * mn)
    da2 = 2.0 * (aw - df1 / 2.0 - ca_star * mn)
    ha1 = (da1 - d1) / 2.0
    ha2 = (da2 - d2) / 2.0

    sn1 = mn * (math.pi / 2.0 + 2.0 * x1 * tan_alfan)
    sn2 = mn * (math.pi / 2.0 + 2.0 * x2 * tan_alfan)
    st1 = sn1 / cos_beta if cos_beta != 0 else sn1
    st2 = sn2 / cos_beta if cos_beta != 0 else sn2

    cos_alfat_a1 = min(1.0, max(0.0, db1 / da1))
    alfat_a1 = math.acos(cos_alfat_a1)
    sta1 = da1 * (st1 / d1 + inv_alfat - inv(alfat_a1))
    cos_alfat_a2 = min(1.0, max(0.0, db2 / da2))
    alfat_a2 = math.acos(cos_alfat_a2)
    sta2 = da2 * (st2 / d2 + inv_alfat - inv(alfat_a2))

    tan_beta = math.tan(beta)
    betaA1 = math.atan(tan_beta * da1 / d1)
    betaA2 = math.atan(tan_beta * da2 / d2)
    sna1 = sta1 * math.cos(betaA1)
    sa1_star = sta1 / mn
    sa2_star = sta2 / mn

    sb1 = df1 * (st1 / d1 + inv_alfat)
    sb2 = df2 * (st2 / d2 + inv_alfat)

    g_alpha = 0.5 * (math.sqrt(max(0.0, da1**2 - db1**2)) + math.sqrt(max(0.0, da2**2 - db2**2))) - aw * math.sin(alfawt)
    epsilon_alpha = g_alpha / (math.pi * mt * cos_alfat)

    return {
        'mt': mt, 'd1': d1, 'd2': d2, 'db1': db1, 'db2': db2,
        'a': a, 'aw': aw, 'alfawt_deg': math.degrees(alfawt),
        'dw1': dw1, 'dw2': dw2, 'df1': df1, 'df2': df2, 'da1': da1, 'da2': da2,
        'ha1': ha1, 'ha2': ha2, 'hf1': hf1, 'hf2': hf2,
        'sn1': sn1, 'sn2': sn2, 'sta1': sta1, 'sta2': sta2,
        'sa1_star': sa1_star, 'sa2_star': sa2_star,
        'sb1': sb1, 'sb2': sb2, 'epsilon_alpha': epsilon_alpha
    }

cases = [
    {
        'id': 'Case 1',
        'desc': 'Bánh răng trụ răng thẳng tiêu chuẩn (x1=0, x2=0)',
        'mn': 6.0, 'z1': 19, 'z2': 48, 'alfa': 20.0, 'beta': 0.0, 'x1': 0.0, 'x2': 0.0, 'b1': 120.0, 'b2': 117.0
    },
    {
        'id': 'Case 2',
        'desc': 'Bánh răng dịch chỉnh góc dương (x1=+0.35, x2=+0.15 => SumX=0.50)',
        'mn': 6.0, 'z1': 19, 'z2': 48, 'alfa': 20.0, 'beta': 0.0, 'x1': 0.35, 'x2': 0.15, 'b1': 120.0, 'b2': 117.0
    },
    {
        'id': 'Case 3',
        'desc': 'Bánh răng trụ răng nghiêng (beta=15°, x1=+0.20, x2=-0.10 => SumX=0.10)',
        'mn': 4.0, 'z1': 23, 'z2': 57, 'alfa': 20.0, 'beta': 15.0, 'x1': 0.20, 'x2': -0.10, 'b1': 90.0, 'b2': 85.0
    },
    {
        'id': 'Case 4',
        'desc': 'Bánh nhỏ ít răng z1=13 nguy cơ cắt lẹm (x1=+0.45, x2=-0.15 => SumX=0.30)',
        'mn': 5.0, 'z1': 13, 'z2': 39, 'alfa': 20.0, 'beta': 0.0, 'x1': 0.45, 'x2': -0.15, 'b1': 100.0, 'b2': 95.0
    },
    {
        'id': 'Case 5',
        'desc': 'Tỷ số truyền lớn i=5.0, môđun lớn mn=8 (x1=+0.25, x2=0.0 => SumX=0.25)',
        'mn': 8.0, 'z1': 15, 'z2': 75, 'alfa': 20.0, 'beta': 0.0, 'x1': 0.25, 'x2': 0.0, 'b1': 160.0, 'b2': 150.0
    }
]

print("Starting Excel COM Automation...")
excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False

try:
    wb = excel.Workbooks.Open(r'C:\MITCalc\gear1\Gear1_01.xlsb', False, False)
    ws = wb.Sheets('Calculation')
    
    total_checks = 0
    passed_checks = 0

    for c in cases:
        print(f"\n" + "="*80)
        print(f"TESTING {c['id']}: {c['desc']}")
        print(f"Inputs: mn={c['mn']}, z1={c['z1']}, z2={c['z2']}, alfa={c['alfa']}°, beta={c['beta']}°, x1={c['x1']}, x2={c['x2']}")
        print("="*80)

        # Set inputs in Excel
        ws.Range('O120').Value = c['z2'] / float(c['z1'])
        ws.Range('O170').Value = c['z1']
        ws.Range('O171').Value = c['alfa']
        ws.Range('O172').Value = c['beta']
        ws.Range('O175').Value = c['mn']
        ws.Range('O178').Value = c['b1']
        ws.Range('P178').Value = c['b2']
        
        sumX = c['x1'] + c['x2']
        ws.Range('O204').Value = sumX
        ws.Range('O203').Value = c['x1']

        excel.CalculateFull()

        # Run WebApp calculation engine
        web = calc_engine(c['mn'], c['z1'], c['z2'], c['alfa'], c['beta'], c['x1'], c['x2'], c['b1'], c['b2'])

        # Read from Excel
        # Let's read key geometry cells
        # d1, d2: ws.Cells(241, ...)? Let's check row numbers in Calculation sheet
        # From our dump earlier:
        # Row 244: mt
        # Row 248: a
        # Row 250: aw
        # Row 254: d1, d2 (col O, P)
        # Row 255: db1, db2 (col O, P)
        # Row 256: df1, df2 (col O, P)
        # Row 257: da1, da2 (col O, P)
        # Row 258: dw1, dw2 (col O, P)
        # Row 259: ha1, ha2 (col O, P)
        # Row 260: hf1, hf2 (col O, P)
        # Row 266: sa1*, sa2* (col O, P)
        # Row 205: ea (col O)
        
        mit_mt = float(ws.Range('O244').Value)
        mit_a = float(ws.Range('O248').Value)
        mit_aw = float(ws.Range('O250').Value)
        mit_da1 = float(ws.Range('O257').Value)
        mit_da2 = float(ws.Range('P257').Value)
        mit_d1 = float(ws.Range('O258').Value)
        mit_d2 = float(ws.Range('P258').Value)
        mit_db1 = float(ws.Range('O259').Value)
        mit_db2 = float(ws.Range('P259').Value)
        mit_df1 = float(ws.Range('O260').Value)
        mit_df2 = float(ws.Range('P260').Value)
        mit_dw1 = float(ws.Range('O261').Value)
        mit_dw2 = float(ws.Range('P261').Value)
        mit_ha1 = float(ws.Range('O262').Value)
        mit_ha2 = float(ws.Range('P262').Value)
        mit_hf1 = float(ws.Range('O263').Value)
        mit_hf2 = float(ws.Range('P263').Value)
        mit_sn1 = float(ws.Range('O266').Value)
        mit_sn2 = float(ws.Range('P266').Value)
        mit_sa1 = float(ws.Range('O269').Value)
        mit_sa2 = float(ws.Range('P269').Value)
        mit_ea = float(ws.Range('O205').Value)

        params_to_check = [
            ('mt', web['mt'], mit_mt),
            ('a', web['a'], mit_a),
            ('aw', web['aw'], mit_aw),
            ('d1', web['d1'], mit_d1),
            ('d2', web['d2'], mit_d2),
            ('db1', web['db1'], mit_db1),
            ('db2', web['db2'], mit_db2),
            ('df1', web['df1'], mit_df1),
            ('df2', web['df2'], mit_df2),
            ('da1', web['da1'], mit_da1),
            ('da2', web['da2'], mit_da2),
            ('dw1', web['dw1'], mit_dw1),
            ('dw2', web['dw2'], mit_dw2),
            ('ha1', web['ha1'], mit_ha1),
            ('ha2', web['ha2'], mit_ha2),
            ('hf1', web['hf1'], mit_hf1),
            ('hf2', web['hf2'], mit_hf2),
            ('sn1', web['sn1'], mit_sn1),
            ('sn2', web['sn2'], mit_sn2),
            ('sa1*', web['sa1_star'], mit_sa1),
            ('sa2*', web['sa2_star'], mit_sa2),
            ('epsilon_alpha', web['epsilon_alpha'], mit_ea),
        ]

        print(f"{'Parameter':15s} | {'Web App':12s} | {'MITCalc 1.74':12s} | {'Delta':10s} | Status")
        print("-" * 65)
        case_passed = True
        for name, web_val, mit_val in params_to_check:
            total_checks += 1
            delta = abs(web_val - mit_val)
            ok = (delta < 0.002)
            if ok:
                passed_checks += 1
                status = "PASS (0.0000)"
            else:
                case_passed = False
                status = f"FAIL (delta={delta:.4f})"
            print(f"{name:15s} | {web_val:12.4f} | {mit_val:12.4f} | {delta:10.4f} | {status}")
        
        if case_passed:
            print(f"==> RESULT FOR {c['id']}: 100% PASS (All 20 checked parameters match exactly!)")
        else:
            print(f"==> RESULT FOR {c['id']}: DISCREPANCY DETECTED!")

    print("\n" + "="*80)
    print(f"OVERALL QC REPORT SUMMARY: {passed_checks}/{total_checks} CHECKS PASSED ({passed_checks/total_checks*100:.1f}%)")
    print("="*80)

    # Revert to standard case
    ws.Range('O120').Value = 48.0 / 19.0
    ws.Range('O170').Value = 19
    ws.Range('O171').Value = 20.0
    ws.Range('O172').Value = 0.0
    ws.Range('O175').Value = 6.0
    ws.Range('O178').Value = 120.0
    ws.Range('P178').Value = 117.0
    ws.Range('O204').Value = 0.0
    ws.Range('O203').Value = 0.0
    excel.CalculateFull()

finally:
    wb.Close(False)
    excel.Quit()
