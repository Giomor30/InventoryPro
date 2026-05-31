from controllers.dashboard_controller import DashboardController
from utils.router import Route

_controller = DashboardController()


def dashboard_routes():
    return [
        Route("GET", "/api/dashboard/summary", _controller.summary),
    ] 