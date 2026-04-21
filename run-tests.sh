#!/bin/bash
# Quick test runner for Kaalaman

echo ""
echo "========================================"
echo "  Kaalaman API Test Runner"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python is not installed"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "[1/3] Checking Python dependencies..."
if ! python3 -c "import requests" &> /dev/null; then
    echo "[INFO] Installing required packages..."
    pip3 install requests colorama
    echo ""
fi

echo "[2/3] Checking if server is running..."
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "[WARNING] Server is not running on http://localhost:3000"
    echo ""
    echo "Please start your server first:"
    echo "  npm run dev"
    echo ""
    echo "Or test production:"
    echo "  export TEST_URL=https://kaalaman-eta.vercel.app"
    echo "  python3 tests/test_api.py"
    echo ""
    exit 1
fi

echo "[3/3] Running tests..."
echo ""
python3 tests/test_api.py

echo ""
echo "========================================"
echo "  Tests Complete!"
echo "========================================"
echo ""
