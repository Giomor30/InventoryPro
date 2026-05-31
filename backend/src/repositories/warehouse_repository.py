from repositories.firestore_base import FirestoreRepository


class WarehouseRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("warehouses")
