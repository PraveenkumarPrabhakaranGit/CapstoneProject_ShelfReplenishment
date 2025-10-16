#!/usr/bin/env python3
"""
Debug script to test user registration and database connectivity.
"""

import asyncio
import sys
import os
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import connect_to_mongo, close_mongo_connection, UserDocument, database
from auth import get_password_hash, get_user_by_email
from models.user import RegisterRequest

async def debug_registration():
    """Debug user registration functionality."""
    
    print("=" * 60)
    print("ShelfMind Registration Debug Tool")
    print("=" * 60)
    
    try:
        # Connect to database
        print("\n1. Testing Database Connection...")
        await connect_to_mongo()
        print("[OK] Database connection successful!")
        
        # Check existing users
        print("\n2. Checking Existing Users...")
        try:
            users_collection = database.users
            user_count = await users_collection.count_documents({})
            print(f"[INFO] Total users in database: {user_count}")
            
            if user_count > 0:
                print("\n[INFO] Existing users:")
                async for user in users_collection.find({}, {"email": 1, "name": 1, "role": 1, "store_id": 1}):
                    print(f"   - {user.get('email', 'N/A')} ({user.get('role', 'N/A')}) - {user.get('name', 'N/A')}")
            
        except Exception as e:
            print(f"[ERROR] Error checking users: {e}")
        
        # Test user creation for associate
        print("\n3. Testing Associate Registration...")
        associate_data = {
            "email": "debug.associate@shelfmind.com",
            "password": "associate123",
            "name": "Debug Associate",
            "role": "associate",
            "store_id": "debug-store-001",
            "store_name": "Debug Store"
        }
        
        # Check if user already exists
        existing_user = await get_user_by_email(associate_data["email"])
        if existing_user:
            print(f"[WARN] User already exists: {existing_user.get('id', 'unknown')}")
            # Delete existing user for clean test
            await UserDocument.delete_user(existing_user["id"])
            print("[INFO] Deleted existing user for clean test")
        
        # Create user document
        user_doc = {
            "id": f"debug-{associate_data['role']}-001",
            "email": associate_data["email"],
            "name": associate_data["name"],
            "hashed_password": get_password_hash(associate_data["password"]),
            "role": associate_data["role"],
            "store_id": associate_data["store_id"],
            "store_name": associate_data["store_name"],
            "is_active": True
        }
        
        try:
            created_user = await UserDocument.create_user(user_doc)
            print(f"[OK] Associate created successfully: {created_user.get('id', 'unknown')}")
        except Exception as e:
            print(f"[ERROR] Failed to create associate: {str(e)}")
            print(f"   Error type: {type(e).__name__}")
        
        # Test user creation for manager
        print("\n4. Testing Manager Registration...")
        manager_data = {
            "email": "debug.manager@shelfmind.com",
            "password": "manager456",
            "name": "Debug Manager",
            "role": "manager",
            "store_id": "debug-store-001",
            "store_name": "Debug Store"
        }
        
        # Check if user already exists
        existing_user = await get_user_by_email(manager_data["email"])
        if existing_user:
            print(f"[WARN] User already exists: {existing_user.get('id', 'unknown')}")
            # Delete existing user for clean test
            await UserDocument.delete_user(existing_user["id"])
            print("[INFO] Deleted existing user for clean test")
        
        # Create user document
        user_doc = {
            "id": f"debug-{manager_data['role']}-001",
            "email": manager_data["email"],
            "name": manager_data["name"],
            "hashed_password": get_password_hash(manager_data["password"]),
            "role": manager_data["role"],
            "store_id": manager_data["store_id"],
            "store_name": manager_data["store_name"],
            "is_active": True
        }
        
        try:
            created_user = await UserDocument.create_user(user_doc)
            print(f"[OK] Manager created successfully: {created_user.get('id', 'unknown')}")
        except Exception as e:
            print(f"[ERROR] Failed to create manager: {str(e)}")
            print(f"   Error type: {type(e).__name__}")
        
        # Test database indexes
        print("\n5. Testing Database Indexes...")
        try:
            indexes = await database.users.list_indexes().to_list(length=None)
            print(f"[INFO] Database indexes:")
            for idx in indexes:
                print(f"   - {idx.get('name', 'unnamed')}: {idx.get('key', {})}")
        except Exception as e:
            print(f"[ERROR] Error checking indexes: {e}")
        
        # Final user count
        print("\n6. Final User Count...")
        try:
            final_count = await users_collection.count_documents({})
            print(f"[INFO] Final user count: {final_count}")
        except Exception as e:
            print(f"[ERROR] Error getting final count: {e}")
        
    except Exception as e:
        print(f"[ERROR] Critical error: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close database connection
        await close_mongo_connection()
        print("\n[INFO] Database connection closed")
    
    print("\n" + "=" * 60)
    print("Debug completed!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(debug_registration())