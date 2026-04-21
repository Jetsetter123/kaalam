# 🧪 Python Test Scripts for Kaalaman

## Quick Start

### 1. Install Python Dependencies

```bash
# Navigate to tests directory
cd tests

# Install required packages
pip install -r requirements.txt
```

Or install globally:
```bash
pip install requests pytest pytest-cov colorama
```

---

## 2. Run Tests

### Test Local Development Server

**Step 1: Start your Next.js server**
```bash
npm run dev
```

**Step 2: Run tests (in another terminal)**
```bash
python tests/test_api.py
```

### Test Production Server

```bash
# Set the URL to test
set TEST_URL=https://kaalaman-eta.vercel.app  # Windows
export TEST_URL=https://kaalaman-eta.vercel.app  # Mac/Linux

# Run tests
python tests/test_api.py
```

---

## 📋 What Gets Tested

### Chat API (`/api/chat`)
- ✅ Valid chat requests
- ✅ Empty message rejection
- ✅ API key handling
- ✅ Long message handling
- ✅ Response format validation

### Upload API (`/api/upload`)
- ✅ Valid text file upload
- ✅ File extraction
- ✅ No file rejection
- ✅ Error handling

### Health Check
- ✅ Server availability
- ✅ Response status

---

## 🎯 Test Output

The tests will show colored output:
- ✅ **Green** = Test passed
- ❌ **Red** = Test failed
- ℹ️ **Yellow** = Additional info

Example:
```
============================================================
Testing Chat API Endpoint
============================================================

✓ PASS Valid chat request
  → Response: The answer is 4...

✓ PASS Empty message rejection
  → Status: 400

✓ PASS API key handling
  → Status: 200
```

---

## 🔧 Advanced Usage

### Run with pytest

```bash
# Run all tests with pytest
pytest tests/test_api.py -v

# Run with coverage report
pytest tests/test_api.py --cov=. --cov-report=html

# Run specific test
pytest tests/test_api.py::test_chat_endpoint -v
```

### Custom Test URL

```bash
# Windows
set TEST_URL=http://localhost:3000
python tests/test_api.py

# Mac/Linux
TEST_URL=http://localhost:3000 python tests/test_api.py
```

---

## 📝 Creating Your Own Tests

### Example: Test a new endpoint

```python
def test_my_endpoint():
    """Test my custom endpoint"""
    response = requests.get(f"{API_URL}/my-endpoint")
    
    assert response.status_code == 200
    data = response.json()
    assert 'result' in data
    
    print_test("My endpoint test", True, "Success!")
```

### Example: Test with authentication

```python
def test_authenticated_request():
    """Test with auth headers"""
    headers = {
        "Authorization": "Bearer YOUR_TOKEN",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{API_URL}/protected",
        json={"data": "test"},
        headers=headers
    )
    
    assert response.status_code == 200
```

---

## 🐛 Troubleshooting

### "Cannot connect to server"
**Solution:** Make sure your Next.js server is running
```bash
npm run dev
```

### "Module not found: requests"
**Solution:** Install dependencies
```bash
pip install -r tests/requirements.txt
```

### "Permission denied"
**Solution:** Use pip with --user flag
```bash
pip install --user -r tests/requirements.txt
```

### Tests fail with 500 errors
**Solution:** Check if `GEMINI_API_KEY` is set in your `.env.local` file

---

## 📊 Test Coverage

Current test coverage:
- **Chat API:** 4 tests
- **Upload API:** 2 tests
- **Health Check:** 1 test
- **Total:** 7 tests

---

## 🚀 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    
    - name: Install dependencies
      run: |
        pip install -r tests/requirements.txt
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install Node dependencies
      run: npm install
    
    - name: Start server
      run: npm run dev &
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    
    - name: Wait for server
      run: sleep 10
    
    - name: Run tests
      run: python tests/test_api.py
```

---

## 📚 Additional Resources

- **Requests Documentation:** https://requests.readthedocs.io/
- **Pytest Documentation:** https://docs.pytest.org/
- **Python Testing Best Practices:** https://realpython.com/python-testing/

---

## 💡 Tips

1. **Run tests before deploying** to catch issues early
2. **Test both local and production** environments
3. **Add new tests** when adding new features
4. **Check test output** for detailed error messages
5. **Use pytest** for more advanced testing needs

---

**Happy Testing! 🧪✨**
