@echo off
chcp 65001 >nul
title DONG GOI MA NGUON JS (CORS-FREE BUNDLER)
color 0d

python "%~dp0tools\bundle_all.py"
echo.
pause
