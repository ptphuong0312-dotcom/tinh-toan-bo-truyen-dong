import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)
ws = wb.Sheets('Calculation')

for name in ['_alfa', '_alfa_t', '_alfa_n', '_beta', '_mmn', '_mmt', '_x1', '_xTau1', '_de1', '_dm1', '_dv1']:
    try:
        rng = wb.Names(name).RefersToRange
        print(f"Name '{name}': Cell {rng.Address} = {rng.Value} (Formula: {rng.Formula})")
    except Exception as e:
        print(f"Name '{name}': Error {e}")

wb.Close(False)
excel.Quit()
