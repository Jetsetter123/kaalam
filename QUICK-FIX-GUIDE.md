# Quick Fix Guide - Environment Variables

## 🚨 IMPORTANT: You MUST add these to Vercel Dashboard

Your app is deployed but needs environment variables to work!

---

## Step 1: Add OpenAI API Key

1. Go to https://vercel.com/kylejoshua878-9097s-projects/kaalaman/settings/environment-variables
2. Click "Add New"
3. **Key:** `OPENAI_API_KEY`
4. **Value:** Your OpenAI API key (starts with `sk-`)
5. Select: **All** (Production, Preview, Development)
6. Click **Save**

---

## Step 2: Add NextAuth Secret

1. Click "Add New" again
2. **Key:** `NEXTAUTH_SECRET`
3. **Value:** Any random string (at least 32 characters)
   - Example: `kaalaman-secret-key-2024-production-xyz123`
4. Select: **All**
5. Click **Save**

---

## Step 3: Add NextAuth URL

1. Click "Add New"
2. **Key:** `NEXTAUTH_URL`
3. **Value:** `https://kaalaman-eta.vercel.app`
4. Select: **All**
5. Click **Save**

---

## Step 4: Add GitHub OAuth (You said you have ID and Secret)

1. Click "Add New"
2. **Key:** `GITHUB_ID`
3. **Value:** Your GitHub Client ID
4. Select: **All**
5. Click **Save**

6. Click "Add New"
7. **Key:** `GITHUB_SECRET`
8. **Value:** Your GitHub Client Secret
9. Select: **All**
10. Click **Save**

---

## Step 5: Add Google OAuth (You said you have ID and Secret)

1. Click "Add New"
2. **Key:** `GOOGLE_ID`
3. **Value:** Your Google Client ID
4. Select: **All**
5. Click **Save**

6. Click "Add New"
7. **Key:** `GOOGLE_SECRET`
8. **Value:** Your Google Client Secret
9. Select: **All**
10. Click **Save**

---

## Step 6: Redeploy

After adding ALL variables, run:

```bash
vercel --prod
```

---

## ✅ What's Fixed

1. **Login modal** - Now has WHITE background (not transparent)
2. **Auth error** - Added fallback secret and better error handling
3. **OpenAI error** - Will work once you add the API key in Vercel
4. **Voice recognition** - Already working
5. **General knowledge** - Can answer anything

---

## 🎯 Quick Test

After adding variables and redeploying:

1. **Test Chat:**
   - Open https://kaalaman-eta.vercel.app
   - Type "What is AI?"
   - Should get a response

2. **Test Login:**
   - Click "Sign In / Sign Up"
   - Should see WHITE modal
   - Click Google or GitHub
   - Should login successfully

3. **Test Voice:**
   - Click "VOICE" button
   - Speak a question
   - Should transcribe and send

---

## 🔗 Direct Links

- **Add Variables:** https://vercel.com/kylejoshua878-9097s-projects/kaalaman/settings/environment-variables
- **Your App:** https://kaalaman-eta.vercel.app
- **Deployment Logs:** https://vercel.com/kylejoshua878-9097s-projects/kaalaman

---

## ⚠️ MUST DO NOW

1. Go to Vercel dashboard
2. Add ALL 6 environment variables
3. Run `vercel --prod`
4. Test the app

**Without these variables, the app won't work!**
