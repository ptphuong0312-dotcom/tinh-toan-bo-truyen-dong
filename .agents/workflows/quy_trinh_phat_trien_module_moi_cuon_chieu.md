# WORKFLOW: QUY TRÌNH CUỐN CHIẾU PHÁT TRIỂN CÁC MÔ-ĐUN TIẾP THEO (MODULE DEVELOPMENT RUNBOOK)

## 1. Mục Đích & Nguyên Tắc Tối Thượng
Tài liệu này là cẩm nang từng bước để phát triển hoàn thiện các mô-đun cơ khí tiếp theo:
1. **Module 3**: Bánh vít - Trục vít (Worm Gear - ISO/CD 14521 / DIN 3996).
2. **Module 4**: Bánh răng hành tinh (Planetary / Epicyclic Gear Train).
3. **Module 5**: Bộ truyền đai (V-Belt & Timing Belt Drive).
4. **Module 6**: Bộ truyền xích (Roller Chain Drive).
5. **Module 7**: Tính toán trục (Shafts) và then (Keys).
6. **Module 8**: Ổ lăn (Rolling Bearings - ISO 281).

**Nguyên tắc bất biến**:
* **Zero-Force Scope**: Bỏ qua 100% các phép tính lực, độ võng trục, ứng suất uốn/tiếp xúc. Tập trung 100% vào hình học tiêu chuẩn, tỷ số truyền, động học, dung sai và đo kiểm.
* **Chuẩn 1-to-1 MITCalc 1.74**: Cấu trúc 3 Master Blocks, Accordion mở sẵn các mục cốt lõi (4.0, 5.0, 6.0, 11.0), dropdown mũi tên sổ xuống trong ô số liệu.
* **CORS-Free Single Bundle**: Chạy 100% offline qua `file:///` không cần server.
* **Zero-Tolerance QC**: Đạt $\Delta = 0.000000$ khi kiểm thử chéo với Excel gốc qua Python COM.

---

## 2. Quy Trình 10 Bước Triển Khai Cuốn Chiếu

### Bước 1: Khởi Tạo Thư Mục Con Độc Lập
Tạo cấu trúc thư mục mới cô lập hoàn toàn:
```text
modules/[ten-module]/
├── index.html
├── js/
│   ├── [ten]-calc-engine.js
│   ├── [ten]-canvas.js
│   ├── [ten]-ui.js
│   └── [ten]-engine.bundle.js
└── tests/
    └── qc_[ten]_multi_case_suite.py
```

### Bước 2: Trích Xuất Dữ Liệu & Công Thức Gốc Từ MITCalc 1.74
* Mở tệp Excel tương ứng trong `C:\MITCalc\` (ví dụ: `Worm_01.xlsb`, `Planet_01.xlsb`, `Belt_01.xlsb`, `Chain_01.xlsb`).
* Sử dụng Python COM `win32com.client` hoặc PowerShell COM để:
  - Đọc toàn bộ danh sách `Named Ranges` và tọa độ ô tương ứng.
  - Đọc công thức toán học tại sheet `Calculation`.
  - Trích xuất ảnh vector từ `xl/media/` qua Windows GDI+ (`gdiplus.dll`).

### Bước 3: Xây Dựng Động Cơ Tính Toán Thuần JS (`[ten]-calc-engine.js`)
* Viết class động cơ tính toán với các phương thức giải tích thuần túy, không phụ thuộc thư viện ngoài.
* Triệt tiêu sai số dấu phẩy động, áp dụng giải thuật Involute ngược Newton-Raphson khi cần tìm góc ăn khớp.
* Lược bỏ toàn bộ tính toán lực và ứng suất theo Quy tắc 1.

### Bước 4: Xây Dựng Bộ Kiểm Thử Chéo Tự Động QC Multi-Case
* Tạo tệp `tests/qc_[ten]_multi_case_suite.py`:
  - Khởi tạo Excel COM kết nối với file `.xlsb` gốc.
  - Lập ma trận 5 kịch bản thiết kế thực tế (tỷ số truyền nhỏ, tỷ số truyền lớn, modun nhỏ, modun lớn, trường hợp tới hạn).
  - Bơm dữ liệu đầu vào vào cả hai bên (Web App JS engine qua node hoặc headless script, và Excel COM).
  - So sánh từng ô kết quả và tính sai số $\Delta$.
  - Tinh chỉnh giải thuật đến khi đạt **100% PASS với $\Delta = 0.0000$**.

### Bước 5: Xây Dựng Mô Phỏng Trực Quan 2D Canvas CAD (`[ten]-canvas.js`)
* Vẽ hình học kỹ thuật cơ khí chính xác theo tiêu chuẩn quốc tế (không vẽ ước lệ):
  - Đường bao thực thể, đường tâm, vòng chia/vòng lăn, góc tiếp xúc, đỉnh nón hoặc đường sinh.
  - Tính năng tương tác: Pan chuột, Thu phóng Zoom chuột, Cử chỉ cảm ứng đa điểm Mobile (1 ngón Pan, 2 ngón Zoom với `touch-action: none`).
  - Hoạt ảnh chuyển động ăn khớp liên hợp khóa cứng theo tỷ số truyền $i$, triệt tiêu sai số tích lũy pha.

### Bước 6: Xây Dựng Giao Diện Chuẩn 1-to-1 MITCalc 1.74 (`index.html` & `[ten]-ui.js`)
* **3 Master Blocks đặc trưng**:
  - Khối Đầu Vào (Xanh lá `#107c41`): Mục 1.0 đến Mục 5.0.
  - Khối Kết Quả (Vàng cam `#c55a11`): Mục 6.0 đến Mục 8.0.
  - Khối Bổ Sung & Chế Tạo (Xanh dương `#1e3a8a`): Mục 11.0 dung sai và bảng chế tạo.
* **Highlight thông số then chốt (`.highlight-key-param`)**: Viền vàng hổ phách `#f59e0b`, chữ cyan phát sáng.
* **Dropdown kiểu Excel (`.combo-box-group`)**: Nằm gọn trong Cột 4, giữ nguyên Cột 5 cho kết quả phụ.
* **Accordion**: Mở sẵn 4 mục cốt lõi 4.0, 5.0, 6.0, 11.0. Thu gọn các mục phụ.

### Bước 7: Tích Hợp Xuất Bản Vẽ CAD (DXF & 3D STEP/STL)
* Xuất DXF R12 (`AC1009`) chuẩn Windows CRLF, đủ 4 bảng `TABLES` (`VPORT`, `LTYPE`, `LAYER`, `STYLE`).
* Xuất 3D STEP AP214 B-Rep Solid và Surface rỗng cho Mastercam.

### Bước 8: Đóng Gói Classic Single Bundle (CORS-Free)
* Thêm cấu hình vào `tools/bundle_all.py`.
* Gộp tất cả các file JS của module thành `modules/[ten-module]/js/[ten]-engine.bundle.js`.
* Kiểm tra đảm bảo mở file trực tiếp qua `file:///` trên trình duyệt hoạt động trơn tru.

### Bước 9: Tạo Launcher 1-Click & Kết Nối Cổng Trung Tâm
* Tạo file `CHAY_WEBAPP_[TEN].bat` tại thư mục gốc dự án.
* Thêm card mô-đun mới vào Cổng Trung Tâm `MITCalc-WebApp/index.html`.

### Bước 10: Tự Động Lưu Trữ Tri Thức (Golden Meta-Rule)
* Cập nhật ngay các quy chuẩn mới vào:
  1. `GEMINI.md`
  2. `.agents/skills/mitcalc-webapp-engineering/SKILL.md`
  3. `docs/OPTIMIZATION_HISTORY.md`
  4. Tạo bản backup mới `.zip` trong `backups/`.
  5. Commit và Push trực tiếp lên GitHub `main`.
