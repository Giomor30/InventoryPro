from utils.router import Route


def health_routes():
    def health(params=None, body=None, handler=None):
        return {
            "success": True,
            "message": "Backend InventoryPro funcionando correctamente",
            "data": {
                "status": "ok",
                "project": "InventoryPro",
                "backend": "Python sin framework",
            },
        }

    return [
        Route("GET", "/api/health", health),
    ] 