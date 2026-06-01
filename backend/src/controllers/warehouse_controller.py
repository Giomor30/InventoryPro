from middlewares.auth_middleware import require_auth, require_roles
from services.warehouse_service import WarehouseService

_any_role = require_roles("Admin", "Almacen", "Compras", "Consulta")
_admin_or_almacen = require_roles("Admin", "Almacen")


class WarehouseController:
    def __init__(self):
        self.service = WarehouseService()

    def get_all(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _any_role(payload)
        return {"success": True, "message": "Almacenes obtenidos", "data": self.service.get_all()}

    def get_one(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _any_role(payload)
        result = self.service.get_by_id(params["id"])
        return {"success": True, "message": "Almacen obtenido", "data": result}

    def create(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_almacen(payload)
        result = self.service.create(body)
        return {"success": True, "message": "Almacen creado", "data": result}

    def update(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_almacen(payload)
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Almacen actualizado", "data": result}

    def change_status(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_almacen(payload)
        result = self.service.change_status(params["id"], body)
        return {"success": True, "message": "Estado del almacen actualizado", "data": result}

    def delete(self, params=None, body=None, handler=None):
        payload = require_auth(handler)
        _admin_or_almacen(payload)
        self.service.delete(params["id"])
        return {"success": True, "message": "Almacen dado de baja", "data": None}
