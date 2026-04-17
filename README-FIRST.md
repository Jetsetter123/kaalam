# 🎯 READ THIS FIRST: Save Your RAM!

## The Problem

Running Kaalaman locally with `npm run dev` uses **500+ MB of RAM** because it runs a Next.js development server on your computer.

## The Solution

Deploy Kaalaman to Vercel (free) and use it from anywhere with **0 MB RAM usage** on your local machine!

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Step 2: Add Your OpenAI Key

1. Go to https://vercel.com/dashboard
2. Click your project → Settings → Environment Variables
3. Add: `OPENAI_API_KEY` = your key
4. Run: `vercel --prod`

### Step 3: Done!

Access your app at: `https://your-app.vercel.app`

**No local server needed. No RAM usage. Access from anywhere.**

---

## 📚 Documentation Guide

Not sure where to start? Here's what to read:

### 🎯 Start Here
- **[START-HERE.html](START-HERE.html)** - Interactive guide (open in browser)
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Quick commands and tips

### 📖 Setup Guides
- **[REMOTE-SETUP-QUICKSTART.md](REMOTE-SETUP-QUICKSTART.md)** - 5-minute deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - How it works

### 🔧 Reference
- **[CHANGES-SUMMARY.md](CHANGES-SUMMARY.md)** - What changed in this version
- **[README.md](README.md)** - Full project documentation

### 🛠️ Tools
- **check-setup.bat** (Windows) or **check-setup.sh** (Linux/Mac) - Check your config
- **setup-remote.bat** (Windows) or **setup-remote.sh** (Linux/Mac) - Automated setup

---

## 🎯 Three Ways to Use Kaalaman

### 1. 🚀 Remote Deploy (RECOMMENDED)
- **RAM:** 0 MB
- **Setup:** 5 minutes
- **Best for:** Daily use, saving resources
- **Guide:** [REMOTE-SETUP-QUICKSTART.md](REMOTE-SETUP-QUICKSTART.md)

### 2. 🌙 Lite Mode
- **RAM:** ~50 MB
- **Setup:** 0 minutes
- **Best for:** Offline use, quick tasks
- **How:** Open app, toggle "Lite Mode" ON

### 3. 💻 Local Server (NOT RECOMMENDED)
- **RAM:** 500+ MB ⚠️
- **Setup:** 2 minutes
- **Best for:** Development only
- **How:** `npm run dev`

---

## 🎬 Quick Actions

### Check Your Setup
```bash
# Windows
check-setup.bat

# Linux/Mac
./check-setup.sh
```

### Deploy to Vercel
```bash
# Automated
setup-remote.bat    # Windows
./setup-remote.sh   # Linux/Mac

# Manual
vercel --prod
```

### Use Lite Mode
1. Open [standalone.html](standalone.html) in browser
2. Toggle "Lite Mode" ON
3. Upload documents and use quick actions

---

## 📊 Comparison Table

| Method | RAM | Setup | AI Quality | Internet | Cost |
|--------|-----|-------|------------|----------|------|
| **Remote** | 0 MB | 5 min | ⭐⭐⭐⭐⭐ | Required | Free |
| **Lite** | 50 MB | 0 min | ⭐⭐⭐ | Optional | Free |
| **Local** | 500+ MB | 2 min | ⭐⭐⭐⭐⭐ | Required | Free |

---

## ❓ FAQ

### Q: Do I need to run `npm run dev` anymore?
**A:** No! Once deployed to Vercel, just use the Vercel URL. Never run the local server again.

### Q: What if I'm offline?
**A:** Use Lite Mode! Toggle it ON in the app for browser-only processing.

### Q: Is Vercel really free?
**A:** Yes! The free tier is generous and perfect for personal projects.

### Q: What about my OpenAI API key?
**A:** Store it securely in Vercel's dashboard, not in your code.

### Q: Can I still develop locally?
**A:** Yes, but only when you're actually developing. For daily use, use the deployed version.

---

## 🆘 Troubleshooting

### "API calls failing"
→ Check `.env.local` has `NEXT_PUBLIC_API_URL` set correctly

### "OpenAI API key not configured"
→ Add it in Vercel dashboard → Environment Variables

### "Still using too much RAM"
→ Make sure you're NOT running `npm run dev`

### "Vercel command not found"
→ Run `npm install -g vercel`

---

## 🎯 Recommended Workflow

```
1. Deploy to Vercel (one time, 5 minutes)
         ↓
2. Use Vercel URL for all work (0 RAM)
         ↓
3. Enable Lite Mode when offline
         ↓
4. Never run npm run dev (unless developing)
```

---

## 📞 Need Help?

1. **Interactive Guide:** Open [START-HERE.html](START-HERE.html)
2. **Quick Reference:** Read [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
3. **Full Guide:** Read [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Issues:** https://github.com/Jetsetter123/kaalam/issues

---

## 🎉 Next Steps

1. ✅ Read this file (you're here!)
2. ✅ Open [START-HERE.html](START-HERE.html) in your browser
3. ✅ Choose your setup method
4. ✅ Deploy and enjoy 0 RAM usage!

---

**Remember:** The goal is to **never run the local server** to save your RAM. Deploy once, use everywhere! 🚀

---

## 📁 File Structure

```
kaalaman/
├── START-HERE.html              ← Open this first!
├── README-FIRST.md              ← You are here
├── QUICK-REFERENCE.md           ← Quick commands
├── REMOTE-SETUP-QUICKSTART.md   ← 5-minute setup
├── DEPLOYMENT.md                ← Full deployment guide
├── ARCHITECTURE.md              ← How it works
├── CHANGES-SUMMARY.md           ← What changed
├── check-setup.bat/.sh          ← Check your config
├── setup-remote.bat/.sh         ← Automated setup
├── standalone.html              ← Standalone version
├── .env.example                 ← Configuration template
└── README.md                    ← Full documentation
```

---

**Start here:** Open [START-HERE.html](START-HERE.html) in your browser! 🚀
