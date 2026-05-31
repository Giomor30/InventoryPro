from controllers.inventory_controller import InventoryController
from utils.router import Route

_controller = InventoryController()


def inventory_routes():
    return [
        Route("GET", "/api/inventory/stock", _controller.get_stock),
        Route("GET", "/api/inventory/movements", _controller.list_movements),
        Route("POST", "/api/inventory/movements/in", _controller.movement_in),
        Route("POST", "/api/inventory/movements/out", _controller.movement_out),
    ]
