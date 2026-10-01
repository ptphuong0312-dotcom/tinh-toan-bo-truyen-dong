@echo off
chcp 65001 >nul
echo ========================================================================================
echo   RA SOAT SONG SONG TRUC TIEP: WEB APP TRUC VIT - BANH VIT vs EXCEL COM (Gear4_01.xlsb)
echo ========================================================================================
python "%~dp0modules\worm-gear\tests\deep_line_by_line_worm_audit.py"
echo.
pause
