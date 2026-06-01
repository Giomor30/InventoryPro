from middlewares.auth_middleware import require_auth, require_roles
from services.product_service import ProductService

_any_role = require_roles("Admin", "Almacen", "Compras", "Consulta")
_admin_or_compras = require_roles("Admin", "Compras")
_only_admin = require_roles("Admin")


class ProductController:
    def __init__(self):
        self.service = ProductService()

    def get_all(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _any_role(payload)
        return {"success": True, "message": "Productos obtenidos", "data": self.service.get_all()}

    def create(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.create(body)
        return {"success": True, "message": "Producto creado", "data": result}

    def update(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Producto actualizado", "data": result}

    def change_status(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.change_status(params["id"], body)
        return {"success": True, "message": "Estado actualizado", "data": result}

    def delete(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _only_admin(payload)
        self.service.delete(params["id"])
        return {"success": True, "message": "Producto dado de baja", "data": None}
