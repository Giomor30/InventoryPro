from utils.router import Route


def health_routes():
    def health(params=None, body=None):
        return {
            "success": True,
            "message": "Backend InventoryPro funcionando correctamente",
            "data": {
                "status": "ok",
                "project": "InventoryPro",
                "backend": "Python sin framework",
            },
        }

    def dashboard(params=None, body=None):
        from repositories.category_repository import CategoryRepository
        from repositories.product_repository import ProductRepository
        from repositories.supplier_repository import SupplierRepository

        products = ProductRepository().find_all()
        active_products = [p for p in products if p.get("status") != "inactivo"]
        total_stock = sum(float(p.get("stock") or 0) for p in active_products)

        return {
            "success": True,
            "message": "Resumen del dashboard obtenido",
            "data": {
                "products": len(active_products),
                "categories": len(CategoryRepository().find_all()),
                "suppliers": len(SupplierRepository().find_all()),
                "total_stock": total_stock,
            },
        }

    return [
        Route("GET", "/api/health", health),
        Route("GET", "/api/dashboard/summary", dashboard),
    ]
