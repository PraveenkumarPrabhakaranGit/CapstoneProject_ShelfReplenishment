import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
import logging

load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "shelfmind")

# Global variables for database connection
client: Optional[AsyncIOMotorClient] = None
database = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database = None

# MongoDB connection functions
async def connect_to_mongo():
    """Create database connection"""
    global client, database
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        database = client[MONGO_DB_NAME]
        
        # Test the connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes for better performance
        await create_indexes()
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        logger.info("Disconnected from MongoDB")

async def get_database():
    """Get database instance"""
    return database

async def create_indexes():
    """Create database indexes for better performance"""
    if database is not None:
        try:
            # Create index on users collection
            await database.users.create_index("email", unique=True)
            await database.users.create_index("id", unique=True, sparse=True)
            await database.users.create_index([("store_id", 1), ("role", 1)])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")
            # Try to create indexes without unique constraint if there are conflicts
            try:
                await database.users.create_index("email")
                await database.users.create_index("id")
                await database.users.create_index([("store_id", 1), ("role", 1)])
                logger.info("Database indexes created without unique constraints")
            except Exception as e2:
                logger.error(f"Failed to create indexes: {e2}")

# User document operations
class UserDocument:
    @staticmethod
    async def create_user(user_data: dict) -> dict:
        """Create a new user document"""
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = datetime.utcnow()
        user_data["is_active"] = True
        
        result = await database.users.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return user_data
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """Get user by email"""
        return await database.users.find_one({"email": email})
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID"""
        return await database.users.find_one({"id": user_id})
    
    @staticmethod
    async def update_user(user_id: str, update_data: dict) -> bool:
        """Update user document"""
        update_data["updated_at"] = datetime.utcnow()
        result = await database.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete user document"""
        result = await database.users.delete_one({"id": user_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def get_users_by_store(store_id: str) -> list:
        """Get all users for a specific store"""
        cursor = database.users.find({"store_id": store_id})
        return await cursor.to_list(length=None)

# Database dependency for FastAPI
async def get_db():
    """Dependency to get database instance"""
    return database

# Initialize database
async def init_db():
    """Initialize database connection"""
    await connect_to_mongo()
    logger.info("Database initialized successfully")

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())