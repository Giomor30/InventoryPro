from services.warehouse_service import WarehouseService


class WarehouseController:
    def __init__(self):
        self.service = WarehouseService()

    def get_all(self, params=None, body=None):
        return {"success": True, "message": "Almacenes obtenidos", "data": self.service.get_all()}

    def create(self, params=None, body=None):
        result = self.service.create(body)
        return {"success": True, "message": "Almacén creado", "data": result}

    def update(self, params=None, body=None):
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Almacén actualizado", "data": result}

    def change_status(self, params=None, body=None):
        result = self.service.change_status(params["id"], body)
        return {"success": True, "message": "Estado del almacén actualizado", "data": result}

    def delete(self, params=None, body=None):
        self.service.delete(params["id"])
        return {"success": True, "message": "Almacén dado de baja", "data": None}
