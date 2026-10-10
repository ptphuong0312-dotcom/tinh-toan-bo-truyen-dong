"""
Extract all Roller Chain tables from C:\MITCalc\chains\chains_01.xlsb
Outputs clean JavaScript data file: modules/roller-chain/js/chain-data.js
"""

import win32com.client as win32
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

print("Starting extraction of Roller Chain database from MITCalc chains_01.xlsb...")

excel = win32.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False

wb = excel.Workbooks.Open(r'C:\MITCalc\chains\chains_01.xlsb', ReadOnly=True)
ws = wb.Sheets('Tables')

def parse_chain_range(range_name):
    try:
        rng = wb.Names(range_name).RefersToRange
    except Exception as e:
        print(f"Cannot find range {range_name}: {e}")
        return []
    
    rows = []
    for r in range(1, rng.Rows.Count + 1):
        name = str(rng.Cells(r, 1).Text).strip()
        code = str(rng.Cells(r, 2).Text).strip()
        if not name or not code:
            continue
        try:
            p = float(rng.Cells(r, 5).Value)
            strands = int(rng.Cells(r, 6).Value)
            fb = float(rng.Cells(r, 7).Value)
            mass = float(rng.Cells(r, 8).Value)
            area = float(rng.Cells(r, 9).Value)
            b1 = float(rng.Cells(r, 15).Value)
            b2 = float(rng.Cells(r, 16).Value)
            d1 = float(rng.Cells(r, 17).Value)
            d3 = float(rng.Cells(r, 18).Value)
            l = float(rng.Cells(r, 19).Value)
            lc = float(rng.Cells(r, 20).Value)
            g = float(rng.Cells(r, 21).Value)
            s1 = float(rng.Cells(r, 22).Value)
            s2 = float(rng.Cells(r, 23).Value)
            e_val = rng.Cells(r, 24).Value
            e = float(e_val) if e_val is not None else 0.0

            rows.append({
                'id': len(rows) + 1,
                'name': name,
                'code': code,
                'pitch': p,
                'strands': strands,
                'fb': fb,
                'mass': mass,
                'area': area,
                'b1': b1,
                'b2': b2,
                'd1': d1,
                'd3': d3,
                'l': l,
                'lc': lc,
                'g': g,
                's1': s1,
                's2': s2,
                'e': e
            })
        except Exception as ex:
            pass
    return rows

chains_eu = parse_chain_range('T_RCH_STD_EU')
chains_us = parse_chain_range('T_RCH_STD_US')
chains_np_us = parse_chain_range('T_RCH_NP_US')
chains_nph_us = parse_chain_range('T_RCH_NPH_US')

print(f"Extracted T_RCH_STD_EU: {len(chains_eu)} chains")
print(f"Extracted T_RCH_STD_US: {len(chains_us)} chains")
print(f"Extracted T_RCH_NP_US: {len(chains_np_us)} chains")
print(f"Extracted T_RCH_NPH_US: {len(chains_nph_us)} chains")

wb.Close(False)
excel.Quit()

js_content = f"""/**
 * MITCalc Web App - Roller Chain Engineering Database (Module 9)
 * ISO 606 / DIN 8187 (European Series) & ASME B29.1 / DIN 8188 (American Series)
 * Auto-extracted from MITCalc 1.74 chains_01.xlsb.
 * Zero-CORS, standalone client-side execution.
 */

const ChainData = {{
    // Standard families
    standards: [
        {{
            id: 'EU_STD',
            name: 'ISO 606 / DIN 8187, BS 228 (Tiêu chuẩn Châu Âu - European Series)',
            chains: {json.dumps(chains_eu, ensure_ascii=False, indent=2)}
        }},
        {{
            id: 'US_STD',
            name: 'ISO 606 / DIN 8188 (Tiêu chuẩn Quốc Tế / Mỹ - American Series)',
            chains: {json.dumps(chains_us, ensure_ascii=False, indent=2)}
        }},
        {{
            id: 'US_ASME',
            name: 'ASME B29.1 Standard Roller Chains (Dãy tiêu chuẩn Mỹ mở rộng)',
            chains: {json.dumps(chains_np_us, ensure_ascii=False, indent=2)}
        }},
        {{
            id: 'US_HEAVY',
            name: 'ASME B29.1 Heavy Roller Chains (Dãy xích tải nặng má dày)',
            chains: {json.dumps(chains_nph_us, ensure_ascii=False, indent=2)}
        }}
    ],

    // Driving machine types (Loại động cơ dẫn động)
    driving_machines: [
        {{ id: 'A', name: 'Động cơ điện mô-men khởi động êm / Tua-bin khí (Tải tĩnh êm)', factor: 1.0 }},
        {{ id: 'B', name: 'Động cơ điện khởi động tải cao / Động cơ đốt trong nhiều xi lanh (>=4)', factor: 1.25 }},
        {{ id: 'C', name: 'Động cơ đốt trong 1-2 xi lanh (Dao động chu kỳ)', factor: 1.5 }}
    ],

    // Driven machine types (Loại máy công tác bị dẫn)
    driven_machines: [
        {{ id: 'A', name: 'Tải êm không va đập (Quạt gió, máy phát điện, băng tải nhẹ, máy dệt)', factor: 1.0 }},
        {{ id: 'B', name: 'Va đập nhẹ (Máy công cụ, máy nén ly tâm, máy khuấy, bơm ly tâm)', factor: 1.25 }},
        {{ id: 'C', name: 'Va đập trung bình (Máy ép thủy lực, máy cán, máy dập, bơm piston)', factor: 1.5 }},
        {{ id: 'D', name: 'Va đập mạnh (Máy nghiền đá, máy đập búa, máy đào, tời nâng nặng)', factor: 2.0 }}
    ],

    // Lubrication types (Phương pháp bôi trơn)
    lubrication_types: [
        {{ id: 1, name: 'Bôi trơn thủ công / Định kỳ bằng chổi hoặc bình tra (v <= 4 m/s)', minV: 0, maxV: 4 }},
        {{ id: 2, name: 'Bôi trơn nhỏ giọt (Drip feed) (v <= 7 m/s)', minV: 0, maxV: 7 }},
        {{ id: 3, name: 'Bôi trơn ngâm dầu / Bắn té (Oil bath / Slinger) (v <= 12 m/s)', minV: 0, maxV: 12 }},
        {{ id: 4, name: 'Bôi trơn tuần hoàn cưỡng bức / Bơm áp lực phun tia (v > 12 m/s)', minV: 10, maxV: 30 }}
    ],

    // Presets (Quy cách tiêu chuẩn phổ biến trong công nghiệp)
    presets: [
        {{
            name: '⚡ ISO 08B-1: p=12.7mm | z1=19 | z2=38 | i=2.0 | a=500mm | P=5.5kW | n1=1450 rpm',
            stdId: 'EU_STD',
            code: '08B - 1  (0.5)',
            z1: 19,
            z2: 38,
            a: 500.0,
            P: 5.5,
            n1: 1450,
            driving: 'A',
            driven: 'B'
        }},
        {{
            name: '⚡ ISO 10B-1: p=15.875mm | z1=21 | z2=42 | i=2.0 | a=600mm | P=11kW | n1=960 rpm',
            stdId: 'EU_STD',
            code: '10B - 1  (0.625)',
            z1: 21,
            z2: 42,
            a: 600.0,
            P: 11.0,
            n1: 960,
            driving: 'A',
            driven: 'B'
        }},
        {{
            name: '⚡ ISO 12B-1: p=19.05mm | z1=21 | z2=53 | i=2.52 | a=750mm | P=18.5kW | n1=960 rpm',
            stdId: 'EU_STD',
            code: '12B - 1  (0.75)',
            z1: 21,
            z2: 53,
            a: 750.0,
            P: 18.5,
            n1: 960,
            driving: 'A',
            driven: 'B'
        }},
        {{
            name: '⚡ ISO 16B-1: p=25.4mm | z1=19 | z2=38 | i=2.0 | a=1000mm | P=30kW | n1=720 rpm',
            stdId: 'EU_STD',
            code: '16B - 1  (1.0)',
            z1: 19,
            z2: 38,
            a: 1000.0,
            P: 30.0,
            n1: 720,
            driving: 'A',
            driven: 'C'
        }},
        {{
            name: '⚡ ISO 20B-1: p=31.75mm | z1=17 | z2=34 | i=2.0 | a=1200mm | P=45kW | n1=580 rpm',
            stdId: 'EU_STD',
            code: '20B - 1  (1.25)',
            z1: 17,
            z2: 34,
            a: 1200.0,
            P: 45.0,
            n1: 580,
            driving: 'A',
            driven: 'C'
        }},
        {{
            name: '⚡ ANSI 40-1: p=12.7mm | z1=19 | z2=38 | i=2.0 | a=500mm | P=3.7kW | n1=1750 rpm',
            stdId: 'US_STD',
            code: '40 - 1  (0.5)',
            z1: 19,
            z2: 38,
            a: 500.0,
            P: 3.7,
            n1: 1750,
            driving: 'A',
            driven: 'A'
        }},
        {{
            name: '⚡ ANSI 50-1: p=15.875mm | z1=21 | z2=42 | i=2.0 | a=600mm | P=7.5kW | n1=1160 rpm',
            stdId: 'US_STD',
            code: '50 - 1  (0.625)',
            z1: 21,
            z2: 42,
            a: 600.0,
            P: 7.5,
            n1: 1160,
            driving: 'A',
            driven: 'B'
        }},
        {{
            name: '⚡ ANSI 60-1: p=19.05mm | z1=21 | z2=53 | i=2.52 | a=800mm | P=15kW | n1=1160 rpm',
            stdId: 'US_STD',
            code: '60 - 1  (0.75)',
            z1: 21,
            z2: 53,
            a: 800.0,
            P: 15.0,
            n1: 1160,
            driving: 'A',
            driven: 'B'
        }},
        {{
            name: '⚡ ANSI 80-2 (2 dãy): p=25.4mm | z1=21 | z2=53 | i=2.52 | a=1020mm | P=30kW | n1=970 rpm',
            stdId: 'US_STD',
            code: '80 - 2  (1.0)',
            z1: 21,
            z2: 53,
            a: 1020.0,
            P: 30.0,
            n1: 970,
            driving: 'A',
            driven: 'B'
        }}
    ]
}};

// Support CommonJS (Node.js unit tests) & Browser global
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ ChainData }};
}}
"""

out_path = r'modules/roller-chain/js/chain-data.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully wrote {out_path} ({len(js_content)} chars)")
