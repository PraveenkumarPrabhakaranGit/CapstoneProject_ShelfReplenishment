from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid
from typing import Dict, Any

from database import get_db, UserDB
from models.user import (
    RegisterRequest, 
    RegisterResponse, 
    UserLogin, 
    Token, 
    UserResponse
)
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_user_by_email,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user (store associate or store manager).
    
    - **email**: Valid email address (must be unique)
    - **password**: Password (min 6 chars, must contain letter and digit)
    - **name**: Full name (2-100 characters)
    - **role**: Either "associate" or "manager"
    - **store_id**: Store identifier
    - **store_name**: Store display name
    """
    
    # Check if user already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate unique user ID
    user_id = f"{user_data.role}-{str(uuid.uuid4())[:8]}"
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user in database
    db_user = UserDB(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        role=user_data.role,
        store_id=user_data.store_id,
        store_name=user_data.store_name,
        is_active=True
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email, "user_id": db_user.id, "role": db_user.role},
        expires_delta=access_token_expires
    )
    
    # Convert to response model
    user_response = UserResponse(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        role=db_user.role,
        store_id=db_user.store_id,
        store_name=db_user.store_name,
        is_active=db_user.is_active,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at
    )
    
    return RegisterResponse(
        message=f"User account created successfully for {user_data.role}",
        user=user_response,
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/login", response_model=Token)
async def login_user(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token.
    
    - **email**: User's email address
    - **password**: User's password
    - **role**: User's role (associate or manager)
    """
    
    # Authenticate user
    user = authenticate_user(
        db, 
        user_credentials.email, 
        user_credentials.password, 
        user_credentials.role
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email, password, or role",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    # Convert to response model
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        store_id=user.store_id,
        store_name=user.store_name,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/validate", response_model=UserResponse)
async def validate_token(
    current_user: UserDB = Depends(get_current_active_user)
):
    """
    Validate current access token and return user information.
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        store_id=current_user.store_id,
        store_name=current_user.store_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.get("/roles", response_model=Dict[str, Any])
async def get_available_roles():
    """
    Get available user roles and their descriptions.
    """
    return {
        "roles": [
            {
                "value": "associate",
                "label": "Store Associate",
                "description": "Handles day-to-day shelf monitoring and restocking tasks"
            },
            {
                "value": "manager",
                "label": "Store Manager", 
                "description": "Oversees store operations and manages associates"
            }
        ]
    }
