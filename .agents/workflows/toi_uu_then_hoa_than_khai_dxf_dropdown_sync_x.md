# KỊCH BẢN THAO TÁC (WORKFLOW): TỐI ƯU TOÀN DIỆN THEN HOA THÂN KHAI (INVOLUTE SPLINES)
**Module**: `modules/involute-splines`  
**Chủ sở hữu**: `SirPhuong`  
**Tiêu chuẩn**: DIN 5480, ISO 4156, ANSI B92.1, ANSI B92.2M, CSN 4950

---

## 1. MỤC TIÊU & BỐI CẢNH
Kịch bản này chuẩn hóa toàn bộ quy trình hoàn thiện module Then Hoa Thân Khai:
1. Sắp xếp thứ tự sạch [1] đến [17], thiết lập DIN 5480 - 30° làm chuẩn mặc định, loại bỏ sao ⭐ và chữ mô tả rườm rà.
2. Đồng nhất hệ số dịch chỉnh liên hợp $x_2 = -x_0$ (chuẩn MITCalc `SplinesI_01.xlsb` cell Z116 và cơ học bánh răng trong).
3. Triệt tiêu gờ bậc thang đỉnh răng Hub moay-ơ, bảo tồn cung tròn thuần khiết bán kính $r_{tip}$ và $r_{root}$.
4. Tối ưu thanh Header: bỏ nút DXF trùng lặp, bỏ Summary Ribbon, thêm menu dropdown chuyển nhanh 7 module (bao gồm Trục Vít - Bánh Vít, bỏ mục Hub).
5. Xuất bản vẽ CAD DXF đỉnh đáy bằng thực thể `ARC`, bi đo `CIRCLE`, kích thước đo bi $M$ và kích thước đo 2 bi $W_b$, bảng thông số mở rộng 200mm tách cột không đè chữ.

---

## 2. CÁC BƯỚC TRIỂN KHAI KỸ THUẬT

### Bước 1: Sắp Xếp Danh Mục Tiêu Chuẩn [1]..[17] Tối Giản
- Trong `splines-data.js`: Sắp xếp mảng `std_types` tăng dần theo số thứ tự `[1]...[17]`. Mục [1] DIN 5480 - 30° đưa lên đầu mảng.
- Loại bỏ toàn bộ emoji sao ⭐ và các cụm từ mô tả rườm rà.

### Bước 2: Dịch Chỉnh Liên Hợp $x_2 = -x_0$
- Thêm checkbox `#syncX0X2Check` "Liên hợp (x₂ = -x₀)" tại hàng 1.10.
- Khóa `#x2Input` (`disabled`) khi checkbox tích chọn.
- Đồng bộ tự động trong `bindEvents()` và `recalculate()`:
  ```javascript
  if (this.elSyncX0X2 && this.elSyncX0X2.checked && this.elX2) {
      const v0 = parseFloat(this.elX0.value || 0.0);
      this.elX2.value = (-v0).toFixed(4);
  }
  ```

### Bước 3: Khử Triệt Để Gờ Bậc Thang Đỉnh Răng Hub Moay-ơ
- Trong `splines-canvas.js` và `splines-dxf.js`:
  Xóa bỏ triệt để các điểm nội suy `r_tip + ra2 * 0.3` ở cả sườn trái và sườn phải.
  Đỉnh răng là cung tròn đồng tâm chuẩn bán kính $r_{tip}$, đáy rãnh là cung tròn bán kính $r_{root}$.

### Bước 4: Tinh Giản Giao Diện & Dropdown Menu 7 Module
- Xóa `<div class="summary-ribbon">` và nút DXF trong header.
- Menu dropdown gồm 7 module:
  1. Bánh Răng Trụ (Spur / Helical Gear)
  2. Bánh Răng Côn (Bevel Gear)
  3. Bánh Vít - Trục Vít (Worm Gear)
  4. Bánh Răng Hành Tinh (Planetary Gear)
  5. Bộ Truyền Đai (Belt Drive)
  6. Bộ Truyền Xích (Roller Chain Drive)
  7. Then Hoa Thân Khai (Involute Splines)

### Bước 5: Nâng Cấp Xuất CAD DXF Kỹ Thuật (ARC, CIRCLE, Kích Thước M & Wb)
- Dựng cung đỉnh răng và cung đáy rãnh bằng thực thể `ARC` (`addArc`).
- Dựng bi đo bằng thực thể `CIRCLE` trên layer `MEASUREMENT_PIN` có tâm chữ thập.
- Xuất kích thước đo bi $M$ qua đường tròn nét đứt `CIRCLE` trên layer `INSPECTION_DASH` và ghi chú text $M_0 / M_2$.
- Xuất kích thước khoảng cách 2 bi xa nhất $W_b$ của moay-ơ và pháp tuyến chung $W_0$ của trục trên layer `INSPECTION_DIM`.
- Bảng thông số: Khung 200mm, Cột 1 rộng 118mm, Cột 2 rộng 82mm, vạch phân cách dọc, cỡ chữ 2.5mm.

### Bước 6: Đóng Gói Bundle & Kiểm Thử Tự Động
- Chạy `python tools/bundle_splines.py` cập nhật `splines-engine.bundle.js`.
- Chạy kịch bản Playwright E2E đảm bảo 100% PASS và 0 console errors.
