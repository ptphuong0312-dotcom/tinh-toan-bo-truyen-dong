# QUY TRÌNH ĐÓNG GÓI MÃ NGUỒN JAVASCRIPT THUẦN (CORS-FREE BUNDLER)

> **Mục tiêu**: Đóng gói toàn bộ các file JavaScript dạng module (ESM) thành một file JS duy nhất (Classic Script Bundle) để Web App có thể chạy trực tiếp 100% offline bằng cách nhấp đúp file HTML (`file:///`) mà không bị trình duyệt chặn CORS.

---

## 1. THỰC THI 1-CLICK

Nhấp đúp chuột vào file batch tại thư mục gốc:
```cmd
DONG_GOI_BUNDLE_JS.bat
```
Hoặc chạy lệnh Python:
```bash
python tools/bundle_all.py
```

## 2. NGUYÊN TẮC BUNDLE
1. **Bánh Răng Trụ**: Ghép tuần tự: `materials.js` -> `standard-tables.js` -> `i18n.js` -> `math-utils.js` -> `tooth-profile-generator.js` -> `gear-geometry.js` -> `center-distance-solver.js` -> `gear-canvas.js` -> `SpurGearUI` controller vào `modules/spur-gear/js/mitcalc-engine.bundle.js`.
2. **Bánh Răng Côn**: Ghép tuần tự: `materials.js` -> `bevel-calc-engine.js` -> `bevel-canvas.js` -> `bevel-ui.js` vào `modules/bevel-gear/js/bevel-engine.bundle.js`.
3. Thay thế toàn bộ từ khóa `export` và loại bỏ các khối `import` ES Module.
4. Kiểm thử ngay lập tức bằng Playwright sau khi bundle để đảm bảo 0 lỗi syntax.
