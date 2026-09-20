# WORKFLOW: XUẤT FILE 3D SOLID & FLANK SURFACE RỖNG (STEP AP214 & STL) CHO MASTERCAM & SOLIDWORKS

## 1. Mục Đích Kỹ Thuật
Quy trình này hướng dẫn cách xây dựng và tích hợp bộ xuất mô hình 3D CAD chuyên nghiệp vào các mô-đun Web App cơ khí:
* **Mô hình Solid B-Rep (STEP / STL đặc kín)**: Phục vụ lắp ráp cụm chi tiết máy, kiểm tra va chạm tĩnh/động trong SolidWorks, Inventor, Siemens NX.
* **Mô hình Flank Surface rỗng (STEP / STL mặt hở)**: Phục vụ lập trình gia công phay 5 trục (Surface Finish Scallop, Flowline, Swarf Milling) trên Mastercam hoặc mô hình hóa mặt tự do (Freeform Surface Modeling). Không chứa nắp đầu và không chứa lòng lỗ trục.

---

## 2. Kiến Trúc Hình Học 3D (Gear3DGenerator)

### 2.1. Tách Khối Đỉnh (Vertex Splitting) Cho Mặt Đầu Phẳng Cơ Khí
Để tránh hiện tượng đổ bóng gợn sóng/nhấp nhô do dùng chung pháp tuyến giữa mặt hông và mặt đầu:
```javascript
// Chia lưới làm 4 nhóm đỉnh độc lập:
// 1. Nhóm hông răng (Lateral Flank):
//    Pháp tuyến nội suy cong mượt theo thân khai và lượn chân răng.
// 2. Nhóm mặt đầu trước (Front End Cap tại Z = +b/2):
//    Pháp tuyến nghiêm ngặt [0, 0, 1].
// 3. Nhóm mặt đầu sau (Back End Cap tại Z = -b/2):
//    Pháp tuyến nghiêm ngặt [0, 0, -1].
// 4. Nhóm lòng lỗ trục (Inner Bore Cylinder):
//    Pháp tuyến hướng tâm [-cos(theta), -sin(theta), 0].
```

### 2.2. Cơ Chế Lọc Bề Mặt Rỗng (Hollow Flank Surface Engine)
Khi cờ `surfaceOnly: true` (hoặc gọi `generateGearSurfaceMesh`):
* **BỎ QUA HOÀN TOÀN**: Nhóm 2 (Mặt đầu trước), Nhóm 3 (Mặt đầu sau) và Nhóm 4 (Lòng lỗ trục).
* **BẢO TỒN DUY NHẤT**: Mạng lưới đa giác tam giác của bề mặt sườn răng thân khai và lượn chân răng trochoid dọc theo bề rộng vành răng $b$.

### 2.3. Đường Xoắn Vít Dọc Trục (Helical Twist Equation)
Đối với bánh răng nghiêng ($\beta \ne 0$):
* Mỗi lớp mặt cắt tại tọa độ trục $z \in [-b/2, +b/2]$ được xoay quanh trục bánh răng một góc:
  $$\theta(z) = \frac{2 \cdot \tan\beta}{d} \cdot z$$
* Đảm bảo góc nghiêng trên mặt trụ chia luôn đạt chính xác giá trị thiết kế $\beta$.

---

## 3. Cấu Trúc Đóng Gói Tệp STEP AP214 (ISO 10303-21)

### 3.1. Đối Với Solid Model (Khối Đặc)
Khối đặc yêu cầu vỏ kín đa diện (`CLOSED_SHELL`) nằm trong khối B-Rep đa diện (`MANIFOLD_SOLID_BREP`):
```step
#shellId = CLOSED_SHELL('',(#face1,#face2,...));
#brepId = MANIFOLD_SOLID_BREP('PART_NAME',#shellId);
#shapeRepId = ADVANCED_BREP_SHAPE_REPRESENTATION('PART_NAME',(#brepId),#repContextId);
```

### 3.2. Đối Với Surface Model (Mặt Hở Rỗng)
Mặt rỗng yêu cầu vỏ hở (`OPEN_SHELL`) nằm trong mô hình mặt (`SHELL_BASED_SURFACE_MODEL`):
```step
#shellId = OPEN_SHELL('',(#face1,#face2,...));
#surfaceModelId = SHELL_BASED_SURFACE_MODEL('PART_NAME',(#shellId));
#shapeRepId = SHAPE_REPRESENTATION('PART_NAME',(#surfaceModelId),#repContextId);
```
Khi Mastercam hoặc SolidWorks mở tệp này:
* Không xuất hiện cảnh báo "Attempting to stitch into solid".
* Nhận diện ngay lập tức là **Surface Body** phục vụ lập trình phay 5 trục trực tiếp.

---

## 4. Cấu Trúc Đóng Gói Binary STL (Surface & Solid)
Tệp STL nhị phân (Binary STL) có cấu trúc chuẩn:
* Header: 80 bytes chuỗi ASCII nhận diện.
* Số lượng tam giác: 4 bytes `UINT32` (`numTriangles`).
* Mỗi tam giác (50 bytes):
  - 12 bytes: Vector pháp tuyến (`float32` nx, ny, nz).
  - 36 bytes: 3 đỉnh tam giác (`float32` x1, y1, z1, x2, y2, z2, x3, y3, z3).
  - 2 bytes: Attribute byte count (thường là 0).

---

## 5. Quy Trình Tải Tệp Trực Tiếp (Client-Side Zero-CORS Blob Download)
```javascript
function downloadFile(content, filename, mimeType) {
    const blob = (content instanceof Blob) ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 200);
}
```
Không cần web server, hoạt động 100% khi nhấp đúp mở file HTML từ đĩa cứng.
