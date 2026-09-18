@echo off
title Stop HomelyHub
color 0C

echo ===================================================
echo             Stopping HomelyHub Platform            
echo ===================================================
echo.

echo Terminating running Node and Vite processes on ports 5000 and 5173...

:: Find and kill process on port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5000" ^| findstr "LISTENING"') do (
    if not "%%a"=="" if not "%%a"=="0" (
        echo Stopping Backend service (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: Find and kill process on port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    if not "%%a"=="" if not "%%a"=="0" (
        echo Stopping Frontend service (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: Close launcher cmd windows if still open by title
taskkill /F /FI "WINDOWTITLE eq HomelyHub Backend API*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq HomelyHub Frontend App*" >nul 2>&1

echo.
echo ===================================================
echo   All HomelyHub servers have been stopped!
echo ===================================================
echo.
pause
