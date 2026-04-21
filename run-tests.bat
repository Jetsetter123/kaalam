@echo off
REM Quick test runner for Kaalaman

echo.
echo ========================================
echo   Kaalaman API Test Runner
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Checking Python dependencies...
pip show requests >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing required packages...
    pip install requests colorama
    echo.
)

echo [2/3] Checking if server is running...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Server is not running on http://localhost:3000
    echo.
    echo Please start your server first:
    echo   npm run dev
    echo.
    echo Or test production:
    echo   set TEST_URL=https://kaalaman-eta.vercel.app
    echo   python tests/test_api.py
    echo.
    pause
    exit /b 1
)

echo [3/3] Running tests...
echo.
python tests/test_api.py

echo.
echo ========================================
echo   Tests Complete!
echo ========================================
echo.
pause
