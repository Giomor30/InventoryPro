from middlewares.auth_middleware import require_auth
from services.auth_service import AuthService
from utils.jwt_helper import decode_token
from utils.role_helper import normalize_role

_service = AuthService()


def _get_caller_role(handler) -> str:
    """Intenta extraer el rol del token de autorización; devuelve None si no hay token."""
    auth_header = (handler.headers.get("Authorization", "") if handler else "")
    if not auth_header.startswith("Bearer "):
        return None
    try:
        token = auth_header[len("Bearer "):]
        payload = decode_token(token)
        if payload.get("type") == "access":
            return normalize_role(payload.get("role"))
    except Exception:
        pass
    return None


class AuthController:
    def register(self, params=None, body=None, handler=None):
        caller_role = _get_caller_role(handler)
        user = _service.register(body, caller_role=caller_role)
        return {"success": True, "message": "Usuario registrado", "data": user}

    def bootstrap_admin(self, params=None, body=None, handler=None):
        setup_key = (handler.headers.get("X-Setup-Key", "") if handler else "").strip()
        user = _service.bootstrap_admin(body, setup_key)
        return {"success": True, "message": "Administrador creado", "data": user}

    def login(self, params=None, body=None, handler=None):
        result = _service.login(body)
        return {"success": True, "message": "Login exitoso", "data": result}

    def refresh(self, params=None, body=None, handler=None):
        result = _service.refresh(body)
        return {"success": True, "message": "Token renovado", "data": result}

    def me(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        user = _service.me(payload["sub"])
        return {"success": True, "message": "Usuario autenticado", "data": user}

    def logout(self, params=None, body=None, handler=None):
        require_auth(handler)
        # Con JWT stateless el logout es del lado del cliente;
        # aqui confirmamos que el token era valido.
        return {"success": True, "message": "Sesion cerrada", "data": None}
