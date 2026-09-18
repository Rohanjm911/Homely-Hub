@echo off
title HomelyHub Launcher
color 0B

echo ===================================================
echo             Starting HomelyHub Platform            
echo   AI-Powered Stay Booking ^& Trip Planning (MERN)   
echo ===================================================
echo.

set ROOT_DIR=%~dp0

:: Check if backend dependencies are installed
if not exist "%ROOT_DIR%backend\node_modules" (
    echo [1/3] Installing Backend dependencies...
    cd /d "%ROOT_DIR%backend"
    call npm install
) else (
    echo [1/3] Backend dependencies found.
)

:: Check if frontend dependencies are installed
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo [2/3] Installing Frontend dependencies...
    cd /d "%ROOT_DIR%frontend"
    call npm install
) else (
    echo [2/3] Frontend dependencies found.
)

echo.
echo [3/3] Launching Backend ^& Frontend services...
echo.

:: Launch Backend in separate window
start "HomelyHub Backend API (Port 5000)" cmd /k "cd /d "%ROOT_DIR%backend" && echo Starting Backend on http://localhost:5000/api... && npm start"

:: Launch Frontend in separate window
start "HomelyHub Frontend App (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && echo Starting Frontend on http://localhost:5173/... && npm run dev"

:: Wait 3 seconds and open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo ===================================================
echo  HomelyHub is up and running!
echo  Frontend : http://localhost:5173/
echo  Backend  : http://localhost:5000/api
echo ===================================================
echo You can close this window now. The servers will continue running.
pause
