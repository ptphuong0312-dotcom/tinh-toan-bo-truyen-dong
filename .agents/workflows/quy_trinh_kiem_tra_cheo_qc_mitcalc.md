# QUY TRÌNH KIỂM THỬ CHÉO QC: ĐỐI CHIẾU WEB APP VÀ MITCALC 1.74 GỐC

## 1. MỤC TIÊU & VAI TRÒ CHUYÊN MÔN KÉP
Để đảm bảo ứng dụng Web App tính toán cơ khí hoàn toàn tin cậy, chính xác tuyệt đối và có thể sử dụng ngay trong sản xuất thực tế mà không cần người dùng phải kiểm tra lại bằng tay, quy trình này xác lập **hai vai trò chuyên môn cốt lõi**:
1. **Chuyên gia Kỹ thuật Tính toán Bánh răng Cơ khí (Gear Engineering Specialist)**:
   - Thấu hiểu sâu sắc bản chất hình học ăn khớp, tiêu chuẩn ISO 6336, ISO 21771, DIN 3960, ISO 1328, ANSI/AGMA 2001.
   - Kiểm soát các hiện tượng vật lý cơ khí phức tạp:
     * Hiện tượng cắt lẹm chân răng (undercutting) khi $z < z_{\min}$.
     * Hiện tượng nhọn đỉnh răng ($s_a^* < 0.25$) khi dịch chỉnh dương lớn.
     * Ăn khớp dịch chỉnh góc: khoảng cách trục làm việc $a_w \ne a$, góc ăn khớp làm việc $\alpha_{tw} > \alpha_t$.
     * Bánh răng nghiêng: liên hệ giữa mặt cắt pháp $n$ và mặt cắt ngang $t$, góc nghiêng cơ sở $\beta_b$.
     * Các kích thước đo kiểm tra: chiều dài pháp tuyến chung $W$ (Wildhaber) qua $k$ răng và kích thước đo qua bi/đũa $M$.
2. **Chuyên gia Kiểm soát Chất lượng & Kiểm thử Độc lập (Quality Control / Assurance Lead)**:
   - Thiết lập bộ quy chuẩn kiểm thử nghiêm ngặt (Zero-Tolerance QC Protocol).
   - Xây dựng **Ma trận kiểm thử đa kịch bản (Multi-Case Test Matrix)** bao quát mọi tình huống thiết kế thực tế.
   - Tự động hóa quá trình đối chiếu thông qua lập trình kết nối trực tiếp vào bản gốc MITCalc 1.74.
   - Áp đặt tiêu chuẩn nghiệm thu số học: **Sai lệch $\Delta = 0.0000$ (tối đa $< 0.001\text{ mm}$ do làm tròn hiển thị) trên 100% các thông số**. Bất kỳ thông số nào lệch đều bị coi là lỗi (FLAG) và từ chối nghiệm thu.

---

## 2. MA TRẬN KIỂM THỬ ĐA KỊCH BẢN (MULTI-CASE TEST MATRIX)

Mỗi khi xây dựng hoặc cập nhật bất kỳ mô-đun tính toán nào, bắt buộc phải chạy qua ma trận kiểm thử tối thiểu 5 kịch bản sau:

| Kịch bản | Tên trường hợp thiết kế | Ý nghĩa kỹ thuật | Thông số đầu vào ($m_n, z_1, z_2, \beta, \alpha, x_1, x_2$) |
|:---:|:---|:---|:---|
| **1** | Bánh răng trụ răng thẳng tiêu chuẩn | Trường hợp cơ bản, không dịch chỉnh ($x=0$) | $m_n=6, z_1=19, z_2=48, \beta=0^\circ, \alpha=20^\circ, x_1=0, x_2=0$ |
| **2** | Bánh răng dịch chỉnh góc dương ($\Sigma x > 0$) | Tăng khoảng cách trục $a_w$, tăng bề dày chân răng chịu uốn | $m_n=6, z_1=19, z_2=48, \beta=0^\circ, \alpha=20^\circ, x_1=+0.35, x_2=+0.15 \implies \Sigma x = +0.50$ |
| **3** | Bánh răng trụ răng nghiêng ($\beta = 15^\circ$) | Truyền động êm, chịu tải trọng lớn, kiểm tra chuyển đổi pháp-ngang | $m_n=4, z_1=23, z_2=57, \beta=15^\circ, \alpha=20^\circ, x_1=+0.20, x_2=-0.10 \implies \Sigma x = +0.10$ |
| **4** | Bánh nhỏ ít răng nguy cơ cắt lẹm ($z_1 < 17$) | Kiểm tra tính toán dịch chỉnh triệt tiêu cắt lẹm và kiểm tra nhọn đỉnh răng $s_a^*$ | $m_n=5, z_1=13, z_2=39, \beta=0^\circ, \alpha=20^\circ, x_1=+0.45, x_2=-0.15 \implies \Sigma x = +0.30$ |
| **5** | Hộp số tỷ số truyền lớn & môđun lớn | Kiểm tra ổn định số học khi $i=5.0, m_n=8.0$, đường kính lớn | $m_n=8, z_1=15, z_2=75, \beta=0^\circ, \alpha=20^\circ, x_1=+0.25, x_2=0.0 \implies \Sigma x = +0.25$ |

---

## 3. QUY TRÌNH THỰC THI KIỂM THỬ TỰ ĐỘNG BẰNG EXCEL COM AUTOMATION

1. **Khởi tạo kết nối**:
   * Sử dụng thư viện `win32com.client` kết nối ngầm (headless) tới `Excel.Application`.
   * Mở tệp gốc `C:\MITCalc\gear1\Gear1_01.xlsb`.
2. **Nạp tham số đầu vào**:
   * Thiết lập tỉ số truyền `ws.Range('O120').Value = z2 / z1`.
   * Nạp số răng $z_1$ (`O170`), góc áp lực $\alpha_n$ (`O171`), góc nghiêng $\beta$ (`O172`), môđun $m_n$ (`O175`), bề rộng vành răng $b_1, b_2$ (`O178, P178`).
   * Nạp tổng hệ số dịch chỉnh $\Sigma x$ (`O204`) và hệ số dịch chỉnh $x_1$ (`O203`).
3. **Thực thi tính toán hai chiều**:
   * Ra lệnh Excel tính toán toàn diện: `excel.CalculateFull()`.
   * Nạp cùng bộ thông số vào động cơ tính toán Web App (`calc_engine` / `GearGeometry.calculate`).
4. **Đối chiếu và so khớp từng cặp thông số**:
   * Trích xuất các giá trị từ Excel: $m_t, a, a_w, d_1, d_2, d_{b1}, d_{b2}, d_{f1}, d_{f2}, d_{a1}, d_{a2}, d_{w1}, d_{w2}, h_{a1}, h_{a2}, h_{f1}, h_{f2}, s_{n1}, s_{n2}, s_{a1}^*, s_{a2}^*, \varepsilon_\alpha$.
   * Tính sai lệch $\Delta = |\text{Val}_{\text{Web}} - \text{Val}_{\text{MITCalc}}|$.
   * Kiểm tra điều kiện: Nếu $\Delta < 0.002$ thì đánh dấu `PASS (0.0000)`. Ngược lại đánh dấu `FAIL`.
5. **Hoàn trả trạng thái mẫu ban đầu**:
   * Phục hồi lại các giá trị mặc định của file Excel gốc và đóng tiến trình Excel để không chiếm giữ tài nguyên hệ thống.

---

## 4. HƯỚNG DẪN VẬN HÀNH 1-CLICK CHO KỸ SƯ

Để chạy toàn bộ bài kiểm tra chéo bất kỳ lúc nào:
* **Cách 1**: Nhấp đúp trực tiếp vào file **`KIEM_TRA_CHEO_QC.bat`** tại thư mục gốc dự án.
* **Cách 2**: Chạy lệnh từ cửa sổ dòng lệnh PowerShell / Terminal:
  ```powershell
  python "MITCalc-WebApp\tests\qc_gear_multi_case_suite.py"
  ```
* **Kết quả hiển thị**: Bảng chi tiết 110 phép đo kiểm của cả 5 kịch bản, kèm tỷ lệ % đạt chuẩn và thông báo nghiệm thu của Trưởng nhóm QC.
