from repositories.movement_repository import MovementRepository
from repositories.product_repository import ProductRepository
from repositories.stock_repository import StockRepository
from repositories.warehouse_repository import WarehouseRepository
from schemas.movement_schema import validate_movement
from schemas.stock_schema import validate_movement_list_query
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

    def _current_quantity(self, product_id, warehouse_id):
        row = self.stock.find_by_product_and_warehouse(product_id, warehouse_id)
        return float(row.get("quantity") or 0)

    def register_in(self, data):
        payload, product, warehouse = self._validate_movement_data(data, "in")
        stock_before = self._current_quantity(payload["product_id"], payload["warehouse_id"])
        stock_after = stock_before + payload["quantity"]

        movement = self.movements.save_movement({
            "type": "in",
            "product_id": payload["product_id"],
            "warehouse_id": payload["warehouse_id"],
            "quantity": payload["quantity"],
            "reason": payload["reason"],
            "reference": payload["reference"],
            "stock_before": stock_before,
            "stock_after": stock_after,
            "product_name": product.get("name"),
            "warehouse_name": warehouse.get("name"),
        })
        stock_row = self.stock.set_quantity(
            payload["product_id"],
            payload["warehouse_id"],
            stock_after,
        )
        return {"movement": movement, "stock": stock_row}

    def register_out(self, data):
        payload, product, warehouse = self._validate_movement_data(data, "out")
        stock_before = self._current_quantity(payload["product_id"], payload["warehouse_id"])
        stock_after = stock_before - payload["quantity"]

        if stock_after < 0:
            raise AppError(
                "Stock insuficiente para esta salida",
                code="INSUFFICIENT_STOCK",
                status=422,
                details=[f"Disponible: {stock_before}, solicitado: {payload['quantity']}"],
            )

        movement = self.movements.save_movement({
            "type": "out",
            "product_id": payload["product_id"],
            "warehouse_id": payload["warehouse_id"],
            "quantity": payload["quantity"],
            "reason": payload["reason"],
            "reference": payload["reference"],
            "stock_before": stock_before,
            "stock_after": stock_after,
            "product_name": product.get("name"),
            "warehouse_name": warehouse.get("name"),
        })
        stock_row = self.stock.set_quantity(
            payload["product_id"],
            payload["warehouse_id"],
            stock_after,
        )
        return {"movement": movement, "stock": stock_row}

    def list_movements(self, filters=None):
        filters = filters or {}
        errors = validate_movement_list_query(filters)
        if errors:
            raise AppError("Parámetros inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        product_id = (filters.get("product_id") or "").strip() or None
        warehouse_id = (filters.get("warehouse_id") or "").strip() or None
        movement_type = (filters.get("type") or "").strip() or None

        return self.movements.find_filtered(
            product_id=product_id,
            warehouse_id=warehouse_id,
            movement_type=movement_type,
        )
