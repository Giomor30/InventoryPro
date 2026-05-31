from repositories.movement_repository import MovementRepository
from repositories.product_repository import ProductRepository
from repositories.stock_repository import StockRepository
from repositories.warehouse_repository import WarehouseRepository
from schemas.movement_schema import validate_movement
from utils.errors import AppError


class MovementService:
    def __init__(self):
        self.movements = MovementRepository()
        self.stock = StockRepository()
        self.products = ProductRepository()
        self.warehouses = WarehouseRepository()

    def _normalize_payload(self, data):
        data = data or {}
        return {
            "product_id": str(data.get("product_id", "")).strip(),
            "warehouse_id": str(data.get("warehouse_id", "")).strip(),
            "quantity": float(data.get("quantity")),
            "reason": str(data.get("reason", "")).strip() or None,
            "reference": str(data.get("reference", "")).strip() or None,
        }

    def _validate_movement_data(self, data, movement_type):
        errors = validate_movement(data, movement_type)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        payload = self._normalize_payload(data)
        product = self._assert_active_product(payload["product_id"])
        warehouse = self._assert_active_warehouse(payload["warehouse_id"])
        return payload, product, warehouse

    def _assert_active_product(self, product_id):
        product = self.products.find_by_id(product_id)
        if product.get("status") == "inactivo":
            raise AppError("El producto está inactivo", code="PRODUCT_INACTIVE", status=422)
        return product

    def _assert_active_warehouse(self, warehouse_id):
        warehouse = self.warehouses.find_by_id(warehouse_id)
        if warehouse.get("status") == "inactivo":
            raise AppError("El almacén está inactivo", code="WAREHOUSE_INACTIVE", status=422)
        return warehouse
