# Quy Trình Đồng Bộ Giao Diện 1-to-1 Chuẩn MITCalc 1.74 & Trích Xuất Vector Assets (Workflow)

## Mục Đích
Hướng dẫn từng bước thực hiện đồng bộ giao diện, trích xuất tài nguyên đồ họa vector từ file gốc `.xlsb`, thiết lập biểu đồ tọa độ Descartes 2D và bổ sung đầy đủ các phân mục 15.0 & 16.0 chuẩn hóa theo đúng bản gốc MITCalc 1.74.

---

## Bước 1: Trích Xuất Tài Nguyên Đồ Họa Vector Gốc Từ File `.xlsb`
1. **Mở file `.xlsb` như kho lưu trữ zip**:
   - Sử dụng thư viện `zipfile` trong Python để quét thư mục `xl/media/`.
   - Tìm kiếm các file `.wmf` hoặc `.png` chứa hình minh họa của các mục (Section 4.0, Section 6.0, Section 16.0, CAD icons).
2. **Rasterize WMF siêu nét bằng Windows GDI+**:
   - Do các file WMF trong Office thiếu Aldus Placeable header chuẩn khiến PIL thông thường không mở được, sử dụng Windows GDI+ (`gdiplus.dll` qua `ctypes`).
   - Khởi tạo GDI+ session: `GdiplusStartup`, tải hình ảnh qua `GdipLoadImageFromFile`, lấy kích thước chuẩn qua `GdipGetImageDimension`.
   - Tạo bitmap đích với độ phân giải cao (ví dụ: chiều rộng 1200px), thiết lập chế độ khử răng cưa `SmoothingModeAntiAlias` và chất lượng nội suy `InterpolationModeHighQualityBicubic`.
   - Lưu ra file định dạng PNG chuẩn:
     * `mitcalc_bevel_sec4_geometry.png`
     * `mitcalc_bevel_sec6_dimensions.png`
     * `mitcalc_bevel_sec16_offset.png`
     * `image3.png`, `image4.png`, `image5.png`, `image7.png`

---

## Bước 2: Trình Diễn Đồ Họa Kép Ở Phân Mục 4.0
1. **Bố cục 2 khung song song**:
   - Khung trái: Sơ đồ hình học góc xoắn và kích thước nón chia.
   - Khung phải: Thẻ `<canvas id="bevelSec4ChartCanvas" width="460" height="280">` mô phỏng biểu đồ 2D Descartes của MITCalc (Chart 4181).
2. **Thuật toán vẽ biểu đồ lưới Descartes (`renderSec4Chart`)**:
   - Phạm vi hệ trục tọa độ: $X \in [-400, 400]$, $Y \in [-250, 250]$.
   - Lưới tọa độ màu xám nhạt mỗi bước 100 đơn vị trên nền vàng kem nhạt `#ffffe0`.
   - Vẽ đường bao mặt cắt nón dẫn và nón bị dẫn bổ dọc, hiển thị điểm ăn khớp tại $(d_{m1}/2, d_{m2}/2)$ và đường sinh nón tiếp xúc.

---

## Bước 3: Chuẩn Hóa Bảng Kích Thước Hình Học Phân Mục 6.0
1. **Nhúng hình vẽ kỹ thuật kích thước ISO 23509**:
   - Đặt `mitcalc_bevel_sec6_dimensions.png` ngay đầu Section 6.0.
2. **Bố cục bảng 7 cột chuẩn hóa**:
   - Cột 1: `#` (6.1 đến 6.39).
   - Cột 2: `Kích Thước Hình Học` (mô tả rõ ràng 3 mặt cắt: Ngoài - Giữa - Trong).
   - Cột 3: `Ký Hiệu` ($m_{et}, m_{mt}, m_{it}, R_e, R_m, R_i, d_e, d_m, d_i, d_{ae}, \dots$).
   - Cột 4: `Bánh Dẫn (Pinion 1) / Ngoài (Outer)`.
   - Cột 5: `Bánh Bị Dẫn (Gear 2) / Trung Bình (Middle)`.
   - Cột 6: `Mặt Trong (Inner)`.
   - Cột 7: `Đơn Vị` (mm, độ, răng).
   - Các dòng thuộc tính chung (6.25 - 6.32) sử dụng `colspan="3"` để căn giữa thanh thoát.

---

## Bước 4: Tích Hợp Phân Mục 15.0 & Phân Mục 16.0
1. **Section 15.0 (Auxiliary Calculations)**:
   - 15.1 Tính tỉ số truyền từ tốc độ: $n_1, n_2 \implies i$ kèm nút `[ OK ]` tự động nạp vào Mục 1.0 và tính lại.
   - 15.2 Tính công suất từ mô-men xoắn: $M_1, n_1 \implies P = \frac{M_1 \cdot n_1}{9550}$ kèm nút `[ OK ]`.
   - 15.3 Tính tỉ số truyền từ số răng: $z_1, z_2 \implies i$ kèm nút `[ OK ]`.
2. **Section 16.0 (Graphic output, CAD systems & Manufacturing Specification)**:
   - 16.1 Chọn hệ thống CAD: 4 tùy chọn với icon gốc.
   - 16.2 Thông số dao cắt & lượng dịch chỉnh gia công: $R_{\text{tool}} = 1.5 \cdot b$, $a_1, a_2, b_1, b_2$ và hình vẽ sơ đồ offset.
   - 16.3 Lệnh xuất: Nút chuyển sang Canvas 2D (`btn_draw_2d`) và nút tải DXF Release 12.
   - 16.4 Bảng thuộc tính BOM (Part Name, Specification, Material).
   - 16.5 Bảng thông số chế tạo DXFTables theo DIN 3965 / ISO 23509.

---

## Bước 5: Đóng Gói Bundle & Kiểm Thử Toàn Diện
1. **Đóng gói Bundle thuần**:
   - Chạy `python tools/bundle_all.py` cập nhật `bevel-engine.bundle.js`.
2. **Kiểm thử đa kịch bản (Multi-case QC)**:
   - Chạy `python modules/bevel-gear/tests/qc_bevel_multi_case_suite.py` xác nhận 120/120 pass $\Delta = 0.0000$.
3. **Kiểm thử tự động hóa E2E Playwright**:
   - Chạy `python tests/test_bevel_webapp.py` xác nhận 0 lỗi console, chuyển tab và các nút hoạt động 100% trơn tru.
