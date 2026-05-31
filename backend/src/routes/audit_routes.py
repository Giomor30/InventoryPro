from controllers.audit_controller import AuditController
from utils.router import Route

_controller = AuditController()


def audit_routes():
    return [
        Route("GET", "/api/audit", _controller.list_audit),
        Route("POST", "/api/audit", _controller.create_audit),
    ]