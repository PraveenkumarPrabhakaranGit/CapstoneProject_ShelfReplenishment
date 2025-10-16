#!/usr/bin/env python3
"""
Script to fix the user password for eeepraveenkumar@gmail.com
"""

import asyncio
from database import connect_to_mongo, database
from auth import get_password_hash

async def fix_user_password():
    """Fix the user password to use the current system's hashing"""
    try:
        await connect_to_mongo()
        print("Connected to database")
        
        # Get database instance
        from database import get_database
        db = await get_database()
        
        email = "eeepraveenkumar@gmail.com"
        new_password = "Praveen@90"
        
        # Get the user
        user = await db.users.find_one({"email": email})
        if not user:
            print(f"User {email} not found")
            return
        
        print(f"Found user: {user.get('name', 'unknown')}")
        print(f"Current fields: {list(user.keys())}")
        
        # Hash the password using the current system
        new_hashed_password = get_password_hash(new_password)
        print(f"New hashed password: {new_hashed_password}")
        
        # Generate user ID if missing
        user_id = user.get('id')
        if not user_id:
            user_id = f"manager-{user.get('name', 'user').replace(' ', '').lower()}"
            print(f"Generated user ID: {user_id}")
        
        # Update the user document to use the current system's field name and hashing
        update_result = await db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "id": user_id,  # Add missing id field
                    "hashed_password": new_hashed_password,  # Use current system field name
                    "is_active": True,  # Add missing is_active field
                    "updated_at": "2025-10-16T08:59:00.000Z"
                },
                "$unset": {
                    "password_hash": ""  # Remove old field name
                }
            }
        )
        
        if update_result.modified_count > 0:
            print(f"Successfully updated password for {email}")
            
            # Verify the update
            updated_user = await db.users.find_one({"email": email})
            print(f"Updated user fields: {list(updated_user.keys())}")
            print(f"Has hashed_password field: {'hashed_password' in updated_user}")
        else:
            print(f"Failed to update password for {email}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(fix_user_password())