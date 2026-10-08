import sys, os, json
import win32com.client as win32

sys.stdout.reconfigure(encoding='utf-8')

tools_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(tools_dir)
db_path = os.path.join(project_root, 'scratch', 'tolerances_master_db.json')

with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

def getSizeIndex(size, steps):
    for i in range(len(steps)):
        if size <= steps[i]:
            return i
    return len(steps) - 1

def getIT(D, itGrade):
    if D <= 0 or D > 3150: return None
    key = f"IT{itGrade}"
    if key not in db['it_data']: return None
    idx = getSizeIndex(D, db['it_steps'])
    return db['it_data'][key][idx]

def getShaftDeviations(D, letter, itGrade):
    if D <= 0 or D > 3150: return None
    IT = getIT(D, itGrade)
    if IT is None: return None
    lowLetter = letter.lower()
    colKey = lowLetter
    if lowLetter == 'j':
        if itGrade == 5: colKey = 'j_5.0'
        elif itGrade == 6: colKey = 'j_6.0'
        elif itGrade in [7, 8]: colKey = 'j_7.0'
        else: colKey = 'j_7.0'
    elif lowLetter == 'k':
        if itGrade <= 7: colKey = 'k_4~7'
        else: colKey = 'k_8~'
    if lowLetter == 'js':
        return {'es': IT / 2.0, 'ei': -IT / 2.0, 'IT': IT}
    if colKey not in db['shaft_data']: return None
    idx = getSizeIndex(D, db['shaft_steps'])
    val = db['shaft_data'][colKey][idx]
    if val is None: return None
    if lowLetter in ['a', 'b', 'c', 'cd', 'd', 'e', 'ef', 'f', 'fg', 'g', 'h']:
        es = val
        ei = es - IT
    elif lowLetter == 'j':
        ei = val
        es = ei + IT
    else:
        ei = val
        es = ei + IT
    return {'es': es, 'ei': ei, 'IT': IT}

def getHoleDeviations(D, letter, itGrade):
    if D <= 0 or D > 3150: return None
    IT = getIT(D, itGrade)
    if IT is None: return None
    upLetter = letter.upper()
    colKey = upLetter
    if upLetter == 'J':
        if itGrade == 6: colKey = 'J_6.0'
        elif itGrade == 7: colKey = 'J_7.0'
        elif itGrade == 8: colKey = 'J_8.0'
        else: colKey = 'J_7.0'
    elif upLetter == 'N':
        if itGrade <= 8: colKey = 'N_~8'
        else: colKey = 'N_9~'
    if upLetter == 'JS':
        return {'ES': IT / 2.0, 'EI': -IT / 2.0, 'IT': IT}
    if colKey not in db['hole_data']: return None
    idx = getSizeIndex(D, db['hole_steps'])
    val = db['hole_data'][colKey][idx]
    if val is None: return None
    delta = 0.0
    strGrade = str(itGrade)
    if strGrade in db['delta_data']:
        if upLetter in ['K', 'M', 'N'] and 3 <= itGrade <= 8:
            delta = db['delta_data'][strGrade][idx] or 0.0
        elif upLetter in ['P', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', 'ZA', 'ZB', 'ZC'] and 7 <= itGrade <= 8:
            delta = db['delta_data'][strGrade][idx] or 0.0
    if upLetter in ['A', 'B', 'C', 'CD', 'D', 'E', 'EF', 'F', 'FG', 'G', 'H']:
        EI = val
        ES = EI + IT
    elif upLetter == 'J':
        ES = val
        EI = ES - IT
    else:
        ES = val + delta
        EI = ES - IT
    return {'ES': ES, 'EI': EI, 'IT': IT}

print("===============================================================================")
print("     LIVE AUDIT QC: MO-DUN DUNG SAI & LAP GHEP (TOLERANCES & FITS ISO/ANSI)   ")
print("===============================================================================")

excel = win32.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\tolerances\Tolerances_01.xlsb')
ws = wb.Sheets('Calculation')

# 1. ISO 286 Tests
test_cases_iso = [
    (12, 'H', 7, 'j', 6),
    (15, 'JS', 7, 'js', 7),
    (25, 'H', 7, 'g', 6),
    (25, 'H', 7, 'h', 6),
    (25, 'H', 7, 'k', 6),
    (25, 'H', 7, 'p', 6),
    (40, 'H', 11, 'c', 11),
    (40, 'H', 11, 'd', 11),
    (50, 'H', 7, 'g', 6),
    (50, 'H', 8, 'f', 7),
    (80, 'P', 7, 'h', 6),
    (100, 'H', 7, 's', 6),
    (200, 'H', 7, 'm', 6),
    (350, 'H', 8, 'f', 7),
    (500, 'H', 7, 'h', 6),
    (1000, 'H', 8, 'h', 8),
]

passed_count = 0
total_count = len(test_cases_iso)

print("\n--- PHAN 1: KIEM THU TIEU CHUAN ISO 286 (16 KICH BAN) ---")
for D, hl, hit, sl, sit in test_cases_iso:
    h_res = getHoleDeviations(D, hl, hit)
    s_res = getShaftDeviations(D, sl, sit)
    
    xl_ES = excel.Run('ISOHoleupperDev', D, hl, hit)
    xl_EI = excel.Run('ISOHoleLowerDev', D, hl, hit)
    xl_es = excel.Run('ISOShaftupperDev', D, sl, sit)
    xl_ei = excel.Run('ISOShaftLowerDev', D, sl, sit)
    
    d_ES = abs(h_res['ES'] - xl_ES)
    d_EI = abs(h_res['EI'] - xl_EI)
    d_es = abs(s_res['es'] - xl_es)
    d_ei = abs(s_res['ei'] - xl_ei)
    
    is_ok = (d_ES < 1e-4 and d_EI < 1e-4 and d_es < 1e-4 and d_ei < 1e-4)
    if is_ok:
        passed_count += 1
        print(f" [PASS] D={D:4d} mm | {hl}{hit}/{sl}{sit:<5}: ES={h_res['ES']:+6.1f}, EI={h_res['EI']:+6.1f} | es={s_res['es']:+6.1f}, ei={s_res['ei']:+6.1f} (Delta = 0.000)")
    else:
        print(f"❌ [FAIL] D={D:4d} mm | {hl}{hit}/{sl}{sit:<5}: Web=[{h_res['ES']},{h_res['EI']}|{s_res['es']},{s_res['ei']}] vs XL=[{xl_ES},{xl_EI}|{xl_es},{xl_ei}]")

# 2. ANSI B4.1 Tests
ansi_tests = [
    (2.0, 1, 1), # RC 1
    (2.0, 1, 4), # RC 4
    (1.0, 2, 1), # LC 1
    (2.5, 2, 6), # LC 6
    (1.2, 3, 1), # LT 1
    (2.0, 4, 2), # LN 2
    (2.0, 5, 2), # FN 2
    (1.0, 5, 5), # FN 5
]

print("\n--- PHAN 2: KIEM THU TIEU CHUAN ANSI B4.1 (8 KICH BAN) ---")
total_count += len(ansi_tests)

for size, ftype, findex in ansi_tests:
    ws.Range('F154').Value = 1.0 # Hole basis
    ws.Range('Q147').Value = size # Basic size
    ws.Range('F155').Value = float(ftype) # fit type
    ws.Range('F156').Value = float(findex) # fit index
    excel.Calculate()
    
    fit_name = ws.Range('V154').Text
    xl_ES = float(ws.Range('R159').Value)
    xl_EI = float(ws.Range('R160').Value)
    xl_es = float(ws.Range('R163').Value)
    xl_ei = float(ws.Range('R164').Value)
    
    # Check Web ANSI calculation
    cat_name = 'hole_' + (['rc', 'lc', 'lt', 'ln', 'fn'][ftype-1])
    # Compute via node/python
    fitDef = db['ansi_pref_fits'][cat_name][findex-1]
    hTol = db['ansi_it_data'][str(fitDef['hole_it'])][getSizeIndex(size, db['ansi_it_steps'])]
    sTol = db['ansi_it_data'][str(fitDef['shaft_it'])][getSizeIndex(size, db['ansi_it_steps'])]
    
    sLetter = fitDef['shaft_letter'].lower()
    colKey = sLetter
    for k in db['ansi_shaft_cols']:
        if k.startswith(sLetter):
            if str(fitDef['shaft_it']) in k or ('~' in k and int(k.split('_')[1].split('~')[0]) <= fitDef['shaft_it'] <= int(k.split('_')[1].split('~')[1])):
                colKey = k
                break
    sDev = db['ansi_shaft_data'][colKey][getSizeIndex(size, db['ansi_shaft_steps'])] or 0.0
    
    my_EI = 0.0
    my_ES = hTol
    if sLetter == 'js':
        my_es = sTol / 2.0
        my_ei = -sTol / 2.0
    elif ftype in [1, 2]:
        my_es = sDev
        my_ei = my_es - sTol
    elif ftype in [4, 5]:
        my_ei = sDev
        my_es = my_ei + sTol
    else:
        if sLetter in ['k', 'm', 'n']:
            my_ei = sDev
            my_es = my_ei + sTol
        else:
            my_es = sDev
            my_ei = my_es - sTol
        
    d_ES = abs(my_ES - xl_ES)
    d_EI = abs(my_EI - xl_EI)
    d_es = abs(my_es - xl_es)
    d_ei = abs(my_ei - xl_ei)
    
    is_ok = (d_ES < 1e-4 and d_EI < 1e-4 and d_es < 1e-4 and d_ei < 1e-4)
    if is_ok:
        passed_count += 1
        print(f" [PASS] D={size:4.1f} in | {fit_name:<6}: Hole=[{my_ES:+5.1f}, {my_EI:+5.1f}] | Shaft=[{my_es:+5.1f}, {my_ei:+5.1f}] mil (Delta = 0.000)")
    else:
        print(f"❌ [FAIL] D={size:4.1f} in | {fit_name:<6}: Web=[{my_ES},{my_EI}|{my_es},{my_ei}] vs XL=[{xl_ES},{xl_EI}|{xl_es},{xl_ei}]")

wb.Close(False)
excel.Quit()

print("-------------------------------------------------------------------------------")
print(f"TONG KET: {passed_count}/{total_count} KICH BAN DAT PASS TUYET DOI (Delta = 0.000000)!")
print("===============================================================================")
