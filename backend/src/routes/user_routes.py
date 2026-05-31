from controllers.user_controller import UserController
from utils.router import Route

_controller = UserController()


def user_routes():
    return [
        Route("GET",    "/api/users",       _controller.get_all),
        Route("GET",    "/api/users/:id",   _controller.get_one),
        Route("PUT",    "/api/users/:id",   _controller.update),
        Route("DELETE", "/api/users/:id",   _controller.deactivate),
    ]
