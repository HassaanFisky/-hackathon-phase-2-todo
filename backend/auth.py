"""
JWT token verification for API authentication
Verifies tokens issued by Better Auth on frontend
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

# Must match frontend BETTER_AUTH_SECRET exactly
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")

if not BETTER_AUTH_SECRET:
    raise ValueError(
        "BETTER_AUTH_SECRET environment variable is not set. "
        "Must match frontend secret for JWT verification."
    )

if len(BETTER_AUTH_SECRET) < 32:
    raise ValueError(
        "BETTER_AUTH_SECRET must be at least 32 characters. "
        "Generate with: openssl rand -base64 32"
    )

# JWT algorithm used by Better Auth
ALGORITHM = "HS256"

# FastAPI security scheme for Bearer token in Authorization header
security = HTTPBearer()


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Verify JWT token and extract user_id
    
    Args:
        credentials: Automatically extracted from Authorization: Bearer <token> header
    
    Returns:
        user_id: The authenticated user's ID from token payload
    
    Raises:
        HTTPException: 401 if token is invalid, expired, or missing user_id
    """
    token = credentials.credentials
    
    try:
        # Decode and verify JWT token
        payload = jwt.decode(
            token, 
            BETTER_AUTH_SECRET, 
            algorithms=[ALGORITHM]
        )
        
        # Extract user_id from 'sub' (subject) claim
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials: missing user_id in token"
            )
        
        return user_id
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


def verify_user_access(token_user_id: str, path_user_id: str):
    """
    Verify that user_id in token matches user_id in URL path
    Prevents users from accessing other users' data
    
    Args:
        token_user_id: User ID extracted from JWT token
        path_user_id: User ID from URL path parameter
    
    Raises:
        HTTPException: 403 if user_ids don't match
    """
    if token_user_id != path_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: cannot access another user's data"
        )
