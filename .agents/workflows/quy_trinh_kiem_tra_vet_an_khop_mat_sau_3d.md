# QUY TRÌNH KIỂM TRA & TINH CHỈNH VẾT ĂN KHỚP 3D QUA MẶT SAU SƯỜN RĂNG (BACK-FACE IMPRINT PROTOCOL)

## 1. Mục Đích & Nguyên Tắc Tối Thượng (Lệnh Từ SirPhuong)
- **Chỉ thị trực tiếp**:
  > *"Nguyên tắc để xem vết ăn khớp phải như vậy, bạn cần lưu lại để phục vụ cho việc chỉnh vết ăn khớp của cặp bánh răng.*
  > *Bạn đã xem được trực tiếp thì bạn cũng đã thấy hiện tại phía sau của bánh răng không in màu của bánh răng còn lại thì chứng tỏ hiện tại 2 bánh răng trong quá trình chuyển động vẫn chưa tiếp xúc nhau, còn tiếp xúc như thế nào mới chuẩn thì bạn cũng đã biết rồi tôi không cần nói lại.*
  > *Vậy từ sau trở đi khi bạn sửa để biết đúng hay sai thì bạn có thể tự duyệt web xem theo chế độ tôi chỉ, đây chính là quy trình để bạn làm việc."*
- **Nguyên lý cốt lõi**:
  1. Trong môi trường Three.js, khi bật chế độ `👁️ Chỉ Mặt Bên` (`flankOnlyMode`), các mặt răng hiển thị dạng vỏ mỏng 2 mặt (`THREE.DoubleSide`).
  2. Khi 2 mặt răng tiếp xúc liên hợp chuẩn: Mặt sau của răng bánh này sẽ **in vệt màu** của mặt răng bánh đối diện.
  3. **Vị trí vết in**: Bắt buộc nằm ở **KHU GIỮA CỦA RĂNG** (trung tâm nón $R_m$). Hai đầu nón ngoài (Heel, $R_e$) và nón trong (Toe, $R_i$) hở tự nhiên nhờ độ lồi dọc răng (Lengthwise Crowning $C_L$).
  4. **Yêu cầu Zero-Bulge**: Chỉ in màu phẳng trên bề mặt sườn răng, **tuyệt đối không được phồng/lồi khối 3D qua mặt trước** của bánh răng đối diện (Zero-Interference).

---

## 2. Các Bước Thực Hiện Quy Trình Làm Việc Độc Lập Cho AI

### Bước 1: Đóng Gói Mã Nguồn Classic Bundle Chống Lỗi CORS
Mỗi khi sửa đổi mã nguồn JS trong `modules/bevel-gear/js/engine/` hoặc `ui/`:
```bash
python tools/bundle_all.py
```
Đảm bảo file `modules/bevel-gear/js/bevel-engine.bundle.js` được cập nhật mới nhất.

### Bước 2: Tự Động Khởi Chạy Headless Browser Bằng Playwright
Viết và chạy script Python Playwright (ví dụ `scratch/inspect_backface_contact.py`):
```python
import os
from playwright.sync_api import sync_playwright

base_dir = r"F:\Antigravity\MITCalc-Gear-Engineering"
file_url = 'file:///' + os.path.join(base_dir, 'modules', 'bevel-gear', 'index.html').replace('\\', '/')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    # 1. Chuyển sang Tab 2D/3D Canvas
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(300)

    # 2. Bật chế độ 3D WebGL
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # 3. Kích hoạt chế độ "Chỉ Mặt Bên" (flankOnlyMode)
    page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        v.setMeshDensityLevel(8); // Cấp mịn cao nhất
        if (!v.flankOnlyMode) v.toggleFlankOnly();
        v.isAnimating = false;
    }''')
    page.wait_for_timeout(300)
```

### Bước 3: Thiết Lập Camera Cận Cảnh Soi Trực Diện Mặt Sau Sườn Răng
Đặt camera nhìn nghiêng từ phía sau mặt răng đang ăn khớp dọc theo bề rộng vành răng $b$:
```python
    page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const Rm = v.geom.Rm;
        const delta1 = v.geom.delta1;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);

        // Đặt camera nhìn vào mặt sau của sườn răng
        v.camera.position.set(mx + 90, my + 50, 150);
        v.controls.target.set(mx, my, 0);
        v.controls.update();
    }''')
```

### Bước 4: Quét Góc Quay Liên Hợp & Chụp Ảnh Chuỗi Bước Ăn Khớp
Cho Bánh dẫn 1 quay từng góc nhỏ quanh điểm tiếp xúc:
```python
    for deg in [-2.0, -1.0, 0.0, 1.0, 2.0]:
        page.evaluate(f'''() => {{
            const v = window.appUI.visualizer3D;
            v.pinionAngle = ({deg}) * Math.PI / 180.0;
            v.gearAngle = v.initialGearAngle - v.pinionAngle / v.gearRatio;
            v.updateGearRotations();
        }}''')
        page.wait_for_timeout(200)
        deg_str = f"deg_{deg:+04.1f}".replace('.', '_')
        page.screenshot(path=f'scratch/contact_backface_{deg_str}.png')
```

### Bước 5: AI Tự Đọc & Phân Tích Hình Ảnh (Self-Inspection)
Sử dụng công cụ `view_file` mở trực tiếp các file ảnh `scratch/contact_backface_*.png` và đánh giá:
1. **Kiểm tra sự xuất hiện của vết in màu**:
   - Nếu mặt sau không có màu của bánh răng đối diện -> **FAIL (Chưa tiếp xúc)** -> Tăng chiều dày răng danh nghĩa hoặc giảm khe hở $j_{n,cad}$.
2. **Kiểm tra vị trí vết in màu**:
   - Vết in phải nằm ở **KHU GIỮA CỦA RĂNG** ($R_m$).
   - Nếu dồn về nón ngoài ($R_e$) hoặc nón trong ($R_i$) -> **FAIL (Lệch nón ngoài / Heel contact)** -> Kiểm tra ngay công thức góc pha ban đầu $\psi_{\text{gear}} = \arcsin(\sin\theta_1 / i) + \theta_2$. Tuyệt đối không dùng dấu trừ (`- th2`) vì sẽ kéo bánh 2 va chạm đỉnh-đối-đỉnh với bánh 1, ép tiếp xúc dạt ra nón ngoài!
3. **Kiểm tra độ lồi / phồng (Bulging)**:
   - Màu in phải phẳng trên mặt sườn.
   - Nếu có mảng tam giác hay đỉnh răng nhô lồi 3D qua mặt trước -> **FAIL (Cắn răng)** -> Kiểm tra ăn khớp lọt rãnh răng (tooth-into-space) và khôi phục hình học thuần gốc MITCalc 1.74 ($s_{ns} = s_{ne} \cdot R/R_e$).

### Bước 6: Tinh Chỉnh & Lặp Lại
Điều chỉnh tham số hình học trong `bevel-3d-generator.js` hoặc góc pha trong `bevel-3d-visualizer.js`, đóng gói lại và lặp lại từ Bước 1 cho đến khi ảnh chụp đạt chuẩn 100% PASS.

---

## 3. Bảng Tiêu Chuẩn Nghiệm Thu Vết Tiếp Xúc (Acceptance Criteria)
| Trạng thái | Dấu hiệu thị giác | Đánh giá | Hành động |
| :--- | :--- | :---: | :--- |
| **Hở răng (Clearance)** | Mặt sau không in màu của bánh đối diện | ❌ FAIL | Giảm $j_{n,cad}$, cân chỉnh góc pha ăn khớp ban đầu |
| **Cắn răng (Interference)** | Màu in kèm khối tam giác phồng lồi qua mặt trước | ❌ FAIL | Kiểm tra góc pha ban đầu lọt rãnh $\psi_{\text{gear}} = \arcsin(\sin\theta_1 / i) + \theta_2$ |
| **Lệch gót ngoài (Heel Contact)** | Vết in nằm lệch hẳn ra mép nón ngoài to nhất ($R_e$) | ❌ FAIL | Sửa dấu trừ thành dấu cộng trong $\psi_{\text{gear}}$ để răng lọt vào giữa rãnh |
| **Ăn khớp hoàn hảo** | Vết in màu phẳng, sắc nét tại khu giữa răng ($R_m$), hai đầu hở êm ái, zero-bulge | ✅ **PASS** | Đạt chuẩn xưởng cơ khí, sẵn sàng nghiệm thu |

