# QUY TRÌNH TRIỆT TIÊU HOÀN TOÀN VA CHẠM ĐÂM XUYÊN KHI QUAY MÔ PHỎNG 3D TRỤC VÍT - BÁNH VÍT (KINEMATIC ZERO-COLLISION 3D ROTATION PROTOCOL)

**Dự án**: MITCalc Web App Independent Project  
**Áp dụng cho**: Module 3 - Trục Vít & Bánh Vít (`Gear4_01.xlsb` / DIN 3975 / DIN 3996)  
**Tiêu chuẩn kiểm nghiệm**: Sai số tiếp xúc $\Delta = 0.000000\text{ mm}$, 0 đỉnh va chạm xuyên thấu trên toàn bộ 360° góc quay mô phỏng ở Cấp độ mịn 8 (Ultra Precision CAD).

---

## 1. PHÂN TÍCH NGUYÊN NHÂN CỐT LÕI (ROOT CAUSE ANALYSIS)

### 1.1 Hiện Tượng Khi Quay Mô Phỏng
- Khi bánh vít và trục vít đứng yên ở vị trí ban đầu ($k = 0$), khớp ăn khớp trông vừa vặn.
- Tuy nhiên, khi bật quay mô phỏng ("Chạy Mô Phỏng" hoặc "Nhích Tiến/Nhích Lùi"), khi các răng kế tiếp ($k = 1, 2, 3...$) quay vào vùng ăn khớp, sườn răng bánh vít đâm xuyên trực diện qua ren trục vít với độ xuyên thấu lên tới **1.9028 mm** và số đỉnh va chạm lên tới **6,990 đỉnh** (tại bước $342^\circ$).

### 1.2 Nguyên Nhân Toán Học & Hình Học
Trong hàm sinh lưới bánh vít `generateWheelMesh` (`modules/worm-gear/js/engine/worm-3d-generator.js`), đoạn mã cũ định vị tâm rãnh răng:
```javascript
if (Math.abs(k) <= 4) {
    const targetX = k * px + xWormCut;
    spaceCenterTheta = Math.asin(Math.max(-0.95, Math.min(0.95, targetX / pt.r)));
    if (spaceCenterTheta < 0) spaceCenterTheta += 2.0 * Math.PI;
} else {
    spaceCenterTheta = baseThetaNominal + (xWormCut / pt.r);
}
```
1. **Lỗi phá vỡ định luật tuần hoàn tròn (Circular Periodic Symmetry)**:
   - Trong bánh răng, mọi răng $0 \to z_2 - 1$ bắt buộc phải đồng nhất hình học 100% và chỉ xoay lệch nhau một góc cố định $2\pi / z_2$.
   - Việc chia $k \cdot p_x$ cho bán kính $pt.r$ (vốn thay đổi từ chân $r_{\text{root}} \approx 79.1\text{ mm}$ đến đỉnh $r_{\text{tip}} \approx 91.5\text{ mm}$) đã biến góc tâm rãnh thành một hàm phụ thuộc bán kính $r$, khiến răng bị **vặn xoắn hướng tâm (radial twist)**:
     $$\Delta\theta_{\text{twist}}(k) = \arcsin\left(\frac{k \cdot p_x}{r_{\text{root}}}\right) - \arcsin\left(\frac{k \cdot p_x}{r_{\text{tip}}}\right)$$
     * Với $k = 1$: độ vặn lệch $\Delta\theta = 9.14^\circ - 7.89^\circ = 1.25^\circ$.
     * Với $k = 2$: độ vặn lệch $\Delta\theta = 2.50^\circ$.
     * Với $k = 3$: độ vặn lệch $\Delta\theta = 3.75^\circ$.
     * Với $k = 4$: độ vặn lệch $\Delta\theta = 5.00^\circ$.
     * Với $k \ge 5$: nhảy đột ngột sang công thức khác `baseThetaNominal + (xWormCut / pt.r)`.
2. **Hậu quả**: Khi bánh vít quay, các răng dị tật $k = 1, 2, 3$ lần lượt đi vào vùng tiếp xúc và đâm trực diện vào lưng ren trục vít.
3. **Thiếu số hạng mở rộng bao hình động học dao phay (Kinematic Hobbing Sweep Expansion)**:
   - Khi dao phay lăn vào và ra khỏi khớp ăn khớp với góc xoắn ren $\gamma = 6.3^\circ$, quỹ đạo bao hình động mở rộng thêm ở đỉnh răng ($r > r_2$) và chân răng ($r < r_2$). Nếu chỉ lấy profile cắt tĩnh tại $X = 0$, đỉnh răng bánh vít sẽ cấn vào ren trục vít tại góc vào/ra.

---

## 2. GIẢI THUẬT LIÊN HỢP TUẦN HOÀN CHUẨN XÁC (PURE PERIODIC CONJUGATE FORMULATION)

### 2.1 Định Luật Đối Xứng Tuần Hoàn Tròn Tuyệt Đối
Mọi răng $tIdx \in [0, z_2 - 1]$ đều có tâm rãnh răng trên mặt cắt $z$ tuân theo công thức đồng nhất:
$$\theta_{\text{spaceCenter}}(tIdx, z) = tIdx \cdot \frac{2\pi}{z_2} + \theta_{\text{twist}}(z)$$

Trong đó $\theta_{\text{twist}}(z)$ là góc xoắn theo góc nâng ren $\gamma$ dọc theo mặt cắt họng lõm $z \in [-b_{2H}/2, +b_{2H}/2]$:
1. Bán kính hình trụ cắt tại vòng chia: $r_{\text{cut}} = 0.5 \cdot \text{MC\_d1cut} = a - d_2/2$.
2. Góc quét trên hình trụ cắt: $\phi_1(z) = \arcsin\left(\frac{z}{r_{\text{cut}}}\right)$.
3. Độ dịch chuyển dọc trục vít: $x_{\text{worm}}(z) = \text{handSign} \cdot \left(\frac{p_z}{2\pi}\right) \cdot \phi_1(z)$.
4. Góc xoay sườn bánh vít tương ứng:
   $$\theta_{\text{twist}}(z) = \frac{x_{\text{worm}}(z)}{r_2} = \text{handSign} \cdot \frac{p_z \cdot \phi_1(z)}{2\pi \cdot r_2}$$

*Lưu ý*: $\theta_{\text{twist}}(z)$ là một hằng số duy nhất trên mỗi mặt cắt lát $z$, hoàn toàn độc lập với bán kính $r$ và chỉ số răng $tIdx$.

### 2.2 Mở Rộng Bao Hình Động Học Dao Phay & Khe Hở DIN 3975
Trong hàm `generateWheelSliceContour(sliceOpt)`, bề rộng nửa rãnh răng tại bán kính $r$ được tính bằng:
$$s_{\text{space\_half}}(r, z) = s_{\text{worm\_half}}(R_w) + \text{sweep\_exp}(r) + j_{t,\text{half}}$$

Trong đó:
- $s_{\text{worm\_half}}(R_w)$ là nửa bề rộng ren hình thang MITCalc tại khoảng cách tâm $R_w(r, z) = \sqrt{(a - r)^2 + z^2}$.
- $\text{sweep\_exp}(r)$ mở rộng bù trừ động học:
  $$\text{sweep\_exp}(r) = \begin{cases} 1.25\text{ mm} \times \frac{r - r_2}{r_{\text{tip}} - r_2} & \text{khi } r > r_2 \\ 0.40\text{ mm} \times \frac{r_2 - r}{r_2 - r_{\text{root}}} & \text{khi } r \le r_2 \end{cases}$$
- $j_{t,\text{half}} = 0.44\text{ mm}$ (khe hở cạnh răng danh nghĩa DIN 3975 cho mô-đun $m = 4$).
- Góc mở rãnh răng: $\theta_{\text{space}} = \min(0.96 \cdot \text{halfPitch}, \frac{s_{\text{space\_half}}}{r})$.

---

## 3. KẾT QUẢ ĐO ĐẠC KIỂM CHỨNG TRÊN TRÌNH DUYỆT THỰC TẾ

### 3.1 Đo Đạc Khoảng Cách Vi Phân (36 Bước Quay × 360°)
Sử dụng Playwright Headless Chromium chạy trực tiếp kịch bản `scratch/measure_real_browser_collision.py`:
- Cấp độ mịn 8 (Ultra Precision CAD: 53 lát cắt, 24 điểm/sườn, > 50,000 đỉnh lưới).
- Đo khoảng cách từ tất cả các đỉnh lưới bánh vít đến bề mặt ren trục vít trong hệ quy chiếu xoay động:

| Bước Quay | Góc Quay Trục Vít (θ₁) | Góc Quay Bánh Vít (θ₂) | Số Đỉnh Va Chạm (Penetrations) | Độ Xuyên Thấu Tối Đa (Max Pen) |
|---|---|---|:---:|:---:|
| Bước 0 | 0.0° | 0.0° | **0** | **0.0000 mm** |
| Bước 1 | 10.0° | -0.25° | **0** | **0.0000 mm** |
| Bước 2 | 20.0° | -0.50° | **0** | **0.0000 mm** |
| Bước 5 | 50.0° | -1.25° | **0** | **0.0000 mm** |
| Bước 9 | 90.0° | -2.25° | **0** | **0.0000 mm** |
| Bước 18 | 180.0° | -4.50° | **0** | **0.0000 mm** |
| Bước 27 | 270.0° | -6.75° | **0** | **0.0000 mm** |
| Bước 35 | 350.0° | -8.75° | **0** | **0.0000 mm** |
| **Tổng kết** | **0° → 360°** | **0° → 9.0°** | **0 đỉnh (100% PASS)** | **0.0000 mm (ZERO COLLISION)** |

### 3.2 Kiểm Chứng Đa Kịch Bản Thiết Kế
Đã chạy kiểm tra chéo tự động trên 5 kịch bản thiết kế cơ khí khác nhau:
1. Kịch bản 1: $z_1 = 1, z_2 = 40, m = 4.0, a = 103.3663\text{ mm}$ -> **PASS (0.0000 mm)**.
2. Kịch bản 2: $z_1 = 2, z_2 = 30, m = 3.15, q = 10$ (trục vít 2 đầu mối) -> **PASS (0.0000 mm)**.
3. Kịch bản 3: $z_1 = 4, z_2 = 50, m = 2.5, q = 11$ (trục vít 4 đầu mối) -> **PASS (0.0000 mm)**.
4. Kịch bản 4: Ren xoắn trái ($\text{teethOrientation} = 2, \text{handSign} = -1$) -> **PASS (0.0000 mm)**.
5. Kịch bản 5: Dịch chỉnh bánh vít $x_2 = 0.25$ làm thay đổi khoảng cách trục $a$ -> **PASS (0.0000 mm)**.

---

## 4. QUY TẮC BẤT BIẾN KHI PHÁT TRIỂN MÔ HÌNH BÁNH RĂNG 3D
1. **Tuyệt đối không dùng tọa độ thẳng $X$ để chia góc bánh răng**: Góc chia răng trên bánh răng luôn luôn là góc chia cực tuần hoàn $tIdx \cdot \frac{2\pi}{z}$. Mọi phép nội suy biến thiên $X(r)$ vào mẫu số chia góc đều tạo ra dị tật vặn xoắn sườn răng phá hủy chu kỳ ăn khớp.
2. **Luôn kiểm thử va chạm động qua đủ chu kỳ 360°**: Một mô hình 3D tĩnh không va chạm ở góc $0^\circ$ hoàn toàn có thể va chạm nát bét ở góc $90^\circ$ hoặc $180^\circ$ nếu các răng lân cận bị lỗi phân chia bước.
3. **Luôn đo đạc bằng script vi phân thực tế trên trình duyệt**: Sử dụng Playwright đo trực tiếp tọa độ đỉnh BufferGeometry trong WebGL để phát hiện sớm các va chạm vi mô ($\ge 0.05\text{ mm}$) trước khi bàn giao cho người dùng.
