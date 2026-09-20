# BỘ THƯ VIỆN ĐÓNG KHUNG CÔNG THỨC TOÁN HỌC & HỆ THỐNG THÔNG SỐ CƠ KHÍ
## DỰ ÁN WEB APP TÍNH TOÁN BỘ TRUYỀN ĐỘNG (CHUẨN GỐC MITCALC 1.74)
**Chủ sở hữu**: `SirPhuong` / `Pham Phuong`  
**Tiêu chuẩn chất lượng**: Zero-Tolerance Policy ($\Delta = 0.000000$)  
**Tham chiếu gốc**: MITCalc 1.74 (`Gear1_01.xlsb`, `Gear2_01.xlsb`, ISO 23509, ISO 6336, DIN 3965, DIN 3960)

---

# PHẦN 1: BỘ TRUYỀN BÁNH RĂNG CÔN (BEVEL GEAR - ISO 23509 / GLEASON)

## 1. THÔNG SỐ ĐẦU VÀO & ĐỘNG HỌC (KINEMATICS)
* **Công suất truyền động**: $P$ [kW]
* **Tốc độ quay bánh dẫn**: $n_1$ [vòng/phút]
* **Tỉ số truyền thực tế**:
  $$i = \frac{z_2}{z_1}$$
* **Tốc độ quay bánh bị dẫn**:
  $$n_2 = \frac{n_1}{i}$$
* **Mô-men xoắn danh nghĩa bánh 1**:
  $$M_{k1} = \frac{9550 \cdot P}{n_1} \text{ [Nm]}$$
* **Mô-men xoắn danh nghĩa bánh 2** (có tính hiệu suất $\eta$):
  $$M_{k2} = M_{k1} \cdot i \cdot \eta \text{ [Nm]}$$

---

## 2. GÓC NÓN CHIA & TỌA ĐỘ NÓN (PITCH CONE GEOMETRY)
* **Góc giữa hai trục**: $\Sigma$ [độ] (Mặc định $\Sigma = 90^\circ$)
* **Góc nón chia bánh dẫn 1**:
  $$\delta_1 = \arctan\left(\frac{\sin\Sigma}{\frac{z_2}{z_1} + \cos\Sigma}\right)$$
* **Góc nón chia bánh bị dẫn 2**:
  $$\delta_2 = \Sigma - \delta_1$$
* **Kiểm tra liên hợp**: $\delta_1 + \delta_2 = \Sigma$. Khi $\Sigma = 90^\circ$: $\tan\delta_1 = \frac{z_1}{z_2} = \frac{1}{i}$, $\tan\delta_2 = i$.

---

## 3. MÔ ĐUN & CHIỀU DÀI NÓN TẠI 3 MẶT CẮT (OUTER, MEAN, INNER)
* **Mặt cắt chuẩn hóa**:
  - Ngoài (External - ký hiệu $e$)
  - Trung bình (Mean - ký hiệu $m$)
  - Trong (Internal - ký hiệu $i$)
* **Mô đun pháp trung bình** (đầu vào danh nghĩa): $m_{mn}$ [mm]
* **Mô đun tiếp tuyến trung bình**:
  $$m_{mt} = \frac{m_{mn}}{\cos\beta}$$
* **Đường kính chia trung bình**:
  $$d_{m1} = z_1 \cdot m_{mt}, \quad d_{m2} = z_2 \cdot m_{mt}$$
* **Chiều dài nón trung bình**:
  $$R_m = \frac{d_{m2}}{2 \sin\delta_2} = \frac{d_{m1}}{2 \sin\delta_1}$$
* **Chiều rộng vành răng**: $b$ [mm] (Giới hạn thực nghiệm: $b \le 0.35 R_e$ hoặc $b \le 10 m_{mn}$)
* **Chiều dài nón ngoài & trong**:
  $$R_e = R_m + \frac{b}{2}, \quad R_i = R_m - \frac{b}{2}$$
* **Hệ số tỷ lệ vành răng**: $b/R_e$
* **Mô đun tại mặt cắt ngoài & trong**:
  - Mô đun tiếp tuyến ngoài: $m_{et} = m_{mt} \cdot \frac{R_e}{R_m}$
  - Mô đun pháp ngoài: $m_{en} = m_{et} \cdot \cos\beta$
  - Mô đun tiếp tuyến trong: $m_{it} = m_{mt} \cdot \frac{R_i}{R_m}$
  - Mô đun pháp trong: $m_{in} = m_{it} \cdot \cos\beta$
* **Đường kính vòng chia tại các mặt cắt**:
  - Ngoài: $d_{e1} = z_1 \cdot m_{et}, \quad d_{e2} = z_2 \cdot m_{et}$
  - Trong: $d_{i1} = z_1 \cdot m_{it}, \quad d_{i2} = z_2 \cdot m_{it}$

---

## 4. DỊCH CHỈNH BIÊN DẠNG & CHIỀU CAO RĂNG
* **Hệ số dịch chỉnh biên dạng**: $x_1$, $x_2 = -x_1$ (Hệ truyền động nón đều dịch chỉnh tổng $\Sigma x = 0$)
* **Hệ số dịch chỉnh chiều dày**: $x_{t1} = 0.04$, $x_{t2} = -x_{t1}$
* **Chiều cao đỉnh răng trung bình**:
  $$h_{a1} = m_{mn} \cdot (h_{a0} + x_1), \quad h_{a2} = m_{mn} \cdot (h_{a0} + x_2)$$
* **Chiều cao chân răng trung bình**:
  $$h_{f1} = m_{mn} \cdot (h_{a0} + c_0 - x_1), \quad h_{f2} = m_{mn} \cdot (h_{a0} + c_0 - x_2)$$
* **Góc đỉnh răng (Addendum angle)**:
  $$\delta_{a1} = \arctan\left(\frac{h_{a1}}{R_m}\right), \quad \delta_{a2} = \arctan\left(\frac{h_{a2}}{R_m}\right)$$
* **Góc đáy răng (Dedendum angle)**:
  $$\delta_{f1} = \arctan\left(\frac{h_{f1}}{R_m}\right), \quad \delta_{f2} = \arctan\left(\frac{h_{f2}}{R_m}\right)$$
* **Góc nón đỉnh**:
  $$\delta_{1a} = \delta_1 + \delta_{a1}, \quad \delta_{2a} = \delta_2 + \delta_{a2}$$
* **Góc nón đáy**:
  $$\delta_{1f} = \delta_1 - \delta_{f1}, \quad \delta_{2f} = \delta_2 - \delta_{f2}$$
* **Chiều cao đỉnh ngoài và trong**:
  $$h_{ae1} = h_{a1} + \frac{b}{2} \tan\delta_{a1}, \quad h_{ai1} = h_{a1} - \frac{b}{2} \tan\delta_{a1}$$
  $$h_{ae2} = h_{a2} + \frac{b}{2} \tan\delta_{a2}, \quad h_{ai2} = h_{a2} - \frac{b}{2} \tan\delta_{a2}$$
* **Chiều cao đáy ngoài và trong**:
  $$h_{fe1} = h_{f1} + \frac{b}{2} \tan\delta_{f1}, \quad h_{fi1} = h_{f1} - \frac{b}{2} \tan\delta_{f1}$$
  $$h_{fe2} = h_{f2} + \frac{b}{2} \tan\delta_{f2}, \quad h_{fi2} = h_{f2} - \frac{b}{2} \tan\delta_{f2}$$

---

## 5. ĐƯỜNG KÍNH ĐỈNH & ĐÁY TẠI 3 MẶT CẮT (ISO 23509)
* **Đường kính đỉnh ngoài (Tip diameter outer)**:
  $$d_{ae1} = d_{e1} + 2 h_{ae1} \cos\delta_1, \quad d_{ae2} = d_{e2} + 2 h_{ae2} \cos\delta_2$$
* **Đường kính đỉnh trung bình (Tip diameter mean)**:
  $$d_{am1} = d_{m1} + 2 h_{a1} \cos\delta_1, \quad d_{am2} = d_{m2} + 2 h_{a2} \cos\delta_2$$
* **Đường kính đỉnh trong (Tip diameter inner)**:
  $$d_{ai1} = d_{i1} + 2 h_{ai1} \cos\delta_1, \quad d_{ai2} = d_{i2} + 2 h_{ai2} \cos\delta_2$$
* **Đường kính đáy ngoài (Root diameter outer)**:
  $$d_{fe1} = d_{e1} - 2 h_{fe1} \cos\delta_1, \quad d_{fe2} = d_{e2} - 2 h_{fe2} \cos\delta_2$$
* **Đường kính đáy trung bình (Root diameter mean)**:
  $$d_{fm1} = d_{m1} - 2 h_{f1} \cos\delta_1, \quad d_{fm2} = d_{m2} - 2 h_{f2} \cos\delta_2$$
* **Đường kính đáy trong (Root diameter inner)**:
  $$d_{fi1} = d_{i1} - 2 h_{fi1} \cos\delta_1, \quad d_{fi2} = d_{i2} - 2 h_{fi2} \cos\delta_2$$

---

## 6. CHIỀU DÀY RĂNG & CHIỀU DÀY ĐỈNH RĂNG THÂN KHAI (INVOLUTE THICKNESS)
* **Hàm thân khai (Involute Function)**:
  $$\text{inv}(\alpha) = \tan\alpha - \alpha \text{ (với }\alpha\text{ tính bằng radian)}$$
* **Chiều dày răng trên mặt nón chia**:
  - Pháp ngoài:
    $$s_{ne1} = m_{en} \left(\frac{\pi}{2} + 2 x_1 \tan\alpha + x_{t1}\right), \quad s_{ne2} = m_{en} \left(\frac{\pi}{2} + 2 x_2 \tan\alpha + x_{t2}\right)$$
  - Pháp TB:
    $$s_{n1} = m_{mn} \left(\frac{\pi}{2} + 2 x_1 \tan\alpha + x_{t1}\right), \quad s_{n2} = m_{mn} \left(\frac{\pi}{2} + 2 x_2 \tan\alpha + x_{t2}\right)$$
  - Pháp trong:
    $$s_{ni1} = m_{in} \left(\frac{\pi}{2} + 2 x_1 \tan\alpha + x_{t1}\right), \quad s_{ni2} = m_{in} \left(\frac{\pi}{2} + 2 x_2 \tan\alpha + x_{t2}\right)$$
* **Chiều dày đỉnh răng ngoài (Row 6.36 - $s_{ae}$)**:
  $$\cos\alpha_{ae1} = \frac{d_{e1} \cos\alpha}{d_{ae1}}, \quad s_{ae1} = d_{ae1} \left(\frac{s_{ne1}}{d_{e1}} + \text{inv}(\alpha) - \text{inv}(\alpha_{ae1})\right)$$
  $$\cos\alpha_{ae2} = \frac{d_{e2} \cos\alpha}{d_{ae2}}, \quad s_{ae2} = d_{ae2} \left(\frac{s_{ne2}}{d_{e2}} + \text{inv}(\alpha) - \text{inv}(\alpha_{ae2})\right)$$
* **Chiều dày đỉnh răng trung bình (Row 6.37 - $s_a$)**:
  $$\cos\alpha_{am1} = \frac{d_{m1} \cos\alpha}{d_{am1}}, \quad s_{a1} = d_{am1} \left(\frac{s_{n1}}{d_{m1}} + \text{inv}(\alpha) - \text{inv}(\alpha_{am1})\right)$$
  $$\cos\alpha_{am2} = \frac{d_{m2} \cos\alpha}{d_{am2}}, \quad s_{a2} = d_{am2} \left(\frac{s_{n2}}{d_{m2}} + \text{inv}(\alpha) - \text{inv}(\alpha_{am2})\right)$$
* **Chiều dày đỉnh răng trong (Row 6.38 - $s_{ai}$ - CÔNG THỨC CHUẨN ĐÓNG KHUNG)**:
  $$\cos\alpha_{ai1} = \frac{d_{i1} \cos\alpha}{d_{ai1}}, \quad s_{ai1} = d_{ai1} \left(\frac{s_{ni1}}{d_{i1}} + \text{inv}(\alpha) - \text{inv}(\alpha_{ai1})\right)$$
  $$\cos\alpha_{ai2} = \frac{d_{i2} \cos\alpha}{d_{ai2}}, \quad s_{ai2} = d_{ai2} \left(\frac{s_{ni2}}{d_{i2}} + \text{inv}(\alpha) - \text{inv}(\alpha_{ai2})\right)$$
* **Hệ số chiều dày đỉnh răng đơn vị**:
  $$s_{ae1}^* = \frac{s_{ae1}}{m_{en}}, \quad s_{ae2}^* = \frac{s_{ae2}}{m_{en}}$$

---

## 7. BÁNH RĂNG TRỤ TƯƠNG ĐƯƠNG (TREDGOLD EQUIVALENCE)
* **Số răng ảo pháp diện**:
  $$z_{vn1} = \frac{z_1}{\cos\delta_1}, \quad z_{vn2} = \frac{z_2}{\cos\delta_2}$$
* **Số răng ảo tiếp tuyến**:
  $$z_{v1} = \frac{z_{vn1}}{\cos^3\beta}, \quad z_{v2} = \frac{z_{vn2}}{\cos^3\beta}$$
* **Đường kính vòng chia tương đương TB**:
  $$d_{vm1} = \frac{d_{m1}}{\cos\delta_1}, \quad d_{vm2} = \frac{d_{m2}}{\cos\delta_2}$$
* **Đường kính vòng đỉnh tương đương**:
  $$d_{va1} = d_{vm1} + 2 h_{a1}, \quad d_{va2} = d_{vm2} + 2 h_{a2}$$
* **Đường kính vòng cơ sở tương đương**:
  $$d_{vb1} = d_{vm1} \cos\alpha, \quad d_{vb2} = d_{vm2} \cos\alpha$$
* **Đường kính vòng đáy tương đương**:
  $$d_{vf1} = d_{vm1} - 2 h_{f1}, \quad d_{vf2} = d_{vm2} - 2 h_{f2}$$
* **Khoảng cách trục tương đương**:
  $$a_v = \frac{d_{vm1} + d_{vm2}}{2}$$
* **Tỉ số truyền tương đương**:
  $$i_v = \frac{z_{vn2}}{z_{vn1}} = \frac{z_{v2}}{z_{v1}}$$

---

## 8. HỆ SỐ TRÙNG KHỚP & HIỆU SUẤT (CONTACT RATIOS & EFFICIENCY)
* **Góc tiếp xúc đỉnh răng ảo**:
  $$\cos\alpha_{A1} = \frac{d_{vb1}}{d_{va1}}, \quad \cos\alpha_{A2} = \frac{d_{vb2}}{d_{va2}}$$
* **Hệ số trùng khớp ngang (Transverse Contact Ratio)**:
  $$\varepsilon_\alpha = \frac{z_{vn1}}{2\pi} (\tan\alpha_{A1} - \tan\alpha) + \frac{z_{vn2}}{2\pi} (\tan\alpha_{A2} - \tan\alpha)$$
* **Hệ số trùng khớp dọc (Overlap Contact Ratio)**:
  $$\varepsilon_\beta = \frac{0.85 \cdot b}{m_{mn} \cdot \pi} \sin\beta$$
* **Hệ số trùng khớp tổng**:
  $$\varepsilon_\gamma = \varepsilon_\alpha + \varepsilon_\beta$$
* **Hiệu suất bộ truyền**:
  $$\eta = \begin{cases} 1 - 0.5 \cdot f \cdot \pi \cdot \varepsilon_\gamma \left(\frac{1}{z_1} + \frac{1}{z_2}\right) & \text{khi } \beta = 0^\circ \\ 1 - \frac{f \cdot \pi \cdot \varepsilon_\gamma \left(\frac{1}{z_1} + \frac{1}{z_2}\right)}{4 \cos\beta} & \text{khi } \beta > 0^\circ \end{cases} \quad (f = 0.08)$$

---

## 9. THÔNG SỐ ĐO KIỂM & DUNG SAI CHẾ TẠO (MEASUREMENTS & TOLERANCES)
* **Khoảng cách từ Apex đến mặt sau**:
  $$\text{apex}_1 = R_e \cos\delta_1, \quad \text{apex}_2 = R_e \cos\delta_2$$
* **Đo qua mỏ kẹp bánh răng tại đường kính TB (Tooth Caliper $s_c, h_c$)**:
  $$s_{c1} = d_{m1} \sin\left(\frac{s_{n1}}{d_{m1}}\right), \quad s_{c2} = d_{m2} \sin\left(\frac{s_{n2}}{d_{m2}}\right)$$
  $$h_{c1} = h_{a1} + 0.5 d_{m1} \left(1 - \cos\left(\frac{s_{n1}}{d_{m1}}\right)\right) \cos\delta_1$$
  $$h_{c2} = h_{a2} + 0.5 d_{m2} \left(1 - \cos\left(\frac{s_{n2}}{d_{m2}}\right)\right) \cos\delta_2$$
* **Dung sai chế tạo theo DIN 3965 / ISO 1328**:
  - Hệ số cấp chính xác: $F_Q = 2^{0.5 (Q - 5)}$
  - Sai số bước răng đơn: $f_{pt} = (0.3 m_{mn} + 0.4 \sqrt{d_{m1}} + 4.0) \cdot F_Q$ [$\mu$m]
  - Sai lệch hướng răng: $F_\beta = (0.1 b + 0.1 \sqrt{d_{m1}} + 7.0) \cdot F_Q$ [$\mu$m]
  - Độ đảo hướng tâm: $F_r = (0.5 m_{mn} + 0.8 \sqrt{d_{m1}} + 9.0) \cdot F_Q$ [$\mu$m]

---

## 10. GIẢI THUẬT VẼ MẶT CẮT TRỤC 2D ĐỘNG (CHART 4181 - ZERO CROSSING LINES)
* **18 điểm thực thể Bánh 1** (`Data1!C70:D87`):
  - Gốc nón chia: $C_{63} = -R_i \cos\delta_1, D_{63} = R_i \sin\delta_1$; $C_{64} = -R_e \cos\delta_1, D_{64} = R_e \sin\delta_1$
  - Bù trừ moay-ơ: $H_{1in} = \frac{h_{ae1} + h_{fe1}}{3 + i}$, $H_{1out} = \frac{h_{ae1} + h_{fe1}}{2}$
* **18 điểm thực thể Bánh 2** xoay góc $\Sigma$:
  - $X = r \cos(\phi + \Sigma), Y = r \sin(\phi + \Sigma)$
* **Thứ tự chu trình đa giác chu vi kín sạch (Zero Crossing Lines Algorithm)**:
  $$\text{boundaryIndices} = [0, 1, 2, 3, 14, 15, 16, 17, 10, 11, 8, 7, 6, 5, 0]$$
  - Tô màu ruột `rgba(0, 0, 128, 0.08)` và viền nét đậm `2.0px` màu xanh `#000080`.
  - Hai đường đáy rãnh chân răng (Root lines):
    * Đường đỉnh trên: từ điểm $3 \to 0$ (hoặc $3 \to 4$).
    * Đường đỉnh dưới: từ điểm $9 \to 8$ (hoặc $9 \to 12$).
  - **Triệt tiêu hoàn toàn**: Không vẽ đường nối chéo $12 \to 13$, không gọi `closePath()` từ $17 \to 0$, bảo đảm mặt cắt kim loại phẳng liền mạch 100% không có bất kỳ nét cắt chéo nào!

---

# PHẦN 2: BỘ TRUYỀN BÁNH RĂNG TRỤ (SPUR & HELICAL GEAR - ISO 6336)

## 1. THÔNG SỐ CƠ BẢN & GÓC ĂN KHỚP KHỚP NHAU
* **Mô đun pháp**: $m_n$ [mm]
* **Góc áp lực pháp**: $\alpha_n$ (thường $20^\circ$)
* **Góc xoắn răng**: $\beta$
* **Góc áp lực ngang**:
  $$\alpha_t = \arctan\left(\frac{\tan\alpha_n}{\cos\beta}\right)$$
* **Góc nghiêng cơ sở**:
  $$\beta_b = \arcsin(\sin\beta \cdot \cos\alpha_n)$$
* **Khoảng cách trục chuẩn**:
  $$a = \frac{(z_1 + z_2) m_n}{2 \cos\beta}$$
* **Hệ số dịch chỉnh góc (Involute involute equation)**:
  $$\text{inv}(\alpha_{tw}) = \text{inv}(\alpha_t) + 2 \cdot \frac{x_1 + x_2}{z_1 + z_2} \tan\alpha_n$$
* **Khoảng cách trục làm việc**:
  $$a_w = a \cdot \frac{\cos\alpha_t}{\cos\alpha_{tw}}$$

---

## 2. KÍCH THƯỚC HÌNH HỌC CHI TIẾT
* **Vòng chia**: $d_1 = \frac{z_1 m_n}{\cos\beta}, \quad d_2 = \frac{z_2 m_n}{\cos\beta}$
* **Vòng cơ sở**: $d_{b1} = d_1 \cos\alpha_t, \quad d_{b2} = d_2 \cos\alpha_t$
* **Vòng đỉnh**:
  $$d_{a1} = 2 a_w - d_2 - 2 m_n (h_{a0} + c_0 - x_2), \quad d_{a2} = 2 a_w - d_1 - 2 m_n (h_{a0} + c_0 - x_1)$$
* **Vòng đáy**:
  $$d_{f1} = d_1 - 2 m_n (h_{a0} + c_0 - x_1), \quad d_{f2} = d_2 - 2 m_n (h_{a0} + c_0 - x_2)$$

---

## 3. THÔNG SỐ ĐO KIỂM TRA CHẾ TẠO
* **Chiều dài pháp tuyến chung qua $k$ răng ($W$)**:
  $$k_1 = \text{round}\left(\frac{z_1 \cdot \alpha_n}{180^\circ} + 0.5\right) + \text{correction}$$
  $$W_1 = m_n \cos\alpha_n \left[(k_1 - 0.5) \pi + z_1 \text{inv}(\alpha_t) + 2 x_1 \tan\alpha_n\right]$$
* **Kích thước qua đũa/bi đo ($M$ qua đũa $d_p$)**:
  $$\text{inv}(\phi) = \text{inv}(\alpha_t) + \frac{d_p}{z \cdot m_n \cos\alpha_n} - \frac{\pi - 4 x \tan\alpha_n}{2 z}$$
  $$M = \begin{cases} \frac{d_b}{\cos\phi} + d_p & \text{(khi } z \text{ chẵn)} \\ \frac{d_b}{\cos\phi} \cos\left(\frac{90^\circ}{z}\right) + d_p & \text{(khi } z \text{ lẻ)} \end{cases}$$
