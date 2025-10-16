#!/usr/bin/env python3
"""
Database seeding script for demo users.
Creates demo credentials for store associate and store manager roles.
"""

import requests
import json
import sys
from typing import Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"
REGISTER_ENDPOINT = f"{API_BASE_URL}/api/auth/register"

# Demo user data
DEMO_USERS = [
    {
        "email": "associate@demo.com",
        "password": "demo123",
        "name": "Alex Johnson",
        "role": "associate",
        "store_id": "STORE001",
        "store_name": "Downtown ShelfMind Store"
    },
    {
        "email": "manager@demo.com", 
        "password": "demo456",
        "name": "Sarah Williams",
        "role": "manager",
        "store_id": "STORE001",
        "store_name": "Downtown ShelfMind Store"
    }
]

def register_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Register a single user via the API endpoint."""
    try:
        response = requests.post(
            REGISTER_ENDPOINT,
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 201:
            return {
                "success": True,
                "data": response.json(),
                "user": user_data
            }
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}",
                "user": user_data
            }
            
    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "Could not connect to API server. Make sure the backend is running on port 8002.",
            "user": user_data
        }
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Request timed out",
            "user": user_data
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "user": user_data
        }

def main():
    """Main function to seed demo users."""
    print("ShelfMind Demo User Seeding Script")
    print("=" * 50)
    print(f"API Endpoint: {REGISTER_ENDPOINT}")
    print()
    
    results = []
    successful_users = []
    failed_users = []
    
    for user_data in DEMO_USERS:
        print(f"Creating {user_data['role']} user: {user_data['name']} ({user_data['email']})")
        
        result = register_user(user_data)
        results.append(result)
        
        if result["success"]:
            print(f"[SUCCESS] Successfully created {user_data['role']} user")
            successful_users.append(user_data)
        else:
            print(f"[ERROR] Failed to create {user_data['role']} user: {result['error']}")
            failed_users.append(user_data)
        
        print()
    
    # Summary
    print("=" * 50)
    print("SEEDING SUMMARY")
    print("=" * 50)
    print(f"Total users attempted: {len(DEMO_USERS)}")
    print(f"Successfully created: {len(successful_users)}")
    print(f"Failed: {len(failed_users)}")
    print()
    
    if successful_users:
        print("DEMO CREDENTIALS (Successfully Created):")
        print("-" * 40)
        for user in successful_users:
            print(f"Role: {user['role'].title()}")
            print(f"Email: {user['email']}")
            print(f"Password: {user['password']}")
            print(f"Name: {user['name']}")
            print(f"Store: {user['store_name']} ({user['store_id']})")
            print()
    
    if failed_users:
        print("FAILED TO CREATE:")
        print("-" * 40)
        for user in failed_users:
            print(f"Role: {user['role'].title()}")
            print(f"Email: {user['email']}")
            print()
    
    # Exit with appropriate code
    if failed_users:
        print("WARNING: Some users failed to be created. Check the errors above.")
        sys.exit(1)
    else:
        print("SUCCESS: All demo users created successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()