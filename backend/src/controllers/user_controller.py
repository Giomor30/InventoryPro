from middlewares.auth_middleware import require_auth, require_roles
from services.user_service import UserService

_service = UserService()
_only_admin = require_roles("Admin")


class UserController:
    def get_all(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _only_admin(payload)
        return {"success": True, "message": "Usuarios obtenidos", "data": _service.get_all()}

    def get_one(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _only_admin(payload)
        return {"success": True, "message": "Usuario obtenido", "data": _service.get_by_id(params["id"])}

    def update(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _only_admin(payload)
        result = _service.update(params["id"], body)
        return {"success": True, "message": "Usuario actualizado", "data": result}

    def deactivate(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _only_admin(payload)
        result = _service.deactivate(params["id"])
        return {"success": True, "message": "Usuario desactivado", "data": result}
