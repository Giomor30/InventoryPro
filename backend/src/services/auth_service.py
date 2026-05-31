from repositories.user_repository import UserRepository
from schemas.auth_schema import validate_login, validate_register
from utils.errors import AppError
from utils.jwt_helper import create_access_token, create_refresh_token, decode_token
from utils.password_helper import hash_password, verify_password


def _safe_user(user: dict) -> dict:
    """Devuelve el usuario sin el campo password_hash."""
    return {k: v for k, v in user.items() if k != "password_hash"}


class AuthService:
    def __init__(self):
        self.repo = UserRepository()

    def register(self, data: dict) -> dict:
        errors = validate_register(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        email = data["email"].strip().lower()
        if self.repo.email_exists(email):
            raise AppError("El correo ya está registrado", code="EMAIL_TAKEN", status=409)

        payload = {
            "name": str(data["name"]).strip(),
            "email": email,
            "password_hash": hash_password(str(data["password"])),
            "role": str(data.get("role", "Consulta")),
        }
        user = self.repo.save(payload)
        return _safe_user(user)

    def login(self, data: dict) -> dict:
        errors = validate_login(data)
        if errors:
            raise AppError("Datos inválidos", code="VALIDATION_ERROR", status=422, details=errors)

        email = data["email"].strip().lower()
        user = self.repo.find_by_email(email)

        if not user or not verify_password(str(data["password"]), user.get("password_hash", "")):
            raise AppError("Credenciales incorrectas", code="INVALID_CREDENTIALS", status=401)

        if user.get("status") == "inactivo":
            raise AppError("Usuario desactivado", code="USER_INACTIVE", status=403)

        token_payload = {"sub": user["id"], "role": user["role"], "email": user["email"]}
        return {
            "access_token": create_access_token(token_payload),
            "refresh_token": create_refresh_token(token_payload),
            "user": _safe_user(user),
        }

    def refresh(self, data: dict) -> dict:
        token = (data or {}).get("refresh_token")
        if not token:
            raise AppError("refresh_token es requerido", code="VALIDATION_ERROR", status=422)

        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise AppError("Token inválido", code="TOKEN_INVALID", status=401)

        user = self.repo.find_by_id(payload["sub"])
        if user.get("status") == "inactivo":
            raise AppError("Usuario desactivado", code="USER_INACTIVE", status=403)

        token_payload = {"sub": user["id"], "role": user["role"], "email": user["email"]}
        return {"access_token": create_access_token(token_payload)}

    def me(self, user_id: str) -> dict:
        return _safe_user(self.repo.find_by_id(user_id))
