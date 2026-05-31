from services.category_service import CategoryService


class CategoryController:
    def __init__(self):
        self.service = CategoryService()

    def get_all(self, params=None, body=None):
        return {"success": True, "message": "Categorías obtenidas", "data": self.service.get_all()}

    def create(self, params=None, body=None):
        result = self.service.create(body)
        return {"success": True, "message": "Categoría creada", "data": result}

    def update(self, params=None, body=None):
        result = self.service.update(params["id"], body)
        return {"success": True, "message": "Categoría actualizada", "data": result}

    def delete(self, params=None, body=None):
        self.service.delete(params["id"])
        return {"success": True, "message": "Categoría eliminada", "data": None}
