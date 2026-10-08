import win32com.client as win32
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

excel = win32.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False

db = {}

try:
    wb = excel.Workbooks.Open(r'C:\MITCalc\shaftcon\SplinesI_01.xlsb', ReadOnly=True)
    ws_tab = wb.Sheets('Tables')
    
    # 1. Module series
    modules = []
    for r in range(28, 44):
        val = ws_tab.Cells(r, 2).Value
        if val is not None:
            modules.append(float(val))
    db['modules'] = modules
    print(f'Extracted {len(modules)} standard modules: {modules}')
    
    # 2. DP series
    dp_series = []
    for r in range(8, 25):
        val = ws_tab.Cells(r, 2).Value
        desc = ws_tab.Cells(r, 3).Value
        if val is not None:
            dp_series.append({'P': float(val), 'desc': str(desc)})
    db['dp_series'] = dp_series
    print(f'Extracted {len(dp_series)} standard DP values')
    
    # 3. Standard types list (Row 64 to 80)
    std_types = []
    for r in range(64, 81):
        name = ws_tab.Cells(r, 2).Value
        type_code = ws_tab.Cells(r, 3).Value
        tab2_name = ws_tab.Cells(r, 5).Value
        pressure_ang = ws_tab.Cells(r, 8).Value
        if name:
            std_types.append({
                'id': r - 63,
                'name': str(name).strip(),
                'type_code': type_code,
                'tab2_name': str(tab2_name) if tab2_name else '',
                'pressure_ang': str(pressure_ang) if pressure_ang else ''
            })
    db['std_types'] = std_types
    print(f'Extracted {len(std_types)} standard spline types')
    
    # 4. DIN 5480 Table (Col AD = 30)
    # R84: Name, m, N, Dd, Sort, ID
    din5480 = []
    r = 85
    while ws_tab.Cells(r, 30).Value is not None:
        name = str(ws_tab.Cells(r, 30).Value).strip()
        m = float(ws_tab.Cells(r, 31).Value)
        z = int(float(ws_tab.Cells(r, 32).Value))
        db_ref = float(ws_tab.Cells(r, 33).Value)
        din5480.append({
            'name': name,
            'm': m,
            'z': z,
            'd_ref': db_ref
        })
        r += 1
    db['din5480'] = din5480
    print(f'Extracted {len(din5480)} DIN 5480 entries')
    
    # 5. ISO 4156 / ANSI B92.2M (Metric series)
    # Col R=18 (30 deg), Col V=22 (37.5 deg), Col Z=26 (45 deg)
    def extract_iso(col_idx, angle):
        items = []
        r = 85
        while ws_tab.Cells(r, col_idx).Value is not None:
            name = str(ws_tab.Cells(r, col_idx).Value).strip()
            m = float(ws_tab.Cells(r, col_idx + 1).Value)
            z = int(float(ws_tab.Cells(r, col_idx + 2).Value))
            items.append({
                'name': name,
                'm': m,
                'z': z,
                'angle': angle
            })
            r += 1
        return items
        
    db['iso4156_30'] = extract_iso(18, 30.0)
    print(f"Extracted {len(db['iso4156_30'])} ISO 4156 (30 deg) entries")
    
    db['iso4156_375'] = extract_iso(22, 37.5)
    print(f"Extracted {len(db['iso4156_375'])} ISO 4156 (37.5 deg) entries")
    
    db['iso4156_45'] = extract_iso(26, 45.0)
    print(f"Extracted {len(db['iso4156_45'])} ISO 4156 (45 deg) entries")
    
    # 6. ANSI B92.1 (Inch series)
    # Col B=2 (30 Flat Side), Col F=6 (30 Flat Major), Col J=10 (30/37.5 Fillet), Col N=14 (45 Fillet)
    def extract_ansi(col_idx, name_tag):
        items = []
        r = 85
        while ws_tab.Cells(r, col_idx).Value is not None:
            name = str(ws_tab.Cells(r, col_idx).Value).strip()
            p = float(ws_tab.Cells(r, col_idx + 1).Value)
            z = int(float(ws_tab.Cells(r, col_idx + 2).Value))
            items.append({
                'name': name,
                'P': p,
                'z': z,
                'tag': name_tag
            })
            r += 1
        return items
        
    db['ansi_30_flat_side'] = extract_ansi(2, '30_flat_side')
    print(f"Extracted {len(db['ansi_30_flat_side'])} ANSI B92.1 (30 Flat Side) entries")
    
    db['ansi_30_flat_major'] = extract_ansi(6, '30_flat_major')
    print(f"Extracted {len(db['ansi_30_flat_major'])} ANSI B92.1 (30 Flat Major) entries")
    
    db['ansi_fillet_side'] = extract_ansi(10, 'fillet_side')
    print(f"Extracted {len(db['ansi_fillet_side'])} ANSI B92.1 (Fillet Side) entries")
    
    db['ansi_45_fillet'] = extract_ansi(14, '45_fillet')
    print(f"Extracted {len(db['ansi_45_fillet'])} ANSI B92.1 (45 Fillet) entries")

    wb.Close(False)
finally:
    excel.Quit()

out_path = os.path.join(r'f:\Antigravity\MITCalc-Gear-Engineering\scratch', 'splines_master_db.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f'Successfully saved splines database to {out_path} ({os.path.getsize(out_path)} bytes)!')
