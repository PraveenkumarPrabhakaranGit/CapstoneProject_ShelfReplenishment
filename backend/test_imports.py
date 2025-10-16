#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

try:
    print("Testing FastAPI import...")
    from fastapi import FastAPI
    print("[OK] FastAPI imported successfully")
    
    print("Testing Pydantic import...")
    from pydantic import BaseModel
    print("[OK] Pydantic imported successfully")
    
    print("Testing Motor import...")
    import motor.motor_asyncio
    print("[OK] Motor imported successfully")
    
    print("Testing other dependencies...")
    from passlib.context import CryptContext
    from jose import JWTError, jwt
    import uvicorn
    print("[OK] All dependencies imported successfully")
    
    # Test basic FastAPI app creation
    app = FastAPI()
    print("[OK] FastAPI app created successfully")
    
    # Test Pydantic model creation
    class TestModel(BaseModel):
        name: str
        value: int
    
    test_instance = TestModel(name="test", value=42)
    print("[OK] Pydantic model created successfully")
    
    print("\n[SUCCESS] All imports and basic functionality tests passed!")
    
except ImportError as e:
    print(f"[ERROR] Import error: {e}")
    exit(1)
except Exception as e:
    print(f"[ERROR] Unexpected error: {e}")
    exit(1)