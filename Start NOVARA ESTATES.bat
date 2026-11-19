@echo off
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0start-novara.ps1"
exit /b %errorlevel%
