from datetime import datetime, timezone

from repositories.firestore_base import FirestoreRepository


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


class MovementRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("inventory_movements")

    def save_movement(self, data):
        payload = {k: v for k, v in data.items() if k != "id"}
        payload["created_at"] = _now_iso()
        ref = self._collection().document()
        ref.set(payload)
        return self._to_dict(ref.get())

    def find_filtered(self, product_id=None, warehouse_id=None, movement_type=None):
        items = self.find_all()

        if product_id:
            items = [m for m in items if m.get("product_id") == product_id]
        if warehouse_id:
            items = [m for m in items if m.get("warehouse_id") == warehouse_id]
        if movement_type:
            items = [m for m in items if m.get("type") == movement_type]

        items.sort(key=lambda m: m.get("created_at") or "", reverse=True)
        return items
