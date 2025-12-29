@echo off
title WebCraft Studio Launcher
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   🚀 WebCraft Studio - Quick Start                           ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if concurrently is installed
if not exist "node_modules\concurrently" (
    echo 📦 Installing root dependencies...
    npm install
    echo.
)

:: Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
    echo.
)

:: Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
    echo.
)

echo ✅ All dependencies installed!
echo.
echo 🔄 Starting WebCraft Studio...
echo.
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo    Press Ctrl+C to stop all services
echo.

npm run dev

pause
