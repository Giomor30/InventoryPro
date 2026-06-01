from middlewares.auth_middleware import require_auth, require_roles
from services.supplier_service import SupplierService

_any_role = require_roles("Admin", "Almacen", "Compras", "Consulta")
_admin_or_compras = require_roles("Admin", "Compras")


class SupplierController:
    def __init__(self):
        self.service = SupplierService()

    def get_all(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _any_role(payload)
        return {"success": True, "message": "Proveedores obtenidos", "data": self.service.get_all()}

    def create(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.create(body)
        return {"success": True, "message": "Proveedor creado", "data": result}

    def update(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Proveedor actualizado", "data": result}

    def delete(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_compras(payload)
        self.service.delete(params["id"])
        return {"success": True, "message": "Proveedor eliminado", "data": None}
