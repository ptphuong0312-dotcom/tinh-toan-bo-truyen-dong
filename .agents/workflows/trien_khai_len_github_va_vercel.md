# Quy Trình Triển Khai Lên GitHub & Vercel (GitHub & Vercel Deployment Workflow)

## Mục Đích
Quy trình từng bước để xuất bản dự án **MITCalc Web App** lên kho chứa GitHub và thiết lập luồng tự động triển khai (CI/CD) lên Vercel để chạy trực tuyến trên toàn cầu.

---

## Bước 1: Khởi Tạo & Cấu Hình Git Cục Bộ
1. **Kiểm tra công cụ Git**:
   - Nếu chưa có, tải và giải nén `MinGit` từ Git-for-Windows vào `%LOCALAPPDATA%\Programs\Git`.
   - Cấu hình biến môi trường và thiết lập shim trong `bin/git.bat`.
2. **Cấu hình `.gitignore`**:
   - Loại trừ `backups/*.zip`, `__pycache__/`, `scratch/`, tệp tạm thời.
3. **Cấu hình `vercel.json`**:
   - Khai báo static configuration với `cleanUrls: false`, các header an ninh và MIME types.
4. **Khởi tạo và Commit**:
   ```bash
   git init -b main
   git config --global user.name "SirPhuong"
   git config --global user.email "sirphuong@users.noreply.github.com"
   git add .
   git commit -m "feat: Initial commit of MITCalc Web App"
   ```

---

## Bước 2: Tạo Repository Trên GitHub & Đẩy Code Lên
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên Repository (ví dụ: `MITCalc-Gear-Engineering`).
3. Chọn quyền riêng tư (**Public** hoặc **Private**).
4. **Không** chọn tích tạo trước README, .gitignore hay license.
5. Nhấn **"Create repository"**.
6. Liên kết remote và đẩy code:
   ```bash
   git remote add origin https://github.com/<tai-khoan>/MITCalc-Gear-Engineering.git
   git branch -M main
   git push -u origin main
   ```
   *(Hoặc nhấp đúp chạy file `DAY_LEN_GITHUB.bat` tại thư mục gốc)*.

---

## Bước 3: Kết Nối Vercel Để Tự Động Deploy Trực Tuyến
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Tại bảng điều khiển Dashboard, nhấn **"Add New..."** -> **"Project"**.
3. Tìm kho chứa `MITCalc-Gear-Engineering` trong danh sách và bấm **"Import"**.
4. Cấu hình triển khai:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (để mặc định)
   - **Build & Output Settings**: Để trống (ứng dụng tĩnh không cần build)
5. Nhấn **"Deploy"**.
6. Sau khoảng 10 giây, Vercel sẽ thông báo thành công và cấp tên miền (URL) trực tuyến chính thức.
7. Mọi lần cập nhật sau này chỉ cần chạy `git push` (hoặc `DAY_LEN_GITHUB.bat`), Vercel sẽ tự động cập nhật bản mới nhất ngay lập tức!
