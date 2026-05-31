from repositories.warehouse_repository import WarehouseRepository
from schemas.warehouse_schema import validate_warehouse
from utils.errors import AppError


class WarehouseService:
    def __init__(self):
        self.repo = WarehouseRepository()

    def get_all(self):
        return self.repo.find_all()

    def create(self, data):
        errors = validate_warehouse(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.save(data)

    def update(self, warehouse_id, data):
        errors = validate_warehouse(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.update(warehouse_id, data)

    def change_status(self, warehouse_id, data):
        status = (data or {}).get("status")
        if status not in {"activo", "inactivo"}:
            raise AppError("El status debe ser activo o inactivo", code="VALIDATION_ERROR", status=422)
        return self.repo.update_status(warehouse_id, status)

    def delete(self, warehouse_id):
        return self.repo.update_status(warehouse_id, "inactivo")
