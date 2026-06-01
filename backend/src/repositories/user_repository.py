from repositories.firestore_base import FirestoreRepository
from utils.errors import AppError


class UserRepository(FirestoreRepository):
    def __init__(self):
        super().__init__("users")

    def find_by_email(self, email: str):
        docs = list(self._collection().where("email", "==", email.strip().lower()).limit(1).stream())
        if not docs:
            return None
        return self._to_dict(docs[0])

    def save(self, data: dict):
        # Normaliza email antes de guardar
        if "email" in data:
            data["email"] = data["email"].strip().lower()
        # Asegura rol por defecto
        data.setdefault("role", "Consulta")
        return super().save(data)

    def email_exists(self, email: str) -> bool:
        return self.find_by_email(email) is not None

    def admin_exists(self) -> bool:
        for role_name in ("Admin", "Administrador"):
            docs = list(self._collection().where("role", "==", role_name).limit(1).stream())
            if docs:
                return True
        return False
