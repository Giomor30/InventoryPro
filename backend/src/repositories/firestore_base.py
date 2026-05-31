from datetime import datetime, timezone

from utils.errors import AppError


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _serialize(value):
    if value is None:
        return None
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            return str(value)
    if isinstance(value, dict):
        return {k: _serialize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_serialize(v) for v in value]
    return value


class FirestoreRepository:
    def __init__(self, collection_name):
        self.collection_name = collection_name

    def _collection(self):
        from db.firestore import get_db

        return get_db().collection(self.collection_name)

    def _to_dict(self, doc):
        data = doc.to_dict() or {}
        data["id"] = doc.id
        return _serialize(data)

    def find_all(self):
        return [self._to_dict(doc) for doc in self._collection().stream()]

    def find_by_id(self, doc_id):
        doc = self._collection().document(doc_id).get()
        if not doc.exists:
            raise AppError("Registro no encontrado", code="NOT_FOUND", status=404)
        return self._to_dict(doc)

    def save(self, data):
        payload = {k: v for k, v in data.items() if k != "id"}
        payload.setdefault("status", "activo")
        payload["created_at"] = _now_iso()
        payload["updated_at"] = _now_iso()
        ref = self._collection().document()
        ref.set(payload)
        return self._to_dict(ref.get())

    def update(self, doc_id, data):
        ref = self._collection().document(doc_id)
        if not ref.get().exists:
            raise AppError("Registro no encontrado", code="NOT_FOUND", status=404)
        payload = {k: v for k, v in data.items() if k != "id"}
        payload["updated_at"] = _now_iso()
        ref.update(payload)
        return self._to_dict(ref.get())

    def update_status(self, doc_id, status):
        return self.update(doc_id, {"status": status})

    def delete(self, doc_id):
        ref = self._collection().document(doc_id)
        if not ref.get().exists:
            raise AppError("Registro no encontrado", code="NOT_FOUND", status=404)
        ref.delete()
        return True
