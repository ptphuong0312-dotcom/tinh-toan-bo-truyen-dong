# KỊCH BẢN THAO TÁC (WORKFLOW): TỐI ƯU TOÀN DIỆN THEN HOA THÂN KHAI (INVOLUTE SPLINES)
**Module**: `modules/involute-splines`  
**Chủ sở hữu**: `SirPhuong`  
**Tiêu chuẩn**: DIN 5480, ISO 4156, ANSI B92.1, ANSI B92.2M, CSN 4950

---

## 1. MỤC TIÊU & BỐI CẢNH
Kịch bản này chuẩn hóa toàn bộ quy trình:
1. Xếp hạng 17 hệ tiêu chuẩn và thiết lập DIN 5480 - 30° làm chuẩn mặc định.
2. Đồng nhất hệ số dịch chỉnh biên dạng $x_2 = x_0$ khi người dùng tinh chỉnh.
3. Thể hiện trung thực bán kính bo mép đỉnh răng $r_a = r_a^* \cdot m$ ($r_{a2}^* = 0.16 \div 0.20$) trên Canvas 2D và CAD DXF.
4. Loại bỏ các phần thừa (nút DXF Header, Summary Cards Ribbon) để tối ưu không gian hiển thị.
5. Menu dropdown luân chuyển module tức thì cạnh nút "🏠 Trang Chủ".
6. Xuất bản vẽ CAD DXF (Assembly, Shaft, Hub) đường bao khép kín 360° và bảng thông số tách cột (118mm/82mm) triệt tiêu 100% lỗi đè chữ trong AutoCAD.

---

## 2. CÁC BƯỚC TRIỂN KHAI KỸ THUẬT

### Bước 1: Xếp Hạng & Thiết Lập Tiêu Chuẩn Mặc Định
- Cập nhật `splines-data.js`: Mỗi mục trong `std_types` có tiền tố số thứ tự `[1]...[17]` kèm sao `⭐⭐⭐ / ⭐⭐ / ⭐`.
- Trong `splines-ui.js`: `elStdType.value = '14'` (DIN 5480), nạp các hệ số tiêu chuẩn ban đầu ($h_a^* = 0.45, h_f^* = 0.65, r_{a2}^* = 0.16$).

### Bước 2: Đồng Nhất Hệ Số Dịch Chỉnh $x_0 \rightarrow x_2$
- Thêm checkbox `#syncX0X2Check` "Đồng nhất (x₂=x₀)" tại hàng 1.10.
- Khóa `#x2Input` khi tích chọn. Lắng nghe sự kiện `input` và `change` trên `#x0Input`:
  ```javascript
  if (this.elSyncX0X2 && this.elSyncX0X2.checked && this.elX2) {
      this.elX2.value = this.elX0.value;
  }
  ```
- Loại bỏ các lệnh ghi đè cưỡng bức $x_0, x_2$ trong chu trình `recalculate()`.

### Bước 3: Bo Đỉnh Răng $r_a$
- Trong `splines-canvas.js` và `splines-dxf.js`:
  Khi $r_a > 0.01$, tạo các điểm bo tròn mép đỉnh răng:
  ```javascript
  secPts.push([rTip - ra * 0.3, -(phiTip - (ra * 0.4) / rTip)]);
  secPts.push([rTip, -(phiTip - (ra * 0.9) / rTip)]);
  secPts.push([rTip, 0.0]);
  secPts.push([rTip, phiTip - (ra * 0.9) / rTip]);
  secPts.push([rTip - ra * 0.3, phiTip - (ra * 0.4) / rTip]);
  ```

### Bước 4: Tinh Giản Giao Diện & Thêm Menu Dropdown Module
- Xóa `<div class="summary-ribbon">` và nút DXF trong header.
- Thêm `.btn-dropdown-toggle` và `.module-dropdown-menu` vào `.header-actions`. Bắt sự kiện click để bật/tắt menu và đóng khi nhấp ra ngoài.

### Bước 5: Tái Thiết Lập Xuất CAD DXF Khép Kín 360° Không Đè Chữ
- Tạo closed polyline 360° gồm toàn bộ $z$ răng cho trục và lỗ.
- Bổ sung vòng tròn lỗ trục cho Trục và vòng tròn ngoài cho Moay-ơ.
- Bảng thông số: Khung 200mm, Cột 1 rộng 118mm, Cột 2 rộng 82mm, vạch phân cách dọc tại $x_0 + 118$, cỡ chữ 2.5mm.

### Bước 6: Đóng Gói Bundle & Kiểm Thử Tự Động
- Chạy `python tools/bundle_splines.py` cập nhật `splines-engine.bundle.js`.
- Chạy `python -u scratch/test_splines_e2e.py` kiểm thử Playwright tự động đảm bảo 100% PASS và 0 lỗi console.
