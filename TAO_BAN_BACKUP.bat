@echo off
chcp 65001 >nul
title TAO BAN BACKUP DU AN - MITCalc Gear Engineering
color 0a

python "%~dp0tools\backup_project.py"
echo.
pause
