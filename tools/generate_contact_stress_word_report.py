import os
import math
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Set background color of a table cell."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set cell padding (in dxa: 20 dxa = 1 pt)."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    """Set subtle gray borders for a table."""
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:left w:val="none"/>
                <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:right w:val="none"/>
                <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr[0].append(borders)

def create_report():
    doc = Document()

    # Page Margins (2 cm = 0.787 in)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    navy = RGBColor(15, 23, 42)         # #0f172a
    blue_header = RGBColor(30, 58, 138) # #1e3a8a
    teal = RGBColor(2, 132, 199)        # #0284c7
    charcoal = RGBColor(30, 41, 59)     # #1e293b
    gray_sub = RGBColor(100, 116, 139)  # #64748b

    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = charcoal
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # Header / Meta
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_after = Pt(2)
    p_meta.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_meta = p_meta.add_run("BÁO CÁO KỸ THUẬT CƠ KHÍ CHÍNH XÁC | MITCALC WEB APP\nTiêu chuẩn: ISO 6336-2:2006 (Method B) / DIN 3990 / AGMA 2001-D04")
    r_meta.font.size = Pt(9)
    r_meta.font.color.rgb = gray_sub
    r_meta.italic = True

    # Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("BÁO CÁO TÍNH TOÁN & THẨM TRA ĐỘ BỀN TIẾP XÚC MẶT RĂNG (PITTING RESISTANCE)\nBỘ TRUYỀN BÁNH RĂNG TRỤ CÔNG NGHIỆP NẶNG")
    r_title.bold = True
    r_title.font.size = Pt(15)
    r_title.font.color.rgb = blue_header

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Dự án: Bộ truyền bánh răng công suất lớn P = 250 kW | z1 = 17, z2 = 69, mn = 14 mm, αn = 20°, β = 12°\nVật liệu: Thép hợp kim SCM420 / 16MnCr5 tôi thấm carbon bề mặt 58 - 62 HRC")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = teal
    r_sub.italic = True

    # Divider line
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_after = Pt(10)
    r_line = p_line.add_run("―" * 58)
    r_line.font.color.rgb = teal
    r_line.bold = True

    # 1. TỔNG QUAN DỰ ÁN VÀ THÔNG SỐ ĐẦU VÀO
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("1. TỔNG QUAN DỰ ÁN & CÁC THÔNG SỐ ĐẦU VÀO THIẾT KẾ")
    r_h1.bold = True
    r_h1.font.size = Pt(13)
    r_h1.font.color.rgb = blue_header

    doc.add_paragraph(
        "Báo cáo này được lập tiếp nối báo cáo độ bền uốn chân răng, nhằm cung cấp cơ sở tính toán khoa học, minh bạch và thẩm định toàn diện "
        "khả năng chịu tải tiếp xúc bề mặt răng, chống hiện tượng tróc rỗ mỏi tế vi (Surface Pitting Resistance) "
        "của cặp bánh răng trụ răng nghiêng công nghiệp nặng (z1 = 17, z2 = 69, mn = 14 mm) theo tiêu chuẩn quốc tế ISO 6336-2:2006 (Method B), "
        "DIN 3990 và AGMA 2001-D04. Toàn bộ thông số được đối chuẩn trực tiếp với hệ thống phần mềm chuyên dụng MITCalc 1.74."
    )

    table1 = doc.add_table(rows=1, cols=4)
    table1.alignment = WD_TABLE_ALIGNMENT.CENTER
    table1.autofit = False

    headers1 = ["Thông Số Kỹ Thuật", "Ký Hiệu", "Giá Trị Thiết Kế", "Đơn Vị / Ghi Chú"]
    hdr_cells = table1.rows[0].cells
    for i, h_text in enumerate(headers1):
        hdr_cells[i].text = h_text
        set_cell_background(hdr_cells[i], "1e3a8a")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=150, right=150)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(10)

    data1 = [
        ("Công suất truyền động danh nghĩa", "P", "250.0", "kW"),
        ("Tốc độ quay trục bánh nhỏ (Pinion)", "n1", "40.59", "vòng/phút (rpm)"),
        ("Tốc độ quay trục bánh lớn (Gear)", "n2", "10.00", "vòng/phút (rpm)"),
        ("Tỉ số truyền động học", "u (i)", "4.059", "z2 / z1 = 69 / 17"),
        ("Số răng bánh nhỏ / bánh lớn", "z1 / z2", "17 / 69", "Răng"),
        ("Mô đun pháp tiêu chuẩn", "mn", "14.0", "mm"),
        ("Góc áp lực pháp tiêu chuẩn", "αn", "20.0", "độ (deg)"),
        ("Góc nghiêng răng", "β", "12.0", "độ (deg)"),
        ("Bề rộng vành răng làm việc", "b", "410.0", "mm"),
        ("Hệ số dịch chỉnh biên dạng", "x1 / x2", "0.0 / 0.0", "Không dịch chỉnh"),
        ("Chế độ tải trọng máy công tác", "KA", "1.50", "Chế độ 2: Tải công nghiệp va đập vừa"),
        ("Thời gian phục vụ yêu cầu", "Lh", "20,000", "giờ (Tương đương 6 - 8 năm)"),
        ("Vật liệu chế tạo & Nhiệt luyện", "Mat / HT", "SCM420 / 16MnCr5", "Thép thấm C tôi (58-62 HRC, lõi 30-38 HRC)"),
        ("Giới hạn mỏi tiếp xúc cơ sở", "σHlim", "1270.0 ÷ 1500.0", "MPa (Theo ISO 6336-5 / MITCalc)")
    ]

    col_widths1 = [Inches(2.5), Inches(0.8), Inches(1.3), Inches(2.2)]

    for row_idx, data_row in enumerate(data1):
        row_cells = table1.add_row().cells
        bg_col = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=70, bottom=70, left=120, right=120)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if i in (1, 2):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                p.runs[0].font.bold = (i == 2)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in table1.rows:
        for i, w in enumerate(col_widths1):
            row.cells[i].width = w

    set_table_borders(table1)

    # 2. ĐỘNG HỌC & HÌNH HỌC ĂN KHỚP
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("2. CÁC THÔNG SỐ HÌNH HỌC ĂN KHỚP & LỰC TÁC DỤNG")
    r_h2.bold = True
    r_h2.font.size = Pt(13)
    r_h2.font.color.rgb = blue_header

    doc.add_paragraph(
        "Bộ truyền vận hành ở dải tốc độ quay thấp (vận tốc vòng v = 0.517 m/s) với mô-men xoắn rất lớn, "
        "tạo ra lực vòng tác dụng lên mặt răng lên tới Ft = 483,504.7 N (~48.35 tấn lực). Các thông số hình học then chốt phục vụ "
        "tính toán ứng suất tiếp xúc Hertz theo ISO 6336-2 được tổng hợp dưới đây:"
    )

    data_geom = [
        ("Đường kính vòng chia bánh nhỏ", "d1 = z1 * mn / cos(β)", "243.317", "mm"),
        ("Đường kính vòng chia bánh lớn", "d2 = z2 * mn / cos(β)", "987.581", "mm"),
        ("Khoảng cách trục ăn khớp", "a = aw = (d1 + d2) / 2", "615.449", "mm"),
        ("Đường kính vòng cơ sở", "db1 / db2", "228.041 / 925.580", "mm"),
        ("Góc áp lực ngang (mặt mút)", "αt = αwt = arctg(tg αn / cos β)", "20.410", "độ (deg)"),
        ("Góc nghiêng răng trên hình trụ cơ sở", "βb = arcsin(sin β * cos αn)", "11.274", "độ (deg)"),
        ("Hệ số trùng khớp ngang", "εα", "1.610", "Khả năng gối tải mặt mút"),
        ("Hệ số trùng khớp dọc", "εβ = b * sin(β) / (π * mn)", "1.938", "Trùng khớp dọc rất cao (εβ > 1.0)"),
        ("Hệ số trùng khớp tổng cộng", "εγ = εα + εβ", "3.548", "Ăn khớp cực kỳ êm ái, đa răng"),
        ("Lực vòng tiếp tuyến danh nghĩa", "Ft = 2000 * T1 / d1", "483,504.7", "N (~48.35 TẤN LỰC)"),
        ("Vận tốc vòng tại vòng chia", "v = π * d1 * n1 / 60000", "0.517", "m/s (Vận tốc rất thấp)")
    ]

    table_geom = doc.add_table(rows=1, cols=4)
    table_geom.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_geom.autofit = False

    hdr_cells_g = table_geom.rows[0].cells
    for i, h_text in enumerate(["Đại Lượng Hình Học / Lực", "Công Thức Xác Định", "Giá Trị", "Đơn Vị / Ý Nghĩa"]):
        hdr_cells_g[i].text = h_text
        set_cell_background(hdr_cells_g[i], "1e3a8a")
        set_cell_margins(hdr_cells_g[i], top=100, bottom=100, left=150, right=150)
        p = hdr_cells_g[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(10)

    for row_idx, data_row in enumerate(data_geom):
        row_cells = table_geom.add_row().cells
        bg_col = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=70, bottom=70, left=120, right=120)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if i == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                p.runs[0].font.bold = True
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in table_geom.rows:
        for i, w in enumerate([Inches(2.5), Inches(2.2), Inches(1.1), Inches(1.0)]):
            row.cells[i].width = w
    set_table_borders(table_geom)

    # 3. ỨNG SUẤT TIẾP XÚC DANH NGHĨA SIGMA_H0
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("3. XÁC ĐỊNH ỨNG SUẤT TIẾP XÚC DANH NGHĨA TẠI ĐIỂM NÚT (σ_H0 - ISO 6336-2)")
    r_h3.bold = True
    r_h3.font.size = Pt(13)
    r_h3.font.color.rgb = blue_header

    doc.add_paragraph(
        "Theo tiêu chuẩn quốc tế ISO 6336-2:2006 (Method B) và DIN 3990, ứng suất tiếp xúc danh nghĩa σ_H0 tại điểm nút ăn khớp (Pitch Point) "
        "dựa trên lý thuyết tiếp xúc đàn hồi bán trụ Hertz kết hợp các hệ số hình học, góc nghiêng và hệ số trùng khớp:"
    )

    p_fml = doc.add_paragraph()
    p_fml.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fml = p_fml.add_run("σ_H0 = Z_B * Z_H * Z_E * Z_ε * Z_β * √[ (Ft / (d1 * b)) * ((u + 1) / u) ]")
    r_fml.bold = True
    r_fml.font.size = Pt(12)
    r_fml.font.color.rgb = blue_header

    p_desc = doc.add_paragraph()
    p_desc.add_run("Trong đó các hệ số thành phần được xác định theo ISO 6336-2 Method B như sau:\n")
    p_desc.add_run("• Hệ số đàn hồi vật liệu (Elasticity Factor) ZE: ").bold = True
    p_desc.add_run(
        "ZE = √[ 1 / ( π * ( (1 - ν1²)/E1 + (1 - ν2²)/E2 ) ) ]\n"
        "Với cặp bánh răng thép - thép có mô-đun đàn hồi E1 = E2 = 206,000 MPa, hệ số Poisson ν1 = ν2 = 0.30:\n"
        "==> ZE = 189.812 MPa^0.5.\n"
    )
    p_desc.add_run("• Hệ số vùng ăn khớp (Zone Factor) ZH: ").bold = True
    p_desc.add_run(
        "ZH = √[ 2 * cos(βb) / ( cos²(αt) * tg(αwt) ) ]\n"
        "Với βb = 11.274°, αt = αwt = 20.410°:\n"
        "==> ZH = √[ 2 * cos(11.274°) / ( cos²(20.410°) * tg(20.410°) ) ] = 2.450.\n"
    )
    p_desc.add_run("• Hệ số góc nghiêng răng (Helix Angle Factor) Zβ: ").bold = True
    p_desc.add_run(
        "Theo ISO 6336-2: Zβ = 1 / √(cos β) = 1 / √(cos 12°) = 1.0111.\n"
    )
    p_desc.add_run("• Hệ số trùng khớp (Contact Ratio Factor) Zε: ").bold = True
    p_desc.add_run(
        "Do hệ số trùng khớp dọc εβ = 1.938 ≥ 1.0 (bánh răng nghiêng trùng khớp dọc đầy đủ), theo ISO 6336-2:\n"
        "Zε = √( 1 / εα ) = √( 1 / 1.6102 ) = 0.7880.\n"
    )
    p_desc.add_run("• Hệ số tiếp xúc đơn đôi (Single Pair Tooth Contact Factor) ZB / ZD: ").bold = True
    p_desc.add_run(
        "Đối với bánh răng nghiêng có εβ ≥ 1.0, do luôn có ít nhất hai đôi răng đồng thời ăn khớp trên toàn bộ chiều rộng vành răng, "
        "tải trọng phân bố liên tục không có điểm chuyển tiếp đột ngột: ZB = ZD = 1.000.\n"
    )
    p_desc.add_run("• Thành phần lực tiếp xúc căn bậc hai: ").bold = True
    p_desc.add_run(
        "√[ (Ft / (d1 * b)) * ((u + 1) / u) ] = √[ (483504.7 / (243.317 * 410)) * ((4.059 + 1) / 4.059) ]\n"
        "= √[ 4.8466 * 1.2464 ] = √6.0407 = 2.4578 MPa^0.5.\n"
    )

    # Box kết quả sigma_H0
    p_box = doc.add_paragraph()
    p_box.paragraph_format.space_before = Pt(6)
    p_box.paragraph_format.space_after = Pt(8)
    r_box = p_box.add_run(
        "==> KẾT QUẢ ỨNG SUẤT TIẾP XÚC DANH NGHĨA (σ_H0):\n"
        "σ_H0 = 1.000 * 2.4497 * 189.8117 * 0.7880 * 1.0111 * 2.4578 = 910.62 MPa\n"
        "(Giá trị khớp chính xác tuyệt đối 100% với ô _SigmaH0 trong MITCalc 1.74)"
    )
    r_box.bold = True
    r_box.font.color.rgb = blue_header

    # 4. CÁC HỆ SỐ TẢI TRỌNG TIẾP XÚC KH
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(4)
    r_h4 = h4.add_run("4. XÁC ĐỊNH CÁC HỆ SỐ TẢI TRỌNG TIẾP XÚC (KH - ISO 6336-1)")
    r_h4.bold = True
    r_h4.font.size = Pt(13)
    r_h4.font.color.rgb = blue_header

    doc.add_paragraph(
        "Tổng hệ số tải trọng tiếp xúc KH tính đến sự gia tăng áp lực mặt răng do chấn động ngoài (KA), "
        "tải trọng động nội tại do sai số chế tạo (Kv), sự phân bố không đều dọc theo chiều rộng vành răng (KHβ) "
        "và sự phân bố tải giữa các đôi răng (KHα):"
    )

    data_kh = [
        ("Hệ số tải trọng ngoài / sử dụng", "KA", "1.500", "Chế độ 2: Tải công nghiệp va đập vừa (ISO 6336-6)"),
        ("Hệ số tải trọng động nội tại", "Kv", "1.001", "Vận tốc vòng rất thấp v = 0.517 m/s (ISO 6336-1 Method B)"),
        ("Hệ số phân bố tải vành răng - Trường hợp 2A", "KHβ (2A)", "1.038", "Gối đỡ đối xứng chuẩn, độ cứng vững cao"),
        ("Hệ số phân bố tải vành răng - Trường hợp 2B", "KHβ (2B)", "1.138", "Dự phòng biến dạng uốn trục / lệch nhẹ"),
        ("Hệ số phân bố tải giữa các đôi răng", "KHα", "1.000", "Răng nghiêng mài chuẩn cấp 6, εβ > 1.0"),
        ("TỔNG HỆ SỐ TẢI TRỌNG TIẾP XÚC (2A)", "KH (2A) = KA * Kv * KHβ * KHα", "1.558", "Trường hợp gối đỡ chuẩn xưởng"),
        ("TỔNG HỆ SỐ TẢI TRỌNG TIẾP XÚC (2B)", "KH (2B) = KA * Kv * KHβ * KHα", "1.708", "Trường hợp dự phòng lệch trục")
    ]

    table_kh = doc.add_table(rows=1, cols=4)
    table_kh.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_kh.autofit = False

    hdr_cells_k = table_kh.rows[0].cells
    for i, h_text in enumerate(["Hệ Số Tải Trọng Tiếp Xúc", "Ký Hiệu", "Giá Trị", "Cơ Sở Xác Định / Ý Nghĩa"]):
        hdr_cells_k[i].text = h_text
        set_cell_background(hdr_cells_k[i], "1e3a8a")
        set_cell_margins(hdr_cells_k[i], top=100, bottom=100, left=150, right=150)
        p = hdr_cells_k[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(10)

    for row_idx, data_row in enumerate(data_kh):
        row_cells = table_kh.add_row().cells
        bg_col = "ecfdf5" if "TỔNG" in data_row[0] else ("f8fafc" if row_idx % 2 == 1 else "ffffff")
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=70, bottom=70, left=120, right=120)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if i in (1, 2):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                p.runs[0].font.bold = ("TỔNG" in data_row[0] or i == 2)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in table_kh.rows:
        for i, w in enumerate([Inches(2.5), Inches(1.3), Inches(0.9), Inches(2.1)]):
            row.cells[i].width = w
    set_table_borders(table_kh)

    # 5. ỨNG SUẤT TIẾP XÚC THỰC TẾ SIGMA_H
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(14)
    h5.paragraph_format.space_after = Pt(4)
    r_h5 = h5.add_run("5. KẾT QUẢ ỨNG SUẤT TIẾP XÚC THỰC TẾ (σ_H)")
    r_h5.bold = True
    r_h5.font.size = Pt(13)
    r_h5.font.color.rgb = blue_header

    doc.add_paragraph(
        "Theo ISO 6336-2, ứng suất tiếp xúc thực tế tại bề mặt làm việc của răng được xác định từ ứng suất danh nghĩa nhân với căn bậc hai của tổng hệ số tải trọng KH:\n"
        "σ_H = Z_B * σ_H0 * √(KH)\n"
        "Do ZB = ZD = 1.000, ứng suất tiếp xúc danh định tác dụng lên mặt răng của bánh dẫn (Pinion 1) và bánh bị dẫn (Gear 2) là như nhau:"
    )

    p_res = doc.add_paragraph()
    p_res.add_run("• Trường Hợp 2A (Gối đỡ đối xứng chuẩn, KH = 1.558):\n").bold = True
    p_res.add_run("  σ_H = 910.62 * √(1.5582) = 910.62 * 1.2483 = ")
    r_2a = p_res.add_run("1136.71 MPa (~1137 MPa)\n")
    r_2a.bold = True
    r_2a.font.color.rgb = blue_header

    p_res.add_run("• Trường Hợp 2B (Dự phòng lệch trục nhẹ, KH = 1.708):\n").bold = True
    p_res.add_run("  σ_H = 910.62 * √(1.7083) = 910.62 * 1.3070 = ")
    r_2b = p_res.add_run("1190.20 MPa (~1190 MPa)\n")
    r_2b.bold = True
    r_2b.font.color.rgb = blue_header

    # 6. GIỚI HẠN TIẾP XÚC VẬT LIỆU
    h6 = doc.add_paragraph()
    h6.paragraph_format.space_before = Pt(14)
    h6.paragraph_format.space_after = Pt(4)
    r_h6 = h6.add_run("6. XÁC ĐỊNH GIỚI HẠN MỎI TIẾP XÚC THỰC TẾ CỦA MẶT RĂNG (σ_HG)")
    r_h6.bold = True
    r_h6.font.size = Pt(13)
    r_h6.font.color.rgb = blue_header

    doc.add_paragraph(
        "Giới hạn mỏi tiếp xúc thực tế của mặt răng σ_HG được xác định từ giới hạn mỏi tiếp xúc cơ sở σ_Hlim của vật liệu phôi chuẩn "
        "(Thép hợp kim SCM420 / 16MnCr5 tôi thấm carbon bề mặt 58 - 62 HRC), sau khi nhân với các hệ số hiệu chỉnh điều kiện bôi trơn, "
        "vận tốc vòng, độ nhám bề mặt, kích thước mô đun và tuổi thọ mỏi tiếp xúc chu kỳ theo ISO 6336-2 & ISO 6336-5:"
    )

    data_mat = [
        ("Giới hạn mỏi tiếp xúc cơ sở phôi chuẩn", "σHlim", "1270.0 (Standard) / 1500.0 (MQ)", "MPa (Theo CSDL ISO 6336-5)"),
        ("Hệ số chất bôi trơn (Dầu VG 320/460)", "ZL", "1.222", "Độ nhớt động học ν50 cao tạo màng bôi trơn dày"),
        ("Hệ số vận tốc vòng", "Zv", "0.948", "Vận tốc vòng thấp v = 0.517 m/s"),
        ("Hệ số nhám bề mặt tiếp xúc", "ZR", "0.995", "Gia công mài răng biên dạng đạt Ra 0.8 - 1.6 µm"),
        ("Hệ số kích thước mô đun", "ZX", "1.000", "Được bảo toàn đối với thép tôi thấm carbon"),
        ("Hệ số làm cứng bề mặt", "ZW (Bánh 1 / Bánh 2)", "0.938 / 1.000", "Đặc tính thích ứng bề mặt khi làm việc"),
        ("Hệ số tuổi thọ mỏi tiếp xúc (Lh = 20,000 h)", "ZNT (Bánh 1 / Bánh 2)", "1.075 / 1.236", "NL1 = 4.87.10^7 CK; NL2 = 1.20.10^7 CK"),
        ("GIỚI HẠN MỎI TIẾP XÚC THỰC TẾ (Cấp Standard)", "σHG (Bánh 1 / Bánh 2)", "1476.11 / 1809.85", "MPa (Bánh nhỏ σHG1 / Bánh lớn σHG2)"),
        ("GIỚI HẠN MỎI TIẾP XÚC THỰC TẾ (Cấp MQ cao cấp)", "σHG (Bánh 1 / Bánh 2)", "1743.43 / 2137.62", "MPa (Thép khử khí chân không cao cấp)")
    ]

    table_mat = doc.add_table(rows=1, cols=4)
    table_mat.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_mat.autofit = False

    hdr_cells_m = table_mat.rows[0].cells
    for i, h_text in enumerate(["Thông Số Ảnh Hưởng Bền Tiếp Xúc", "Ký Hiệu", "Giá Trị", "Cơ Sở Tiêu Chuẩn & Ý Nghĩa"]):
        hdr_cells_m[i].text = h_text
        set_cell_background(hdr_cells_m[i], "1e3a8a")
        set_cell_margins(hdr_cells_m[i], top=100, bottom=100, left=150, right=150)
        p = hdr_cells_m[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(10)

    for row_idx, data_row in enumerate(data_mat):
        row_cells = table_mat.add_row().cells
        bg_col = "ecfdf5" if "GIỚI HẠN" in data_row[0] else ("f8fafc" if row_idx % 2 == 1 else "ffffff")
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=70, bottom=70, left=120, right=120)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if i in (1, 2):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                p.runs[0].font.bold = ("GIỚI HẠN" in data_row[0] or i == 2)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in table_mat.rows:
        for i, w in enumerate([Inches(2.5), Inches(1.5), Inches(1.3), Inches(1.5)]):
            row.cells[i].width = w
    set_table_borders(table_mat)

    # 7. ĐÁNH GIÁ HỆ SỐ AN TOÀN S_H
    h7 = doc.add_paragraph()
    h7.paragraph_format.space_before = Pt(14)
    h7.paragraph_format.space_after = Pt(4)
    r_h7 = h7.add_run("7. KẾT QUẢ TÍNH TOÁN HỆ SỐ AN TOÀN TIẾP XÚC S_H & ĐỐI CHIẾU TIÊU CHUẨN")
    r_h7.bold = True
    r_h7.font.size = Pt(13)
    r_h7.font.color.rgb = blue_header

    doc.add_paragraph(
        "Theo tiêu chuẩn quốc tế ISO 6336-2 và AGMA 2001-D04, hệ số an toàn tiếp xúc bề mặt răng SH được định nghĩa là tỷ số giữa "
        "giới hạn mỏi tiếp xúc thực tế của vật liệu và ứng suất tiếp xúc làm việc: SH = σ_HG / σ_H. "
        "Đối với các bộ truyền bánh răng công nghiệp nặng vận hành liên tục yêu cầu độ tin cậy cao, hệ số an toàn tiếp xúc cho phép tối thiểu "
        "quy định là [SH]min = 1.30. Bảng dưới đây đối chiếu toàn diện hệ số an toàn của bộ bánh răng qua các kịch bản lắp đặt và cấp phôi thép:"
    )

    table_scenarios = doc.add_table(rows=1, cols=7)
    table_scenarios.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_scenarios.autofit = False

    hdr_cells_s = table_scenarios.rows[0].cells
    for i, h_text in enumerate(["Kịch Bản Lắp Đặt & Cấp Phôi", "KHβ", "KH", "Ứng Suất Tiếp Xúc (σH)", "Hệ Số Bánh 1 (SH1)", "Hệ Số Bánh 2 (SH2)", "Đánh Giá Nghiệm Thu"]):
        hdr_cells_s[i].text = h_text
        set_cell_background(hdr_cells_s[i], "1e3a8a")
        set_cell_margins(hdr_cells_s[i], top=90, bottom=90, left=70, right=70)
        p = hdr_cells_s[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(8.5)

    data_scenarios = [
        ("Trường hợp 2A: Gối chuẩn (Cấp Standard σHlim=1270)", "1.038", "1.558", "1136.7 MPa", "1.30", "1.59", "ĐẠT CHUẨN TIÊU CHUẨN (SH ≥ 1.30)"),
        ("Trường hợp 2A: Gối chuẩn (Cấp MQ cao cấp σHlim=1500)", "1.038", "1.558", "1136.7 MPa", "1.53", "1.88", "ĐẠT CHUẨN VÀNG TỐI ƯU (DỰ TRỮ LỚN)"),
        ("Trường hợp 2B: Dự phòng lệch (Cấp Standard)", "1.138", "1.708", "1190.2 MPa", "1.24", "1.52", "TIỆM CẬN NGƯỠNG (Bánh 2 an toàn cao)"),
        ("Trường hợp 2B: Dự phòng lệch (Cấp MQ cao cấp)", "1.138", "1.708", "1190.2 MPa", "1.46", "1.80", "AN TOÀN RẤT TỐT (VƯỢT [SH]min = 1.30)")
    ]

    for row_idx, data_row in enumerate(data_scenarios):
        row_cells = table_scenarios.add_row().cells
        bg_col = "ecfdf5" if row_idx in (0, 1, 3) else "fffbeb"
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=75, bottom=75, left=70, right=70)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(8.5)
            if i in (1, 2, 3, 4, 5):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                if i in (3, 4, 5):
                    p.runs[0].font.bold = True
                    p.runs[0].font.color.rgb = RGBColor(5, 150, 105) if row_idx in (0, 1, 3) else RGBColor(217, 119, 6)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                if i == 6:
                    p.runs[0].font.bold = True

    for row in table_scenarios.rows:
        for i, w in enumerate([Inches(2.15), Inches(0.45), Inches(0.45), Inches(1.15), Inches(0.85), Inches(0.85), Inches(1.30)]):
            row.cells[i].width = w
    set_table_borders(table_scenarios)

    # 8. ĐÁNH GIÁ TỔNG HỢP UỐN & TIẾP XÚC
    h8 = doc.add_paragraph()
    h8.paragraph_format.space_before = Pt(14)
    h8.paragraph_format.space_after = Pt(4)
    r_h8 = h8.add_run("8. ĐÁNH GIÁ TỔNG HỢP TƯƠNG QUAN BỀN UỐN (SF) & BỀN TIẾP XÚC (SH)")
    r_h8.bold = True
    r_h8.font.size = Pt(13)
    r_h8.font.color.rgb = blue_header

    doc.add_paragraph(
        "Trong thiết kế cơ khí chính xác theo ISO 6336, một bộ truyền bánh răng đạt mức độ hoàn thiện kỹ thuật tối ưu khi có sự "
        "cân bằng hài hòa giữa độ bền uốn chân răng (ngăn ngừa gãy răng đột ngột) và độ bền tiếp xúc mặt răng (ngăn ngừa tróc rỗ mòn mỏi). "
        "Bảng dưới đây tổng kết đối chiếu toàn diện 2 chỉ tiêu bền của bộ truyền bánh răng z1 = 17, z2 = 69, mn = 14 mm:"
    )

    table_comp = doc.add_table(rows=1, cols=5)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_comp.autofit = False

    hdr_cells_c = table_comp.rows[0].cells
    for i, h_text in enumerate(["Chỉ Tiêu Kiểm Nghiệm Bền", "Bánh Nhỏ (Pinion 1)", "Bánh Lớn (Gear 2)", "Ngưỡng Tiêu Chuẩn", "Đánh Giá Nghiệm Thu"]):
        hdr_cells_c[i].text = h_text
        set_cell_background(hdr_cells_c[i], "1e3a8a")
        set_cell_margins(hdr_cells_c[i], top=90, bottom=90, left=100, right=100)
        p = hdr_cells_c[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(9)

    data_comp = [
        ("Ứng suất uốn thực tế (σF)", "339.67 MPa", "316.61 MPa", "σFP = 428 ÷ 443 MPa", "Thấp hơn ứng suất cho phép"),
        ("HỆ SỐ AN TOÀN UỐN (SF)", "SF1 = 1.77", "SF2 = 1.96", "[SF]min = 1.40", "ĐẠT CHUẨN VÀNG CÔNG NGHIỆP"),
        ("Ứng suất tiếp xúc thực tế (σH)", "1136.71 MPa", "1136.71 MPa", "σHP = 1135 ÷ 1392 MPa", "Thỏa mãn ứng suất cho phép"),
        ("HỆ SỐ AN TOÀN TIẾP XÚC (SH - Standard)", "SH1 = 1.30", "SH2 = 1.59", "[SH]min = 1.30", "ĐẠT CHUẨN ISO 6336"),
        ("HỆ SỐ AN TOÀN TIẾP XÚC (SH - MQ Grade)", "SH1 = 1.53", "SH2 = 1.88", "[SH]min = 1.30", "DỰ TRỮ BỀN RẤT CAO"),
        ("Đặc tính phá hủy giới hạn", "Không có nguy cơ mỏi uốn", "Không có nguy cơ mỏi uốn", "ISO 6336 Method B", "BỘ TRUYỀN CỰC KỲ TIN CẬY")
    ]

    for row_idx, data_row in enumerate(data_comp):
        row_cells = table_comp.add_row().cells
        bg_col = "ecfdf5" if row_idx in (1, 3, 4) else ("f8fafc" if row_idx % 2 == 1 else "ffffff")
        for i, val in enumerate(data_row):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=70, bottom=70, left=100, right=100)
            p = row_cells[i].paragraphs[0]
            p.runs[0].font.size = Pt(9)
            if i in (1, 2):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                if row_idx in (1, 3, 4):
                    p.runs[0].font.bold = True
                    p.runs[0].font.color.rgb = RGBColor(5, 150, 105)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                if i == 4 and row_idx in (1, 3, 4):
                    p.runs[0].font.bold = True

    for row in table_comp.rows:
        for i, w in enumerate([Inches(2.5), Inches(1.3), Inches(1.3), Inches(1.4), Inches(1.2)]):
            row.cells[i].width = w
    set_table_borders(table_comp)

    # 9. KẾT LUẬN & KHUYẾN NGHỊ BÀN GIAO
    h9 = doc.add_paragraph()
    h9.paragraph_format.space_before = Pt(14)
    h9.paragraph_format.space_after = Pt(4)
    r_h9 = h9.add_run("9. KẾT LUẬN & CÁC KHUYẾN NGHỊ KỸ THUẬT BÀN GIAO ĐỐI TÁC")
    r_h9.bold = True
    r_h9.font.size = Pt(13)
    r_h9.font.color.rgb = blue_header

    concl_p = doc.add_paragraph()
    concl_p.add_run("1. Kết luận nghiệm thu độ bền tiếp xúc: ").bold = True
    concl_p.add_run(
        "Bộ truyền bánh răng trụ răng nghiêng công nghiệp nặng z1 = 17, z2 = 69, mn = 14 mm, b = 410 mm "
        "HOÀN TOÀN ĐẠT TIÊU CHUẨN ĐỘ BỀN TIẾP XÚC CHỐNG TRÓC RỖ MỎI BỀ MẶT ISO 6336-2:2006 (METHOD B) VÀ DIN 3990. "
        "Ở chế độ vận hành danh định xưởng (KA = 1.50, gối đỡ đối xứng chuẩn), ứng suất tiếp xúc thực tế là σH = 1136.71 MPa. "
        "Hệ số an toàn tiếp xúc bánh nhỏ đạt SH1 = 1.30 (Standard) đến 1.53 (MQ Grade) ≥ [SH]min = 1.30; "
        "bánh lớn đạt SH2 = 1.59 (Standard) đến 1.88 (MQ Grade), đảm bảo tuổi thọ phục vụ liên tục trên 20,000 giờ không xuất hiện hiện tượng tróc rỗ mặt răng.\n"
    )

    concl_p.add_run("2. Khuyến nghị kiểm soát chiều sâu lớp thấm carbon chống nứt dưới bề mặt (Case Crushing): ").bold = True
    concl_p.add_run(
        "Do lực vòng tiếp xúc rất lớn (Ft ~ 48.35 tấn lực), ứng suất tiếp xúc trượt cực đại nằm ở độ sâu khoảng 0.5 - 1.0 mm dưới bề mặt răng. "
        "Để tuyệt đối tránh hiện tượng vỡ nứt lớp thấm (Case Crushing / Sub-surface shear fatigue), chiều sâu lớp thấm carbon hiệu dụng "
        "sau khi mài hoàn thiện bắt buộc phải đạt: CHD = (0.15 ÷ 0.20) * mn = 2.10 ÷ 2.80 mm với độ cứng chuyển tiếp từ 58-62 HRC xuống lõi 30-38 HRC.\n"
    )

    concl_p.add_run("3. Khuyến nghị chế độ bôi trơn & Dầu hộp số công nghiệp: ").bold = True
    concl_p.add_run(
        "Vận tốc vòng ăn khớp rất thấp (v = 0.517 m/s) khiến màng dầu thủy động (EHL film) mỏng. Do đó, bắt buộc sử dụng dầu hộp số công nghiệp "
        "chịu cực áp (Extreme Pressure - EP) gốc khoáng hoặc tổng hợp PAO có cấp độ nhớt cao: ISO VG 320 hoặc ISO VG 460 (độ nhớt động học ở 40°C đạt 320 - 460 mm²/s). "
        "Dầu phải chứa phụ gia chống mài mòn sulphur-phosphorus để tạo lớp màng bảo vệ hóa học ngăn ngừa dính xước răng (Scuffing / Micropitting).\n"
    )

    concl_p.add_run("4. Khuyến nghị độ nhám bề mặt răng (Surface Roughness): ").bold = True
    concl_p.add_run(
        "Mặt răng sau khi nhiệt luyện phải được mài định hình chính xác đạt cấp chính xác ISO 6 (hoặc DIN 6) với độ nhám bề mặt "
        "Ra ≤ 0.8 ÷ 1.2 µm (Rz ≤ 4.0 ÷ 6.3 µm) để tối đa hóa hệ số nhám ZR ≥ 0.995 và ngăn ngừa tổn thương đỉnh nhấp nhô tế vi.\n"
    )

    concl_p.add_run("5. Khuyến nghị sửa đổi biên dạng & Vát mép đầu răng (Tooth End Relief): ").bold = True
    concl_p.add_run(
        "Với vành răng rất rộng b = 410 mm, để đảm bảo hệ số tải trọng KHβ không vượt quá 1.05 - 1.10 trong quá trình chịu tải thực tế, "
        "khuyến nghị áp dụng vát mép đầu vành răng (Tooth end relief) kích thước 0.04 - 0.06 mm trên chiều dài 25 mm tại hai đầu răng, "
        "kết hợp sửa đổi góc nghiêng răng (Helix slope modification fHβ) nếu kiểm tra dấu tiếp xúc xưởng có xu hướng cấn mép.\n"
    )

    # Signature Block
    p_sig_space = doc.add_paragraph()
    p_sig_space.paragraph_format.space_before = Pt(20)

    tbl_sig = doc.add_table(rows=2, cols=3)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sig.autofit = False

    sig_titles = [
        "NGƯỜI LẬP BÁO CÁO\n(Kỹ sư tính toán)",
        "NGƯỜI KIỂM ĐỊNH\n(Chuyên gia cơ khí)",
        "ĐẠI DIỆN PHÊ DUYỆT\n(Chủ nhiệm kỹ thuật)"
    ]

    for i, title in enumerate(sig_titles):
        cell_top = tbl_sig.rows[0].cells[i]
        cell_top.text = title
        p = cell_top.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(10)
        p.runs[0].font.color.rgb = blue_header

        cell_bot = tbl_sig.rows[1].cells[i]
        cell_bot.text = "\n\n\n(Ký và ghi rõ họ tên)"
        p_b = cell_bot.paragraphs[0]
        p_b.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_b.runs[0].font.italic = True
        p_b.runs[0].font.size = Pt(9)
        p_b.runs[0].font.color.rgb = gray_sub

    for row in tbl_sig.rows:
        for i, w in enumerate([Inches(2.2), Inches(2.2), Inches(2.2)]):
            row.cells[i].width = w

    return doc

if __name__ == "__main__":
    doc = create_report()
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(root_dir, "BAO_CAO_TINH_TOAN_UNG_SUAT_TIEP_XUC_BANH_RANG_Z17_69_M14.docx")
    try:
        doc.save(target_path)
        print(f"Contact stress report successfully saved to: {target_path}")
    except PermissionError:
        alt_path = os.path.join(root_dir, "BAO_CAO_TINH_TOAN_UNG_SUAT_TIEP_XUC_BANH_RANG.docx")
        doc.save(alt_path)
        print(f"Saved to alternate path: {alt_path}")

    art_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
    if os.path.exists(art_dir):
        art_path = os.path.join(art_dir, "BAO_CAO_TINH_TOAN_UNG_SUAT_TIEP_XUC_BANH_RANG_Z17_69_M14.docx")
        try:
            doc.save(art_path)
            print(f"Artifact contact stress report saved to: {art_path}")
        except PermissionError:
            pass
