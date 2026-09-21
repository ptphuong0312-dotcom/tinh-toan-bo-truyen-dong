# BỘ QUY TẮC DỰ ÁN TOÀN NĂNG - TÍNH TOÁN CƠ KHÍ & BÁNH RĂNG (MASTER RULES)
**Dự án**: Hệ Thống Web App Tính Toán Cơ Khí Độc Lập (MITCalc Web App Independent Project)  
**Chủ sở hữu**: `SirPhuong` / `Pham Phuong`  
**Mục tiêu**: Xây dựng bộ công cụ tính toán cơ khí thay thế toàn diện phần mềm MITCalc trên nền Excel, chạy 100% offline, zero-CORS, giao diện và cấu trúc chuẩn 1-to-1 bản gốc MITCalc 1.74, sai số đạt chuẩn Zero-Tolerance (Δ = 0.000000).

---

## 1. NGUYÊN TẮC TỐI THƯỢNG (GOLDEN META-RULE)

> ### ⭐️ TỰ ĐỘNG HỌC & LƯU TRỮ TRI THỨC TỨC THÌ
> **Lệnh trực tiếp từ chủ sở hữu (`SirPhuong`)**:  
> **"BẤT KỲ KHI NÀO HOÀN THIỆN ĐƯỢC 1 CÔNG VIỆC NÀO ĐÓ TRONG QUÁ TRÌNH LÀM DỰ ÁN THÌ BẠN NGAY LẬP TỨC PHẢI LƯU LẠI TOÀN BỘ CÁC SKILLS, WORKFLOWS, RULES HỌC ĐƯỢC TỪ CÔNG VIỆC VỪA MỚI HOÀN THIỆN ĐẤY!"**  
> * **Hành động bắt buộc**: Sau mỗi thao tác kỹ thuật (thêm module, sửa giải thuật hình học, cải tiến đồ họa 2D Canvas, đối chiếu công thức Excel), trợ lý AI KHÔNG ĐƯỢC DỪNG LẠI khi chưa đồng bộ tri thức vào:
>   1. `.agents/skills/mitcalc-webapp-engineering/` (Runbook thao tác chi tiết).
>   2. `.agents/workflows/` (Các kịch bản từng bước).
>   3. `GEMINI.md` (Cập nhật quy tắc mới).
>   4. `docs/OPTIMIZATION_HISTORY.md` (Nhật ký & thông số đo đạc thực tế).
> * **Mục đích**: Khi dự án được copy sang bất kỳ máy tính nào khác hoặc chuyển sang ổ đĩa mới, AI kế thừa 100% năng lực ngay lập tức mà không phải tìm hiểu lại từ đầu!

---

## 2. CÁC QUY TẮC BẤT BIẾN (CORE NON-NEGOTIABLES)

### Quy Tắc 1: Quy Chuẩn Lược Bỏ Lực Tuyệt Đối (Zero-Force Scope Protocol)
* **Lệnh trực tiếp từ người dùng**: *"tất cả các thông số tính toán về lực thì bạn bỏ qua hết cho tôi"*.
* Toàn bộ các mô-đun tính toán tập trung chuyên sâu 100% vào:
  - Hình học bánh răng tiêu chuẩn (ISO, DIN, AGMA).
  - Tỷ số truyền, động học, ăn khớp liên hợp (Conjugate meshing).
  - Bán kính cong, chiều dày răng, hệ số dịch chỉnh biên dạng $x$, hệ số trùng khớp ($\varepsilon_\alpha, \varepsilon_\beta, \varepsilon_\gamma$).
  - Kích thước đo kiểm tra (chiều dài pháp tuyến chung $W$, kích thước qua bi/đũa đo $M$).
  - Cấp chính xác và dung sai chế tạo ISO 1328 / DIN 3965.
  - Cơ sở dữ liệu 51 loại vật liệu thép kỹ thuật.
* Lược bỏ 100% các phép tính lực ($F_t, F_r, F_a, F_n$), lực trung bình $F_m$, độ võng trục $f_{sh}$ và ứng suất uốn/tiếp xúc ($\sigma_H, \sigma_F$) để giữ giao diện và thuật toán thanh thoát, tập trung và chính xác tuyệt đối.

#### Quy Tắc 2: Quy Chuẩn Đồng Bộ Cấu Trúc & Bố Cục Tinh Gọn 2 Tab Chuẩn MITCalc 1.74
* **Cấu trúc Tab tinh gọn 2 Tab chính**:
  1. `⚙️ Bảng Tính Cơ Khí (Calculator)`: Chứa toàn bộ các phân mục tính toán chuẩn hóa.
  2. `📐 Mô Phỏng 2D CAD (Canvas)`: Tích hợp công cụ trực quan hóa, mô phỏng chuyển động ăn khớp, thanh trượt tốc độ (`0.1x - 3.0x`) và nút xuất bản vẽ 2D CAD (DXF).
  *(Lược bỏ các tab phụ như Audit hay Tra cứu CSDL vật liệu khỏi giao diện chính để giữ màn hình tập trung, việc rà soát đã có bộ script Excel COM tự động lo).*
* **Bố cục các phân mục trong Tab Bảng Tính**:
  - Phân mục 1.0: Nhập các thông số truyền động cơ bản ($P, n_1, n_2, M_k, i$).
  - *(Lược bỏ hoàn toàn Mục 2.0 theo Quy Tắc 1 Zero-Force Scope)*.
  - Phân mục 3.0: Thông số biên dạng dao cắt & kiểu răng cơ bản.
  - Phân mục 4.0: Thiết kế mô đun & thông số hình học răng ($z_1, z_2, m_n, \alpha, \beta, b$, và Khe hở cạnh răng Backlash).
  - Phân mục 5.0: Dịch chỉnh biên dạng răng ($x_1, x_2, \Sigma x$).
  - Phân mục 6.0: Kích thước cơ bản đầy đủ (3 mặt cắt Ngoài, TB, Trong đối với côn, hoặc kích thước hình học chi tiết đối với trụ).
  - Phân mục 7.0: Bánh răng trụ tương đương (Tredgold với bánh răng côn).
  - Phân mục 8.0: Chỉ số chất lượng bộ truyền (Hệ số trùng khớp $\varepsilon_\alpha, \varepsilon_\beta, \varepsilon_\gamma$, hiệu suất $\eta$, vận tốc $v$).
  - Phân mục 11.0: Lắp ráp, đo kiểm (Pháp tuyến chung $W$, Bi/đũa đo $M$, Mỏ kẹp $s_c, h_c$) và Cấp chính xác $Q$ kèm dung sai ISO 1328 / DIN 3965.
  - Phân mục 16.0/18.0: Bảng thông số chế tạo gia công (DXFTables) kèm nút xuất file CAD DXF.

### Quy Tắc 3: Trải Nghiệm Thực Tế Master Blocks & Tiện Ích Thông Minh
1. **3 Master Blocks đặc trưng**:
   - `Phần Đầu Vào (Input Section)`: Header màu xanh lá cây (`#107c41`) gom Mục 1.0 đến Mục 5.0.
   - `Phần Kết Quả (Results Section)`: Header màu vàng cam (`#c55a11`) gom Mục 6.0, 7.0 và 8.0.
   - `Phần Bổ Sung & Chế Tạo (Additions & Manufacturing)`: Header màu xanh dương (`#1e3a8a`) gom Mục 11.0 dung sai và bảng chế tạo DXFTables.
2. **Quy chuẩn ô nhập liệu & Highlight thông số then chốt**:
   - Ô nhập liệu `.user-input`: Nền trắng tinh `#ffffff`, viền rõ nét 1.5px xanh dương bo góc 4px, chữ đen `#111827`. Hỗ trợ nhập dấu phẩy thập phân locale tiếng Việt (`6,0` / `6.0`).
   - Ô kết quả `.output-eng`: Nền sẫm màu, chữ cyan nổi bật, cố định không cho sửa.
   - Ô giới hạn `.cell-limit`: Nền xanh lá cây dịu mắt.
   - **Làm nổi bật thông số then chốt (`.highlight-key-param`)**: Viền vàng hổ phách `#f59e0b`, bóng sáng mờ, chữ xanh cyan in đậm phát sáng cho các thông số xưởng quan trọng nhất ($a_w, R_e, d_a, d_{ae}, d_f, d_{fe}, \delta, W, s_c, h_c$).
3. **Các nút tiện ích thuận nghịch**:
   - `[ i <= n1,n2 ]`: Tính tự động $i = n_1 / n_2$.
   - `[ Pw <= Mk,n ]`: Tính ngược $P = (M_{k1} \cdot n_1) / 9550\text{ kW}$.
   - `[ i <= z1,z2 ]`: Đồng bộ $i = z_2 / z_1$.
   - Slider dịch chỉnh $x_1$ và Slider tỉ lệ vành răng $b/Re$ phản ứng thời gian thực.
4. **Cấu hình Mở/Đóng Accordion mặc định**:
   - **Tự động mở sẵn (`▼`)**: 4 phân mục kỹ thuật cốt lõi **Mục 4.0, Mục 5.0, Mục 6.0 và Mục 11.0**.
   - **Mặc định thu gọn (`▶`)**: Các phân mục phụ trợ (1.0, 3.0, 7.0, 8.0, 16.0/18.0) thu gọn để màn hình thoáng đãng.
   - Cung cấp 2 nút toàn cục: "📂 Mở Rộng Tất Cả" và "📁 Thu Gọn Tất Cả".
5. **Xuất Bản Vẽ 2D CAD (DXF Release 12 - AC1009)**:
   - Tích hợp nút xuất file DXF độc lập 100% offline (Zero-CORS) tải trực tiếp qua Blob. Tương thích chuẩn với AutoCAD, SolidWorks, Inventor, LibreCAD.
   - Đầy đủ các layer kỹ thuật, đường bao thực thể, đường tâm, vòng chia và bảng thông số chế tạo.

### Quy Tắc 4: Chuẩn Bán Kính Lượn Chân Răng Bánh Răng Trụ ($R = 0.38 m_n$) & Bảo Tồn Cung Đáy Rãnh
1. **Bán kính lượn dao cắt danh nghĩa**: $R = \rho_{f0} = 0.38 \cdot m_n$ theo DIN 3960 / ISO 1122-1.
2. **Tiếp tuyến giải tích $C^1$**: Cung tròn bán kính $R$ tiếp tuyến mượt mà với đường thân khai tại $r_t$ và tiếp tuyến với vòng tròn đáy $r_f = d_f / 2$. Hỗ trợ cả 2 trường hợp $r_f \ge r_b$ và $r_f < r_b$.
3. **Bảo tồn cung đáy rãnh (Root land arc)**: Giữ nguyên vẹn cung tròn bán kính $r_f$ từ góc tiếp xúc $\theta_c$ đến nửa bước góc phóng $\pi / z$. Tuyệt đối không dùng spline kéo dài làm mất đáy rãnh.
4. **Triệt tiêu sừng nhọn (Horn Elimination)**: Khi $z_2 = 48$ ($r_f \ge r_b$), đường thân khai bắt đầu trực tiếp từ $r_f$. Khớp 100% với 120 điểm tọa độ biên dạng trong sheet `Coordinates` của MITCalc 1.74.

### Quy Tắc 5: Chuẩn Bản Vẽ Mặt Cắt Trục Kỹ Thuật Bánh Răng Côn (ISO 23509)
1. **Mặt cắt trục bổ dọc**: Khắc phục sai lầm vẽ vòng tròn phẳng 2D. Bắt buộc vẽ dưới dạng **Mặt cắt trục kỹ thuật cơ khí (Axial Cross-Section)** theo ISO 23509.
2. **Các thành phần bắt buộc**:
   - Gốc tọa độ tại Đỉnh nón chung Apex $V(0, 0)$.
   - Trục bánh 1 nằm ngang theo $X$, trục bánh 2 nằm đứng theo $Y$ ($\Sigma = 90^\circ$).
   - Đường sinh nón chia tiếp xúc qua bề rộng $b$ từ nón ngoài $R_e$ đến nón trong $R_i$.
   - Mặt nón đỉnh $\delta_a$, mặt nón đáy $\delta_f$, mặt nón phụ ngoài/trong vuông góc đường sinh nón chia.
   - Cặp răng ăn khớp liên hợp bổ dọc trục, moay-ơ, lỗ trục $d_s$, gạch mặt cắt kim loại (Hatching $45^\circ$).
   - Thuật toán căn giữa tự động (Auto-Centering) căn cân đối vào chính giữa Canvas 1200x650.

### Quy Tắc 6: Quy Chuẩn Rà Soát Song Song Trực Tiếp Live Audit ($\Delta = 0.000000$)
1. **Tab 2 Live Audit Table**:
   - Rà soát thời gian thực 153 ô tính toán Bánh Răng Trụ thẳng ($\beta = 0^\circ$), 153 ô tính toán Bánh Răng Trụ răng nghiêng ($\beta = 15^\circ$) (tổng 306 ô tính Bánh Răng Trụ) và 108 ô tính toán Bánh Răng Côn với tọa độ ô Excel tương ứng (`Gear1_01.xlsb`, `Gear2_01.xlsb`).
   - Yêu cầu nghiêm ngặt: **100.0% các ô tính phải đạt PASS với $\Delta = 0.000000$**.
2. **Bộ công cụ rà soát Excel COM 1-Click**:
   - `RA_SOAT_SONG_SONG_BANH_RANG_TRU.bat` (306 thông số cho cả 2 trường hợp $\beta = 0^\circ$ và $\beta = 15^\circ$).
   - `RA_SOAT_SONG_SONG_BANH_RANG_CON.bat` (109 thông số).

### Quy Tắc 7: Đóng Gói Mã Nguồn Thuần Chống Lỗi CORS (CORS-Free Single Bundle)
* Mọi mã JavaScript phải được đóng gói vào các file bundle thuần (Classic Script, zero-import):
  - `modules/spur-gear/js/mitcalc-engine.bundle.js`
  - `modules/bevel-gear/js/bevel-engine.bundle.js`
* Đảm bảo người dùng nhấp đúp trực tiếp vào file HTML qua giao thức `file:///` trên bất kỳ máy tính nào thì Web App đều khởi động tức thì không cần cài Node.js hay Web Server.
* Cung cấp launcher 1-Click `DONG_GOI_BUNDLE_JS.bat` chạy script `tools/bundle_all.py` mỗi khi chỉnh sửa code.

### Quy Tắc 8: Lộ Trình Cuốn Chiếu Phát Triển Các Mô-Đun Tiếp Theo
Khi phát triển các mô-đun cơ khí tiếp theo:
1. Module 3: Bánh vít - Trục vít (Worm Gear - ISO/CD 14521 / DIN 3996).
2. Module 4: Bánh răng hành tinh (Planetary Gear / Epicyclic Gear).
3. Module 5: Bộ truyền đai (V-Belt & Timing Belt Drive).
4. Module 6: Bộ truyền xích (Roller Chain Drive).
5. Module 7: Tính toán trục (Shafts) và then (Keys).
6. Module 8: Ổ lăn (Rolling Bearings - ISO 281).
Mỗi module đều phải hoàn thiện trọn vẹn 100% (công thức, kiểm thử chéo Excel COM $\Delta = 0.000000$, giao diện Accordion 3 Master Blocks, mô phỏng Canvas 2D) trước khi chuyển sang module tiếp theo!

### Quy Tắc 9: Quy Chuẩn Đưa Lên GitHub & Triển Khai Vercel (CI/CD Deployment Protocol)
1. **Quản lý mã nguồn Git**:
   - Tệp `.gitignore` chuẩn hóa: Bỏ qua `backups/*.zip` (tránh phình dung lượng git), cache python `__pycache__/`, cache IDE, tệp nháp `scratch/`, nhưng lưu giữ 100% mã nguồn, bundle, dữ liệu gốc và công cụ kiểm thử.
   - Luôn sử dụng nhánh chính `main` làm nhánh mặc định (`init.defaultBranch = main`).
   - **Lệnh trực tiếp từ chủ sở hữu (`SirPhuong`)**: Tuyệt đối KHÔNG tạo các file batch trung gian như `DAY_LEN_GITHUB.bat`. Mọi thao tác commit và push lên GitHub đều do AI trực tiếp thực hiện trong console qua tài khoản và credential đã lưu trong Windows Credential Manager.
2. **Cấu hình tĩnh Vercel (`vercel.json`)**:
   - Tên định danh dự án: `tinh-toan-bo-truyen-dong`.
   - `cleanUrls: false` để bảo toàn tuyệt đối cơ chế liên kết tương đối `.html` cục bộ và trên web.
   - Thiết lập các header an ninh (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) và MIME type chuẩn UTF-8 cho file `.js` và `.css`.
   - Cơ chế Zero-Build: Tự động deploy chỉ trong 5-10 giây không cần cài đặt package npm.

### Quy Tắc 10: Quy Chuẩn Đồng Bộ Giao Diện 1-to-1 Chuẩn Gốc MITCalc 1.74 & Trích Xuất Vector Assets
1. **Trích xuất ảnh vector chuẩn từ file gốc (.xlsb)**:
   - File `.xlsb` là kho nén zip chứa các file vector WMF và ảnh minh họa trong `xl/media/`. Sử dụng Windows GDI+ (`gdiplus.dll` qua Python `ctypes`) để rasterize các file WMF vector thành PNG độ nét cao (1200px) bảo toàn 100% tỷ lệ kỹ thuật.
2. **Section 4.0 Đồ họa kép & Đồ thị Tọa độ Mặt Cắt Trục Ăn Khớp 2D Động (Dynamic Axial Section Plot - Chart 4181)**:
   - Kết hợp sơ đồ góc xoắn & nón răng bên trái và biểu đồ 2D Descartes lưới tọa độ ăn khớp trục (`<canvas id="bevelSec4ChartCanvas">`) bên phải mô phỏng 1-to-1 Chart 4181 của MITCalc.
   - **Hoàn toàn động (Dynamic Real-Time Re-rendering)**: Khi người dùng thay đổi bất kỳ thông số nào ($\Sigma, z_1, z_2, m_{mn}, m_{et}, b, x_1$), đồ thị tự động tính toán lại hình học và vẽ lại tức thì không độ trễ.
   - **Bản chất giải tích 18 điểm chuẩn gốc**: Dựng từ đúng 18 điểm hình học thực thể cho Bánh dẫn 1 (`Data1!C70:D87`) và 18 điểm cho Bánh bị dẫn 2 (`Data1!C35:D52`) xoay góc $\Sigma$ quanh Đỉnh nón Apex $(0, 0)$ theo công thức tọa độ cực: $X = r \cos(\phi + \Sigma), Y = r \sin(\phi + \Sigma)$.
   - **Thuật toán co dãn khung hình chuẩn Excel (Dynamic Box Bounds & Nice-Scale Engine)**: Sử dụng dải bounding box ảo `Data1!C13:C24` với hệ số khung hình `Coef a:b = 1.7`, tự động tính nấc chia đẹp (Nice step ticks) độc lập cho trục X và Y nhằm bảo toàn tỷ lệ đẳng cự 1:1, khớp chính xác 100% với hiển thị của Excel MITCalc 1.74 trên mọi góc trục ($\Sigma = 60^\circ, 90^\circ, 120^\circ$) và mọi mô-đun.
3. **Section 6.0 Bản vẽ kỹ thuật & Bảng kích thước 39 dòng 7 cột**: Nhúng bản vẽ kỹ thuật gốc `mitcalc_bevel_sec6_dimensions.png` định nghĩa kích thước ISO 23509.
4. **Section 15.0 Tính toán phụ trợ (Auxiliary Calculations)**: 15.1 ($i = n_1 / n_2$), 15.2 ($P = (M_1 \cdot n_1) / 9550$), 15.3 ($i = z_2 / z_1$) kèm nút `[ OK ]` tự động chuyển giá trị vào Mục 1.0 & 4.0.
5. **Section 16.0 Hệ thống CAD & Bảng chế tạo DXFTables**: 4 chế độ CAD với icon chuẩn gốc (`image3.png` đến `image7.png`), bảng thông số dao cắt & lượng dịch chỉnh ($R_{\text{tool}} = 1.5 \cdot b$, $a_1, a_2, b_1, b_2$), sơ đồ offset `mitcalc_bevel_sec16_offset.png`, bảng BOM attributes, và DXFTables DIN 3965 / ISO 23509.

---

### Quy Tắc 11: Quy Chuẩn Kiến Trúc Giao Diện Mobile Khoa Học & Cử Chỉ Cảm Ứng 2D CAD
1. **Nguyên tắc bảo toàn dữ liệu kỹ thuật 100%**:
   - Tuyệt đối KHÔNG ẩn, KHÔNG lược bỏ bất kỳ cột thông số hay bảng tính toán kỹ thuật nào trên thiết bị di động (7 cột: `#`, `Thông số`, `Ký hiệu`, `Giá trị 1`, `Giá trị 2`, `Giá trị 3`, `Đơn vị`, `Thao tác`).
   - Bọc toàn bộ các bảng tính toán cơ khí trong `.section-body` với `overflow-x: auto; -webkit-overflow-scrolling: touch;`. Cố định `min-width: 580px` cho `.calc-table` để duy trì căn chỉnh kỹ thuật hoàn hảo, cho phép vuốt ngang tự nhiên bằng ngón tay cái mà không làm vỡ bố cục.
   - Cỡ chữ các ô nhập liệu `font-size: 16px` (hoặc `1rem`), chiều cao tối thiểu 36px để triệt tiêu hiện tượng tự động phóng to (Auto-zoom) khó chịu trên iOS Safari / Chrome Mobile.
2. **Tối ưu không gian hiển thị dọc (Vertical Space Recovery)**:
   - Header cố định trên desktop chuyển sang `position: static` trên mobile (`@media (max-width: 768px)`), giải phóng 45% chiều cao màn hình quý giá.
   - Thanh điều hướng tab kỹ thuật (`.tab-navigation`) chuyển sang dạng thanh điều khiển phân đoạn 50/50 (Segmented control) với diện tích chạm tối ưu (`min-height: 42px`).
   - Khối thẻ tóm tắt nhanh (`.summary-banner`) được tái cấu trúc thành lưới gọn 2 cột (`grid-template-columns: 1fr 1fr`), thẻ trạng thái ISO chiếm trọn chiều rộng hàng đầu, hiển thị sắc nét toàn bộ 5 chỉ số cốt lõi trong chưa đầy 120px chiều cao.
   - Di chuyển `.summary-banner` và `.global-accordion-toolbar` vào phạm vi cục bộ của Tab 1 (`#tabCalculator`). Khi chuyển sang Tab 2 (`#tabCanvas`), khung vẽ mô phỏng 2D CAD hiển thị ngay lập tức dưới thanh điều hướng, dành trọn 100% không gian màn hình cho mô phỏng cơ khí.
3. **Cử chỉ cảm ứng trực quan trên Canvas 2D CAD (Mobile Multi-Touch Engine)**:
   - Tích hợp điều khiển cảm ứng đa điểm trực tiếp vào `gear-canvas.js` và `bevel-canvas.js`:
     * Chạm 1 ngón tay (`touchstart`, `touchmove`, `touchend`): Kéo rê di chuyển mô hình (Pan).
     * Chạm 2 ngón tay: Thu phóng tức thì bằng khoảng cách giữa 2 đầu ngón tay (`Math.hypot(dx, dy)`).
     * Thiết lập `touch-action: none` và `aspect-ratio: 1200 / 650` với `width: 100%; height: auto;` để hình học ăn khớp luôn co giãn sắc nét và không bị trình duyệt giật cuộn trang khi tương tác với bánh răng.

### Quy Tắc 12: Quy Chuẩn Hộp Nhập Liệu Tích Hợp Mũi Tên Sổ Xuống Chuẩn Excel (Excel-Style Combo-Box Protocol)
1. **Bản chất giao diện 1-to-1 MITCalc 1.74**:
   - Các ô thông số trong MITCalc 1.74 bản gốc sử dụng điều khiển DropDowns của Excel đặt ngay bên cạnh ô nhập liệu (ví dụ: $i, \Sigma, \alpha, \beta, m, Q$, CAD systems).
   - Thiết kế chuẩn Web App: Sử dụng `.combo-box-group` (inline flexbox) gom cả ô nhập số `.combo-input` và nút mũi tên thả xuống `.combo-arrow-select` nằm trọn vẹn trong **Cột 4 (Bánh Dẫn - Pinion 1)**.
   - **Bảo toàn Cột 5 (Bánh Bị Dẫn - Gear 2)**: Cột 5 dành riêng cho kết quả tính toán tương ứng của bánh bị dẫn hoặc góc/mô đun liên hợp bổ sung (ví dụ: góc ăn khớp pháp $\alpha_n$ khi chọn $\alpha_t$, mô đun ngang ngoài $m_t$ khi chọn $m_n$), tuyệt đối không đẩy thẻ `<select>` sang cột 5 làm phá vỡ cấu trúc bảng cơ khí.
2. **Các danh mục tiêu chuẩn hóa (Standard Excel Named Ranges)**:
   - `T_i`: Dãy tỉ số truyền tiêu chuẩn (1.00 đến 20.00).
   - **Thuật toán co dãn khung hình chuẩn Excel (Dynamic Box Bounds & Nice-Scale Engine)**: Sử dụng dải bounding box ảo `Data1!C13:C24` với hệ số khung hình `Coef a:b = 1.7`, tự động tính nấc chia đẹp (Nice step ticks) độc lập cho trục X và Y nhằm bảo toàn tỷ lệ đẳng cự 1:1, khớp chính xác 100% với hiển thị của Excel MITCalc 1.74 trên mọi góc trục ($\Sigma = 60^\circ, 90^\circ, 120^\circ$) và mọi mô-đun.
3. **Section 6.0 Bản vẽ kỹ thuật & Bảng kích thước 39 dòng 7 cột**: Nhúng bản vẽ kỹ thuật gốc `mitcalc_bevel_sec6_dimensions.png` định nghĩa kích thước ISO 23509.
4. **Section 15.0 Tính toán phụ trợ (Auxiliary Calculations)**: 15.1 ($i = n_1 / n_2$), 15.2 ($P = (M_1 \cdot n_1) / 9550$), 15.3 ($i = z_2 / z_1$) kèm nút `[ OK ]` tự động chuyển giá trị vào Mục 1.0 & 4.0.
5. **Section 16.0 Hệ thống CAD & Bảng chế tạo DXFTables**: 4 chế độ CAD với icon chuẩn gốc (`image3.png` đến `image7.png`), bảng thông số dao cắt & lượng dịch chỉnh ($R_{\text{tool}} = 1.5 \cdot b$, $a_1, a_2, b_1, b_2$), sơ đồ offset `mitcalc_bevel_sec16_offset.png`, bảng BOM attributes, và DXFTables DIN 3965 / ISO 23509.

---

### Quy Tắc 11: Quy Chuẩn Kiến Trúc Giao Diện Mobile Khoa Học & Cử Chỉ Cảm Ứng 2D CAD
1. **Nguyên tắc bảo toàn dữ liệu kỹ thuật 100%**:
   - Tuyệt đối KHÔNG ẩn, KHÔNG lược bỏ bất kỳ cột thông số hay bảng tính toán kỹ thuật nào trên thiết bị di động (7 cột: `#`, `Thông số`, `Ký hiệu`, `Giá trị 1`, `Giá trị 2`, `Giá trị 3`, `Đơn vị`, `Thao tác`).
   - Bọc toàn bộ các bảng tính toán cơ khí trong `.section-body` với `overflow-x: auto; -webkit-overflow-scrolling: touch;`. Cố định `min-width: 580px` để duy trì căn chỉnh kỹ thuật hoàn hảo, cho phép vuốt ngang tự nhiên bằng ngón tay cái mà không làm vỡ bố cục.
   - Cỡ chữ các ô nhập liệu `font-size: 16px` (hoặc `1rem`), chiều cao tối thiểu 36px để triệt tiêu hiện tượng tự động phóng to (Auto-zoom) khó chịu trên iOS Safari / Chrome Mobile.
2. **Tối ưu không gian hiển thị dọc (Vertical Space Recovery)**:
   - Header cố định trên desktop chuyển sang `position: static` trên mobile (`@media (max-width: 768px)`), giải phóng 45% chiều cao màn hình quý giá.
   - Thanh điều hướng tab kỹ thuật (`.tab-navigation`) chuyển sang dạng thanh điều khiển phân đoạn 50/50 (Segmented control) với diện tích chạm tối ưu (`min-height: 42px`).
   - Khối thẻ tóm tắt nhanh (`.summary-banner`) được tái cấu trúc thành lưới gọn 2 cột (`grid-template-columns: 1fr 1fr`), thẻ trạng thái ISO chiếm trọn chiều rộng hàng đầu, hiển thị sắc nét toàn bộ 5 chỉ số cốt lõi trong chưa đầy 120px chiều cao.
   - Di chuyển `.summary-banner` và `.global-accordion-toolbar` vào phạm vi cục bộ của Tab 1 (`#tabCalculator`). Khi chuyển sang Tab 2 (`#tabCanvas`), khung vẽ mô phỏng 2D CAD hiển thị ngay lập tức dưới thanh điều hướng, dành trọn 100% không gian màn hình cho mô phỏng cơ khí.
3. **Cử chỉ cảm ứng trực quan trên Canvas 2D CAD (Mobile Multi-Touch Engine)**:
   - Tích hợp điều khiển cảm ứng đa điểm trực tiếp vào `gear-canvas.js` và `bevel-canvas.js`:
     * Chạm 1 ngón tay (`touchstart`, `touchmove`, `touchend`): Kéo rê di chuyển mô hình (Pan).
     * Chạm 2 ngón tay: Thu phóng tức thì bằng khoảng cách giữa 2 đầu ngón tay (`Math.hypot(dx, dy)`).
     * Thiết lập `touch-action: none` và `aspect-ratio: 1200 / 650` với `width: 100%; height: auto;` để hình học ăn khớp luôn co giãn sắc nét và không bị trình duyệt giật cuộn trang khi tương tác với bánh răng.

### Quy Tắc 12: Quy Chuẩn Hộp Nhập Liệu Tích Hợp Mũi Tên Sổ Xuống Chuẩn Excel (Excel-Style Combo-Box Protocol)
1. **Bản chất giao diện 1-to-1 MITCalc 1.74**:
   - Các ô thông số trong MITCalc 1.74 bản gốc sử dụng điều khiển DropDowns của Excel đặt ngay bên cạnh ô nhập liệu (ví dụ: $i, \Sigma, \alpha, \beta, m, Q$, CAD systems).
   - Thiết kế chuẩn Web App: Sử dụng `.combo-box-group` (inline flexbox) gom cả ô nhập số `.combo-input` và nút mũi tên thả xuống `.combo-arrow-select` nằm trọn vẹn trong **Cột 4 (Bánh Dẫn - Pinion 1)**.
   - **Bảo toàn Cột 5 (Bánh Bị Dẫn - Gear 2)**: Cột 5 dành riêng cho kết quả tính toán tương ứng của bánh bị dẫn hoặc góc/mô đun liên hợp bổ sung (ví dụ: góc ăn khớp pháp $\alpha_n$ khi chọn $\alpha_t$, mô đun ngang ngoài $m_t$ khi chọn $m_n$), tuyệt đối không đẩy thẻ `<select>` sang cột 5 làm phá vỡ cấu trúc bảng cơ khí.
2. **Các danh mục tiêu chuẩn hóa (Standard Excel Named Ranges)**:
   - `T_i`: Dãy tỉ số truyền tiêu chuẩn (1.00 đến 20.00).
   - `T_AngleList`: Góc trục $\Sigma$ tiêu chuẩn ($60^\circ, 70^\circ, 80^\circ, 90^\circ, 100^\circ, 110^\circ, 120^\circ$).
   - `T_AlfaList`: Góc ăn khớp danh nghĩa $\alpha$ ($14.5^\circ, 15^\circ, 17.5^\circ, 20^\circ, 22^\circ, 25^\circ$).
   - `T_BetaList`: Góc xoắn răng $\beta$ ($0^\circ, 8^\circ, 10^\circ, 12^\circ, 15^\circ, 20^\circ, 25^\circ, 30^\circ, 35^\circ, 40^\circ, 45^\circ$).
   - `T_modul`: Dãy mô đun tiêu chuẩn DIN 780 / ISO (0.5 mm đến 50.0 mm).
   - `T_TypePressAngle` & `T_TypeoffModule`: Dropdown dạng `.param-type-select` nằm trực tiếp trên tên thông số để hoán đổi linh hoạt giữa Pháp diện (Normal) và Ngang diện (Transverse).
   - `T_CADSystems`, `T_DXFScale`, `T_DXF_2P`, `T_DXFTablesList`: Dropdown lựa chọn phiên bản CAD, tỉ lệ bản vẽ, chi tiết xuất và bảng thông số gia công.
3. **Tính phản ứng hai chiều (Bidirectional Reactive Sync)**:
   - Khi người dùng chọn một giá trị từ mũi tên thả xuống `▼`, giá trị đó lập tức được ghi vào ô nhập liệu và bộ giải thuật tính toán lại theo thời gian thực (Zero-Lag).
   - Khi người dùng nhập tay bất kỳ giá trị số thực nào vào ô nhập liệu, hệ thống tự động nhận diện và tính toán bình thường mà không bị ràng buộc bởi danh sách có sẵn.

---

### Quy Tắc 13: Quy Chuẩn Đóng Khung Công Thức Toán Học & Triệt Tiêu Nét Cắt Chéo Đồ Thị Mặt Cắt Trục (Master Formula & Clean Polygon Protocol)
1. **Đóng khung hệ thống công thức toán học (`docs/MATHEMATICAL_FORMULAS_MASTER.md`)**:
   - Toàn bộ các công thức tính toán hình học, động học, tương đương Tredgold, trùng khớp và đo kiểm của cả Bánh Răng Trụ (ISO 6336) và Bánh Răng Côn (ISO 23509) được đóng khung thành tiêu chuẩn vàng bất biến.
   - Bổ sung công thức giải tích chuẩn xác tuyệt đối cho Chiều dày đỉnh răng trong (Inner tip tooth thickness - Row 6.38 $s_{ai1}, s_{ai2}$):
     $$\cos\alpha_{ai} = \frac{d_i \cos\alpha}{d_{ai}}, \quad s_{ai} = d_{ai} \left(\frac{s_{ni}}{d_i} + \text{inv}(\alpha) - \text{inv}(\alpha_{ai})\right)$$
     Khớp 100% với ô $P_{232}$ và $Q_{232}$ của MITCalc gốc với sai số $\Delta = 0.000000$.
2. **Thuật toán triệt tiêu nét cắt chéo đồ thị mặt cắt trục 2D (Clean Polygon Algorithm)**:
   - Khắc phục lỗi tự giao cắt (self-intersecting bowtie) do lặp tuần tự $0 \to 17$ và `closePath()` chéo qua tâm trục.
   - Chu trình đa giác chu vi sạch khép kín cho cả Bánh 1 và Bánh 2:
     $$\text{boundaryIndices} = [0, 1, 2, 3, 14, 15, 16, 17, 10, 11, 8, 7, 6, 5, 0]$$
   - Vẽ riêng 2 đường chân răng (Root lines: $3 \to 0$ đỉnh trên và $9 \to 8$ đỉnh dưới) bằng nét mảnh 1.0px.
   - Tuyệt đối không sinh bất kỳ nét cắt chéo nào giữa 2 hình cắt bánh răng hoặc trong lòng thân bánh răng.

---

### Quy Tắc 14: Quy Chuẩn Mô Phỏng 2D CAD Canvas & Mặt Đầu Bánh Dẫn Chuẩn Cơ Khí (ISO 23509 & ISO 128 CAD Protocol)
1. **Phần Đầu Bánh Nhỏ (Pinion Front End / Face Protocol)**:
   - Khắc phục triệt để lỗi vẽ đầu bánh nhỏ tùy tiện hoặc khoét lỗ xiên (`- 5` arbitrary offset).
   - Mặt đầu trước của bánh nhỏ (Pinion front face) là **mặt phẳng thẳng đứng vuông góc hoàn toàn với trục quay** tại tọa độ hoành độ đáy nón trong: $X_{\text{front1}} = X_{\text{toe\_root1}} = R_i \cos\delta_1 + h_{fi1} \sin\delta_1$.
   - Đường mặt đầu trước hạ thẳng đứng góc $90^\circ$ từ đáy chân răng trong $(X_{\text{toe\_root1}}, -d_{fi1}/2)$ xuống bán kính lỗ trục $-d_{\text{bore1}}/2$, tạo khối định vị gá lắp cơ khí chuẩn xác, liền lạc và cứng vững 100%.
2. **Động cơ mặt cắt kỹ thuật ISO 128 (Technical Hatching Engine)**:
   - Thân bánh dẫn (Pinion 1) được gạch mặt cắt kim loại chuẩn ISO 128 nghiêng $+45^\circ$ màu xanh ngọc lục bảo (`rgba(16, 185, 129, 0.45)`).
   - Thân bánh bị dẫn (Gear 2) được gạch mặt cắt kim loại chuẩn ISO 128 nghiêng $-45^\circ$ màu xanh hoàng gia (`rgba(59, 130, 246, 0.45)`).
   - Đường bao chi tiết được tái khởi tạo và stroke viền kỹ thuật 2.0px đè lên lớp gạch mặt cắt, triệt tiêu hiện tượng tràn nét hoặc mờ biên dạng.
3. **Hệ thống kích thước bản vẽ CAD tiêu chuẩn (Full Engineering CAD Dimensioning)**:
   - Kích thước đường kính đỉnh ngoài: $\varnothing d_{ae1}$ (bánh 1, đặt bên phải) và $\varnothing d_{ae2}$ (bánh 2, đặt phía trên) kèm đường dóng và mũi tên CAD tỉ lệ 3:1.
   - Kích thước chiều dài nón ngoài $R_e$ và bề rộng vành răng $b$ song song với đường sinh nón chia kèm đường dóng vuông góc.
   - Cung đo góc nón chia $\delta_1, \delta_2$ và góc trục $\Sigma = 90^\circ$.
   - Điểm đỉnh nón chung Apex $V(0, 0)$ có tâm chữ thập đỏ nổi bật.
   - Bảng thông số kỹ thuật chuẩn ISO 23509 (Technical Data Card) ghim góc trên bên trái hiển thị đầy đủ $i, z_1/z_2, m_{mn}, \delta_1/\delta_2, b, \beta, x_1/x_2$.
4. **Bộ điều khiển hiển thị lớp đồ họa tương tác (Interactive CAD Layer Toggles)**:
   - Tab 2 Canvas Toolbar tích hợp 5 checkbox bật/tắt tức thì:
     * `[x] Kích thước CAD` (`chkShowDims`)
     * `[x] Mặt cắt ISO 128` (`chkShowHatch`)
     * `[x] Đường tâm & Nón` (`chkShowAxes`)
     * `[x] Vệt răng động` (`chkShowStripes`)
     * `[x] Bảng thông số` (`chkShowDataCard`)
   - Đồng bộ hoàn toàn giữa Canvas hiển thị và tệp xuất CAD DXF (AutoCAD Release 12).

---

### Quy Tắc 15: Quy Chuẩn Mô Phỏng Ăn Khớp 3D WebGL Bánh Răng Trụ & Bánh Răng Nghiêng & Xuất File CAD 3D Cho SolidWorks / Mastercam
1. **Kiến trúc mô phỏng ăn khớp 3D WebGL (Three.js r128 100% Offline & Zero-CORS)**:
   - Thư viện Three.js r128 và OrbitControls được lưu trữ cục bộ tại `shared/js/three.min.js` và `shared/js/OrbitControls.js`, khởi chạy 100% độc lập không cần internet và zero-CORS qua giao thức `file:///`.
   - **Tự động nhận diện kiểu răng theo góc nghiêng $\beta$**:
     * Khi $\beta = 0^\circ$: Tự động mô phỏng Bánh Răng Trụ Răng Thẳng (Spur Gear), răng thẳng đứng song song với trục, 2 mặt đầu phẳng, số lát cắt trục $numSlices = 1$.
     * Khi $\beta > 0^\circ$ (hoặc $\ne 0^\circ$): Tự động chuyển sang mô phỏng Bánh Răng Trụ Răng Nghiêng (Helical Gear), các răng xoắn liên tục dọc theo bề rộng vành răng $b$ với tốc độ xoắn không gian $\omega_{\text{twist}} = \frac{2 \tan\beta}{d}$ (rad/mm).
   - **Ăn khớp liên hợp không gian (Spatial Conjugate Meshing)**: Bánh dẫn 1 có hướng xoắn phải ($Hand = +1$), Bánh bị dẫn 2 có hướng xoắn trái ($Hand = -1$). Hai bánh tiếp xúc liên tục và mượt mà trên đường ăn khớp tại đúng khoảng cách trục $a_w$.
   - **Động học thời gian thực**: Góc quay bánh 1 là $\theta_1(t)$ và bánh 2 là $\theta_2(t) = \phi_{\text{initial}} - \theta_1(t) / i$. Tích hợp thanh trượt tốc độ $0.1\times - 3.0\times$ và nút Dừng/Chạy.
   - **Bộ góc nhìn & Vật liệu PBR kim loại**:
     * 4 góc nhìn cơ khí 1-Click: Isometric, Mặt trước (Front XY), Nhìn từ trên (Top XZ), Cận cảnh ăn khớp (Mesh Zoom).
     * Chế độ bật/tắt khung dây kỹ thuật (Wireframe).
     * Vật liệu PBR kim loại: Bánh dẫn mạ đồng thau vàng hổ phách, Bánh bị dẫn thép hợp kim titan xanh cyan, lưới sàn tọa độ tương phản cao.
2. **Hệ thống xuất tệp CAD 3D chuyên dụng cho SolidWorks & Mastercam**:
   - **STEP AP214 (ISO 10303-21 B-Rep Solid)**: Định dạng chuẩn công nghiệp với cấu trúc B-Rep thực thể rắn (`MANIFOLD_SOLID_BREP` / `CLOSED_SHELL`). Khi mở trên SolidWorks hoặc Mastercam, mô hình được nhận diện lập tức là một **Solid Body hoàn chỉnh (không phải Surface rỗng)**, cho phép kỹ sư lập trình gia công CNC ngay lập tức trên Mastercam (phay lăn răng 4/5 trục, phay 3D High-Speed, cắt dây EDM Wire) mà không cần vá bề mặt.
   - **Binary STL (Nhị phân chuẩn)**: Header 80-byte chuẩn hóa, 4-byte số lượng tam giác (uint32 Little-Endian), 50 bytes mỗi tam giác (vector pháp tuyến float32 + 3 đỉnh float32 + 2 bytes attribute byte count = 0). Dung lượng siêu nhẹ ($\sim 1.5 - 3.5\text{ MB}$), nhập vào Mastercam Mill/Wire và máy in 3D công nghiệp trong nháy mắt.
   - **Wavefront OBJ**: Định dạng bổ trợ kèm đầy đủ vector đỉnh và pháp tuyến.
   - **Tùy chọn xuất linh hoạt**: Xuất Bánh dẫn 1 (Pinion 1), Bánh bị dẫn 2 (Gear 2), hoặc Cặp lắp ráp hoàn chỉnh (Assembly Pair) đúng vị trí khoảng cách trục $a_w$.
3. **Thuật toán tối ưu hóa lưới đa giác Kín Nước (Watertight Manifold Topology Optimization)**:
   - Bảo toàn 100% tính kín nước (Watertight): Biên dạng răng thân khai chính xác, góc lượn chân răng $R = 0.38 m_n$, cung đáy rãnh, mặt trụ lỗ trục và 2 mặt đầu liên kết đối xứng $1:1$ qua các tam giác định hướng nhất quán (CCW winding).
   - Lấy mẫu thích ứng: Bước lấy mẫu $step = 2$ cho $z \le 30$ và $step = 4$ cho $z > 30$, cùng 6 đến 10 lát cắt trục cho bánh răng nghiêng. Khống chế số lượng tam giác ở mức lý tưởng ($\sim 30,000 - 70,000$ tam giác cho cả bộ truyền), đảm bảo mô phỏng 60 FPS mượt mà trên mọi thiết bị và tệp CAD mở tức thì trong 1 giây.

---

### Quy Tắc 16: Quy Chuẩn Biên Dạng Răng Gia Công Thực Thể 1-to-1 Chuẩn Gốc MITCalc 1.74 & Zero-Tolerance Coordinates (Δ = 0.000000 mm)
1. **Bản chất giải thuật bao hình lăn dao thanh răng (Rack-Cutter Rolling Envelope Kinematics)**:
   - Kế thừa và chuyển mã trực tiếp 1-to-1 giải thuật cốt lõi từ `GearFunctions.bas:920-1123` (`FillTeethProfile2` & `RotateTool`) của MITCalc 1.74 vào JavaScript thuần (`MitcalcToothSolver`).
   - Mô phỏng chính xác chuyển động cắt gọt tương đối giữa phôi bánh răng và dao thanh răng tiêu chuẩn:
     * Chiều cao đỉnh dao cắt phôi: $h_{a0}^* = 1.25$ (cắt sâu vào chân răng để tạo lượn chân trochoid và hiện tượng cắt lẹm tự nhiên khi ít răng).
     * Chiều cao đáy dao tương ứng đỉnh răng: $h_{f0}^* = 1.00$.
     * Bán kính góc lượn mũi dao cắt: $r_{a0}^* = 0.38$.
     * Bước góc xoay lăn dao thanh răng: $\Delta\psi = 0.5^\circ$ (`_CuttStepAngle`).
     * Lấy mẫu: $NoPtHead = 20$ điểm trên cung đỉnh và $NoPtEv = 100$ điểm trên đường thân khai & lượn chân răng (tổng 120 điểm).
2. **Chuẩn Zero-Tolerance Tuyệt Đối (Δ = 0.000000 mm)**:
   - Kiểm thử chéo trực tiếp qua Playwright và Excel COM giữa kết quả bộ giải `MitcalcToothSolver` và bảng `Coordinates` của MITCalc 1.74 gốc:
     * Bánh dẫn 1 ($z_1 = 19, m_n = 6, x_1 = 0$): $\text{Max } \Delta X = 0.000000000000\text{ mm}$, $\text{Max } \Delta Y = 0.000000000000\text{ mm}$ (120/120 điểm khớp 100%).
     * Bánh bị dẫn 2 ($z_2 = 48, m_n = 6, x_2 = 0$): $\text{Max } \Delta X = 0.000000000000\text{ mm}$, $\text{Max } \Delta Y = 0.000000000000\text{ mm}$ (120/120 điểm khớp 100%).
3. **Phân mục 20.0 Hệ Thống CAD & Bảng Tọa Độ Điểm Răng (Section 20.0)**:
   - Tích hợp đầy đủ vào Master Block 3 (Additions & Manufacturing) của Bánh Răng Trụ:
     * 20.1 Hệ thống CAD: Bản vẽ 2D DXF, Mô hình khối 3D Solid STEP AP214 (Mastercam / SolidWorks), File 3D STL (Mastercam CNC), AutoCAD.
     * 20.5 Số răng vẽ chi tiết ($z_{\text{draw}} = 4$).
     * 20.6 Số điểm cung đỉnh răng ($NoPtHead = 20$).
     * 20.7 Số điểm thân khai & lượn chân răng ($NoPtEv = 100$).
     * 20.8 Bước góc xoay dao thanh răng ($\Delta\psi = 0.5^\circ$).
     * 20.C Nút xem bảng 120 điểm tọa độ (`#coordTableContainer`) trực quan hóa từng cặp tọa độ $(X_1, Y_1, R_1)$ và $(X_2, Y_2, R_2)$.
     * Nút xuất tệp tọa độ TXT (`MITCalc_Tooth_Coordinates_*.txt`) phục vụ nạp trực tiếp vào máy công cụ CNC hoặc phần mềm CAM.
4. **Liên kết hình học thực thể cho CAD 2D và CAD 3D**:
   - Biên dạng 2D xuất file DXF, mô hình 3D WebGL, tệp STEP AP214 và tệp STL đều sử dụng trực tiếp lưới biên dạng từ `MitcalcToothSolver`.
   - Đáp ứng trọn vẹn yêu cầu gia công cơ khí chính xác: người kỹ sư có thể lấy trực tiếp file STEP/STL mở trên Mastercam để lập trình đường chạy dao phay lăn răng, phay mặt sườn răng thân khai hoặc cắt dây EDM Wire mà không sợ sai lệch hình học dù chỉ 1 micron.

---

### Quy Tắc 17: Quy Chuẩn Mặt Đầu Phẳng Tuyệt Đối (Zero-Ripple Planar Caps), Dropdown Hướng Nhìn 3D CAD Tiêu Chuẩn và Đồng Bộ Pha Động Học Ăn Khớp Không Va Chạm
1. **Tách khối đỉnh (Vertex Splitting) - Triệt tiêu 100% hiện tượng nhấp nhô gợn sóng mặt đầu**:
   - Khắc phục triệt để lỗi đổ bóng gợn sóng (rippled shading) do dùng chung đỉnh giữa hông răng và mặt đầu phẳng.
   - Chia lưới đa giác thành 4 nhóm đỉnh độc lập:
     * Nhóm hông răng ngoài: Pháp tuyến cong mịn theo toán học thân khai và lượn chân răng.
     * Nhóm mặt đầu trước ($Z = +halfB$): $2N$ đỉnh, vector pháp tuyến **chính xác tuyệt đối $[0, 0, 1]$**.
     * Nhóm mặt đầu sau ($Z = -halfB$): $2N$ đỉnh, vector pháp tuyến **chính xác tuyệt đối $[0, 0, -1]$**.
     * Nhóm lòng lỗ trục: Pháp tuyến hướng tâm $[-\cos\theta, -\sin\theta, 0]$.
   - Tạo ra cạnh sắc cơ khí chuẩn $90^\circ$ (Hard mechanical edge), 2 mặt đầu phẳng lì 100%, phản xạ ánh sáng đồng nhất, trung thực như sản phẩm cơ khí sau gia công phay mặt đầu.
2. **Hộp chọn Dropdown hướng nhìn 3D CAD tiêu chuẩn (`#sel3DViewPreset`)**:
   - Thay thế cụm nút bấm riêng lẻ bằng một ô chọn Dropdown duy nhất có mũi tên sổ xuống theo chuẩn công nghiệp (SolidWorks / Mastercam / Inventor):
     * `iso`: 🎥 Phối Cảnh (Isometric)
     * `front`: ⬆️ Trực Diện Mặt Đầu (Front - XY)
     * `back`: ⬇️ Mặt Sau (Back - XY)
     * `top`: ➡️ Nhìn Từ Trên (Top - XZ)
     * `bottom`: ⬅️ Nhìn Từ Dưới (Bottom - XZ)
     * `right`: ▶️ Nhìn Từ Phải (Right - YZ)
     * `left`: ◀️ Nhìn Từ Trái (Left - YZ)
     * `mesh`: 🔍 Vùng Tiếp Xúc Ăn Khớp (Mesh Zone Zoom)
   - Tự động căn tâm cụm chi tiết hoặc điểm tiếp xúc ăn khớp khi người dùng đổi góc nhìn.
3. **Đồng bộ pha động học ăn khớp không va chạm (Conjugate Meshing Phase Alignment)**:
   - Các chi tiết riêng lẻ được sinh đối xứng hoàn hảo quanh trục $+Y$ với $baseOffset = 0.0$.
   - Khi ghép cụm bộ truyền tại khoảng cách trục $a_w$, góc pha ban đầu của bánh 2 được xác định theo giải tích:
     $$\phi_{2,0} = \frac{\pi}{z_2} + \frac{\pi}{2} \left(1 - \frac{z_1}{z_2}\right)$$
   - Khóa cứng góc quay động học: $\phi_2 = \phi_{2,0} - \phi_1 \cdot \frac{z_1}{z_2}$ trong toàn bộ vòng lặp hoạt ảnh, triệt tiêu 100% sai số tích lũy. Răng bánh 1 đi vào rãnh răng bánh 2 đạt khe hở chân răng $c = 1.501\text{ mm}$ (chuẩn $c^* = 0.25 \cdot m_n$), khe hở cạnh răng tiếp xúc trơn tru liên tục ($0.0025\text{ mm}$), **hoàn toàn không bị chồng chéo hay va chạm**.

---

### Quy Tắc 18: Quy Chuẩn Xuất File DXF Tương Thích AutoCAD 2004+ & Đa Lựa Chọn Xuất Bánh 1, Bánh 2, Cặp Ăn Khớp (AutoCAD 2004+ Compliant DXF Protocol)
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

### Quy Tắc 19: Quy Chuẩn Xuất File 3D Flank Surface Rỗng Cho Mastercam & SolidWorks (Open Flank Shell STEP / STL Protocol)
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

### Quy Tắc 20: Quy Chuẩn Thanh Tăng Chỉnh Độ Mịn Biên Dạng Răng 11 Mức (11-Level Profile Resolution Engine)
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
     * Đồng bộ hai chiều giữa thanh trượt trong Bảng tính toán (Mục 20.9) và thanh trượt trên thanh công cụ Canvas Tab 2.

---

### Quy Tắc 21: Quy Chuẩn Phôi Đặc & Răng Thực Thể 3D Bánh Răng Côn Chuẩn Gốc MITCalc 1.74 (Authentic Gear Blank Solid & Tooth Protocol - ISO 23509 & Data1)
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
     * Bánh dẫn 1 (Pinion): $Z \in [201.61, 323.01]\text{ mm}$ (chiều dài trục $121.4\text{ mm}$), $R_{\max} = 140.18\text{ mm}$, lỗ trục $d = 50\text{ mm}$ (khớp $P_{16}$ và $P_{03}$ trong `Data1!C70:D87`).
     * Bánh bị dẫn 2 (Gear): $Z \in [77.20, 161.24]\text{ mm}$ (chiều dài trục $84.0\text{ mm}$), $R_{\max} = 317.12\text{ mm}$, lỗ trục $d = 100\text{ mm}$ (khớp $P_{16}$ và $P_{03}$ trong `Data1!H35:I52`).
     * **Quy chuẩn moay-ơ trước Bánh 2 lùi sâu trong lòng phôi (Recessed Front Hub Cup Protocol)**: $Z_{\text{toe\_hub2}} = R_i \cos\delta_2 + (h_{fi2} + H_{2\text{in}}) \sin\delta_2 = 82.20 + 16.65 = 98.85\text{ mm}$ (khớp điểm mép $P_{06}$ tại $H = -98.85\text{ mm}$ trong `Data1!H40:I40`). Triệt tiêu hoàn toàn hiện tượng nón nhô ra phía trước, tạo khoang rỗng lòng nón chìm (recessed cup) chuẩn 100% bản vẽ kỹ thuật cơ khí 2D Section 4 & 6.
2. **Răng Thực Thể Đứng Độc Lập Chuẩn Biên Dạng Thân Khai Tredgold**:
   - Răng mọc nổi trên mặt nón đáy, bảo toàn 100% chiều sâu răng: $h_e = 26.60\text{ mm}$ tại gót ngoài (khớp `Teeth_h = 26.5994`), $h_i = 17.40\text{ mm}$ tại mũi trong (khớp `Teeth_h = 17.4006`).
   - Biên dạng thân khai ảo Tredgold đầy đủ mặt đỉnh ($s_{ae1} = 8.88\text{ mm}, s_{ae2} = 13.52\text{ mm}$), hai sườn làm việc thân khai, và cung bo lượn chân răng.
   - Toàn bộ khối hình học là khối kín nước hoàn toàn 100% (Watertight Manifold Solid): 25,920 đỉnh cho Bánh 1, 64,800 đỉnh cho Bánh 2.
3. **Đường Răng Thẳng & Xoắn Gleason Chuẩn Gốc MITCalc 1.74 (`Calculation!U197:AQ202`)**:
   - **Răng Thẳng Tuyệt Đối ($\beta = 0^\circ$)**: Khắc phục triệt để lỗi fallback `|| 30.0` trong JavaScript. Khi $\beta = 0^\circ$, `isSpiral = false`, đường sinh răng hội tụ thẳng tắp về Đỉnh Apex $V(0, 0, 0)$, huy hiệu 3D tự động hiển thị "⚙️ Bánh Răng Côn Răng Thẳng (Straight Bevel)".
   - **Răng Xoắn Gleason ($\beta > 0^\circ$)**: Cung tròn dao cắt bán kính $R_{\text{tool}} = 1.5 \cdot b = 175.5\text{ mm}$ (Section 16.4) tiếp xúc tại điểm chia trung bình $R_m$. Tọa độ chuẩn hóa dọc bề rộng: $u = (R - R_m)/b \in [-0.5, 0.5]$ ($u = 0$ tại $R_m$).
   - Độ võng cung dao cắt:
     $$W(u) = \text{hand} \cdot \left(R_{\text{tool}} \cos\beta - \sqrt{R_{\text{tool}}^2 - (u \cdot b + R_{\text{tool}} \sin\beta)^2}\right)$$
   - Độ vặn xoắn góc cung răng: $\text{spiralTwist} = W(u) / (R \sin\delta)$.
   - Khớp 100% các giá trị độ võng dao cắt của MITCalc: Section A: $W = -21.058\text{ mm}$, Section C: $W = 0.000\text{ mm}$, Section E: $W = +54.976\text{ mm}$.
   - **Phản ứng thời gian thực (Reactive Dynamic Sync)**: Khi người dùng đổi $\beta$ sang $0^\circ, 15^\circ, 25^\circ, 35^\circ$, mô hình 3D WebGL tự động tính toán lại hình học và dựng lại tức thì.
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

### Quy Tắc 22: Quy Chuẩn Xuất Bản Vẽ 2D CAD Release 12 (AC1009) Tương Thích AutoCAD 2004 - 2026
1. **Định dạng tương thích 100% AutoCAD 2004+**:
   - Chuẩn Release 12 (mã hiệu `$ACADVER = AC1009`), ký tự xuống dòng bắt buộc CRLF (`\r\n`).
   - Đầy đủ 4 bảng hệ thống trong `SECTION TABLES`: `VPORT`, `LTYPE` (CONTINUOUS, CENTER, DASHED), `LAYER` (`GEAR1_PINION`, `GEAR2_WHEEL`, `PITCH_CONES`, `CENTER_LINES`, `SHAFTS_BORE`, `MFG_TABLE`), `STYLE` (`STANDARD`).
   - Bản vẽ mặt cắt trục kỹ thuật ISO 23509 trích xuất từ dữ liệu thực thể `Data1!C63:D95` & `Data1!C28:D60`.
   - Bảng thông số chế tạo gia công `MFG_TABLE` theo ISO 23509 / DIN 3971.
2. **Thanh Tăng Chỉnh Độ Mịn Biên Dạng Răng 11 Mức**:
   - Thanh trượt 11 mức (`sliderProfileResolution` min=1, max=11, mặc định mức 6: 40 pts/răng).
3. **Menu Sổ Xuống Đa Lựa Chọn Xuất Bản Vẽ DXF**:
   - Cung cấp 3 tùy chọn: ⚙️ Xuất Bánh Dẫn 1 (.dxf), ⚙️ Xuất Bánh Bị Dẫn 2 (.dxf), 🔗 Xuất Cả Cặp Ăn Khớp (.dxf).

---

### Quy Tắc 23: Hộp Chọn Hướng Nhìn 3D Duy Nhất Dropdown Chuẩn CAD
1. **Giao diện chuẩn phần mềm CAD chuyên nghiệp**:
   - Gom toàn bộ hướng nhìn vào 1 ô chọn duy nhất có mũi tên sổ xuống: `<select id="sel3DViewPreset">` (Isometric, Mesh Zone, Axial XY Front, Top XZ, Side YZ, Cận cảnh Bánh 1 / Bánh 2).
   - Nút Đặt Lại (`btnReset3DView`) đưa góc nhìn về Isometric ban đầu với 1 cú nhấp.

---

### Quy Tắc 24: Quy Chuẩn Phân Tích & Hiển Thị Vệt Tiếp Xúc Ăn Khớp 3D Thời Gian Thực (Tooth Contact Analysis - TCA Dynamic Highlighting Protocol)
1. **Yêu cầu kỹ thuật cốt lõi (Lệnh trực tiếp từ `SirPhuong`)**:
   - *Chỉ đổi màu đúng vị trí tiếp xúc*: Khi 2 bánh răng ăn khớp, CHỈ có vệt/dải tiếp xúc cục bộ nơi 2 bề mặt răng chạm nhau mới đổi màu. Tuyệt đối không đổi màu toàn bộ bề mặt sườn răng.
   - *Khôi phục màu tức thì*: Khi răng lăn ra khỏi vùng ăn khớp, bề mặt răng lập tức trở về màu kim loại gốc (vàng đồng / xanh ngọc PBR).
   - *Zero-Force Scope*: Tính toán dựa hoàn toàn trên hình học tiếp xúc và động học ăn khớp thực tế, không tính toán ứng suất/lực phức tạp.
   - *Hiệu năng 60 FPS*: Sử dụng kỹ thuật can thiệp fragment shader GPU (`MeshStandardMaterial.onBeforeCompile`), không duyệt đỉnh CPU, duy trì 60 FPS ổn định trên mọi thiết bị.
2. **Giải thuật trường khoảng cách pháp tuyến GPU (Conjugate Distance Field)**:
   - *Bánh răng côn (Module 2)*: Chiếu tọa độ thế giới $(X, Y, Z)$ lên hệ tọa độ nón tiếp xúc giữa $R_i$ và $R_e$. Độ lệch tiếp tuyến $h$ và trục $Z$ bù góc xoắn $\beta$ xác định dải tiếp xúc mỏng $d_{\text{contact}} \le w$.
   - *Bánh răng trụ thẳng & nghiêng (Module 1)*: Sử dụng định lý cơ bản ăn khớp thân khai. Điểm tiếp xúc luôn nằm trên mặt phẳng ăn khớp tiếp xúc chung 2 vòng tròn cơ sở đi qua điểm ăn khớp $P(r_{w1}, 0)$:
     $$d_{\text{LoA}} = |(X - r_{w1}) \cos\alpha_{wt} + Y \sin\alpha_{wt} - Z \tan\beta \sin\alpha_{wt}|$$
     Chỉ kích hoạt khi $(X, Y, Z)$ nằm trong hình hộp bao ăn khớp thực tế $|X - r_{w1}| \le 1.8 m_n$, $|Y| \le 2.2 m_n$, $|Z| \le b_{\max}/2 + 2$, và nằm ngoài bán kính lỗ trục moay-ơ.
3. **Bộ 3 chế độ màu sắc kiểm tra trực quan (TCA Color Modes)**:
   - `0`: 🔴 **Laser Ruby / Neon Flame** (`#ff1744`): Vệt đỏ neon viền vàng hổ phách phát sáng rực rỡ, nhìn rõ từ xa.
   - `1`: 🔵 **Prussian Blue / Marking Compound** (`#0452f2`): Mô phỏng bột màu rà vết cơ khí (Engineer's Marking Blue) trong xưởng chế tạo máy.
   - `2`: 🌈 **Thermal Heatmap** (Gradient áp lực tiếp xúc Hertz): Dải 3 màu Xanh lá $\rightarrow$ Vàng $\rightarrow$ Đỏ rực trực quan hóa độ sâu vùng tiếp xúc danh nghĩa.
4. **Bộ điều khiển tương tác trên thanh công cụ 3D (`#toolbar3D`)**:
   - Nút bật/tắt: `#btnToggleContactTCA` (đổi trạng thái `🔴 Đang Hiện Vết` khi bật).
   - Hộp chọn chế độ màu: `#selTCAColorMode` (hiện khi bật TCA).
   - Thanh trượt bề rộng dải tiếp xúc: `#sliderTCABandWidth` (0.5 mm - 4.0 mm, mặc định 2.2 mm).
   - Huy hiệu trạng thái: `#badgeTCAStatus` gắn vào thanh thông số overlay góc dưới màn hình.

---

### Quy Tắc 25: Quy Chuẩn Điều Khiển CAD 360 Không Khóa Cực, Bộ Nút Nhích Từng Bước & Mô Phỏng Bánh Răng Côn Xoắn Gleason 3D
1. **Điều Khiển CAD 360 Không Khóa Cực (CAD Orbit 360 Protocol)**:
   - Triệt tiêu hạn chế kẹp góc cực $[0, \pi]$ của OrbitControls chuẩn. Khi `cadOrbit360 = true`, hệ thống sử dụng Quaternion quay đồng thời `offset` và `camera.up` quanh trục ngang trực giao tức thời $\vec{right} = \vec{up} \times \vec{forward}$.
   - Cho phép người dùng nhào lộn xoay tự do 360° xuyên qua mặt đáy bánh lớn (bán cầu dưới $Y < 0$) mà không bị pole stop hay Gimbal Lock.
2. **Bộ Nút Nhích Từng Chút Một (Step Jog 2D & 3D)**:
   - Tích hợp cụm nút `[⏮️ Nhích Lùi]` (`btn3DStepBack` / `btn2DStepBack`) và `[⏭️ Nhích Tiến]` (`btn3DStepFwd` / `btn2DStepFwd`).
   - Tự động tạm dừng hoạt ảnh và bước góc quay vi sai $\Delta\theta_1 = \pm \frac{\pi}{10 \cdot z_1} \approx \pm 1^\circ$, đồng bộ $\Delta\theta_2 = -\Delta\theta_1 / i$, cho phép soi kỹ từng góc ăn khớp của răng.
3. **Mở Rộng Dải Tốc Độ Siêu Chậm (Ultra-Slow Speed Slider)**:
   - Dải tốc độ mở rộng xuống `0.01x` với hiển thị thông minh 2 chữ số thập phân (`0.01x`, `0.02x`, `0.05x`) khi tốc độ $< 0.1\text{x}$.
4. **Chuẩn Hóa Ăn Khớp Bánh Răng Côn Xoắn Gleason 3D**:
   - Bánh dẫn 1 xoắn trái (`hand1 = -1`), Bánh bị dẫn 2 xoắn phải (`hand2 = +1`).
   - Chiều dày răng và góc ăn khớp nón ảo Tredgold quy đổi sang ngang diện: $\alpha_t = \arctan(\tan\alpha_n / \cos\beta)$, $s_t = s_n / \cos\beta$.
   - Hai sườn răng xoắn cong cùng chiều lồng khít vào nhau `( (`, không đâm xiên cắt chéo "X" và không ngập răng.

---

### Quy Tắc 26: Quy Chuẩn 3 Chế Độ Kiểm Tra Ăn Khớp Độc Lập Cho Lập Trình Gia Công CNC (Tùy Biến Kết Hợp Tự Do)
1. **Mục đích & Yêu cầu người dùng (`SirPhuong`)**:
   - Cung cấp giải pháp thẩm định và kiểm tra trực quan độ chính xác của mô hình 3D ăn khớp bánh răng côn trước khi lập trình gia công phay CNC (Mastercam, PowerMill, SolidCAM, phay nhiều trục).
   - Triển khai 3 phương án dưới dạng **3 nút bấm độc lập** trên thanh công cụ 3D, hoạt động theo cơ chế bật/tắt (Toggle) và cho phép kết hợp tự do bất kỳ phương án nào (1, 2, 3, 1+2, 1+3, 2+3, 1+2+3).
   - Mô hình 3D danh nghĩa được dựng theo chuẩn hình học lý thuyết với khe hở sườn răng $j_n = 0.000\text{ mm}$ (Zero Backlash) làm chuẩn đầu vào cho CAM, còn khe hở cạnh răng khi gia công thực tế sẽ do thợ vận hành / phần mềm CAM tạo ra bằng lượng dịch dao (cutter offset) hoặc cắt lẹm sườn răng.
2. **Bộ 3 công cụ kiểm tra ăn khớp độc lập**:
   - **Phương Án 1: `[👁️ Chỉ Mặt Bên]` (`#btnToggleFlankOnly`)**:
     * Ẩn toàn bộ phôi đặc (moay-ơ, lỗ trục, nón đỉnh phẳng, nón đáy phẳng: `pinionMesh.visible = false; gearMesh.visible = false;`).
     * Hiển thị duy nhất các mặt sườn răng tiếp xúc dạng surface vỏ mỏng 2 mặt (`THREE.DoubleSide`, `pinionSurfMesh.visible = true; gearSurfMesh.visible = true;`).
     * Cho phép kỹ sư nhìn xuyên thấu vào từng đường sinh thân khai, kiểm tra tiếp xúc liên hợp không bị che khuất bởi thân bánh răng.
   - **Phương Án 2: `[📏 Thước Đo Khe Hở]` (`#btnToggleClearanceGauge`)**:
     * Hiển thị bảng điều khiển nổi HUD bán trong suốt (`#hudClearanceGauge`) với hiệu ứng làm mờ nền (backdrop-filter blur).
     * Đo đạc định lượng số học thời gian thực:
       - **Khe hở sườn làm việc ($\Delta$)**: $\Delta = 0.000\text{ mm}$ tại vị trí ăn khớp danh nghĩa chuẩn lý thuyết.
       - **Đèn báo trạng thái trực quan**: `🟢 TIẾP XÚC` khi $\Delta \le 0.015\text{ mm}$, `🟡 HỞ RĂNG (BACKLASH)` khi tách khớp và `🔴 GIAO NHAU (INTERFERENCE)` nếu có va chạm âm.
       - **Khe hở sườn đối diện**: $0.000\text{ mm}$ (danh nghĩa CAD CAM).
       - **Khe hở chân răng ($c$)**: $c = 0.200 \cdot m_{mn} = 2.000\text{ mm}$ (khớp chuẩn ISO 23509).
       - **Vị trí đo đạc**: Vành răng trung bình $R_m = 279.8\text{ mm}$.
       - **Con trỏ 3D Laser Marker (`this.contactMarker`)**: Một hình cầu phát sáng (Emerald glow sphere) đặt tại tọa độ tiếp xúc $(R_m \cos\delta_1, R_m \sin\delta_1, 0)$ định vị chính xác vị trí đo đạc trong không gian 3D.
   - **Phương Án 3: `[✂️ Mặt Cắt Ăn Khớp]` (`#btnToggleSectionCut`)**:
     * Sử dụng mặt phẳng cắt cục bộ GPU Three.js (`renderer.localClippingEnabled = true; THREE.Plane(Vector3(0, 0, -1), 0)`).
     * Bổ dọc toàn bộ cặp bánh răng qua mặt phẳng ăn khớp $Z = 0$, để lộ mặt cắt 2D của các răng đang ăn khớp liên hợp, cho phép nhìn rõ khe hở chân răng $c$ và biên dạng ăn khớp mà không giảm hiệu năng đồ họa.
3. **Hiệu ứng giao diện & Khả năng phối hợp (Active State Styling)**:
   - Nút 1 khi bật: Nền xanh dương `#0284c7`, viền `#38bdf8`, đổi nhãn `👁️ Đang Hiện Mặt Bên`.
   - Nút 2 khi bật: Nền xanh lục `#059669`, viền `#34d399`, đổi nhãn `📏 Đang Đo Khe Hở`.
   - Nút 3 khi bật: Nền tím `#7c3aed`, viền `#a78bfa`, đổi nhãn `✂️ Đang Cắt Ăn Khớp`.
   - Khi tắt: Tự động trở về trạng thái nút thứ cấp tiêu chuẩn `btn-secondary`.
   - Cả 3 phương án phối hợp hoàn hảo với các tính năng: Nhích từng chút một (`btn3DStepFwd`, `btn3DStepBack`), xoay tự do 360° (`OrbitControls`), đổi góc nhìn (`sel3DViewPreset`), bật/tắt khung dây (`btnToggleWireframe`).




