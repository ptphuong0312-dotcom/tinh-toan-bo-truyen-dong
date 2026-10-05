import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)
ws = wb.Sheets('Calculation')

for r in range(115, 260):
    row_vals = []
    for col in ['A', 'B', 'C', 'D', 'E', 'F', 'N', 'P', 'Q']:
        v = ws.Range(f'{col}{r}').Value
        if v is not None:
            row_vals.append(f"{col}:{str(v)[:20]}")
    if row_vals:
        print(f"R{r:3d}: " + " | ".join(row_vals))

wb.Close(False)
excel.Quit()
