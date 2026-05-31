from repositories.product_repository import ProductRepository
from repositories.stock_repository import StockRepository
from repositories.warehouse_repository import WarehouseRepository
from schemas.stock_schema import validate_stock_query
from utils.errors import AppError


class StockService:
    def __init__(self):
        self.repo = StockRepository()
        self.products = ProductRepository()
        self.warehouses = WarehouseRepository()

    def get_stock(self, filters=None):
        filters = filters or {}
        errors = validate_stock_query(filters)
        if errors:
            raise AppError("Parámetros inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        product_id = (filters.get("product_id") or "").strip() or None
        warehouse_id = (filters.get("warehouse_id") or "").strip() or None

        if product_id and warehouse_id:
            items = [self.repo.find_by_product_and_warehouse(product_id, warehouse_id)]
        else:
            items = self.repo.find_filtered(product_id=product_id, warehouse_id=warehouse_id)

        return [self._enrich_row(item) for item in items]

    def _enrich_row(self, row):
        product_id = row.get("product_id")
        warehouse_id = row.get("warehouse_id")

        product_name = None
        warehouse_name = None

        if product_id:
            try:
                product_name = self.products.find_by_id(product_id).get("name")
            except AppError:
                product_name = None

        if warehouse_id:
            try:
                warehouse_name = self.warehouses.find_by_id(warehouse_id).get("name")
            except AppError:
                warehouse_name = None

        return {
            **row,
            "quantity": float(row.get("quantity") or 0),
            "product_name": product_name,
            "warehouse_name": warehouse_name,
        }
