# ShelfMind Backend API Documentation

## Overview
This document describes the backend API endpoints for user registration in the ShelfMind application.

## Base URL
- Development: `http://localhost:8002`
- The API uses FastAPI with automatic OpenAPI documentation available at `/docs`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Tokens are returned upon successful registration or login.

## User Registration Endpoints

### POST /api/auth/register
Register a new user (store associate or store manager).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "associate",  // or "manager"
  "store_id": "store-001",
  "store_name": "Metro Fresh Market"
}
```

**Validation Rules:**
- `email`: Must be a valid email address and unique
- `password`: Minimum 6 characters, must contain at least one letter and one digit
- `name`: 2-100 characters
- `role`: Must be either "associate" or "manager"
- `store_id`: Required, non-empty string
- `store_name`: Minimum 2 characters

**Success Response (201 Created):**
```json
{
  "message": "User account created successfully for associate",
  "user": {
    "id": "associate-96390971",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "associate",
    "store_id": "store-001",
    "store_name": "Metro Fresh Market",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `400 Bad Request`: Email already registered
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### POST /api/auth/login
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "associate"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "associate-96390971",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "associate",
    "store_id": "store-001",
    "store_name": "Metro Fresh Market",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
- `401 Unauthorized`: Incorrect email, password, or role

### GET /api/auth/validate
Validate current access token and return user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "id": "associate-96390971",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "associate",
  "store_id": "store-001",
  "store_name": "Metro Fresh Market",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
- `401 Unauthorized`: Invalid or expired token

### GET /api/auth/roles
Get available user roles and their descriptions.

**Success Response (200 OK):**
```json
{
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
```

## Database Schema

### Users Table
- `id`: String (Primary Key) - Format: "{role}-{uuid}"
- `email`: String (Unique) - User's email address
- `name`: String - User's full name
- `hashed_password`: String - SHA-256 hashed password
- `role`: String - Either "associate" or "manager"
- `store_id`: String - Store identifier
- `store_name`: String - Store display name
- `is_active`: Boolean - Account status
- `created_at`: DateTime - Account creation timestamp
- `updated_at`: DateTime - Last update timestamp

## Security Features

1. **Password Hashing**: Passwords are hashed using SHA-256 with salt
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Comprehensive validation using Pydantic models
4. **CORS Protection**: Configured for frontend integration
5. **Role-based Access**: Support for different user roles

## Testing

The API includes comprehensive tests covering:
- Successful registration for both roles
- Duplicate email rejection
- Input validation
- Available roles endpoint
- Authentication flow

Run tests with:
```bash
cd backend
python test_registration.py
```

## Dependencies

- FastAPI: Web framework
- SQLAlchemy: Database ORM
- Pydantic: Data validation
- python-jose: JWT handling
- Uvicorn: ASGI server
- SQLite: Database (development)

## Environment Configuration

Key environment variables in `.env`:
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time in seconds
- `CORS_ORIGINS`: Allowed CORS origins
- `PORT`: Server port (default: 8000)