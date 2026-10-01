"""
========================================================================================
AUDIT SÂU TỪNG DÒNG CÔNG THỨC & THÔNG SỐ BỘ TRUYỀN TRỤC VÍT - BÁNH VÍT (MODULE 3)
Web App JS Engine (WormCalcEngine) vs Bản Gốc MITCalc 1.74 (C:\MITCalc\gear4\Gear4_01.xlsb)
Quy trình Zero-Tolerance: So sánh giá trị số thực thô trên 5 kịch bản thiết kế toàn diện
========================================================================================
"""

import os
import sys
import math
import win32com.client
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')


def set_excel_inputs(ws_calc, params):
    # Ensure SI Units (F117 = 2 -> S_Units = 1)
    ws_calc.Range('F117').Value = 2
    ws_calc.Range('F118').Value = params['poweredWoWh']
    ws_calc.Range('P119').Value = params['Pw2']
    ws_calc.Range('O120').Value = params['n1']
    ws_calc.Range('O122').Value = params['iin']

    ws_calc.Range('F127').Value = params['matP']
    ws_calc.Range('F128').Value = params['matW']
    ws_calc.Range('F129').Value = params['toothType']
    ws_calc.Range('F130').Value = params['loadTypeA']
    ws_calc.Range('F131').Value = params['loadTypeB']
    ws_calc.Range('F132').Value = params['designCooling']
    ws_calc.Range('F133').Value = params['oilType']
    ws_calc.Range('F134').Value = params['lubricant']
    ws_calc.Range('O135').Value = params['ny40']
    ws_calc.Range('P135').Value = params['ny100']
    ws_calc.Range('O136').Value = params['rooil15']
    ws_calc.Range('O137').Value = params['Ra1']
    ws_calc.Range('B138').Value = params['kaFlag']
    if not params['kaFlag']:
        ws_calc.Range('O138').Value = params['KA']

    ws_calc.Range('O147').Value = params['haXP']
    ws_calc.Range('O148').Value = params['caXP']
    ws_calc.Range('B149').Value = params['rf1Flag']
    if not params['rf1Flag']:
        ws_calc.Range('O150').Value = params['rf1']

    ws_calc.Range('O161').Value = params['z1']
    ws_calc.Range('O162').Value = params['alfa_temp']
    ws_calc.Range('F163').Value = params['calc_q']
    ws_calc.Range('F166').Value = params['teethOrientation']
    ws_calc.Range('O167').Value = params['m_Input']

    if params['calc_q'] == 1:
        ws_calc.Range('O163').Value = params['q']
    elif params['calc_q'] == 2:
        ws_calc.Range('O164').Value = params['d1_Input']
    elif params['calc_q'] == 3:
        ws_calc.Range('O165').Value = params['gama']

    ws_calc.Range('O169').Value = params['l1_proc']
    ws_calc.Range('P169').Value = params['l2_proc']
    ws_calc.Range('B170').Value = params['l1l2_flag']
    ws_calc.Range('B171').Value = params['FlagL']
    ws_calc.Range('B172').Value = params['Flagb2H']
    ws_calc.Range('O173').Value = params['x2']
    ws_calc.Range('O176').Value = params['a_req1_Input']

    ws_calc.Range('B229').Value = params['de2Flag']
    ws_calc.Range('F251').Value = params['bearingType']

    ws_calc.Range('O397').Value = params['z1_req']
    ws_calc.Range('P397').Value = params['z2_req']
    ws_calc.Range('O398').Value = params['a_req']

    ws_calc.Range('O408').Value = params['XX_z1']
    ws_calc.Range('P408').Value = params['XX_z2']
    ws_calc.Range('O409').Value = params['XX_n1']
    ws_calc.Range('P409').Value = params['XX_n2_ratio']
    ws_calc.Range('O410').Value = params['XX_Mk2']
    ws_calc.Range('P410').Value = params['XX_n2']

    ws_calc.Range('B416').Value = params['dstFlag']
    ws_calc.Range('O417').Value = params['DXF_Beta']


def build_audit_list(ws_calc, ws_dxf, ws_data1):
    # Format: (Row, CellCoord, Name, Symbol, JS_Key, Tol)
    return [
        # --- SECTION 1.0: ĐỘNG HỌC & CÔNG SUẤT ---
        (119, 'O119', 'Công suất trục vít P1', 'Pw1', 'Pw1', 1e-6),
        (119, 'P119', 'Công suất bánh vít P2', 'Pw2', 'Pw2', 1e-6),
        (120, 'O120', 'Tốc độ trục vít n1', 'n1', 'n1', 1e-6),
        (120, 'P120', 'Tốc độ bánh vít n2', 'n2', 'n2', 1e-6),
        (121, 'O121', 'Mômen xoắn trục vít Mk1', 'Mk1', 'Mk1', 1e-6),
        (121, 'P121', 'Mômen xoắn bánh vít Mk2', 'Mk2', 'Mk2', 1e-6),
        (122, 'O122', 'Tỷ số truyền yêu cầu', 'iin', 'iin', 1e-6),
        (123, 'O123', 'Tỷ số truyền thực tế', 'i', 'i', 1e-6),
        (123, 'P123', 'Sai lệch tỷ số truyền', 'i_dev', 'i_dev', 1e-6),

        # --- SECTION 2.0: VẬT LIỆU & BÔI TRƠN ---
        (128, 'X128', 'Nhóm vật liệu bánh vít', 'MatTypeW', 'MatTypeW', 1e-6),
        (132, 'X132', 'Chỉ số nhóm bôi trơn', 'LubIndex', 'lubricationIndex', 1e-6),
        (135, 'O135', 'Độ nhớt động học ở 40°C', 'ny40', 'ny40', 1e-6),
        (135, 'P135', 'Độ nhớt động học ở 100°C', 'ny100', 'ny100', 1e-6),
        (136, 'T136', 'Khối lượng riêng dầu ở 15°C', 'rooil15', 'rooil15', 1e-6),
        (137, 'T137', 'Độ nhám bề mặt trục vít', 'Ra1', 'Ra1', 1e-6),
        (138, 'O138', 'Hệ số tải trọng động KA', 'KA', 'KA', 1e-6),
        (138, 'P138', 'Hệ số KA đề xuất', 'KA_Prop', 'KA_Prop', 1e-6),
        (380, 'O380', 'Khối lượng riêng trục vít Ro1', 'Ro1', 'Ro1', 1e-6),
        (380, 'P380', 'Khối lượng riêng bánh vít Ro2', 'Ro2', 'Ro2', 1e-6),
        (381, 'O381', 'Mô đun đàn hồi trục vít E1', 'E1', 'E1', 1e-6),
        (381, 'P381', 'Mô đun đàn hồi bánh vít E2', 'E2', 'E2', 1e-6),
        (382, 'O382', 'Giới hạn bền kéo Rm1', 'Rm1', 'Rm1', 1e-6),
        (382, 'P382', 'Giới hạn bền kéo Rm2', 'Rm2', 'Rm2', 1e-6),

        # --- SECTION 3.0: THÔNG SỐ BIÊN DẠNG RĂNG ---
        (147, 'O147', 'Hệ số chiều cao đỉnh răng trục vít', 'haXP', 'haXP', 1e-6),
        (147, 'X147', 'Hệ số chiều cao đỉnh răng bánh vít', 'haXG', 'haXG', 1e-6),
        (148, 'O148', 'Hệ số khe hở hướng tâm trục vít', 'caXP', 'caXP', 1e-6),
        (148, 'X148', 'Hệ số khe hở hướng tâm bánh vít', 'caXG', 'caXG', 1e-6),
        (149, 'O149', 'Hệ số bán kính góc lượn khuyến nghị', 'rf1_rec', 'rf1_rec', 1e-6),
        (150, 'O150', 'Hệ số bán kính góc lượn chân răng 1', 'rf1', 'rf1', 1e-6),
        (150, 'X150', 'Hệ số bán kính góc lượn chân răng 2', 'rf2', 'rf2', 1e-6),

        # --- SECTION 4.0: THIẾT KẾ HÌNH HỌC ĂN KHỚP ---
        (160, 'X160', 'Hệ số đường kính q khuyến nghị', 'q_rec', 'q_rec', 1e-6),
        (160, 'Y160', 'Đường kính d1 khuyến nghị', 'd1_rec', 'd1_rec', 1e-6),
        (161, 'O161', 'Số mối ren trục vít z1', 'z1', 'z1', 1e-6),
        (161, 'T161', 'Số răng bánh vít z2', 'z2', 'z2', 1e-6),
        (161, 'U161', 'Cờ cảnh báo cắt chân răng', 'Flag_z2min', 'Flag_z2min', 1e-6),
        (162, 'O162', 'Góc ăn khớp đầu vào', 'alfa_temp', 'alfa_temp', 1e-6),
        (163, 'O163', 'Hệ số đường kính trục vít q', 'q', 'q', 1e-6),
        (163, 'X163', 'Hệ số q tính toán', 'q_calc', 'q_calc', 1e-6),
        (164, 'T164', 'Đường kính vòng chia trục vít d1', 'd1', 'd1', 1e-6),
        (164, 'U164', 'Cờ cảnh báo đường kính đáy df1', 'Flag_d1min', 'Flag_d1min', 1e-6),
        (165, 'O165', 'Góc nâng ren trục vít gama', 'gama', 'gama', 1e-6),
        (167, 'T167', 'Mô đun thiết kế m_temp', 'm_temp', 'm_temp', 1e-6),
        (168, 'O168', 'Bước vòng CP (inch)', 'CP', 'CP', 1e-6),
        (168, 'P168', 'Mô đun Anh DP (1/in)', 'DP', 'DP', 1e-6),
        (169, 'T169', 'Khoảng cách ổ đỡ trái tự động l1_Units', 'l1_Units', 'l1_Units', 1e-6),
        (169, 'U169', 'Khoảng cách ổ đỡ phải tự động l2_Units', 'l2_Units', 'l2_Units', 1e-6),
        (169, 'X169', 'Số răng tối thiểu lý thuyết z2minTh', 'z2minTh', 'z2minTh', 1e-6),
        (170, 'T170', 'Khoảng cách ổ đỡ trái l1', 'l1', 'l1', 1e-6),
        (170, 'U170', 'Khoảng cách ổ đỡ phải l2', 'l2', 'l2', 1e-6),
        (170, 'X170', 'Số răng tối thiểu thực tế z2minPr', 'z2minPr', 'z2minPr', 1e-6),
        (171, 'P171', 'Chiều dài cắt ren đề xuất L_Proposal', 'L_Proposal', 'L_Proposal', 1e-6),
        (171, 'T171', 'Chiều dài phần cắt ren trục vít L', 'L', 'L', 1e-6),
        (171, 'X171', 'Hệ số dịch chỉnh tối thiểu xmin', 'xmin', 'xmin', 1e-6),
        (172, 'P172', 'Chiều rộng bánh vít đề xuất b2H_Proposal', 'b2H_Proposal', 'b2H_Proposal', 1e-6),
        (172, 'T172', 'Chiều rộng vành bánh vít b2H', 'b2H', 'b2H', 1e-6),
        (173, 'O173', 'Hệ số dịch chỉnh bánh vít x2', 'x2', 'x2', 1e-6),
        (174, 'X174', 'Hệ số x2 khớp khoảng cách trục a_req1', 'x_for_a', 'x_for_a', 1e-6),
        (175, 'X175', 'Khoảng cách trục tối thiểu theo x2', 'amin_dx', 'amin_dx', 1e-6),
        (175, 'Y175', 'Khoảng cách trục tối đa theo x2', 'amax_dx', 'amax_dx', 1e-6),
        (176, 'X176', 'Mô đun m khớp khoảng cách trục a_req1', 'm_for_a', 'm_for_a', 1e-6),
        (177, 'X177', 'Hệ số q khớp khoảng cách trục a_req1', 'q_for_a', 'q_for_a', 1e-6),
        (177, 'Y177', 'Khoảng cách trục tối thiểu theo q', 'amin_q', 'amin_q', 1e-6),
        (177, 'Z177', 'Khoảng cách trục tối đa theo q', 'amax_q', 'amax_q', 1e-6),
        (178, 'O178', 'Tổng khối lượng hộp giảm tốc', 'mass', 'mass', 1e-6),
        (178, 'P178', 'Khối lượng cặp trục vít + bánh vít', 'mass_gears', 'mass_gears', 1e-6),
        (179, 'O179', 'Hiệu suất tổng cộng (%)', 'etages_pct', 'etages_pct', 1e-6),
        (179, 'P179', 'Hiệu suất lý thuyết cực đại (%)', 'etamax_pct', 'etamax_pct', 1e-6),
        (179, 'X179', 'Khối lượng trục vít mass1', 'mass1', 'mass1', 1e-6),
        (180, 'X180', 'Khối lượng bánh vít mass2', 'mass2', 'mass2', 1e-6),
        (181, 'X181', 'Khối lượng vỏ hộp ước tính mass3', 'mass3', 'mass3', 1e-6),
        (185, 'X185', 'Góc nâng giới hạn tự hãm tĩnh', 'gama_SelfLock', 'gama_SelfLock', 1e-6),
        (185, 'Y185', 'Hệ số ma sát tĩnh etaStatic', 'etaStatic', 'etaStatic', 1e-6),

        # --- SECTION 5.0: KÍCH THƯỚC HÌNH HỌC CƠ BẢN (DIN 3975) ---
        (220, 'T220', 'Mô đun pháp tuyến mn', 'mn', 'mn', 1e-6),
        (220, 'U220', 'Mô đun mặt đầu mt', 'mt', 'mt', 1e-6),
        (220, 'V220', 'Mô đun dọc trục mx', 'mx', 'mx', 1e-6),
        (221, 'T221', 'Bước răng pháp tuyến pn', 'pn', 'pn', 1e-6),
        (221, 'U221', 'Bước răng mặt đầu pt', 'pt', 'pt', 1e-6),
        (221, 'V221', 'Bước răng dọc trục px', 'px', 'px', 1e-6),
        (222, 'M222', 'Góc ăn khớp pháp tuyến alfan', 'alfan', 'alfan', 1e-6),
        (222, 'O222', 'Góc ăn khớp mặt đầu alfat', 'alfat', 'alfat', 1e-6),
        (222, 'P222', 'Góc ăn khớp dọc trục alfax', 'alfax', 'alfax', 1e-6),
        (224, 'T224', 'Đường kính đỉnh trục vít da1', 'da1', 'da1', 1e-6),
        (224, 'U224', 'Đường kính đỉnh họng bánh vít da2', 'da2', 'da2', 1e-6),
        (225, 'O225', 'Đường kính vòng chia trục vít d1', 'd1', 'd1', 1e-6),
        (225, 'U225', 'Đường kính vòng chia bánh vít d2', 'd2', 'd2', 1e-6),
        (226, 'T226', 'Đường kính đáy trục vít df1', 'df1', 'df1', 1e-6),
        (226, 'U226', 'Đường kính đáy bánh vít df2', 'df2', 'df2', 1e-6),
        (227, 'T227', 'Đường kính lăn trục vít dw1', 'dw1', 'dw1', 1e-6),
        (227, 'U227', 'Đường kính lăn bánh vít dw2', 'dw2', 'dw2', 1e-6),
        (228, 'T228', 'Đường kính trung bình trục vít dm1', 'dm1', 'dm1', 1e-6),
        (228, 'U228', 'Đường kính trung bình bánh vít dm2', 'dm2', 'dm2', 1e-6),
        (229, 'U229', 'Đường kính ngoài lớn nhất bánh vít de2', 'de2', 'de2', 1e-6),
        (229, 'Z229', 'Đường kính ngoài đề xuất de2Prop', 'de2Prop', 'de2Prop', 1e-6),
        (231, 'Z231', 'Đường kính ngoài tối thiểu de2min', 'de2min', 'de2min', 1e-6),
        (231, 'AD231', 'Đường kính ngoài tối đa de2max', 'de2max', 'de2max', 1e-6),
        (230, 'T230', 'Chiều cao đỉnh răng trục vít ha1', 'ha1', 'ha1', 1e-6),
        (230, 'U230', 'Chiều cao đỉnh răng bánh vít ha2', 'ha2', 'ha2', 1e-6),
        (231, 'T231', 'Chiều cao chân răng trục vít hf1', 'hf1', 'hf1', 1e-6),
        (231, 'U231', 'Chiều cao chân răng bánh vít hf2', 'hf2', 'hf2', 1e-6),
        (232, 'T232', 'Khoảng cách trục thực tế a', 'a', 'a', 1e-6),
        (234, 'P234', 'Góc nâng trên vòng lăn gamaw', 'gamaw', 'gamaw', 1e-6),
        (234, 'X234', 'Góc nâng cơ sở gamab', 'gamab', 'gamab', 1e-6),
        (235, 'T235', 'Chiều dày răng pháp tuyến trục vít sn1', 'sn1', 'sn1', 1e-6),
        (235, 'U235', 'Chiều dày răng pháp tuyến bánh vít sn2', 'sn2', 'sn2', 1e-6),
        (236, 'T236', 'Chiều dày răng dọc trục trục vít sx1', 'sx1', 'sx1', 1e-6),
        (236, 'U236', 'Chiều dày răng dọc trục bánh vít sx2', 'sx2', 'sx2', 1e-6),
        (237, 'T237', 'Chiều rộng rãnh pháp tuyến trục vít en1', 'en1', 'en1', 1e-6),
        (237, 'U237', 'Chiều rộng rãnh pháp tuyến bánh vít en2', 'en2', 'en2', 1e-6),
        (238, 'T238', 'Chiều rộng rãnh dọc trục trục vít ex1', 'ex1', 'ex1', 1e-6),
        (238, 'U238', 'Chiều rộng rãnh dọc trục bánh vít ex2', 'ex2', 'ex2', 1e-6),

        # --- SECTION 6.0: HIỆU SUẤT & TỔN THẤT CÔNG SUẤT (DIN 3996) ---
        (241, 'T241', 'Vận tốc trượt trung bình vgm', 'vgm', 'vgm', 1e-6),
        (372, 'O372', 'Vận tốc vòng trục vít v1', 'v1', 'v1', 1e-6),
        (372, 'P372', 'Vận tốc vòng bánh vít v2', 'v2', 'v2', 1e-6),
        (242, 'O242', 'Hệ số kích thước YS', 'YS', 'YS', 1e-6),
        (243, 'O243', 'Hệ số hình học YG', 'YG', 'YG', 1e-6),
        (243, 'X243', 'Thông số chiều dày màng dầu h*', 'h_x', 'h_x', 1e-6),
        (244, 'O244', 'Hệ số vật liệu YW', 'YW', 'YW', 1e-6),
        (245, 'O245', 'Hệ số độ nhám YR', 'YR', 'YR', 1e-6),
        (246, 'O246', 'Hệ số ma sát cơ sở mu_0T', 'eta0T', 'eta0T', 1e-6),
        (247, 'O247', 'Hệ số ma sát răng trung bình mu_zm', 'etazm', 'etazm', 1e-6),
        (248, 'O248', 'Góc ma sát tương đương roz', 'roz', 'roz', 1e-6),
        (249, 'O249', 'Hiệu suất ăn khớp răng etaz', 'etaz', 'etaz', 1e-6),
        (250, 'O250', 'Tổn thất không tải PV0 (kW)', 'PV0', 'PV0', 1e-6),
        (250, 'U250', 'Tổn thất không tải PV0 (W)', 'PV0_W', 'PV0_W', 1e-6),
        (251, 'O251', 'Tổn thất ổ đỡ PVLP (kW)', 'PVLP', 'PVLP', 1e-6),
        (251, 'U251', 'Tổn thất ổ đỡ PVLP (W)', 'PVLP_W', 'PVLP_W', 1e-6),
        (252, 'O252', 'Tổn thất phớt làm kín PVD (kW)', 'PVD', 'PVD', 1e-6),
        (252, 'U252', 'Tổn thất phớt làm kín PVD (W)', 'PVD_W', 'PVD_W', 1e-6),
        (253, 'O253', 'Tổn thất ăn khớp răng PVz (kW)', 'PVz', 'PVz', 1e-6),
        (253, 'U253', 'Tổn thất ăn khớp răng PVz (W)', 'PVz_W', 'PVz_W', 1e-6),
        (254, 'O254', 'Tổng công suất tổn thất PV (kW)', 'PV', 'PV', 1e-6),
        (254, 'U254', 'Tổng công suất tổn thất PV (W)', 'PV_W', 'PV_W', 1e-6),
        (255, 'O255', 'Hiệu suất tổng cộng etages', 'etages', 'etages', 1e-6),

        # --- SECTION 12.0: KÍCH THƯỚC THEO TIÊU CHUẨN AGMA 6022-C93 ---
        (334, 'O334', 'Số mối ren AGMA NW', 'NW', 'NW', 1e-6),
        (334, 'P334', 'Số răng AGMA NG', 'NG', 'NG', 1e-6),
        (335, 'O335', 'Tỷ số truyền AGMA mG', 'mG', 'mG', 1e-6),
        (336, 'O336', 'Khoảng cách trục AGMA C (in)', 'C_agma', 'C_agma', 1e-6),
        (336, 'P336', 'Bước dọc trục AGMA px (in)', 'pitchx', 'pitchx', 1e-6),
        (338, 'O338', 'Đường kính chia trục vít d (in)', 'd_LC', 'd_LC', 1e-6),
        (338, 'P338', 'Đường kính chia bánh vít D (in)', 'D_UC', 'D_UC', 1e-6),
        (339, 'O339', 'Bước xoắn vít AGMA L (in)', 'Lead_agma', 'Lead_agma', 1e-6),
        (339, 'P339', 'Góc nâng vít AGMA lambda (deg)', 'leadAngle_agma', 'leadAngle_agma', 1e-6),
        (340, 'O340', 'Chiều cao đỉnh răng AGMA a (in)', 'addendum_agma', 'addendum_agma', 1e-6),
        (340, 'P340', 'Chiều cao chân răng AGMA b (in)', 'dedendum_agma', 'dedendum_agma', 1e-6),
        (341, 'O341', 'Đường kính đỉnh trục vít do (in)', 'do1_agma', 'do1_agma', 1e-6),
        (341, 'P341', 'Đường kính ngoài bánh vít Do (in)', 'Do2_agma', 'Do2_agma', 1e-6),
        (342, 'O342', 'Đường kính đáy trục vít dr (in)', 'dr_agma', 'dr_agma', 1e-6),
        (342, 'P342', 'Đường kính họng bánh vít Dt (in)', 'Dt_agma', 'Dt_agma', 1e-6),
        (343, 'O343', 'Khe hở hướng tâm AGMA c (in)', 'clearance_agma', 'clearance_agma', 1e-6),
        (344, 'O344', 'Chiều dài ren trục vít FWmax (in)', 'FWmax_agma', 'FWmax_agma', 1e-6),
        (344, 'P344', 'Chiều rộng bánh vít FG (in)', 'FG_agma', 'FG_agma', 1e-6),
        (344, 'T344', 'Chiều dài ren trục vít FWmax (mm)', 'FWmax_agma_mm', 'FWmax_agma_mm', 1e-6),
        (344, 'U344', 'Chiều rộng bánh vít FG (mm)', 'FG_agma_mm', 'FG_agma_mm', 1e-6),

        # --- SECTION 17.0 & 18.0: ĐƯỜNG KÍNH TRỤC SƠ BỘ & PHỤ TRỢ ---
        (404, 'O404', 'Đường kính trục vít hợp kim d_s1A', 'ShaftDA1', 'ShaftDA1', 1e-6),
        (404, 'P404', 'Đường kính trục bánh vít hợp kim d_s2A', 'ShaftDA2', 'ShaftDA2', 1e-6),
        (405, 'O405', 'Đường kính trục vít thép thường d_s1B', 'ShaftDB1', 'ShaftDB1', 1e-6),
        (405, 'P405', 'Đường kính trục bánh vít thép thường d_s2B', 'ShaftDB2', 'ShaftDB2', 1e-6),
        (408, 'R408', 'Tỷ số truyền phụ trợ 18.1', 'XXX_i', 'XXX_i', 1e-6),
        (409, 'R409', 'Tỷ số truyền phụ trợ 18.2', 'XX_i', 'XX_i', 1e-6),
        (410, 'R410', 'Công suất phụ trợ 18.3', 'XX_Pw2', 'XX_Pw2', 1e-6),

        # --- SECTION 19.0: THÔNG SỐ BẢN VẼ CAD & DXFTABLES ---
        (415, 'X415', 'Tỷ lệ bản vẽ tự động DXF_AutoScale', 'DXF_AutoScale', 'DXF_AutoScale', 1e-6),
        (416, 'O416', 'Đường kính vai trục vít ds', 'Shaft_ds', 'Shaft_ds', 1e-6),
        (416, 'P416', 'Bề rộng vai trục vít t', 'Shaft_th', 'Shaft_th', 1e-6),
        (417, 'O417', 'Góc vát mép vành bánh vít Beta', 'DXF_Beta', 'DXF_Beta', 1e-6),
    ]


def run_deep_audit():
    print("=" * 115)
    print(" RÀ SOÁT SONG SONG TỪNG DÒNG CÔNG THỨC TRỤC VÍT - BÁNH VÍT (WEB APP vs MITCALC 1.74 Gear4_01.xlsb)")
    print("=" * 115)

    excel = win32com.client.Dispatch('Excel.Application')
    excel.Visible = False
    excel.DisplayAlerts = False
    excel.AutomationSecurity = 1

    wb = excel.Workbooks.Open(r'C:\MITCalc\gear4\Gear4_01.xlsb', False, True)
    ws_calc = wb.Sheets('Calculation')
    ws_dxf = wb.Sheets('DXFTables')
    ws_data1 = wb.Sheets('Data1')

    tests_dir = os.path.dirname(os.path.abspath(__file__))
    worm_dir = os.path.dirname(tests_dir)
    html_path = os.path.join(worm_dir, "index.html")
    file_url = "file:///" + html_path.replace("\\", "/")

    base_params = {
        'poweredWoWh': 1, 'Pw2': 3.0, 'n1': 1500.0, 'iin': 40.0,
        'matP': 41, 'matW': 7, 'toothType': 2, 'loadTypeA': 1, 'loadTypeB': 1,
        'designCooling': 1, 'oilType': 3, 'lubricant': 6,
        'ny40': 220.0, 'ny100': 40.0, 'rooil15': 1.06, 'Ra1': 0.5,
        'kaFlag': True, 'KA': 1.0,
        'haXP': 1.0, 'caXP': 0.25, 'rf1Flag': True, 'rf1': 0.3799508411451843,
        'z1': 1, 'alfa_temp': 20.0, 'calc_q': 1, 'q': 8.5,
        'd1_Input': 36.23149719358681, 'gama': 6.709836807756933,
        'teethOrientation': 1, 'm_Input': 25.4 / 6.0,
        'l1_proc': 50.0, 'l2_proc': 50.0, 'l1l2_flag': True, 'FlagL': True, 'Flagb2H': True,
        'x2': 0.0, 'a_req1_Input': 100.0, 'de2Flag': True, 'bearingType': 1,
        'z1_req': 1, 'z2_req': 50, 'a_req': 180.0,
        'XX_z1': 2.0, 'XX_z2': 41.0, 'XX_n1': 1600.0, 'XX_n2_ratio': 80.0,
        'XX_Mk2': 300.0, 'XX_n2': 3.75,
        'dstFlag': True, 'DXF_Beta': 10.0
    }

    test_cases = [
        ("KỊCH BẢN 1: Chuẩn Mặc Định SI (Hệ ZN, calc_q=1, z1=1, z2=40, q=8.5, Bôi trơn ngâm dầu PEG)", dict(base_params)),
        ("KỊCH BẢN 2: Hệ Trục Vít Acsimet ZA + Dịch Chỉnh x2=0.25 + Mô-đun m=4.0 + Dầu Khoáng", {
            **base_params,
            'toothType': 1, 'z1': 2, 'iin': 20.0, 'q': 10.0, 'm_Input': 4.0, 'x2': 0.25,
            'designCooling': 2, 'oilType': 1, 'bearingType': 2, 'loadTypeA': 2, 'loadTypeB': 2
        }),
        ("KỊCH BẢN 3: Chế Độ Nhập Đường Kính d1 Trực Tiếp (calc_q=2, d1=45.0 mm, Hệ ZN, x2=-0.10)", {
            **base_params,
            'toothType': 2, 'calc_q': 2, 'z1': 2, 'iin': 25.0, 'd1_Input': 45.0, 'm_Input': 4.0, 'x2': -0.10
        }),
        ("KỊCH BẢN 4: Chế Độ Nhập Góc Nâng gama Trực Tiếp (calc_q=3, gama=12.5°, Phun dầu PAO, Ổ trượt)", {
            **base_params,
            'toothType': 2, 'calc_q': 3, 'z1': 3, 'iin': 15.0, 'gama': 12.5, 'm_Input': 5.0,
            'designCooling': 3, 'oilType': 2, 'bearingType': 3
        }),
        ("KỊCH BẢN 5: Bánh Vít Gang Xám (MatW=9, MatTypeW=2) + Bánh Vít Chủ Động (poweredWoWh=2)", {
            **base_params,
            'poweredWoWh': 2, 'matW': 9, 'z1': 4, 'iin': 10.0, 'q': 9.0, 'm_Input': 6.3
        }),
    ]

    total_checks_all = 0
    total_passed_all = 0

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(file_url)
            page.wait_for_load_state('networkidle')

            for case_idx, (case_title, params) in enumerate(test_cases, start=1):
                print(f"\n{'=' * 115}")
                print(f" [{case_idx}/{len(test_cases)}] {case_title}")
                print(f"{'=' * 115}")

                set_excel_inputs(ws_calc, params)
                excel.CalculateFull()

                # Run VBA CellTransmitVal equivalent in Excel for calc_q modes 1/2/3 & auto flags
                # Note: In Excel, Worksheet_Calculate triggers CellTransmitVal automatically when open,
                # or we sync the transmitted cells exactly as CellTransmitVal does:
                if params['kaFlag']:
                    ws_calc.Range('O138').Value = ws_calc.Range('P138').Value
                if params['rf1Flag']:
                    ws_calc.Range('O150').Value = ws_calc.Range('O149').Value
                if params['calc_q'] == 1:
                    ws_calc.Range('O165').Value = ws_calc.Range('X165').Value
                    excel.CalculateFull()
                    ws_calc.Range('O164').Value = ws_calc.Range('X164').Value
                elif params['calc_q'] == 2:
                    for _ in range(30):
                        ws_calc.Range('O163').Value = ws_calc.Range('X163').Value
                        ws_calc.Range('O165').Value = ws_calc.Range('X165').Value
                        excel.CalculateFull()
                elif params['calc_q'] == 3:
                    ws_calc.Range('O164').Value = ws_calc.Range('X164').Value
                    excel.CalculateFull()
                    ws_calc.Range('O163').Value = ws_calc.Range('X163').Value
                excel.CalculateFull()

                if params['l1l2_flag']:
                    ws_calc.Range('O170').Value = ws_calc.Range('T169').Value
                    ws_calc.Range('P170').Value = ws_calc.Range('U169').Value
                if params['FlagL']:
                    ws_calc.Range('O171').Value = ws_calc.Range('P171').Value
                if params['Flagb2H']:
                    ws_calc.Range('O172').Value = ws_calc.Range('P172').Value
                excel.CalculateFull()

                if params['de2Flag']:
                    ws_calc.Range('O229').Value = ws_calc.Range('Z229').Value
                if params['dstFlag']:
                    ws_calc.Range('O416').Value = ws_calc.Range('X416').Value
                    ws_calc.Range('P416').Value = ws_calc.Range('X417').Value
                excel.CalculateFull()

                js_res = page.evaluate("(inputs) => WormCalcEngine.calculate(inputs)", params)

                audit_rows = build_audit_list(ws_calc, ws_dxf, ws_data1)
                case_passed = 0
                case_failed = 0

                if case_idx == 1:
                    print(f"{'Dòng':<5} | {'Ô':<6} | {'Tên thông số':<40} | {'Giá trị Excel':>16} | {'Giá trị Web App':>16} | {'Sai số Δ':>12} | {'KQ'}")
                    print("-" * 115)

                for row_num, cell_coord, name, sym, js_key, tol in audit_rows:
                    ex_val = float(ws_calc.Range(cell_coord).Value)
                    js_val = float(js_res[js_key])
                    delta = abs(ex_val - js_val)
                    ok = delta <= tol
                    total_checks_all += 1
                    if ok:
                        case_passed += 1
                        total_passed_all += 1
                    else:
                        case_failed += 1

                    if case_idx == 1 or not ok:
                        status = "PASS" if ok else "FAIL ❌"
                        print(f"{row_num:<5} | {cell_coord:<6} | {name:<40} | {ex_val:>16.6f} | {js_val:>16.6f} | {delta:>12.6f} | {status}")

                print(f"--> Kết quả Kịch bản {case_idx}: {case_passed}/{len(audit_rows)} thông số đạt chuẩn PASS (Δ = 0.000000)")

            browser.close()
    finally:
        wb.Close(SaveChanges=False)
        excel.Quit()

    print("\n" + "=" * 115)
    print(f" TỔNG KẾT RÀ SOÁT TOÀN DIỆN MODULE 3 (TRỤC VÍT - BÁNH VÍT): {total_passed_all}/{total_checks_all} PASS ({total_passed_all * 100.0 / total_checks_all:.1f}%)")
    print("=" * 115)
    if total_passed_all != total_checks_all:
        sys.exit(1)


if __name__ == '__main__':
    run_deep_audit()
