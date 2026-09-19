@echo off
chcp 65001 >nul
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\mingw64\bin;%LOCALAPPDATA%\Programs\Git\gcm;%PATH%"

echo ===============================================================================
echo       ĐẨY MÃ NGUỒN DỰ ÁN "TÍNH TOÁN BỘ TRUYỀN ĐỘNG" LÊN GITHUB & VERCEL
echo ===============================================================================
echo.

:: Đảm bảo remote origin trỏ chính xác về tài khoản ptphuong0312-dotcom
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/ptphuong0312-dotcom/tinh-toan-bo-truyen-dong.git
    git branch -M main
)

echo [*] Kho chứa GitHub: https://github.com/ptphuong0312-dotcom/tinh-toan-bo-truyen-dong.git
echo.

:: Kiểm tra trạng thái git
git status --short
echo.

echo [*] Đang đẩy toàn bộ mã nguồn lên GitHub...
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo [OK] ĐÃ ĐẨY MÃ NGUỒN LÊN GITHUB THÀNH CÔNG!
    echo ===============================================================================
    echo.
    echo [*] Đang tự động mở trang Vercel trên trình duyệt để triển khai trực tuyến...
    start "" "https://vercel.com/new/import?s=https://github.com/ptphuong0312-dotcom/tinh-toan-bo-truyen-dong"
    echo.
    echo     Khi trang web Vercel hiện ra:
    echo     1. Nhấn nút "Deploy"
    echo     2. Sau 5-10 giây, trang web trực tuyến của bạn sẽ hoạt động tại:
    echo        https://tinh-toan-bo-truyen-dong.vercel.app
    echo ===============================================================================
) else (
    echo.
    echo [!] Cần xác thực tài khoản GitHub:
    echo     Nếu có cửa sổ trình duyệt hiện ra, bạn chỉ cần bấm nút xanh "Authorize".
    echo     Sau đó chạy lại file này một lần nữa.
    echo.
)

echo.
pause
