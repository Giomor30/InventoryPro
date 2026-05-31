from repositories.movement_repository import MovementRepository
from repositories.product_repository import ProductRepository
from repositories.stock_repository import StockRepository
from repositories.warehouse_repository import WarehouseRepository


class ReportService:
    def __init__(self):
        self.products = ProductRepository()
        self.warehouses = WarehouseRepository()
        self.stock = StockRepository()
        self.movements = MovementRepository()

    def inventory_summary(self):
        products = self.products.find_all()
        warehouses = self.warehouses.find_all()
        stock_items = self.stock.find_all()
        movements = self.movements.find_all()

        total_stock = sum(float(item.get("quantity") or 0) for item in stock_items)

        total_entries = sum(
            float(item.get("quantity") or 0)
            for item in movements
            if item.get("type") == "in"
        )

        total_outputs = sum(
            float(item.get("quantity") or 0)
            for item in movements
            if item.get("type") == "out"
        )

        low_stock = [
            item for item in stock_items
            if float(item.get("quantity") or 0) <= 5
        ]

        return {
            "total_products": len(products),
            "total_warehouses": len(warehouses),
            "total_stock": total_stock,
            "total_entries": total_entries,
            "total_outputs": total_outputs,
            "low_stock_count": len(low_stock),
            "low_stock": low_stock,
            "movements_count": len(movements),
        } 