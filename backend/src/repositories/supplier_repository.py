from repositories.firestore_base import FirestoreRepository


class SupplierRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("suppliers")
