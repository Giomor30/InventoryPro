from repositories.audit_repository import AuditRepository
from utils.errors import AppError


class AuditService:
    def __init__(self):
        self.audit_repository = AuditRepository()

    def create_event(self, data):
        data = data or {}

        if not data.get("action"):
            raise AppError("La acción es obligatoria", code="VALIDATION_ERROR", status=422)

        if not data.get("module"):
            raise AppError("El módulo es obligatorio", code="VALIDATION_ERROR", status=422)

        return self.audit_repository.save_event(data)

    def list_events(self, filters=None):
        filters = filters or {}

        module = (filters.get("module") or "").strip() or None
        action = (filters.get("action") or "").strip() or None

        return self.audit_repository.find_filtered(
            module=module,
            action=action,
        ) 