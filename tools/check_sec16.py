import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)
ws = wb.Sheets('Calculation')

for r in [364, 365]:
    for col in ['N', 'O']:
        print(f"R{r}{col}: val={ws.Range(f'{col}{r}').Value} | form={ws.Range(f'{col}{r}').Formula}")

wb.Close(False)
excel.Quit()
