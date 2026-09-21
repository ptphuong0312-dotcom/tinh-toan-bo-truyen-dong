# QUY TRÌNH PHÂN TÍCH VẾT TIẾP XÚC ĂN KHỚP ELIP GLEASON & ĐỘ LỒI RĂNG CÔN (TCA WORKFLOW)

## 1. Mục Đích & Tiêu Chuẩn
- Áp dụng khi kiểm tra, mô phỏng và xuất bản vẽ/mô hình bánh răng côn theo tiêu chuẩn Gleason, ISO 23509 Section 7.5 và AGMA 2005-B88.
- Đảm bảo hình học răng có độ lồi thực thể (Ease-Off Crowning) dọc răng và chiều cao để khử cấn mép gót/mũi (Heel/Toe cấn).
- Cung cấp công cụ Tooth Contact Analysis (TCA) song chế độ: Vết rà elip tĩnh chuẩn Gleason (Rolled Pattern) và vết tiếp xúc động lăn theo pha (Dynamic Rolling Locus).

---

## 2. Các Bước Thực Hiện Chi Tiết

### Bước 1: Dịch Chỉnh Độ Lồi Răng Thực Thể (Tooth Crowning Ease-Off)
1. Trong `modules/bevel-gear/js/engine/bevel-3d-generator.js`:
   - Xác định biến vị trí tương đối dọc chiều rộng vành răng:
     $$u = \frac{R - R_m}{b} \in [-0.5, 0.5]$$
   - Tính lượng giảm độ dày răng danh nghĩa $s_n$:
     $$C_L = \text{isSpiral} ? (m_{mn} \times 0.0035) : (m_{mn} \times 0.0020)$$
     $$s_n(u) = s_n(u) - C_L \cdot (2u)^2$$
   - Tính lượng giảm góc áp lực ảo $\psi_c(t)$ theo chiều cao răng từ chân lên đỉnh ($t \in [0, 1]$):
     $$C_P = m_{mn} \times 0.0015$$
     $$\psi_c(t) = \psi_c(t) \pm \frac{C_P \cdot (2t - 1)^2}{r_c}$$

### Bước 2: Cài Đặt Shader GPU TCA Song Chế Độ
1. Trong `modules/bevel-gear/js/ui/bevel-3d-visualizer.js`:
   - Định nghĩa các biến uniform: `uTcaEnabled`, `uTcaWidth`, `uTcaColorMode`, `uTcaPatternType`, `uCosD`, `uSinD`, `uRm`, `uB`, `uMmn`.
   - Tính tọa độ nón tiếp xúc trong không gian thực thể:
     $$s = x \cos\delta_1 + y \sin\delta_1$$
     $$h = -x \sin\delta_1 + y \cos\delta_1$$
   - **Chế độ 1 (Vết Elip Chuẩn Gleason)**:
     $$s_0 = R_m - 0.08 b, \quad a = 0.28 b \cdot (\text{width}/4.0), \quad b_h = 0.60 m_{mn} \cdot (\text{width}/4.0)$$
     $$ellDist = \sqrt{((s - s_0)/a)^2 + (h/b_h)^2} \le 1.0$$
   - **Chế độ 0 (Tiếp Xúc Động Lăn)**:
     $$s_{\text{contact}} = R_m - \text{normPhase} \cdot (0.38 b), \quad h_{\text{contact}} = \text{normPhase} \cdot (0.45 m_{mn})$$
   - 3 Bảng màu: Laser Ruby (`vec3(1.0, 0.05, 0.22)`), Prussian Blue (`mix(vec3(0.02, 0.25, 0.95), vec3(0.35, 0.85, 1.0), t)`), Thermal Heatmap.

### Bước 3: Đóng Gói Mã Nguồn & Kiểm Thử Tự Động
1. Chạy lệnh đóng gói: `python tools/bundle_all.py`.
2. Chạy bộ kiểm thử chéo QC: `python tests/qc_gear_multi_case_suite.py` (Bắt buộc 110/110 checks PASS tuyệt đối).
3. Kiểm tra bằng mắt trên WebGL qua các chế độ góc nhìn CAD `sel3DViewPreset` ('mesh', 'iso', 'front').

---

## 3. Checklist Nghiệm Thu
- [x] Độ dày răng tại hai đầu $R_i, R_e$ mỏng hơn tại $R_m$ đúng bằng $C_L$.
- [x] Khi bật `🔴 Vết Tiếp Xúc`, cả Bánh dẫn và Bánh bị dẫn đều hiện vết tiếp xúc đối xứng.
- [x] Chế độ Elip Gleason có tâm thiên nhẹ về Toe ($s_0 = R_m - 0.08 b$), dài 56% $b$, cao 60% răng.
- [x] Chế độ Động lăn không bao giờ bị đứt quãng hay biến mất khi nhích từng bước răng.
- [x] Không làm ảnh hưởng đến bất kỳ công thức số học nào trong `bevel-calc-engine.js` (110/110 checks $\Delta = 0.0000$).
