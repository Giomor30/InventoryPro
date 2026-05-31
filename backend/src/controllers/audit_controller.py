from urllib.parse import parse_qs, urlparse

from services.audit_service import AuditService


def _query_params(handler):
    if handler is None:
        return {}

    parsed = urlparse(handler.path)
    raw = parse_qs(parsed.query)

    return {key: values[0] for key, values in raw.items() if values}


class AuditController:
    def __init__(self):
        self.audit_service = AuditService()

    def list_audit(self, params=None, body=None, handler=None):
        filters = _query_params(handler)
        data = self.audit_service.list_events(filters)

        return {
            "success": True,
            "message": "Auditoría obtenida correctamente",
            "data": data,
        }

    def create_audit(self, params=None, body=None, handler=None):
        data = self.audit_service.create_event(body)

        return {
            "success": True,
            "message": "Evento de auditoría registrado correctamente",
            "data": data,
        }  