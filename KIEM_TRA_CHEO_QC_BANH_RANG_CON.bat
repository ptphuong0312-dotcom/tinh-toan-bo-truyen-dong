@echo off
chcp 65001 >nul
title KIEM TRA CHEO QC BANH RANG CON (5 KICH BAN THIET KE)
color 0e

echo ===============================================================================
echo     KIỂM TRA CHÉO QC MA TRẬN 5 KỊCH BẢN: BÁNH RĂNG CÔN (BEVEL GEAR)
echo     (120 checks kiểm chứng nón chia, nón đỉnh/đáy, Tredgold, ăn khớp)
echo ===============================================================================
echo.

python "%~dp0modules\bevel-gear\tests\qc_bevel_multi_case_suite.py"
echo.
pause
