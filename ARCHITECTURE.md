# Kaalaman Architecture: Local vs Remote

## Before (Local Only - High RAM Usage)

```
┌─────────────────────────────────────────┐
│         Your Computer (500+ MB RAM)     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Browser (React App)           │   │
│  │   - UI                          │   │
│  │   - Chat Interface              │   │
│  │   - File Upload                 │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│             ▼                           │
│  ┌─────────────────────────────────┐   │
│  │   Next.js Server (HIGH RAM!)    │   │
│  │   - API Routes                  │   │
│  │   - File Processing             │   │
│  │   - PDF/DOCX Parsing            │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
└─────────────┼───────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │   OpenAI API        │
    │   (Cloud)           │
    └─────────────────────┘
```

**Problem:** Next.js server runs on your machine, consuming 500+ MB RAM

---

## After (Remote Deploy - Zero RAM Usage)

```
┌─────────────────────────────────────────┐
│         Your Computer (0 MB RAM!)       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Browser (Static HTML/JS)      │   │
│  │   - UI                          │   │
│  │   - Chat Interface              │   │
│  │   - File Upload                 │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
└─────────────┼───────────────────────────┘
              │ HTTPS
              ▼
    ┌─────────────────────────────────┐
    │   Vercel (Cloud - FREE)         │
    │                                 │
    │  ┌──────────────────────────┐   │
    │  │  Next.js Server          │   │
    │  │  - API Routes            │   │
    │  │  - File Processing       │   │
    │  │  - PDF/DOCX Parsing      │   │
    │  └──────────┬───────────────┘   │
    │             │                   │
    └─────────────┼───────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │   OpenAI API        │
        │   (Cloud)           │
        └─────────────────────┘
```

**Solution:** Next.js server runs on Vercel's cloud, your computer only runs the browser

---

## Lite Mode (Offline - Minimal RAM)

```
┌─────────────────────────────────────────┐
│         Your Computer (~50 MB RAM)      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Browser (Static HTML/JS)      │   │
│  │   - UI                          │   │
│  │   - Chat Interface              │   │
│  │   - File Upload                 │   │
│  │   - Local Processing            │   │
│  │     • Text Summarization        │   │
│  │     • Quiz Generation           │   │
│  │     • Basic Explanations        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

No server needed!
No API calls!
Works offline!
```

**Benefit:** Everything runs in your browser, no server or API needed

---

## Data Flow Comparison

### Remote Deploy (Recommended)

```
User Action
    ↓
Browser (Your Computer)
    ↓ [Upload File]
Vercel Server (Cloud)
    ↓ [Parse PDF/DOCX]
    ↓ [Extract Text]
    ↓ [Send to OpenAI]
OpenAI API (Cloud)
    ↓ [Generate Response]
Vercel Server (Cloud)
    ↓ [Return Response]
Browser (Your Computer)
    ↓
Display Result
```

**Your RAM Usage:** ~50 MB (browser only)

---

### Lite Mode

```
User Action
    ↓
Browser (Your Computer)
    ↓ [Upload File]
    ↓ [Parse Text in Browser]
    ↓ [Extract Keywords]
    ↓ [Generate Summary/Quiz]
    ↓
Display Result
```

**Your RAM Usage:** ~50 MB (browser only)  
**No Network Required!**

---

### Local Development (Not Recommended for Daily Use)

```
User Action
    ↓
Browser (Your Computer)
    ↓ [Upload File]
Next.js Server (Your Computer) ← HIGH RAM!
    ↓ [Parse PDF/DOCX]
    ↓ [Extract Text]
    ↓ [Send to OpenAI]
OpenAI API (Cloud)
    ↓ [Generate Response]
Next.js Server (Your Computer) ← HIGH RAM!
    ↓ [Return Response]
Browser (Your Computer)
    ↓
Display Result
```

**Your RAM Usage:** 500+ MB (browser + server)

---

## Configuration Comparison

### Remote Deploy
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://kaalaman.vercel.app

# Vercel Dashboard
OPENAI_API_KEY=sk-...
```

### Lite Mode
```bash
# No configuration needed!
# Just toggle "Lite Mode" in the app
```

### Local Development
```bash
# .env.local
OPENAI_API_KEY=sk-...
```

---

## Cost Comparison

| Method | Hosting Cost | OpenAI Cost | Your RAM Cost |
|--------|--------------|-------------|---------------|
| Remote Deploy | $0 (Vercel free tier) | Pay per use | $0 (0 MB) |
| Lite Mode | $0 (no hosting) | $0 (no API) | $0 (~50 MB) |
| Local Dev | $0 (self-hosted) | Pay per use | 💰 (500+ MB) |

---

## When to Use Each Method

### Use Remote Deploy When:
- ✅ You want to save RAM
- ✅ You need full AI features
- ✅ You have internet connection
- ✅ You want to access from multiple devices

### Use Lite Mode When:
- ✅ You're offline
- ✅ You need basic features only
- ✅ You want zero configuration
- ✅ You're doing quick tasks

### Use Local Dev When:
- ✅ You're developing the app
- ✅ You're testing changes
- ✅ You're debugging issues
- ❌ NOT for daily use!

---

## Migration Path

```
Current State: Running locally (500+ MB RAM)
         ↓
Step 1: Deploy to Vercel (5 minutes)
         ↓
Step 2: Update .env.local with Vercel URL
         ↓
Step 3: Stop running npm run dev
         ↓
New State: Using remote API (0 MB RAM!)
```

---

## Security Notes

### Remote Deploy
- ✅ API key stored securely in Vercel
- ✅ HTTPS encryption
- ✅ No secrets in browser

### Lite Mode
- ✅ No API calls
- ✅ All processing in browser
- ✅ No data sent to servers

### Local Dev
- ⚠️ API key in .env.local
- ⚠️ Keep .env.local out of git
- ⚠️ Don't share .env.local

---

## Performance Comparison

| Metric | Remote Deploy | Lite Mode | Local Dev |
|--------|---------------|-----------|-----------|
| **Response Time** | ~2-3s | <1s | ~2-3s |
| **RAM Usage** | 0 MB | 50 MB | 500+ MB |
| **CPU Usage** | 0% | 5% | 20%+ |
| **Network** | Required | Optional | Required |
| **AI Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

**Recommendation:** Deploy to Vercel once, use everywhere! 🚀
