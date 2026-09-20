---
name: mitcalc-webapp-engineering
description: Complete engineering guide and runbook for developing, modularizing, testing, and maintaining 100% offline client-side mechanical engineering Web Apps replacing MITCalc. Covers spur/helical gears (ISO 6336), bevel gears (ISO 23509), 2D Canvas CAD rendering, zero-tolerance multi-case QC cross-checking (Delta = 0.0000), and modular expansion.
---

# MITCalc Web App Engineering Skill & Runbook

## 1. Tầm Nhìn & Kiến Trúc Tổng Thể (Architectural Blueprint)

Hệ thống Web App Tính Toán Cơ Khí độc lập là giải pháp công nghệ cao thay thế toàn diện phần mềm MITCalc chạy trên nền Microsoft Excel (.xls / .xlsb), mang lại các ưu điểm vượt trội:
1. **100% Client-Side Pure Execution**: Toàn bộ thuật toán hình học, ăn khớp, độ bền và dung sai chạy trực tiếp trên trình duyệt web, không cần cài đặt Node.js hay môi trường backend.
2. **Tính di động tuyệt đối (Zero-Dependency Portability)**: Khi người dùng sao chép thư mục dự án sang bất kỳ máy tính nào (Dell 5548, HP Pavilion, hoặc máy trạm mới), ứng dụng khởi động tức thì offline 100% không cần kết nối mạng Internet.
3. **CORS-Free Single Bundle Protocol**: Trình duyệt chặn `import` giữa các file JS khi mở qua giao thức `file:///`. Bắt buộc đóng gói mã nguồn thành một file JavaScript thuần (Classic Script) để người dùng nhấp đúp trực tiếp vào file HTML là chạy ngay.
4. **Cô lập kiến trúc mô-đun (Modular Isolation)**: Mỗi phân hệ tính toán cơ khí là một module hoàn toàn độc lập nằm trong thư mục con riêng biệt, bảo vệ tuyệt đối không bao giờ làm ảnh hưởng lẫn nhau khi bảo trì hay mở rộng.

---

## 2. Cấu Trúc Thư Mục Chuẩn Hóa (Standardized Directory Tree)

```text
MITCalc-WebApp/
├── index.html                           # Cổng Trung Tâm (Central Engineering Portal Hub)
├── shared/                              # Thư viện dùng chung giữa các Module
│   ├── css/
│   │   └── engineering-theme.css        # Giao diện kỹ thuật Dark Engineering chuẩn
│   └── js/
│       ├── materials.js                 # CSDL 51 loại vật liệu kỹ thuật chuẩn quốc tế
│       ├── math-utils.js                # Giải thuật Involute ngược Newton-Raphson
│       └── standard-tables.js           # Bảng tra dung sai ISO 1328 & hệ số hình học
├── modules/
│   ├── spur-gear/                       # MÔ-ĐUN 1: BÁNH RĂNG TRỤ & NGHIÊNG (ISO 6336)
│   │   ├── index.html                   # Giao diện Accordion 12 phân mục (1.0 đến 18.0)
│   │   ├── js/
│   │   │   ├── mitcalc-engine.bundle.js # Classic Bundle (CORS-free)
│   │   │   ├── engine/                  # Geometry, Strength, Profile, Solver
│   │   │   └── ui/                      # 2D Canvas CAD, UI Controller
│   │   └── tests/
│   │       └── qc_gear_multi_case_suite.py # Test Suite QC 5 kịch bản (110 checks Pass)
│   └── bevel-gear/                      # MÔ-ĐUN 2: BÁNH RĂNG CÔN (ISO 23509)
│       ├── index.html                   # Giao diện Accordion 12 phân mục (1.0 đến 15.0)
│       ├── js/
│       │   ├── bevel-engine.bundle.js   # Classic Bundle (CORS-free)
│       │   ├── bevel-calc-engine.js     # Động cơ hình học nón & Tredgold
│       │   ├── bevel-canvas.js          # Mô hình 2D Canvas nón ăn khớp & Apex V
│       │   └── bevel-ui.js              # Controller giao diện & CSDL vật liệu
│       └── tests/
│           └── qc_bevel_multi_case_suite.py # Test Suite QC 5 kịch bản (110 checks Pass)
└── CHAY_WEBAPP_*.bat                    # Các bộ khởi động 1-Click tại thư mục gốc
```

---

## 3. Các Quy Chuẩn Kỹ Thuật Bắt Buộc (Mandatory Protocols)

### Quy Chuẩn 1: Giao Diện Accordion Mặc Định Thu Gọn (Default-Collapsed Accordion)
* 100% các phân mục tính toán khi mở trang đều ở trạng thái đóng gọn (`calc-section collapsed` với biểu tượng `▶`). Nhấp vào thanh tiêu đề để mở rộng (`▼`).
* Bắt buộc cung cấp hai nút toàn cục: **"📂 Mở Rộng Tất Cả"** và **"📁 Thu Gọn Tất Cả"**.
* Thanh Executive Summary Banner ở trên cùng hiển thị tức thì trạng thái an toàn hình học và các thông số cốt lõi.

### Quy Chuẩn 2: Đồ Họa 2D Canvas Chuẩn Công Nghiệp
1. **Bánh răng trụ**:
   * **Triệt tiêu hiện tượng sừng nhọn (Horn Elimination)**: Khi số răng lớn ($z_2=48, r_f \ge r_b$), đường thân khai bắt đầu trực tiếp từ $r_f$, không hạ xuống $r_b$.
   * **Đẳng cấp tiếp tuyến mượt $C^1$ bằng đa thức Hermite bậc 3 (C1 Smooth Cubic Hermite Root Fillet)**:
     Chân răng chuyển tiếp từ bán kính định hình $r_{\text{form}} = \max(r_b, r_f)$ xuống bán kính đáy $r_f$ tại góc nửa bước $\theta = \pm \frac{\pi}{z}$ theo đa thức nội suy Hermite:
     $$r(t) = h_{00}(t) \cdot r_{\text{form}} + h_{01}(t) \cdot r_f + h_{10}(t) \cdot \left(-\frac{dr}{d\theta}\Big|_{\text{form}} \cdot \Delta\theta \cdot 0.4\right)$$
     với $t \in [0, 1]$, $h_{00} = 2t^3 - 3t^2 + 1$, $h_{01} = -2t^3 + 3t^2$, $h_{10} = t^3 - 2t^2 + t$.
     Đảm bảo tiếp tuyến đáy $\frac{dr}{d\theta} = 0$ tại $\theta = \pm \frac{\pi}{z}$, triệt tiêu hoàn toàn góc nhọn, tự giao (self-intersection) và bảo đảm cân bằng 50%/50% giữa chiều dày răng và chiều rộng rãnh răng trên toàn bộ vành răng.
   * **Ăn khớp liên hợp không va chạm (Zero-Collision Conjugate Rolling Meshing)**:
     Khi Bánh dẫn 1 có đỉnh răng tại $\theta_1 = 0$ (hướng tâm sang Bánh 2), Bánh bị dẫn 2 tại tọa độ $(a_w, 0)$ bắt buộc phải có tâm rãnh răng quay về hướng Bánh dẫn 1 (góc $\pi$).
     Góc pha chuẩn xác: $\theta_{\text{phase}} = \pi + \frac{\pi}{z_2}$, góc quay theo thời gian: $\theta_2 = \theta_{\text{phase}} - \theta_1 \cdot \frac{z_1}{z_2}$.
     Được kiểm chứng bằng thuật toán Point-in-Polygon: Đạt **0.0000 mm** xuyên thân răng xuyên suốt 100% chu trình quay 50 bước ($0/50$ va chạm).
2. **Bánh răng côn**:
   * **Mặt cắt trục kỹ thuật ăn khớp (Tab 2 Canvas CAD)**:
     - Mô hình hóa chính xác hai nón chia ăn khớp, đỉnh nón chung $V$, trục hợp góc $\Sigma$.
     - Hiển thị đường sinh tiếp xúc (Pitch generator line), các cung kích thước $R_e, R_m, R_i$ và bề rộng vành răng $b$.
     - Tương tác mượt mà: Phóng to/thu nhỏ (Zoom), dịch chuyển góc nhìn (Pan), và mô phỏng chuyển động quay ăn khớp liên hợp.
   * **Đồ thị Tọa độ Mặt Cắt Trục Ăn Khớp 2D Động Section 4.0 (Dynamic Chart 4181 Engine)**:
     - Dựng từ đúng 18 điểm hình học thực thể cho Bánh 1 (`Data1!C70:D87`) và 18 điểm cho Bánh 2 (`Data1!C35:D52`) xoay góc $\Sigma$ quanh Apex $(0, 0)$ theo công thức cực: $r = \sqrt{h^2 + i^2}, \theta = \phi + \Sigma_{\text{rad}}, X = r \cos\theta, Y = r \sin\theta$.
     - Thuật toán co dãn khung hình chuẩn Excel `Data1!C13:C24` với tỷ lệ `Coef a:b = 1.7`, kết hợp nấc chia đẹp (Nice step ticks) độc lập cho trục X và Y nhằm bảo toàn tỷ lệ 1:1 đẳng cự (Isometric 1:1), phản ứng tức thì khi thay đổi bất kỳ thông số nào ($\Sigma = 60^\circ \to 120^\circ, m_{mn}, m_{et}, b, x_1$).

### Quy Chuẩn 3: Quy Trình Kiểm Soát Chất Lượng Kép (Dual Persona QC Protocol)
Mỗi khi phát triển hoặc cập nhật mô-đun tính toán, bắt buộc đóng vai trò kép:
1. **Chuyên gia Tính toán Bánh răng (Gear Engineering Specialist)**: Kiểm soát bản chất hình học, cắt lẹm, nhọn đỉnh, và tiêu chuẩn quốc tế.
2. **Trưởng nhóm Kiểm soát Chất lượng (QC Lead)**: Chạy tự động hóa kết nối Excel COM Automation với MITCalc gốc trên **Ma trận 5 kịch bản thiết kế thực tế**.
3. **Tiêu chuẩn nghiệm thu**: 100% các thông số hình học và kích thước đo kiểm đạt sai số **$\Delta = 0.0000$**. Đồng bộ toàn bộ 203 mã ID hiển thị, triệt tiêu 100% các ký hiệu giữ chỗ `--`.

### Quy Chuẩn 4: Phạm Vi Loại Bỏ 100% Thông Số Tính Lực (Zero-Force Scope Protocol)
* Theo chỉ đạo trực tiếp của người dùng: "tất cả các thông số tính toán về lực thì bạn bỏ qua hết cho tôi".
* Web App tập trung chuyên sâu 100% vào: Hình học tiêu chuẩn (ISO/DIN), dung sai chế tạo ISO 1328, kích thước đo kiểm tra (W, M), tỷ số truyền, động học, và cơ tính 51 loại vật liệu.
* Lược bỏ toàn bộ các phép tính lực vòng $F_t$, lực hướng tâm $F_r$, lực dọc trục $F_a$, lực pháp tuyến $F_n$, lực trung bình $F_m$, độ võng trục $f_{sh}$, và bảng tra phân bố tải theo trục trong Section 18 (dòng 18.4 - 18.20).

### Quy Chuẩn 5: Kiến Trúc Chuyển Tab Mượt Mà & Đối Chiếu Song Song Trực Tiếp Excel COM
1. **Khắc phục triệt để lỗi chuyển tab**:
   * Không đặt thuộc tính nội dòng `style="display:none"` trong thẻ HTML của các tab panel phụ.
   * Áp dụng quy chuẩn CSS trong `app.css`:
     ```css
     .tab-pane { display: none !important; }
     .tab-pane.active { display: block !important; }
     ```
   * Trong `UIController.initEvents()`: Luôn đồng thời cập nhật class `.active` và thuộc tính `style.display = 'block'` / `'none'`.
2. **Đối chiếu song song trực tiếp với Excel COM**:
   * Cấu hình `excel.AutomationSecurity = 1` để tải đầy đủ thư viện `MITCalc64.dll`.
   * Ánh xạ chính xác các ô tính trong sheet `Calculation` (Pinion tại cột O, Gear tại cột P, ISO 1328 tại cột V/W/X/Y, Section 18 tại cột R).
   * Đo kiểm đối chiếu song song với Edge Headless DOM dump đạt **100% PASS (117/117 thông số)**.

### Quy Chuẩn 6: Quy Chuẩn Tính Toán Giải Tích Động ISO 1328, Khe Hở Cạnh Bên & Biến Thiên Đỉnh
1. **Dung sai chế tạo ISO 1328 giải tích động (ISO 1328 Dynamic Tolerance Engine)**:
   * Trích xuất 4 bảng dải bước từ sheet `Tables`: $T_{\text{modulx}}, T_{\text{modulx2}}, T_{\text{diamx}}, T_{\text{bx}}$.
   * Hàm tra bước: $m_g = \sqrt{m_{\min} \cdot m_{\max}}$, $d_g = \sqrt{d_{\min} \cdot d_{\max}}$, $b_g = \sqrt{b_{\min} \cdot b_{\max}}$.
   * Hệ số cấp chính xác: $F_Q = 2^{0.5(Q - 5)}$.
   * 18 công thức giải tích chuẩn ISO: $f_{pt}, F_{pk}, F_p, F_\alpha, F_\beta, f'_i, F'_i, f_{f\alpha}, f_{H\alpha}, f_{f\beta}, f_{H\beta}, f''_i, F''_i, F_r$.
   * Quy tắc làm tròn ISO: `val < 5 ? round(val, 1) : (val > 10 ? round(val, 0) : round(val * 2) / 2)`.
2. **Khe hở cạnh bên Min / Max khuyên dùng**:
   * $j_{n\min} = 6 \cdot \sqrt{a_w} \cdot 10^{-3}\text{ mm}$.
   * $j_{n\max} = 24 \cdot \sqrt{a_w} \cdot 10^{-3}\text{ mm}$.
3. **Khe hở cạnh bên lựa chọn chế tạo ($j_n$)**:
   * Là ô nhập liệu tùy chọn của kỹ sư (User Input), mặc định `0.0000 mm`.
   * Tự động liên kết tính: $j_{wt} = j_n / (\cos\beta_b \cos\alpha_{wt})$, $j_{tb} = j_n / \cos\beta_b$, $\Delta a_w = j_n / (2 \sin\alpha_{wt})$.
4. **Khoảng biến thiên đường kính đỉnh cho phép ($d_a \min/\max$)**:
   * $d_{a1\min} = 2(a_w - d_{f2}/2 - 0.5 m_n)$, $d_{a1\max} = 2(a_w - d_{f2}/2 - 0.25 m_n) \implies$ `123 / 126`.
   * $d_{a2\min} = 2(a_w - d_{f1}/2 - 0.5 m_n)$, $d_{a2\max} = 2(a_w - d_{f1}/2 - 0.25 m_n) \implies$ `297 / 300`.
5. **Đường kính đỉnh răng yêu cầu ($d_a\text{ req}$)**:
   * Ô nhập liệu kích thước đỉnh mong muốn (mặc định $124.0$ và $298.0$ mm).
   * Tự động tính ngược hệ số hở đỉnh dao: $c_a^* = (a_w - d_f/2 - d_{a\text{ req}}/2) / m_n$.

### Quy Chuẩn 7: Chuẩn Hóa Cấp Chính Xác Chế Tạo ISO 1328, Đồng Bộ Hai Chiều & Bộ Giải Nghịch W/M (Section 11)
1. **Quy chuẩn danh mục Cấp chính xác chế tạo (Accuracy Grade)**:
   * Khớp 100% nguyên mẫu bảng `T_AG` của MITCalc 1.74 (từ Cấp 3 đến Cấp 12):
     - `3 .... (Ra max.= 0.1 / v max.= 80)` (Value: 3)
     - `4 .... (Ra max.= 0.2 / v max.= 60)` (Value: 4)
     - `5 .... (Ra max.= 0.4 / v max.= 35)` (Value: 5)
     - `6 .... (Ra max.= 0.8 / v max.= 15)` (Value: 6 - Mặc định)
     - `7 .... (Ra max.= 1.6 / v max.= 8)` (Value: 7)
     - `8 .... (Ra max.= 1.6 / v max.= 5)` (Value: 8)
     - `9 .... (Ra max.= 3.2 / v max.= 3)` (Value: 9)
     - `10 .. (Ra max.= 6.3 / v max.= 3)` (Value: 10)
     - `11 .. (Ra max.= 12.5 / v max.= 3)` (Value: 11)
     - `12 .. (Ra max.= 25 / v max.= 3)` (Value: 12)
2. **Cơ chế đồng bộ hai chiều (Bidirectional Sync)**:
   * Xuất hiện tại cả 2 vị trí: **Mục 2.7** (`#selAccuracy`) và **Mục 11.14** (`#selAccuracySec11`) đều là thẻ `<select>` chứa 10 cấp độ trên.
   * Khi thay đổi cấp chính xác tại Mục 2.7 hoặc Mục 11.14, dropdown ở vị trí còn lại tự động cập nhật ngay lập tức và toàn bộ 18 thông số dung sai ISO 1328 được tính toán lại theo $F_Q = 2^{0.5(Q - 5)}$.
3. **Bộ giải nghịch hệ số dịch chỉnh $x$ từ $W_{\text{req}}$ và $M_{\text{req}}$ (Section 11 Solvers)**:
   * Khớp 100% nguyên lý các nút bấm macro `BT_911` ($W_1 \to x_1$), `BT_910` ($W_2 \to x_2$), `BT_912` ($M_1 \to x_1$), `BT_913` ($M_2 \to x_2$) của MITCalc:
     - Giải $x$ từ $W_{\text{req}}$: $x = \frac{W_{\text{req}} - m_n \cos\alpha_t [(z_w - 0.5)\pi + z \cdot \text{inv}\alpha_t]}{2 m_n \sin\alpha_n}$.
     - Giải $x$ từ $M_{\text{req}}$: Thuật toán nhị phân giải ngược hàm $M(x)$ trên khoảng $[-1.5, 2.5]$ đạt độ chính xác $10^{-6}$.
   * Tự động điền $x_1$ hoặc $x_2$ mới vào Section 5.0, cập nhật $\Sigma x$ và tính toán lại toàn bộ hệ thống ăn khớp.
4. **Hỗ trợ dấu phẩy thập phân kiểu Việt Nam (Locale-Safe Input Parsing)**:
   * Mọi ô nhập số thực (`input[data-key]`) đều tự động chuyển đổi ký tự phẩy `,` thành chấm `.` (`String(input.value).trim().replace(',', '.')`) trước khi `parseFloat()`, triệt tiêu lỗi mất phần thập phân khi gõ `10,5`.

---

### Quy Chuẩn 8: Quy Trình Rà Soát Song Song Từng Dòng Zero-Tolerance Khép Kín (Row-by-Row Closed-Loop Audit)
1. **Bắt buộc rà soát song song từng ô tính (Row-by-Row Parallel Verification)**:
   - Trích xuất toàn bộ công thức (.Formula) và giá trị số thực thô (.Value) từ sheet `Calculation` và `DXFTables` của bản gốc `C:\MITCalc\gear2\Gear2_01.xlsb`.
   - Đối chiếu trực tiếp từng ô tính giữa Excel COM và JavaScript runtime bằng Playwright Headless (`deep_line_by_line_bevel_audit.py`).
   - Tiêu chuẩn nghiệm thu số học: **100% 109 ô tính khớp tuyệt đối đến $10^{-6}$ ($\Delta = 0.000000$)**.
2. **Các chuẩn hóa công thức cốt lõi cho Bánh Răng Côn (Bevel Gear Formulation)**:
   - **Phân định răng ảo**: $z_{vn} = z / \cos\delta$ (Row 236 `zvn'` dùng tính trùng khớp ngang $\varepsilon_\alpha$) và $zv = z / (\cos\delta \cos^3eta)$ (Row 237 `zv` Tredgold).
   - **Hệ số trùng khớp ngang**: $\varepsilon_\alpha = \frac{z_{vn1}}{2\pi}(\tan\alpha_{A1} - \tan\alpha_t) + \frac{z_{vn2}}{2\pi}(\tan\alpha_{A2} - \tan\alpha_t)$ đạt $1.4289$.
   - **Hệ số dịch chỉnh chiều dày răng**: $x_{\tau1} = +0.04, x_{\tau2} = -0.04$ cộng trực tiếp vào $s_{ne}, s_n, s_{ni}$.
   - **Hệ số chiều dày đỉnh chuẩn**: $s_{ae}^* = s_{ae} / m_{en}$ (Row 233, chia cho mô đun pháp ngoài).
3. **Quy trình lặp Zero-Tolerance**: Bất kỳ khi nào phát hiện sai lệch dù chỉ 1 con số sau dấu phẩy, lập tức truy xuất công thức gốc từ file dump, hiệu chỉnh mã nguồn JavaScript, tái tạo bundle và chạy lại toàn bộ kiểm thử cho đến khi đạt 100.0% PASS.

---

### Quy Chuẩn 9: Đồng Bộ Cấu Trúc & Vị Trí Phân Mục 1-to-1 Với Bản Gốc MITCalc (1-to-1 Structural Layout Alignment Protocol)
Để người dùng dễ dàng kiểm soát và đối chiếu song song giữa Web App và phần mềm MITCalc 1.74 gốc, bố cục phân mục và số thứ tự dòng phải tuân thủ nghiêm ngặt:
1. **Phân bổ vị trí 1-to-1 tương đối giữa Web App và sheet `Calculation`**:
   * **Mục 1.0: Nhập các thông số truyền động cơ bản (1.1 - 1.5)**: $P, n_1, n_2, M_{k1}, M_{k2}, i_{\text{req}}, i_{\text{act}}$. Tuyệt đối không đưa số răng hay mô đun lên mục 1.0.
   * **Mục 2.0: Vật liệu, chế độ tải trọng & cấp chính xác (2.1 - 2.10)**: Mác thép 1 & 2, $R_m, R_p, \sigma_H, \sigma_F$, độ cứng HV, hệ số quá tải $K_A$, cấp chính xác $Q$, tuổi thọ $L_h$.
   * **Mục 3.0: Thông số biên dạng răng & kiểu răng (3.1 - 3.3)**: Kiểu răng (Gleason / Straight / Klingelnberg), $h_{a0}^* = 1.0, c_0^* = 0.2$.
   * **Mục 4.0: Thiết kế mô đun & thông số ăn khớp (4.1 - 4.8)**: $z_1, z_2$, góc trục $\Sigma=90^\circ$, góc ăn khớp $\alpha=20^\circ$, góc xoắn $\beta=30^\circ$, hướng xoắn, $b/R_e$, mô đun $m_{mn}$, bề rộng vành răng $b$.
   * **Mục 5.0: Dịch chỉnh biên dạng & chiều dày răng (5.1 - 5.7)**: Phương pháp dịch chỉnh, $x_{\text{rec}}$, chống cắt lẹm, $x_1, x_2$, dịch dày $x_{\tau1}, x_{\tau2}$, hệ số trùng khớp tổng $\varepsilon_\gamma$, hệ số chiều dày đỉnh $s_{ae}^*$.
   * **Mục 6.0: Kích thước cơ bản đầy đủ 39 dòng (6.1 - 6.39)**: Thể hiện trọn vẹn 3 mặt cắt Ngoài (`outer`), Giữa (`middle`), Trong (`inner`) cho tất cả các thông số: $m_t, m_n, R, \delta, \delta_a, \delta_f, d_a, d, d_f, \theta_a, \theta_f, h_a, h_f, \alpha_n, \alpha_t, \beta, \beta_b, \alpha_{wn}, \alpha_{wt}, p_e, p_{te}, s_n, s_a, s_{ae}^*$.
   * **Mục 7.0: Bánh răng trụ tương đương Tredgold (7.1 - 7.8)**: $z_{vn}, z_v, d_{vm}, d_{va}, d_{vb}, d_{vf}, a_v, i_v$.
   * **Mục 8.0: Chỉ số chất lượng bộ truyền (8.1 - 8.4)**: $\varepsilon_\alpha, \varepsilon_\beta, \varepsilon_\gamma, m, \eta$.
   * **Mục 11.0: Lắp ráp, đo kiểm mỏ kẹp & dung sai (11.1 - 11.7)**: Vị trí đỉnh nón, chiều dày dây cung $\bar{s}_c$, chiều cao dây cung $h_c$, cấp chính xác $Q$, dung sai $f_{pt}, F_\beta, F_r$.
   * **Mục 16.0: Bảng thông số chế tạo gia công DXFTables (16.1 - 16.10)**: Khớp nguyên mẫu bảng chế tạo DIN 3965 trong sheet `DXFTables`.
2. **Lược bỏ 100% lực và ứng suất**: Không hiển thị các mục lực truyền động ($F_t, F_r, F_a, F_n$) và ứng suất uốn/tiếp xúc theo chỉ thị tối thượng của chủ sở hữu.

### Quy Chuẩn 10: Trải Nghiệm Thực Tế, Phân Khối Master & Bảng Đối Chiếu Live Audit Chuẩn 1-to-1 MITCalc 1.74
1. **Phân chia 3 khối lớn Master Blocks với màu sắc nhận diện đặc trưng**:
   - `Phần Đầu Vào (Input Section)`: Thanh tiêu đề Master màu xanh lá cây (`#107c41`) gom Mục 1.0 đến 5.0.
   - `Phần Kết Quả Tính Toán (Results Section)`: Thanh tiêu đề Master màu vàng cam (`#c55a11`) gom Mục 6.0 đến 8.0.
   - `Phần Bổ Sung & Bảng Chế Tạo (Additions & Manufacturing)`: Thanh tiêu đề Master màu xanh dương/cam gom Mục 14.0 và 17.0.
2. **Quy chuẩn màu sắc & ô nhập liệu chuẩn văn phòng kỹ thuật**:
   - Ô nhập liệu (`.user-input`): Nền trắng `#ffffff`, chữ đen `#111827`, viền rõ nét 1.5px bo góc 4px, hỗ trợ dấu phẩy tiếng Việt.
   - Ô kết quả (`.output-eng`): Nền sẫm màu, chữ cyan / xanh dương nổi bật, cố định không cho sửa đổi.
   - Ô giới hạn khuyến nghị (`.cell-limit`): Nền xanh lá cây dịu mắt chuẩn MITCalc, hiển thị rõ các ràng buộc kỹ thuật.
3. **Hệ thống nút bấm tiện ích thông minh thuận nghịch & thanh trượt**:
   - `[ i <= n1,n2 ]`: Tính tự động tỉ số truyền từ tốc độ quay $i = n_1 / n_2$.
   - `[ Pw <= Mk,n ]`: Tính ngược công suất từ mô-men và tốc độ $P = (M_{k1} \cdot n_1) / 9550\text{ kW}$.
   - `[ i <= z1,z2 ]`: Đồng bộ tỉ số truyền và số răng $i = z_2 / z_1$.
   - `[ Design gearing ]` & `[ Run ]`: Thuật toán thiết kế tự động sơ bộ.
   - Thanh trượt Slider $b/R_e$ ($0.15 \div 0.35$) và Slider dịch chỉnh $x_1$ ($-0.5 \div +1.0$) phản ứng mượt mà theo thời gian thực.
4. **Tab 2: Bảng Đối Chiếu Song Song Trực Tiếp (Live Audit Table)**:
   - Tích hợp riêng Tab 2 hiển thị bảng đối chiếu thời gian thực (Live Audit) 108 ô tính toán cốt lõi giữa Web App và MITCalc 1.74 theo từng tọa độ ô tính Excel (`P117, P118, Q118, P119, Q119, P144, P196, P202...`).
   - Đạt chuẩn Zero-Tolerance tuyệt đối: **100.0% PASS ($\Delta = 0.000000$)**.
   - Cung cấp nút "Cập Nhật Lại" (`#btnRefreshAudit`) và "Mặc Định" (`#btnResetDefaults`) giúp kỹ sư kiểm chứng trực tiếp tính toàn vẹn toán học mọi lúc mọi nơi.

---

### Quy Chuẩn 11: Chuẩn Hóa Bán Kính Lượn Chân Răng Bánh Răng Trụ $R = 0.38 m_n$ & Bảo Tồn Cung Đáy Rãnh
1. **Thuật toán tiếp tuyến giải tích chính xác**:
   - Tuân thủ DIN 3960 / ISO 1122-1 với $R = \rho_{f0} = 0.38 \cdot m_n$.
   - Tâm lượn $C(x_c, y_c)$ được xác định sao cho cung tròn bán kính $R$ tiếp tuyến mượt $C^1$ với đường thân khai tại $r_t$ và tiếp tuyến với đường tròn đáy $r_f = d_f / 2$.
   - Xử lý mượt mà cả 2 trường hợp: $r_f \ge r_b$ (tiếp tuyến thân khai) và $r_f < r_b$ (tiếp tuyến đoạn thẳng hướng tâm nối từ $r_b$ xuống $r_f$).
2. **Bảo tồn cung đáy rãnh răng (Root Land Arc)**:
   - Cung tròn đáy rãnh ở bán kính $r_f$ được giữ nguyên vẹn từ góc tiếp xúc $\theta_c$ đến góc nửa bước răng $\pi / z$.
   - Không được dùng spline kéo dài tùy tiện làm mất đáy rãnh hoặc biến dạng thành đỉnh nhọn.
3. **Triệt tiêu sừng nhọn (Horn Elimination)**: Khi $z_2 = 48$ dẫn tới $r_f \ge r_b$, thân khai bắt đầu trực tiếp từ $r_f$. Khớp 100% với 120 điểm tọa độ biên dạng trong sheet `Coordinates` của MITCalc 1.74.

---

### Quy Chuẩn 12: Bản Vẽ Mặt Cắt Trục Kỹ Thuật Bánh Răng Côn Tiêu Chuẩn ISO 23509
1. **Đặc tả hình học bổ dọc trục**:
   - Triệt tiêu sai lầm vẽ vòng tròn phẳng 2D. Bánh răng côn bắt buộc vẽ dưới dạng **Mặt cắt trục kỹ thuật cơ khí (Axial Cross-Section)** theo ISO 23509.
   - Đỉnh nón chung Apex $V(0,0)$ làm gốc tọa độ. Trục bánh 1 hướng theo $X$, trục bánh 2 hướng theo $Y$ ($\Sigma = 90^\circ$).
   - Đường sinh nón chia tiếp xúc qua bề rộng $b$ từ nón ngoài $R_e$ đến nón trong $R_i$.
   - Mặt nón đỉnh $\delta_a$, mặt nón đáy $\delta_f$, mặt nón phụ ngoài/trong vuông góc đường sinh nón chia.
   - Cặp răng ăn khớp liên hợp bổ dọc trục, moay-ơ, lỗ trục $d_s$, gạch mặt cắt kim loại (Hatching $45^\circ$).
2. **Tự động căn giữa cân đối (Auto-Centering Bounding Box)**:
   - Tự động tính toán khung bao từ Apex $V$ đến các điểm xa nhất của bánh 1 và bánh 2, co giãn tỉ lệ phù hợp và đặt ngay chính giữa Canvas 1200x650.

---

### Quy Chuẩn 13: Bảng Rà Soát Song Song Trực Tiếp Live Audit Bánh Răng Trụ & Nghiêng (306/306 Ô Tính)
1. **Rà soát 306 ô tính toán thời gian thực cho cả 2 trường hợp**:
   - Tích hợp Tab 2 trong Web App Bánh Răng Trụ rà soát 153 ô tính toán cốt lõi cho Spur Gear ($\beta = 0^\circ$) và 153 ô tính toán cho Helical Gear ($\beta = 15^\circ$) đối chiếu trực tiếp với bản gốc `Gear1_01.xlsb`.
   - Đạt chuẩn Zero-Tolerance tuyệt đối: **100.0% PASS (306/306 ô tính) với $\Delta = 0.000000$**.
2. **Hiệu suất $\eta$ và Mô-men $M_{k2}$**:
   - Khối lượng riêng chuẩn xác $\rho = 7870.0\text{ kg/m}^3$ (Row 441), đường kính trục tối thiểu $d_{\text{shaft}} = R_{m1}^{0.8} / (5 \cdot \max(K_A, 1.25)^{1.7})$ (Row 299).
   - Hệ số tải động $K_v$ và hiệu suất $\eta = 0.9905$ giúp mô-men xoắn $M_{k2}$ đạt khớp tuyệt đối `2389.7418` ($\Delta = 0.000000$).
3. **Bộ công cụ kiểm thử tự động 1-Click**:
   - `RA_SOAT_SONG_SONG_BANH_RANG_TRU.bat`: Rà soát trực tiếp 306 thông số giữa live Web App Playwright runtime và Excel COM.
   - `KIEM_TRA_CHEO_QC_BANH_RANG_TRU.bat`: Chạy ma trận 5 kịch bản thiết kế thực tế (110/110 checks PASS 100%).

---

### Quy Chuẩn 14: Thuật Toán Giải Tích Involute Ngược Chuẩn 1-to-1 MITCalc VBA & Hình Học Răng Nghiêng
1. **Thuật toán giải Involute ngược 1-to-1 MITCalc VBA (`Invol` Binary Solver)**:
   - Trích xuất trực tiếp từ module `GearFunctions.bas` (dòng 764-792) của `Gear1_01.xlsb`:
     ```javascript
     inv(aDeg) {
         const rad = aDeg * 3.141592653 / 180.0;
         return Math.tan(rad) - rad;
     }
     invol(X) {
         const pi = 3.14159265358979;
         X = Math.abs(X);
         if (X < 0.00000001) X = 0.00000001;
         if (X > 1.5707963) X = 1.5707963;
         let pom = 1, alfa = 0.0, delta = X / 2.0;
         const presnost = 0.0000001; // 1e-7
         while (true) {
             alfa = alfa + delta;
             const x1 = Math.tan(alfa) - alfa;
             const rozdil = X - x1;
             if (Math.abs(rozdil) < presnost) break;
             if (pom > 1000000) break;
             if (rozdil < 0) { alfa -= delta; delta /= 2.0; }
             pom++;
         }
         return alfa * 180.0 / pi;
     }
     ```
   - Nhờ giải thuật nhị phân chuẩn xác này, góc ăn khớp làm việc $\alpha_{wt}$ (O254), $\alpha_{wn}$ (O253), khoảng cách trục $a_w$ (O250) và đường kính đỉnh $d_{a1}, d_{a2}$ (O257, P257) khớp 100% từng số lẻ sau dấu phẩy với Excel COM ($\Delta = 0.000000$).
2. **Hình học bánh răng nghiêng ($\beta \ne 0^\circ$) & Đo kiểm Mục 11.0**:
   - **Số răng đo pháp tuyến chung khuyến nghị $z_{w\text{ calc}}$ (Row 390 / Section 11.2)**: Chia cho $\cos\beta \cos^2\beta_b$ để bù độ xoắn không gian:
     $$z_{w\text{ calc}} = \text{floor}\left( \frac{z \cdot \alpha_n}{180^\circ \cdot \cos\beta \cdot \cos^2\beta_b} + 0.5 + 0.8 \right)$$
     Khi $\beta = 30^\circ$, giá trị tự động cập nhật chính xác thành $z_{w1} = 4$ và $z_{w2} = 9$ (thay vì 3 và 6 của răng thẳng).
   - **Cơ chế Auto Checkbox `[X]` (`chkAutoZw`, `chkAutoDt`)**:
     * Khi Auto được bật (`checked = true`): Giá trị ô nhập áp dụng ($z_w, d_t$) tự động đồng bộ theo giá trị khuyến nghị $z_{w\text{ calc}}$ và $d_{t\text{ calc}} = 1.75 m_n$.
     * Khi người dùng bỏ chọn Auto: Cho phép tùy biến nhập bất kỳ số răng hoặc đường kính bi/đũa đo nào.
   - **Chiều dài pháp tuyến chung $W$ (Row 392 / Section 11.4)**:
     $$W = m_n \cos\alpha_n \left[ (z_w - 0.5)\pi + z \cdot \text{inv}\alpha_t \right] + 2 x m_n \sin\alpha_n$$
   - **Kích thước qua bi/đũa đo $M$ (Row 395 / Section 11.7)**:
     $$\text{inv}\alpha_{ts} = \text{inv}\alpha_t + \frac{1}{z} \left( 2 x \tan\alpha_n + \frac{d_t}{m_n \cos\alpha_n} - \frac{\pi}{2} \right)$$
     $$d_s = \frac{d_b}{\cos\alpha_{ts}}$$
     $$M = \begin{cases} d_s + d_t & (z \text{ chẵn}) \\ d_s \cos\left(\frac{\pi}{2z}\right) + d_t & (z \text{ lẻ}) \end{cases}$$
   - **Khoảng biến thiên cho phép $W_{\min}/W_{\max}$ & $M_{\min}/M_{\max}$ (Rows 397, 399 / Mục 11.9, 11.11)**:
     Tính toán theo giới hạn dịch chỉnh cắt chân răng $x_{\min\text{ cut}}$ và giới hạn nhọn đỉnh $x = 1.5$.
   - **Bộ giải ngược tham số GoalSeek (Mục 11.10, 11.12)**:
     * `[->x1]`: Giải chính xác $x_1$ từ kích thước $W_{1\text{ req}}$ hoặc $M_{1\text{ req}}$ mong muốn.
     * `[->Σx]`: Giải chính xác $\Sigma x$ từ kích thước $W_{2\text{ req}}$ hoặc $M_{2\text{ req}}$ mong muốn, đồng bộ $x_2 = \Sigma x - x_1$.
   - **Hệ thống dung sai ISO 1328 Phần 1 & Phần 2 (Mục 11.13 - 11.34)**:
     * Tích hợp bảng bước mô-đun $T_{\text{modulx2}}$ chuẩn cho ISO 1328-2.
     * Tính toán đầy đủ: $f''i$ (sai lệch ăn khớp đơn hướng tâm), $F''i$ (tổng sai lệch ăn khớp hướng tâm), và $F_r$ (độ đảo hướng tâm vành răng).
3. **Bộ tham số dao cắt tiêu chuẩn Mục 3.0 (`T_CutToolsDim`)**:
   Hỗ trợ 5 kiểu dao tiêu chuẩn (DIN 867 với $r_{a0}^*=0.38$, DIN 867 với $r_{a0}^*=0.25$, ANSI B6.1 với $r_{a0}^*=0.30$, ANSI B6.1 $h_{a0}^*=1.35$, và Dao lồi Protuberance với $d_0^*=0.02, \alpha_{np}=6^\circ$). Khi chọn dropdown, tự động điền đồng bộ toàn bộ 10 tham số dao cắt.
4. **Hệ thống Cấp chính xác ISO 1328 ($T_{\text{AG}}, T_{\text{MaxV}}$) & Cơ chế Auto Khóa Dòng 11.14**:
   - **10 Cấp chính xác chuẩn `T_AG`**: Grades 3 đến 12 với chuỗi hiển thị 1-to-1: `3....(Ra max.= 0.1 / v max.= 80)` đến `12..(Ra max.= 25 / v max.= 3)`.
   - **Vận tốc giới hạn động $v_{\max}$ dòng 8.18 (ô V437)**: `=INDEX(T_MaxV, _AG, IF(_beta=0, 3, 4))` tự động chuyển đổi giữa vận tốc giới hạn bánh răng thẳng và răng nghiêng (ví dụ Cấp 6: $15\text{ m/s}$ khi $\beta=0^\circ$ và $30\text{ m/s}$ khi $\beta\ne0^\circ$).
   - **Cơ chế Checkbox Auto Dòng 11.14 (`chkAutoAccuracy` / Shape 9677 / ô `B402`)**: Khi tích chọn `[X]`, cấp chính xác Mục 11.14 bị vô hiệu hóa và tự động khóa đồng bộ theo Mục 2.7. Khi bỏ tích, kỹ sư có thể tùy chọn cấp chính xác kiểm tra độc lập cho dung sai Mục 11 mà không làm thay đổi các phép tính thiết kế ở Mục 2.0.
5. **Bộ Khe Hở Cạnh Răng (Backlash Protocol - MITCalc Rows 193-195) & Xuất Bản Vẽ CAD DXF R12**:
   - **Khe hở pháp tuyến đề xuất**: $j_{n\min} = 0.006 \cdot \sqrt{a_w}\text{ mm}$, $j_{n\max} = 0.024 \cdot \sqrt{a_w}\text{ mm}$.
   - **Khe hở tiếp tuyến**: $j_{tw} = j_n / (\cos\beta_b \cdot \cos\alpha_{wt})$.
   - **Dịch chuyển khoảng cách trục do khe hở**: $\Delta a_j = j_n / (2 \cdot \sin\alpha_{wn})$.
   - **Nổi bật trực quan thông số then chốt (`.highlight-key-param`)**: $a_w, d_a, d_f, W$ với viền vàng hổ phách, chữ cyan đậm nổi bật.
   - **Mô phỏng ăn khớp 2D Canvas cho bánh răng nghiêng**: Sử dụng tham số mặt mút $m_t = m_n / \cos\beta$ và $\tan\alpha_t = \tan\alpha_n / \cos\beta$ khi sinh biên dạng 2D, loại bỏ hoàn toàn hiện tượng va chạm/xuyên thân răng. Bổ sung thanh trượt điều chỉnh tốc độ quay thời gian thực `#sliderAnimSpeed`.
   - **Bộ xuất bản vẽ AutoCAD DXF R12 Client-side (Zero-CORS)**: Tạo file ASCII DXF Release 12 (`AC1009`) gồm 6 layer (`GEAR1_PINION`, `GEAR2_WHEEL`, `PITCH_CIRCLES`, `CENTER_LINES`, `SHAFTS_BORE`, `MFG_TABLE`), xuất thực thể `POLYLINE`, `CIRCLE`, `LINE` và khối `TEXT` bảng thông số chế tạo, tải trực tiếp về máy tính người dùng 100% offline.

6. **Tiêu Chuẩn Hoàn Thiện Mô-Đun Bánh Răng Côn (Bevel Gear Standard - ISO 23509 / DIN 3971)**:
   - **Cấu trúc tinh gọn 2 Tab**: Bỏ tab Audit và tab Vật liệu, chỉ giữ lại `Bảng Tính Toán (Calculator)` và `Mô Hình 2D Nón Ăn Khớp (Canvas)`.
   - **Lược bỏ Mục 2.0 (Zero-Force Scope)**: Toàn bộ lực và ứng suất được lược bỏ triệt để. Cấp chính xác $Q$ chuyển vào Mục 11.0 (Dung sai DIN 3965 / ISO 1328).
   - **Tự động mở sẵn 4 mục cốt lõi**: Mục 4.0, 5.0, 6.0, 11.0 mặc định mở (`▼`), các mục phụ thu gọn (`▶`).
   - **Làm nổi bật kích thước then chốt (`.highlight-key-param`)**: Viền vàng hổ phách `#f59e0b`, chữ cyan đậm cho $R_e, d_{ae}, d_{fe}, \delta, \delta_a, \delta_f, b, s_{ne}, s_c, h_c$.
   - **Mặt cắt trục kỹ thuật 2D CAD Canvas**: Đỉnh Apex $V(0,0)$, trục $X$ và $Y$ vuông góc $\Sigma = 90^\circ$, đường sinh nón chia tiếp xúc, các cung kích thước $R_e, R_i$, gạch mặt cắt kim loại và vết ăn khớp liên hợp conjugate stripes. Tích hợp thanh trượt tốc độ quay `#sliderAnimSpeed` (0.1x đến 3.0x).
   - **Bộ xuất bản vẽ CAD DXF R12 cho Bánh Răng Côn**: Xuất trực tiếp bản vẽ mặt cắt trục bổ dọc ISO 23509 kèm bảng thông số chế tạo DIN 3965 ra file `Banh_Rang_Con_MITCalc_<z1>x<z2>_m<mmn>.dxf`.

7. **Tiêu Chuẩn Đồng Bộ Giao Diện 1-to-1 Chuẩn MITCalc 1.74 & Trích Xuất Tài Nguyên Đồ Họa Vector Gốc**:
   - **Trích xuất đồ họa từ `.xlsb`**: File `.xlsb` là kho nén zip chứa các file vector WMF và ảnh minh họa trong `xl/media/`. Windows GDI+ (`gdiplus.dll` qua Python `ctypes`) được sử dụng để rasterize các file Aldus-less WMF thành PNG độ phân giải siêu nét (1200px), bảo toàn 100% tỷ lệ kỹ thuật của bản vẽ gốc.
   - **Section 4.0 - Đồ họa kép**: Kết hợp sơ đồ góc xoắn `mitcalc_bevel_sec4_geometry.png` với biểu đồ 2D Descartes lưới tọa độ ăn khớp trục (`<canvas id="bevelSec4ChartCanvas">`) mô phỏng 1-to-1 Chart 4181 trong MITCalc.
   - **Section 6.0 - Bảng kích thước hình học 39 dòng chuẩn ISO 23509**: Đặt hình vẽ kích thước chính thức `mitcalc_bevel_sec6_dimensions.png` lên đầu và tổ chức bảng 7 cột rõ ràng: `#` | `Kích Thước Hình Học` | `Ký Hiệu` | `Bánh 1 / Ngoài` | `Bánh 2 / TB` | `Mặt Trong` | `Đơn Vị`.
   - **Section 15.0 - Tính toán phụ trợ (Auxiliary Calculations)**: Cung cấp đầy đủ 3 khối tính toán 15.1 ($i = n_1 / n_2$), 15.2 ($P = (M_1 \cdot n_1) / 9550$), 15.3 ($i = z_2 / z_1$) kèm nút `[ OK ]` tự động chuyển giá trị vào Mục 1.0.
   - **Section 16.0 - Hệ thống CAD & Bảng chế tạo (DXFTables)**: 4 chế độ CAD kèm icon chuẩn gốc MITCalc (`image3.png` đến `image7.png`), bảng thông số dao cắt & lượng dịch chỉnh gia công ($R_{\text{tool}} = 1.5 \cdot b$, $a_1, a_2, b_1, b_2$), sơ đồ offset `mitcalc_bevel_sec16_offset.png`, bảng thuộc tính BOM (Part Name, Specification, Material) và bảng thông số gia công chi tiết DIN 3965 / ISO 23509.

---

## 4. Danh Mục Bộ Khởi Động 1-Click Tại Thư Mục Gốc

| Launcher | Chức Năng |
|:---|:---|
| `CHAY_WEBAPP_BANH_RANG_TRU.bat` | Khởi động tức thì Mô-đun Bánh răng trụ & nghiêng trong trình duyệt |
| `CHAY_WEBAPP_BANH_RANG_CON.bat` | Khởi động tức thì Mô-đun Bánh răng côn (Bevel Gear) trong trình duyệt |
| `KIEM_TRA_CHEO_QC_BANH_RANG_TRU.bat` | Chạy bộ kiểm thử chéo QC Bánh răng trụ vs MITCalc gốc (110 checks PASS 100%) |
| `KIEM_TRA_CHEO_QC_BANH_RANG_CON.bat` | Chạy bộ kiểm thử chéo QC Bánh răng côn vs MITCalc gốc (120 checks PASS 100%) |
| `RA_SOAT_SONG_SONG_BANH_RANG_TRU.bat` | Chạy bộ rà soát song song từng dòng 306 ô tính Bánh răng trụ (Delta = 0.000000 PASS 100%) |
| `RA_SOAT_SONG_SONG_BANH_RANG_CON.bat` | Chạy bộ rà soát song song từng dòng 109 ô tính Bánh răng côn (Delta = 0.000000 PASS 100%) |
| `DONG_GOI_BUNDLE_JS.bat` | Tự động đóng gói tất cả các mô-đun thành classic bundle thuần (Zero-CORS) |

### Quy Chuẩn 15: Xuất Bản Lên GitHub & Triển Khai Toàn Cầu Qua Vercel (CI/CD Architecture)
1. **Kiến trúc Zero-Build Static Web App**:
   - Vercel phục vụ trực tiếp các file tĩnh từ Cổng Trung Tâm (`index.html`) và các thư mục con (`modules/spur-gear/`, `modules/bevel-gear/`, `shared/`).
   - Cấu hình `vercel.json` với `cleanUrls: false` đảm bảo toàn bộ đường dẫn relative (`.html`) không bị phân giải sai lệch.
   - Thêm các HTTP Security Headers (`nosniff`, `SAMEORIGIN`, `1; mode=block`) và MIME UTF-8 cho bundle JS và CSS.
2. **Cấu hình Quản lý mã nguồn Git**:
   - Tệp `.gitignore`: Loại trừ các file nén `backups/*.zip`, cache `__pycache__/`, tệp tạm `scratch/` để duy trì kích thước repository siêu gọn nhẹ (~1.2MB).
   - Tích hợp Git Portable (MinGit) hoạt động 100% không đòi hỏi quyền Administrator.
   - **Quy tắc tuyệt đối**: Không tạo file batch `DAY_LEN_GITHUB.bat`. Toàn bộ thao tác push lên GitHub do AI trực tiếp thực hiện trong console.

---

### Quy Chuẩn 16: Thiết Kế Giao Diện Mobile Responsive Khoa Học & Cảm Ứng Đa Điểm 2D CAD
1. **Quy tắc bảo toàn dữ liệu kỹ thuật 100%**:
   - Nghiêm cấm lược bỏ, thu gọn hay ẩn bất kỳ cột dữ liệu nào trong 7 cột kỹ thuật của bảng tính toán cơ khí.
   - Bọc mọi bảng trong `.section-body` có `overflow-x: auto; -webkit-overflow-scrolling: touch;`. Thiết lập `.calc-table` có `min-width: 580px` để người dùng có thể vuốt ngang mượt mà bằng ngón cái mà không làm méo mó các thông số.
   - Các ô nhập dữ liệu có chiều cao tối thiểu `min-height: 36px` và `font-size: 16px` để ngăn Safari/Chrome trên di động tự động zoom vào ô input gây lệch màn hình.
2. **Thu hồi không gian hiển thị dọc (Vertical Space Recovery)**:
   - Header cố định trên desktop chuyển sang `position: static` trên màn hình di động (`@media (max-width: 768px)`), trả lại 45% diện tích màn hình quý giá.
   - Thanh tab điều hướng chuyển sang dạng segmented control 50/50 với chiều cao chạm tối thiểu 42px.
   - Khối thẻ tóm tắt (`.summary-banner`) được tái cấu trúc thành lưới 2 cột (`grid-template-columns: 1fr 1fr`), thẻ trạng thái ISO full-width ở trên cùng, hiển thị toàn bộ 5 chỉ số cốt lõi trong chưa đầy 120px.
   - Chuyển khối `.summary-banner` và `.global-accordion-toolbar` vào bên trong `#tabCalculator`. Khi sang Tab 2 (`#tabCanvas`), khung vẽ mô phỏng 2D CAD chiếm ngay vị trí đầu trang dưới thanh điều hướng tab, dành trọn 100% tầm nhìn cho mô hình cơ khí.
3. **Bộ điều khiển cử chỉ cảm ứng 2D Canvas (Mobile Multi-Touch Pan & Pinch-to-Zoom Engine)**:
   - Bổ sung bộ lắng nghe sự kiện chạm vào `gear-canvas.js` và `bevel-canvas.js`:
     * Chạm 1 ngón tay (`touchstart`, `touchmove`, `touchend`): Kéo rê di chuyển mô hình (Pan) mượt mà.
     * Chạm 2 ngón tay: Thu phóng tức thì bằng khoảng cách giữa 2 đầu ngón tay (`Math.hypot(dx, dy)`).
     * Thiết lập `touch-action: none` và `aspect-ratio: 1200 / 650` với `width: 100%; height: auto;` để canvas luôn sắc nét trên mọi mật độ điểm ảnh (Retina / OLED) và không bị giật trang khi thao tác với bánh răng.

### Quy Chuẩn 17: Hộp Nhập Liệu Tích Hợp Mũi Tên Thả Xuống Chuẩn Excel (Excel Combo-Box Architecture)
1. **Khắc phục lỗi đẩy thẻ select sang cột khác**:
   - Trong giao diện bảng tính cơ khí chuẩn MITCalc, các ô có mũi tên sổ xuống (ví dụ $i, \Sigma, \alpha, \beta, m$) là các điều khiển DropDowns của Excel nằm kề cận ngay ô nhập liệu.
   - Tránh tuyệt đối việc đặt `<select>` sang Cột 5 (Bánh 2) làm xáo trộn căn chỉnh bảng.
   - Giải pháp chuẩn: Áp dụng lớp `.combo-box-group` (inline-flex, bo góc 4px) gom cả `.combo-input` (ô nhập số) và `.combo-arrow-select` (nút chevron mũi tên `▼` dạng SVG 24px) trọn vẹn trong Cột 4 (Bánh 1). Cột 5 được bảo tồn 100% cho kết quả tính toán của Bánh 2 hoặc thông số liên hợp bổ sung.
2. **Trích xuất danh mục chuẩn từ Excel Named Ranges**:
   - `T_i`: Dãy tỉ số truyền tiêu chuẩn ISO R10/R20 (1.00 đến 20.00).
   - `T_AngleList`: Dãy góc trục $\Sigma$ chuẩn ($60^\circ$ đến $120^\circ$).
   - `T_AlfaList`: Dãy góc ăn khớp $\alpha$ ($14.5^\circ, 15^\circ, 17.5^\circ, 20^\circ, 22^\circ, 25^\circ$).
   - `T_BetaList`: Dãy góc xoắn $\beta$ ($0^\circ, 8^\circ, 10^\circ, 12^\circ, 15^\circ, 20^\circ, 25^\circ, 30^\circ, 35^\circ, 40^\circ, 45^\circ$).
   - `T_modul`: Dãy mô đun tiêu chuẩn DIN 780 Dãy 1 và Dãy 2 (0.5 mm đến 50.0 mm).
   - `T_TypePressAngle` & `T_TypeoffModule`: Dropdown hoán đổi trực tiếp loại góc/mô đun (Normal vs Transverse) nằm trên tiêu đề thông số `.param-type-select`.
3. **Phản ứng hai chiều (Bidirectional Reactive Sync)**:
   - Chọn từ dropdown -> Cập nhật input -> Tính toán thời gian thực.
   - Nhập tay số tùy ý vào input -> Tính toán bình thường không bị giới hạn.

### Quy Chuẩn 18: Đóng Khung Công Thức Toán Học Master & Thuật Toán Triệt Tiêu Nét Cắt Chéo Mặt Cắt Trục (Clean Boundary Polygon Loop)
1. **Đóng khung hệ thống công thức toán học (`docs/MATHEMATICAL_FORMULAS_MASTER.md`)**:
   - Toàn bộ các công thức tính toán từ Mục 1.0 đến Mục 18.0 được đóng băng và lưu trữ để tránh sai lệch khi phát triển lâu dài.
   - Công thức giải tích chuẩn xác tuyệt đối cho Chiều dày đỉnh răng trong (Inner tip tooth thickness - Row 6.38 $s_{ai}$):
     $$\cos\alpha_{ai} = \frac{d_i \cos\alpha}{d_{ai}}, \quad s_{ai} = d_{ai} \left(\frac{s_{ni}}{d_i} + \text{inv}(\alpha) - \text{inv}(\alpha_{ai})\right)$$
     Khớp 100% với $P_{232} = 5.811230\text{ mm}$ và $Q_{232} = 8.844712\text{ mm}$ của MITCalc gốc ($\Delta = 0.000000$).
2. **Thuật toán triệt tiêu nét cắt chéo đồ thị mặt cắt trục (Clean Polygon Loop)**:
   - Loại bỏ cách nối tuần tự $0 \to 17$ gây nét cắt chéo từ $12 \to 13$ và $17 \to 0$.
   - Chu trình đa giác chu vi sạch khép kín cho cả Bánh 1 và Bánh 2:
     $$\text{boundaryIndices} = [0, 1, 2, 3, 14, 15, 16, 17, 10, 11, 8, 7, 6, 5, 0]$$
   - Vẽ 2 đường chân răng (Root lines $3 \to 0$ và $9 \to 8$) độc lập bằng nét mảnh `1.0px`.
   - Bảo đảm 100% hình vẽ sạch, mặt cắt kim loại chuẩn cơ khí ISO 23509, không có bất kỳ nét cắt chéo nào giữa 2 hình cắt bánh răng hoặc trong thân bánh răng.

### Quy Chuẩn 19: Nâng Cấp Mô Phỏng 2D CAD Canvas & Mặt Đầu Bánh Dẫn Chuẩn Kỹ Thuật (ISO 23509 & ISO 128 CAD Architecture)
1. **Chuẩn hóa mặt đầu trước bánh dẫn (Pinion Front End Face)**:
   - Mặt đầu trước của bánh dẫn (Pinion front face) được định nghĩa là **mặt phẳng thẳng đứng vuông góc 100% với trục quay** tại hoành độ đáy nón trong:
     $$X_{\text{front1}} = X_{\text{toe\_root1}} = R_i \cos\delta_1 + h_{fi1} \sin\delta_1$$
   - Hạ thẳng đứng từ $(X_{\text{toe\_root1}}, -d_{fi1}/2)$ xuống bán kính lỗ trục $-d_{\text{bore1}}/2$. Triệt tiêu hoàn toàn góc cắt xiên tùy tiện `- 5` cũ, tạo mặt định vị gá lắp cơ khí chuẩn xác, kín khít và thẩm mỹ cao.
2. **Động cơ gạch mặt cắt kim loại ISO 128 & Tái tạo đường bao thực thể**:
   - Thân Pinion 1 gạch mặt cắt ISO 128 góc $+45^\circ$ màu xanh lục bảo (`rgba(16, 185, 129, 0.45)`).
   - Thân Gear 2 gạch mặt cắt ISO 128 góc $-45^\circ$ màu xanh hoàng gia (`rgba(59, 130, 246, 0.45)`).
   - Lưu ý trọng yếu trong HTML5 Canvas 2D: Lệnh `ctx.beginPath()` bên trong hàm vẽ hatch sẽ xóa path của đa giác, do đó hàm `drawPolygonSection()` phải thực hiện theo quy trình 3 bước khép kín: (1) `fill()` thân đặc opaque -> (2) `drawHatchedPolygon()` bên trong clip -> (3) `beginPath()` dựng lại toàn bộ chu vi và `stroke()` viền kỹ thuật sắc nét 2.0px.
3. **Hệ thống kích thước bản vẽ kỹ thuật CAD (Full CAD Dimensioning System)**:
   - Mũi tên CAD chuẩn tỉ lệ 3:1 (chiều dài 8px, nửa rộng 2.5px) được vẽ đặc ở hai đầu đường kích thước.
   - Đường dóng kích thước (extension lines) kéo từ các điểm hình học thực thể vươn qua đường kích thước 8-10px.
   - Kích thước đường kính đỉnh $\varnothing d_{ae1}, \varnothing d_{ae2}$, bề rộng vành răng $b$, chiều dài nón ngoài $R_e$, cung đo góc $\delta_1, \delta_2$ và đỉnh nón chung Apex $V(0, 0)$ có tâm chữ thập đỏ.
   - Bảng thông số kỹ thuật chuẩn ISO 23509 (Technical Data Card) ghim góc trên bên trái hiển thị đầy đủ $i, z_1/z_2, m_{mn}, \delta_1/\delta_2, b, \beta, x_1/x_2$.
4. **Bộ điều khiển hiển thị lớp tương tác (Interactive CAD Layer Toggles)**:
   - Tích hợp 5 checkbox điều khiển lớp trên toolbar: `chkShowDims`, `chkShowHatch`, `chkShowAxes`, `chkShowStripes`, `chkShowDataCard`.
   - Đồng bộ hoàn toàn giữa Canvas hiển thị và tệp xuất CAD DXF (AutoCAD Release 12).

---

### Quy Chuẩn 20: Mô Phỏng Ăn Khớp 3D WebGL (Three.js r128 100% Offline) & Bộ Xuất File CAD 3D SolidWorks / Mastercam (STEP AP214 B-Rep & Binary STL)
1. **Kiến trúc mô phỏng ăn khớp 3D WebGL (Spur & Helical Gears)**:
   - Thư viện Three.js r128 và OrbitControls được lưu cục bộ tại `shared/js/three.min.js` và `shared/js/OrbitControls.js`, 100% offline & zero-CORS.
   - Khi $\beta = 0^\circ$: Tự động dựng bánh răng trụ răng thẳng 3D (Spur Gear), răng song song với trục, $numSlices = 1$, 2 mặt đầu phẳng.
   - Khi $\beta > 0^\circ$: Tự động chuyển sang bánh răng trụ răng nghiêng 3D (Helical Gear), các răng xoắn không gian theo tốc độ $\omega_{\text{twist}} = \frac{2 \tan\beta}{d}$. Cặp ăn khớp liên hợp: Pinion 1 xoắn phải (+1), Gear 2 xoắn trái (-1), ăn khớp chuẩn xác tại khoảng cách trục $a_w$.
   - Động học liên hợp mượt mà: $\theta_1(t)$ và $\theta_2(t) = \phi_{\text{initial}} - \theta_1(t) / i$, thanh trượt tốc độ $0.1\times - 3.0\times$.
   - Các góc nhìn cơ khí 1-Click: Isometric, Mặt trước (Front XY), Nhìn từ trên (Top XZ), Cận cảnh ăn khớp (Mesh Zoom), và Khung dây (Wireframe).
   - Vật liệu PBR kim loại: Bánh dẫn vàng hổ phách, Bánh bị dẫn xanh titan, đổ bóng phản xạ môi trường và lưới sàn tọa độ.
2. **Bộ xuất file CAD 3D chuẩn hóa cho SolidWorks & Mastercam**:
   - **STEP AP214 (ISO 10303-21)**: Dạng B-Rep Solid (`MANIFOLD_SOLID_BREP` / `CLOSED_SHELL` / `ADVANCED_BREP_SHAPE_REPRESENTATION`). SolidWorks và Mastercam mở ra nhận diện ngay lập tức thành 1 Solid Body duy nhất (không phải Surface rỗng), cho phép kỹ sư lập trình gia công CNC ngay lập tức trên Mastercam (phay lăn răng 4/5 trục, phay 3D High-Speed, cắt dây EDM Wire).
   - **Binary STL**: Header 80-byte chuẩn hóa, 4-byte số lượng tam giác (uint32 Little-Endian), 50 bytes mỗi tam giác (vector pháp tuyến float32 + 3 đỉnh float32 + 2 bytes attribute byte count = 0). Dung lượng siêu nhẹ ($\sim 1.5 - 3.5\text{ MB}$), nhập vào Mastercam Mill/Wire và máy in 3D công nghiệp trong nháy mắt.
   - **Wavefront OBJ**: Định dạng bổ trợ kèm đầy đủ vector đỉnh và pháp tuyến.
   - Tùy chọn xuất linh hoạt: Bánh dẫn 1 (Pinion 1), Bánh bị dẫn 2 (Gear 2), hoặc Cặp lắp ráp hoàn chỉnh (Assembly Pair) đúng khoảng cách trục $a_w$.
3. **Tối ưu hóa lưới đa giác Kín Nước (Watertight Manifold Topology Optimization)**:
   - Bảo toàn 100% tính kín nước (Watertight): Biên dạng răng thân khai chính xác, góc lượn chân răng $R = 0.38 m_n$, cung đáy rãnh, mặt trụ lỗ trục và 2 mặt đầu liên kết đối xứng $1:1$ qua các tam giác định hướng nhất quán (CCW winding).
   - Lấy mẫu thích ứng: Bước lấy mẫu $step = 2$ cho $z \le 30$ và $step = 4$ cho $z > 30$, cùng 6 đến 10 lát cắt trục cho bánh răng nghiêng. Khống chế số lượng tam giác ở mức lý tưởng ($\sim 30,000 - 70,000$ tam giác cho cả bộ truyền), đảm bảo mô phỏng 60 FPS mượt mà trên mọi thiết bị và tệp CAD mở tức thì trong 1 giây.

---

### Quy Chuẩn 21: Giải Thuật Bao Hình Lăn Dao Thanh Răng 1-to-1 Chuẩn Gốc MITCalc 1.74 & Bảng Tọa Độ Điểm Răng Zero-Tolerance (Section 20.0)
1. **Chuyển mã giải thuật cốt lõi từ MITCalc 1.74 VBA (`GearFunctions.bas:920-1123`)**:
   - `FillTeethProfile2` và `RotateTool`: Mô phỏng động học quá trình cắt răng bằng dao thanh răng tiêu chuẩn:
     * Dao thanh răng addendum $h_{a0}^* = 1.25$ (cắt sâu tạo góc lượn trochoid và cắt lẹm tự nhiên), dedendum $h_{f0}^* = 1.00$, bán kính góc lượn mũi dao $r_{a0}^* = 0.38$.
     * Bước góc xoay dao $\Delta\psi = 0.5^\circ$ (`_CuttStepAngle`).
     * Lấy mẫu 120 điểm: $NoPtHead = 20$ điểm đỉnh răng và $NoPtEv = 100$ điểm thân khai & lượn chân răng.
     * Lưu ý quy tắc giảm bước $deltaY$: Tại bước thô và bước tinh, $deltaY$ được chia đôi tại `totalPts - 3` và `totalPts - 2` (tương ứng điểm 117 và 118 khi $N = 120$) để tăng độ mịn chân răng.
2. **Kiểm thử đối chiếu tuyệt đối 240/240 điểm tọa độ (Zero-Tolerance QC)**:
   - Đối chiếu trực tiếp giữa `MitcalcToothSolver` và bảng `Coordinates` của `Gear1_01.xlsb`:
     * Pinion 1: $\Delta X = 0.000000000000\text{ mm}, \Delta Y = 0.000000000000\text{ mm}$ (120/120 điểm PASS).
     * Gear 2: $\Delta X = 0.000000000000\text{ mm}, \Delta Y = 0.000000000000\text{ mm}$ (120/120 điểm PASS).
3. **Phân mục 20.0 Hệ thống CAD & Bảng Tọa Độ Điểm Răng trong Web App**:
   - Tích hợp Section 20.0 trong Master Block 3:
     * Tùy chọn xuất CAD (AutoCAD, SolidWorks, Mastercam, DXF / STEP / STL).
     * Ô nhập $z_{\text{draw}} = 4$, $NoPtHead = 20$, $NoPtEv = 100$, $\Delta\psi = 0.5^\circ$.
     * Bảng xem trực quan 120 điểm tọa độ răng kèm nút tải tệp TXT tọa độ gia công.
   - Toàn bộ mô hình 3D Solid (STEP/STL) và bản vẽ 2D DXF được dựng từ biên dạng này, sẵn sàng cho việc lập trình gia công CNC trên Mastercam.

---

### Quy Chuẩn 22: Chuẩn Hóa Mặt Đầu Phẳng Tuyệt Đối (Zero-Ripple Planar Caps), Dropdown Hướng Nhìn 3D CAD và Đồng Bộ Pha Động Học Ăn Khớp Liên Hợp
1. **Tách khối đỉnh (Vertex Splitting) - Triệt tiêu 100% hiện tượng nhấp nhô gợn sóng mặt đầu**:
   - Khắc phục lỗi dùng chung đỉnh giữa hông răng và mặt đầu: Khi dùng chung đỉnh, pháp tuyến đỉnh bị pha trộn giữa pháp tuyến hông $(n_x, n_y)$ và pháp tuyến mặt đầu $(0, 0, \pm 1)$, tạo ra bóng sáng gợn sóng/nhấp nhô không đúng với mặt phẳng cơ khí.
   - Giải pháp: Chia lưới làm 4 nhóm đỉnh độc lập:
     * Mặt hông răng: $numLayers \times N$ đỉnh, pháp tuyến mượt dọc thân khai.
     * Mặt đầu trước $Z = +halfB$: $2N$ đỉnh, pháp tuyến **nghiêm ngặt $[0, 0, 1]$**.
     * Mặt đầu sau $Z = -halfB$: $2N$ đỉnh, pháp tuyến **nghiêm ngặt $[0, 0, -1]$**.
     * Lòng lỗ trục: $numLayers \times N$ đỉnh, pháp tuyến hướng tâm $[-\cos\theta, -\sin\theta, 0]$.
   - Đảm bảo 2 mặt đầu phẳng lì 100%, cạnh nối góc $90^\circ$ sắc nét chuẩn chi tiết cơ khí phay tiện.
2. **Hộp chọn Dropdown hướng nhìn 3D CAD tiêu chuẩn (`#sel3DViewPreset`)**:
   - Thay thế toàn bộ nút bấm riêng lẻ bằng một ô chọn `<select id="sel3DViewPreset">` có mũi tên sổ xuống chuẩn các phần mềm CAD 3D (SolidWorks, Inventor, Mastercam).
   - Đầy đủ 8 góc nhìn tiêu chuẩn: Phối cảnh (Isometric), Mặt trước (Front XY), Mặt sau (Back XY), Nhìn trên (Top XZ), Nhìn dưới (Bottom XZ), Nhìn phải (Right YZ), Nhìn trái (Left YZ), và Cận cảnh ăn khớp (Mesh Zone).
3. **Đồng bộ pha động học ăn khớp không va chạm (Conjugate Meshing Phase Alignment)**:
   - Từng chi tiết bánh răng độc lập được thiết kế đối xứng tuyệt đối qua trục $+Y$ với $baseOffset = 0.0$.
   - Khi lắp ghép ăn khớp tại khoảng cách trục $a_w$, góc pha ban đầu của bánh 2 được xác định theo công thức giải tích chuẩn xác:
     $$\phi_{2,0} = \frac{\pi}{z_2} + \frac{\pi}{2} \left(1 - \frac{z_1}{z_2}\right)$$
   - Khóa cứng góc quay động học: $\phi_2 = \phi_{2,0} - \phi_1 \cdot \frac{z_1}{z_2}$ trong toàn bộ vòng lặp hoạt ảnh `animate()`, triệt tiêu hoàn toàn sai số tích lũy. Răng bánh 1 đi vào rãnh răng bánh 2 đạt khe hở chân răng $c = 1.501\text{ mm}$ (chuẩn $c^* = 0.25 \cdot m_n$), khe hở cạnh răng tiếp xúc trơn tru liên tục ($0.0025\text{ mm}$), **hoàn toàn không bị chồng chéo hay va chạm**.

### Quy Chuẩn 23: Quy Chuẩn Xuất File DXF Tương Thích AutoCAD 2004+ & Đa Lựa Chọn Xuất Bánh 1, Bánh 2, Cặp Ăn Khớp (AutoCAD 2004+ Compliant DXF Protocol)
1. **Khắc phục triệt để lỗi không mở được DXF trên AutoCAD 2004+**:
   - Định dạng DXF chuẩn Release 12 (`AC1009`) tương thích 100% từ AutoCAD 2004 đến 2026.
   - Bắt buộc sử dụng ký tự ngắt dòng chuẩn Windows **CRLF (`\r\n`)** cho toàn bộ file DXF thay vì chỉ `\n`.
   - Bổ sung đầy đủ 4 bảng kỹ thuật bắt buộc trong phần `TABLES`:
     * Bảng `VPORT`: Khởi tạo khung nhìn chuẩn `*ACTIVE`.
     * Bảng `LTYPE`: Khai báo tường minh toàn bộ các kiểu đường nét sử dụng (`CONTINUOUS`, `CENTER`, `DASHED`). Triệt tiêu lỗi "Undefined linetype CENTER on layer..." làm crash AutoCAD 2004.
     * Bảng `LAYER`: Đầy đủ các layer kỹ thuật (`GEAR1_PINION`, `GEAR2_WHEEL`, `PITCH_CIRCLES`, `CENTER_LINES`, `SHAFTS_BORE`, `MFG_TABLE`).
     * Bảng `STYLE`: Khai báo kiểu chữ chuẩn `STANDARD` với font `txt`.
   - Thực thể `POLYLINE` có tọa độ khởi tạo `10\n0.0\n20\n0.0\n30\n0.0`, và thực thể kết thúc `SEQEND` bắt buộc phải kèm mã nhóm **`8\nLAYER_NAME`** để đóng chuỗi đỉnh hợp lệ.
2. **Đa lựa chọn đối tượng xuất linh hoạt (Target Options)**:
   - Thay thế nút xuất đơn lẻ bằng Dropdown thông minh tương tự xuất 3D:
     * `⚙️ Xuất Bánh Dẫn 1 (.dxf)`: Xuất độc lập bánh 1 đặt tại gốc $(0, 0)$, kèm vòng chia, lỗ trục, đường tâm và bảng thông số chế tạo bánh 1.
     * `⚙️ Xuất Bánh Bị Dẫn 2 (.dxf)`: Xuất độc lập bánh 2 đặt tại gốc $(0, 0)$, kèm vòng chia, lỗ trục, đường tâm và bảng thông số chế tạo bánh 2.
     * `🔗 Xuất Cả Cặp Ăn Khớp (.dxf)`: Xuất cụm 2 bánh ăn khớp, bánh 1 tại $(0, 0)$, bánh 2 tại $(a_w, 0)$ xoay đúng pha động học liên hợp $\phi_{2,0} = \frac{\pi}{z_2} + \frac{\pi}{2}(1 - \frac{z_1}{z_2})$, kèm các vòng lăn $d_{w1}, d_{w2}$, đường tâm và bảng thông số toàn diện.
   - Tích hợp đồng thời tại 3 vị trí: Header chính, Section 16.0 bảng chế tạo, và Toolbar 2D Canvas.

---

### Quy Chuẩn 24: Quy Chuẩn Xuất File 3D Flank Surface Rỗng Cho Mastercam & SolidWorks (Open Flank Shell STEP / STL Protocol)
1. **Mục đích kỹ thuật CAM / CNC**:
   - Khi gia công phay sườn răng 5 trục (Surface Finish Scallop / Flowline / Swarf Milling) trên Mastercam hoặc mô hình hóa mặt trên SolidWorks, người kỹ sư cần **mặt sườn răng hở (Hollow Flank Surface Shell)** không có nắp đầu phẳng và không có lòng lỗ trục để chọn trực tiếp làm Drive Surfaces / Machinable Surfaces.
2. **Cấu trúc dữ liệu hình học Surface**:
   - Bỏ qua hoàn toàn Nhóm 2 (Mặt đầu trước), Nhóm 3 (Mặt đầu sau) và Nhóm 4 (Lòng lỗ trục) trong bộ sinh lưới 3D (`generateGearSurfaceMesh`).
   - Chỉ giữ lại duy nhất mạng lưới tam giác của biên dạng thân khai và lượn chân răng dọc theo bề rộng vành răng $b$.
3. **Định dạng chuẩn STEP AP214 cho Surface Body**:
   - Khác với Solid Model dùng `CLOSED_SHELL` và `MANIFOLD_SOLID_BREP`, mô hình Surface được đóng gói theo chuẩn ISO 10303-21 bằng:
     ```step
     #shellId = OPEN_SHELL('',(...));
     #surfaceModelId = SHELL_BASED_SURFACE_MODEL('PART_NAME',(#shellId));
     #shapeRepId = SHAPE_REPRESENTATION('PART_NAME',(#surfaceModelId),#repContextId);
     ```
   - SolidWorks và Mastercam khi đọc tệp này sẽ nhận diện trực tiếp là **Surface Body (Thân Mặt / Open Surface)** mà không cố vá kín thành khối rắn.
   - Hỗ trợ xuất đồng thời cả **Binary STL Surface** (`.stl`) cho các chu trình gia công CAM lưới đa giác.

---

### Quy Chuẩn 25: Quy Chuẩn Thanh Tăng Chỉnh Độ Mịn Biên Dạng Răng 11 Mức (11-Level Profile Resolution Engine)
1. **Cấu trúc 11 mức rời rạc (Discrete Resolution Architecture)**:
   - Cung cấp thanh trượt 11 mức (`sliderProfileResolution` min=1, max=11, step=1, mặc định mức 6):
     * Mức 1: Thô xem trước nhanh ($NoPtHead = 8, NoPtEv = 32, \Delta\psi = 1.0^\circ$, 80 điểm/răng).
     * Mức 2: $NoPtHead = 10, NoPtEv = 45, \Delta\psi = 0.9^\circ$ (110 điểm/răng).
     * Mức 3: $NoPtHead = 12, NoPtEv = 58, \Delta\psi = 0.8^\circ$ (140 điểm/răng).
     * Mức 4: $NoPtHead = 14, NoPtEv = 72, \Delta\psi = 0.7^\circ$ (172 điểm/răng).
     * Mức 5: $NoPtHead = 17, NoPtEv = 86, \Delta\psi = 0.6^\circ$ (206 điểm/răng).
     * **Mức 6 (Giá trị ở giữa - Chuẩn Gốc MITCalc 1.74)**: $NoPtHead = 20, NoPtEv = 100, \Delta\psi = 0.5^\circ$ (240 điểm/răng, khớp 100% sheet `Coordinates` với $\Delta = 0.000000\text{ mm}$).
     * Mức 7: $NoPtHead = 24, NoPtEv = 120, \Delta\psi = 0.4^\circ$ (288 điểm/răng).
     * Mức 8: $NoPtHead = 28, NoPtEv = 145, \Delta\psi = 0.35^\circ$ (346 điểm/răng).
     * Mức 9: $NoPtHead = 32, NoPtEv = 175, \Delta\psi = 0.3^\circ$ (414 điểm/răng).
     * Mức 10: $NoPtHead = 36, NoPtEv = 210, \Delta\psi = 0.25^\circ$ (492 điểm/răng).
     * **Mức 11 (Siêu mịn gia công CNC / Cắt dây Wire EDM)**: $NoPtHead = 40, NoPtEv = 260, \Delta\psi = 0.2^\circ$ (600 điểm/răng, độ mượt tiệm cận spline giải tích).
2. **Đồng bộ toàn diện hệ thống (System-wide Reactive Synchronization)**:
   - Khi thay đổi thanh trượt độ mịn:
     * Cập nhật thời gian thực vào mô hình 3D Canvas WebGL.
     * Cập nhật số điểm hiển thị trong Bảng tọa độ Mục 20.0 (`coordTableBody`).
     * Áp dụng trực tiếp vào số điểm xuất bản vẽ DXF 2D và mô hình 3D STEP/STL.
### Quy Chuẩn 26: Quy Chuẩn Phôi Răng Đặc & Răng Thực Thể 3D Bánh Răng Côn Chuẩn Gốc MITCalc 1.74 (Bevel Gear 3D Blank Solid & Tooth Protocol - ISO 23509 & Data1)
1. **Khối Phôi Đặc Bánh Răng (Gear Blank Solid Body - Trích Xuất Gốc Data1 & Section 16)**:
   - Khắc phục triệt để lỗi kéo mặt nắp từ `rBore` ra đỉnh răng $R_e$ (khiến Bánh 2 bị biến thành đĩa mỏng phẳng úp ngược và dập chìm toàn bộ thân răng).
   - Thân phôi đặc (Solid Blank) của bánh răng côn chuẩn MITCalc 1.74 bao gồm:
     * **Mặt côn đáy (Root cone)**: Mặt nón tạo bởi chân răng có bán kính $R_f(u)$ và cao độ trục $Z_f(u)$ chạy dọc theo bề rộng vành răng $b$.
     * **Mặt côn vát sau (Back chamfer cone)**: Nối từ đáy răng tại gót ngoài $R_e$ ra mép vành ngoài $R_{15}$ (vuông góc đường sinh nón chia hoặc theo góc vát $\delta_f + 90^\circ$).
     * **Mặt moay-ơ sau (Back hub flat face)**: Mặt phẳng trực giao trục quay từ $R_{15}$ vào thành lỗ trục $r_{\text{bore}}$ tại cao độ $Z_{16}$.
     * **Mặt côn vát trước (Front chamfer cone)**: Nối từ đáy răng tại mũi trong $R_i$ vào mép vành trước $R_{10}$.
     * **Mặt moay-ơ trước (Front hub flat face)**: Mặt phẳng trực giao từ $R_{10}$ vào thành lỗ trục tại cao độ $Z_{11}$.
     * **Lòng lỗ trục (Cylindrical shaft bore)**: Ống trụ tròn chạy từ $Z_{11}$ đến $Z_{16}$.
   - Khớp 100% với kích thước bao phôi thực thể trong sheet `Data1` của MITCalc 1.74:
     * Bánh dẫn 1 (Pinion): $Z \in [201.11, 323.01]\text{ mm}$ (chiều dài trục $121.9\text{ mm}$), $R_{\max} = 140.18\text{ mm}$, lỗ trục $d = 50\text{ mm}$ (khớp $P_{16}$ và $P_{03}$ trong `Data1!C70:D87`).
     * Bánh bị dẫn 2 (Gear): $Z \in [65.55, 161.24]\text{ mm}$ (chiều dài trục $95.7\text{ mm}$), $R_{\max} = 317.12\text{ mm}$, lỗ trục $d = 100\text{ mm}$ (khớp $P_{16}$ và $P_{03}$ trong `Data1!H35:I52`).
2. **Răng Thực Thể Đứng Độc Lập Chuẩn Biên Dạng Thân Khai Tredgold**:
   - Răng mọc nổi trên mặt nón đáy, bảo toàn 100% chiều sâu răng: $h_e = 26.60\text{ mm}$ tại gót ngoài (khớp `Teeth_h = 26.5994`), $h_i = 17.40\text{ mm}$ tại mũi trong (khớp `Teeth_h = 17.4006`).
   - Biên dạng thân khai ảo Tredgold đầy đủ mặt đỉnh ($s_{ae1} = 8.88\text{ mm}, s_{ae2} = 13.52\text{ mm}$), hai sườn làm việc thân khai, và cung bo lượn chân răng.
   - Toàn bộ khối hình học là khối kín nước hoàn toàn 100% (Watertight Manifold Solid): 25,920 đỉnh cho Bánh 1, 64,800 đỉnh cho Bánh 2.
3. **Đường Xoắn Răng Gleason Chuẩn Gốc MITCalc 1.74 (`Calculation!U197:AQ202`)**:
   - Cung tròn dao cắt bán kính $R_{\text{tool}} = 1.5 \cdot b = 175.5\text{ mm}$ (Section 16.4) tiếp xúc tại điểm chia trung bình $R_m$.
   - Tọa độ chuẩn hóa dọc bề rộng: $u = (R - R_m)/b \in [-0.5, 0.5]$ ($u = 0$ tại $R_m$).
   - Độ võng cung dao cắt:
     $$W(u) = \text{hand} \cdot \left(R_{\text{tool}} \cos\beta - \sqrt{R_{\text{tool}}^2 - (u \cdot b + R_{\text{tool}} \sin\beta)^2}\right)$$
   - Độ vặn xoắn góc cung răng: $\text{spiralTwist} = W(u) / (R \sin\delta)$.
   - Khớp 100% các giá trị độ võng dao cắt của MITCalc: Section A: $W = -21.058\text{ mm}$, Section C: $W = 0.000\text{ mm}$, Section E: $W = +54.976\text{ mm}$.
4. **Đồng Bộ Pha Động Học Ăn Khớp Liên Hợp 3D Không Va Chạm (Conjugate Phase Alignment)**:
   - Trục Bánh 1 đặt dọc theo World $+X$ (`pinionMesh.rotation.set(0, Math.PI / 2.0, Math.PI / 2.0)`).
   - Trục Bánh 2 đặt dọc theo World $+Y$ (`gearMesh.rotation.set(-Math.PI / 2.0, 0, 0)`).
   - Pha khởi tạo của Bánh 2 đưa rãnh răng (tooth space) vào chính giữa đường tiếp xúc:
     $$\text{initialGearAngle} = -\frac{\pi}{z_2}$$
   - Đồng bộ động học: $\phi_2 = \text{initialGearAngle} - \frac{\phi_1}{u}$ (với $u = z_2 / z_1$).
   - Răng Bánh 1 lọt chính giữa rãnh Bánh 2, khe hở đáy danh nghĩa $c = 0.2 m_n = 2.00\text{ mm}$, 100% không va chạm, không ngập xuyên sườn răng.
5. **Căn Giữa Camera Trọng Tâm Assembly**:
   - Đặt `controls.target.set(0, 20, 0)` căn chính xác vào trọng tâm của toàn bộ cụm ăn khớp, giúp bộ truyền hiển thị cân đối hoàn hảo trong viewport 1200x650.
6. **Đa Dạng Định Dạng Xuất CAD Cho SolidWorks & Mastercam**:
   - STEP AP214 B-Rep Solid (`CLOSED_SHELL` / `MANIFOLD_SOLID_BREP`).
   - STEP AP214 Flank Surface Rỗng (`OPEN_SHELL` / `SHELL_BASED_SURFACE_MODEL`) - không nắp đầu, không lòng trục để Mastercam lập trình phay 5 trục trực tiếp.
   - Binary STL Solid & Surface (`.stl`) và Wavefront OBJ (`.obj`).

---

### Quy Chuẩn 27: Xuất Bản Vẽ 2D CAD Chuẩn Release 12 (AC1009) Mở Tốt Từ AutoCAD 2004 Đến 2026
1. **Tiêu chuẩn tương thích AutoCAD 2004+ (AC1009 Standard)**:
   - Sử dụng định dạng DXF Release 12 (mã hiệu `AC1009` và biến `$ACADVER`).
   - Bắt buộc sử dụng ký tự xuống dòng chuẩn DOS/Windows CRLF (`\r\n`). Ký tự xuống dòng đơn `\n` sẽ khiến AutoCAD 2004 báo lỗi "Premature end of file" hoặc từ chối đọc.
   - Bắt buộc chứa đầy đủ 4 bảng hệ thống trong `SECTION TABLES`:
     * `VPORT`: Viewport hiển thị ban đầu.
     * `LTYPE`: Các nét vẽ kỹ thuật (CONTINUOUS, CENTER, DASHED).
     * `LAYER`: Các lớp kỹ thuật phân tầng (`GEAR1_PINION`, `GEAR2_WHEEL`, `PITCH_CONES`, `CENTER_LINES`, `SHAFTS_BORE`, `MFG_TABLE`).
     * `STYLE`: Font chữ kỹ thuật STANDARD (`txt.shx`).
2. **Thanh Tăng Chỉnh Độ Mịn Biên Dạng Răng 11 Mức (11-Level Profile Resolution)**:
   - Tích hợp thanh trượt 11 mức (`sliderProfileResolution` min=1, max=11, mặc định mức 6):
     * Mức 1: Thô xem trước nhanh (20 điểm/răng).
     * Mức 6: Chuẩn gốc MITCalc 1.74 (40 điểm/răng, khớp 100% bản vẽ chuẩn).
     * Mức 11: Siêu mịn CNC / Cắt dây EDM (72 điểm/răng, độ mượt tiệm cận spline giải tích).
3. **Menu Sổ Xuống Đa Lựa Chọn Xuất Bản Vẽ (Dropdown CAD Export Options)**:
   - Cung cấp 3 tùy chọn trực quan:
     * ⚙️ Xuất Bánh Dẫn 1 (`pinion`): Bản vẽ mặt cắt trục và biên dạng răng bánh 1.
     * ⚙️ Xuất Bánh Bị Dẫn 2 (`gear`): Bản vẽ mặt cắt trục và biên dạng răng bánh 2.
     * 🔗 Xuất Cả Bộ Ăn Khớp (`assembly`): Bản vẽ cặp bánh răng ăn khớp liên hợp tại đỉnh nón chung Apex $V(0, 0)$.
   - Tích hợp đầy đủ Bảng thông số chế tạo (`MFG_TABLE`) theo ISO 23509 / DIN 3971.

---

### Quy Chuẩn 28: Hộp Chọn Hướng Nhìn 3D Duy Nhất (Single Dropdown 3D Camera View)
1. **Thiết kế gọn gàng chuẩn phần mềm CAD chuyên nghiệp**:
   - Thay thế toàn bộ cụm nút dàn trải ("Mặt Trước", "Nhìn Trên", "Mặt Bên", "Isometric") bằng một ô chọn duy nhất có mũi tên thả xuống: `<select id="sel3DViewPreset">`.
   - Các góc nhìn chuẩn cơ khí:
     * `iso`: 🎥 Phối Cảnh (Isometric)
     * `mesh`: 🔍 Vùng Tiếp Xúc Ăn Khớp (Mesh Zone)
     * `front`: ⬆️ Mặt Bổ Dọc Trục (Axial XY)
     * `top`: 🔝 Nhìn Từ Trên Xuống (Top XZ)
     * `side`: ➡️ Nhìn Ngang Hông (Side YZ)
     * `pinion`: ⚙️ Cận Cảnh Bánh Dẫn 1
     * `gear`: ⚙️ Cận Cảnh Bánh Bị Dẫn 2
2. **Nút đặt lại góc nhìn (`btnReset3DView`)**:
   - Đưa camera trở về hướng Isometric tiêu chuẩn với 1 cú nhấp.

---

## 5. Quy Trình Cuốn Chiếu Khi Phát Triển Mô-Đun Tiếp Theo

Khi được yêu cầu phát triển mô-đun mới (ví dụ: Bánh vít - Trục vít Worm Gear, Bánh răng hành tinh Planetary Gear, Bộ truyền Đai Belt Drive, Bộ truyền Xích Chain Drive, Trục và Ổ lăn):
1. **Tạo thư mục con độc lập**: `MITCalc-WebApp/modules/[ten-module]/`.
2. **Trích xuất công thức gốc từ file Excel tương ứng trong `C:\MITCalc\`**: Mở qua PowerShell COM, đọc toàn bộ Named Ranges, công thức tại sheet `Calculation`.
3. **Xây dựng động cơ tính toán thuần JS (`js/[ten]-calc-engine.js`)**: Viết giải thuật số học và giải tích chính xác.
4. **Xây dựng bộ kiểm thử chéo QC tự động (`tests/qc_[ten]_multi_case_suite.py`)**: Kết nối Excel COM đối chiếu 5 kịch bản thực tế, tinh chỉnh cho đến khi đạt 100% Pass với $\Delta = 0.0000$.
5. **Xây dựng 2D Canvas visualizer (`js/[ten]-canvas.js`)**: Mô phỏng động học và hình học trực quan.
6. **Xây dựng giao diện Accordion (`index.html`)**: Default collapsed `▶`, tích hợp CSDL 51 vật liệu, liên kết Header về Hub trung tâm và các module khác.
7. **Đóng gói Classic Bundle (`js/[ten]-engine.bundle.js`)**: Chống CORS, chạy trực tiếp không cần server.
8. **Tạo launcher 1-Click tại thư mục gốc**: `CHAY_WEBAPP_[TEN].bat` và `KIEM_TRA_CHEO_QC_[TEN].bat`.
9. **Cập nhật Cổng Trung Tâm (`MITCalc-WebApp/index.html`)**: Thêm card mô-đun mới vào lưới điều hướng.
10. **Đồng bộ tri thức (Golden Meta-Rule)**: Ghi lại toàn bộ kỹ thuật mới vào `GEMINI.md`, `OPTIMIZATION_HISTORY.md`, `.agents/skills/`, `.agents/workflows/`.
