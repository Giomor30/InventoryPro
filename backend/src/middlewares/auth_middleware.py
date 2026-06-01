from utils.errors import AppError
from utils.jwt_helper import decode_token
from utils.role_helper import normalize_role


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
        raise AppError("Token invalido", code="TOKEN_INVALID", status=401)

    payload["role"] = normalize_role(payload.get("role"))
    return payload


def require_roles(*allowed_roles):
    """Verifica que el usuario tenga uno de los roles permitidos."""
    normalized_allowed = {normalize_role(role) for role in allowed_roles}

    def check(payload: dict):
        current_role = normalize_role(payload.get("role"))
        if current_role not in normalized_allowed:
            raise AppError("No tienes permisos para esta accion", code="FORBIDDEN", status=403)

    return check
