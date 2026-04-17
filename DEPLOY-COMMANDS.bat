@echo off
REM Quick deployment commands for Kaalaman

echo.
echo 🚀 Kaalaman Deployment Helper
echo ============================
echo.

echo ✅ Vercel CLI is already installed!
echo.

echo 📋 Follow these steps:
echo.

echo Step 1: Login to Vercel
echo ------------------------
echo Run this command:
echo   vercel login
echo.
echo This will send a verification email to you.
echo Click the link in the email to verify.
echo.

set /p CONTINUE="Have you logged in? (y/n): "

if /i "%CONTINUE%"=="y" (
    echo.
    echo Step 2: Deploying to Vercel...
    echo -------------------------------
    echo.
    
    call vercel
    
    echo.
    echo ✅ Deployment initiated!
    echo.
    echo 📋 Next steps:
    echo.
    echo 1. Go to https://vercel.com/dashboard
    echo 2. Click your project
    echo 3. Go to Settings → Environment Variables
    echo 4. Add: OPENAI_API_KEY = your_api_key
    echo 5. Run: vercel --prod
    echo.
    echo Then access your app at the URL shown above!
    echo.
) else (
    echo.
    echo No problem! Run this when you're ready:
    echo   vercel login
    echo.
    echo Then run this script again.
    echo.
)

echo.
echo 📖 For detailed instructions, see: DEPLOY-NOW.md
echo.

pause
