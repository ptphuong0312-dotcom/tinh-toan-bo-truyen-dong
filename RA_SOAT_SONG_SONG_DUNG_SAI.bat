@echo off
chcp 65001 > nul
title RA SOAT SONG SONG DUNG SAI & LAP GHEP (ISO 286 / ANSI B4.1)
cls
echo ===============================================================================
echo        HE THONG RA SOAT SONG SONG DUNG SAI & LAP GHEP (ISO 286 / ANSI B4.1)
echo        Kiem tra cheo giua Web App Engine va MITCalc 1.74 Tolerances_01.xlsb
echo ===============================================================================
echo.

python tools/test_tolerances_qc.py

echo.
pause
