@echo off
chcp 65001 >nul
echo ===============================================================================
echo            ĐẨY MÃ NGUỒN LÊN GITHUB (PUSH TO GITHUB)
echo ===============================================================================
echo.
git status --short
echo.
set /p commit_msg="Nhập nội dung commit (Nhấn Enter nếu đã commit sẵn): "
if not "%commit_msg%"=="" (
    git add .
    git commit -m "%commit_msg%"
)
echo.
echo [*] Đang đẩy mã nguồn lên nhánh main trên GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo [OK] Đẩy mã nguồn lên GitHub thành công!
    echo [*] Vercel sẽ tự động cập nhật và triển khai phiên bản mới trong vài giây!
    echo ===============================================================================
) else (
    echo.
    echo [!] Chưa kết nối remote origin hoặc cần đăng nhập GitHub.
    echo     Chạy lệnh sau để kết nối:
    echo     git remote add origin https://github.com/[tai-khoan-cua-ban]/[ten-repo].git
    echo     git push -u origin main
)
echo.
pause
