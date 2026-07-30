"""
Authentication & JWT Dual-Token Security Service for TruthLens AI.

Provides:
- Short-lived Access Tokens (30 minutes)
- Long-lived Refresh Tokens (7 days)
- Password hashing using PBKDF2 HMAC SHA-256
- FastAPI JWT authentication dependencies
"""

import os
import hashlib
import datetime
import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "TRUTHLENS_SECRET_KEY_2026_CS_PROJECT_99")
REFRESH_SECRET_KEY = os.environ.get("JWT_REFRESH_SECRET_KEY", "TRUTHLENS_REFRESH_SECRET_2026_CS_PROJECT_99")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hashes password using PBKDF2-HMAC-SHA256 with salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ":" + key.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against stored PBKDF2 hash."""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        computed_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return computed_key == expected_key
    except Exception:
        return False


def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    """Generates signed JWT Access Token with configurable expiry."""
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Generates long-lived signed JWT Refresh Token (7 days)."""
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


def decode_refresh_token(refresh_token: str) -> dict:
    """Decodes and verifies a JWT Refresh Token."""
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type.")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired. Please log in again.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """FastAPI dependency for verifying Access Tokens in protected routes."""
    if not credentials:
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid access token type.")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired. Please refresh your session.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
