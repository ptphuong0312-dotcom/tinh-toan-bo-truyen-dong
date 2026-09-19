@echo off
chcp 65001 >nul
title KIEM TRA CHEO QC BANH RANG TRU (5 KICH BAN THIET KE)
color 0e

echo ===============================================================================
echo     KIỂM TRA CHÉO QC MA TRẬN 5 KỊCH BẢN: BÁNH RĂNG TRỤ & NGHIÊNG
echo     (110 checks kiểm chứng hình học, tỷ số truyền, dịch chỉnh, dung sai)
echo ===============================================================================
echo.

python "%~dp0modules\spur-gear\tests\qc_gear_multi_case_suite.py"
echo.
pause
