from routes.auth_routes import auth_routes
from routes.category_routes import category_routes
from routes.health_routes import health_routes
from routes.product_routes import product_routes
from routes.supplier_routes import supplier_routes
from routes.user_routes import user_routes


def get_all_routes():
    routes = []
    for register in (
        health_routes,
        auth_routes,
        user_routes,
        category_routes,
        supplier_routes,
        product_routes,
    ):
        routes.extend(register())
    return routes
