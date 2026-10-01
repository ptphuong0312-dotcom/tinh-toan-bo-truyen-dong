# Kịch Bản Quy Trình: Giải Thuật Bao Khớp Động Học Phay Lăn Trục Vít (Kinematic Hob Envelope Protocol) — Triệt Tiêu Tuyệt Đối Xuyên Thấu Răng Lân Cận ($j = \pm 1$) & Đảm Bảo Khớp Khít 360°

## 1. Mục Đích & Bối Cảnh
Khi kiểm tra mô hình 3D bộ truyền trục vít - bánh vít trong chế độ "Chỉ Mặt Bên" (`Flank-Only`), dù răng trung tâm (Tooth 0) đã tiếp xúc khít khao ($\Delta = 0.000000\text{ mm}$), các răng lân cận đang tiến vào hoặc thoát khỏi rãnh ren (Tooth 1 tại $+9^\circ$ và Tooth -1 tại $-9^\circ$) vẫn bị đâm xuyên sâu qua sườn sau của ren trục vít khoảng $0.527\text{ mm}$ (`media_1790828487952.png`). Quy trình này giải quyết triệt để hiện tượng trên bằng cách mô phỏng chính xác nguyên lý bao khớp động học của dao phay lăn trục vít (worm hob) trong công nghệ chế tạo cơ khí thực tế.

---

## 2. Nguyên Nhân Kỹ Thuật Cốt Lõi
1. **Rãnh ren trục vít dọc trục là thẳng và song song**:
   - Khoảng cách giữa các rãnh ren trục vít dọc theo trục $X$ là hằng số cố định: $p_x = \pi \cdot m_x = 13.391\text{ mm}$.
2. **Khoảng cách góc răng bánh vít xòe nan quạt ở bán kính lớn**:
   - Khi sao chép biên dạng Tooth 0 và xoay góc bước răng $\pm \frac{2\pi}{z_2} = \pm 9^\circ$ quanh tâm bánh vít, khoảng cách cung tròn ở bán kính đỉnh răng ($r \approx 90\text{ mm}$) đạt:
     $$s_{\text{chord}} = r \cdot \sin(9^\circ) \approx 14.08\text{ mm}$$
   - Lượng chênh lệch bước cực $(14.08 - 13.39) = +0.69\text{ mm}$ đẩy má ngoài của Tooth 1 và Tooth -1 lệch dọc trục $X$, khiến má bánh vít đâm xuyên trực tiếp vào sườn sau của ren trục vít $0.527\text{ mm}$.

---

## 3. Thuật Toán Bao Khớp Động Học Phay Lăn (Kinematic Hob Envelope Solver)
Trong thực tế xưởng chế tạo, bánh vít được gia công bằng dao phay lăn (worm hob) quay đồng bộ với bánh vít theo tỷ số truyền $i = z_2 / z_1$. Các lưỡi cắt của dao quét qua toàn bộ vùng ăn khớp $[-L/2, +L/2]$ và tự động phay vát phần vật liệu thừa xòe nan quạt khi răng tiến vào và thoát khỏi rãnh ren (inlet/outlet relief).

### Các bước thuật toán `computeConjugateFlankAngles(r, z, mc)`:
1. **Quét góc quay bánh vít $\theta_{\text{wheel}}$**:
   $$\theta_{\text{wheel}} \in [-\theta_{\max}, +\theta_{\max}], \quad \theta_{\max} = \arcsin\left(\frac{L/2 + 2 p_x}{r}\right)$$
2. **Góc quay liên hợp của trục vít**:
   $$\phi_{\text{worm}} = -\frac{\theta_{\text{wheel}}}{\text{ratio}}$$
3. **Giải điểm bất động tọa độ $X_{\text{world}}$ trên sườn ren trục vít**:
   $$\phi_{\text{rel}} = \phi_w - \phi_{\text{worm}} = \arctan(z / d_y) - \phi_{\text{worm}}$$
   $$X_{\text{world}} = X_{\text{spaceCen}}(\phi_{\text{rel}}) \pm w_{\text{space}}(R_w)$$
4. **Lấy đường bao hẹp nhất (Kinematic Envelope Minimum Bound)**:
   $$\theta_{\text{body}, R}(r, z) = \min_{\theta_{\text{wheel}}} (\arcsin(X_{\text{world}} / r) - \theta_{\text{wheel}})$$
   $$\theta_{\text{body}, L}(r, z) = \max_{\theta_{\text{wheel}}} (\arcsin(X_{\text{world}} / r) - \theta_{\text{wheel}})$$

---

## 4. Các Bước Triển Khai Trong Mã Nguồn
1. **Cập nhật `modules/worm-gear/js/engine/worm-3d-generator.js`**:
   - Bổ sung hàm `computeConjugateFlankAngles(r, z, mc)`.
   - Trong `generateWheelMesh`, tính toán trước mảng `profileR` cho từng lát cắt $z$ trên toàn bộ 33 mặt cắt họng lõm, sau đó gán đồng bộ cho cả 40 răng.
2. **Đóng gói Bundle thuần**:
   - Chạy lệnh `python tools/bundle_all.py` cập nhật `modules/worm-gear/js/worm-engine.bundle.js`.
3. **Kiểm tra đo đạc vi phân**:
   - Chạy `node scratch/test_envelope_dynamic_all_angles.js` kiểm tra độ đâm xuyên tại các góc $0^\circ, 15^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ, 180^\circ, 270^\circ, 360^\circ$.
4. **Kiểm tra trực quan Playwright**:
   - Chạy `python scratch/capture_rotation_steps.py` chụp ảnh chế độ Chỉ Mặt Bên (`Flank-Only`) tại các bước nhích vi phân.
5. **Kiểm tra chéo Excel COM**:
   - Chạy `RA_SOAT_SONG_SONG_TRUC_VIT_BANH_VIT.bat` đảm bảo 820/820 ô tính đạt chuẩn PASS 100.0% với $\Delta = 0.000000$.

---

## 5. Tiêu Chuẩn Nghiệm Thu
- Độ đâm xuyên cực đại trên toàn bộ 66,000 đỉnh: $\Delta \le 0.000019\text{ mm}$ (chuẩn Zero-Tolerance $\Delta = 0.000000\text{ mm}$).
- Bề dày răng tại vòng chia $r_2$: $6.6959\text{ mm}$, khớp chính xác với $s_{x2} = 6.69565\text{ mm}$ của MITCalc 1.74.
- Bề dày răng tối thiểu tại góc mép ngoài đạt $2.575\text{ mm}$ (dương khỏe, 0 góc răng bị thắt nhọn hay lộn ngược).
- Chế độ Chỉ Mặt Bên (`Flank-Only`): Hai bề mặt trượt tiếp tuyến êm ái, hoàn toàn không có hiện tượng đâm xuyên sườn sau ở cả răng trung tâm và răng lân cận.
