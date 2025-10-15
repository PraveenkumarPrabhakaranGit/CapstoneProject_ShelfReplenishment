"""
Test script for user registration endpoints.
This script tests the registration functionality for both store associates and managers.
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8002"

def test_registration():
    """Test user registration for both roles."""
    
    print("Testing ShelfMind User Registration API")
    print("=" * 50)
    
    # Test data for store associate
    associate_data = {
        "email": "john.doe@shelfmind.com",
        "password": "associate123",
        "name": "John Doe",
        "role": "associate",
        "store_id": "store-001",
        "store_name": "Metro Fresh Market"
    }
    
    # Test data for store manager
    manager_data = {
        "email": "jane.smith@shelfmind.com", 
        "password": "manager456",
        "name": "Jane Smith",
        "role": "manager",
        "store_id": "store-001",
        "store_name": "Metro Fresh Market"
    }
    
    # Test 1: Register Store Associate
    print("\n1. Testing Store Associate Registration")
    print("-" * 40)
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=associate_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            result = response.json()
            print("SUCCESS: Associate registration successful!")
            print(f"   User ID: {result['user']['id']}")
            print(f"   Name: {result['user']['name']}")
            print(f"   Role: {result['user']['role']}")
            print(f"   Store: {result['user']['store_name']}")
            print(f"   Token: {result['access_token'][:20]}...")
        else:
            print(f"FAILED: Associate registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("FAILED: Could not connect to API server. Make sure it's running on port 8001.")
        return
    except Exception as e:
        print(f"FAILED: Error during associate registration: {str(e)}")
    
    # Test 2: Register Store Manager
    print("\n2. Testing Store Manager Registration")
    print("-" * 40)
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=manager_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            result = response.json()
            print("SUCCESS: Manager registration successful!")
            print(f"   User ID: {result['user']['id']}")
            print(f"   Name: {result['user']['name']}")
            print(f"   Role: {result['user']['role']}")
            print(f"   Store: {result['user']['store_name']}")
            print(f"   Token: {result['access_token'][:20]}...")
        else:
            print(f"FAILED: Manager registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"FAILED: Error during manager registration: {str(e)}")
    
    # Test 3: Test duplicate email registration
    print("\n3. Testing Duplicate Email Registration")
    print("-" * 40)
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=associate_data,  # Same email as before
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400:
            print("SUCCESS: Duplicate email properly rejected!")
            print(f"   Error message: {response.json().get('detail', 'No detail')}")
        else:
            print(f"FAILED: Duplicate email should have been rejected but got: {response.status_code}")
            
    except Exception as e:
        print(f"FAILED: Error during duplicate email test: {str(e)}")
    
    # Test 4: Test invalid data
    print("\n4. Testing Invalid Registration Data")
    print("-" * 40)
    
    invalid_data = {
        "email": "invalid-email",  # Invalid email format
        "password": "123",         # Too short password
        "name": "A",              # Too short name
        "role": "invalid",        # Invalid role
        "store_id": "",           # Empty store ID
        "store_name": ""          # Empty store name
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 422:
            print("SUCCESS: Invalid data properly rejected!")
            errors = response.json().get('detail', [])
            for error in errors[:3]:  # Show first 3 errors
                print(f"   - {error.get('msg', 'Validation error')}")
        else:
            print(f"FAILED: Invalid data should have been rejected but got: {response.status_code}")
            
    except Exception as e:
        print(f"FAILED: Error during invalid data test: {str(e)}")
    
    # Test 5: Test available roles endpoint
    print("\n5. Testing Available Roles Endpoint")
    print("-" * 40)
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth/roles")
        
        if response.status_code == 200:
            result = response.json()
            print("SUCCESS: Roles endpoint working!")
            for role in result.get('roles', []):
                print(f"   - {role['label']}: {role['description']}")
        else:
            print(f"FAILED: Roles endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"FAILED: Error during roles test: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Registration API testing completed!")

if __name__ == "__main__":
    test_registration()