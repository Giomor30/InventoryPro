from repositories.category_repository import CategoryRepository
from repositories.movement_repository import MovementRepository
from repositories.product_repository import ProductRepository
from repositories.stock_repository import StockRepository
from repositories.supplier_repository import SupplierRepository
from repositories.warehouse_repository import WarehouseRepository


class DashboardController:
    def summary(self, params=None, body=None, handler=None):
        products = ProductRepository().find_all()
        categories = CategoryRepository().find_all()
        suppliers = SupplierRepository().find_all()
        warehouses = WarehouseRepository().find_all()
        stock_items = StockRepository().find_all()
        movements = MovementRepository().find_all()

        active_products = [
            product for product in products
            if product.get("status") != "inactivo"
        ]

        total_stock = sum(float(item.get("quantity") or 0) for item in stock_items)

        entries = [
            movement for movement in movements
            if movement.get("type") == "in"
        ]

        outputs = [
            movement for movement in movements
            if movement.get("type") == "out"
        ]

        low_stock = [
            item for item in stock_items
            if float(item.get("quantity") or 0) <= 5
        ]

        data = {
            "products": len(active_products),
            "categories": len(categories),
            "suppliers": len(suppliers),
            "warehouses": len(warehouses),
            "total_stock": total_stock,
            "movements": len(movements),
            "entries": len(entries),
            "outputs": len(outputs),
            "low_stock": len(low_stock),
        }

        return {
            "success": True,
            "message": "Resumen del dashboard obtenido correctamente",
            "data": data,
        } 