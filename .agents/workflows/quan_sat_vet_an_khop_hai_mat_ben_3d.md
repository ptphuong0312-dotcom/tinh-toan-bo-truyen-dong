# WORKFLOW: QUAN SÁT VẾT ĂN KHỚP HAI MẶT BÊN RĂNG BẰNG CHẾ ĐỘ "CHỈ MẶT BÊN" (FLANK ONLY DUAL-SIDE MESH INSPECTION)

**Mã kịch bản**: `WF-3D-FLANK-ONLY-CONTACT`  
**Đối tượng**: Bánh Răng Côn (Bevel Gear - ISO 23509) & Bánh Răng Trụ / Nghiêng (Spur & Helical Gear - ISO 6336)  
**Mục tiêu**: Tinh gọn thanh công cụ 3D, loại bỏ hoàn toàn shader TCA nhân tạo / bột màu rà / thước đo khe hở / mặt cắt, dựa 100% vào chế độ hình học thực thể "Chỉ mặt bên" (`#btnToggleFlankOnly`) để quan sát vết tiếp xúc ăn khớp tự nhiên trên cả hai mặt sườn (Flank 1 & Flank 2). Đồng thời đưa mô phỏng 2D Bánh Răng Trụ về bản vẽ tối giản, thanh lịch, chính xác.

---

## 1. BỐI CẢNH & CHỈ ĐẠO TỪ CHỦ SỞ HỮU (SirPhuong)

> *"Xoá các chức năng: 'vết tiếp xúc', 'thước đo khe hở', 'mặt cắt ăn khớp'. Vậy sau khi xoá các chức năng này đi thì sẽ theo dõi vết ăn khớp ra sao. Tôi sẽ chỉ lại cho bạn cách xem vết ăn khớp, bạn bật chế độ 'chỉ mặt bên', khi đó bạn sẽ quan sát được vết ăn khớp. Vết ăn khớp được hiện lên chính là phần tiếp xúc của mặt bên bánh răng này với mặt bánh còn lại. Ở bản trước bạn đã dựng được mô phỏng 3D có vết tiếp xúc ở 1 mặt bên của răng nhưng sao bản mới này không có chút vết nào"*  
> *"tôi muốn bạn làm Mô Phỏng Ăn Khớp 3D giống như bên modul tính toán bánh răng côn mà, mục 'vết tiếp xúc' lúc trước bên bánh răng côn tôi cũng đã bảo bạn bỏ rồi mà giờ bạn lại cho vào tính toán bánh răng trụ (cả cái mục 'màu vết' nữa). tôi muốn vết tiếp xúc bên bánh răng trụ bạn làm thế nào hiển thị được như kiểu bên bánh răng côn cho tôi. Phần mô phỏng 2D bên tính toán bánh răng trụ tôi muốn bạn cho về đơn giản như bản trước, không cần phức tạp như hiện tại"*

---

## 2. NGUYÊN LÝ HÌNH HỌC & ĐỘT PHÁ TOÁN HỌC

### 2.1. Bản Chất Hình Học Thực Thể Trong Three.js
- Khi tắt các shader màu nhân tạo, vết tiếp xúc cơ khí được quan sát trực tiếp bằng **giao tuyến hình học thực thể (Geometric Surface Intersection)** giữa vỏ mặt bên Bánh dẫn 1 (màu xanh sky `#38bdf8`) và vỏ mặt bên Bánh bị dẫn 2 (màu vàng hổ phách `#fbbf24`).
- Ở trạng thái lý thuyết $j_n = 0$, hai mặt toán học tiếp xúc tiếp tuyến lý tưởng tại một đường mỏng vô hạn ($0.000\text{ mm}$). Tuy nhiên, do lưới tam giác 3D rời rạc (polygonal faceting) theo dây cung (chordal deviation), hai mặt phẳng tam giác phẳng bị hở một khoảng vi mô $\approx 0.14\text{ mm}$ ở giữa nhịp nếu không có lượng bù tiếp xúc.

### 2.2. Lượng Bù Tiếp Xúc Thực Thể (Conjugate Kiss Allowance)
1. **Đối với Bánh Răng Côn (Bevel Gear)**:
   - Áp dụng lượng bù tiếp xúc dạng parabol dọc theo đường sinh nón $R$:
     $$\Delta s(R) = \delta_{\text{kiss}} \cdot \left[ 1 - \left( \frac{R - R_m}{b / 2} \right)^2 \right]$$
   - Với $\delta_{\text{kiss}} \approx 0.16\text{ mm}$ tại trung điểm chiều rộng vành răng $R_m = R_e - b/2$.
2. **Đối với Bánh Răng Trụ & Nghiêng (Spur & Helical Gear)**:
   - Trong `gear-3d-generator.js`, áp dụng bù góc sườn răng $\Delta\theta_{\text{kiss}}$ đối xứng cho cả 2 bên:
     * Chế độ **Lý thuyết (`theory`)**: Bù đều $\Delta\theta = 0.16 / r_{\text{pitch}}$, tạo đường tiếp xúc thẳng tắp song song trục $Z$ (hoặc nghiêng góc $\beta$ với răng nghiêng).
     * Chế độ **Thực tế xưởng Crowning (`crowning`)**: Bù parabol $K_{\text{crown}} = 1 - (Z / (b/2))^2$ với $\Delta\theta = (0.22 \cdot K_{\text{crown}}) / r_{\text{pitch}}$, tạo vết tiếp xúc dạng elip vồng ở giữa và thuôn về 2 đầu.

---

## 3. CÁC BƯỚC THỰC HIỆN ĐỒNG BỘ HAI MODULE

### Bước 1: Tinh Gọn Giao Diện Toolbar 3D Chuẩn Bánh Răng Côn
1. **Loại bỏ hoàn toàn**:
   - Nút `#btnToggleTCA` ("Vết Tiếp Xúc")
   - Dropdown `#selTcaColor` ("Màu Vết")
   - Nhãn `#badge3DTca` trên thanh thông số chân màn hình
2. **Thanh công cụ 3D chuẩn hóa**:
   - `📐 Hướng nhìn` (với preset `mesh` - Vùng Tiếp Xúc Ăn Khớp)
   - `⚡ Tốc độ` slider
   - `⏸️ Dừng` / `▶️ Tiếp Tục`
   - `🔄 Chiều quay`
   - `⏮️ Nhích Lùi` & `⏭️ Nhích Tiến`
   - `🕸️ Khung Dây`
   - `🎯 Đặt Lại`
   - `👁️ Chỉ Mặt Bên` (`#btnToggleFlankOnly`)
   - `📐 Tiếp xúc` (Lý Thuyết / Crowning)
   - `📥 Xuất File 3D`

### Bước 2: Tinh Gọn Động Cơ 3D (`gear-3d-visualizer.js`)
1. Loại bỏ các cờ TCA: `tcaEnabled`, `tcaColorMode`, `tcaPatternType`, `tcaMaterials`, shader onBeforeCompile injection.
2. Vật liệu PBR chuẩn đồng bộ:
   - Pinion Solid: Cyan Blue `0x0284c7`, metalness `0.85`, roughness `0.25`.
   - Gear Solid: Warm Amber Gold `0xf59e0b`, metalness `0.85`, roughness `0.28`.
   - Pinion Flank (Chỉ mặt bên): Sky Blue `#38bdf8`, metalness `0.70`, roughness `0.30`, `side: THREE.DoubleSide`.
   - Gear Flank (Chỉ mặt bên): Amber Gold `#fbbf24`, metalness `0.70`, roughness `0.30`, `side: THREE.DoubleSide`.
3. Khi bật "Chỉ Mặt Bên": Khối đặc ẩn đi, hai vỏ mặt bên sườn răng Sky Blue và Amber Gold giao thoa, tiếp xúc trực tiếp tạo nên vết ăn khớp cơ khí tự nhiên.

### Bước 3: Đưa Mô Phỏng 2D Bánh Răng Trụ Về Bản Vẽ Tối Giản Thanh Lịch
1. Loại bỏ bảng thẻ thông số nổi `BẢNG THÔNG SỐ CHUẨN ISO 6336` che góc trái.
2. Loại bỏ điểm ăn khớp $K$ và nhãn `K (Ăn Khớp)`.
3. Loại bỏ đường kích thước khoảng cách trục $a_w$ và mũi tên kích thước.
4. Giữ lại bản vẽ cơ khí 2D thuần túy:
   - Hai bánh răng quay lăn liên hợp với pha chính xác không đâm xuyên.
   - Đường tâm gạch đứt `rgba(100, 116, 139, 0.35)`.
   - Đường ăn khớp Line of Action gạch đứt đỏ `rgba(239, 68, 68, 0.45)`.
   - Vòng lăn $d_{w1}, d_{w2}$ gạch đứt xanh sky `rgba(56, 189, 248, 0.5)`.
   - Điểm tâm ăn khớp Pitch Point $C$ tại $(d_{w1}/2, 0)$.

---

## 4. QUY TRÌNH KIỂM CHỨNG & NGHIỆM THU
1. Đóng gói bundle: `python tools/bundle_all.py`.
2. Kiểm tra trực quan bằng Playwright Headless Browser:
   - Xác nhận 2D Canvas tối giản, sạch sẽ, không che khuất.
   - Xác nhận 3D WebGL khi bật "Chỉ Mặt Bên" ở góc nhìn "Vùng Tiếp Xúc Ăn Khớp" hiển thị vết tiếp xúc rõ nét giữa 2 mặt bên.
   - Xác nhận 0 console error.
3. Chạy QC Suite: `python modules/spur-gear/tests/qc_gear_multi_case_suite.py` -> 110/110 checks PASS 100%.
