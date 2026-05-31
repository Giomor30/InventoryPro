from controllers.product_controller import ProductController
from utils.router import Route

_controller = ProductController()


def product_routes():
    return [
        Route("GET", "/api/products", _controller.get_all),
        Route("POST", "/api/products", _controller.create),
        Route("PUT", "/api/products/:id", _controller.update),
        Route("PATCH", "/api/products/:id/status", _controller.change_status),
        Route("DELETE", "/api/products/:id", _controller.delete),
    ]
