# Demo User Seeding

This directory contains a script to seed the database with demo credentials for testing purposes.

## Usage

1. Make sure the backend server is running on port 8002:
   ```bash
   cd backend
   python -c "import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8002, reload=False)"
   ```

2. Run the seeding script:
   ```bash
   cd backend
   python seed_demo_users.py
   ```

## Demo Credentials

The script creates the following demo users:

### Store Associate
- **Email**: `associate@demo.com`
- **Password**: `demo123`
- **Name**: Alex Johnson
- **Role**: associate
- **Store**: Downtown ShelfMind Store (STORE001)

### Store Manager
- **Email**: `manager@demo.com`
- **Password**: `demo456`
- **Name**: Sarah Williams
- **Role**: manager
- **Store**: Downtown ShelfMind Store (STORE001)

## Notes

- The script will check if users already exist and skip creation if they do
- Both users are assigned to the same store (STORE001) for testing purposes
- The script uses the registration endpoint at `http://localhost:8002/api/auth/register`
- Passwords meet the validation requirements (minimum 6 characters, contain letters and digits)