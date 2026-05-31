from repositories.product_repository import ProductRepository
from schemas.product_schema import validate_product, validate_status
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
        errors = validate_status(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.update_status(product_id, str(data["status"]).strip())

    def delete(self, product_id):
        return self.repo.update_status(product_id, "inactivo")
