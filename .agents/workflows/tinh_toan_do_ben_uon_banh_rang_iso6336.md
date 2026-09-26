# WORKFLOW: QUY TRÌNH TÍNH TOÁN ĐỘ BỀN UỐN BÁNH RĂNG THEO ISO 6336-3 & XÁC ĐỊNH HỆ SỐ AN TOÀN S_F

**Phiên bản chuẩn**: MITCalc 1.74 / ISO 6336-3:2006 (Method B) / DIN 3990  
**Tác giả**: `SirPhuong` / `Pham Phuong` & AI Antigravity  
**Mục đích**: Cung cấp cẩm nang và quy trình tính toán chi tiết từng bước độ bền uốn chân răng bánh răng trụ răng thẳng & răng nghiêng, từ thông số động học, hình học, tải trọng, hệ số dạng răng đến giới hạn mỏi uốn và suy ra hệ số an toàn $S_F$ chính xác theo thực tế chế tạo máy công nghiệp.

---

## 1. Bản Đồ Tọa Độ Ô Tính & Named Ranges Trong MITCalc (`Gear1_01.xlsb`)

Khi cần tra cứu hoặc kiểm tra chéo trực tiếp với file gốc `C:\MITCalc\gear1\Gear1_01.xlsb`:

| Ký hiệu | Tên thông số kỹ thuật | Tọa độ ô Excel | Named Range trong Excel | Đơn vị |
| :--- | :--- | :---: | :---: | :---: |
| $P_w$ | Công suất truyền động danh nghĩa | `O117` | `_Pw` | kW |
| $n_1, n_2$ | Tốc độ vòng quay (Bánh dẫn / Bánh bị dẫn) | `O118`, `P118` | `_n1`, `_n2` | rpm |
| $M_{k1}, M_{k2}$ | Mô-men xoắn danh nghĩa | `O119`, `P119` | `_Mk1`, `_Mk2` | $\text{N}\cdot\text{m}$ |
| $i$ | Tỉ số truyền | `O120` | `_i` | - |
| `_MatP, _MatW` | Mã chỉ số vật liệu bánh dẫn & bánh bị dẫn | `F125`, `F126` | `_MatP`, `_MatW` | Index (1-51) |
| $K_A$ | Hệ số tải trọng ngoài (chế độ tải máy công tác) | `O336` | `_KA` | - |
| $K_v$ | Hệ số tải trọng động bên trong | `O337` | `_Kv` | - |
| $K_{F\beta}$ | Hệ số phân bố tải không đều trên chiều rộng vành răng | `O355` | `_KFbeta` | - |
| $K_{F\alpha}$ | Hệ số phân bố tải giữa các đôi răng ăn khớp | `O356` | `_KFalfa` | - |
| $K_F$ | Tổng hệ số tải trọng phụ uốn ($K_F = K_A K_v K_{F\beta} K_{F\alpha}$) | `O357` | `_KF` | - |
| $Y_\beta$ | Hệ số góc nghiêng răng uốn | `O358` | `_Ybeta` | - |
| $Y_B$ | Hệ số chiều dày vành răng (vành đặc = 1.0) | `O359`, `P359` | `_YB1`, `_YB2` | - |
| $Y_F$ | Hệ số dạng răng (Lewis-Hofer tại điểm ăn khớp ngoài HPSTC) | `O368`, `P368` | `_YF1`, `_YF2` | - |
| $Y_S$ | Hệ số tập trung ứng suất chân răng | `O369`, `P369` | `_YS1`, `_YS2` | - |
| $\sigma_{F0}$ | Ứng suất uốn danh nghĩa tại chân răng | `O383`, `P383` | `_SigmaF0_1`, `_SigmaF0_2` | MPa |
| $\sigma_F$ | Ứng suất uốn thực tế tại chân răng | `O384`, `P384` | `_SigmaF_1`, `_SigmaF_2` | MPa |
| $\sigma_{F\lim}$ | Giới hạn mỏi uốn cơ sở của vật liệu thử nghiệm chuẩn | `O447`, `P447` | `_BendingLimit1, 2` | MPa |
| $\sigma_{FG}$ | Giới hạn mỏi uốn tính toán của răng thực tế | `O385`, `P385` | `_SigmaFG_1`, `_SigmaFG_2` | MPa |
| $\sigma_{FP}$ | Ứng suất uốn cho phép ($\sigma_{FG} / S_{F\min}$) | `O386`, `P386` | `_SigmaFP_1`, `_SigmaFP_2` | MPa |
| $S_F$ | **Hệ số an toàn uốn chân răng** ($\sigma_{FG} / \sigma_F$) | `O374`, `P374` | `_SF1`, `_SF2` | - |

---

## 2. Quy Trình Tính Toán 5 Bước Tiêu Chuẩn

### Bước 1: Xác Định Tải Trọng Động Học & Lực Vòng $F_t$
1. Mô-men xoắn trên trục bánh dẫn và bánh bị dẫn:
   $$T_1 = \frac{9550 \cdot P}{n_1}\text{ (N}\cdot\text{m)}, \quad T_2 = \frac{9550 \cdot P}{n_2}\text{ (N}\cdot\text{m)}$$
2. Đường kính chia tiêu chuẩn và đường kính lăn làm việc:
   $$d = \frac{z \cdot m_n}{\cos\beta}, \quad d_w = d \cdot \frac{\cos\alpha_t}{\cos\alpha_{wt}}$$
3. Lực vòng danh nghĩa tác dụng tại vòng lăn:
   $$F_t = \frac{2000 \cdot T}{d_w}\text{ (N)}$$

### Bước 2: Tính Toán Hệ Số Dạng Răng $Y_F$ & Tập Trung Ứng Suất $Y_S$ (ISO 6336 Method B)
1. Số răng tương đương của bánh răng nghiêng:
   $$z_n = \frac{z}{\cos^3\beta}$$
2. Xác định điểm đặt tải tại điểm ăn khớp ngoài cùng của đơn đôi răng (HPSTC - Highest Point of Single Tooth Contact).
3. Hệ số dạng răng $Y_F$ tính theo phương pháp tiếp tuyến $30^\circ$ Lewis-Hofer:
   $$Y_F = \frac{6 \cdot h_{Fe} \cdot \cos\alpha_{Fen}}{s_{Fn}^2 \cdot \cos\alpha_n}$$
   *(với $s_{Fn}$ là chiều dày nguy hiểm tại tiết diện chân răng, $h_{Fe}$ là cánh tay đòn uốn).*
4. Hệ số tập trung ứng suất chân răng $Y_S$:
   $$Y_S = (1.2 + 0.13 \cdot s_{Fn} / h_{Fe}) \cdot \left(\frac{s_{Fn}}{2 \rho_F}\right)^{\frac{1}{1.21 + 2.3 \cdot h_{Fe} / s_{Fn}}}$$
5. Hệ số góc nghiêng $Y_\beta$:
   $$Y_\beta = 1 - \varepsilon_\beta \cdot \frac{\min(\beta, 30^\circ)}{120^\circ} \quad (\text{với } \varepsilon_\beta = \frac{b \cdot \sin\beta}{\pi \cdot m_n})$$

### Bước 3: Tính Ứng Suất Uốn Danh Nghĩa $\sigma_{F0}$ & Ứng Suất Thực Tế $\sigma_F$
1. Ứng suất uốn danh nghĩa:
   $$\sigma_{F0} = \frac{F_t}{b \cdot m_n} \cdot Y_F \cdot Y_S \cdot Y_\beta \cdot Y_B$$
2. Tổng hệ số tải trọng phụ uốn:
   $$K_F = K_A \cdot K_v \cdot K_{F\beta} \cdot K_{F\alpha}$$
   - $K_A$: Hệ số tải ngoài (Continuous: 1.0; Light shock: 1.25; Moderate shock: 1.50; Heavy shock: 1.75).
   - $K_v$: Hệ số tải động bên trong theo cấp chính xác ISO 1328 và vận tốc vòng $v = \frac{\pi d n}{60000}\text{ m/s}$.
   - $K_{F\beta}$: Phân bố tải theo chiều rộng vành răng, phụ thuộc tỉ số $\frac{b}{d_1}$ và kết cấu gối đỡ (Symmetrical: $1.05 \div 1.15$; Overhung: $1.35 \div 1.45$).
   - $K_{F\alpha}$: Phân bố tải giữa các răng ($K_{F\alpha} = 1.0$ cho tải nặng hoặc răng nghiêng mài chuẩn).
3. Ứng suất uốn thực tế sinh ra tại chân răng:
   $$\sigma_F = \sigma_{F0} \cdot K_F$$

### Bước 4: Xác Định Khả Năng Chịu Uốn Giới Hạn Của Răng Thực Tế $\sigma_{FG}$
$$\sigma_{FG} = \sigma_{F\lim} \cdot Y_X \cdot Y_R \cdot Y_\delta \cdot Y_{NT} \cdot Y_A$$
- $\sigma_{F\lim}$: Giới hạn mỏi uốn cơ sở của vật liệu (tra CSDL vật liệu, ví dụ SCM420 tôi thấm 58-60 HRC: $\sigma_{F\lim} = 700\text{ MPa}$).
- $Y_X$: Hệ số kích thước mô đun (với $m_n \le 5\text{ mm} \implies Y_X = 1.0$; với $m_n = 12\text{ mm} \implies Y_X = 0.93$).
- $Y_R$: Hệ số nhám bề mặt góc lượn đáy rãnh ($Y_R = 1.004$ khi mài/lăn nhẵn).
- $Y_\delta$: Hệ số nhạy cảm tập trung ứng suất đáy rãnh ($Y_\delta \approx 0.996$).
- $Y_{NT}$: Hệ số tuổi thọ mỏi uốn ($Y_{NT} = (\frac{N_{F\lim}}{N_L})^{1/q_F}$, với $N_L > 3 \times 10^6$ chu kỳ $\implies Y_{NT} \approx 0.97 \div 1.0$).
- $Y_A$: Hệ số chiều quay ($Y_A = 1.0$ quay 1 chiều; $Y_A \approx 0.70$ đảo chiều thường xuyên).

### Bước 5: Suy Ra Hệ Số An Toàn Uốn $S_F$ & Đánh Giá
$$S_F = \frac{\sigma_{FG}}{\sigma_F}$$
Hoặc so với ứng suất cho phép $\sigma_{FP} = \sigma_{FG} / S_{F\min}$:
$$S_F = \frac{\sigma_{FP}}{\sigma_F} \cdot S_{F\min}$$

---

## 3. Thang Đo Đánh Giá $S_F$ Chuẩn Kỹ Thuật Chế Tạo Máy

| Giá trị $S_F$ | Đánh giá trạng thái | Rủi ro kỹ thuật & Hành động |
| :---: | :--- | :--- |
| **$S_F < 1.0$** | **Gãy răng tức thì hoặc mỏi rất nhanh** | Ứng suất vượt quá độ bền vật liệu. Bắt buộc tăng mô đun $m_n$ hoặc tăng $b$. |
| **$1.0 \le S_F < 1.3$** | **Nguy hiểm - Tiệm cận phá hủy** | Xuất hiện vết nứt mỏi sau thời gian ngắn, nguy cơ gãy khi quá tải tức thời. |
| **$1.4 \le S_F \le 1.8$** | **VÙNG CHUẨN TỐI ƯU CÔNG NGHIỆP** | Đảm bảo tuổi thọ $20,000 \div 50,000\text{ h}$, kết cấu gọn nhẹ, kinh tế nhất. |
| **$1.8 < S_F \le 2.2$** | **An toàn cao** | Phù hợp thiết bị quan trọng, chi phí dừng máy cao (nhà máy xi măng, nhiệt điện). |
| **$S_F > 2.5$** | **Dư bền nhiều (Overdesigned)** | Thừa vật liệu và trọng lượng, trừ các cơ cấu nâng chở người (thang máy, tời mỏ). |

---

## 4. Case Study Thực Nghiệm: Vành Răng Công Nghiệp Nặng $z_2 = 81, z_1 = 20$

* **Thông số đầu vào**:
  * Động cơ: $P = 250\text{ kW}, n_{\text{đc}} = 730\text{ rpm}, i_{\text{tổng}} = 73 \implies n_2 = 10\text{ rpm}, n_1 = 40.5\text{ rpm}$.
  * Hình học: $z_1 = 20, z_2 = 81, m_n = 12\text{ mm}, \alpha_n = 20^\circ, \beta = 12^\circ, b = 410\text{ mm}, D_w = 990\text{ mm}$.
  * Vật liệu: Thép SCM420 thấm carbon tôi bề mặt 58-60 HRC ($\sigma_{F\lim} = 700\text{ MPa}$).
* **Hình học dịch chỉnh ngược từ $D_w = 990\text{ mm}$**:
  * $a = 619.538\text{ mm}, a_w = 617.222\text{ mm} \implies \cos\alpha_{wt} = 0.94075 \implies \alpha_{wt} = 19.822^\circ$.
  * Tổng dịch chỉnh: $\Sigma x = -0.1904$ (Bánh nhỏ $x_1 = 0$, bánh lớn $x_2 = -0.1904$).
* **Lực & Ứng suất danh nghĩa**:
  * $T_2 = 238,750\text{ N}\cdot\text{m}$, $F_t = 482,323\text{ N}$.
  * $Y_{F2} = 1.257, Y_{S2} = 2.070, Y_\beta = 0.900 \implies \sigma_{F0} = \mathbf{229.65\text{ MPa}}$.
  * Khả năng chịu uốn giới hạn của răng: $\sigma_{FG} = \mathbf{633.50\text{ MPa}}$.
* **Kết quả theo các chế độ vận hành thực tế**:
  1. *Lý thuyết tải êm ($K_A = 1.0, K_{F\beta} = 1.035$)*: $\sigma_{F2} = 237.98\text{ MPa} \implies S_F = \mathbf{2.66}$ (Dư bền lý thuyết).
  2. *Thực tế xưởng chuẩn gối đối xứng ($K_A = 1.50, K_{F\beta} = 1.035$)*: $\sigma_{F2} = \mathbf{356.97\text{ MPa}} \approx \mathbf{357\text{ MPa}} \implies S_{F2} = \mathbf{1.77}$ (Bánh nhỏ $\sigma_{F1} = 369.62\text{ MPa} \implies S_{F1} = \mathbf{1.66}$ - **Chuẩn vàng tối ưu**).
  3. *Thực tế xưởng có độ lệch trục nhẹ ($K_A = 1.50, K_{F\beta} = 1.125$)*: $\sigma_{F2} = 388.10\text{ MPa} \implies S_{F2} = \mathbf{1.63}$ (Vẫn rất an toàn).
  4. *Va đập mạnh ($K_A = 1.75, K_{F\beta} = 1.125$)*: $\sigma_{F2} = 452.87\text{ MPa} \implies S_{F2} = \mathbf{1.40}$ (Ngưỡng an toàn tối thiểu theo ISO).
  5. *Va đập mạnh + Vành răng hở/công xôn ($K_A = 1.75, K_{F\beta} = 1.375$)*: $\sigma_{F2} = 553.14\text{ MPa} \implies S_{F2} = \mathbf{1.14}$ (Nguy cơ nứt mỏi).

---

## 4.2. Case Study Thực Nghiệm 2: Bộ Bánh Răng Công Nghiệp Nặng $z_1 = 17, z_2 = 69, m_n = 14\text{ mm}$ ($x_1 = x_2 = 0$)

* **Thông số đầu vào**:
  * Công suất $P = 250\text{ kW}$, tốc độ bánh lớn $n_2 = 10.0\text{ rpm} \implies n_1 = 10 \times \frac{69}{17} = 40.59\text{ rpm}$ ($i = 4.059$).
  * Hình học: $z_1 = 17, z_2 = 69, m_n = 14.0\text{ mm}, \alpha_n = 20^\circ, \beta = 12^\circ, x_1 = x_2 = 0, b = 410\text{ mm}$.
  * Đường kính chia = lăn: $d_1 = d_{w1} = 243.317\text{ mm}, d_2 = d_{w2} = 987.581\text{ mm}, a = a_w = 615.449\text{ mm}$.
  * Vật liệu: Thép SCM420 thấm carbon tôi bề mặt 58-62 HRC ($\sigma_{F\lim} = 700\text{ MPa}$).
* **Lực & Ứng suất danh nghĩa (Khớp 100% với MITCalc 1.74)**:
  * $T_1 = 58,822.5\text{ N}\cdot\text{m}$, $T_2 = 238,750.0\text{ N}\cdot\text{m}$.
  * $F_t = 483,504.6\text{ N}$, $F_r = 179,912.8\text{ N}$, $F_a = 102,772.1\text{ N}$, $F_n = 526,029.9\text{ N}$, $v = 0.517\text{ m/s}$.
  * Hệ số dạng răng & tập trung ứng suất:
    - Bánh nhỏ ($z_1 = 17, z_{n1} = 18.07$): $Y_{F1} = 1.596, Y_{S1} = 1.807 \implies Y_{FS1} = 2.883$.
    - Bánh lớn ($z_2 = 69, z_{n2} = 73.34$): $Y_{F2} = 1.270, Y_{S2} = 2.117 \implies Y_{FS2} = 2.688$.
    - $Y_\beta = 0.900$ ($\varepsilon_\beta = 1.938 > 1.0$), $Y_B = 1.000$.
  * Ứng suất uốn danh nghĩa:
    - Bánh nhỏ: $\sigma_{F0,1} = \mathbf{218.58\text{ MPa}}$ (giảm $8.1\%$ so với bộ $m_n = 12$).
    - Bánh lớn: $\sigma_{F0,2} = \mathbf{203.74\text{ MPa}}$ (giảm $11.3\%$ so với bộ $m_n = 12$).
  * Khả năng chịu uốn giới hạn của răng ($Y_X = 1.05 - 0.01 \cdot m_n = 0.910$):
    - Bánh nhỏ: $\sigma_{FG1} = \mathbf{600.17\text{ MPa}}$.
    - Bánh lớn: $\sigma_{FG2} = \mathbf{619.88\text{ MPa}}$.
* **Kết quả ở Chế độ 2 ($K_A = 1.50$)**:
  1. *Trường hợp 2A — Gối đỡ đối xứng chuẩn ($K_{F\beta} = 1.035 \implies K_F = 1.554$)*:
     - Bánh lớn ($z_2 = 69$): $\sigma_{F2} = \mathbf{316.61\text{ MPa}} \approx \mathbf{317\text{ MPa}} \implies S_{F2} = \mathbf{1.96}$ (**An toàn cao**).
     - Bánh nhỏ ($z_1 = 17$): $\sigma_{F1} = \mathbf{339.67\text{ MPa}} \approx \mathbf{340\text{ MPa}} \implies S_{F1} = \mathbf{1.77}$ (**Chuẩn vàng tối ưu**).
  2. *Trường hợp 2B — Dự phòng độ lệch trục đàn hồi nhẹ ($K_{F\beta} = 1.125 \implies K_F = 1.688$)*:
     - Bánh lớn ($z_2 = 69$): $\sigma_{F2} = \mathbf{343.91\text{ MPa}} \approx \mathbf{344\text{ MPa}} \implies S_{F2} = \mathbf{1.80}$ (**Chuẩn vàng tối ưu**).
     - Bánh nhỏ ($z_1 = 17$): $\sigma_{F1} = \mathbf{368.96\text{ MPa}} \approx \mathbf{369\text{ MPa}} \implies S_{F1} = \mathbf{1.63}$ (**An toàn rất tốt**).

---

## 5. Quy Chuẩn Biên Soạn Báo Cáo Chuyên Nghiệp & Xuất File Word Bàn Giao Đối Tác

1. **Nguyên tắc vận hành Zero-Web**:
   - Theo chỉ đạo của SirPhuong: Toàn bộ nghiệp vụ tính toán độ bền uốn và xuất báo cáo Word được thực hiện hoàn toàn độc lập, **tuyệt đối không đưa lên Web App** nhằm bảo tồn sự tinh gọn của giao diện theo Quy Tắc 1.
2. **Quy chuẩn lọc thông số đầu vào (12 thông số thiết yếu — Lược bỏ $x_1/x_2$ và $d_{w2}$)**:
   - Theo lệnh trực tiếp từ SirPhuong: *"lưu ý cho tôi trong bảng thông số đầu vào bỏ các thông số này trong bảng : bỏ hệ số dịch chỉnh, bỏ đường kính bánh lớn"*.
   - Giữ lại đúng 12 thông số đầu vào cốt lõi trong Bảng 1: $P, n_1, n_2, i, z_1 / z_2, m_n, \alpha_n, \beta, b, K_A$, Vật liệu SCM420, $\sigma_{F\lim}$.
3. **Bộ script xuất bản tự động 1-Click**:
   - File thực thi: `tools/generate_bending_stress_word_report.py`.
   - Lệnh chạy: `python tools/generate_bending_stress_word_report.py`.
   - File đầu ra: `BAO_CAO_TINH_TOAN_UNG_SUAT_UON_BANH_RANG.docx` và `BAO_CAO_TINH_TOAN_UNG_SUAT_UON_BANH_RANG_Z17_69_M14.docx` tại thư mục gốc dự án.

