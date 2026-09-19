@echo off
chcp 65001 >nul
title CAI DAT MOI TRUONG KIEM THU PYTHON (PLAYWRIGHT & EXCEL COM)
color 0f

echo ===============================================================================
echo     CÀI ĐẶT THƯ VIỆN PYTHON PHỤC VỤ KIỂM THỬ TỰ ĐỘNG & ĐỐI CHIẾU EXCEL COM
echo ===============================================================================
echo.

pip install -r "%~dp0tests\requirements.txt"
playwright install chromium

echo.
echo [*] Cai dat hoan tat!
pause
