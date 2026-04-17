@echo off
REM Kaalaman Setup Checker
REM This script checks your current configuration

echo.
echo 📋 Kaalaman Setup Checker
echo ========================
echo.

REM Check if .env.local exists
if exist .env.local (
    echo ✅ .env.local file found
    echo.
    echo 📄 Current configuration:
    type .env.local
    echo.
) else (
    echo ⚠️  .env.local file not found
    echo.
    echo 💡 You need to create .env.local to configure your setup
    echo    Copy .env.example to .env.local and edit it
    echo.
)

REM Check if node_modules exists
if exist node_modules (
    echo ✅ Dependencies installed
) else (
    echo ⚠️  Dependencies not installed
    echo    Run: npm install
)

echo.
echo 🔍 Checking for Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Vercel CLI installed
    echo.
    echo 📊 Your Vercel deployments:
    call vercel ls 2>nul
) else (
    echo ⚠️  Vercel CLI not installed
    echo    Install with: npm install -g vercel
)

echo.
echo ========================
echo 📖 Setup Options:
echo.
echo 1. Deploy to Vercel (Recommended - 0 MB RAM)
echo    Run: setup-remote.bat
echo.
echo 2. Use Lite Mode (No deployment - ~50 MB RAM)
echo    Open: standalone.html
echo.
echo 3. Run Locally (High RAM - 500+ MB)
echo    Run: npm run dev
echo.
echo 📚 For detailed instructions, see:
echo    - START-HERE.html (interactive guide)
echo    - REMOTE-SETUP-QUICKSTART.md (5-minute setup)
echo    - DEPLOYMENT.md (full guide)
echo.

pause
