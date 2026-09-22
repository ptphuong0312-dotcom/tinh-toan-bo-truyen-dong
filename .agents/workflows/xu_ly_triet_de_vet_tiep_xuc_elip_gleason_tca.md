---
description: Quy trình kiểm tra, sửa lỗi hình học sườn răng 3D và thuật toán phân tích vết tiếp xúc Elip Gleason (TCA)
---

# Quy Trình Xử Lý Triệt Để Hình Học Sườn Răng 3D & Vết Tiếp Xúc Elip Gleason (TCA)

Quy trình này hướng dẫn các bước kiểm tra, chẩn đoán và khắc phục sai lệch hình học tiếp xúc răng bánh răng côn trong mô phỏng 3D WebGL và shader GPU TCA theo chuẩn ISO 23509 & Gleason Manual.

---

## Bước 1: Kiểm Tra Hiện Tượng Tiếp Xúc Trên Mô Hình 3D
1. Mở Web App Bánh Răng Côn qua CHAY_WEBAPP_BANH_RANG_CON.bat hoặc trình duyệt.
2. Chuyển sang Tab Mô Phỏng Ăn Khớp 2D / 3D CAD, bấm nút 3D WebGL (Bevel Gears).
3. Bật chế độ Chỉ Mặt Bên (Flank Only) và Vết Tiếp Xúc (TCA).
4. Quan sát vị trí vết tiếp xúc:
   - Nếu vết tiếp xúc bị dồn lên đỉnh răng (crest/tip) hoặc sáng trên nhiều răng lân cận -> Có lỗi góc chiếu Tredgold hoặc lỗi tọa độ shader.
   - Vết tiếp xúc chuẩn mực phải nằm ở giữa răng (khu vực đường sinh nón chia h = 0).

---

## Bước 2: Chuẩn Hóa Góc Chiếu Nón Phụ Tredgold (bevel-3d-generator.js)
1. Mở file modules/bevel-gear/js/engine/bevel-3d-generator.js.
2. Kiểm tra hàm eval_flank(t):
   - Thay thế công thức cũ: theta = (rv / Math.max(1.0, r_pt)) * psi_c;
   - Bằng công thức giải tích bảo toàn cung thực thể: theta = psi_c / cosD;
3. Đảm bảo phần sườn dưới vòng cơ sở (r_c < rvb) tiếp tuyến hướng tâm: psi_c = psi_v + inv_alfa_t;
4. Cập nhật góc xoắn dao phay Gleason W(u) sang hàm lượng giác ngược:
   spiralAngle = Math.asin(Math.max(-0.99, Math.min(0.99, W / Math.max(1.0, R_s * sinD))));

---

## Bước 3: Nâng Cấp Shader GPU Phân Tích Vết Tiếp Xúc TCA (bevel-3d-visualizer.js)
1. Mở file modules/bevel-gear/js/ui/bevel-3d-visualizer.js.
2. Trong hàm applyTCAShader, tính chiều cao h từ trục quay thế giới của từng bánh răng:
   Pinion (trục +X): h1 = sqrt(Y^2 + Z^2) * cosD - X * sinD;
   Gear (trục +Y): h2 = sqrt(X^2 + Z^2) * sinD - Y * cosD;
3. Bổ sung tính toán tọa độ đường xoắn Z_spiral = -W(u) và bộ lọc hành lang ăn khớp:
   abs(vTcaWorldPos.z - z_spiral) <= 2.2 * mmn;
4. Đảm bảo tâm vết Elip Gleason (Chế độ 1) đặt tại đúng h0 = 0.0 và s0 = Rm - 0.08 * b.

---

## Bước 4: Đóng Gói Bundle & Kiểm Thử Toàn Diện
1. Chạy đóng gói Classic Script: python tools/bundle_all.py
2. Chạy test suite đối chiếu ma trận 5 kịch bản:
   python modules/bevel-gear/tests/qc_bevel_multi_case_suite.py
   python tests/qc_gear_multi_case_suite.py
   (Yêu cầu: 100% các phép kiểm tra đạt PASS với Delta = 0.0000).
3. Chụp ảnh kiểm chứng headless browser Playwright để thẩm định trực quan.
