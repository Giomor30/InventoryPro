from controllers.report_controller import ReportController
from utils.router import Route

_controller = ReportController()


def report_routes():
    return [
        Route("GET", "/api/reports/inventory-summary", _controller.inventory_summary),
    ] 