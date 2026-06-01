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

        product_names = {
            product.get("id"): product.get("name", "Sin nombre")
            for product in products
        }

        warehouse_names = {
            warehouse.get("id"): warehouse.get("name", "Sin nombre")
            for warehouse in warehouses
        }

        enriched_stock = []

        for item in stock_items:
            product_id = item.get("product_id")
            warehouse_id = item.get("warehouse_id")
            quantity = float(item.get("quantity") or 0)

            enriched_stock.append({
                **item,
                "product_name": product_names.get(product_id, "Producto no encontrado"),
                "warehouse_name": warehouse_names.get(warehouse_id, "Almacén no encontrado"),
                "quantity": quantity,
            })

        total_stock = sum(item.get("quantity", 0) for item in enriched_stock)

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
            item for item in enriched_stock
            if float(item.get("quantity") or 0) <= 5
        ]

        return {
            "total_products": len(products),
            "total_warehouses": len(warehouses),
            "total_stock": round(total_stock, 2),
            "total_entries": round(total_entries, 2),
            "total_outputs": round(total_outputs, 2),
            "low_stock_count": len(low_stock),
            "low_stock": low_stock,
            "movements_count": len(movements),
        } 