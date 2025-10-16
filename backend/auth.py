from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import hashlib
import os
from dotenv import load_dotenv

from database import get_db, UserDocument
from models.user import TokenData

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRES_IN", 86400)) // 60  # Convert seconds to minutes

# Password hashing using hashlib (simpler approach)
def _hash_password_simple(password: str, salt: str = "shelfmind_salt") -> str:
    """Simple password hashing using SHA-256"""
    return hashlib.sha256((password + salt).encode()).hexdigest()

# HTTP Bearer token scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    # Check if it's an Argon2 hash (starts with $argon2)
    if hashed_password.startswith('$argon2'):
        try:
            from argon2 import PasswordHasher
            ph = PasswordHasher()
            ph.verify(hashed_password, plain_password)
            return True
        except Exception as e:
            print(f"[DEBUG] Argon2 verification failed: {e}")
            return False
    else:
        # Use simple SHA-256 verification for current system
        return _hash_password_simple(plain_password) == hashed_password

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return _hash_password_simple(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(email=email, user_id=user_id)
        return token_data
    except JWTError:
        raise credentials_exception

async def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from database."""
    return await UserDocument.get_user_by_email(email)

async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID from database."""
    return await UserDocument.get_user_by_id(user_id)

async def authenticate_user(email: str, password: str, role: str) -> Optional[dict]:
    """Authenticate user with email, password, and role."""
    print(f"[DEBUG] Authentication attempt for email: {email}, role: {role}")
    
    user = await get_user_by_email(email)
    if not user:
        print(f"[DEBUG] No user found with email: {email}")
        return None
    
    print(f"[DEBUG] Found user: {user.get('id', 'unknown')} - {user.get('name', 'unknown')}")
    print(f"[DEBUG] User document fields: {list(user.keys())}")
    # Safely print user content without accessing potentially missing fields
    safe_user = {k: v for k, v in user.items() if k != '_id'}  # Exclude MongoDB ObjectId for cleaner output
    print(f"[DEBUG] User document content: {safe_user}")
    
    # Check for password field (support both hashed_password and password_hash)
    password_hash = None
    if "hashed_password" in user:
        password_hash = user["hashed_password"]
        print(f"[DEBUG] Using 'hashed_password' field")
    elif "password_hash" in user:
        password_hash = user["password_hash"]
        print(f"[DEBUG] Using 'password_hash' field (legacy)")
    else:
        print(f"[ERROR] User {user.get('email', 'unknown')} is missing password field!")
        print(f"[ERROR] Available fields: {list(user.keys())}")
        # Check for alternative password field names
        password_fields = [k for k in user.keys() if 'password' in k.lower()]
        if password_fields:
            print(f"[DEBUG] Found password-related fields: {password_fields}")
        return None
    
    if not verify_password(password, password_hash):
        print(f"[DEBUG] Password verification failed for user: {user.get('id', 'unknown')}")
        return None
    if user["role"] != role:
        print(f"[DEBUG] Role mismatch - expected: {role}, actual: {user['role']}")
        return None
    if not user.get("is_active", True):
        print(f"[DEBUG] User is inactive: {user.get('id', 'unknown')}")
        return None
    
    print(f"[DEBUG] Authentication successful for user: {user.get('id', 'unknown')}")
    return user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
) -> dict:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    token_data = verify_token(token, credentials_exception)
    user = await get_user_by_id(token_data.user_id)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Get current active user."""
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_role(required_role: str):
    """Decorator to require specific role."""
    async def role_checker(current_user: dict = Depends(get_current_active_user)) -> dict:
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {required_role}"
            )
        return current_user
    return role_checker

# Role-specific dependencies
async def get_current_manager(current_user: dict = Depends(require_role("manager"))) -> dict:
    """Get current manager user."""
    return current_user

async def get_current_associate(current_user: dict = Depends(require_role("associate"))) -> dict:
    """Get current associate user."""
    return current_user