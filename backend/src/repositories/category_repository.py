from repositories.firestore_base import FirestoreRepository


class CategoryRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("categories")
