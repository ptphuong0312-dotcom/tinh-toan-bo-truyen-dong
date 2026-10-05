import win32com.client

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)
ws = wb.Sheets('Calculation')

for r in range(335, 375):
    txt_l = ws.Range(f'L{r}').Value
    txt_n = ws.Range(f'N{r}').Value
    val_p = ws.Range(f'P{r}').Value
    val_q = ws.Range(f'Q{r}').Value
    form_p = ws.Range(f'P{r}').Formula
    if txt_l or txt_n or val_p:
        print(f"R{r:3d}: L='{txt_l}' | N='{txt_n}' | P={val_p} ({form_p}) | Q={val_q}")

wb.Close(False)
excel.Quit()
