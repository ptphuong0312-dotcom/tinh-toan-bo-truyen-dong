@echo off
chcp 65001 >nul
title MITCalc Web App - Tinh Toan Banh Rang Con Chuyen Sau (Pro)
color 0D

echo ===============================================================================
echo   ĐANG MỞ MÔ-ĐUN BÁNH RĂNG CÔN CHUYÊN SÂU (ZEROL, KLINGELNBERG, HYPOID)...
echo ===============================================================================
echo.

set "TARGET_HTML=%~dp0modules\bevel-gear-advanced\index.html"
if exist "%TARGET_HTML%" (
    start "" "%TARGET_HTML%"
) else (
    start "" "%~dp0index.html"
)
exit /b
