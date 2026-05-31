from repositories.user_repository import UserRepository
from schemas.user_schema import validate_user_update
from utils.errors import AppError
from utils.password_helper import hash_password


def _safe_user(user: dict) -> dict:
    return {k: v for k, v in user.items() if k != "password_hash"}


class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def get_all(self):
        return [_safe_user(u) for u in self.repo.find_all()]

    def get_by_id(self, user_id: str):
        return _safe_user(self.repo.find_by_id(user_id))

    def update(self, user_id: str, data: dict):
        self.repo.find_by_id(user_id)  # 404 si no existe
        errors = validate_user_update(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        payload = {}
        if data.get("name"):
            payload["name"] = str(data["name"]).strip()
        if data.get("email"):
            new_email = str(data["email"]).strip().lower()
            existing = self.repo.find_by_email(new_email)
            if existing and existing["id"] != user_id:
                raise AppError("El correo ya está en uso", code="EMAIL_TAKEN", status=409)
            payload["email"] = new_email
        if data.get("role"):
            payload["role"] = str(data["role"])
        if data.get("password"):
            payload["password_hash"] = hash_password(str(data["password"]))

        return _safe_user(self.repo.update(user_id, payload))

    def deactivate(self, user_id: str):
        self.repo.find_by_id(user_id)
        return _safe_user(self.repo.update_status(user_id, "inactivo"))
