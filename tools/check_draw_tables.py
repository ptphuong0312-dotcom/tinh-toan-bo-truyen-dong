import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_unprot.xlsb', False, True)
ws = wb.Sheets('Data1')

for name in ['T_DrawTopView', 'T_DrawFrontViewWheel', 'T_DrawTopViewWheel']:
    print(f"\n=== {name} ===")
    rng = wb.Names(name).RefersToRange
    for r in range(1, rng.Rows.Count + 1):
        vals = [str(rng.Cells(r, c).Value or '') for c in range(1, rng.Columns.Count + 1)]
        if any(vals):
            print(f"R{r:2d}: " + " | ".join(vals))

wb.Close(False)
excel.Quit()
