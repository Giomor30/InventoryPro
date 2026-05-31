from repositories.product_repository import ProductRepository
from schemas.product_schema import validate_product
from utils.errors import AppError


class ProductService:
    def __init__(self):
        self.repo = ProductRepository()

    def get_all(self):
        return self.repo.find_all()

    def create(self, data):
        errors = validate_product(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.save(data)

    def update(self, product_id, data):
        errors = validate_product(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.update(product_id, data)

    def change_status(self, product_id, data):
        status = (data or {}).get("status")
        if not status:
            raise AppError("El campo status es requerido", code="VALIDATION_ERROR", status=422)
        return self.repo.update_status(product_id, status)

    def delete(self, product_id):
        return self.repo.update_status(product_id, "inactivo")
