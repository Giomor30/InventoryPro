from middlewares.auth_middleware import require_auth
from services.auth_service import AuthService

_service = AuthService()


class AuthController:
    def register(self, params=None, body=None, handler=None):
        user = _service.register(body)
        return {"success": True, "message": "Usuario registrado", "data": user}

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
        require_auth(handler)  # valida que tenga token válido
        # Con JWT stateless el logout es del lado del cliente;
        # aquí confirmamos que el token era válido.
        return {"success": True, "message": "Sesión cerrada", "data": None}
