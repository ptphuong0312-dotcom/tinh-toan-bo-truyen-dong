# WORKFLOW: XUẤT BẢN VẼ 2D DXF TƯƠNG THÍCH TOÀN DIỆN TỪ AUTOCAD 2004 ĐẾN 2026

## 1. Mục Đích & Bối Cảnh Kỹ Thuật
Định dạng AutoCAD Release 12 (`AC1009`) là định dạng bản vẽ vector 2D chuẩn công nghiệp, nhẹ, phổ biến và được đọc bởi 100% phần mềm CAD/CAM hiện đại (AutoCAD, SolidWorks, Inventor, Mastercam, LibreCAD).
Để đảm bảo các phiên bản AutoCAD từ cũ nhất (AutoCAD 2004) đến mới nhất (AutoCAD 2026) đều mở file tức thì không bị crash hoặc báo lỗi cú pháp:

---

## 2. Quy Chuẩn Kỹ Thuật Bắt Buộc Trong File DXF

### 2.1. Chuẩn Ngắt Dòng Windows CRLF (`\r\n`)
Trình duyệt web và JavaScript mặc định dùng `\n`. Tuy nhiên, các phiên bản AutoCAD 2004-2007 trên hệ điều hành Windows yêu cầu định dạng ngắt dòng Windows `\r\n`.
```javascript
// Bắt buộc sử dụng \r\n xuyên suốt toàn bộ chuỗi xuất DXF
const EOL = '\r\n';
let dxf = '0' + EOL + 'SECTION' + EOL + '2' + EOL + 'HEADER' + EOL + ...
```

### 2.2. Khai Báo Đầy Đủ 4 Bảng Cấu Trúc Trong Phần `TABLES`
AutoCAD 2004 sẽ báo lỗi hủy mở tệp (*Fatal Error*) nếu một layer sử dụng kiểu nét hoặc kiểu chữ chưa được khai báo trước trong `TABLES`.
Bắt buộc có đủ 4 bảng:
1. **Bảng `VPORT`**: Khởi tạo khung nhìn chuẩn `*ACTIVE`.
2. **Bảng `LTYPE`**: Khai báo tường minh tất cả các kiểu nét được sử dụng:
   - `CONTINUOUS` (Nét liền).
   - `CENTER` (Nét gạch chấm tâm).
   - `DASHED` (Nét đứt).
3. **Bảng `LAYER`**: Khai báo đầy đủ các layer kỹ thuật kèm mã màu ACI và kiểu đường nét:
   - `GEAR1_PINION`: Màu 4 (Cyan), nét `CONTINUOUS`.
   - `GEAR2_WHEEL`: Màu 2 (Yellow), nét `CONTINUOUS`.
   - `PITCH_CIRCLES`: Màu 1 (Red), nét `DASHED`.
   - `CENTER_LINES`: Màu 1 (Red), nét `CENTER`.
   - `SHAFTS_BORE`: Màu 3 (Green), nét `CONTINUOUS`.
   - `MFG_TABLE`: Màu 7 (White), nét `CONTINUOUS`.
4. **Bảng `STYLE`**: Khai báo kiểu chữ chuẩn `STANDARD` với font mặc định `txt`.

### 2.3. Cấu Trúc Thực Thể `POLYLINE` & Thẻ Đóng `SEQEND`
Mỗi chuỗi đỉnh đa tuyến `POLYLINE` khép kín (`flag 70 = 1`):
* Khởi tạo:
  ```dxf
  0\r\nPOLYLINE\r\n8\r\nLAYER_NAME\r\n66\r\n1\r\n70\r\n1\r\n10\r\n0.0\r\n20\r\n0.0\r\n30\r\n0.0\r\n
  ```
* Danh sách đỉnh `VERTEX`:
  ```dxf
  0\r\nVERTEX\r\n8\r\nLAYER_NAME\r\n10\r\nX_VAL\r\n20\r\nY_VAL\r\n30\r\n0.0\r\n
  ```
* **Bắt buộc có mã nhóm 8 trong thẻ đóng `SEQEND`**:
  ```dxf
  0\r\nSEQEND\r\n8\r\nLAYER_NAME\r\n
  ```

---

## 3. Ba Tùy Chọn Xuất DXF Linh Hoạt

1. **Xuất Bánh Dẫn 1 (Pinion 1)**:
   - Gốc tọa độ $(0, 0)$ đặt tại tâm bánh 1.
   - Bao gồm: Đường bao biên dạng răng thực thể, vòng chia $d_1$, vòng chân $d_{f1}$, vòng đỉnh $d_{a1}$, lỗ trục then $d_{s1}$, 2 đường tâm giao nhau và bảng thông số chế tạo gia công bánh 1.
2. **Xuất Bánh Bị Dẫn 2 (Gear 2)**:
   - Gốc tọa độ $(0, 0)$ đặt tại tâm bánh 2.
   - Bao gồm: Toàn bộ thông số và thực thể độc lập của bánh 2.
3. **Xuất Cả Cặp Ăn Khớp (Assembly Pair)**:
   - Tâm bánh 1 tại $(0, 0)$.
   - Tâm bánh 2 tại $(a_w, 0)$ với khoảng cách trục chính xác theo tính toán.
   - Bánh 2 được xoay đúng pha liên hợp:
     $$\phi_{2,0} = \frac{\pi}{z_2} + \frac{\pi}{2} \left(1 - \frac{z_1}{z_2}\right)$$
   - Răng ăn vào rãnh mượt mà, tiếp xúc lăn đúng đường ăn khớp, không va chạm.
   - Bao gồm các vòng lăn $d_{w1}, d_{w2}$, đường khoảng cách trục và bảng thông số toàn diện.

---

## 4. Kiểm Định Bằng Thư Viện Python `ezdxf`
Trước khi đưa vào sản xuất, kiểm tra cú pháp DXF bằng script:
```python
import ezdxf
doc = ezdxf.readfile("output.dxf")
print("DXF Version:", doc.dxfversion)  # AC1009
print("Total Entities in Modelspace:", len(doc.modelspace()))
```
Nếu không có ngoại lệ hay lỗi `DXFStructureError`, file đạt chuẩn 100%.
