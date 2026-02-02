@echo off
echo ========================================
echo CompWatch AI - Starting Services
echo ========================================
echo.

REM Start Frontend Dev Server
echo [1/2] Starting Frontend (Vite)...
cd frontend
start "CompWatch Frontend" cmd /k "npm run dev"
cd ..

echo.
echo [2/2] Backend Note: Run 'node backend\run-report.js' to generate reports
echo.
echo ========================================
echo Services Started!
echo ========================================
echo Frontend: http://localhost:5173/
echo.
echo To generate a report, run:
echo   cd backend ^&^& node run-report.js
echo.
echo To stop all services, run: stop.bat
echo ========================================
