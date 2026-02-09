from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
import requests
from typing import Optional

# Neon Auth Configuration
# These are placeholders. The user must provide the actual JWKS/Issuer URL.
NEON_AUTH_ISSUER = os.getenv("NEON_AUTH_ISSUER") 
NEON_JWKS_URL = f"{NEON_AUTH_ISSUER}/.well-known/jwks.json" if NEON_AUTH_ISSUER else None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """
    Verifies the JWT token from Neon Auth and extracts the user ID.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not NEON_AUTH_ISSUER:
        # Strict Production Mode: Fail if configuration is missing
        print("CRITICAL: NEON_AUTH_ISSUER is not set. Authentication will fail.")
        raise credentials_exception

    try:
        # Fetch JWKS (Cache this in production!)
        jwks = requests.get(NEON_JWKS_URL).json()
        
        # Decode and verify
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
        audience=os.getenv("NEON_AUTH_CLIENT_ID"), 
        issuer=NEON_AUTH_ISSUER
    )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        return user_id
        
    except (JWTError, Exception) as e:
        print(f"Auth Error: {e}")
        raise credentials_exception

# Alias for compatibility with existing routes
verify_token = get_current_user_id

def verify_user_access(token_user_id: str, requested_user_id: str):
    """
    Ensures the authenticated user is accessing their own data.
    """
    if token_user_id != requested_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this resource"
        )
