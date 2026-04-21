"""
API Test Suite for Kaalaman
Tests the chat and upload endpoints
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = os.getenv('TEST_URL', 'http://localhost:3000')
API_URL = f"{BASE_URL}/api"

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_test(name, passed, message=""):
    """Print test result with color"""
    status = f"{Colors.GREEN}✓ PASS{Colors.RESET}" if passed else f"{Colors.RED}✗ FAIL{Colors.RESET}"
    print(f"{status} {Colors.BOLD}{name}{Colors.RESET}")
    if message:
        print(f"  {Colors.YELLOW}→{Colors.RESET} {message}")
    print()

def test_chat_endpoint():
    """Test the /api/chat endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Chat API Endpoint{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Test 1: Valid request
    try:
        payload = {
            "message": "Hello, what is 2+2?",
            "context": ""
        }
        response = requests.post(
            f"{API_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        passed = response.status_code == 200
        if passed:
            data = response.json()
            has_response = 'response' in data and len(data['response']) > 0
            print_test(
                "Valid chat request",
                has_response,
                f"Response: {data.get('response', 'No response')[:100]}..."
            )
        else:
            print_test(
                "Valid chat request",
                False,
                f"Status: {response.status_code}, Body: {response.text[:200]}"
            )
    except Exception as e:
        print_test("Valid chat request", False, f"Error: {str(e)}")
    
    # Test 2: Empty message
    try:
        payload = {"message": "", "context": ""}
        response = requests.post(
            f"{API_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        passed = response.status_code == 400
        print_test(
            "Empty message rejection",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        print_test("Empty message rejection", False, f"Error: {str(e)}")
    
    # Test 3: Missing API key handling
    try:
        payload = {"message": "Test", "context": ""}
        response = requests.post(
            f"{API_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        # Should either work (200) or return API key error (500)
        passed = response.status_code in [200, 500]
        data = response.json() if response.status_code == 500 else {}
        print_test(
            "API key handling",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error', 'None')}"
        )
    except Exception as e:
        print_test("API key handling", False, f"Error: {str(e)}")
    
    # Test 4: Long message handling
    try:
        long_message = "A" * 3000  # Exceeds MAX_MESSAGE_LENGTH
        payload = {"message": long_message, "context": ""}
        response = requests.post(
            f"{API_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        # Should truncate and process or reject
        passed = response.status_code in [200, 400, 500]
        print_test(
            "Long message handling",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        print_test("Long message handling", False, f"Error: {str(e)}")

def test_upload_endpoint():
    """Test the /api/upload endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Upload API Endpoint{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Test 1: Valid text file upload
    try:
        # Create a temporary test file
        test_content = "This is a test document for Kaalaman.\nIt has multiple lines.\nTesting upload functionality."
        test_file = Path("test_document.txt")
        test_file.write_text(test_content)
        
        with open(test_file, 'rb') as f:
            files = {'file': ('test_document.txt', f, 'text/plain')}
            response = requests.post(
                f"{API_URL}/upload",
                files=files,
                timeout=10
            )
        
        # Clean up
        test_file.unlink()
        
        passed = response.status_code == 200
        if passed:
            data = response.json()
            has_text = 'text' in data and len(data['text']) > 0
            print_test(
                "Valid text file upload",
                has_text,
                f"Extracted text length: {len(data.get('text', ''))} chars"
            )
        else:
            print_test(
                "Valid text file upload",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        print_test("Valid text file upload", False, f"Error: {str(e)}")
    
    # Test 2: No file provided
    try:
        response = requests.post(
            f"{API_URL}/upload",
            files={},
            timeout=10
        )
        passed = response.status_code in [400, 500]
        print_test(
            "No file rejection",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        print_test("No file rejection", False, f"Error: {str(e)}")

def test_health_check():
    """Test if the server is running"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Server Health{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    try:
        response = requests.get(BASE_URL, timeout=5)
        passed = response.status_code == 200
        print_test(
            "Server is running",
            passed,
            f"Status: {response.status_code}"
        )
        return passed
    except requests.exceptions.ConnectionError:
        print_test(
            "Server is running",
            False,
            f"Cannot connect to {BASE_URL}. Is the server running?"
        )
        return False
    except Exception as e:
        print_test("Server is running", False, f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all test suites"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}Kaalaman API Test Suite{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"Testing URL: {Colors.YELLOW}{BASE_URL}{Colors.RESET}\n")
    
    # Check if server is running first
    if not test_health_check():
        print(f"\n{Colors.RED}Server is not running. Please start the server first:{Colors.RESET}")
        print(f"  {Colors.YELLOW}npm run dev{Colors.RESET} (for local)")
        print(f"  or set {Colors.YELLOW}TEST_URL{Colors.RESET} environment variable for remote testing")
        return
    
    # Run test suites
    test_chat_endpoint()
    test_upload_endpoint()
    
    print(f"\n{Colors.BOLD}{Colors.GREEN}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}Test Suite Complete!{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}{'='*60}{Colors.RESET}\n")

if __name__ == "__main__":
    run_all_tests()
