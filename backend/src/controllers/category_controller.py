from middlewares.auth_middleware import require_auth, require_roles
from services.category_service import CategoryService

_any_role = require_roles("Admin", "Almacen", "Compras", "Consulta")
_admin_or_compras = require_roles("Admin", "Compras")


class CategoryController:
    def __init__(self):
        self.service = CategoryService()

    def get_all(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _any_role(payload)
        return {"success": True, "message": "Categorias obtenidas", "data": self.service.get_all()}

    def create(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.create(body)
        return {"success": True, "message": "Categoria creada", "data": result}

    def update(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Categoria actualizada", "data": result}

    def delete(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        self.service.delete(params["id"])
        return {"success": True, "message": "Categoria eliminada", "data": None}
