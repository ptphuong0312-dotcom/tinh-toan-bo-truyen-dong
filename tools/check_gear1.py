import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear1\Gear1_01.xlsb')

def print_range(name):
    try:
        rng = wb.Names(name).RefersToRange
        vals = [str(c.Value) for c in rng if c.Value is not None]
        print(f"{name}: {vals}")
    except Exception as e:
        print(f"Error {name}: {e}")

for n in ['T_i', 'T_modul', 'T_CADSystems', 'T_DXFScale', 'T_DXF_2P', 'T_DXFTablesList', 'T_CutToolsDim']:
    print_range(n)

wb.Close(False)
excel.Quit()
