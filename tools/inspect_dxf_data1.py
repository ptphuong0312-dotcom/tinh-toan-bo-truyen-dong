import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)

print("=== SHEET DXF ===")
ws_dxf = wb.Sheets('DXF')
for r in range(1, 70):
    vals = [str(ws_dxf.Cells(r, c).Value or '') for c in range(1, 15)]
    if any(vals):
        print(f"R{r:2d}: " + " | ".join(v[:25] for v in vals if v))

print("\n=== SHEET Data1 ===")
ws_d1 = wb.Sheets('Data1')
for r in range(1, 40):
    vals = [str(ws_d1.Cells(r, c).Value or '') for c in range(1, 15)]
    if any(vals):
        print(f"R{r:2d}: " + " | ".join(v[:25] for v in vals if v))

wb.Close(False)
excel.Quit()
