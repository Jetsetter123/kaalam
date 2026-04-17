# Changes Summary: Remote API Configuration

## What Changed?

Your Kaalaman app has been modified to support using a **remote API** instead of running locally, which will save your RAM.

## Files Modified

### 1. **app/page.tsx**
- Updated to use `NEXT_PUBLIC_API_URL` environment variable
- API calls now go to remote server if configured
- Falls back to local API if not configured

### 2. **.env.local** (Created)
- Configuration file for remote API URL
- Set `NEXT_PUBLIC_API_URL` to your deployed app URL

### 3. **.env.example** (Updated)
- Added documentation for three setup options
- Clear instructions for remote vs local configuration

### 4. **package.json** (Updated)
- Added `build:static` script for static export
- Added `serve:static` script to serve static files
- Added `deploy:vercel` script for easy deployment

## New Files Created

### Setup & Documentation
1. **START-HERE.html** - Interactive guide to choose your setup method
2. **DEPLOYMENT.md** - Comprehensive deployment guide
3. **REMOTE-SETUP-QUICKSTART.md** - Quick 5-minute setup guide
4. **standalone.html** - Standalone HTML version with setup instructions

### Configuration
5. **vercel.json** - Vercel deployment configuration
6. **config.js** - API configuration helper

### Scripts
7. **setup-remote.sh** - Automated setup script (Linux/Mac)
8. **setup-remote.bat** - Automated setup script (Windows)

## How to Use

### Quick Start (Recommended)

1. **Open START-HERE.html** in your browser
2. Choose your preferred method:
   - 🚀 **Remote Deploy** (0 MB RAM) - Recommended
   - 🌙 **Lite Mode** (~50 MB RAM) - No deployment needed
   - 💻 **Local** (500+ MB RAM) - Traditional method

### Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add OPENAI_API_KEY in Vercel dashboard
# Then use your app at the provided URL
```

### Use Lite Mode (0 minutes)

1. Open the app
2. Toggle "Lite Mode" ON
3. Upload documents and use quick actions
4. Works entirely in browser, no server needed

## Benefits

| Method | RAM Usage | Setup Time | AI Quality | Cost |
|--------|-----------|------------|------------|------|
| **Remote (Vercel)** | 0 MB | 5 min | ⭐⭐⭐⭐⭐ | Free |
| **Lite Mode** | ~50 MB | 0 min | ⭐⭐⭐ | Free |
| **Local Dev** | 500+ MB | 0 min | ⭐⭐⭐⭐⭐ | Free |

## What Didn't Change

- All existing features work the same way
- API routes are unchanged
- UI and functionality remain identical
- Lite Mode still works as before

## Recommended Workflow

1. **Deploy once to Vercel** (takes 5 minutes)
2. **Use the Vercel URL** for daily work (0 RAM usage)
3. **Enable Lite Mode** when offline
4. **Never run `npm run dev`** unless developing

## Troubleshooting

### "API calls failing"
- Make sure `.env.local` has `NEXT_PUBLIC_API_URL` set correctly
- Verify your deployed app is running
- Check Vercel dashboard for errors

### "OpenAI API key not configured"
- Add the key in Vercel dashboard → Settings → Environment Variables
- Redeploy after adding: `vercel --prod`

### "Still using too much RAM"
- Make sure you're NOT running `npm run dev`
- Use the deployed URL instead
- Or use Lite Mode for browser-only processing

## Next Steps

1. **Read:** [REMOTE-SETUP-QUICKSTART.md](./REMOTE-SETUP-QUICKSTART.md)
2. **Deploy:** Run `vercel` or use `setup-remote.bat` (Windows) / `setup-remote.sh` (Linux/Mac)
3. **Configure:** Update `.env.local` with your deployment URL
4. **Use:** Access your app from the Vercel URL

## Support

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Quick start: [REMOTE-SETUP-QUICKSTART.md](./REMOTE-SETUP-QUICKSTART.md)
- Interactive guide: [START-HERE.html](./START-HERE.html)
- Issues: https://github.com/Jetsetter123/kaalam/issues

---

**Remember:** The goal is to **never run the local server** to save your RAM. Deploy once, use everywhere! 🚀
