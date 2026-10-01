---
description: Quy trình & Giải thuật xây dựng Mô phỏng 3D Trục Vít - Bánh Vít Phiên bản 1 (Analytical C1 Root Fillet & Globoid Enveloping Helix Engine - v1)
---

# QUY TRÌNH KỸ NĂNG XÂY DỰNG MÔ PHỎNG 3D TRỤC VÍT - BÁNH VÍT (BẢN V1 - GIẢI TÍCH C1 & MẶT BAO GLOBOID)

> **Ghi chú lưu trữ theo lệnh của `SirPhuong`**:  
> Tài liệu này lưu trữ toàn bộ quy trình toán học, phương trình tham số và kiến trúc mã nguồn của **Phiên bản 1 (v1 - Analytical C1 Fillet & Globoid Envelope)** đã xây dựng cho Web App Tính Toán Bộ Truyền Trục Vít - Bánh Vít (`modules/worm-gear/`) trước khi chuyển sang **Phiên bản 2 (v2 - Chuẩn 1-to-1 theo 32 tham số `MC_*` & `DXF.bas` của MITCalc 1.74)**.  
> Bản sao mã nguồn gốc v1 cũng được lưu trữ nguyên vẹn tại `modules/worm-gear/js/engine/worm-3d-generator.v1-analytical.js`.

---

## 1. Hệ Tọa Độ Không Gian 3D & Quy Ước Ăn Khớp Liên Hợp

1. **Hệ tọa độ lắp ráp (Assembly World Frame)**:
   - **Bánh vít 2 (Worm Wheel 2)**:
     * Tâm đặt tại gốc tọa độ $(0, 0, 0)$.
     * Trục quay của bánh vít nằm dọc theo **trục $Z$**, bề rộng vành răng $z \in [-b_{2H}/2, +b_{2H}/2]$.
     * Ánh xạ tọa độ cực mặt cắt ngang:
       $$X(\theta) = +r \sin\theta, \quad Y(\theta) = -r \cos\theta$$
       Sao cho tại $\theta = 0$, điểm trên bánh vít nằm tại $(0, -r, z)$ — tức là **đỉnh họng lõm hướng thẳng xuống phía dưới ($-Y$)** nơi đặt trục vít 1.
   - **Trục vít 1 (Worm 1)**:
     * Tâm trục vít đặt tại $(0, -a, 0)$ (nằm dưới bánh vít một khoảng cách trục $a$ theo phương $-Y$).
     * Trục quay của trục vít nằm dọc theo **trục $X$**, phần cắt ren $x \in [-L/2, +L/2]$, mở rộng sang hai cổ trục $x \in [-l_1, +l_2]$.
     * Ánh xạ tọa độ cực quanh trục $X$:
       $$Y_{\text{local}}(\phi) = r \cos\phi, \quad Z_{\text{local}}(\phi) = r \sin\phi$$
       Khi tịnh tiến về $(0, -a, 0)$, điểm tại $x = 0, \phi = 0$ có tọa độ thế giới $(0, -a + r, 0)$ — tức là **đỉnh ren trục vít hướng thẳng lên trên ($+Y$)** đi vào đúng tâm rãnh răng của bánh vít tại $(0, -r_{m2}, 0)$!

2. **Phương trình động học ăn khớp liên hợp (Conjugate Kinematics)**:
   - Khi trục vít 1 quay góc $\theta_1$ quanh trục $X$:
     $$\theta_2 = -\text{handSign} \cdot \theta_1 \cdot \frac{z_1}{z_2}$$
     với $\text{handSign} = +1$ cho ren phải (Right-hand) và $-1$ cho ren trái (Left-hand).

---

## 2. Giải Thuật Dựng Biên Dạng Ren & Lưới 3D Trục Vít 1 (Bản v1)

### 2.1. Biên dạng dọc trục 1 bước ren `evalWormThreadProfile(uNorm, params)`
Xét tham số pha chuẩn hóa $u \in [-0.5, +0.5]$ tương ứng với khoảng cách dọc trục $x_{\text{abs}} = |u| \cdot p_x \in [0, p_x/2]$ tính từ tâm đỉnh ren ($u = 0$):
- Chiều cao đầu ren $h_{a1} = r_{a1} - r_1$, chiều cao chân ren $h_{f1} = r_1 - r_{f1}$.
- Nửa chiều dày dọc trục trên mặt trụ chia $r_1$: $s_{x1}/2$.
- Nửa bề rộng đỉnh ren tại $r_{a1}$:
  $$x_{\text{tip}} = \frac{s_{x1}}{2} - h_{a1} \tan\alpha_x$$
- **Giải thuật góc lượn chân ren tiếp tuyến giải tích $C^1$ (`C1 Circular Root Fillet`)**:
  * Bán kính góc lượn chân ren $R_f = \min\left(r_{f1}^* m_n, 0.75 h_{f1}, (0.49 p_x - x_{\text{flank,root}})\frac{1 + \sin\alpha_x}{\cos\alpha_x}\right)$.
  * Tọa độ điểm tiếp xúc $C^1$ giữa sườn ren nghiêng góc $\alpha_x$ và cung tròn bán kính $R_f$:
    $$r_T = r_{f1} + R_f (1 - \sin\alpha_x), \quad x_T = \frac{s_{x1}}{2} + (r_1 - r_T) \tan\alpha_x$$
  * Tọa độ điểm tiếp xúc $C^1$ giữa cung tròn $R_f$ và mặt trụ đáy $r_{f1}$:
    $$x_R = x_T + R_f \cos\alpha_x$$
- **4 phân vùng biên dạng trên mỗi nửa bước ren**:
  1. **Đỉnh ren (`tip_land`, $0 \le x_{\text{abs}} \le x_{\text{tip}}$)**: $r = r_{a1}$.
  2. **Sườn ren làm việc (`flank`, $x_{\text{tip}} < x_{\text{abs}} \le x_T$)**:
     $$t = \frac{x_{\text{abs}} - x_{\text{tip}}}{x_T - x_{\text{tip}}}, \quad r(t) = r_{a1} - t(r_{a1} - r_T) + c_{\text{type}} (h_{a1} + h_{f1}) \cdot 4t(1-t)$$
     (trong đó hệ số cong sườn $c_{\text{type}}$ mô phỏng sự khác biệt vi mô giữa ZA $= 0$, ZN $= +0.005$, ZI $= +0.012$, ZK $= -0.010$).
  3. **Cung lượn chân ren $C^1$ (`fillet`, $x_T < x_{\text{abs}} \le x_R$)**:
     $$\Delta x = x_R - x_{\text{abs}}, \quad r = r_{f1} + R_f - \sqrt{R_f^2 - \Delta x^2}$$
  4. **Đáy rãnh ren (`root_land`, $x_R < x_{\text{abs}} \le p_x/2$)**: $r = r_{f1}$.

### 2.2. Quét xoắn ốc (Helical Sweep) & Vát đầu ren mượt Hermite S-Curve
- Tại mỗi lát cắt dọc trục $x \in [-L/2, +L/2]$, độ dịch pha xoắn ốc theo bước xoắn $p_z = z_1 p_x$:
  $$\Delta\phi_{\text{period}}(x) = \text{handSign} \cdot \frac{x}{p_z} \cdot z_1$$
- Ở hai đầu phần cắt ren (chiều dài vát $L_{\text{chamfer}} = (r_{a1} - r_{f1}) \tan\beta_{\text{DXF}}$), bản v1 sử dụng hàm mượt Hermite bậc 3 (S-curve):
  $$s_{\text{thread}}(x) = t^2 (3 - 2t), \quad t = \frac{\min(x + L/2, L/2 - x)}{L_{\text{chamfer}}} \in [0, 1]$$
  để hạ chiều cao ren từ $r_{\text{prof}}$ về mặt trụ chân ren $r_{f1}$ tại $x = \pm L/2$, sau đó nối liền với 2 cổ trục $r_{\text{shaft}} = d_s / 2$ kéo dài tới $x = -l_1$ và $x = +l_2$.

---

## 3. Giải Thuật Dựng Biên Dạng & Lưới 3D Bánh Vít Họng Lõm Globoid 2 (Bản v1)

### 3.1. Mặt cắt họng lõm chữ U (Concave Globoid Throat Radii)
Tại mỗi lát cắt dọc trục bánh vít $z \in [-b_{2H}/2, +b_{2H}/2]$:
- Bán kính cong họng đỉnh răng và chân răng tâm đặt tại trục vít $(0, -a, 0)$:
  $$R_{\text{throat,tip}} = a - \frac{d_{a2}}{2}, \quad R_{\text{throat,root}} = a - \frac{d_{f2}}{2}$$
- Độ nâng họng lõm theo $z$:
  $$\Delta y_{\text{root}}(z) = \sqrt{R_{\text{throat,root}}^2 - z^2}, \quad \Delta y_{\text{tip}}(z) = \sqrt{R_{\text{throat,tip}}^2 - z^2}$$
  $$r_{\text{root,glob}}(z) = a - \Delta y_{\text{root}}(z), \quad r_{\text{tip,glob}}(z) = a - \Delta y_{\text{tip}}(z)$$
  cắt giới hạn bởi đường kính tiện ngoài $r_{e2} = d_{e2}/2$ và góc vát mép vành $\beta_{\text{DXF}}$.

### 3.2. Biên dạng rãnh răng bánh vít có góc lượn chân răng $C^1$ (`generateWheelSliceContour`)
Trên mỗi lát cắt $z$ với bán kính chia cục bộ $r_{\text{pitch},s}(z)$:
- Bề rộng rãnh răng trên vòng chia: $e_{x2} = p_{x,s} - s_{x2}$.
- Từ tâm rãnh răng ($\theta = 0$) đến tâm đỉnh răng ($\theta = +\pi / z_2$), dựng 4 phân đoạn liên tục $C^1$:
  1. Đáy rãnh (`root_land`, $r = r_{\text{root},s}$).
  2. Cung tròn góc lượn chân răng $C^1$ bán kính $R_{f2}$ (`fillet`).
  3. Sườn răng nghiêng góc $\alpha_x$ (`flank`).
  4. Đỉnh răng (`tip_land`, $r = r_{\text{tip},s}$).
- Đối xứng gương qua $\theta = 0$ để thu được chu kỳ 1 răng hoàn chỉnh $[-\pi/z_2, +\pi/z_2)$.

### 3.3. Góc xoắn mặt bao không gian theo cả $(r, z)$ (`3D Cylindrical-Worm Envelope Twist`)
Tại mỗi điểm $(r, z)$ trên thân răng bánh vít, góc cực $\phi_1(r, z)$ nhìn từ tâm trục vít 1 là:
$$\phi_1(r, z) = \text{atan2}(z, a - r)$$
Độ dịch dọc trục của đường xoắn ốc trục vít tại góc $\phi_1(r, z)$ là:
$$x_{\text{worm}}(r, z) = \text{handSign} \cdot \frac{p_z}{2\pi} \cdot \phi_1(r, z)$$
Góc xoắn mặt bao tương ứng trên bánh vít tại bán kính $r$:
$$\Delta\theta_{\text{twist}}(r, z) = \frac{x_{\text{worm}}(r, z)}{r}$$

---

## 4. Đóng Gói Khối Đặc Kín Nước (Watertight Solid B-Rep) & Vỏ Mặt Bên (Open Shell)
- **Khối đặc (`surfaceOnly = false`)**: Kết nối 4 nhóm mặt có vector pháp tuyến hướng ra ngoài (CCW winding):
  1. Mặt ngoài có răng (`outerRings[s] -> outerRings[s+1]`).
  2. Mặt trụ lỗ trục trong (`innerRings[s] -> innerRings[s+1]`).
  3. Nắp phẳng đầu trái/sau (`outerRings[0] <-> innerRings[0]`).
  4. Nắp phẳng đầu phải/trước (`outerRings[S-1] <-> innerRings[S-1]`).
- **Chỉ mặt bên (`surfaceOnly = true`)**: Chỉ xuất các tam giác có cờ `isFlank == true` phục vụ kiểm tra vết tiếp xúc và xuất STEP Surface (`OPEN_SHELL`).
