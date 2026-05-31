from datetime import datetime, timezone

from repositories.firestore_base import FirestoreRepository


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


class AuditRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("audit")

    def save_event(self, data):
        payload = {
            "action": data.get("action"),
            "module": data.get("module"),
            "description": data.get("description"),
            "user_id": data.get("user_id"),
            "user_email": data.get("user_email"),
            "metadata": data.get("metadata") or {},
            "created_at": _now_iso(),
        }

        ref = self._collection().document()
        ref.set(payload)
        return self._to_dict(ref.get())

    def find_filtered(self, module=None, action=None):
        items = self.find_all()

        if module:
            items = [item for item in items if item.get("module") == module]

        if action:
            items = [item for item in items if item.get("action") == action]

        items.sort(key=lambda item: item.get("created_at") or "", reverse=True)
        return items 