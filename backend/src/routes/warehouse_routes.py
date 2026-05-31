from controllers.warehouse_controller import WarehouseController
from utils.router import Route

_controller = WarehouseController()


def warehouse_routes():
    return [
        Route("GET", "/api/warehouses", _controller.get_all),
        Route("POST", "/api/warehouses", _controller.create),
        Route("PUT", "/api/warehouses/:id", _controller.update),
        Route("PATCH", "/api/warehouses/:id/status", _controller.change_status),
        Route("DELETE", "/api/warehouses/:id", _controller.delete),
    ]
