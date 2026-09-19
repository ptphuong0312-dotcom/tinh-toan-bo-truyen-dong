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
