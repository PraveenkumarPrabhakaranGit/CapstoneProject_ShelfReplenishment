"""
Routers package for ShelfMind API.

This package contains all FastAPI routers that define the API endpoints
for different functionalities of the ShelfMind application.
"""

from .auth import router as auth_router

__all__ = [
    "auth_router"
]