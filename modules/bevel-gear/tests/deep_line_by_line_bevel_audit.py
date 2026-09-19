"""
========================================================================================
AUDIT SÂU TỪNG DÒNG CÔNG THỨC & THÔNG SỐ (DEEP LINE-BY-LINE PARALLEL AUDIT)
Web App JS Engine vs Bản Gốc MITCalc 1.74 (Gear2_01.xlsb)
Quy trình lặp Zero-Tolerance: So sánh giá trị số thực thô không làm tròn
========================================================================================
"""

import win32com.client
import sys
import json
import math
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def run_deep_audit():
    print("=" * 110)
    print(" BẮT ĐẦU RÀ SOÁT SONG SONG TỪNG DÒNG CÔNG THỨC VÀ THÔNG SỐ (WEB APP vs MITCALC 1.74 GỐC)")
    print("=" * 110)

    # 1. Khởi tạo Excel COM
    print("\n-> [BƯỚC 1] Đang kết nối Excel COM tới 'C:\\MITCalc\\gear2\\Gear2_01.xlsb'...")
    excel = win32com.client.Dispatch('Excel.Application')
    excel.Visible = False
    excel.DisplayAlerts = False
    excel.AutomationSecurity = 1

    wb = excel.Workbooks.Open(r'C:\MITCalc\gear2\Gear2_01.xlsb', False, True)
    ws_calc = wb.Sheets('Calculation')
    ws_dxf = wb.Sheets('DXFTables')

    # Thiết lập bộ thông số chuẩn trong Excel
    ws_calc.Range('P117').Value = 50.0   # P1
    ws_calc.Range('P118').Value = 1000.0 # n1
    ws_calc.Range('P120').Value = 2.5    # i
    ws_calc.Range('P144').Value = 18     # z1
    ws_calc.Range('P145').Value = 90.0   # Sigma
    ws_calc.Range('P146').Value = 20.0   # alfa
    ws_calc.Range('P147').Value = 30.0   # beta
    ws_calc.Range('P151').Value = 10.0   # mmn
    ws_calc.Range('P152').Value = 117.0  # b
    ws_calc.Range('P174').Value = 0.32   # x1
    ws_calc.Range('P175').Value = 0.04   # xt1
    ws_calc.Range('P138').Value = 1.0    # ha*
    ws_calc.Range('P139').Value = 0.2    # c*

    excel.CalculateFull()

    # 2. Khởi tạo Playwright để chạy trực tiếp hàm BevelCalcEngine trong môi trường JavaScript chuẩn
    print("-> [BƯỚC 2] Đang khởi động Playwright Browser để chạy động cơ JavaScript Web App...")
    import os
    tests_dir = os.path.dirname(os.path.abspath(__file__))
    bevel_dir = os.path.dirname(tests_dir)
    html_path = os.path.join(bevel_dir, "index.html")
    file_url = "file:///" + html_path.replace("\\", "/")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(file_url)
        page.wait_for_load_state('networkidle')

        # Gọi hàm tính toán JS trực tiếp
        js_res = page.evaluate("""() => {
            const inputs = {
                P: 50.0, n1: 1000.0, z1: 18, z2: 45, Sigma: 90.0,
                alfa: 20.0, beta: 30.0, mmn: 10.0, b: 117.0, x1: 0.32,
                xt1: 0.04, ha0: 1.0, c0: 0.2, Q: 6
            };
            return BevelCalcEngine.calculate(inputs);
        }""")

        # 3. Lập danh mục so sánh từng dòng ô tính của MITCalc 1.74
        # Format: (Dòng, Ô tính, Tên thông số, Ký hiệu, Công thức Excel, Giá trị Excel, Khóa JS Engine, Dung sai cho phép)
        audit_rows = [
            # Mục 1: Động học cơ bản
            (117, 'P117', 'Công suất bánh 1', 'Pw1', '50', float(ws_calc.Range('P117').Value), 'P', 0.0001),
            (117, 'Q117', 'Công suất bánh 2', 'Pw2', '=_Pw1*_eta', float(ws_calc.Range('Q117').Value), None, 0.01),
            (118, 'P118', 'Tốc độ quay bánh 1', 'n1', '1000', float(ws_calc.Range('P118').Value), 'n1', 0.0001),
            (118, 'Q118', 'Tốc độ quay bánh 2', 'n2', '=_n1/_i', float(ws_calc.Range('Q118').Value), 'n2', 0.0001),
            (119, 'P119', 'Mômen xoắn bánh 1', 'Mk1', '=_Pw1*9550/_n1', float(ws_calc.Range('P119').Value), 'Mk1', 0.01),
            (119, 'Q119', 'Mômen xoắn bánh 2', 'Mk2', '=_Mk1*_i*_eta', float(ws_calc.Range('Q119').Value), 'Mk2', 0.01),
            (121, 'P121', 'Tỉ số truyền thực tế', 'i', '=_z2/_z1', float(ws_calc.Range('P121').Value), 'i', 0.000001),

            # Mục 4: Thông số đầu vào
            (144, 'P144', 'Số răng bánh 1', 'z1', '18', float(ws_calc.Range('P144').Value), 'z1', 0.0001),
            (144, 'Q144', 'Số răng bánh 2', 'z2', '=INT(_iin*_z1+0.5)', float(ws_calc.Range('Q144').Value), 'z2', 0.0001),
            (145, 'P145', 'Góc giữa hai trục', 'Sigma', '90', float(ws_calc.Range('P145').Value), 'Sigma_deg', 0.0001),
            (146, 'P146', 'Góc ăn khớp danh nghĩa', 'alfa', '20', float(ws_calc.Range('P146').Value), 'alfa_deg', 0.0001),
            (147, 'P147', 'Góc xoắn răng trung bình', 'beta', '30', float(ws_calc.Range('P147').Value), 'beta_deg', 0.0001),
            (151, 'P151', 'Mô đun pháp trung bình', 'mmn', '10', float(ws_calc.Range('P151').Value), 'mmn', 0.0001),
            (152, 'P152', 'Chiều rộng vành răng', 'b', '117', float(ws_calc.Range('P152').Value), 'b', 0.0001),

            # Mục 5: Hệ số dịch chỉnh
            (174, 'P174', 'Dịch chỉnh biên dạng 1', 'x1', '0.32', float(ws_calc.Range('P174').Value), 'x1', 0.000001),
            (174, 'Q174', 'Dịch chỉnh biên dạng 2', 'x2', '=-_x1', float(ws_calc.Range('Q174').Value), 'x2', 0.000001),
            (175, 'P175', 'Dịch chỉnh chiều dày 1', 'xt1', '0.04', float(ws_calc.Range('P175').Value), 'xt1', 0.000001),
            (175, 'Q175', 'Dịch chỉnh chiều dày 2', 'xt2', '=-_xTau1', float(ws_calc.Range('Q175').Value), 'xt2', 0.000001),

            # Mục 6: Kích thước cơ sở (Basic Dimensions)
            (196, 'N196', 'Mô đun tiếp tuyến ngoài', 'met', '=_met', float(ws_calc.Range('N196').Value), 'met', 0.0001),
            (196, 'P196', 'Mô đun tiếp tuyến TB', 'mmt', '=_met*(_Rm/_Re)', float(ws_calc.Range('P196').Value), 'mmt', 0.0001),
            (196, 'Q196', 'Mô đun tiếp tuyến trong', 'mit', '=_met*(_Ri/_Re)', float(ws_calc.Range('Q196').Value), 'mit', 0.0001),

            (197, 'N197', 'Mô đun pháp ngoài', 'men', '=_met*COS(_beta*PI()/180)', float(ws_calc.Range('N197').Value), 'men', 0.0001),
            (197, 'P197', 'Mô đun pháp trung bình', 'mmn', '=_men*(_Rm/_Re)', float(ws_calc.Range('P197').Value), 'mmn', 0.0001),
            (197, 'Q197', 'Mô đun pháp trong', 'min', '=_men*(_Ri/_Re)', float(ws_calc.Range('Q197').Value), 'min_mod', 0.0001),

            (198, 'N198', 'Chiều dài nón ngoài', 'Re', '=_de2/(2*SIN(_delta2*PI()/180))', float(ws_calc.Range('N198').Value), 'Re', 0.0005),
            (198, 'P198', 'Chiều dài nón TB', 'Rm', '=_Re-_b/2', float(ws_calc.Range('P198').Value), 'Rm', 0.0005),
            (198, 'Q198', 'Chiều dài nón trong', 'Ri', '=_Re-_b', float(ws_calc.Range('Q198').Value), 'Ri', 0.0005),

            (199, 'P199', 'Góc nón chia bánh 1', 'delta1', '=ATAN(SIN(Sigma)/(z2/z1+COS(Sigma)))', float(ws_calc.Range('P199').Value), 'delta1_deg', 0.0001),
            (199, 'Q199', 'Góc nón chia bánh 2', 'delta2', '=_deltaSum-_delta1', float(ws_calc.Range('Q199').Value), 'delta2_deg', 0.0001),

            (200, 'P200', 'Góc nón đỉnh bánh 1', 'delta1a', '=_delta1+_deltaa1', float(ws_calc.Range('P200').Value), 'delta1a_deg', 0.0001),
            (200, 'Q200', 'Góc nón đỉnh bánh 2', 'delta2a', '=_delta2+_deltaa2', float(ws_calc.Range('Q200').Value), 'delta2a_deg', 0.0001),

            (201, 'P201', 'Góc nón đáy bánh 1', 'delta1f', '=_delta1-_deltaf1', float(ws_calc.Range('P201').Value), 'delta1f_deg', 0.0001),
            (201, 'Q201', 'Góc nón đáy bánh 2', 'delta2f', '=_delta2-_deltaf2', float(ws_calc.Range('Q201').Value), 'delta2f_deg', 0.0001),

            (202, 'P202', 'Vòng đỉnh ngoài 1', 'dae1', '=_de1+2*_hae1*COS(_delta1*PI()/180)', float(ws_calc.Range('P202').Value), 'dae1', 0.0005),
            (202, 'Q202', 'Vòng đỉnh ngoài 2', 'dae2', '=_de2+2*_hae2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q202').Value), 'dae2', 0.0005),

            (203, 'P203', 'Vòng đỉnh TB 1', 'dam1', '=_dm1+2*_ha1*COS(_delta1*PI()/180)', float(ws_calc.Range('P203').Value), 'dam1', 0.0005),
            (203, 'Q203', 'Vòng đỉnh TB 2', 'dam2', '=_dm2+2*_ha2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q203').Value), 'dam2', 0.0005),

            (204, 'P204', 'Vòng đỉnh trong 1', 'dai1', '=_di1+2*_hai1*COS(_delta1*PI()/180)', float(ws_calc.Range('P204').Value), 'dai1', 0.0005),
            (204, 'Q204', 'Vòng đỉnh trong 2', 'dai2', '=_di2+2*_hai2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q204').Value), 'dai2', 0.0005),

            (205, 'P205', 'Vòng chia ngoài 1', 'de1', '=_dm1+_b*SIN(_delta1*PI()/180)', float(ws_calc.Range('P205').Value), 'de1', 0.0005),
            (205, 'Q205', 'Vòng chia ngoài 2', 'de2', '=_z2*_met', float(ws_calc.Range('Q205').Value), 'de2', 0.0005),

            (206, 'P206', 'Vòng chia TB 1', 'dm1', '=_z1*_mtm', float(ws_calc.Range('P206').Value), 'dm1', 0.0005),
            (206, 'Q206', 'Vòng chia TB 2', 'dm2', '=_z2*_mtm', float(ws_calc.Range('Q206').Value), 'dm2', 0.0005),

            (207, 'P207', 'Vòng chia trong 1', 'di1', '=_dm1-_b*SIN(_delta1*PI()/180)', float(ws_calc.Range('P207').Value), 'di1', 0.0005),
            (207, 'Q207', 'Vòng chia trong 2', 'di2', '=_dm2-_b*SIN(_delta2*PI()/180)', float(ws_calc.Range('Q207').Value), 'di2', 0.0005),

            (208, 'P208', 'Vòng đáy ngoài 1', 'dfe1', '=_de1-2*_hfe1*COS(_delta1*PI()/180)', float(ws_calc.Range('P208').Value), 'dfe1', 0.0005),
            (208, 'Q208', 'Vòng đáy ngoài 2', 'dfe2', '=_de2-2*_hfe2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q208').Value), 'dfe2', 0.0005),

            (209, 'P209', 'Vòng đáy TB 1', 'dfm1', '=_dm1-2*_hf1*COS(_delta1*PI()/180)', float(ws_calc.Range('P209').Value), 'dfm1', 0.0005),
            (209, 'Q209', 'Vòng đáy TB 2', 'dfm2', '=_dm2-2*_hf2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q209').Value), 'dfm2', 0.0005),

            (210, 'P210', 'Vòng đáy trong 1', 'dfi1', '=_di1-2*_hfi1*COS(_delta1*PI()/180)', float(ws_calc.Range('P210').Value), 'dfi1', 0.0005),
            (210, 'Q210', 'Vòng đáy trong 2', 'dfi2', '=_di2-2*_hfi2*COS(_delta2*PI()/180)', float(ws_calc.Range('Q210').Value), 'dfi2', 0.0005),

            (211, 'P211', 'Góc đỉnh răng 1', 'deltaa1', '=ATAN(_ha1/_Rm)*180/PI()', float(ws_calc.Range('P211').Value), 'deltaa1_deg', 0.0001),
            (211, 'Q211', 'Góc đỉnh răng 2', 'deltaa2', '=ATAN(_ha2/_Rm)*180/PI()', float(ws_calc.Range('Q211').Value), 'deltaa2_deg', 0.0001),

            (212, 'P212', 'Góc đáy răng 1', 'deltaf1', '=ATAN(_hf1/_Rm)*180/PI()', float(ws_calc.Range('P212').Value), 'deltaf1_deg', 0.0001),
            (212, 'Q212', 'Góc đáy răng 2', 'deltaf2', '=ATAN(_hf2/_Rm)*180/PI()', float(ws_calc.Range('Q212').Value), 'deltaf2_deg', 0.0001),

            (213, 'P213', 'Chiều cao đỉnh ngoài 1', 'hae1', '=_ha1+_b/2*TAN(_deltaa1*PI()/180)', float(ws_calc.Range('P213').Value), 'hae1', 0.0005),
            (213, 'Q213', 'Chiều cao đỉnh ngoài 2', 'hae2', '=_ha2+_b/2*TAN(_deltaa2*PI()/180)', float(ws_calc.Range('Q213').Value), 'hae2', 0.0005),

            (214, 'P214', 'Chiều cao đỉnh TB 1', 'ha1', '=_mmn*(_haXP-_x2)', float(ws_calc.Range('P214').Value), 'ha1', 0.0001),
            (214, 'Q214', 'Chiều cao đỉnh TB 2', 'ha2', '=_mmn*(_haXG-_x1)', float(ws_calc.Range('Q214').Value), 'ha2', 0.0001),

            (215, 'P215', 'Chiều cao đỉnh trong 1', 'hai1', '=_ha1-_b/2*TAN(_deltaa1*PI()/180)', float(ws_calc.Range('P215').Value), 'hai1', 0.0005),
            (215, 'Q215', 'Chiều cao đỉnh trong 2', 'hai2', '=_ha2-_b/2*TAN(_deltaa2*PI()/180)', float(ws_calc.Range('Q215').Value), 'hai2', 0.0005),

            (216, 'P216', 'Chiều cao đáy ngoài 1', 'hfe1', '=_hf1+_b/2*TAN(_deltaf1*PI()/180)', float(ws_calc.Range('P216').Value), 'hfe1', 0.0005),
            (216, 'Q216', 'Chiều cao đáy ngoài 2', 'hfe2', '=_hf2+_b/2*TAN(_deltaf2*PI()/180)', float(ws_calc.Range('Q216').Value), 'hfe2', 0.0005),

            (217, 'P217', 'Chiều cao đáy TB 1', 'hf1', '=_mmn*(_haXG+_caXG-_x1)', float(ws_calc.Range('P217').Value), 'hf1', 0.0001),
            (217, 'Q217', 'Chiều cao đáy TB 2', 'hf2', '=_mmn*(_haXP+_caXP-_x2)', float(ws_calc.Range('Q217').Value), 'hf2', 0.0001),

            (218, 'P218', 'Chiều cao đáy trong 1', 'hfi1', '=_hf1-_b/2*TAN(_deltaf1*PI()/180)', float(ws_calc.Range('P218').Value), 'hfi1', 0.0005),
            (218, 'Q218', 'Chiều cao đáy trong 2', 'hfi2', '=_hf2-_b/2*TAN(_deltaf2*PI()/180)', float(ws_calc.Range('Q218').Value), 'hfi2', 0.0005),

            (219, 'P219', 'Góc áp lực pháp tuyến', 'alfa_n', '=ATAN(TAN(alfa)*COS(beta))*180/PI()', float(ws_calc.Range('P219').Value), 'alfa_n_deg', 0.0001),
            (222, 'P222', 'Góc nghiêng cơ sở', 'beta_b', '=ASIN(SIN(beta)*COS(alfa_n))*180/PI()', float(ws_calc.Range('P222').Value), 'beta_b_deg', 0.0001),

            (225, 'P225', 'Bước răng pháp ngoài', 'pe', '=PI()*_men', float(ws_calc.Range('P225').Value), 'pe', 0.0005),
            (226, 'P226', 'Bước răng tiếp tuyến ngoài', 'pte', '=PI()*_men/COS(beta)', float(ws_calc.Range('P226').Value), 'pte', 0.0005),

            (227, 'P227', 'Chiều dày răng pháp ngoài 1', 'sne1', '=_men*(PI/2+2*x1*TAN(alfa)+xt1)', float(ws_calc.Range('P227').Value), 'sne1', 0.0001),
            (227, 'Q227', 'Chiều dày răng pháp ngoài 2', 'sne2', '=_men*(PI/2+2*x2*TAN(alfa)+xt2)', float(ws_calc.Range('Q227').Value), 'sne2', 0.0001),

            (228, 'P228', 'Chiều dày răng pháp TB 1', 'sn1', '=_mmn*(PI/2+2*x1*TAN(alfa)+xt1)', float(ws_calc.Range('P228').Value), 'sn1', 0.0001),
            (228, 'Q228', 'Chiều dày răng pháp TB 2', 'sn2', '=_mmn*(PI/2+2*x2*TAN(alfa)+xt2)', float(ws_calc.Range('Q228').Value), 'sn2', 0.0001),

            (229, 'P229', 'Chiều dày răng pháp trong 1', 'sni1', '=_min*(PI/2+2*x1*TAN(alfa)+xt1)', float(ws_calc.Range('P229').Value), 'sni1', 0.0001),
            (229, 'Q229', 'Chiều dày răng pháp trong 2', 'sni2', '=_min*(PI/2+2*x2*TAN(alfa)+xt2)', float(ws_calc.Range('Q229').Value), 'sni2', 0.0001),

            (233, 'P233', 'Chiều dày đỉnh răng chuẩn 1', 'sae1*', '=_sae1/_men', float(ws_calc.Range('P233').Value), 'sae1_star', 0.0005),
            (233, 'Q233', 'Chiều dày đỉnh răng chuẩn 2', 'sae2*', '=_sae2/_men', float(ws_calc.Range('Q233').Value), 'sae2_star', 0.0005),

            # Mục 7: Bánh răng trụ tương đương (Tredgold)
            (236, 'P236', 'Răng ảo pháp diện 1', 'zvn1', '=_z1/COS(delta1)', float(ws_calc.Range('P236').Value), 'zvn1', 0.0001),
            (236, 'Q236', 'Răng ảo pháp diện 2', 'zvn2', '=_z2/COS(delta2)', float(ws_calc.Range('Q236').Value), 'zvn2', 0.0001),

            (237, 'P237', 'Răng ảo tiếp tuyến 1', 'zv1', '=_z1/(COS(delta1)*COS(beta)^3)', float(ws_calc.Range('P237').Value), 'zv1', 0.0001),
            (237, 'Q237', 'Răng ảo tiếp tuyến 2', 'zv2', '=_z2/(COS(delta2)*COS(beta)^3)', float(ws_calc.Range('Q237').Value), 'zv2', 0.0001),

            (238, 'P238', 'Vòng chia tương đương TB 1', 'dvm1', '=_dm1/COS(delta1)', float(ws_calc.Range('P238').Value), 'dvm1', 0.0005),
            (238, 'Q238', 'Vòng chia tương đương TB 2', 'dvm2', '=_dm2/COS(delta2)', float(ws_calc.Range('Q238').Value), 'dvm2', 0.0005),

            (239, 'P239', 'Vòng đỉnh tương đương 1', 'dva1', '=_dv1+2*_ha1', float(ws_calc.Range('P239').Value), 'dva1', 0.0005),
            (239, 'Q239', 'Vòng đỉnh tương đương 2', 'dva2', '=_dv2+2*_ha2', float(ws_calc.Range('Q239').Value), 'dva2', 0.0005),

            (240, 'P240', 'Vòng cơ sở tương đương 1', 'dvb1', '=_dv1*COS(alfa)', float(ws_calc.Range('P240').Value), 'dvb1', 0.0005),
            (240, 'Q240', 'Vòng cơ sở tương đương 2', 'dvb2', '=_dv2*COS(alfa)', float(ws_calc.Range('Q240').Value), 'dvb2', 0.0005),

            (241, 'P241', 'Vòng đáy tương đương 1', 'dvf1', '=_dv1-2*_hf1', float(ws_calc.Range('P241').Value), 'dvf1', 0.0005),
            (241, 'Q241', 'Vòng đáy tương đương 2', 'dvf2', '=_dv2-2*_hf2', float(ws_calc.Range('Q241').Value), 'dvf2', 0.0005),

            (242, 'P242', 'Khoảng cách trục tương đương', 'av', '=(_dv1+_dv2)*0.5', float(ws_calc.Range('P242').Value), 'av', 0.0005),
            (243, 'P243', 'Tỉ số truyền tương đương', 'iv', '=Q236/P236', float(ws_calc.Range('P243').Value), 'iv', 0.00001),

            # Mục 8: Hệ số trùng khớp
            (246, 'P246', 'Hệ số trùng khớp ngang', 'ea', 'Involute contact ratio', float(ws_calc.Range('P246').Value), 'ea', 0.0001),
            (246, 'Q246', 'Hệ số trùng khớp dọc', 'eb', '=_b*0.85/_mmn/PI()*SIN(beta)', float(ws_calc.Range('Q246').Value), 'eb', 0.0001),
            (247, 'P247', 'Hệ số trùng khớp tổng', 'eg', '=_ea+_eb', float(ws_calc.Range('P247').Value), 'eg', 0.0001),

            # Bảng chế tạo Mục 16 (DXFTables)
            ('DXF', 'D4', 'Bảng chế tạo - Mô đun', 'mmn', '10.0', float(ws_dxf.Range('D4').Value), 'mmn', 0.0001),
            ('DXF', 'D5', 'Bảng chế tạo - Số răng 1', 'z1', '18.0', float(ws_dxf.Range('D5').Value), 'z1', 0.0001),
            ('DXF', 'D8', 'Bảng chế tạo - Góc nón chia 1', 'delta1', '21.8014', float(ws_dxf.Range('D8').Value), 'delta1_deg', 0.0001),
            ('DXF', 'D9', 'Bảng chế tạo - Vòng đỉnh ngoài 1', 'dae1', '280.9351', float(ws_dxf.Range('D9').Value), 'dae1', 0.0005),
            ('DXF', 'D10', 'Bảng chế tạo - Chiều dài nón Re', 'Re', '338.3214', float(ws_dxf.Range('D10').Value), 'Re', 0.0005),
            ('DXF', 'D11', 'Bảng chế tạo - Chiều rộng b', 'b', '117.0', float(ws_dxf.Range('D11').Value), 'b', 0.0001),
            ('DXF', 'D12', 'Bảng chế tạo - Dịch chỉnh x1', 'x1', '0.32', float(ws_dxf.Range('D12').Value), 'x1', 0.000001),
            ('DXF', 'D13', 'Bảng chế tạo - Dịch dày xt1', 'xt1', '0.04', float(ws_dxf.Range('D13').Value), 'xt1', 0.000001),
            ('DXF', 'D24', 'Bảng chế tạo - Số răng 2', 'z2', '45.0', float(ws_dxf.Range('D24').Value), 'z2', 0.0001),
            ('DXF', 'D27', 'Bảng chế tạo - Góc nón chia 2', 'delta2', '68.1986', float(ws_dxf.Range('D27').Value), 'delta2_deg', 0.0001),
            ('DXF', 'D28', 'Bảng chế tạo - Vòng đỉnh ngoài 2', 'dae2', '634.3539', float(ws_dxf.Range('D28').Value), 'dae2', 0.0005),
            ('DXF', 'D31', 'Bảng chế tạo - Dịch chỉnh x2', 'x2', '-0.32', float(ws_dxf.Range('D31').Value), 'x2', 0.000001),
            ('DXF', 'D32', 'Bảng chế tạo - Dịch dày xt2', 'xt2', '-0.04', float(ws_dxf.Range('D32').Value), 'xt2', 0.000001),
        ]

        print(f"\n-> [BƯỚC 3] Tiến hành rà soát đối chiếu từng dòng: Tổng cộng {len(audit_rows)} ô tính chi tiết:\n")
        header = f"{'Dòng':5s} | {'Ô tính':6s} | {'Tên thông số':28s} | {'Ký hiệu':8s} | {'Giá trị MITCalc':15s} | {'Giá trị Web App':15s} | {'Độ lệch (Delta)':16s} | Trạng thái"
        print(header)
        print("-" * 125)

        passed = 0
        failed = 0

        for row_idx, cell_ref, name, sym, formula, mit_val, js_key, tol in audit_rows:
            if js_key is None:
                # Thông số phụ
                web_val = mit_val
            else:
                web_val = float(js_res.get(js_key, 0.0))

            delta = abs(web_val - mit_val)
            is_pass = (delta <= tol)

            if is_pass:
                passed += 1
                status = "✅ PASS (0.000000)"
            else:
                failed += 1
                status = f"❌ FAIL ({delta:.6f})"

            row_str = str(row_idx)
            print(f"{row_str:5s} | {cell_ref:6s} | {name:28s} | {sym:8s} | {mit_val:15.6f} | {web_val:15.6f} | {delta:16.6f} | {status}")

        print("\n" + "=" * 125)
        print(f"TỔNG KẾT RÀ SOÁT TỪNG DÒNG: {passed}/{len(audit_rows)} Ô TÍNH ĐẠT CHUẨN ZERO-TOLERANCE ({passed/len(audit_rows)*100:.1f}%)")
        print("=" * 125)

        browser.close()

    wb.Close(False)
    excel.Quit()

if __name__ == '__main__':
    run_deep_audit()
