# ✅ Kaalaman Setup Checklist

Use this checklist to set up Kaalaman for zero RAM usage.

---

## 📋 Pre-Deployment Checklist

- [ ] I have Node.js installed (v20.9.0 or higher)
- [ ] I have npm installed
- [ ] I have an OpenAI API key
- [ ] I understand I want to avoid running locally to save RAM

---

## 🚀 Deployment Checklist (Recommended)

### Step 1: Install Vercel CLI
- [ ] Run: `npm install -g vercel`
- [ ] Verify: `vercel --version` works

### Step 2: Deploy
- [ ] Run: `vercel` in project directory
- [ ] Login to Vercel (or create free account)
- [ ] Confirm project settings
- [ ] Wait for deployment to complete
- [ ] Copy the deployment URL (e.g., `https://kaalaman-xyz.vercel.app`)

### Step 3: Configure Environment Variables
- [ ] Go to https://vercel.com/dashboard
- [ ] Click on your project
- [ ] Go to Settings → Environment Variables
- [ ] Add variable: `OPENAI_API_KEY`
- [ ] Paste your OpenAI API key as the value
- [ ] Click Save

### Step 4: Redeploy
- [ ] Run: `vercel --prod`
- [ ] Wait for deployment to complete
- [ ] Test your app at the deployment URL

### Step 5: Update Local Config (Optional)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_API_URL` to your Vercel URL
- [ ] Save the file

### Step 6: Verify
- [ ] Open your Vercel URL in browser
- [ ] Upload a test document
- [ ] Send a test message
- [ ] Verify AI response works
- [ ] Check that you're NOT running `npm run dev`

---

## 🌙 Lite Mode Checklist (Alternative)

If you don't want to deploy:

- [ ] Open `standalone.html` in browser
- [ ] Or open the deployed app
- [ ] Toggle "Lite Mode" ON in the header
- [ ] Upload a test document
- [ ] Try a quick action (Summary, Quiz, etc.)
- [ ] Verify it works without internet (optional)

---

## 💻 Local Development Checklist (Not Recommended for Daily Use)

Only if you're developing:

- [ ] Run: `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your `OPENAI_API_KEY` to `.env.local`
- [ ] Run: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] ⚠️ Remember: This uses 500+ MB RAM!

---

## 🔍 Verification Checklist

After setup, verify everything works:

### Remote Deploy Verification
- [ ] Can access app at Vercel URL
- [ ] Can upload PDF/DOCX files
- [ ] Can send messages and get AI responses
- [ ] Can use quick actions (Summary, Quiz, etc.)
- [ ] Can use voice input (if browser supports it)
- [ ] NOT running `npm run dev` locally
- [ ] RAM usage on local machine is minimal

### Lite Mode Verification
- [ ] Lite Mode toggle works
- [ ] Can upload documents in Lite Mode
- [ ] Summary feature works
- [ ] Quiz feature works
- [ ] Explain feature works
- [ ] Translate feature works
- [ ] Works without internet (optional test)

---

## 🛠️ Troubleshooting Checklist

If something doesn't work:

### API Issues
- [ ] Verified `OPENAI_API_KEY` is set in Vercel dashboard
- [ ] Redeployed after adding environment variable
- [ ] Checked Vercel logs for errors: `vercel logs`
- [ ] Verified API key is valid and has credits

### Deployment Issues
- [ ] Vercel CLI is installed: `vercel --version`
- [ ] Logged into Vercel: `vercel login`
- [ ] Project deployed successfully (no errors)
- [ ] Can access deployment URL

### Configuration Issues
- [ ] `.env.local` exists (if using local config)
- [ ] `NEXT_PUBLIC_API_URL` is set correctly
- [ ] No typos in environment variable names
- [ ] Restarted browser after config changes

### RAM Issues
- [ ] NOT running `npm run dev`
- [ ] Using Vercel URL instead of localhost
- [ ] Closed any local development servers
- [ ] Verified RAM usage is low

---

## 📊 Success Criteria

You've successfully set up Kaalaman when:

- ✅ You can access the app from a URL (not localhost)
- ✅ You can upload documents and get AI responses
- ✅ Your local RAM usage is minimal (< 100 MB)
- ✅ You're NOT running `npm run dev`
- ✅ You can access the app from any device
- ✅ Lite Mode works as a fallback

---

## 🎯 Next Steps After Setup

- [ ] Bookmark your Vercel URL
- [ ] Add Vercel URL to browser favorites
- [ ] Share URL with team/friends (if desired)
- [ ] Test all features thoroughly
- [ ] Read [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for tips
- [ ] Explore Lite Mode for offline use

---

## 📞 Need Help?

If you're stuck on any step:

1. Run the setup checker:
   - Windows: `check-setup.bat`
   - Linux/Mac: `./check-setup.sh`

2. Read the guides:
   - Quick start: [REMOTE-SETUP-QUICKSTART.md](REMOTE-SETUP-QUICKSTART.md)
   - Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
   - Interactive: [START-HERE.html](START-HERE.html)

3. Check common issues:
   - [QUICK-REFERENCE.md](QUICK-REFERENCE.md) → Troubleshooting section

4. Open an issue:
   - https://github.com/Jetsetter123/kaalam/issues

---

## 🎉 Completion

- [ ] I have successfully deployed Kaalaman
- [ ] I am using it with 0 local RAM usage
- [ ] I understand how to use Lite Mode as a fallback
- [ ] I know where to find help if needed

**Congratulations! You're now using Kaalaman efficiently! 🚀**

---

**Remember:** The goal is to never run `npm run dev` for daily use. Deploy once, use everywhere!
