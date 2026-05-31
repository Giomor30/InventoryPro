from datetime import datetime, timezone

from repositories.firestore_base import FirestoreRepository
from utils.errors import AppError


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


class StockRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("inventory_stock")

    def _stock_key(self, product_id, warehouse_id):
        return f"{product_id}__{warehouse_id}"

    def find_by_product_and_warehouse(self, product_id, warehouse_id):
        doc_id = self._stock_key(product_id, warehouse_id)
        ref = self._collection().document(doc_id)
        doc = ref.get()
        if not doc.exists:
            return {
                "id": doc_id,
                "product_id": product_id,
                "warehouse_id": warehouse_id,
                "quantity": 0,
            }
        return self._to_dict(doc)

    def find_filtered(self, product_id=None, warehouse_id=None):
        items = self.find_all()

        if product_id:
            items = [s for s in items if s.get("product_id") == product_id]
        if warehouse_id:
            items = [s for s in items if s.get("warehouse_id") == warehouse_id]

        return items

    def set_quantity(self, product_id, warehouse_id, quantity):
        if quantity < 0:
            raise AppError("El stock no puede ser negativo", code="NEGATIVE_STOCK", status=422)

        doc_id = self._stock_key(product_id, warehouse_id)
        ref = self._collection().document(doc_id)
        payload = {
            "product_id": product_id,
            "warehouse_id": warehouse_id,
            "quantity": float(quantity),
            "updated_at": _now_iso(),
        }

        if ref.get().exists:
            ref.update(payload)
        else:
            payload["created_at"] = _now_iso()
            ref.set(payload)

        return self._to_dict(ref.get())
