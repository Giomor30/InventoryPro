from services.supplier_service import SupplierService


class SupplierController:
    def __init__(self):
        self.service = SupplierService()

    def get_all(self, params=None, body=None):
        return {"success": True, "message": "Proveedores obtenidos", "data": self.service.get_all()}

    def create(self, params=None, body=None):
        result = self.service.create(body)
        return {"success": True, "message": "Proveedor creado", "data": result}

    def update(self, params=None, body=None):
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Proveedor actualizado", "data": result}

    def delete(self, params=None, body=None):
        self.service.delete(params["id"])
        return {"success": True, "message": "Proveedor eliminado", "data": None}
