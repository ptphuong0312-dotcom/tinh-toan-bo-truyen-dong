# Kịch Bản & Quy Trình Tái Cấu Trúc Toàn Diện Profile Bánh Vít & Trục Vít Chuẩn Gốc MITCalc 1.74 (Zero-Penetration Conjugate Helicoid Workflow)

> **Mục tiêu**: Loại bỏ triệt để sai số hình học lộn ngược răng bánh vít, dựng biên dạng ren xoắn ốc Archimedes ZA mượt mà liên tục bằng Quad Strips, và đạt chuẩn tiếp xúc liên hợp khe hở bằng 0 ($\Delta = 0.000000\text{ mm}$) trong chế độ "Chỉ Mặt Bên" (`DoubleSide Flank-Only`) mà không bị má bánh vít đâm xuyên qua sườn sau trục vít.

---

## 1. Bối Cảnh & Chẩn Đoán Sai Số Gốc Rễ

Trong phiên bản trước, khi bật chế độ "Chỉ Mặt Bên" (`DoubleSide Flank-Only`), người dùng (`SirPhuong`) phát hiện má răng bánh vít ngậm sâu xuyên qua mặt phía sau của trục vít một đoạn, đồng thời biên dạng ren trục vít bị giật cục thành các nấc bậc thang.

### Nguyên Nhân Hình Học & Toán Học Cốt Lõi:
1. **Lộn Ngược Chiều Dày Răng Bánh Vít (Inverted Tooth Thickness Taper)**:
   - Trong ren trục vít Archimedes (ZA), ren có tiết diện hình thang thẳng: dày nhất ở chân ren ($R_w = r_{f1}$, nửa dày $w \approx 5.29\text{ mm}$) và mỏng nhất ở đỉnh ren ($R_w = r_{a1}$, nửa dày $w \approx 1.80\text{ mm}$).
   - Bánh vít ăn khớp với khoảng cách tâm $a$. Do đó, tại đỉnh răng bánh vít ($r = r_{a2}$), khoảng cách tới tâm trục vít là $R_w = a - r_{a2} = r_{f1}$ (chân ren trục vít).
   - Mã nguồn cũ đã gán trực tiếp nửa bề rộng răng bánh vít bằng nửa bề dày ren trục vít $s_{\text{worm\_half}}(R_w)$. Hệ quả là:
     * Tại đỉnh răng bánh vít ($r = r_{a2}$), bề dày răng bị gán CỰC ĐẠI ($2 \times 5.29 = 10.57\text{ mm}$).
     * Tại chân răng bánh vít ($r = r_{f2}$), bề dày răng bị gán CỰC TIỂU ($2 \times 1.80 = 3.59\text{ mm}$).
   - Chiều dày răng bánh vít bị lộn ngược hoàn toàn (hình chêm ngược). Khi đỉnh răng dày $10.57\text{ mm}$ đi vào rãnh hẹp $3.59\text{ mm}$ tại chân trục vít, nó tất yếu đâm xuyên qua sườn sau trục vít tới hơn $3.5\text{ mm}$!
2. **Cắt Lát Rời Rạc Tạo Bậc Thang (Stepped Faceting)**:
   - Trục vít cũ được tạo bằng cách cắt lát theo trục $X$ rồi lấy mẫu góc cực rời rạc, làm bề mặt xoắn ốc bị gãy nếp hình bậc thang zíc zắc.

---

## 2. Giải Thuật Hình Học Chuẩn 1-to-1 MITCalc 1.74

### 2.1 Trục Vít 1 (Archimedean Helicoid ZA Quad Strips)
Dựng trực tiếp các dải tứ giác (Quad Strips) mượt mà 100% bám theo đường sinh xoắn ốc của ren trục vít:
- Tại mọi bán kính $R \in [r_{f1}, R_{\text{blank}}(x)]$:
  $$w_1(R) = \frac{s_{x1}}{2} - (R - r_1)\tan\alpha_x$$
- Góc cực hai sườn phải ($R$) và trái ($L$):
  $$\phi_R(R, x) = \phi_0(x) - \text{handSign}\frac{2\pi}{p_{z1}}w_1(R)$$
  $$\phi_L(R, x) = \phi_0(x) + \text{handSign}\frac{2\pi}{p_{z1}}w_1(R)$$
  với $\phi_0(x) = \text{handSign}\frac{2\pi}{p_{z1}}x + \text{startPhase} + \pi$.

### 2.2 Bánh Vít Lõm 2 (Conjugate Globoid Throated Wheel)
1. **Đường bao phôi họng lõm chữ U**:
   Tuân thủ 100% 3 nhánh giải tích của macro `DXF.bas!WWheel` trong MITCalc 1.74 với các bán kính dao cắt $r_1, r_2, r_3$ và các hoành độ chuyển tiếp $b_1, b_3, b_4, b_5$.
2. **Hệ tọa độ trụ trục vít & Bề rộng rãnh ren liên hợp**:
   - Tọa độ góc trụ trục vít:
     $$\phi_w = \arctan\left(\frac{z}{\max(0.1, a - r)}\right)$$
   - Tọa độ tâm rãnh ren trục vít:
     $$X_{\text{worm\_cen}} = \text{handSign}\frac{p_{z1}}{2\pi}\phi_w$$
   - Bề rộng rãnh ren trục vít tại bán kính $R_w = \sqrt{(a - r)^2 + z^2}$:
     $$w_{\text{space}}(R_w) = \frac{s_{x2}}{2} + (R_w - r_1)\tan\alpha_x$$
     *(Chân răng bánh vít dày $10.57\text{ mm}$, đỉnh răng bánh vít vuốt nhọn $3.59\text{ mm}$ lọt lòng khít khao vào rãnh ren trục vít).*
3. **Chiếu góc cực giải tích (Arcsin Angular Projection)**:
   $$\theta_R = \theta_{\text{center}} + \arcsin\left(\frac{X_{\text{worm\_cen}} + w_{\text{space}}}{r}\right)$$
   $$\theta_L = \theta_{\text{center}} + \arcsin\left(\frac{X_{\text{worm\_cen}} - w_{\text{space}}}{r}\right)$$

---

## 3. Quy Trình Kiểm Thử & Nghiệm Thu Trực Quan

1. **Kiểm tra biên dạng 3D đặc (Solid Mode)**:
   - Bánh vít ôm sát họng lõm chữ U theo đúng bán kính cong $r_1$ của trục vít.
   - Thân răng bánh vít có độ vát thon chuẩn kỹ thuật cơ khí.
2. **Kiểm tra chế độ "Chỉ Mặt Bên" (`btnToggleFlankOnly`)**:
   - Ẩn toàn bộ thân phôi, chỉ hiển thị mặt sườn Trục Vít 1 (Cyan `#00a8ff`) và Bánh Vít 2 (Cam `#ff5722`).
   - Tại vùng tiếp xúc ăn khớp: hai bề mặt tiếp xúc tiếp tuyến, xuất hiện ánh quang đồng phẳng (co-planar z-fighting shimmer) do chia sẻ cùng tọa độ giải tích $\Delta = 0.000000\text{ mm}$.
   - Quan sát từ mọi góc nhìn (ISO, Front, Throat, Mesh): tuyệt đối không có má răng bánh vít đâm xuyên qua sườn sau trục vít!
3. **Kiểm tra động học (Kinematic Stepping / Animation)**:
   - Nhấn "Nhích Tiến" (`#btn3DStepFwd`) qua các góc quay $10^\circ, 20^\circ, \dots, 360^\circ$.
   - Các răng bánh vít lần lượt tiến vào và thoát ra khỏi ren trục vít êm ái, tiếp xúc sườn liên tục không bị va chạm hay biến dạng.
