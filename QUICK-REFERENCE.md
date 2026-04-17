# Kaalaman Quick Reference Card

## 🎯 Goal: Use Kaalaman Without Eating Your RAM

## Three Ways to Use Kaalaman

### 🚀 Method 1: Remote Deploy (RECOMMENDED)
**RAM Usage:** 0 MB  
**Setup Time:** 5 minutes  
**Best For:** Daily use, production, saving resources

```bash
npm install -g vercel
vercel
# Add OPENAI_API_KEY in Vercel dashboard
# Access at: https://your-app.vercel.app
```

---

### 🌙 Method 2: Lite Mode
**RAM Usage:** ~50 MB  
**Setup Time:** 0 minutes  
**Best For:** Offline use, quick tasks

1. Open `standalone.html` or the app
2. Toggle "Lite Mode" ON
3. Upload documents and use quick actions

---

### 💻 Method 3: Local Server
**RAM Usage:** 500+ MB ⚠️  
**Setup Time:** 2 minutes  
**Best For:** Development only

```bash
npm install
# Create .env.local with OPENAI_API_KEY
npm run dev
# Open http://localhost:3000
```

---

## Quick Commands

### Deployment
```bash
vercel                    # Deploy to Vercel
vercel --prod            # Deploy to production
vercel ls                # List deployments
vercel logs              # View logs
```

### Local Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (HIGH RAM)
npm run build            # Build for production
npm run serve:static     # Serve static files (LOW RAM)
```

### Setup Helpers
```bash
# Windows
check-setup.bat          # Check your configuration
setup-remote.bat         # Automated Vercel setup

# Linux/Mac
./check-setup.sh         # Check your configuration
./setup-remote.sh        # Automated Vercel setup
```

---

## Configuration Files

### .env.local
```bash
# For remote API (recommended)
NEXT_PUBLIC_API_URL=https://your-app.vercel.app

# For local development (high RAM)
OPENAI_API_KEY=your_key_here
```

---

## File Guide

| File | Purpose |
|------|---------|
| `START-HERE.html` | Interactive setup guide |
| `REMOTE-SETUP-QUICKSTART.md` | 5-minute deployment guide |
| `DEPLOYMENT.md` | Comprehensive deployment guide |
| `standalone.html` | Standalone version with instructions |
| `check-setup.bat/.sh` | Check your configuration |
| `setup-remote.bat/.sh` | Automated deployment |

---

## Troubleshooting

### Problem: API calls failing
**Solution:** Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Problem: "OpenAI API key not configured"
**Solution:** Add key in Vercel dashboard → Environment Variables

### Problem: Still using too much RAM
**Solution:** Stop running `npm run dev`, use deployed URL instead

### Problem: Vercel command not found
**Solution:** Run `npm install -g vercel`

---

## Recommended Workflow

1. ✅ Deploy to Vercel once (5 minutes)
2. ✅ Use Vercel URL for all work (0 RAM)
3. ✅ Enable Lite Mode when offline
4. ❌ Never run `npm run dev` (unless developing)

---

## Support Resources

- 🌐 Vercel Docs: https://vercel.com/docs
- 📖 Full Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🚀 Quick Start: [REMOTE-SETUP-QUICKSTART.md](./REMOTE-SETUP-QUICKSTART.md)
- 🎯 Interactive: [START-HERE.html](./START-HERE.html)
- 🐛 Issues: https://github.com/Jetsetter123/kaalam/issues

---

## RAM Comparison

| Method | RAM | CPU | Network | AI Quality |
|--------|-----|-----|---------|------------|
| Remote Deploy | 0 MB | 0% | Required | ⭐⭐⭐⭐⭐ |
| Lite Mode | 50 MB | 5% | Optional | ⭐⭐⭐ |
| Local Dev | 500+ MB | 20%+ | Required | ⭐⭐⭐⭐⭐ |

---

**Remember:** Deploy once, use everywhere! 🚀
