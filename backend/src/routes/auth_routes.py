from controllers.auth_controller import AuthController
from utils.router import Route

_controller = AuthController()


def auth_routes():
    return [
        Route("POST", "/api/auth/register", _controller.register),
        Route("POST", "/api/auth/login", _controller.login),
        Route("POST", "/api/auth/refresh", _controller.refresh),
        Route("GET", "/api/auth/me", _controller.me),
        Route("POST", "/api/auth/logout", _controller.logout),
    ]