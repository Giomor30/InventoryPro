from controllers.category_controller import CategoryController
from utils.router import Route

_controller = CategoryController()


def category_routes():
    return [
        Route("GET", "/api/categories", _controller.get_all),
        Route("POST", "/api/categories", _controller.create),
        Route("PUT", "/api/categories/:id", _controller.update),
        Route("DELETE", "/api/categories/:id", _controller.delete),
    ]
