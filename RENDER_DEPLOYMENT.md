# Render.com Deployment Documentation

## Overview

This document provides comprehensive guidance for deploying the ShelfMind application to Render.com, including troubleshooting for the specific build error encountered with the `python-jose[cryptography]` dependency.

## Build Error Encountered

### Error Description
During the initial deployment attempt on Render.com, the build process failed with the following error:

```
error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools"
Building wheel for cryptography (pyproject.toml) ... error
ERROR: Failed building wheel for cryptography
```

### Root Cause Analysis

The error occurred because:

1. **Dependency Chain**: The `python-jose` library was initially installed with the `[cryptography]` extra dependency
2. **Compilation Requirements**: The `cryptography` package requires Rust compilation and Microsoft Visual C++ Build Tools
3. **Platform Limitations**: Render.com's build environment doesn't have the necessary compilation tools installed by default
4. **Binary Wheel Availability**: No pre-compiled binary wheels were available for the specific Python/platform combination

## Solution Implemented

### Primary Fix: Remove Cryptography Extra Dependency

The solution involved modifying the [`requirements.txt`](backend/requirements.txt:5) file:

**Before (Problematic):**
```
python-jose[cryptography]==3.3.0
```

**After (Fixed):**
```
python-jose==3.3.0
```

### Why This Works

1. **Core Functionality Preserved**: `python-jose` without the cryptography extra still provides JWT token functionality
2. **Reduced Dependencies**: Eliminates the need for Rust compilation during build
3. **Binary Compatibility**: Uses only dependencies with available binary wheels
4. **Security Maintained**: JWT signing and verification still work securely with the default backend

## Render.yaml Configuration

The [`render.yaml`](render.yaml) file is configured for optimal deployment:

```yaml
services:
  - type: web
    name: shelfmind-api
    env: python
    region: oregon
    plan: starter
    buildCommand: |
      cd backend &&
      pip install --upgrade pip &&
      pip install --only-binary=:all: -r requirements.txt
    startCommand: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
```

### Key Configuration Elements

- **`--only-binary=:all:`**: Forces pip to only install binary wheels, preventing compilation
- **Health Check**: Uses the `/health` endpoint defined in [`main.py`](backend/main.py:50)
- **Port Configuration**: Uses Render's dynamic `$PORT` environment variable
- **Python Version**: Explicitly set to 3.11.0 for consistency

## Step-by-Step Deployment Instructions

### Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Render Account**: Create an account at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for the database

### Deployment Steps

1. **Connect Repository**
   - Log into Render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your ShelfMind application

2. **Configure Service**
   - **Name**: `shelfmind-api` (or your preferred name)
   - **Region**: Choose your preferred region (Oregon recommended for US West)
   - **Branch**: `main` (or your deployment branch)
   - **Runtime**: Python 3
   - **Build Command**: 
     ```bash
     cd backend && pip install --upgrade pip && pip install --only-binary=:all: -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

3. **Environment Variables**
   Set the following environment variables in Render's dashboard:

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/shelfmind` | Your MongoDB Atlas connection string |
   | `JWT_SECRET_KEY` | `your-secret-key-here` | Generate a secure random string |
   | `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiration time |
   | `CORS_ORIGINS` | `https://your-frontend-domain.onrender.com,http://localhost:5137` | Allowed CORS origins |
   | `PYTHON_VERSION` | `3.11.0` | Python version specification |

4. **Deploy**
   - Click "Create Web Service"
   - Monitor the build logs for any errors
   - Once deployed, test the health endpoint: `https://your-service.onrender.com/health`

## Environment Variable Configuration

### Required Variables

#### MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/shelfmind?retryWrites=true&w=majority
```
- Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials
- Ensure the database user has read/write permissions

#### JWT_SECRET_KEY
```bash
# Generate a secure secret key (example using Python)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### CORS_ORIGINS
```
https://your-frontend-domain.onrender.com,http://localhost:5137
```
- Include your frontend domain
- Keep localhost for development testing

### Optional Variables

#### PORT
- Automatically provided by Render
- No manual configuration needed

## Troubleshooting Guide

### Common Build Errors

#### 1. Cryptography Compilation Error
**Error**: `error: Microsoft Visual C++ 14.0 or greater is required`

**Solution**: 
- Ensure `python-jose` is used without `[cryptography]` extra
- Verify `--only-binary=:all:` flag in build command

#### 2. Module Import Errors
**Error**: `ModuleNotFoundError: No module named 'xyz'`

**Solution**:
- Check all dependencies are listed in [`requirements.txt`](backend/requirements.txt)
- Verify the build command includes the correct path: `cd backend &&`

#### 3. Port Binding Issues
**Error**: `OSError: [Errno 98] Address already in use`

**Solution**:
- Ensure start command uses `--host 0.0.0.0 --port $PORT`
- Verify [`main.py`](backend/main.py:57) uses `os.getenv("PORT", 8000)`

#### 4. Database Connection Failures
**Error**: `ServerSelectionTimeoutError: No servers found`

**Solution**:
- Verify `MONGODB_URI` environment variable is set correctly
- Check MongoDB Atlas network access settings (allow 0.0.0.0/0 for Render)
- Ensure database user credentials are correct

### Performance Optimization

#### 1. Build Time Optimization
- Use `--only-binary=:all:` to avoid compilation
- Pin dependency versions in requirements.txt
- Consider using a requirements.lock file for reproducible builds

#### 2. Runtime Optimization
- Use uvicorn with multiple workers for production:
  ```bash
  python -m uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
  ```
- Enable connection pooling in MongoDB configuration

### Monitoring and Logging

#### Health Check Endpoint
The application includes a health check endpoint at `/health`:

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}
```

#### Log Monitoring
- Access logs through Render's dashboard
- Monitor for startup errors and runtime exceptions
- Set up alerts for service downtime

## Security Considerations

### Environment Variables
- Never commit sensitive environment variables to version control
- Use Render's environment variable management
- Rotate JWT secret keys periodically

### CORS Configuration
- Limit CORS origins to trusted domains only
- Avoid using wildcard (`*`) in production
- Update CORS_ORIGINS when deploying new frontend domains

### Database Security
- Use MongoDB Atlas with authentication enabled
- Restrict network access to necessary IP ranges
- Enable MongoDB Atlas monitoring and alerts

## Maintenance and Updates

### Dependency Updates
1. Test updates locally first
2. Update [`requirements.txt`](backend/requirements.txt)
3. Verify compatibility with `--only-binary=:all:` flag
4. Deploy to staging environment before production

### Scaling Considerations
- Monitor resource usage in Render dashboard
- Consider upgrading to higher-tier plans for increased traffic
- Implement database connection pooling for better performance

### Backup Strategy
- MongoDB Atlas provides automated backups
- Export environment variable configurations
- Maintain deployment documentation updates

## Additional Resources

- [Render.com Documentation](https://render.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [python-jose Documentation](https://python-jose.readthedocs.io/)

## Support and Troubleshooting

For deployment issues:
1. Check Render build logs first
2. Verify all environment variables are set
3. Test endpoints locally before deployment
4. Review this documentation for common solutions

Last Updated: October 2024