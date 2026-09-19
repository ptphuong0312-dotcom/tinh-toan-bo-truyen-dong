@echo off
chcp 65001 >nul
title MITCalc Web App - Cong Trung Tam Tinh Toan Co Khi
color 0b

echo ===============================================================================
echo     MITCalc Web App - CỔNG TRUNG TÂM TÍNH TOÁN CƠ KHÍ ĐỘC LẬP
echo ===============================================================================
echo.
echo [*] Đang mở Cổng Trung Tâm trên trình duyệt mặc định...
start "" "%~dp0index.html"

echo.
echo [*] Bạn có thể sử dụng trực tiếp 100% offline không cần Internet.
echo [*] Nếu muốn khởi chạy Local Web Server nội bộ (Port 8080), nhấn phím bất kỳ...
echo [*] Hoặc đóng cửa sổ này để tiếp tục sử dụng bình thường.
pause >nul

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Đang khởi động Local Web Server tại http://localhost:8080 ...
    start "" http://localhost:8080
    python -m http.server 8080 --directory "%~dp0"
)
