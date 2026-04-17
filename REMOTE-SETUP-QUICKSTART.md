# 🚀 Quick Start: Use Kaalaman Without Running Locally

**Problem:** Running Next.js locally eats up your RAM (500+ MB)

**Solution:** Deploy to Vercel (free) and use it from anywhere with 0 local RAM usage!

## 5-Minute Setup

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy your app
vercel
```

Follow the prompts:
- Login to Vercel (creates free account if needed)
- Confirm project settings
- Wait for deployment (~2 minutes)

### Step 2: Add Your OpenAI Key

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
5. Click **Save**

### Step 3: Redeploy

```bash
vercel --prod
```

### Step 4: Get Your URL

After deployment completes, Vercel will show your URL:
```
✅ Production: https://kaalaman-abc123.vercel.app
```

### Step 5: Use Your App!

Just open that URL in your browser. Done! 🎉

**No local server needed. No RAM usage. Access from anywhere.**

---

## Alternative: Use Lite Mode (No Deployment)

If you don't want to deploy at all:

1. Open `standalone.html` in your browser
2. Toggle **Lite Mode** ON
3. Upload documents and use quick actions

**Lite Mode works entirely in your browser** with basic AI features (summaries, quizzes, explanations).

---

## Comparison

| Method | Setup Time | RAM Usage | AI Quality | Internet Required |
|--------|------------|-----------|------------|-------------------|
| **Vercel Deploy** | 5 min | 0 MB | ⭐⭐⭐⭐⭐ | Yes |
| **Lite Mode** | 0 min | ~50 MB | ⭐⭐⭐ | No |
| **Local Dev** | 0 min | 500+ MB | ⭐⭐⭐⭐⭐ | Yes |

---

## Troubleshooting

**"Command not found: vercel"**
- Run: `npm install -g vercel`
- Restart your terminal

**"OpenAI API key not configured"**
- Make sure you added it in Vercel dashboard
- Redeploy after adding: `vercel --prod`

**"Deployment failed"**
- Check you have a Vercel account
- Make sure you're logged in: `vercel login`

---

## Need More Help?

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Vercel docs: https://vercel.com/docs
- Open an issue: https://github.com/Jetsetter123/kaalam/issues

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm kaalaman
```
