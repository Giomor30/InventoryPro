from repositories.firestore_base import FirestoreRepository


class ProductRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("products")
