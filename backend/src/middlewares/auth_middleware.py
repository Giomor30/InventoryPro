from utils.errors import AppError
from utils.jwt_helper import decode_token


def get_token_from_handler(handler) -> str:
    """Extrae el Bearer token del header Authorization."""
    auth_header = handler.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise AppError("Token requerido", code="TOKEN_MISSING", status=401)
    return auth_header[len("Bearer "):]


def require_auth(handler):
    """Decodifica el token y devuelve el payload. Lanza AppError si falla."""
    token = get_token_from_handler(handler)
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise AppError("Token inválido", code="TOKEN_INVALID", status=401)
    return payload


def require_roles(*allowed_roles):
    """Devuelve una función que verifica que el usuario tenga uno de los roles permitidos."""
    def check(payload: dict):
        if payload.get("role") not in allowed_roles:
            raise AppError("No tienes permisos para esta acción", code="FORBIDDEN", status=403)
    return check
