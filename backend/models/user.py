from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Literal
from datetime import datetime

# Pydantic models for API requests/responses
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: Literal['associate', 'manager']
    store_id: str
    store_name: str

class UserCreate(UserBase):
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['associate', 'manager']:
            raise ValueError('Role must be either "associate" or "manager"')
        return v
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Literal['associate', 'manager']

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# Registration request model
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Literal['associate', 'manager']
    store_id: str
    store_name: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        return v
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['associate', 'manager']:
            raise ValueError('Role must be either "associate" or "manager"')
        return v
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v.strip()) > 100:
            raise ValueError('Name must be less than 100 characters')
        return v.strip()
    
    @field_validator('store_id')
    @classmethod
    def validate_store_id(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Store ID is required')
        return v.strip()
    
    @field_validator('store_name')
    @classmethod
    def validate_store_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Store name must be at least 2 characters long')
        return v.strip()

# Registration response model
class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
    access_token: str
    token_type: str