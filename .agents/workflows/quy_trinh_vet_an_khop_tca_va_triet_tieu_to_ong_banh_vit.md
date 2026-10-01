# QUY TRÌNH THIẾT KẾ VẾT ĂN KHỚP TIẾP XÚC (TCA) & TRIỆT TIÊU LỖ HỔNG TỔ ONG TRÊN MÔ HÌNH 3D BÁNH VÍT 2
**Mục tiêu**: Xóa bỏ hoàn toàn 40 lỗ thủng xuyên thấu nan quạt trên mặt đầu Bánh Vít 2, tạo khối Solid đúc đặc kín nước 100%, đồng thời tích hợp trọn vẹn cơ chế & thanh điều khiển Vết Ăn Khớp (TCA - Tooth Contact Analysis) đồng bộ 1-to-1 với Module Bánh Răng Trụ và Bánh Răng Côn.

---

## 1. Chẩn Đoán Hai Lỗi Sai Mô Phỏng Trực Quan
1. **Lỗi "Tổ Ong" (Honeycomb / Lattice Void Error)**:
   - Trong `worm-3d-generator.js`, mặt đầu tại $z = \pm b_{2H}/2$ chỉ sinh tam giác cho quạt nan của thân răng, bỏ quên hoàn toàn khoảng trống rãnh răng từ chân răng xuống lỗ trục `rBore2`.
   - Kết quả: Để lộ 40 khe hở nan quạt xuyên thấu, nhìn như nan hoa xe đạp hoặc tổ ong.
2. **Thiếu Vết Ăn Khớp Tiếp Xúc TCA**:
   - Thiếu hộp chọn kiểu tiếp xúc `selContactTheoryMode` trên thanh công cụ 3D.
   - Thiếu vi lượng dịch chuyển tiếp xúc ăn khớp `dThetaKiss` trên các mặt bên sườn răng khi bật chế độ "Chỉ Mặt Bên" (`Flank-Only`).

---

## 2. Giải Thuật Mặt Đầu Đúc Liền Khối 100% (Solid Watertight Annular Disk Engine)
1. **Mặt thân răng**:
   - Quét $m = 0 \dots ptsR - 1$ từ chân răng lên đỉnh răng:
   - Dựng dải tứ giác phẳng nối giữa sườn trái `t.rFlankL` và sườn phải `t.rFlankR`:
     * Với $z = -halfB$ (normal $-Z$): `pushTri(pL0, pR1, pR0)` và `pushTri(pL0, pL1, pR1)`.
     * Với $z = +halfB$ (normal $+Z$): `pushTri(pL0, pR0, pR1)` và `pushTri(pL0, pR1, pL1)`.
2. **Vành khuyên thân đĩa (Annular Wheel Body)**:
   - Nối chân răng và đáy rãnh xuống vòng tròn lỗ trục $r_{\text{Bore2}}$:
     * *Tứ giác A (dưới thân răng)*: Nối `[t.rFlankL[0], t.rFlankR[0]]` xuống các điểm lỗ trục `[pB_L, pB_R]`.
     * *Tứ giác B (dưới rãnh răng)*: Nối `[t.rFlankR[0], tNext.rFlankL[0]]` xuống các điểm lỗ trục `[pB_R, pB_nextL]`.
3. **Mặt trụ lỗ trục trong (Inner Bore Cylinder)**:
   - Nối $2 \cdot z_2$ điểm lỗ trục từ mặt trước $z = -halfB$ tới mặt sau $z = +halfB$:
   - Pháp tuyến hướng tâm $-e_r$ chính xác, khớp tuyệt đối 100% tọa độ với hai mặt đầu.

---

## 3. Giải Thuật Vết Ăn Khớp Tiếp Xúc TCA (Tooth Contact Analysis)
1. **Giao diện điều khiển (HTML & UI Controller)**:
   - Thêm dropdown `selContactTheoryMode` cạnh nút `btnToggleFlankOnly`:
     * `theory`: `📏 Lý Thuyết (Đường Tiếp Xúc Conjugate)`.
     * `crowning`: `🔵 Thực Tế Xưởng (Vết Elip Crowning)`.
   - Bắt sự kiện `change` gọi `visualizer3D.setContactMode(mode)`.
2. **Vi lượng dịch chuyển tiếp xúc `dThetaKiss`**:
   - Khi `surfaceOnly = true`:
     * Nếu `mode === 'crowning'`: $K_{\text{crown}} = \max(0, 1 - 2.5 u^2)$ với $u = z / \text{halfB}$, $d\Theta_{\text{kiss}} = \frac{0.0028 \cdot m_x \cdot K_{\text{crown}} - 0.0012 \cdot m_x \cdot (1 - K_{\text{crown}})}{r_2}$.
     * Nếu `mode === 'theory'`: $d\Theta_{\text{kiss}} = \frac{0.0022 \cdot m_x}{r_2}$.
   - Áp dụng vào sườn răng bánh vít:
     * Sườn phải: $\theta_R = \theta_{\text{base}} + p.\theta_R + d\Theta_{\text{kiss}}$
     * Sườn trái: $\theta_L = \theta_{\text{base}} + p.\theta_L - d\Theta_{\text{kiss}}$
3. **Tối ưu cự ly Camera Preset Mesh Zone**:
   - Cự ly $d_{\text{mesh}} = 1.15 \cdot \max(b_{2H}, 8 m_n) \approx 42\text{ mm}$, tiêu cự đặt tại $(0, -a + d_1/2, 0)$, cho độ nét phóng to cực đại.

---

## 4. Nghiệm Thu & Đóng Gói
1. Chạy đóng gói: `python tools/bundle_all.py`.
2. Chạy kiểm thử Playwright: `python tools/test_worm_contact_and_solid.py`.
3. Kiểm tra ảnh chụp:
   - `worm_solid_iso_no_honeycomb.png`: Solid đặc liền khối, 0% tổ ong.
   - `worm_solid_wheel_face_solid.png`: Mặt bên đúc đặc 100%.
   - `worm_flank_contact_theory_mesh.png`: Đường tiếp xúc liên hợp lý thuyết.
   - `worm_flank_contact_crowning_mesh.png`: Vết tiếp xúc hình elip crowning xưởng chế tạo.
