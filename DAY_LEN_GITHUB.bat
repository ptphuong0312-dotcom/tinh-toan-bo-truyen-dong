@echo off
chcp 65001 >nul
echo ===============================================================================
echo       ĐẨY MÃ NGUỒN DỰ ÁN "TÍNH TOÁN BỘ TRUYỀN ĐỘNG" LÊN GITHUB & VERCEL
echo ===============================================================================
echo.

:: Kiểm tra remote origin
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Chưa kết nối kho chứa GitHub (Remote Origin).
    echo.
    echo     Tên repository chuẩn đã được đặt là: tinh-toan-bo-truyen-dong
    echo.
    set /p GH_USER=">>> Nhập Username GitHub của bạn (ví dụ: ptphuong hoặc ptphuong0312): "
    if "%GH_USER%"=="" (
        echo [-] Bạn chưa nhập username. Vui lòng chạy lại file!
        pause
        exit /b 1
    )
    echo [*] Đang liên kết tới https://github.com/%GH_USER%/tinh-toan-bo-truyen-dong.git ...
    git remote add origin https://github.com/%GH_USER%/tinh-toan-bo-truyen-dong.git
    git branch -M main
    echo [+] Đã liên kết remote thành công!
    echo.
)

:: Kiểm tra trạng thái git
git status --short
echo.
set /p commit_msg="Nhập nội dung ghi chú cập nhật (Nhấn Enter để giữ nguyên): "
if not "%commit_msg%"=="" (
    git add .
    git commit -m "%commit_msg%"
)

echo.
echo [*] Đang đẩy toàn bộ mã nguồn lên GitHub...
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo [OK] ĐÃ ĐẨY MÃ NGUỒN LÊN GITHUB THÀNH CÔNG!
    echo ===============================================================================
    echo.
    echo [*] BƯỚC TIẾP THEO: Triển khai trực tuyến lên Vercel:
    echo     1. Mở Cốc Cốc truy cập: https://vercel.com/new
    echo     2. Nhấn "Import" repository "tinh-toan-bo-truyen-dong"
    echo     3. Nhấn nút "Deploy"
    echo.
    echo     => Trang web của bạn sẽ hoạt động tại:
    echo        https://tinh-toan-bo-truyen-dong.vercel.app
    echo ===============================================================================
) else (
    echo.
    echo [!] Lỗi khi đẩy lên GitHub. Vui lòng kiểm tra:
    echo     1. Bạn đã tạo repo "tinh-toan-bo-truyen-dong" trên GitHub chưa?
    echo     2. Username GitHub đã nhập chính xác chưa?
    echo.
)

echo.
pause
