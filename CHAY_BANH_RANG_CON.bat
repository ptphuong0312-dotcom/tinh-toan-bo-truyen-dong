@echo off
chcp 65001 >nul
title MITCalc Web App - Tinh Toan Banh Rang Con (ISO 23509)
color 09

echo ===============================================================================
echo   ĐANG MỞ MÔ-ĐUN BÁNH RĂNG CÔN (BEVEL GEAR - ISO 23509)...
echo ===============================================================================
echo.

set "TARGET_HTML=%~dp0modules\bevel-gear\index.html"
if exist "%TARGET_HTML%" (
    start "" "%TARGET_HTML%"
) else (
    start "" "%~dp0index.html"
)
exit /b
