# WORKFLOW: GIẢI THUẬT BAO HÌNH LĂN DAO VÀ ĐIỀU CHỈNH ĐỘ MỊN BIÊN DẠNG RĂNG 11 MỨC

## 1. Mục Đích Kỹ Thuật
Quy trình này mô tả chi tiết giải thuật bao hình lăn dao thanh răng tiêu chuẩn của MITCalc 1.74 (`GearFunctions.bas`) và kiến trúc thanh trượt điều chỉnh độ mịn 11 mức rời rạc, hỗ trợ từ xem nhanh đến gia công siêu tinh CNC / Wire EDM.

---

## 2. Giải Thuật Bao Hình Lăn Dao Thanh Răng Tiêu Chuẩn

### 2.1. Thông Số Dao Cắt Danh Nghĩa
* Chiều cao đỉnh dao: $h_{a0}^* = 1.25$ (cắt sâu tạo góc lượn trochoid và cắt lẹm chân răng tự nhiên khi $z < z_{\min}$).
* Chiều cao đáy dao: $h_{f0}^* = 1.00$.
* Bán kính góc lượn mũi dao: $r_{a0}^* = 0.38$.
* Góc nghiêng dao: $\alpha_n = 20^\circ$.

### 2.2. Quá Trình Mô Phỏng Động Học Lăn Dao
* Dao thanh răng tịnh tiến dọc theo tiếp tuyến vòng lăn trong khi phôi bánh răng quay với vận tốc góc tương ứng:
  $$s = r_w \cdot \psi$$
* Biên dạng chân răng và thân khai được tạo thành từ họ các đường bao của lưỡi cắt và mũi dao tại từng bước góc xoay dao $\Delta\psi$.
* Đỉnh răng được khống chế bởi vòng tròn đỉnh $d_a / 2$.

---

## 3. Bảng Phân Cấp 11 Mức Độ Mịn (Discrete Resolution Architecture)

| Mức | Mô tả mục đích sử dụng | $NoPtHead$ | $NoPtEv$ | $\Delta\psi$ | Số điểm/răng |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | Thô - Xem trước siêu nhanh | 8 | 32 | $1.0^\circ$ | 80 |
| **2** | Thô vừa | 10 | 45 | $0.9^\circ$ | 110 |
| **3** | Trung bình thấp | 12 | 58 | $0.8^\circ$ | 140 |
| **4** | Trung bình | 14 | 72 | $0.7^\circ$ | 172 |
| **5** | Khá mịn | 17 | 86 | $0.6^\circ$ | 206 |
| **6** | **CHUẨN GỐC MITCALC 1.74 ($\Delta = 0.0000$)** | **20** | **100** | **$0.5^\circ$** | **240** |
| **7** | Mịn cao | 24 | 120 | $0.4^\circ$ | 288 |
| **8** | Mịn rất cao | 28 | 145 | $0.35^\circ$ | 346 |
| **9** | Rất mịn (CAM phay 3D) | 32 | 175 | $0.3^\circ$ | 414 |
| **10** | Cực mịn (Cắt phôi chính xác) | 36 | 210 | $0.25^\circ$ | 492 |
| **11** | **SIÊU MỊN (Cắt dây Wire EDM / Phay tinh)** | **40** | **260** | **$0.2^\circ$** | **600** |

---

## 4. Cơ Chế Đồng Bộ Hai Chiều Tức Thì (Reactive Two-Way Binding)

Khi người dùng kéo thanh trượt độ mịn (ở Mục 20.9 hoặc trên Canvas Toolbar):
1. **Đồng bộ giao diện điều khiển**: Giá trị thanh trượt và nhãn hiển thị tại cả 2 vị trí được đồng bộ ngay lập tức.
2. **Cập nhật WebGL 3D Visualizer**: Gọi `gear3DVisualizer.setGeometry(geom, resolutionParams)` để tái cấu trúc lưới đa giác 3D.
3. **Cập nhật bảng tọa độ điểm răng**: Gọi `MitcalcToothSolver.generateCompleteWheelContour` với tham số mới và hiển thị đầy đủ các hàng tọa độ trong bảng Section 20.0.
4. **Cập nhật bộ xuất CAD**: Mọi thao tác bấm xuất DXF 2D hoặc STEP/STL 3D sau đó đều tự động sử dụng độ mịn đã chọn.
