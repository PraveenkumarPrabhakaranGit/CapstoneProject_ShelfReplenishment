#!/usr/bin/env python3
"""
Test script to verify login and registration functionality after CORS fix.
Tests both registration of new users and login with demo credentials.
"""

import requests
import json
import sys
from typing import Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"
REGISTER_ENDPOINT = f"{API_BASE_URL}/api/auth/register"
LOGIN_ENDPOINT = f"{API_BASE_URL}/api/auth/login"
VALIDATE_ENDPOINT = f"{API_BASE_URL}/api/auth/validate"

# Demo credentials (from seed_demo_users.py)
DEMO_CREDENTIALS = [
    {
        "email": "associate@demo.com",
        "password": "demo123",
        "role": "associate"
    },
    {
        "email": "manager@demo.com", 
        "password": "demo456",
        "role": "manager"
    }
]

# Test user for registration (using timestamp to ensure uniqueness)
import time
TEST_USER = {
    "email": f"testuser{int(time.time())}@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "associate",
    "store_id": "TEST001",
    "store_name": "Test Store"
}

def test_api_connection():
    """Test basic API connectivity."""
    print("[INFO] Testing API connectivity...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("[SUCCESS] API is accessible and healthy")
            return True
        else:
            print(f"[ERROR] API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Cannot connect to API: {str(e)}")
        return False

def test_registration(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Test user registration."""
    print(f"[INFO] Testing registration for: {user_data['email']}")
    try:
        response = requests.post(
            REGISTER_ENDPOINT,
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("[SUCCESS] Registration successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Name: {data['user']['name']}")
            print(f"   Role: {data['user']['role']}")
            print(f"   Token received: {'access_token' in data}")
            return {"success": True, "data": data}
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
            print(f"[ERROR] Registration failed: {error_data.get('detail', 'Unknown error')}")
            return {"success": False, "error": error_data}
            
    except Exception as e:
        print(f"[ERROR] Registration error: {str(e)}")
        return {"success": False, "error": str(e)}

def test_login(credentials: Dict[str, Any]) -> Dict[str, Any]:
    """Test user login."""
    print(f"[INFO] Testing login for: {credentials['email']} ({credentials['role']})")
    try:
        response = requests.post(
            LOGIN_ENDPOINT,
            json=credentials,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("[SUCCESS] Login successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Name: {data['user']['name']}")
            print(f"   Role: {data['user']['role']}")
            print(f"   Token received: {'access_token' in data}")
            return {"success": True, "data": data}
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
            print(f"[ERROR] Login failed: {error_data.get('detail', 'Unknown error')}")
            return {"success": False, "error": error_data}
            
    except Exception as e:
        print(f"[ERROR] Login error: {str(e)}")
        return {"success": False, "error": str(e)}

def test_token_validation(token: str) -> Dict[str, Any]:
    """Test token validation."""
    print("[INFO] Testing token validation...")
    try:
        response = requests.get(
            VALIDATE_ENDPOINT,
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("[SUCCESS] Token validation successful!")
            print(f"   User ID: {data['id']}")
            print(f"   Name: {data['name']}")
            print(f"   Role: {data['role']}")
            return {"success": True, "data": data}
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {"detail": response.text}
            print(f"[ERROR] Token validation failed: {error_data.get('detail', 'Unknown error')}")
            return {"success": False, "error": error_data}
            
    except Exception as e:
        print(f"[ERROR] Token validation error: {str(e)}")
        return {"success": False, "error": str(e)}

def main():
    """Main test function."""
    print("ShelfMind Authentication Testing")
    print("=" * 50)
    
    # Test API connectivity
    if not test_api_connection():
        print("\n[ERROR] Cannot proceed - API is not accessible")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("TESTING REGISTRATION")
    print("=" * 50)
    
    # Test registration
    reg_result = test_registration(TEST_USER)
    registration_token = None
    if reg_result["success"]:
        registration_token = reg_result["data"]["access_token"]
    
    print("\n" + "=" * 50)
    print("TESTING LOGIN WITH DEMO CREDENTIALS")
    print("=" * 50)
    
    # Test login with demo credentials
    login_results = []
    for creds in DEMO_CREDENTIALS:
        print()
        login_result = test_login(creds)
        login_results.append(login_result)
        
        # Test token validation if login successful
        if login_result["success"]:
            token = login_result["data"]["access_token"]
            print()
            test_token_validation(token)
    
    # Test token validation for registration token if available
    if registration_token:
        print("\n" + "=" * 50)
        print("TESTING TOKEN FROM REGISTRATION")
        print("=" * 50)
        test_token_validation(registration_token)
    
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    
    # Summary
    reg_success = reg_result["success"]
    login_successes = [r["success"] for r in login_results]
    
    print(f"Registration: {'PASS' if reg_success else 'FAIL'}")
    print(f"Associate Login: {'PASS' if login_successes[0] else 'FAIL'}")
    print(f"Manager Login: {'PASS' if login_successes[1] else 'FAIL'}")
    
    all_passed = reg_success and all(login_successes)
    
    if all_passed:
        print("\n[SUCCESS] ALL TESTS PASSED! Authentication is working correctly.")
        sys.exit(0)
    else:
        print("\n[WARNING] SOME TESTS FAILED. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()