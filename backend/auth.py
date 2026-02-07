"""
MOCK AUTHENTICATION MODULE
Bypasses real JWT verification for demonstration purposes.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Mock Security Scheme
security = HTTPBearer()

MOCK_USER_ID = "mock-user-123"

def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    MOCK IMPLEMENTATION:
    Accepts any token and returns the hardcoded MOCK_USER_ID.
    """
    # In a real app, this would verify the JWT signature.
    # Here, we just return the mock user ID to allow access.
    return MOCK_USER_ID

def verify_user_access(token_user_id: str, path_user_id: str):
    """
    MOCK IMPLEMENTATION:
    Always allows access if the token user is the mock user.
    """
    if token_user_id == MOCK_USER_ID:
        return True
    
    # Fallback to original logic (unlikely to be hit with mock token)
    if token_user_id != path_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
