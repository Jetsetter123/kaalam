# 🧪 Python Testing Guide for Kaalaman

## Quick Start (Windows)

### Option 1: Double-Click Method (Easiest)

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Double-click:** `run-tests.bat`

That's it! The script will:
- Check if Python is installed
- Install dependencies if needed
- Run all tests
- Show colored results

---

### Option 2: Command Line Method

```bash
# 1. Install dependencies (first time only)
pip install requests colorama

# 2. Start your server
npm run dev

# 3. Run tests (in another terminal)
python tests/test_api.py
```

---

## Test Production Server

```bash
# Set the URL to your production server
set TEST_URL=https://kaalaman-eta.vercel.app

# Run tests
python tests/test_api.py
```

---

## 📋 What Gets Tested

### ✅ Chat API Tests
1. **Valid Request** - Sends "Hello, what is 2+2?" and checks response
2. **Empty Message** - Verifies empty messages are rejected
3. **API Key Handling** - Tests API key validation
4. **Long Messages** - Tests message length limits

### ✅ Upload API Tests
1. **File Upload** - Uploads a test text file
2. **No File** - Verifies rejection when no file provided

### ✅ Health Check
1. **Server Running** - Checks if server is accessible

---

## 🎨 Test Output Example

```
============================================================
Kaalaman API Test Suite
============================================================
Testing URL: http://localhost:3000

============================================================
Testing Server Health
============================================================

✓ PASS Server is running
  → Status: 200

============================================================
Testing Chat API Endpoint
============================================================

✓ PASS Valid chat request
  → Response: The answer is 4. 2 + 2 equals 4...

✓ PASS Empty message rejection
  → Status: 400

✓ PASS API key handling
  → Status: 200

✓ PASS Long message handling
  → Status: 200

============================================================
Testing Upload API Endpoint
============================================================

✓ PASS Valid text file upload
  → Extracted text length: 89 chars

✓ PASS No file rejection
  → Status: 400

============================================================
Test Suite Complete!
============================================================
```

---

## 🔧 Installation

### Install Python (if not installed)

**Windows:**
1. Download from: https://www.python.org/downloads/
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click "Install Now"

**Verify installation:**
```bash
python --version
```

### Install Test Dependencies

```bash
# Option 1: From requirements file
pip install -r tests/requirements.txt

# Option 2: Manual install
pip install requests colorama pytest
```

---

## 📁 Project Structure

```
kaalaman/
├── tests/
│   ├── test_api.py          # Main test file
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Detailed test docs
├── run-tests.bat           # Windows test runner
├── run-tests.sh            # Mac/Linux test runner
└── TESTING-GUIDE.md        # This file
```

---

## 🚀 Advanced Usage

### Run Specific Tests

```python
# Edit test_api.py and comment out tests you don't want:

if __name__ == "__main__":
    # test_health_check()      # Skip health check
    test_chat_endpoint()        # Only run chat tests
    # test_upload_endpoint()    # Skip upload tests
```

### Add Custom Tests

```python
def test_my_feature():
    """Test my custom feature"""
    response = requests.post(
        f"{API_URL}/my-endpoint",
        json={"data": "test"}
    )
    
    passed = response.status_code == 200
    print_test("My feature test", passed, f"Status: {response.status_code}")
```

### Test with Different URLs

```bash
# Test local
set TEST_URL=http://localhost:3000
python tests/test_api.py

# Test staging
set TEST_URL=https://staging.example.com
python tests/test_api.py

# Test production
set TEST_URL=https://kaalaman-eta.vercel.app
python tests/test_api.py
```

---

## 🐛 Troubleshooting

### "Python is not recognized"
**Solution:** Install Python and add to PATH
- Download: https://www.python.org/downloads/
- During install: ✅ Check "Add Python to PATH"

### "Module 'requests' not found"
**Solution:** Install dependencies
```bash
pip install requests
```

### "Cannot connect to server"
**Solution:** Start your Next.js server
```bash
npm run dev
```

### "Tests fail with 500 errors"
**Solution:** Check your `.env.local` file has `GEMINI_API_KEY`

### "Permission denied" (Mac/Linux)
**Solution:** Make script executable
```bash
chmod +x run-tests.sh
./run-tests.sh
```

---

## 💡 Best Practices

### 1. Test Before Deploying
```bash
# Run tests locally
npm run dev
python tests/test_api.py

# If all pass, deploy
vercel --prod
```

### 2. Test After Deploying
```bash
# Test production
set TEST_URL=https://kaalaman-eta.vercel.app
python tests/test_api.py
```

### 3. Add Tests for New Features
When you add a new API endpoint, add a test:
```python
def test_new_endpoint():
    response = requests.get(f"{API_URL}/new-endpoint")
    print_test("New endpoint", response.status_code == 200)
```

### 4. Run Tests Regularly
- Before committing code
- After pulling changes
- Before deploying
- After deploying

---

## 📊 Test Coverage

| Component | Tests | Status |
|-----------|-------|--------|
| Chat API | 4 | ✅ |
| Upload API | 2 | ✅ |
| Health Check | 1 | ✅ |
| **Total** | **7** | **✅** |

---

## 🎯 Quick Commands Reference

```bash
# Install dependencies
pip install -r tests/requirements.txt

# Run tests (local)
python tests/test_api.py

# Run tests (production)
set TEST_URL=https://kaalaman-eta.vercel.app
python tests/test_api.py

# Run with pytest
pytest tests/test_api.py -v

# Run with coverage
pytest tests/test_api.py --cov

# Use the batch file (Windows)
run-tests.bat

# Use the shell script (Mac/Linux)
./run-tests.sh
```

---

## 📚 Files Created

1. **`tests/test_api.py`** - Main test script with all tests
2. **`tests/requirements.txt`** - Python dependencies
3. **`tests/README.md`** - Detailed testing documentation
4. **`run-tests.bat`** - Windows quick runner
5. **`run-tests.sh`** - Mac/Linux quick runner
6. **`TESTING-GUIDE.md`** - This guide

---

## 🎓 Learn More

- **Python Requests:** https://requests.readthedocs.io/
- **API Testing:** https://realpython.com/api-integration-in-python/
- **Pytest:** https://docs.pytest.org/

---

## ✅ Checklist

Before running tests:
- [ ] Python installed
- [ ] Dependencies installed (`pip install -r tests/requirements.txt`)
- [ ] Server running (`npm run dev`)
- [ ] Environment variables set (`.env.local`)

To run tests:
- [ ] Open terminal
- [ ] Run `python tests/test_api.py`
- [ ] Check results

---

**Happy Testing! 🧪✨**

Your API tests are ready to run!
