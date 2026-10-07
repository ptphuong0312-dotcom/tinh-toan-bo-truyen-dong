@echo off
chcp 65001 >nul
title MITCalc Web App - Tinh Toan Truc Vit - Banh Vit Chuyen Sau (Pro)
color 0C

echo ===============================================================================
echo   ĐANG MỞ MÔ-ĐUN TRỤC VÍT - BÁNH VÍT CHUYÊN SÂU (ZI, ZK, ZH CAVEX 3D)...
echo ===============================================================================
echo.

set "TARGET_HTML=%~dp0modules\worm-gear-advanced\index.html"
if exist "%TARGET_HTML%" (
    start "" "%TARGET_HTML%"
) else (
    start "" "%~dp0index.html"
)
exit /b
