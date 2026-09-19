@echo off
chcp 65001 >nul
title MITCalc Web App - Tinh Toan Banh Rang Tru & Nghieng (ISO 6336)
color 0a

echo ===============================================================================
echo   ĐANG MỞ MÔ-ĐUN BÁNH RĂNG TRỤ & NGHIÊNG (SPUR & HELICAL GEAR)...
echo ===============================================================================
echo.

set "TARGET_HTML=%~dp0modules\spur-gear\index.html"
if exist "%TARGET_HTML%" (
    start "" "%TARGET_HTML%"
) else (
    start "" "%~dp0index.html"
)
exit /b
