import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
excel.DisplayAlerts = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear1\Gear1_01.xlsb')
sh_calc = wb.Sheets('Calculation')

for chartObj in sh_calc.ChartObjects():
    ch = chartObj.Chart
    title = ch.ChartTitle.Text if ch.HasTitle else "No Title"
    print(f"=== Chart {chartObj.Name} (Title: {title}) ===")
    for s in ch.SeriesCollection():
        print(f"   Series: {s.Name}, Formula: {s.Formula}")

print("\n--- Inspect Coordinates Sheet ---")
sh_coord = wb.Sheets('Coordinates')
print("Coordinates A1:F20:")
for r in range(1, 21):
    row_vals = [str(sh_coord.Cells(r, c).Value) for c in range(1, 10)]
    print(f"Row {r:2d}: " + "\t".join(row_vals))

wb.Close(False)
excel.Quit()
