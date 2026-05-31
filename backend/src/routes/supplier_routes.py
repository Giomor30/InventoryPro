from controllers.supplier_controller import SupplierController
from utils.router import Route

_controller = SupplierController()


def supplier_routes():
    return [
        Route("GET", "/api/suppliers", _controller.get_all),
        Route("POST", "/api/suppliers", _controller.create),
        Route("PUT", "/api/suppliers/:id", _controller.update),
        Route("DELETE", "/api/suppliers/:id", _controller.delete),
    ]
