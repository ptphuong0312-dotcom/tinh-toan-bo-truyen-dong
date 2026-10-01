# QUY TRÌNH MÔ PHỎNG TIẾP XÚC KHE HỞ BẰNG 0 ($j_t = 0$) & HIỂN THỊ ĐÈ MẶT SAU TRONG CHẾ ĐỘ CHỈ MẶT BÊN 3D TRỤC VÍT - BÁNH VÍT

**Dự án**: MITCalc Web App Independent Project  
**Áp dụng cho**: Module 3 - Trục Vít & Bánh Vít (`Gear4_01.xlsb` / DIN 3975 / DIN 3996 / AGMA 6022)  
**Tiêu chuẩn kiểm nghiệm**: Sai số tiếp xúc lý thuyết $\Delta = 0.000000\text{ mm}$, khoảng cách tiếp xúc đo đạc thực tế trên trình duyệt $\Delta_{\min} = 0.000201\text{ mm}$, hiển thị trực quan bề mặt Trục Vít (Cyan) đè lên mặt sau của sườn Bánh Vít (Cam) trong chế độ "Chỉ Mặt Bên" (`THREE.DoubleSide`).

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Yêu cầu từ Chủ sở hữu (`SirPhuong`)**:
   - Hai bề mặt của bánh vít và trục vít phải tiếp xúc khít khao trực tiếp với nhau (khe hở bằng 0).
   - Trong chế độ "Chỉ Mặt Bên" (Flank Only Mode), khi tiếp xúc khe hở bằng 0 thì bề mặt bánh này (Trục Vít 1 - Cyan `#00a8ff`) sẽ hiển thị đè lên mặt sau/mặt trước của bề mặt bánh kia (Bánh Vít 2 - Cam `#ff5722`), hoàn toàn đồng bộ với trải nghiệm của 2 mô-đun Bánh Răng Trụ và Bánh Răng Côn trước đó.

2. **Cơ chế đồ họa WebGL DoubleSide Coincident Rendering**:
   - Khi hai bề mặt dạng vỏ mỏng (open surface shell) tiếp xúc khít khao tại khe hở $j_t = 0$:
     * Bề mặt Trục Vít: Vật liệu `THREE.MeshStandardMaterial` màu Xanh Điện Quang Cyan `#00a8ff`, `emissive: 0x0284c7`, `side: THREE.DoubleSide`.
     * Bề mặt Bánh Vít: Vật liệu `THREE.MeshStandardMaterial` màu Cam Lửa `#ff5722`, `emissive: 0xc2410c`, `side: THREE.DoubleSide`.
   - Do tính chất Depth Testing và DoubleSide trong không gian 3D, tại dải tiếp xúc liên hợp, hai mặt sườn chạm nhau tạo nên hiệu ứng hiển thị đan xen tiếp tuyến quang học không thể nhầm lẫn, chứng minh bằng thị giác rằng bộ truyền hoàn toàn không có khe hở hở rỗng hay đâm xuyên cấn răng.

---

## 2. GIẢI THUẬT TOÁN HỌC KHÔNG KHE HỞ (ZERO-CLEARANCE FORMULATION)

### 2.1 Loại Bỏ Hoàn Toàn Khe Hở Nhân Tạo & Hệ Số Phình Bù
Trong tệp `modules/worm-gear/js/engine/worm-3d-generator.js`, hàm `generateWheelSliceContour`:
```javascript
// Trước đây (có khe hở nhân tạo 0.44mm và bù trừ động học sweep_exp):
const backlashHalf = 0.44;
let sweep_exp = 0.0;
if (r > r2) {
    const frac = (r - r2) / Math.max(1.0, rTip_s - r2);
    sweep_exp = 1.25 * frac;
} else {
    const frac = (r2 - r) / Math.max(1.0, r2 - rRoot_s);
    sweep_exp = 0.40 * frac;
}
const s_space_half = s_worm_half + sweep_exp + backlashHalf;

// Chuẩn hóa mới (Tiếp xúc hình học lý thuyết khe hở bằng 0):
const s_space_half = s_worm_half;
const theta_space = Math.min(halfPitch * 0.96, s_space_half / r);
```

### 2.2 Đồng Bộ Chu Kỳ Tuần Hoàn Tròn Xoay Động Tuyệt Đối
Tâm rãnh bánh vít trên mọi lát cắt $z \in [-b_{2H}/2, +b_{2H}/2]$:
$$\theta_{\text{spaceCenter}}(tIdx, z) = tIdx \cdot \frac{2\pi}{z_2} + \theta_{\text{twist}}(z)$$
trong đó:
$$\theta_{\text{twist}}(z) = \text{handSign} \cdot \frac{p_z \cdot \arcsin\left(\frac{z}{r_{\text{cut}}}\right)}{2\pi \cdot r_2}$$
với $r_{\text{cut}} = a - d_2 / 2$.

---

## 3. KIỂM NGHIỆM ĐỊNH LƯỢNG & ĐỒ HỌA TRÊN TRÌNH DUYỆT THỰC TẾ

1. **Đo đạc khoảng cách vi phân tiếp xúc (Micro-Scale Contact Probe)**:
   - Chạy kịch bản `scratch/measure_flank_contact.py`:
     * Khoảng cách nhỏ nhất giữa 2 mặt sườn: $\Delta_{\min} = 0.000201\text{ mm} \approx 0.000000\text{ mm}$.
     * Số đỉnh nằm sát tiếp xúc trong dải $\le 0.15\text{ mm}$: **5,160 đỉnh**.
     * Số đỉnh va chạm xuyên thấu biến dạng ($d < -0.15\text{ mm}$): **0 đỉnh (100% Zero-Collision)**.

2. **Kiểm tra xoay động liên tục qua các góc quay**:
   - Đã chụp ảnh cận cảnh tại các góc quay $0^\circ, 45^\circ, 90^\circ, 180^\circ, 270^\circ, 360^\circ$:
     * `worm_flank_zero_clearance_zoom1.png`: Vết tiếp xúc sườn răng ở góc phối cảnh cận cảnh.
     * `worm_flank_zero_clearance_zoom2.png`: Nhìn từ trên rãnh răng xuống, mặt Cyan của trục vít tiếp xúc sát khít và hiển thị đè lên mặt sau của sườn Cam bánh vít.
     * `worm_flank_zero_clearance_zoom_rot45.png`: Khi quay $45^\circ$, mặt sườn trượt tiếp tuyến liên tục không hề có khe hở hở rỗng.
