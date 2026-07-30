import datetime
import re
from typing import Any, Dict, Optional


def validate_age_at_least_13(dob_str: str):
    """Verifies user is at least 13 years old from YYYY-MM-DD DOB string."""
    try:
        dob = datetime.date.fromisoformat(dob_str)
        today = datetime.date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        if age < 13:
            raise ValueError("You must be at least 13 years old to register.")
    except Exception as exc:
        if "at least 13" in str(exc):
            raise
        raise ValueError("Invalid Date of Birth format (YYYY-MM-DD expected).")


def validate_indian_mobile(phone: str):
    """Validates 10-digit Indian mobile number with optional +91 prefix."""
    clean = phone.replace(" ", "").replace("-", "")
    if clean.startswith("+91"):
        clean = clean[3:]
    elif clean.startswith("91") and len(clean) == 12:
        clean = clean[2:]
    if not re.match(r"^[6-9]\d{9}$", clean):
        raise ValueError("Must be a valid 10-digit Indian mobile number starting with 6-9.")
    return "+91" + clean


def validate_password_complexity(password: str):
    """Verifies min 8 chars, uppercase, lowercase, number, and special character."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter (A-Z).")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter (a-z).")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain at least one number (0-9).")
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        raise ValueError("Password must contain at least one special character (!@#$%^&*).")


def serialize_user(user: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not user:
        return None
    return {
        "id": user.get("id"),
        "full_name": user.get("full_name"),
        "dob": user.get("dob"),
        "gender": user.get("gender"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "provider": user.get("provider", "email"),
        "profile_image": user.get("profile_image"),
        "role": user.get("role", "user"),
        "status": user.get("status", "active")
    }


def build_error_payload(message: str, **extra):
    payload = {
        "success": False,
        "message": message,
    }
    payload.update(extra)
    return payload


def build_auth_success_payload(user: Optional[Dict[str, Any]], access_token: str, refresh_token: str, message: str, **extra):
    payload = {
        "success": True,
        "status": "success",
        "message": message,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }
    payload.update(extra)
    return payload
