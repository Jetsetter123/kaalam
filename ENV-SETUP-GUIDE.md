# Environment Variables Setup Guide

## Required Environment Variables

You need to set these environment variables in **Vercel Dashboard** for production:

### 1. OpenAI API Key (REQUIRED)

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**How to get it:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add it to Vercel

### 2. NextAuth Secret (REQUIRED)

```
NEXTAUTH_SECRET=your-random-secret-key
```

**How to generate:**
```bash
openssl rand -base64 32
```

Or use any random string (at least 32 characters)

### 3. NextAuth URL (REQUIRED)

```
NEXTAUTH_URL=https://kaalaman-eta.vercel.app
```

Replace with your actual Vercel URL

### 4. GitHub OAuth (REQUIRED for GitHub login)

```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

**How to get it:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: Kaalaman
   - Homepage URL: https://kaalaman-eta.vercel.app
   - Authorization callback URL: https://kaalaman-eta.vercel.app/api/auth/callback/github
4. Click "Register application"
5. Copy Client ID and generate Client Secret

### 5. Google OAuth (REQUIRED for Google login)

```
GOOGLE_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_SECRET=your_google_client_secret
```

**How to get it:**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - https://kaalaman-eta.vercel.app/api/auth/callback/google
7. Copy Client ID and Client Secret

---

## Adding to Vercel

1. Go to https://vercel.com/dashboard
2. Select your **kaalaman** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Click "Add New"
   - Enter Key (e.g., `OPENAI_API_KEY`)
   - Enter Value (your actual key)
   - Select all environments (Production, Preview, Development)
   - Click "Save"

5. After adding all variables, redeploy:
   ```bash
   vercel --prod
   ```

---

## Verification Checklist

- [ ] OPENAI_API_KEY is set in Vercel
- [ ] NEXTAUTH_SECRET is set in Vercel
- [ ] NEXTAUTH_URL is set to your Vercel URL
- [ ] GITHUB_ID and GITHUB_SECRET are set
- [ ] GOOGLE_ID and GOOGLE_SECRET are set
- [ ] GitHub OAuth callback URL matches your Vercel URL
- [ ] Google OAuth callback URL matches your Vercel URL
- [ ] Redeployed after adding variables

---

## Testing

1. **Test OpenAI:**
   - Send a message in the chat
   - Should get a response (not "API key not configured")

2. **Test GitHub Login:**
   - Click "Sign In / Sign Up"
   - Click "Continue with GitHub"
   - Should redirect to GitHub and back

3. **Test Google Login:**
   - Click "Sign In / Sign Up"
   - Click "Continue with Google"
   - Should redirect to Google and back

---

## Troubleshooting

### "OpenAI API key not configured"
- Make sure OPENAI_API_KEY is set in Vercel
- Redeploy after adding: `vercel --prod`

### "Server error" on login
- Check NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your Vercel URL
- Check OAuth callback URLs match exactly

### GitHub login fails
- Verify GITHUB_ID and GITHUB_SECRET
- Check callback URL: https://your-app.vercel.app/api/auth/callback/github

### Google login fails
- Verify GOOGLE_ID and GOOGLE_SECRET
- Check callback URL: https://your-app.vercel.app/api/auth/callback/google
- Make sure OAuth consent screen is configured

---

## Quick Setup Commands

```bash
# 1. Set environment variables in Vercel dashboard
# 2. Then redeploy:
vercel --prod

# 3. Check deployment logs:
vercel logs

# 4. Test the app:
# Open https://kaalaman-eta.vercel.app
```
