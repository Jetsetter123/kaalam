#!/bin/bash

# Kaalaman Remote Setup Script
# This script helps you deploy Kaalaman to avoid running it locally

echo "🚀 Kaalaman Remote Setup"
echo "========================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🔑 Before deploying, make sure you have:"
echo "   1. A Vercel account (free at vercel.com)"
echo "   2. Your OpenAI API key ready"
echo ""

read -p "Ready to deploy? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🚀 Starting deployment..."
    echo ""
    
    # Deploy to Vercel
    vercel
    
    echo ""
    echo "✅ Deployment initiated!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to vercel.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Go to Settings → Environment Variables"
    echo "   4. Add: OPENAI_API_KEY = your_api_key"
    echo "   5. Redeploy: vercel --prod"
    echo ""
    echo "   Then copy your deployment URL and update .env.local:"
    echo "   NEXT_PUBLIC_API_URL=https://your-app.vercel.app"
    echo ""
else
    echo ""
    echo "ℹ️  No problem! You can deploy later with: vercel"
    echo ""
    echo "📖 See DEPLOYMENT.md for other hosting options"
    echo ""
fi
