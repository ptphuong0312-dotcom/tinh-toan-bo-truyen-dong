# MITCalc Web App - Hệ Thống Tính Toán Cơ Khí Độc Lập
**Bản quyền & Phát triển**: `SirPhuong` / `Pham Phuong`  
**Kiến trúc**: 100% Client-Side Pure Web App, Zero-Dependency, Chạy Offline Tuyệt Đối  
**Tiêu chuẩn**: ISO 6336, ISO 23509, DIN 3960, DIN 3971, DIN 3965, ISO 1328, AGMA 2005  
**Độ chính xác**: Zero-Tolerance Policy (Δ = 0.000000 so với MITCalc 1.74 gốc)

---

## 🚀 KHỞI ĐỘNG NHANH (1-CLICK QUICKSTART)

Bạn có thể chạy ngay các file batch tại thư mục gốc mà không cần cài đặt bất kỳ môi trường lập trình nào:

| Launcher | Chức Năng |
|:---|:---|
| 🏠 `CHAY_WEBAPP.bat` | Mở **Cổng Trung Tâm (Central Hub)** điều hướng tới tất cả các module tính toán |
| ⚙️ `CHAY_BANH_RANG_TRU.bat` | Mở trực tiếp Web App **Bánh Răng Trụ & Nghiêng (Spur & Helical Gear)** |
| 📐 `CHAY_BANH_RANG_CON.bat` | Mở trực tiếp Web App **Bánh Răng Côn (Bevel Gear - ISO 23509)** |
| 📊 `RA_SOAT_SONG_SONG_BANH_RANG_TRU.bat` | Chạy bộ rà soát tự động 155 thông số Bánh Răng Trụ vs Excel MITCalc 1.74 gốc (Δ = 0.000000) |
| 📊 `RA_SOAT_SONG_SONG_BANH_RANG_CON.bat` | Chạy bộ rà soát tự động 109 thông số Bánh Răng Côn vs Excel MITCalc 1.74 gốc (Δ = 0.000000) |
| 🧪 `KIEM_TRA_CHEO_QC_BANH_RANG_TRU.bat` | Chạy ma trận 5 kịch bản kiểm thử QC Bánh Răng Trụ (110 checks PASS) |
| 🧪 `KIEM_TRA_CHEO_QC_BANH_RANG_CON.bat` | Chạy ma trận 5 kịch bản kiểm thử QC Bánh Răng Côn (120 checks PASS) |
| 📦 `DONG_GOI_BUNDLE_JS.bat` | Tự động đóng gói mã nguồn JS thành file bundle thuần (CORS-free) |
| ⚙️ `CAI_DAT_MOI_TRUONG_TEST.bat` | Cài đặt các thư viện Python (`playwright`, `pywin32`) phục vụ kiểm thử tự động |

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT DIRECTORY TREE)

```text
MITCalc-Gear-Engineering/
├── index.html                               # Cổng Trung Tâm (Central Engineering Portal Hub)
├── shared/                                  # Tài nguyên dùng chung giữa các Module
│   ├── css/
│   │   └── engineering-theme.css            # Giao diện kỹ thuật Dark Engineering chuẩn
│   └── js/
│       ├── materials.js                     # CSDL 51 loại vật liệu kỹ thuật chuẩn quốc tế
│       ├── math-utils.js                    # Giải thuật Involute ngược Newton-Raphson
│       └── standard-tables.js               # Bảng tra dung sai ISO 1328 & hệ số hình học
├── modules/
│   ├── spur-gear/                           # MÔ-ĐUN 1: BÁNH RĂNG TRỤ & NGHIÊNG (ISO 6336)
│   │   ├── index.html                       # Giao diện Accordion 12 phân mục (1.0 đến 18.0)
│   │   ├── css/app.css                      # Định kiểu ô nhập .user-input & master blocks
│   │   ├── js/
│   │   │   ├── mitcalc-engine.bundle.js     # Classic Bundle thuần (chống lỗi CORS)
│   │   │   ├── engine/                      # Động cơ hình học, giải thuật thân khai, solver
│   │   │   └── ui/                          # 2D Canvas CAD, UI Controller
│   │   └── tests/
│   │       ├── deep_line_by_line_spur_audit.py # Rà soát song song 155 thông số (Δ = 0.000000)
│   │       └── qc_gear_multi_case_suite.py     # Test Suite QC 5 kịch bản (110 checks Pass)
│   └── bevel-gear/                          # MÔ-ĐUN 2: BÁNH RĂNG CÔN (ISO 23509)
│       ├── index.html                       # Giao diện Accordion 12 phân mục (1.0 đến 16.0)
│       ├── js/
│       │   ├── bevel-engine.bundle.js       # Classic Bundle thuần (chống lỗi CORS)
│       │   ├── bevel-calc-engine.js         # Động cơ hình học nón & Tredgold
│       │   ├── bevel-canvas.js              # Bản vẽ mặt cắt trục kỹ thuật ISO 23509
│       │   └── bevel-ui.js                  # Controller giao diện & Live Audit
│       └── tests/
│           ├── deep_line_by_line_bevel_audit.py # Rà soát song song 109 thông số (Δ = 0.000000)
│           └── qc_bevel_multi_case_suite.py     # Test Suite QC 5 kịch bản (120 checks Pass)
├── tools/                                   # Công cụ đóng gói mã nguồn (Bundlers)
│   ├── bundle_all.py                        # Đóng gói cả 2 module
│   ├── bundle_spur.py                       # Đóng gói Bánh Răng Trụ
│   └── bundle_bevel.py                      # Đóng gói Bánh Răng Côn
├── tests/                                   # Kịch bản kiểm thử tự động toàn diện (Playwright)
│   ├── test_spur_webapp.py                  # Kiểm tra 5 tab & Live Audit Bánh Răng Trụ
│   └── test_bevel_webapp.py                 # Kiểm tra các tab & Live Audit Bánh Răng Côn
├── reference_data/                          # Dữ liệu trích xuất gốc từ MITCalc 1.74 (.xlsb)
│   ├── gear1_analysis.txt                   # Cấu trúc Named Ranges & sheet Calculation Gear 1
│   ├── gear1_formulas.txt                   # Toàn bộ công thức Excel nguyên bản Gear 1
│   ├── gear1_coordinates.txt                # 120 điểm tọa độ biên dạng răng nguyên bản
│   └── gear2_row_by_row.txt                 # Toàn bộ 260 dòng công thức nguyên bản Gear 2
├── docs/                                    # Tài liệu kỹ thuật & Lịch sử tối ưu
│   └── OPTIMIZATION_HISTORY.md              # Lịch sử các mốc phát triển & kết quả nghiệm thu
├── .agents/                                 # Cấu hình trí tuệ nhân tạo (AI Agent Configuration)
│   ├── skills/mitcalc-webapp-engineering/   # Skill kỹ thuật cơ khí & runbook
│   └── workflows/                           # Các kịch bản công việc tự động
├── GEMINI.md                                # Bộ quy tắc dự án toàn năng (Master Rules)
└── requirements.txt                         # Thư viện Python phục vụ kiểm thử
```

---

## 🎯 ĐẶC TÍNH NỔI BẬT

1. **100% Client-Side Pure Execution**: Hoạt động hoàn toàn trên trình duyệt web, không cần cài đặt Node.js hay bất kỳ máy chủ nào. Copy thư mục sang máy khác là chạy ngay!
2. **Cấu trúc 1-to-1 Chuẩn MITCalc 1.74**: Phân chia 3 Khối Master Blocks trực quan, ô nhập liệu `.user-input` nền trắng viền xanh rõ nét, hỗ trợ dấu phẩy tiếng Việt.
3. **Tab 2 Live Audit Table**: Bảng đối chiếu thời gian thực kiểm chứng trực tiếp từng con số với bản gốc MITCalc 1.74 đạt độ lệch $\Delta = 0.000000$ (Zero-Tolerance 100% PASS).
4. **Mô Phỏng 2D CAD Đạt Chuẩn Công Nghiệp**:
   - **Bánh Răng Côn**: Bản vẽ mặt cắt trục kỹ thuật cơ khí bổ dọc (ISO 23509), Apex $V(0,0)$, Hatching $45^\circ$, auto-centering.
   - **Bánh Răng Trụ**: Bán kính lượn chân răng $R = 0.38 m_n$ (DIN 3960), bảo tồn cung tròn đáy rãnh răng, triệt tiêu sừng nhọn.
5. **Zero-Force Scope**: Lược bỏ 100% lực và ứng suất uốn/tiếp xúc theo đúng yêu cầu của chủ sở hữu.
