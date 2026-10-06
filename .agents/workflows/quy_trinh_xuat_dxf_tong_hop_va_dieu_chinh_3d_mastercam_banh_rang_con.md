# Kịch Bản: Quy Trình Xuất DXF Tổng Hợp & Điều Chỉnh Mô Phỏng 3D Mastercam Bánh Răng Côn

**Tác giả**: AI Assistant (theo chỉ đạo của `SirPhuong`)  
**Ngày ban hành**: 06/10/2026  
**Áp dụng cho**: Module Bánh Răng Côn (ISO 23509 / DIN 3965 / DIN 3971)  

---

## 1. Mục Tiêu & Yêu Cầu Kỹ Thuật
1. **Thích ứng chiều rộng vành răng $b$**:
   - Tự động gợi ý $b_{\text{rec}} = \min(b_{\max}, \text{round}(0.3458 \cdot R_e \cdot 10)/10)$ khi thay đổi hình học.
   - Cho phép người thiết kế sửa tay tùy ý, bảo toàn giá trị sửa tay khi tính toán các thông số không ảnh hưởng hình học.
   - Cung cấp nút `[ ⚡ Khuyên dùng ]` (`#btn_rec_b`) để phục hồi giá trị chuẩn 1-Click.
2. **Xuất 1 File DXF Duy Nhất Chứa Toàn Bộ Bản Vẽ 2D**:
   - Release 12 (AC1009) tương thích AutoCAD 2000 - 2026, SolidWorks, Mastercam.
   - Tích hợp cả 6 Block:
     * BLOCK 0: Mặt cắt trục bổ dọc lắp ghép ISO 23509 ($X = -650, Y = 0$).
     * BLOCK 1: Cặp ăn khớp 2D nón ngoài $R_e, m_{et}$.
     * BLOCK 2: Cặp ăn khớp 2D nón trong $R_i, m_{it}$.
     * BLOCK 3: Cặp rãnh răng đồng tâm Bánh dẫn 1 (Pinion) kèm kích thước $\Delta Z_{\text{cut}1} = b / \cos\delta_1$.
     * BLOCK 4: Cặp rãnh răng đồng tâm Bánh bị dẫn 2 (Gear) kèm kích thước $\Delta Z_{\text{cut}2} = b / \cos\delta_2$.
     * BLOCK 5: Bảng thông số chế tạo gia công DXFTables & hướng dẫn CAM.
3. **Mô Phỏng 3D WebGL & Xuất File 3D (STEP / STL / OBJ / IGES)**:
   - Loại bỏ lưới grid để giữ không gian sạch và tập trung.
   - Đảo Bánh 2 ngửa lên ("ngửa lên" với moay-ơ ở đáy $Y < 0$, răng hướng lên đỉnh Apex $(0, 0, 0)$).
   - Đỉnh chóp nón Apex của cả 2 bánh răng luôn cố định tại $(0, 0, 0)$.
   - Dựng hệ trục tọa độ Mastercam $(X, Y, Z)$ sắc nét tại $(0, 0, 0)$ (Mũi tên đỏ $+X$, xanh lá $+Y$, xanh cyan $+Z$, chữ cái X, Y, Z, đường tâm nâu, mốc gốc vàng).
   - Bảo toàn 100% màu nền tối và màu sắc bánh răng ban đầu.

---

## 2. Các Bước Thực Hiện

### Bước 1: Điều Khiển Chiều Rộng Vành Răng $b$ Trong UI
```javascript
// bevel-ui.js
this.isManualB = false;

// Trong initInputs:
if (key === 'b') {
    this.isManualB = true;
} else if (['z1', 'z2', 'mmn', 'i_req', 'Sigma', 'gearingType', 'beta'].includes(key)) {
    this.isManualB = false;
}

// Trong calculate():
if (!this.isManualB) {
    const gPreB = BevelCalcEngine.calculate(this.inputs);
    const Re = gPreB.Re || 338.32;
    const met = gPreB.met || 10.0;
    const b_max = Math.min(0.35 * Re, 10.0 * met);
    const b_rec = Math.min(b_max, Math.round(0.3458 * Re * 10) / 10);
    if (b_rec > 0 && Math.abs((this.inputs.b || 0) - b_rec) > 0.05) {
        this.inputs.b = b_rec;
        const inp_b = document.getElementById('inp_b');
        if (inp_b) inp_b.value = b_rec.toFixed(1);
    }
}
```

### Bước 2: Tích Hợp Kích Thước $\Delta Z_{\text{cut}}$ Vào Cặp Rãnh Răng Đồng Tâm DXF
```javascript
// bevel-dxf-exporter.js
const cosD1 = Math.cos(delta1);
const cosD2 = Math.cos(delta2);
const deltaZ_cut1 = b / cosD1;
const deltaZ_cut2 = b / cosD2;

// Block 3:
addText(`Khoang cach giua 2 diem cat cua 2 mat phang tren truc Z: delta_Z_cut1 = b / cos(delta1) = ${deltaZ_cut1.toFixed(3)} mm`, cx_slot1 - 95, rvae1 + 15, 3.2, 'DIMENSIONS');
addLinearDim(cx_slot1 + 75, cy_slot1 + rvae1, cx_slot1 + 75, cy_slot1 + rvae1 - deltaZ_cut1, `delta_Z_cut1=${deltaZ_cut1.toFixed(3)}`, 3.0, 'DIMENSIONS');

// Block 4:
addText(`Khoang cach giua 2 diem cat cua 2 mat phang tren truc Z: delta_Z_cut2 = b / cos(delta2) = ${deltaZ_cut2.toFixed(3)} mm`, cx_slot2 - 95, rvae2 + 15, 3.2, 'DIMENSIONS');
addLinearDim(cx_slot2 + 75, cy_slot2 + rvae2, cx_slot2 + 75, cy_slot2 + rvae2 - deltaZ_cut2, `delta_Z_cut2=${deltaZ_cut2.toFixed(3)}`, 3.0, 'DIMENSIONS');
```

### Bước 3: Đảo Ngửa Bánh 2 & Tọa Độ Mastercam Trong 3D
```javascript
// Ma trận biến đổi Bánh 2 ngửa lên (det = +1):
const mGear = new THREE.Matrix4().set(
    1,  0,  0, 0,
    0,  0, -1, 0,
    0,  1,  0, 0,
    0,  0,  0, 1
);
geo2.applyMatrix4(mGear);

// Đồng bộ động học:
this.gearAngle = this.initialGearAngle + this.pinionAngle / this.gearRatio;
```

### Bước 4: Đóng Gói Bundle & Kiểm Thử Tự Động
1. Chạy `python tools/bundle_all.py`.
2. Kiểm tra `python modules/bevel-gear/tests/test_bevel_3d.py`.
3. Kiểm tra bằng mắt ảnh chụp từ viewport: `container3D_front.png` và `container3D_iso.png`.
