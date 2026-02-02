@echo off
echo ========================================
echo CompWatch AI - Stopping Services
echo ========================================
echo.

echo Closing all cmd windows with "CompWatch" in title...
taskkill /FI "WINDOWTITLE eq CompWatch*" /F >nul 2>&1

echo.
echo Waiting for processes to clean up...
timeout /t 2 /nobreak >nul

echo.
echo Verifying all Node.js processes stopped...
tasklist /FI "IMAGENAME eq node.exe" | findstr /i "node.exe" >nul
if errorlevel 1 (
    echo All Node.js processes terminated successfully
) else (
    echo Warning: Some Node.js processes may still be running
    echo Attempting to force-kill all node.exe processes...
    taskkill /IM node.exe /F >nul 2>&1
)

echo.
echo ========================================
echo All CompWatch AI services stopped
echo ========================================
