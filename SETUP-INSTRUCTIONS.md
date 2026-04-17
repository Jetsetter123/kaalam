# 🚀 Kaalaman Setup Instructions

## Current Status
Your app is deployed but needs environment variables configured. Follow these steps to get everything working.

---

## ✅ Step 1: Add Gemini API Key to Vercel

### Get Your FREE Gemini API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API key"** or **"Get API key"**
3. Select **"Create API key in new project"** (or use existing)
4. Copy the API key (starts with `AIza...`)

### Add to Vercel
1. Go to: https://vercel.com/kylejoshua878-9097s-projects/kaalaman/settings/environment-variables
2. Click **"Add New"**
3. Add this variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your API key (paste the `AIza...` key)
   - **Environments:** Check all boxes (Production, Preview, Development)
4. Click **Save**

---

## ✅ Step 2: Fix Google OAuth Redirect URI

### Update Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one you created for this app)
3. Click on it to edit
4. Under **"Authorized redirect URIs"**, add:
   ```
   https://kaalaman-eta.vercel.app/api/auth/callback/google
   ```
5. Click **Save**

### Update GitHub OAuth Settings
1. Go to: https://github.com/settings/developers
2. Find your OAuth App for Kaalaman
3. Under **"Authorization callback URL"**, make sure it's:
   ```
   https://kaalaman-eta.vercel.app/api/auth/callback/github
   ```
4. Click **Update application**

---

## ✅ Step 3: Add Missing Environment Variables to Vercel

Go back to: https://vercel.com/kylejoshua878-9097s-projects/kaalaman/settings/environment-variables

Add these if they're missing:

### NEXTAUTH_SECRET
- **Name:** `NEXTAUTH_SECRET`
- **Value:** Generate a random secret by running this in your terminal:
  ```bash
  openssl rand -base64 32
  ```
  Or use this online generator: https://generate-secret.vercel.app/32
- **Environments:** Check all boxes

### NEXTAUTH_URL
- **Name:** `NEXTAUTH_URL`
- **Value:** `https://kaalaman-eta.vercel.app`
- **Environments:** Check all boxes

---

## ✅ Step 4: Redeploy Your App

After adding all environment variables, redeploy:

### Option A: Automatic Redeploy (Recommended)
1. Go to: https://vercel.com/kylejoshua878-9097s-projects/kaalaman
2. Click on the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional, makes it faster)
6. Click **"Redeploy"**

### Option B: Manual Redeploy via Git
```bash
git add .
git commit -m "Update Gemini model to 2.5-flash"
git push
```

---

## 🎯 What Changed?

### Fixed Gemini Model Error
- **Old:** `gemini-1.5-pro` (deprecated, causing 404 error)
- **New:** `gemini-2.5-flash` (current recommended model)
- **Why:** Google deprecated the 1.5 series. The 2.5 series is faster and better.

### OAuth Redirect URIs
- Added proper callback URLs for Google and GitHub
- This fixes the "redirect_uri_mismatch" error

---

## 📋 Checklist

Before testing, make sure you have:

- [ ] Added `GEMINI_API_KEY` to Vercel
- [ ] Added `NEXTAUTH_SECRET` to Vercel
- [ ] Added `NEXTAUTH_URL` to Vercel
- [ ] Updated Google OAuth redirect URI in Google Cloud Console
- [ ] Updated GitHub OAuth callback URL in GitHub settings
- [ ] Redeployed the app on Vercel

---

## 🧪 Test Your App

1. Go to: https://kaalaman-eta.vercel.app
2. Try chatting with the AI (should work now!)
3. Try signing in with Google (should work now!)
4. Try signing in with GitHub (should work now!)

---

## 💡 Gemini Model Info

Your app now uses **Gemini 2.5 Flash**, which is:
- ✅ **FREE** (generous limits: 10 RPM, 250 RPD)
- ✅ **Fast** (optimized for low-latency)
- ✅ **Smart** (great reasoning capabilities)
- ✅ **Current** (latest stable model from Google)

---

## 🆘 Troubleshooting

### Still getting "model not found" error?
- Make sure you added `GEMINI_API_KEY` to Vercel
- Make sure you redeployed after adding the key
- Check that your API key is valid at: https://aistudio.google.com/app/apikey

### Still getting OAuth errors?
- Double-check the redirect URIs match exactly (including https://)
- Make sure you saved changes in Google Cloud Console
- Try signing out and back in

### Chat not working?
- Check Vercel deployment logs: https://vercel.com/kylejoshua878-9097s-projects/kaalaman
- Look for any error messages in the logs
- Make sure all environment variables are set

---

## 📞 Need Help?

If you're still having issues:
1. Check the Vercel deployment logs
2. Check the browser console (F12) for errors
3. Make sure all environment variables are set correctly

---

**Your app should be fully working after following these steps! 🎉**
