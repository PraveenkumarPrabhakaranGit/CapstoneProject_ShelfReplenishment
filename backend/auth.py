from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import hashlib
import os
from dotenv import load_dotenv

from database import get_db, UserDB
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

def get_user_by_email(db: Session, email: str) -> Optional[UserDB]:
    """Get user by email from database."""
    return db.query(UserDB).filter(UserDB.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[UserDB]:
    """Get user by ID from database."""
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def authenticate_user(db: Session, email: str, password: str, role: str) -> Optional[UserDB]:
    """Authenticate user with email, password, and role."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if user.role != role:
        return None
    if not user.is_active:
        return None
    return user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserDB:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    token_data = verify_token(token, credentials_exception)
    user = get_user_by_id(db, token_data.user_id)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: UserDB = Depends(get_current_user)) -> UserDB:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_role(required_role: str):
    """Decorator to require specific role."""
    def role_checker(current_user: UserDB = Depends(get_current_active_user)) -> UserDB:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {required_role}"
            )
        return current_user
    return role_checker

# Role-specific dependencies
def get_current_manager(current_user: UserDB = Depends(require_role("manager"))) -> UserDB:
    """Get current manager user."""
    return current_user

def get_current_associate(current_user: UserDB = Depends(require_role("associate"))) -> UserDB:
    """Get current associate user."""
    return current_user