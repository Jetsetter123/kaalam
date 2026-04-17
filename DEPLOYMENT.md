# Deployment Guide - Use Remote API Instead of Local Server

This guide explains how to use Kaalaman without running it locally, which will save your RAM.

## Why Deploy Remotely?

Running Next.js locally consumes significant RAM (especially with the dev server). By deploying to a cloud service, you can:
- ✅ Use the app from any device
- ✅ Save local RAM and CPU resources
- ✅ Access it from anywhere with internet
- ✅ Let the cloud provider handle the server resources

## Option 1: Deploy to Vercel (Recommended - Free Tier Available)

Vercel is the easiest option since it's made by the creators of Next.js.

### Steps:

1. **Install Vercel CLI** (one-time setup):
   ```bash
   npm install -g vercel
   ```

2. **Deploy your app**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your project name
   - Confirm the settings

3. **Add Environment Variables**:
   - Go to your Vercel dashboard: https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `OPENAI_API_KEY` with your OpenAI API key

4. **Get Your Deployment URL**:
   - After deployment, Vercel will give you a URL like: `https://kaalaman-xyz.vercel.app`
   - Copy this URL

5. **Update Local Configuration**:
   - Open `.env.local` in your project
   - Set: `NEXT_PUBLIC_API_URL=https://your-app.vercel.app`
   - Replace with your actual Vercel URL

6. **Access Your App**:
   - Open the Vercel URL in your browser
   - No local server needed!

### Deploy Updates:
```bash
vercel --prod
```

## Option 2: Deploy to Netlify (Free Tier Available)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**:
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add `OPENAI_API_KEY`

## Option 3: Deploy to Railway (Free Tier Available)

1. Go to https://railway.app
2. Connect your GitHub repository
3. Add environment variable: `OPENAI_API_KEY`
4. Railway will auto-deploy

## Option 4: Use Lite Mode (No Deployment Needed)

If you don't want to deploy at all, you can use **Lite Mode**:

1. Open the app (even locally once)
2. Toggle "Lite Mode" ON in the header
3. Upload your documents
4. Use the quick actions

**Lite Mode Features:**
- ✅ Works entirely in your browser
- ✅ No server needed
- ✅ No API calls
- ✅ Basic summaries, quizzes, explanations
- ⚠️ Less sophisticated than AI mode
- ⚠️ Limited to simple text processing

## Option 5: Static HTML Version

For the absolute lightest option:

1. **Build static version**:
   ```bash
   npm run build
   ```

2. **Serve the static files**:
   ```bash
   npm run serve:static
   ```
   Or open `out/index.html` directly in your browser

3. **Configure Remote API**:
   - Make sure `.env.local` has `NEXT_PUBLIC_API_URL` set to your deployed backend
   - The static HTML will call the remote API

## Comparison Table

| Option | RAM Usage | Setup Difficulty | Cost | AI Features |
|--------|-----------|------------------|------|-------------|
| **Vercel** | 0 MB (remote) | Easy | Free tier | ✅ Full |
| **Netlify** | 0 MB (remote) | Easy | Free tier | ✅ Full |
| **Railway** | 0 MB (remote) | Very Easy | Free tier | ✅ Full |
| **Lite Mode** | ~50 MB | None | Free | ⚠️ Basic |
| **Local Dev** | 500+ MB | None | Free | ✅ Full |

## Recommended Workflow

1. **Deploy once to Vercel** (takes 5 minutes)
2. **Use the Vercel URL** for daily work
3. **Enable Lite Mode** when offline or for quick tasks
4. **Never run `npm run dev` locally** unless you're developing

## Troubleshooting

### "API URL not configured"
- Make sure `.env.local` has `NEXT_PUBLIC_API_URL` set
- Rebuild after changing environment variables

### "OpenAI API key not configured"
- Add the key in your deployment platform's dashboard
- Don't put it in `.env.local` (that's only for local development)

### "CORS errors"
- Make sure your deployed API allows requests from your domain
- Check Vercel/Netlify logs for errors

## Quick Commands Reference

```bash
# Deploy to Vercel
vercel --prod

# Build static version
npm run build

# Serve static files locally (lightweight)
npm run serve:static

# Check deployment status
vercel ls
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
- Open an issue: https://github.com/Jetsetter123/kaalam/issues
