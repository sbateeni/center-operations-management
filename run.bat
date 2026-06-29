@echo off
title إدارة عمليات المراكز
color 0A

echo =============================================
echo    إدارة عمليات المراكز
echo =============================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Node.js found: 
node -v
echo.

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting development server...
echo.
call npm run dev

pause
