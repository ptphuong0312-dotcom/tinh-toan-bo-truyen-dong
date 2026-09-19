@echo off
chcp 65001 >nul
title RA SOAT SONG SONG BANH RANG CON: WEB APP vs MITCALC 1.74 GOC
color 0b

echo ===============================================================================
echo     RÀ SOÁT SONG SONG 109 THÔNG SỐ: WEB APP vs MITCALC 1.74 GỐC
echo     (Mô-đun Bánh Răng Côn - Zero-Tolerance Delta = 0.000000)
echo ===============================================================================
echo.

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Khong tim thay Python! Vui long cai dat Python 3 de chay doi chieu.
    pause
    exit /b 1
)

python "%~dp0modules\bevel-gear\tests\deep_line_by_line_bevel_audit.py"
echo.
echo ===============================================================================
echo Nhan phim bat ky de thoat...
pause >nul
