@echo off
chcp 65001 > nul
title RA SOAT SONG SONG THEN HOA THAN KHAI (DIN 5480, ISO 4156, ANSI B92.1)
cls
echo ===============================================================================
echo        HE THONG RA SOAT SONG SONG THEN HOA THAN KHAI (INVOLUTE SPLINES)
echo        Kiem tra cheo giua Web App Engine va MITCalc 1.74 SplinesI_01.xlsb
echo ===============================================================================
echo.

python tools/test_splines_qc.py

echo.
pause
