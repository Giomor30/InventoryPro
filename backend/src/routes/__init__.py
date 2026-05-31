from routes.category_routes import category_routes
from routes.health_routes import health_routes
from routes.product_routes import product_routes
from routes.supplier_routes import supplier_routes
from routes.warehouse_routes import warehouse_routes


def get_all_routes():
    routes = []
    for register in (health_routes, category_routes, supplier_routes, product_routes, warehouse_routes):
        routes.extend(register())
    return routes
