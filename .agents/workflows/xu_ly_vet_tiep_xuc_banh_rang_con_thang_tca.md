# WORKFLOW: QUY TRÌNH XỬ LÝ VẾT TIẾP XÚC HAI BỀ MẶT BÊN RĂNG CÔN THẲNG & THẨM TRA TỰ ĐỘNG PLAYWRIGHT
**Tiêu chuẩn áp dụng**: ISO 23509, DIN 3971, AGMA 2005, WebGL GLSL Shader  
**Mục tiêu**: Xử lý triệt để lỗi vết tiếp xúc chỉ xuất hiện ở một bên bề mặt răng; hỗ trợ tiếp xúc cả hai bên sườn (Flank 1 & Flank 2) khi khe hở cạnh răng danh nghĩa bằng 0 ($j_n = 0$); tạo vết tiếp xúc dạng dải mặt sườn tự nhiên "mặt tiếp xúc mặt như bình thường" cho bánh răng côn thẳng (không có elip vồng nhân tạo); thiết lập $\beta = 0^\circ$ làm mặc định; và chạy kiểm thử trực quan tự động với Playwright.

---

## 1. NGUYÊN NHÂN GỐC RỄ & PHÂN TÍCH ĐỘNG HỌC

### 1.1. Nguyên Nhân Shader Cũ Chỉ Hiện 1 Bên Sườn
Trong shader GPU `applyTCAShader` (`modules/bevel-gear/js/ui/bevel-3d-visualizer.js`), logic cũ:
```glsl
float activeFlank = (uIsPinion > 0.5) ?
    ((uAnimDirection > 0.0) ? 1.0 : 2.0) :
    ((uAnimDirection > 0.0) ? 2.0 : 1.0);

if (abs(vTcaParam.z - activeFlank) < 0.5) { ... }
```
Đoạn mã này ép buộc chỉ có 1 sườn (Flank 1 hoặc Flank 2) được tô màu vết tiếp xúc theo chiều quay.

### 1.2. Bản Chất Vật Lý Khi Khe Hở Danh Nghĩa Bằng 0 ($j_n = 0$)
- Khi khe hở ăn khớp bằng 0, chiều dày răng lấp đầy hoàn toàn rãnh răng đối diện.
- Mỗi răng của Bánh 1 được kẹp đồng thời bởi hai răng kế cận của Bánh 2:
  * Mặt sườn 1 (Flank 1) tiếp xúc với sườn của răng phía trước.
  * Mặt sườn 2 (Flank 2) tiếp xúc với sườn của răng phía sau.
- Do đó, **cả 2 bề mặt bên của răng đều ở trạng thái tiếp xúc liên hợp đồng thời**!

### 1.3. Bản Chất Vết Tiếp Xúc Bánh Răng Côn Thẳng
- Bánh răng côn răng thẳng tiêu chuẩn không gia công độ vồng dọc răng nhân tạo (longitudinal crowning).
- Tiếp xúc tức thời giữa hai mặt nón thân khai là **tiếp xúc đường (line contact)** trải dài suốt chiều rộng răng $b$.
- Khi bánh răng quay qua khớp (vết rà màu tích lũy Prussian Blue - Chế độ 1): Đường tiếp xúc quét dọc toàn bộ chiều cao làm việc $h_w$, tạo thành dải tiếp xúc bao phủ gần như toàn bộ mặt sườn làm việc ("mặt tiếp xúc mặt như bình thường").

---

## 2. CÁC BƯỚC TRIỂN KHAI KỸ THUẬT

### Bước 1: Cập Nhật Shader TCA trong `bevel-3d-visualizer.js`
1. Khai báo thêm `uniform float uIsSpiral;` trong fragment shader.
2. Gỡ bỏ điều kiện lọc 1 sườn `abs(vTcaParam.z - activeFlank) < 0.5`. Thay bằng `if (uTcaEnabled > 0.5 && vTcaParam.z > 0.5)` để áp dụng cho cả Flank 1 ($z = 1.0$) và Flank 2 ($z = 2.0$).
3. Phân nhánh hình học cho Bánh Răng Côn Thẳng (`uIsSpiral < 0.5`):
   - Dọc chiều rộng răng: `uMask = smoothstep(0.50, uMargin, abs(u))` với `uMargin = clamp(0.50 - 0.035 * widthScale, 0.35, 0.495)`.
   - Dọc chiều cao làm việc: Khắc phục lỗi đảo ngược biên GLSL (`edge0 > edge1`):
     ```glsl
     float vMask = smoothstep(0.03, 0.10, flankT) * (1.0 - smoothstep(0.90, 0.97, flankT));
     ```
     (Không viết `smoothstep(0.97, 0.90, flankT)` vì GLSL yêu cầu `edge0 < edge1`, nếu viết đảo sẽ bị GPU ANGLE/DirectX ép về 0 khiến Flank 2 mất màu).
   - Vết tiếp xúc: `intensity = fullStraightContact` ở Chế độ 1 (Cumulative Rolled Prussian Blue), hoặc `intensity = fullStraightContact * rollLineMask` ở Chế độ 0 (Dynamic Rolling Locus).
4. Cập nhật `customProgramCacheKey` phân biệt rõ `material.side === THREE.DoubleSide ? 'double' : 'front'` và tham số `_sp` để Three.js không dùng nhầm shader giữa Solid và Surface Mesh.
5. Căn chỉnh góc quay khởi tạo ăn khớp đối xứng ($j_n = 0$):
   `this.initialGearAngle = Math.PI / z2;` (đưa rãnh răng bánh 2 căn chuẩn xác đối xứng vào tâm răng bánh 1, triệt tiêu khe hở lệch 2.43mm, làm cho cả Flank 1 và Flank 2 đều tiếp xúc khít khao).

### Bước 2: Thiết Lập Mặc Định Bánh Răng Côn Thẳng ($\beta = 0^\circ$) & Chống Cache Trình Duyệt
1. Trong `modules/bevel-gear/index.html`:
   - `selGearingType`: gán `selected` cho `straight_type1`.
   - `inp_beta`: gán `value="0.0"`.
   - Cache-busting: `<script src="js/bevel-engine.bundle.js?v=20260924_tca_both_flanks"></script>`.
2. Trong `modules/bevel-gear/js/bevel-ui.js`:
   - `this.inputs`: gán mặc định `beta: 0.0`, `gearingType: 'straight_type1'`.
   - Sự kiện nút Reset (`#btnResetDefaults`): gán lại `beta: 0.0` và `gearingType: 'straight_type1'`.

### Bước 3: Đóng Gói Bundle JavaScript Thuần
Chạy script:
```bash
python tools/bundle_all.py
```
Đảm bảo sinh ra `modules/bevel-gear/js/bevel-engine.bundle.js` thành công 100%.

### Bước 4: Tự Động Duyệt Web Kiểm Thử với Playwright
Chạy script kiểm thử `scratch/verify_both_flanks_final.py`:
1. Kiểm tra inputs mặc định: `beta == 0.0`, `gearingType == 'straight_type1'`.
2. Bật chế độ 3D WebGL và bật nút Vết Tiếp Xúc (`#btnToggleContactTCA`).
3. Chuyển sang chế độ Chỉ Mặt Bên (`#btnToggleFlankOnly`).
4. Lấy mẫu màu pixel trên cả Flank 1 (`x=875..885`) và Flank 2 (`x=930..945`).
5. Kết quả xác thực: Flank 1 và Flank 2 đều là Prussian Blue `(31, 116, 255)` và `(37, 122, 255)`. Đáy rãnh và đỉnh răng giữ màu kim loại nguyên bản.

### Bước 5: Đưa Lên GitHub & Triển Khai Vercel
1. AI trực tiếp commit và push lên nhánh `main` của GitHub origin:
   ```bash
   git add .
   git commit -m "fix(bevel-3d): resolve GLSL smoothstep edge inversion ensuring Prussian Blue contact mark on both flanks"
   git push origin main
   ```
2. Vercel tự động build & deploy trong 5-10s. Trình duyệt tải ngay bundle mới nhờ version query string.
