from repositories.category_repository import CategoryRepository
from schemas.category_schema import validate_category
from utils.errors import AppError


class CategoryService:
    def __init__(self):
        self.repo = CategoryRepository()

    def get_all(self):
        return self.repo.find_all()

    def create(self, data):
        errors = validate_category(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.save(data)

    def update(self, category_id, data):
        errors = validate_category(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)
        return self.repo.update(category_id, data)

    def delete(self, category_id):
        return self.repo.delete(category_id)
