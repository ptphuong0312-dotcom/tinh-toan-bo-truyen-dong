# QUY TRÌNH KỸ THUẬT: XÂY DỰNG WEB APP TÍNH TOÁN CƠ KHÍ THAY THẾ MITCALC

## 1. MỤC TIÊU & ĐỊNH HƯỚNG
Chuyển đổi các mô-đun tính toán cơ khí phức tạp chạy trên Excel (.xls/.xlsb) sang ứng dụng Web App hiện đại, chạy trực tiếp trên trình duyệt, không phụ thuộc vào Microsoft Office, không cần cài đặt Node.js hay phần mềm phụ trợ, đáp ứng tính di động (Portability) 100%.

## 2. QUY CHUẨN KIẾN TRÚC CLIENT-SIDE PORTABLE & ZERO-DEPENDENCY
1. **100% Client-Side Pure Execution**: Toàn bộ công thức tính toán toán học (Involute, Newton-Raphson solver), động cơ sức bền (ISO 6336, AGMA 2001), dữ liệu vật liệu và dung sai phải chạy hoàn toàn trên trình duyệt người dùng với độ trễ bằng 0 (zero latency).
2. **Khởi động 1-Click & CORS-Free Single Bundle (`js/mitcalc-engine.bundle.js`)**:
   - Trình duyệt chặn `import` giữa các file JS khi mở qua giao thức `file:///`. Bắt buộc đóng gói toàn bộ engine, dữ liệu vật liệu 51 loại và giao diện vào một file JavaScript thuần `js/mitcalc-engine.bundle.js` (Classic Script, zero-import).
   - Nhờ đó, người dùng mở trực tiếp tệp `index.html` hoặc chạy `CHAY_WEBAPP.bat` trên bất kỳ máy tính nào đều hoạt động tức thì 100% offline mà không cần HTTP server hay Python.
3. **Quy chuẩn giao diện Accordion tập trung & Mặc định thu gọn (Default-Collapsed Accordion)**:
   - 100% các phân mục tính toán khi mở trang đều ở trạng thái đóng gọn (`calc-section collapsed` với biểu tượng `▶`). Nhấp vào bất kỳ đâu trên thanh tiêu đề hoặc mũi tên để mở rộng (`▼`).
   - Cung cấp sẵn 2 nút điều khiển toàn cục: **"📂 Mở Rộng Tất Cả"** và **"📁 Thu Gọn Tất Cả"**.
   - Thanh Executive Summary Banner ở trên cùng hiển thị tức thì trạng thái an toàn hình học, khoảng cách trục $a_w$, tỉ số truyền $i$, hệ số trùng khớp $\varepsilon_\alpha$, và chiều dày đỉnh răng $s_{a1}^*$.
4. **Quy chuẩn đồ họa biên dạng răng chuẩn công nghiệp (Industrial Involute & Conjugate Meshing)**:
   - Biên dạng răng 2D Canvas sử dụng hệ phương trình thân khai chuẩn xác $r(\theta) = r_b \sqrt{1 + \theta^2}$ với góc quay $\phi = \theta - \text{inv}(\alpha)$, đối xứng hoàn hảo qua đường phân giác cung răng.
   - Vùng lượn chân răng (trochoid / fillet curve) tiếp tuyến mượt mà từ vòng cơ sở $r_b$ hoặc vòng chia xuống đáy rãnh chân răng $r_f$, đáy rãnh nối bằng cung tròn đáy $r_f \cdot \Delta\theta$.
   - Bù góc pha ăn khớp ban đầu $\Delta\phi_2 = \frac{\pi}{z_2}$ (bánh 1 chĩa đỉnh răng vào đúng rãnh răng bánh 2) để hai bề mặt thân khai tiếp xúc chuẩn xác tại tâm ăn khớp $C$ trên vòng lăn $d_w$, không bị va chạm đỉnh đối đỉnh.
   - Lược bỏ hoàn toàn các đường tròn đồng tâm phụ đè ngang thân răng trên bản vẽ, chỉ giữ lại đường nét đứt vòng lăn $d_w$, tâm ăn khớp $C$ màu đỏ, lỗ trục có then và tâm chữ thập kỹ thuật.
5. **Quy chuẩn phạm vi phân mục chuẩn MITCalc 1.74**:
   - Bảo tồn trọn vẹn 12 phân mục cốt lõi (1, 2, 3, 4, 5, 6, 7, 11, 13, 14, 17, 18) tương ứng 205 dòng thông số kỹ thuật chuẩn trích xuất 100% từ `C:\MITCalc\gear1\Gear1_01.xlsb`.
   - Phục hồi Mục 18.0: Tính phụ trợ ($i_z, i_n, P_w, K_{H\beta}$ theo Method C, hệ số tập trung ứng suất rãnh mài $Y_{Sg}$).
   - Lược bỏ hoàn toàn các phần lực và ứng suất uốn/tiếp xúc không cần thiết (8, 9, 10, 12, 15, 16) theo chỉ đạo của người dùng.

## 3. CÁC BƯỚC THỰC HIỆN CUỐN CHIẾU CHO TỪNG MODULE
Khi thực hiện từng module tính toán cơ khí:
1. **Bước 1: Trích xuất dữ liệu gốc từ MITCalc**:
   - Mở tệp `.xlsb` qua PowerShell COM automation (`Excel.Application`).
   - Trích xuất toàn bộ Named Ranges (`XM_`, `XS_`, `XC_`), công thức tại `Calculation` sheet, bảng vật liệu tại `Material`, bảng tiêu chuẩn tại `Tables`.
2. **Bước 2: Chuẩn hóa công thức & Viết Engine tính toán**:
   - Viết các hàm giải số học chuẩn xác (đặc biệt các hàm siêu việt như Involute).
   - Kiểm thử chéo (Cross-validation) kết quả tính toán với tệp Excel mẫu với sai số $< 0.01\%$.
3. **Bước 3: Xây dựng giao diện công nghệ cao (Engineering UI)**:
   - Áp dụng cấu trúc Accordion mặc định đóng gọn.
   - Bố trí 4 tab chính: Bảng tính hình học & ăn khớp, Mô hình 2D Canvas, Dò tìm khoảng cách trục (Section 14), Tra cứu 51 loại vật liệu.
4. **Bước 4: Kiểm thử chéo QC đa kịch bản (Zero-Tolerance Multi-Case QC)**:
   - Đảm nhận vai trò kép: Chuyên gia Tính toán Bánh răng & Trưởng nhóm QC.
   - Chạy bộ test suite tự động hóa `MITCalc-WebApp/tests/qc_gear_multi_case_suite.py` (hoặc `KIEM_TRA_CHEO_QC.bat`).
   - Kiểm tra tối thiểu 5 kịch bản (tiêu chuẩn, dịch chỉnh góc dương, răng nghiêng, bánh nhỏ cắt lẹm, tỷ số truyền lớn).
   - Nghiệm thu khi 100% các phép đo hình học và kích thước kiểm tra đạt sai số $\Delta = 0.0000$.
5. **Bước 5: Đồng bộ tri thức & Cập nhật Master Rules**:
   - Cập nhật tài liệu kỹ thuật, bổ sung vào `walkthrough.md`, `GEMINI.md`, `docs/OPTIMIZATION_HISTORY.md`.
