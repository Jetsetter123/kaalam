#!/bin/bash

# Kaalaman Setup Checker
# This script checks your current configuration

echo ""
echo "📋 Kaalaman Setup Checker"
echo "========================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local file found"
    echo ""
    echo "📄 Current configuration:"
    cat .env.local
    echo ""
else
    echo "⚠️  .env.local file not found"
    echo ""
    echo "💡 You need to create .env.local to configure your setup"
    echo "   Copy .env.example to .env.local and edit it"
    echo ""
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "   Run: npm install"
fi

echo ""
echo "🔍 Checking for Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed"
    echo ""
    echo "📊 Your Vercel deployments:"
    vercel ls 2>/dev/null || echo "   (Not logged in or no deployments)"
else
    echo "⚠️  Vercel CLI not installed"
    echo "   Install with: npm install -g vercel"
fi

echo ""
echo "========================"
echo "📖 Setup Options:"
echo ""
echo "1. Deploy to Vercel (Recommended - 0 MB RAM)"
echo "   Run: ./setup-remote.sh"
echo ""
echo "2. Use Lite Mode (No deployment - ~50 MB RAM)"
echo "   Open: standalone.html"
echo ""
echo "3. Run Locally (High RAM - 500+ MB)"
echo "   Run: npm run dev"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - START-HERE.html (interactive guide)"
echo "   - REMOTE-SETUP-QUICKSTART.md (5-minute setup)"
echo "   - DEPLOYMENT.md (full guide)"
echo ""
