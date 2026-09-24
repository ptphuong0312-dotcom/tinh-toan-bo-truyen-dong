# WORKFLOW: QUAN SÁT VẾT ĂN KHỚP HAI MẶT BÊN RĂNG BẰNG CHẾ ĐỘ "CHỈ MẶT BÊN" (FLANK ONLY DUAL-SIDE MESH INSPECTION)

**Mã kịch bản**: `WF-BEVEL-3D-FLANK-ONLY-CONTACT`  
**Đối tượng**: Bánh răng côn răng thẳng ($\beta = 0^\circ$) & Bánh răng côn xoắn trong mô-đun 3D WebGL Three.js  
**Mục tiêu**: Tinh gọn thanh công cụ 3D, loại bỏ shader TCA nhân tạo / thước đo khe hở / mặt cắt, dựa hoàn toàn vào chế độ hình học thực thể "Chỉ mặt bên" để quan sát vết tiếp xúc ăn khớp đối xứng trên cả hai mặt sườn (Flank 1 & Flank 2).

---

## 1. BỐI CẢNH & CHỈ ĐẠO TỪ CHỦ SỞ HỮU (SirPhuong)

> *"Xoá các chức năng: 'vết tiếp xúc', 'thước đo khe hở', 'mặt cắt ăn khớp'. Vậy sau khi xoá các chức năng này đi thì sẽ theo dõi vết ăn khớp ra sao. Tôi sẽ chỉ lại cho bạn cách xem vết ăn khớp, bạn bật chế độ 'chỉ mặt bên', khi đó bạn sẽ quan sát được vết ăn khớp. Vết ăn khớp được hiện lên chính là phần tiếp xúc của mặt bên bánh răng này với mặt bánh còn lại. Ở bản trước bạn đã dựng được mô phỏng 3D có vết tiếp xúc ở 1 mặt bên của răng nhưng sao bản mới này không có chút vết nào"*

---

## 2. NGUYÊN LÝ HÌNH HỌC & ĐỘT PHÁ TOÁN HỌC

### 2.1. Bản Chất Hình Học Thực Thể Trong Three.js
- Khi tắt các shader màu nhân tạo, vết tiếp xúc cơ khí được quan sát trực tiếp bằng **giao tuyến hình học thực thể (Geometric Surface Intersection)** giữa vỏ mặt bên Bánh dẫn 1 (màu xanh cyan `#38bdf8`) và vỏ mặt bên Bánh bị dẫn 2 (màu vàng hổ phách `#fbbf24`).
- Ở trạng thái lý thuyết $j_n = 0$, hai mặt toán học tiếp xúc tiếp tuyến lý tưởng tại một đường mỏng vô hạn ($0.000\text{ mm}$). Tuy nhiên, do lưới tam giác 3D rời rạc (polygonal faceting) theo dây cung (chordal deviation), hai mặt phẳng tam giác phẳng bị hở một khoảng vi mô $\approx 0.14\text{ mm}$ ở giữa nhịp, khiến người dùng nhìn vào thấy một khe hở đen và không thấy vết tiếp xúc.

### 2.2. Lượng Bù Tiếp Xúc Parabol Liên Hợp (Conjugate Parabolic Kiss Allowance)
- Để hiển thị rõ nét vết ăn khớp tự nhiên trên cả hai mặt bên của răng mà không làm phồng đầu răng hay méo biên dạng nón, áp dụng lượng bù tiếp xúc dạng parabol:
  $$\Delta s(R) = \delta_{\text{kiss}} \cdot \left[ 1 - \left( \frac{R - R_m}{b / 2} \right)^2 \right]$$
- Với $\delta_{\text{kiss}} \approx 0.16\text{ mm}$ tại trung điểm chiều rộng vành răng $R_m = R_e - b/2$:
  * Tại $R = R_m$ (khu giữa răng): Bù tối đa $\approx 0.16\text{ mm}$, khắc phục hoàn toàn sai số dây cung faceting và tạo giao tuyến ăn khớp thực thể $\approx 0.1432\text{ mm}$ rõ nét.
  * Tại $R = R_e$ (Heel - nón ngoài) và $R = R_i$ (Toe - nón trong): $\Delta s(R) = 0.000\text{ mm}$, bảo toàn 100% hình học nón danh nghĩa, triệt tiêu hoàn toàn hiện tượng phồng cạnh nón ngoài theo Quy Tắc 29 & 30.
- Lượng bù được phân bổ hoàn toàn đối xứng cho cả **Flank 1** và **Flank 2**, đảm bảo khi răng Bánh 1 nằm trong rãnh răng Bánh 2, cả hai bên đều xuất hiện vết tiếp xúc thực thể đồng thời.

---

## 3. CÁC BƯỚC THỰC HIỆN

### Bước 1: Tinh Gọn Giao Diện HTML (`modules/bevel-gear/index.html`)
1. Gỡ bỏ nút `#btnToggleContactTCA`, `#selTCAPatternType`, `#selTCAColorMode`, `#tcaBandControl`.
2. Gỡ bỏ nút `#btnToggleClearanceGauge` và `#btnToggleSectionCut`.
3. Gỡ bỏ toàn bộ khối bảng `#hudClearanceGauge`.
4. Giữ lại nút `#btnToggleFlankOnly` ("Chỉ Mặt Bên") và các điều khiển 3D cơ bản (Xoay, Phóng to/Thu nhỏ, Preset góc nhìn, Tốc độ, Đổi chiều quay).

### Bước 2: Tinh Gọn Động Cơ 3D (`modules/bevel-gear/js/ui/bevel-3d-visualizer.js`)
1. Loại bỏ các biến cờ: `clearanceGaugeMode`, `sectionCutMode`, `tcaEnabled`, `tcaUniforms`, `clipPlane`.
2. Loại bỏ `applyTCAShader()` và cơ chế gắn clipping plane vào renderer Three.js.
3. Vật liệu PBR chuẩn:
   - `matPinionSurf`: MeshStandardMaterial màu cyan `#38bdf8`, roughness `0.28`, metalness `0.82`, `side: THREE.DoubleSide`.
   - `matGearSurf`: MeshStandardMaterial màu amber `#fbbf24`, roughness `0.28`, metalness `0.82`, `side: THREE.DoubleSide`.
4. Hiệu chỉnh Camera Preset `"mesh"` (Vùng Tiếp Xúc Ăn Khớp):
   - Đặt camera nhìn dọc theo vector tiếp tuyến đường sinh nón chia $\vec{t} = (\cos\delta_1, \sin\delta_1, 0)$ trực diện vào rãnh răng tại độ cao $Z = 55$:
     ```javascript
     const cosD_m = Math.cos(delta1);
     const sinD_m = Math.sin(delta1);
     this.camera.position.set(mx + 95 * cosD_m - 20 * sinD_m, my + 95 * sinD_m + 20 * cosD_m, 55);
     this.camera.up.set(0, 0, 1);
     this.controls.target.set(mx, my, 0);
     ```
   - Góc nhìn này cho phép quan sát đồng thời cả hai sườn răng ăn khớp đối xứng trong cùng một khung hình.

### Bước 3: Cấu Hình Hình Học Ăn Khớp Bù Parabol (`bevel-3d-generator.js`)
1. Trong hàm sinh lưới mặt bên `buildFlankSurfaceGeometry()`:
   - Xác định tọa độ bán kính mặt nón $R$ của từng lát cắt.
   - Tính hệ số parabol $w = \max(0, 1 - ((R - R_m) / (b/2))^2)$.
   - Áp dụng lượng bù dịch chuyển góc:
     $$\Delta \theta = \frac{\delta_{\text{kiss}} \cdot w}{2 R \sin\delta}$$
     vào cả sườn Flank 1 (dương) và Flank 2 (âm).

### Bước 4: Đóng Gói Bundle & Kiểm Thử
1. Chạy lệnh đóng gói: `python tools/bundle_all.py`.
2. Chạy bộ kiểm thử tự động Playwright `tests/verify_mesh_preset_dropdown.py`:
   - Xác nhận dropdown "Vùng Tiếp Xúc Ăn Khớp" chọn mượt mà.
   - Xác nhận chế độ "Chỉ Mặt Bên" hiển thị rõ nét vết tiếp xúc trên cả hai sườn răng.
   - Xác nhận 0 lỗi JavaScript Console.
3. Chạy `python modules/bevel-gear/tests/qc_bevel_multi_case_suite.py`:
   - Xác nhận 120/120 checks PASS 100.0% ($\Delta = 0.0000$).
