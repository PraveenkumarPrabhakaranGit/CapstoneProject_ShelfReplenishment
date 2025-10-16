#!/usr/bin/env python3
"""
End-to-End User Flow Tests

This test suite verifies that the user profile bug fix is working correctly.
The bug was that new users were seeing existing, hardcoded user profiles 
instead of their own profile information.

Test Cases:
1. Store Associate Flow - Register new associate and verify correct profile data
2. Store Manager Flow - Register new manager and verify correct profile data

Both tests ensure that users see their own profile information and NOT
the old hardcoded data (e.g., "Alex Rodriguez", "Maria Chen").
"""

import asyncio
import requests
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
import sys
import os

# Add backend directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from database import UserDocument, connect_to_mongo, close_mongo_connection

# Configuration
API_BASE_URL = "http://localhost:8000"
REGISTER_ENDPOINT = f"{API_BASE_URL}/api/auth/register"
LOGIN_ENDPOINT = f"{API_BASE_URL}/api/auth/login"
VALIDATE_ENDPOINT = f"{API_BASE_URL}/api/auth/validate"

# Old hardcoded data that should NOT appear in new user profiles
HARDCODED_NAMES_TO_AVOID = [
    "Alex Rodriguez",
    "Maria Chen",
    "Alex Johnson",
    "Sarah Williams"
]

class E2ETestRunner:
    """End-to-end test runner for user flow verification."""
    
    def __init__(self):
        self.created_users: List[str] = []  # Track user IDs for cleanup
        self.test_results: List[Dict[str, Any]] = []
        
    async def setup(self):
        """Setup test environment."""
        print("Setting up E2E test environment...")
        try:
            await connect_to_mongo()
            print("[OK] Connected to MongoDB")
        except Exception as e:
            print(f"[ERROR] Failed to connect to MongoDB: {e}")
            raise
    
    async def cleanup(self):
        """Clean up created test users."""
        print(f"\nCleaning up {len(self.created_users)} test users...")
        
        cleanup_count = 0
        for user_id in self.created_users:
            try:
                deleted = await UserDocument.delete_user(user_id)
                if deleted:
                    cleanup_count += 1
                    print(f"[OK] Deleted user: {user_id}")
                else:
                    print(f"[WARN] User not found for deletion: {user_id}")
            except Exception as e:
                print(f"[ERROR] Failed to delete user {user_id}: {e}")
        
        print(f"Cleaned up {cleanup_count}/{len(self.created_users)} users")
        
        try:
            await close_mongo_connection()
            print("[OK] Closed MongoDB connection")
        except Exception as e:
            print(f"[WARN] Error closing MongoDB connection: {e}")
    
    def generate_unique_user_data(self, role: str) -> Dict[str, str]:
        """Generate unique user data for testing."""
        unique_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%H%M%S")
        
        return {
            "email": f"test_{role}_{unique_id}_{timestamp}@e2etest.com",
            "password": f"test{role}123",
            "name": f"Test {role.title()} {unique_id}",
            "role": role,
            "store_id": f"TEST_STORE_{unique_id}",
            "store_name": f"Test Store {unique_id}"
        }
    
    def make_api_request(self, method: str, url: str, data: Optional[Dict] = None, 
                        headers: Optional[Dict] = None, token: Optional[str] = None) -> Dict[str, Any]:
        """Make API request with error handling."""
        try:
            request_headers = {"Content-Type": "application/json"}
            if headers:
                request_headers.update(headers)
            if token:
                request_headers["Authorization"] = f"Bearer {token}"
            
            if method.upper() == "POST":
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method.upper() == "GET":
                response = requests.get(url, headers=request_headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return {
                "success": response.status_code in [200, 201],
                "status_code": response.status_code,
                "data": response.json() if response.content else {},
                "error": None
            }
            
        except requests.exceptions.ConnectionError:
            return {
                "success": False,
                "status_code": 0,
                "data": {},
                "error": "Could not connect to API server. Make sure backend is running on port 8000."
            }
        except requests.exceptions.Timeout:
            return {
                "success": False,
                "status_code": 0,
                "data": {},
                "error": "Request timed out"
            }
        except Exception as e:
            return {
                "success": False,
                "status_code": 0,
                "data": {},
                "error": f"Unexpected error: {str(e)}"
            }
    
    def verify_user_profile(self, user_data: Dict[str, str], profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify that user profile matches expected data and doesn't contain hardcoded values."""
        verification_results = {
            "profile_matches_input": True,
            "no_hardcoded_data": True,
            "errors": []
        }
        
        # Check that profile matches the input data
        expected_fields = ["name", "email", "role", "store_id", "store_name"]
        for field in expected_fields:
            if profile_data.get(field) != user_data.get(field):
                verification_results["profile_matches_input"] = False
                verification_results["errors"].append(
                    f"Field '{field}' mismatch: expected '{user_data.get(field)}', "
                    f"got '{profile_data.get(field)}'"
                )
        
        # Check that profile doesn't contain hardcoded names
        profile_name = profile_data.get("name", "")
        if profile_name in HARDCODED_NAMES_TO_AVOID:
            verification_results["no_hardcoded_data"] = False
            verification_results["errors"].append(
                f"Profile contains hardcoded name '{profile_name}' - this indicates the bug is still present!"
            )
        
        return verification_results
    
    async def test_store_associate_flow(self) -> Dict[str, Any]:
        """Test Case 1: Store Associate Flow"""
        print("\n" + "="*60)
        print("TEST CASE 1: Store Associate Flow")
        print("="*60)
        
        test_result = {
            "test_name": "Store Associate Flow",
            "success": False,
            "steps": [],
            "user_data": None,
            "user_id": None
        }
        
        # Step 1: Generate unique user data
        user_data = self.generate_unique_user_data("associate")
        test_result["user_data"] = user_data
        
        print(f"Generated test user: {user_data['name']} ({user_data['email']})")
        
        # Step 2: Register new store associate
        print("\nStep 1: Registering new Store Associate...")
        register_response = self.make_api_request("POST", REGISTER_ENDPOINT, user_data)
        
        step_result = {
            "step": "registration",
            "success": register_response["success"],
            "details": {}
        }
        
        if not register_response["success"]:
            step_result["error"] = register_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Registration failed: {register_response['error']}")
            return test_result
        
        # Extract user info and token
        registration_data = register_response["data"]
        user_profile = registration_data.get("user", {})
        access_token = registration_data.get("access_token")
        user_id = user_profile.get("id")
        
        if user_id:
            self.created_users.append(user_id)
            test_result["user_id"] = user_id
        
        step_result["details"] = {
            "user_id": user_id,
            "profile": user_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Registration successful")
        print(f"  User ID: {user_id}")
        print(f"  Name: {user_profile.get('name')}")
        print(f"  Role: {user_profile.get('role')}")
        
        # Step 3: Login with the newly created user
        print("\nStep 2: Logging in with new credentials...")
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"],
            "role": user_data["role"]
        }
        
        login_response = self.make_api_request("POST", LOGIN_ENDPOINT, login_data)
        
        step_result = {
            "step": "login",
            "success": login_response["success"],
            "details": {}
        }
        
        if not login_response["success"]:
            step_result["error"] = login_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Login failed: {login_response['error']}")
            return test_result
        
        login_data_response = login_response["data"]
        login_user_profile = login_data_response.get("user", {})
        login_token = login_data_response.get("access_token")
        
        step_result["details"] = {
            "profile": login_user_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Login successful")
        print(f"  Name: {login_user_profile.get('name')}")
        print(f"  Email: {login_user_profile.get('email')}")
        
        # Step 4: Validate token and get current user profile
        print("\nStep 3: Validating token and retrieving profile...")
        validate_response = self.make_api_request("GET", VALIDATE_ENDPOINT, token=login_token)
        
        step_result = {
            "step": "validation",
            "success": validate_response["success"],
            "details": {}
        }
        
        if not validate_response["success"]:
            step_result["error"] = validate_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Token validation failed: {validate_response['error']}")
            return test_result
        
        validated_profile = validate_response["data"]
        step_result["details"] = {
            "profile": validated_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Token validation successful")
        print(f"  Name: {validated_profile.get('name')}")
        print(f"  Email: {validated_profile.get('email')}")
        
        # Step 5: Verify profile data
        print("\nStep 4: Verifying profile data...")
        verification = self.verify_user_profile(user_data, validated_profile)
        
        step_result = {
            "step": "verification",
            "success": verification["profile_matches_input"] and verification["no_hardcoded_data"],
            "details": verification
        }
        test_result["steps"].append(step_result)
        
        if verification["errors"]:
            print("[ERROR] Profile verification failed:")
            for error in verification["errors"]:
                print(f"  - {error}")
        else:
            print("[OK] Profile verification successful")
            print("  - Profile matches input data")
            print("  - No hardcoded data detected")
        
        test_result["success"] = all(step["success"] for step in test_result["steps"])
        
        return test_result
    
    async def test_store_manager_flow(self) -> Dict[str, Any]:
        """Test Case 2: Store Manager Flow"""
        print("\n" + "="*60)
        print("TEST CASE 2: Store Manager Flow")
        print("="*60)
        
        test_result = {
            "test_name": "Store Manager Flow",
            "success": False,
            "steps": [],
            "user_data": None,
            "user_id": None
        }
        
        # Step 1: Generate unique user data
        user_data = self.generate_unique_user_data("manager")
        test_result["user_data"] = user_data
        
        print(f"Generated test user: {user_data['name']} ({user_data['email']})")
        
        # Step 2: Register new store manager
        print("\nStep 1: Registering new Store Manager...")
        register_response = self.make_api_request("POST", REGISTER_ENDPOINT, user_data)
        
        step_result = {
            "step": "registration",
            "success": register_response["success"],
            "details": {}
        }
        
        if not register_response["success"]:
            step_result["error"] = register_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Registration failed: {register_response['error']}")
            return test_result
        
        # Extract user info and token
        registration_data = register_response["data"]
        user_profile = registration_data.get("user", {})
        access_token = registration_data.get("access_token")
        user_id = user_profile.get("id")
        
        if user_id:
            self.created_users.append(user_id)
            test_result["user_id"] = user_id
        
        step_result["details"] = {
            "user_id": user_id,
            "profile": user_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Registration successful")
        print(f"  User ID: {user_id}")
        print(f"  Name: {user_profile.get('name')}")
        print(f"  Role: {user_profile.get('role')}")
        
        # Step 3: Login with the newly created user
        print("\nStep 2: Logging in with new credentials...")
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"],
            "role": user_data["role"]
        }
        
        login_response = self.make_api_request("POST", LOGIN_ENDPOINT, login_data)
        
        step_result = {
            "step": "login",
            "success": login_response["success"],
            "details": {}
        }
        
        if not login_response["success"]:
            step_result["error"] = login_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Login failed: {login_response['error']}")
            return test_result
        
        login_data_response = login_response["data"]
        login_user_profile = login_data_response.get("user", {})
        login_token = login_data_response.get("access_token")
        
        step_result["details"] = {
            "profile": login_user_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Login successful")
        print(f"  Name: {login_user_profile.get('name')}")
        print(f"  Email: {login_user_profile.get('email')}")
        
        # Step 4: Validate token and get current user profile
        print("\nStep 3: Validating token and retrieving profile...")
        validate_response = self.make_api_request("GET", VALIDATE_ENDPOINT, token=login_token)
        
        step_result = {
            "step": "validation",
            "success": validate_response["success"],
            "details": {}
        }
        
        if not validate_response["success"]:
            step_result["error"] = validate_response["error"]
            test_result["steps"].append(step_result)
            print(f"[ERROR] Token validation failed: {validate_response['error']}")
            return test_result
        
        validated_profile = validate_response["data"]
        step_result["details"] = {
            "profile": validated_profile
        }
        test_result["steps"].append(step_result)
        
        print(f"[OK] Token validation successful")
        print(f"  Name: {validated_profile.get('name')}")
        print(f"  Email: {validated_profile.get('email')}")
        
        # Step 5: Verify profile data
        print("\nStep 4: Verifying profile data...")
        verification = self.verify_user_profile(user_data, validated_profile)
        
        step_result = {
            "step": "verification",
            "success": verification["profile_matches_input"] and verification["no_hardcoded_data"],
            "details": verification
        }
        test_result["steps"].append(step_result)
        
        if verification["errors"]:
            print("[ERROR] Profile verification failed:")
            for error in verification["errors"]:
                print(f"  - {error}")
        else:
            print("[OK] Profile verification successful")
            print("  - Profile matches input data")
            print("  - No hardcoded data detected")
        
        test_result["success"] = all(step["success"] for step in test_result["steps"])
        
        return test_result
    
    def print_summary(self, results: List[Dict[str, Any]]):
        """Print test summary."""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        
        total_tests = len(results)
        passed_tests = sum(1 for result in results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print()
        
        for result in results:
            status = "[OK] PASS" if result["success"] else "[ERROR] FAIL"
            print(f"{status}: {result['test_name']}")
            
            if not result["success"]:
                print("  Failed steps:")
                for step in result["steps"]:
                    if not step["success"]:
                        error = step.get("error", "Unknown error")
                        print(f"    - {step['step']}: {error}")
        
        print()
        if failed_tests == 0:
            print("[SUCCESS] ALL TESTS PASSED! The user profile bug fix is working correctly.")
        else:
            print("[WARN]️  SOME TESTS FAILED! The user profile bug may still be present.")
        
        return failed_tests == 0
    
    async def run_all_tests(self) -> bool:
        """Run all end-to-end tests."""
        print("ShelfMind E2E User Flow Tests")
        print("="*60)
        print("Testing user profile bug fix to ensure new users see their own")
        print("profile data and NOT hardcoded values like 'Alex Rodriguez' or 'Maria Chen'")
        print()
        
        try:
            await self.setup()
            
            # Run test cases
            associate_result = await self.test_store_associate_flow()
            manager_result = await self.test_store_manager_flow()
            
            self.test_results = [associate_result, manager_result]
            
            # Print summary
            all_passed = self.print_summary(self.test_results)
            
            return all_passed
            
        except Exception as e:
            print(f"[ERROR] Test execution failed: {e}")
            return False
        finally:
            await self.cleanup()

async def main():
    """Main function to run E2E tests."""
    runner = E2ETestRunner()
    success = await runner.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())