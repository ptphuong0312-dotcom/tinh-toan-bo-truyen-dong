---
description: Quy trình thiết kế Bản đồ Màu đỉnh Bột Rà Cơ Khí Prussian Blue (TCA Vertex Colors Gradient) triệt tiêu 100% Z-Fighting nứt nẻ và hiển thị vết tiếp xúc quang học hoàn mỹ
globs: modules/worm-gear/**, shared/**
---

# Quy Trình Bản Đồ Màu Đỉnh Bột Rà Cơ Khí Prussian Blue (TCA Vertex Colors Gradient Engine)

Tài liệu này ghi lại toàn bộ quy trình phát hiện, chẩn đoán, triệt tiêu lỗi Z-fighting vỡ vụn nứt nẻ ("nhằng nhịt nứt nẻ") và triển khai bản đồ màu đỉnh (Vertex Colors) bột rà cơ khí Prussian Blue chuẩn quốc tế cho mô hình 3D Bánh Vít.

---

## 1. Chẩn Đoán Sai Số Gốc Rễ Đồ Họa 3D WebGL

* **Hiện tượng lỗi**: Khi bật chế độ "Chỉ Mặt Bên" (`Flank-Only`) với độ mịn Cấp 8 (`media_1790841146229.png`), trên mặt sườn Bánh Vít xuất hiện một dải lưới tam giác màu cyan và trắng lởm chởm, rách nát, nham nhở như mạng nhện hay vỏ trứng nứt ("nhằng nhịt nứt nẻ").
* **Nguyên nhân cốt lõi**:
  - Việc dùng cơ chế vi dịch chuyển $d\Theta_{\text{kiss}} > 0$ để ép hai mặt cong 3D (ren trục vít Cyan `#00a8ff` và sườn bánh vít Orange `#ea580c`) đâm xuyên lồng vào nhau vài micron.
  - Do hai mặt có topo lưới khác nhau hoàn toàn (trục vít chia theo đường xoắn ốc Archimedes, bánh vít chia theo họng lõm globoid), khi đâm xuyên nhau chúng tạo ra hàng ngàn điểm giao cắt tam giác ngẫu nhiên.
  - Bộ đệm độ sâu (Depth Buffer 24-bit) của WebGL xảy ra hiện tượng **Z-Fighting cực mạnh**: hai bề mặt tranh chấp từng pixel, kết hợp ánh sáng phản xạ specular lóe trắng tạo nên hoa văn răng cưa vỡ vụn ("nhằng nhịt nứt nẻ").

---

## 2. Nguyên Tắc Cốt Lõi: Zero-Interference ($d\Theta_{\text{kiss}} = 0.0\text{ mm}$)

1. **Tuyệt đối KHÔNG dùng đâm xuyên hình học để mô phỏng vết tiếp xúc**:
   - Hai mặt sườn tiếp xúc tiếp tuyến hoàn hảo về mặt toán học giải tích: $\Delta = 0.000000\text{ mm}$.
   - Đặt $d\Theta_{\text{kiss}} = 0.0$ tuyệt đối trong `generateWheelMesh`.
2. **Cấu hình Depth Buffer**:
   - Thiết lập `polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 2.0` cho vật liệu sườn trục vít `matWormSurf`.
   - Giúp WebGL phân giải thứ tự độ sâu hoàn hảo khi hai mặt tiếp tuyến mà không có bất kỳ pixel nào bị chớp nháy.

---

## 3. Giải Thuật Bản Đồ Màu Đỉnh Bột Rà Cơ Khí (TCA Vertex Colors Gradient)

1. **Phương pháp xưởng cơ khí quốc tế (Prussian Blue Marking Compound)**:
   - Trong kiểm tra cơ khí (chuẩn Gleason, Klingelnberg, AGMA 6022, DIN 3996), kỹ sư quét một lớp bột màu rà xanh (Prussian Blue / Engineer's Blue) lên răng và cho ăn khớp để in vết tiếp xúc.
2. **Hàm giải tích `computeTcaColor(u, v, contactMode, handSign)`**:
   - Tọa độ chuẩn hóa: $u = z / \text{halfB} \in [-1, 1]$ (chiều rộng họng), $v = (r - r_{\text{root}}) / (r_{\text{tip}} - r_{\text{root}}) \in [0, 1]$ (chiều cao răng).
   - **Chế độ `📏 Lý Thuyết (Đường Tiếp Xúc Conjugate)`**:
     $$v_0(u) = 0.50 + 0.12 \cdot u \cdot \text{handSign}$$
     $$I(u, v) = \max\left(0, \left(1 - \left(\frac{|v - v_0|}{0.12}\right)^2\right) \cdot \left(1 - \left(\frac{|u|}{0.82}\right)^4\right)\right)$$
   - **Chế độ `🔵 Thực Tế Xưởng (Vết Elip Crowning)`**:
     Metric elip:
     $$E(u, v) = \left(\frac{u - u_0}{0.55}\right)^2 + \left(\frac{v - 0.50}{0.28}\right)^2 \le 1.0$$
     $$I(u, v) = (1 - E)^{1.2}$$
3. **Chuyển sắc Hermite 2 bậc $C^1$ siêu mịn**:
   - $I \le 0.0$: Đồng CuSn12Ni2 $(0.92, 0.35, 0.05)$ (`#ea580c`).
   - $0.0 < I \le 0.25$: Nội suy mượt sang viền Sky Blue $(0.15, 0.75, 0.98)$ (`#26bbf9`).
   - $0.25 < I \le 1.0$: Nội suy mượt sang tâm bột rà Prussian Blue $(0.01, 0.22, 0.78)$ (`#014ba0`).

---

## 4. Tích Hợp Three.js & Đóng Gói Bundle

1. Trong `worm-3d-visualizer.js`:
   - Gán `color` buffer attribute:
     ```javascript
     geo2.setAttribute('color', new THREE.BufferAttribute(this.mesh2Data.colors, 3));
     geoSurf2.setAttribute('color', new THREE.BufferAttribute(this.surf2Data.colors, 3));
     ```
   - Kích hoạt `vertexColors: true`, `color: 0xffffff`, `emissive: 0x000000` trên `matWheel` và `matWheelSurf`.
2. Đóng gói bundle: Chạy `python tools/bundle_all.py` cập nhật `modules/worm-gear/js/worm-engine.bundle.js`.
3. Kiểm thử tự động Playwright: Chạy `python tools/test_worm_contact_and_solid.py`, kiểm tra ảnh chụp tại Cấp độ mịn 8 để xác nhận sườn răng nhẵn bóng và vệt màu rà Prussian Blue hiển thị hoàn mỹ.
