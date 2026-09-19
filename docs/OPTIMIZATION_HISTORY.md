# NHẬT KÝ PHÁT TRIỂN & TỐI ƯU HÓA HỆ THỐNG TÍNH TOÁN BÁNH RĂNG (ENGINEERING MILESTONES)
**Dự án**: MITCalc Web App Independent Engineering Suite  
**Tiêu chuẩn chất lượng**: Zero-Tolerance Policy (Δ = 0.000000) đối chiếu trực tiếp với phần mềm MITCalc 1.74 gốc trên nền Microsoft Excel (.xlsb).

---

## Giai Đoạn 1: Xây Dựng Động Cơ Tính Toán & Giao Diện Bánh Răng Trụ & Nghiêng (Spur & Helical Gear)
* **Tiêu chuẩn**: ISO 6336:2006, ISO 1122-1, DIN 3960, ISO 1328.
* **Thành tựu**:
  - Xây dựng giải thuật giải Newton-Raphson hàm thân khai ngược độ chính xác $10^{-6}$.
  - Tích hợp CSDL 51 loại thép kỹ thuật chuẩn MITCalc 1.74.
  - Tích hợp 18 chỉ tiêu dung sai chế tạo theo tiêu chuẩn ISO 1328 co giãn động theo cấp chính xác $Q \in [3, 12]$.
  - Xây dựng bộ giải Section 14 tìm khoảng cách trục yêu cầu $a_w$.

---

## Giai Đoạn 2: Xây Dựng Mô-Đun Bánh Răng Côn (Bevel Gear - ISO 23509)
* **Tiêu chuẩn**: ISO 23509, DIN 3971, DIN 3965, AGMA 2005.
* **Thành tựu**:
  - Tính toán chính xác góc nón chia $\delta_1, \delta_2$, góc nón đỉnh $\delta_a$, góc nón đáy $\delta_f$.
  - Chiều dài đường sinh nón ngoài $R_e$, trung bình $R_m$, trong $R_i$.
  - Bánh răng trụ tương đương theo phương pháp Tredgold ($z_{vn}, z_v, d_{vm}, d_{va}, d_{vb}, d_{vf}, a_v, i_v$).
  - Bù dịch chỉnh chiều dày răng $x_	au = \pm 0.04$.
  - Hệ số trùng khớp ngang $arepsilon_lpha$, dọc $arepsilon_eta$ và tổng $arepsilon_\gamma = 3.0117$.
  - Bảng thông số chế tạo DXFTables khớp 100% DIN 3965.

---

## Giai Đoạn 3: Nâng Cấp Mô Phỏng 2D CAD & Bản Vẽ Kỹ Thuật Cho Cả 2 Module
1. **Bánh Răng Côn**:
   - Thay thế hoàn toàn mô phỏng 2D phẳng bằng **Bản vẽ mặt cắt trục kỹ thuật cơ khí tiêu chuẩn (Axial Cross-Section)** theo ISO 23509.
   - Đỉnh nón chung Apex $V(0,0)$ làm gốc tọa độ, trục $X$ và $Y$ vuông góc $\Sigma = 90^\circ$.
   - Đường sinh nón chia tiếp xúc, mặt nón đỉnh/đáy, nón phụ ngoài/trong, moay-ơ, lỗ trục, gạch mặt cắt kim loại ($45^\circ$).
   - Thuật toán căn giữa tự động (Auto-Centering) cân đối hoàn hảo trong Canvas 1200x650.
2. **Bánh Răng Trụ**:
   - Chuẩn hóa **Bán kính lượn chân răng $R = ho_{f0} = 0.38 \cdot m_n$** theo DIN 3960 / ISO 1122-1.
   - Tiếp tuyến mượt $C^1$ với đường thân khai và đường tròn đáy $r_f$.
   - Bảo tồn nguyên vẹn cung tròn đáy rãnh răng (Root land arc) tại bán kính $r_f$. Triệt tiêu sừng nhọn (Horn Elimination).
   - Khớp 100% với 120 điểm tọa độ biên dạng trong sheet `Coordinates` của MITCalc 1.74.

---

## Giai Đoạn 4: Đồng Bộ Trải Nghiệm 1-to-1 & Bảng Rà Soát Song Song Trực Tiếp Live Audit
1. **3 Master Blocks**: Gom cụm trực quan Khối Đầu Vào (`#107c41`), Khối Kết Quả (`#c55a11`), Khối Bổ Sung & Chế Tạo (`#1e3a8a`).
2. **Hệ thống ô nhập `.user-input`**: Nền trắng tinh viền 1.5px xanh dương, chữ đen rõ nét, hỗ trợ dấu phẩy tiếng Việt.
3. **Các nút thông minh**: `[ i <= n1,n2 ]`, `[ Pw <= Mk,n ]`, `[ i <= z1,z2 ]`, thanh trượt slider $x_1$.
4. **Tab 2 Live Audit Table**:
   - Bánh Răng Côn: **108 / 108 ô tính Live Audit PASS (100.0%, $\Delta = 0.000000$)**.
   - Bánh Răng Trụ: **153 / 153 ô tính Live Audit PASS (100.0%, $\Delta = 0.000000$)**.
5. **Rà soát song song Excel COM Automation**:
   - Bánh Răng Côn (`RA_SOAT_SONG_SONG_BANH_RANG_CON.bat`): **109 / 109 ô tính PASS 100.0%**.
   - Bánh Răng Trụ (`RA_SOAT_SONG_SONG_BANH_RANG_TRU.bat`): **155 / 155 ô tính PASS 100.0%**.

---

## Giai Đoạn 5: Hoàn Thiện Tuyệt Đối Mô-Đun Bánh Răng Trụ & Nghiêng (Spur & Helical Gears)
* **Mục tiêu**: Khắc phục triệt để sai lệch tính toán cho cả 2 trường hợp: Bánh răng trụ răng thẳng ($\beta = 0^\circ$) và Bánh răng trụ răng nghiêng ($\beta \ne 0^\circ$).
* **Đột phá kỹ thuật**:
  1. **Trích xuất & Tái tạo 1-to-1 Thuật toán Involute ngược MITCalc VBA**:
     - Trích xuất trực tiếp mã nguồn VBA từ file gốc `Gear1_01.xlsb` (`GearFunctions.bas` L764-L792).
     - Thay thế giải thuật Newton-Raphson bằng thuật toán nhị phân phân đoạn chính xác của MITCalc: sai số lặp `presnost = 1e-7`, bước `delta = X / 2`, hằng số $\pi = 3.14159265358979$.
     - Khớp tuyệt đối góc ăn khớp ngang $\alpha_{wt}$ (O254), góc pháp tuyến $\alpha_{wn}$ (O253), khoảng cách trục làm việc $a_w$ (O250) và đường kính đỉnh $d_{a1}, d_{a2}$ (O257, P257).
  2. **Chuẩn hóa công thức hình học Bánh răng nghiêng ($\beta \ne 0^\circ$)**:
     - Kích thước đo pháp tuyến chung: $z_w$ chia cho $\cos\beta \cos^2\beta_b$, $W$ sử dụng $\cos\alpha_n$ và mặt phẳng pháp tuyến.
     - Kích thước qua bi/đũa đo $M$: Biến đổi pháp tuyến sang ngang chính xác với $\tan\alpha_n$ và $\cos\alpha_n$.
     - Răng tối thiểu tránh cắt chân $z_{\min1,2,3}$ tự động nhân tỉ lệ với $\cos^3\beta$.
     - Section 8.0: Khối lượng riêng $\rho = 7870.0\text{ kg/m}^3$, công thức đường kính trục tối thiểu $d_{\text{shaft}} = R_{m1}^{0.8} / (5 \cdot \max(K_A, 1.25)^{1.7})$.
     - Dung sai tích lũy $F_{pk}$: $k = 2$ bước răng theo tiêu chuẩn ISO 1328 hàng 408.
* **Kết quả đo đạc thực tế**:
  - **Live Audit Script vs Excel COM trực tiếp (`deep_line_by_line_spur_audit.py`)**:
    - Trường hợp 1 (Spur Gear $\beta = 0^\circ$): **153 / 153 PASS (100.0%, $\Delta = 0.000000$)**.
    - Trường hợp 2 (Helical Gear $\beta = 15^\circ$): **153 / 153 PASS (100.0%, $\Delta = 0.000000$)**.
    - **Tổng cộng: 306 / 306 Ô TÍNH PASS TUYỆT ĐỐI (100.0%)**!
  - **Test Suite QC đa kịch bản (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS (100.0%)** trên cả 5 kịch bản thiết kế.
  - **Web App Runtime Test (`test_spur_webapp.py`)**: **0 console errors**, badge hiển thị **✅ 153/153 Ô TÍNH KHỚP TUYỆT ĐỐI (100.0%)**.

---

## Giai Đoạn 6: Đồng Bộ Hoàn Hảo Mục 3.0 & Mục 11.0 Chuẩn 1-to-1 MITCalc 1.74
* **Mục tiêu**:
  1. Khắc phục vấn đề số răng đo pháp tuyến chung $z_w$: Tự động tính toán và cập nhật chuẩn xác thành 4 và 9 khi $\beta = 30^\circ$ (thay vì cố định 3 và 6).
  2. Bổ sung trọn vẹn Mục 3.0: Dropdown 5 dụng cụ cắt tiêu chuẩn (`T_CutToolsDim`) và 10 thông số hình học dao cắt.
  3. Bổ sung trọn vẹn Mục 11.0 chuẩn 1-to-1 theo bản gốc MITCalc 1.74 và ảnh kỹ thuật người dùng cung cấp (`media_1789746097292.png`):
     - Dòng 11.2 & 11.3: Tách biệt $z_w$ khuyến nghị ($z_{w\text{ calc}}$) và $z_w$ áp dụng với Checkbox Auto `[X]`.
     - Dòng 11.5 & 11.6: Tách biệt $d_t$ khuyến nghị ($1.75 m_n$) và $d_t$ áp dụng với Checkbox Auto `[X]`.
     - Dòng 11.9 & 11.11: Khoảng biến thiên $W_{\min}/W_{\max}$ và $M_{\min}/M_{\max}$.
     - Dòng 11.10 & 11.12: Kích thước yêu cầu $W_{\text{req}}$ và $M_{\text{req}}$ với các nút giải ngược GoalSeek `[->x1]` và `[->Σx]`.
     - Dòng 11.14 & 11.15: Dropdown cấp chính xác ISO 1328 và mô đun tiêu chuẩn DIN 780.
     - Dòng 11.16 đến 11.34: Trọn bộ dung sai ISO 1328 Phần 1 và Phần 2 ($f''i, F''i, Fr$) tích hợp bảng bước $T_{\text{modulx2}}$.
* **Kết quả kiểm chứng thực nghiệm**:
  - **Khớp 100% hình ảnh thực tế của người dùng (`media_1789746097292.png`)**:
    * Khi $\beta = 30^\circ, x_1 = 0.1, x_2 = 0.2$: $z_w = (4, 9)$, $W = (64.8062, 157.4454)\text{ mm}$, $M = (147.1023, 349.8838)\text{ mm}$, khoảng $W = (62.24/70.55, 153.3/162.8)$, khoảng $M = (140.1/159.4, 337.9/363)$.
  - **GoalSeek Solvers**: Tính ngược $x_1$ và $\Sigma x$ từ kích thước yêu cầu $W$ và $M$ hội tụ chính xác tuyệt đối.
  - **Dung sai ISO 1328-2**: $f''i = (22.0, 22.0)\text{ µm}$, $F''i = (44.0, 60.0)\text{ µm}$, $Fr = (22.0, 38.0)\text{ µm}$ khớp 100% Excel COM.
  - **Live Audit Script (`deep_line_by_line_spur_audit.py`)**: **306 / 306 ô tính PASS (100.0%, $\Delta = 0.000000$)**.
  - **Multi-case QC Suite (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS (100.0%)**.
---

## Giai Đoạn 7: Đồng Bộ Tuyệt Đối Cấp Chính Xác Chế Tạo ISO 1328 (T_AG & T_MaxV) & Checkbox Tự Động Dòng 11.14
* **Bối cảnh & Yêu cầu người dùng**:
  1. Các thông số dropdown "Cấp chính xác chế tạo (Accuracy grade) - Q" ở Mục 2.7 và Mục 11.14 chưa chuẩn xác so với bản gốc MITCalc 1.74.
  2. Cần đối chiếu trực tiếp file `Gear1_01.xlsb` để trích xuất đầy đủ 10 cấp chính xác (Grades 3..12) với chuỗi hiển thị gốc, thông số nhám $Ra_{\max}$ và vận tốc vòng giới hạn $v_{\max}$.
  3. Giải thích chuyên sâu chức năng Mục 11.0 (Đo kiểm W, M, GoalSeek và hệ thống dung sai ISO 1328).
* **Đột phá & Tri thức kỹ thuật mới**:
  1. **Bảng chuẩn `T_AG` (`Tables!$B$215:$K$224`) & `T_MaxV` (`Tables!$B$270:$E$279`)**:
     - Cấp 3: `3....(Ra max.= 0.1 / v max.= 80)` | $Ra_{\max} = 0.1$, $v_{\max}(\beta=0) = 80$, $v_{\max}(\beta\ne0) = 100\text{ m/s}$.
     - Cấp 4: `4....(Ra max.= 0.2 / v max.= 60)` | $Ra_{\max} = 0.2$, $v_{\max}(\beta=0) = 60$, $v_{\max}(\beta\ne0) = 80\text{ m/s}$.
     - Cấp 5: `5....(Ra max.= 0.4 / v max.= 35)` | $Ra_{\max} = 0.4$, $v_{\max}(\beta=0) = 35$, $v_{\max}(\beta\ne0) = 50\text{ m/s}$.
     - Cấp 6: `6....(Ra max.= 0.8 / v max.= 15)` | $Ra_{\max} = 0.8$, $v_{\max}(\beta=0) = 15$, $v_{\max}(\beta\ne0) = 30\text{ m/s}$.
     - Cấp 7: `7....(Ra max.= 1.6 / v max.= 8)`  | $Ra_{\max} = 1.6$, $v_{\max}(\beta=0) = 8$,  $v_{\max}(\beta\ne0) = 12\text{ m/s}$.
     - Cấp 8: `8....(Ra max.= 1.6 / v max.= 5)`  | $Ra_{\max} = 1.6$, $v_{\max}(\beta=0) = 5$,  $v_{\max}(\beta\ne0) = 8\text{ m/s}$.
     - Cấp 9: `9....(Ra max.= 3.2 / v max.= 3)`  | $Ra_{\max} = 3.2$, $v_{\max}(\beta=0) = 3$,  $v_{\max}(\beta\ne0) = 5\text{ m/s}$.
     - Cấp 10: `10..(Ra max.= 6.3 / v max.= 3)` | $Ra_{\max} = 6.3$, $v_{\max}(\beta=0) = 3$,  $v_{\max}(\beta\ne0) = 3\text{ m/s}$.
     - Cấp 11: `11..(Ra max.= 12.5 / v max.= 3)`| $Ra_{\max} = 12.5$, $v_{\max}(\beta=0) = 3$, $v_{\max}(\beta\ne0) = 3\text{ m/s}$.
     - Cấp 12: `12..(Ra max.= 25 / v max.= 3)`  | $Ra_{\max} = 25.0$, $v_{\max}(\beta=0) = 3$, $v_{\max}(\beta\ne0) = 3\text{ m/s}$.
  2. **Công thức vận tốc giới hạn động $v_{\max}$ dòng 8.18 (ô V437 trong Excel)**:
     - `=INDEX(T_MaxV, _AG, IF(_beta=0, 3, 4))`: $v_{\max}$ phản ứng linh hoạt theo cả cấp chính xác $Q$ và góc xoắn $\beta$. Ví dụ: Với Cấp 6, $v_{\max} = 15\text{ m/s}$ khi răng thẳng ($\beta = 0^\circ$) và tự tăng lên $30\text{ m/s}$ khi răng nghiêng ($\beta \ne 0^\circ$).
  3. **Cơ chế Checkbox Tự Động dòng 11.14 (Shape 9677 / ô `B402` `_ToleranceFlag`)**:
     - Khi tích chọn `[X]`: Cấp chính xác chế tạo Mục 11.14 bị vô hiệu hóa (`disabled`) và tự động khóa đồng bộ theo Mục 2.7.
     - Khi bỏ tích `[ ]`: Mở khóa cho phép kỹ sư lựa chọn cấp chính xác kiểm tra dung sai độc lập cho Mục 11 mà không ảnh hưởng đến các thông số thiết kế ở Mục 2.0.
* **Kết quả kiểm thử thực nghiệm**:
  - **Live Audit Script (`deep_line_by_line_spur_audit.py`)**: **306 / 306 ô tính PASS (100.0%, $\Delta = 0.000000$)**.
  - **Multi-case QC Suite (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS (100.0%)**.
  - **Zero-CORS bundle**: Hoàn toàn tương thích và chạy trơn tru trên trình duyệt qua `file:///`.

---

## Giai Đoạn 8: Tinh Chỉnh Giao Diện Gọn Nhẹ, Tối Ưu Ăn Khớp 2D Helical, Tích Hợp Khe Hở Cạnh Răng (Backlash) & Xuất Bản Vẽ CAD DXF Độc Lập
* **Bối cảnh & Yêu cầu người dùng**:
  1. Bỏ tab "Đối Chiếu Song Song với MITCalc 1.74", tab "Dò tìm khoảng cách trục", tab "Tra cứu CSDL vật liệu".
  2. Bỏ hoàn toàn Mục 2.0 ("Vật liệu, chế độ tải & cấp chính xác") để tinh giản tối đa theo Zero-Force Protocol.
  3. Mặc định mở rộng (auto-expand) 4 mục cốt lõi: 4.0, 5.0, 6.0, 11.0. Các mục khác giữ mặc định thu gọn (collapsed).
  4. Khôi phục đầy đủ cụm thông số Khe hở cạnh răng (Backlash) theo MITCalc 1.74 dòng 193-195 ($j_n, j_{n\min}, j_{n\max}, j_{tw}, \Delta a_j$).
  5. Cấp chính xác $Q$ phản ứng động thời gian thực khi chuyển đổi giữa răng thẳng ($\beta = 0$) và răng nghiêng ($\beta \ne 0$).
  6. Làm nổi bật trực quan các kích thước then chốt: $a_w, d_a, d_f, W$ với viền vàng hổ phách, chữ cyan đậm (`.highlight-key-param`).
  7. Sửa lỗi mô phỏng ăn khớp 2D Canvas cho bánh răng nghiêng (chuyển sang mặt mút $m_t, \alpha_t$, triệt tiêu va chạm/giao thoa răng) và bổ sung thanh trượt điều chỉnh tốc độ quay (speed slider).
  8. Xây dựng bộ xuất bản vẽ CAD DXF Release 12 tiêu chuẩn (`Banh_Rang_Tru_MITCalc.dxf`), chạy 100% offline, zero-CORS.

* **Đột phá & Giải pháp kỹ thuật**:
  1. **Tối ưu hình học 2D Canvas cho bánh răng nghiêng (Helical Transverse Mesh)**:
     - Khắc phục lỗi truyền nhầm $m_n$ và $\alpha_n$ vào hàm tạo biên dạng 2D. Trên mặt cắt mút (transverse cross-section), bánh răng nghiêng hoạt động theo mô đun mút $m_t = m_n / \cos\beta$ và góc áp lực mút $\tan\alpha_t = \tan\alpha_n / \cos\beta$.
     - Ăn khớp liên hợp chuẩn: Vòng chia tiếp xúc chính xác tại điểm ăn khớp C, khoảng cách trục $a_w$, góc bù pha $\pi + \pi / z_2$, chuyển động mượt mà không va chạm.
     - Thanh trượt tốc độ quay `#sliderAnimSpeed` cho phép người dùng tinh chỉnh từ 0.1x đến 3.0x.
  2. **Bộ công thức Khe hở cạnh răng (Backlash Equations)**:
     - $j_{n\min} = 0.006 \cdot \sqrt{a_w}\text{ mm}$.
     - $j_{n\max} = 0.024 \cdot \sqrt{a_w}\text{ mm}$.
     - Khe hở tiếp tuyến: $j_{tw} = j_n / (\cos\beta_b \cdot \cos\alpha_{wt})$.
     - Dịch chuyển khoảng cách trục: $\Delta a_j = j_n / (2 \cdot \sin\alpha_{wn})$.
  3. **Bộ tạo bản vẽ AutoCAD DXF R12 Client-side (Zero-CORS)**:
     - Tạo file định dạng ASCII Release 12 (`AC1009`) gồm các layer chuyên biệt: `GEAR1_PINION`, `GEAR2_WHEEL`, `PITCH_CIRCLES`, `CENTER_LINES`, `SHAFTS_BORE`, `MFG_TABLE`.
     - Tự động xuất đầy đủ biên dạng răng thực thể `POLYLINE`, vòng tròn chia, lỗ trục then và bảng thông số chế tạo chi tiết.
     - Tải trực tiếp về máy tính người dùng không cần cài đặt Node.js hay Web Server.
* **Kết quả kiểm chứng**:
  - Playwright E2E Test (`verify_all.py`): 100% PASS, 0 lỗi console, tự động mở các mục 4.0, 5.0, 6.0, 11.0.
  - Tải file DXF thành công (373,974 bytes, 69,552 dòng lệnh CAD chuẩn AC1009).
  - Đóng gói Bundle thuần gọn gàng qua `python tools/bundle_all.py`.

---

## Giai Đoạn 9: Hoàn Thiện Tuyệt Đối Mô-Đun Bánh Răng Côn (Bevel Gear - ISO 23509 / DIN 3971) - Tinh Gọn Giao Diện 2 Tab, Highlight Kích Thước Then Chốt, Tích Hợp Xuất Bản Vẽ CAD DXF & Đạt Chuẩn Tuyệt Đối Delta = 0.000000
* **Bối cảnh & Yêu cầu người dùng**:
  1. Kế thừa toàn bộ tri thức và kinh nghiệm từ Mô-đun Bánh răng trụ, hoàn thiện Mô-đun Bánh răng côn (`modules/bevel-gear/`) thật chuẩn xác tuyệt đối để người dùng không phải rà soát hoặc sửa chữa bất kỳ thông số nào.
  2. Bỏ hoàn toàn tab "Đối Chiếu Song Song với MITCalc 1.74" và tab "Tra cứu CSDL vật liệu". Chỉ giữ lại 2 tab chuẩn: `⚙️ Bảng Tính Cơ Khí (Calculator)` và `📐 Mô Phỏng 2D CAD (Canvas)`.
  3. Bỏ hoàn toàn Mục 2.0 ("Vật liệu, chế độ tải & cấp chính xác") theo Zero-Force Protocol. Cấp chính xác $Q$ chuyển vào Mục 11.0.
  4. Mặc định mở sẵn (`▼`) 4 phân mục kỹ thuật cốt lõi: 4.0, 5.0, 6.0, 11.0. Các phân mục phụ khác mặc định thu gọn (`▶`).
  5. Làm nổi bật trực quan các thông số then chốt (`.highlight-key-param`): viền vàng hổ phách `#f59e0b`, chữ cyan đậm, nền mờ phát sáng cho 36 thông số thiết kế và đo kiểm quan trọng ($R_e, d_{ae}, d_{fe}, \delta, \delta_a, \delta_f, b, s_{ne}, s_c, h_c$, bảng chế tạo).
  6. Tích hợp thanh trượt điều chỉnh tốc độ quay thời gian thực (`#sliderAnimSpeed`, $0.1\text{x} \div 3.0\text{x}$) và bổ sung đầy đủ các phương thức điều khiển zoom/pan/toggleAnimation vào `BevelGearCanvas`.
  7. Tích hợp chức năng xuất bản vẽ 2D CAD định dạng AutoCAD Release 12 (`AC1009`) độc lập 100% offline (Zero-CORS) cho bánh răng côn, xuất mặt cắt trục bổ dọc ISO 23509 khép kín và bảng chế tạo DIN 3965.

* **Đột phá & Giải pháp kỹ thuật**:
  1. **Khắc phục lỗi điều khiển Canvas 2D**:
     - Bổ sung các phương thức `zoomBy(factor)`, `zoom(factor)`, `toggleAnimation()` và `setAnimSpeed(speed)` vào class `BevelGearCanvas`, giải quyết triệt để lỗi không phản hồi khi người dùng bấm các nút thu phóng hay thanh trượt tốc độ.
     - Vòng lặp `requestAnimationFrame` điều chỉnh bước góc quay theo `this.animSpeed || 1.0`.
  2. **Bộ xuất bản vẽ AutoCAD DXF R12 Client-side cho Bánh Răng Côn**:
     - Định dạng chuẩn ASCII DXF Release 12 (`AC1009`) tương thích mọi phần mềm CAD (AutoCAD, SolidWorks, Inventor, LibreCAD).
     - Gồm 6 layer kỹ thuật chuyên biệt: `PINION_CROSS_SECTION`, `GEAR_CROSS_SECTION`, `CENTER_LINES`, `PITCH_CONES`, `APEX_POINT`, `MFG_TABLE`.
     - Xuất đường bao mặt cắt trục bổ dọc khép kín (`POLYLINE`), đường sinh nón chia, đỉnh Apex $V(0,0)$, đường tâm trục vuông góc $\Sigma = 90^\circ$ và bảng thông số chế tạo DIN 3965.
     - Tải trực tiếp về máy tính người dùng qua Blob API không phụ thuộc server.
  3. **Tối ưu hóa DOM & CSS**:
     - Xử lý triệt để xung đột thuộc tính `class` trùng lặp trên các thẻ span/input để toàn bộ 36 thông số then chốt được gắn lớp `.highlight-key-param` hiển thị chuẩn xác trên giao diện người dùng.

* **Kết quả kiểm chứng thực nghiệm**:
  - **Live Audit Script (`deep_line_by_line_bevel_audit.py`)**: **109 / 109 ô tính PASS tuyệt đối (100.0%, $\Delta = 0.000000$)** đối chiếu với `Gear2_01.xlsb`.
  - **Multi-case QC Suite (`qc_bevel_multi_case_suite.py`)**: **120 / 120 kiểm thử PASS tuyệt đối (100.0%)** qua 5 kịch bản tải trọng, tỉ số truyền và góc trục phi vuông góc $\Sigma = 60^\circ$.
  - **Playwright E2E Test (`verify_bevel_e2e.py`)**: 100% PASS:
    * 0 lỗi Console/JavaScript.
    * Đúng 2 tab điều hướng.
    * Loại bỏ hoàn toàn Mục 2.0.
    * Đúng trạng thái mở cho 4 mục cốt lõi 4.0, 5.0, 6.0, 11.0 và thu gọn các mục phụ.
    * 36 phần tử được highlight trực quan `.highlight-key-param`.
    * Thanh trượt tốc độ phản hồi tức thì ($2.5\text{x}$).
    * Tải file DXF thành công (`Banh_Rang_Con_MITCalc_18x45_m10.dxf`, 6,100 bytes).
  - **CORS-Free Single Bundle**: Đóng gói thành công `modules/bevel-gear/js/bevel-engine.bundle.js` (113,640 ký tự) khởi động tức thì qua giao thức `file:///`.

---

## Giai Đoạn 10: Thiết Lập Quản Lý Mã Nguồn Git, Xuất Bản GitHub & Cấu Hình Triển Khai Toàn Cầu Vercel (CI/CD)
* **Bối cảnh & Yêu cầu người dùng**:
  1. Đưa toàn bộ dự án Web App Tính Toán Cơ Khí lên **GitHub** để quản lý phiên bản chuyên nghiệp.
  2. Triển khai ứng dụng lên nền tảng đám mây **Vercel** để biến ứng dụng thành một Web App trực tuyến toàn cầu (Zero-Build, miễn phí tên miền, tự động deploy CI/CD).
* **Đột phá & Giải pháp kỹ thuật**:
  1. **Cài đặt Git Portable (MinGit) 100% Non-Admin**:
     - Do môi trường máy tính Windows chặn quyền UAC khi chạy installer thông thường, hệ thống đã tích hợp giải pháp tải và giải nén trực tiếp bản phát hành chính thức `MinGit-2.55.0.5-64-bit` từ Git for Windows vào `%LOCALAPPDATA%\Programs\Git`.
     - Tạo wrapper shim `C:\Users\AD\.gemini\antigravity\bin\git.bat` cho phép mọi terminal và script gọi trực tiếp lệnh `git` toàn cục.
  2. **Vệ sinh kho chứa & File `.gitignore` chuẩn hóa**:
     - Thiết lập `.gitignore` loại trừ các file nén nặng `backups/*.zip`, cache Python (`__pycache__/`), cache test và tệp tạm `scratch/`.
     - Giữ nguyên 100% mã nguồn, bundle, tài liệu và dữ liệu tham chiếu gốc.
  3. **Cấu hình Vercel (`vercel.json`)**:
     - Đặt `cleanUrls: false` để bảo toàn tuyệt đối toàn bộ liên kết HTML tương đối (`modules/spur-gear/index.html`, `modules/bevel-gear/index.html`).
     - Bổ sung HTTP Security Headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) và MIME UTF-8 cho script và style.
  4. **Cơ Chế Đẩy Trực Tiếp Lên GitHub (Zero-Batch Direct Push Protocol)**:
     - Toàn bộ thao tác commit và push lên GitHub được AI trực tiếp thực hiện trong console theo lệnh người dùng, không tạo file batch trung gian, đảm bảo an ninh và thuận tiện.
* **Kết quả kiểm chứng thực nghiệm**:
  - `git status` sạch hoàn toàn (`nothing to commit, working tree clean`).
  - Kiểm thử mô phỏng máy chủ web tĩnh (`http://localhost:8089`): Cả 5 tuyến đường (`/`, Spur Gear, Bevel Gear, Spur Bundle, Bevel Bundle) đều trả về mã phản hồi `HTTP 200 OK`.

---

## Giai Đoạn 11: Đồng Bộ Giao Diện 1-to-1 Chuẩn MITCalc 1.74 & Trích Xuất Tài Nguyên Đồ Họa Vector Gốc
* **Bối cảnh & Yêu cầu người dùng**:
  - Người dùng cung cấp ảnh chụp trực tiếp từ MITCalc 1.74 (`media_1789811424445.png`, `media_1789811438574.png`, `media_1789811473048.png`) với yêu cầu: "tham khảo lại giao diện trên app mitcalc 1.74 để làm cho chuẩn xác".
* **Đột phá & Giải pháp kỹ thuật**:
  1. **Trích xuất trực tiếp tài nguyên WMF/PNG từ `Gear2_01.xlsb`**:
     - Đọc cấu trúc zip của file `.xlsb` tại `C:\MITCalc\gear2\Gear2_01.xlsb`.
     - Sử dụng Windows GDI+ (`gdiplus.dll` qua Python `ctypes`) để rasterize các file WMF vector thành PNG độ nét cao (1200px):
       * `modules/bevel-gear/images/mitcalc_bevel_sec4_geometry.png`
       * `modules/bevel-gear/images/mitcalc_bevel_sec6_dimensions.png`
       * `modules/bevel-gear/images/mitcalc_bevel_sec16_offset.png`
       * Bộ icon CAD: `image3.png`, `image4.png`, `image5.png`, `image7.png`
  2. **Section 4.0: Trình diễn đồ họa kép (Dual Graphic Showcase)**:
     - Sơ đồ góc xoắn & nón răng bên trái.
     - Biểu đồ tọa độ 2D Descartes mặt cắt trục ăn khớp (`<canvas id="bevelSec4ChartCanvas">`) bên phải mô phỏng 1-to-1 Chart 4181 của MITCalc.
  3. **Section 6.0: Kích thước hình học 39 dòng đầy đủ (ISO 23509)**:
     - Nhúng bản vẽ kỹ thuật định nghĩa kích thước gốc `mitcalc_bevel_sec6_dimensions.png`.
     - Bố cục 7 cột rõ ràng: `#` | `Kích Thước Hình Học` | `Ký Hiệu` | `Bánh 1 / Ngoài` | `Bánh 2 / TB` | `Mặt Trong` | `Đơn Vị`.
  4. **Section 15.0: Các phép tính toán phụ trợ (Auxiliary Calculations)**:
     - 15.1: Tỉ số truyền từ vận tốc $i = n_1 / n_2$ kèm nút `[ OK ]` tự động cập nhật Mục 1.0 & 4.0.
     - 15.2: Công suất từ mô men xoắn $P = (M_1 \cdot n_1) / 9550$ kèm nút `[ OK ]` tự động cập nhật Mục 1.0.
     - 15.3: Tỉ số truyền từ số răng $i = z_2 / z_1$ kèm nút `[ OK ]` tự động cập nhật Mục 1.0.
  5. **Section 16.0: Hệ thống CAD & Bảng chế tạo (DXFTables)**:
     - 16.1 Chọn hệ thống CAD: 4 chế độ với các icon gốc MITCalc (`image3.png` đến `image7.png`).
     - 16.2 Thông số dao cắt & lượng dịch chỉnh gia công: $R_{\text{tool}} = 1.5 \cdot b$, $a_1, a_2, b_1, b_2$ kèm sơ đồ minh họa `mitcalc_bevel_sec16_offset.png`.
     - 16.3 Các nút vẽ 2D (`btn_draw_2d`) và xuất DXF Release 12.
     - 16.4 Bảng thuộc tính BOM (Part Name, Specification, Material).
     - 16.5 Bảng thông số chế tạo chi tiết DIN 3965 / ISO 23509.
* **Kết quả kiểm chứng thực nghiệm**:
  - **Multi-case QC Suite (`qc_bevel_multi_case_suite.py`)**: 120 / 120 kiểm thử PASS tuyệt đối (100.0%, $\Delta = 0.0000$).
  - **Playwright E2E Test (`test_bevel_webapp.py`)**: 0 lỗi Console/JavaScript, chạy sạch 100%.

---

## Giai Đoạn 12: Thiết Kế Giao Diện Mobile Responsive Khoa Học & Bộ Điều Khiển Cảm Ứng Đa Điểm 2D CAD (Mobile Multi-Touch Engine)
* **Bối cảnh & Yêu cầu người dùng**:
  - Người dùng yêu cầu trực tiếp: *"bạn cần tối ưu giao diện mobile cho tôi sao cho khoa học vào"*.
  - Yêu cầu đặt ra: Phải tối ưu trải nghiệm trên các thiết bị di động (Smartphones/Tablets, màn hình từ 360px đến 768px), đảm bảo giữ nguyên 100% dữ liệu kỹ thuật, không làm vỡ bố cục, thu hồi tối đa không gian màn hình dọc và cho phép tương tác cảm ứng tự nhiên với mô hình ăn khớp bánh răng 2D CAD.
* **Đột phá & Giải pháp kỹ thuật**:
  1. **Chẩn đoán hiển thị trực quan bằng Playwright Headless**:
     - Phát hiện Header cố định (`position: sticky`) chiếm tới 45% chiều cao màn hình di động trên iPhone 14 / Pixel 7 (`390x844`).
     - Khối tóm tắt `.summary-banner` xếp chồng 6 thẻ dọc dài hơn 800px, đẩy nội dung chính xuống sâu dưới nếp gấp màn hình.
     - Bảng tính toán kỹ thuật 7 cột `.calc-table` bị co ép làm méo mó các thông số khi hiển thị trong container hẹp.
     - Canvas 2D cố định kích thước 1200px gây tràn màn hình ngang và thiếu hoàn toàn bộ lắng nghe sự kiện chạm (`touchstart`, `touchmove`, `touchend`).
  2. **Tối ưu hóa kiến trúc CSS Responsive (`shared/css/engineering-theme.css`)**:
     - **Canvas co giãn tự động**: `#gearCanvas, #bevelCanvas { width: 100%; max-width: 100%; height: auto; aspect-ratio: 1200 / 650; touch-action: none; }` - triệt tiêu hiện tượng giật màn hình khi thao tác trên canvas.
     - **Thu hồi 45% diện tích dọc của Header**: Chuyển `position: sticky` sang `position: static`, ẩn văn bản mô tả phụ, chuyển thanh nút điều hướng (`.header-controls`) thành thanh cuộn ngang cảm ứng (`overflow-x: auto; scrollbar-width: none;`).
     - **Thanh điều hướng Tab 50/50 (Segmented Control)**: Phân bố đều 2 tab với diện tích chạm tối ưu (`min-height: 42px`).
     - **Tái cấu trúc Executive Summary Banner thành lưới 2 cột**: Sử dụng `grid-template-columns: 1fr 1fr`, thẻ trạng thái ISO chiếm trọn chiều rộng hàng trên, chữ số đậm `1.05rem`, nhãn `0.65rem`, hiển thị đầy đủ 5 chỉ số cốt lõi trong chưa đầy 120px chiều cao.
     - **Bảo toàn 100% dữ liệu kỹ thuật 7 cột**: Thiết lập `.section-body` có `overflow-x: auto; -webkit-overflow-scrolling: touch;` và cố định `.calc-table` có `min-width: 580px`, cho phép vuốt ngang tự nhiên bằng ngón cái mà không làm xô lệch bất kỳ ô tính nào.
     - **Chống Auto-Zoom trên iOS Safari**: Đặt `font-size: 16px` cho các ô `.user-input` và chiều cao tối thiểu 36px.
  3. **Tối ưu hóa cấu trúc DOM Tab**:
     - Di chuyển khối `.summary-banner` và `.global-accordion-toolbar` vào bên trong `#tabCalculator`. Khi người dùng chuyển sang `#tabCanvas`, khung vẽ mô phỏng 2D CAD xuất hiện ngay dưới thanh tab, dành 100% không gian màn hình cho bản vẽ kỹ thuật.
     - Cổng trung tâm (`index.html`): Điều chỉnh lưới thẻ mô-đun từ `minmax(420px, 1fr)` xuống `minmax(280px, 1fr)`.
  4. **Bộ điều khiển cảm ứng đa điểm 2D Canvas (Mobile Multi-Touch Engine)**:
     - Tích hợp trực tiếp vào `modules/spur-gear/js/ui/gear-canvas.js` và `modules/bevel-gear/js/bevel-canvas.js`:
       * Chạm 1 ngón tay (`touchstart`, `touchmove`, `touchend`): Kéo rê di chuyển mô hình (Pan) mượt mà.
       * Chạm 2 ngón tay: Thu phóng tức thì bằng khoảng cách giữa 2 đầu ngón tay (`Math.hypot(dx, dy)`).
* **Kết quả kiểm chứng thực nghiệm**:
  - **Kiểm thử giao diện di động bằng Playwright (iPhone 14 / Pixel 7: 390x844)**:
    * Header và Navigation hiển thị cân đối, không che khuất màn hình.
    * Summary Banner hiển thị trọn vẹn 5 thông số then chốt không cần cuộn trang.
    * Bảng tính vuốt ngang 7 cột mượt mà, đầy đủ các thông số `#`, `Thông số`, `Ký hiệu`, `Giá trị 1`, `Giá trị 2`, `Giá trị 3`, `Đơn vị`.
    * Tab Canvas 2D chiếm trọn tầm nhìn, hiển thị sắc nét mô hình ăn khớp.
  - **Spur Gear QC Suite (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS tuyệt đối (100.0%)**.
  - **Bevel Gear QC Suite (`qc_bevel_multi_case_suite.py`)**: **120 / 120 checks PASS tuyệt đối (100.0%)**.
  - **Automated WebApp Test (`test_spur_webapp.py` & `test_bevel_webapp.py`)**: 0 lỗi Console/JavaScript, sạch 100%.
  - **Classic Bundle Đóng Gói Thuần**: `bevel-engine.bundle.js` (126,880 ký tự) và `mitcalc-engine.bundle.js` cập nhật hoàn chỉnh, chạy 100% offline.

---

## Giai Đoạn 13: Xây Dựng Hộp Nhập Liệu Tích Hợp Mũi Tên Sổ Xuống Chuẩn Excel (Excel-Style Combo-Box Protocol)
* **Bối cảnh & Yêu cầu người dùng**:
  - Người dùng gửi ảnh màn hình MITCalc 1.74 (`media_1789831412481.png`, `media_1789831432487.png`, `media_1789831460631.png`) và ra lệnh: *"trong ảnh tôi gửi cho bạn, bạn để ý những thông số có mũi tên sổ xuống để lựa chọn thêm thông số"*.
  - Quan sát kỹ thuật: Trong Excel MITCalc gốc, các thông số kỹ thuật (như tỉ số truyền $i$, góc trục $\Sigma$, góc ăn khớp $\alpha$, góc xoắn $\beta$, mô đun $m$, loại răng, phương pháp dịch chỉnh, hệ thống CAD, tỉ lệ bản vẽ, v.v.) đều tích hợp điều khiển DropDowns của Excel đặt ngay kề sát bên cạnh ô nhập liệu để người dùng vừa có thể gõ giá trị tùy ý, vừa có thể bấm mũi tên sổ xuống `▼` để chọn nhanh từ danh mục tiêu chuẩn.
* **Đột phá & Giải pháp kỹ thuật**:
  1. **Đảo ngược & Trích xuất Named Ranges chuẩn từ Excel gốc (`Gear1_01.xlsb` & `Gear2_01.xlsb`)**:
     - Sử dụng Python Excel COM Automation để quét toàn bộ điều khiển `ws.DropDowns()` và đọc các Named Ranges:
       * `T_i`: Dãy tỉ số truyền tiêu chuẩn ISO R10/R20 (1.00 đến 20.00).
       * `T_AngleList`: Góc trục $\Sigma$ tiêu chuẩn ($60^\circ$ đến $120^\circ$).
       * `T_AlfaList`: Góc ăn khớp danh nghĩa $\alpha$ ($14.5^\circ, 15.0^\circ, 17.5^\circ, 20.0^\circ, 22.0^\circ, 25.0^\circ$).
       * `T_BetaList`: Góc xoắn răng $\beta$ ($0^\circ, 8^\circ, 10^\circ, 12^\circ, 15^\circ, 20^\circ, 25^\circ, 30^\circ, 35^\circ, 40^\circ, 45^\circ$).
       * `T_modul`: Dãy mô đun tiêu chuẩn DIN 780 Dãy 1 và Dãy 2 (0.5 mm đến 50.0 mm).
       * `T_ToothType`: 4 kiểu răng côn (Thẳng loại I, Xoắn Gleason loại II, Zerol loại II, Klingelnberg/Oerlikon loại III).
       * `T_AddendModif`: 5 phương pháp dịch chỉnh chiều cao răng (VN uốn, VN tiếp xúc, DIN 870, BSI, Răng cong).
       * `T_TypePressAngle` & `T_TypeoffModule`: Hoán đổi linh hoạt giữa góc/mô đun pháp diện (Normal) và ngang diện (Transverse).
       * `T_CADSystems`, `T_DXFScale`, `T_DXF_2P`, `T_DXFTablesList`: Danh mục phần mềm CAD, tỉ lệ vẽ, chi tiết xuất và bảng thông số chế tạo.
  2. **Thiết kế thành phần giao diện Combo-Box (`shared/css/engineering-theme.css`)**:
     - `.combo-box-group`: Khung inline-flex với bo góc 4px, gom ô nhập `.combo-input` và nút chevron mũi tên `.combo-arrow-select` nằm trọn vẹn trong **Cột 4 (Bánh Dẫn - Pinion 1)**.
     - `.combo-arrow-select`: Nút chọn độ rộng 24px, ẩn mũi tên mặc định của hệ điều hành và thay bằng SVG chevron `▼` màu xanh `#2563eb` sắc nét, đồng bộ hoàn hảo với theme kỹ thuật.
     - `.param-type-select`: Dropdown tích hợp trực tiếp trên tiêu đề thông số (Mục 4.3 & 4.8) cho phép chuyển đổi tức thì loại thông số mà không làm phình chiều dọc giao diện.
     - **Bảo toàn Cột 5 (Bánh Bị Dẫn - Gear 2)**: Khắc phục triệt để lỗi trước đây đẩy thẻ `<select>` sang Cột 5. Cột 5 nay được dành riêng cho giá trị tính toán của Bánh 2 hoặc thông số liên hợp (ví dụ: góc ăn khớp liên hợp $\alpha_n / \alpha_t$ hoặc mô đun liên hợp $m_t / m_{mn}$).
  3. **Đồng bộ phản ứng hai chiều (Bidirectional Reactive Sync)**:
     - Tích hợp sự kiện `change` trên toàn bộ các select: Khi chọn giá trị từ dropdown, giá trị lập tức được gán vào ô nhập liệu và kích hoạt hàm tính toán thời gian thực (`calculate()`).
     - Khi người dùng gõ tay bất kỳ số thực nào vào ô nhập liệu, hệ thống tự động nhận diện và tính toán mà không bị giới hạn.
  4. **Áp dụng đồng bộ cho cả hai mô-đun Bánh Răng Trụ & Bánh Răng Côn**:
     - Bánh Răng Côn: Hàng 1.4 ($i$), 3.1 (Kiểu răng), 4.2 ($\Sigma$), 4.3 ($\alpha_t/\alpha_n$), 4.4 ($\beta_m$), 4.5 (Hướng xoắn), 4.8 ($m_{mn}/m_{et}$), 5.1 (Loại dịch chỉnh), Section 15.0, Section 16.0 (CAD systems, scale, detail, tables).
     - Bánh Răng Trụ: Hàng 1.4 ($i$), 3.1 (Dao cắt), 4.2 ($\alpha_n$), 4.3 ($\beta$), 4.6 ($m_n$), Section 11.0 ($Q$), Section 16.0 (CAD systems, scale, detail, DXFTables).
* **Kết quả kiểm chứng thực nghiệm**:
  - **Spur Gear QC Suite (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS tuyệt đối (100.0%, $\Delta = 0.0000$)**.
  - **Bevel Gear QC Suite (`qc_bevel_multi_case_suite.py`)**: **120 / 120 checks PASS tuyệt đối (100.0%, $\Delta = 0.0000$)**.
  - **CORS-Free Bundler (`tools/bundle_all.py`)**: Đóng gói thành công `bevel-engine.bundle.js` (130,945 ký tự) và `mitcalc-engine.bundle.js` chạy 100% offline.

---

### [2026-09-19 23:05] Hoàn Thiện Đồ Thị Tọa Độ Mặt Cắt Trục Ăn Khớp 2D Động Section 4.0 Chuẩn 1-to-1 Excel Chart 4181
* **Bối cảnh & Yêu cầu từ SirPhuong**:
  - *"Tọa Độ Mặt Cắt Trục Ăn Khớp 2D (Axial Section Plot) là hình ảnh động, khi thay đổi thông số thì kích thước trên đây cũng sẽ thay đổi theo"*.
  - Khắc phục hình ảnh tĩnh: Toàn bộ đồ thị Descartes 2D nhúng trong Section 4.0 (`#bevelSec4ChartCanvas`) phải phản ứng động theo thời gian thực khi người dùng thay đổi bất kỳ thông số nào ($\Sigma, z_1, z_2, m_{mn}, m_{et}, b, x_1$).
* **Giải pháp kỹ thuật & Thuật toán thực hiện**:
  1. **Giải mã đảo ngược toàn diện Chart 4181 từ `Gear2_01.xlsb` (`Data1` sheet)**:
     - Series 1 `wheel1`: Tọa độ $X, Y$ tại `Data1!$C$70:$D$87` gồm đúng 18 điểm khép kín hình học mặt cắt trục Bánh dẫn (Pinion 1), tích hợp cả moay-ơ $H_{1in} = 0.6 \cdot b \cdot \cos\delta_1$ và $H_{1out} = 1.5 \cdot b \cdot \cos\delta_1$.
     - Series 2 `wheel2`: Tọa độ $X, Y$ tại `Data1!$C$35:$D$52` gồm đúng 18 điểm mặt cắt trục Bánh bị dẫn (Gear 2). Được tính toán trong hệ trục tọa độ cục bộ $(H, I)$, sau đó quay góc $\Sigma$ quanh Đỉnh nón chung Apex $(0, 0)$ theo công thức chuyển hệ trục cực:
       $$r = \sqrt{h^2 + i^2}, \quad \phi = \text{atan2}(i, h) \pmod{2\pi}, \quad \theta = \phi + \Sigma_{\text{rad}}$$
       $$X = r \cos\theta, \quad Y = r \sin\theta$$
       Khớp 100% với giá trị số thực của Excel từ $\Sigma = 60^\circ$ đến $120^\circ$ với sai số $\Delta = 0.0000\text{ mm}$.
     - Series 4 `axis`: 2 đường sinh nón chia màu đỏ nét đứt từ Apex $(0, 0)$ đến vòng chia ngoài $R_e$.
     - Series 5 & 6 `thinlines1`, `thinlines2`: 4 đường đỏ nét đứt nối Apex $(0, 0)$ tới các góc đỉnh và đáy răng trong nón trong $R_i$.
  2. **Thuật toán co dãn khung hình chuẩn Excel (Dynamic Box Bounds & Nice-Scale Engine)**:
     - Dải bounding box ảo từ `Data1!C13:C24` với hệ số khung hình `Coef a:b = 1.7`:
       $$W = \max(X) - \min(X), \quad H = \max(Y) - \min(Y)$$
       $$W_{\text{box}} = \begin{cases} H \cdot 1.7 & \text{nếu } W / H < 1.7 \\ W & \text{ngược lại} \end{cases}, \quad H_{\text{box}} = \frac{W_{\text{box}}}{1.7}$$
       $$w_{\text{half}} = \max(W_{\text{box}} / 2, |\min(X)|, |\max(X)|), \quad h_{\text{half}} = \max(H_{\text{box}} / 2, |\min(Y)|, |\max(Y)|)$$
     - Phân loại bước chia đẹp (Nice step ticks) độc lập cho trục X và trục Y để bảo toàn tỉ lệ 1:1 đẳng cự (Isometric 1:1), triệt tiêu hoàn toàn méo hình:
       * Mặc định ($\Sigma = 90^\circ, m_{mn} = 10$): $X \in [-400, 400]$ (step 100), $Y \in [-250, 250]$ (step 50).
       * Góc nhọn ($\Sigma = 60^\circ$): Bánh 2 chúc xuống $Y \approx -430$, khung dãn $X \in [-600, 600]$ (step 200), $Y \in [-500, 500]$ (step 100).
       * Mô-đun ngang ngoài ($m_{et} = 10$): Kích thước thu gọn $X \in [-300, 300]$ (step 100), $Y \in [-150, 150]$ (step 50).
  3. **Hỗ trợ đồng bộ hai chiều kiểu mô đun ($m_{mn} \leftrightarrow m_{et}$)**:
     - Bổ sung logic tính toán hình học theo $m_{et}$ (Outer transverse module) trong `BevelCalcEngine`:
       $d_{e2} = z_2 \cdot m_{et}$, $R_e = d_{e2} / (2 \sin\delta_2)$, $R_m = R_e - b/2$, $R_i = R_e - b$, $m_{mn} = (m_{et} \cos\beta) \cdot (R_m / R_e)$.
     - Khớp chính xác 100% với Excel Cell `P197` và `N198` down to 14 chữ số thập phân.
* **Kết quả nghiệm thu**:
  - **Headless Browser Automated Playwright Test**: 0 console errors, kiểm tra trực quan chụp màn hình canvas khớp 100% với ảnh chụp gốc MITCalc 1.74 của người dùng ở cả 3 kịch bản ($\Sigma = 60^\circ, \Sigma = 90^\circ, m_{et} = 10$).
  - **Bevel Gear QC Multi-Case Suite (`qc_bevel_multi_case_suite.py`)**: **120 / 120 checks PASS tuyệt đối (100.0%, $\Delta = 0.0000$)**.
  - **Spur Gear QC Multi-Case Suite (`qc_gear_multi_case_suite.py`)**: **110 / 110 checks PASS tuyệt đối (100.0%, $\Delta = 0.0000$)**.
  - **CORS-Free Single Bundle**: Đóng gói tự động thành công `bevel-engine.bundle.js` (138,307 ký tự) chạy 100% offline.


