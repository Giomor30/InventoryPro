from urllib.parse import parse_qs, urlparse

from services.movement_service import MovementService
from services.stock_service import StockService


def _query_params(handler):
    if handler is None:
        return {}
    parsed = urlparse(handler.path)
    raw = parse_qs(parsed.query)
    return {key: values[0] for key, values in raw.items() if values}


class InventoryController:
    def __init__(self):
        self.stock_service = StockService()
        self.movement_service = MovementService()

    def get_stock(self, params=None, body=None, handler=None):
        filters = _query_params(handler)
        data = self.stock_service.get_stock(filters)
        return {"success": True, "message": "Stock obtenido", "data": data}

    def list_movements(self, params=None, body=None, handler=None):
        filters = _query_params(handler)
        data = self.movement_service.list_movements(filters)
        return {"success": True, "message": "Movimientos obtenidos", "data": data}

    def movement_in(self, params=None, body=None, handler=None):
        result = self.movement_service.register_in(body)
        return {"success": True, "message": "Entrada registrada", "data": result}

    def movement_out(self, params=None, body=None, handler=None):
        result = self.movement_service.register_out(body)
        return {"success": True, "message": "Salida registrada", "data": result}
