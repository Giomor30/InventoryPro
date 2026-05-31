from datetime import datetime, timedelta, timezone

import jwt

from config import env


def _now():
    return datetime.now(timezone.utc)


def create_access_token(payload: dict) -> str:
    data = payload.copy()
    data["exp"] = _now() + timedelta(minutes=env.JWT_ACCESS_EXPIRES_MINUTES)
    data["type"] = "access"
    return jwt.encode(data, env.JWT_SECRET, algorithm="HS256")


def create_refresh_token(payload: dict) -> str:
    data = payload.copy()
    data["exp"] = _now() + timedelta(days=env.JWT_REFRESH_EXPIRES_DAYS)
    data["type"] = "refresh"
    return jwt.encode(data, env.JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> dict:
    from utils.errors import AppError
    try:
        return jwt.decode(token, env.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AppError("Token expirado", code="TOKEN_EXPIRED", status=401)
    except jwt.InvalidTokenError:
        raise AppError("Token inválido", code="TOKEN_INVALID", status=401)
