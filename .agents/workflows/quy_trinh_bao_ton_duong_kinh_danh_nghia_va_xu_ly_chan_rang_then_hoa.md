# QUY TRÌNH BẢO TỒN ĐƯỜNG KÍNH DANH NGHĨA & XỬ LÝ CHÂN RĂNG THEN HOA THÂN KHAI (INVOLUTE SPLINES)
**Mục tiêu**: Hướng dẫn quy trình chuẩn hóa hình học then hoa thân khai khi thay đổi hệ số dịch chỉnh $x_0$, đảm bảo đường kính danh nghĩa không bị dịch sai lệch, không xảy ra hiện tượng đâm xuyên trục - lỗ, chân răng trục mượt mà ở dải dịch chỉnh lớn ($x_0 = 0.6$) và kiểm thử tự động đạt 110/110 PASS ($\Delta = 0.000000$).

---

## 1. Bản Chất Cơ Khí Then Hoa Thân Khai vs Bánh Răng
- **Bánh răng (Gears)**:
  - Khi $\Sigma x = x_1 + x_2 \ne 0$, khoảng cách trục thay đổi: $a_w = a \cos\alpha / \cos\alpha_w$.
  - Đường kính đỉnh $d_a$ phải tính toán lại theo hệ số dịch chỉnh và khe hở đỉnh răng $c^*$.
- **Then hoa thân khai (Involute Splines)**:
  - Đây là mối ghép đồng trục ($a_w = 0$), định tâm theo quy cách tiêu chuẩn (ISO 4156 / DIN 5480 / ANSI B92.1).
  - Các đường kính danh nghĩa ($d_{a0}, d_{f0}, D_i, D_{ri}$) là **CỐ ĐỊNH THEO TIÊU CHUẨN**, được tra cứu từ bảng `T_spl2_Name`.
  - Hệ số dịch chỉnh $x_0$ và $x_2$ **CHỈ DÙNG ĐỂ THAY ĐỔI CHIỀU DÀY RĂNG TRÊN VÒNG CHIA ($s_0, s_2$) VÀ KHE HỞ CẠNH RĂNG (BACKLASH)**:
    $$s_0 = \frac{\pi m}{2} + 2 x_0 m \tan\alpha, \quad s_2 = \frac{\pi m}{2} + 2 x_2 m \tan\alpha$$
  - **TUYỆT ĐỐI KHÔNG ĐƯỢC cộng dồn $+2 x_0 m$ vào $d_{a0}, d_{f0}$ và $-2 x_0 m$ vào $D_i, D_{ri}$**.
  - Việc cộng dồn sai trước đó là nguyên nhân khiến ISO 4156 bị đâm xuyên khi $x_0 \ge 0.2$ (khi $x_0 = 0.4 \implies$ đỉnh lỗ đâm xuyên qua đáy trục $6.85\text{ mm}$).

---

## 2. Các Bước Thực Hiện Chuẩn Hóa

### Bước 1: Bảo Toàn Đường Kính Danh Nghĩa Trong Engine Tính Toán (`splines-calc.js`)
1. Trong hàm `calculate()`:
   - Gọi `getStandardSplineDefaults(stdTypeId, m, z, alfaRad)` để lấy bộ 4 đường kính danh nghĩa gốc ($d_{a0}, d_{f0}, D_i, D_{ri}$).
   - Không cộng/trừ bất kỳ lượng $2 x_0 m$ hay $2 x_2 m$ nào vào 4 đường kính này.
   - Các kích thước đo kiểm tra qua bi $M_0, M_2$ và pháp tuyến chung $W_0, W_2$ được tính toán chính xác có xét đến lượng dịch chỉnh $x_0, x_2$.

### Bước 2: Xử Lý Thuật Toán Bo Chân Răng Khi $x_0 = 0.6$ (`generateShaftSectorPoints`)
1. Khi $x_0 = 0.6$, răng trục rất dày, khoảng trống chân răng còn lại $w_{\text{avail}} = r_{\text{root}} \cdot (\tau - \theta_{\text{flank}})$ cực kỳ hẹp ($\approx 0.062\text{ mm}$).
2. Giới hạn bán kính góc lượn dao:
   ```javascript
   let maxAllowedRf = w_avail * 0.85;
   let rf_effective = Math.min(rf, maxAllowedRf);
   ```
3. Lặp giảm bán kính $r_f$ tối đa 20 lần đến ngưỡng an toàn $0.01 \cdot m$ để tìm điểm tiếp xúc.
4. Khống chế góc tiếp xúc chân răng:
   ```javascript
   let th_root_r = Math.min(tau - 0.0005, C.theta + d_th_root);
   let d_theta = Math.max(0, tau - th_root_r);
   ```
   Bảo đảm $d\_\theta$ luôn không âm, triệt tiêu hoàn toàn góc quay ngược và hiện tượng tự đan chéo thân khai.

### Bước 3: Đóng Gói Bundle JavaScript Offline
1. Chạy công cụ bundle:
   ```powershell
   python tools/bundle_splines.py
   ```
2. Đảm bảo file `modules/involute-splines/js/splines-engine.bundle.js` được tạo mới và không phụ thuộc bất kỳ module ES6 nào (CORS-free 100%).

### Bước 4: Kiểm Thử Toàn Diện Bằng Script Excel COM Live Audit
1. Chạy kịch bản kiểm thử:
   ```powershell
   python tools/test_splines_qc.py
   ```
2. Kiểm tra 9 ca thử nghiệm trên 17 hệ tiêu chuẩn (ISO 4156 Flat/Fillet, ISO 37.5°, ISO 45°, DIN 5480, ANSI B92.1 với các nấc $x_0 = 0.0, 0.2, 0.4, 0.6$).
3. **Tiêu chuẩn nghiệm thu**: 110/110 phép tính PASS 100.0% với $\Delta = 0.000000$ so với MITCalc 1.74 Excel COM.

### Bước 5: Kiểm Tra Trực Quan Đồ Họa 2D Canvas & CAD DXF
1. Sử dụng Playwright chụp ảnh Canvas khi $x_0 = 0.6$:
   ```powershell
   python scratch/capture_splines.py
   ```
2. Quan sát trực tiếp:
   - Răng trục ăn khớp lọt khít trong rãnh lỗ moay-ơ.
   - Khe hở đỉnh trục - đáy rãnh lỗ và đỉnh lỗ - đáy trục luôn dương và an toàn.
   - Chân răng trục mượt mà, cung bo tròn $C^1$ hoàn hảo không có góc gãy.
   - Bi đo $M$ tiếp xúc êm ái trên sườn thân khai.
