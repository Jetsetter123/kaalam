@echo off
REM Kaalaman Remote Setup Script for Windows
REM This script helps you deploy Kaalaman to avoid running it locally

echo.
echo 🚀 Kaalaman Remote Setup
echo ========================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Vercel CLI not found. Installing...
    call npm install -g vercel
) else (
    echo ✅ Vercel CLI already installed
)

echo.
echo 🔑 Before deploying, make sure you have:
echo    1. A Vercel account (free at vercel.com)
echo    2. Your OpenAI API key ready
echo.

set /p REPLY="Ready to deploy? (y/n): "

if /i "%REPLY%"=="y" (
    echo.
    echo 🚀 Starting deployment...
    echo.
    
    REM Deploy to Vercel
    call vercel
    
    echo.
    echo ✅ Deployment initiated!
    echo.
    echo 📋 Next steps:
    echo    1. Go to vercel.com/dashboard
    echo    2. Select your project
    echo    3. Go to Settings → Environment Variables
    echo    4. Add: OPENAI_API_KEY = your_api_key
    echo    5. Redeploy: vercel --prod
    echo.
    echo    Then copy your deployment URL and update .env.local:
    echo    NEXT_PUBLIC_API_URL=https://your-app.vercel.app
    echo.
) else (
    echo.
    echo ℹ️  No problem! You can deploy later with: vercel
    echo.
    echo 📖 See DEPLOYMENT.md for other hosting options
    echo.
)

pause
