from config import env
from repositories.user_repository import UserRepository
from schemas.auth_schema import validate_bootstrap_admin, validate_login, validate_register
from utils.errors import AppError
from utils.jwt_helper import create_access_token, create_refresh_token, decode_token
from utils.password_helper import hash_password, verify_password
from utils.role_helper import normalize_role


def _safe_user(user: dict) -> dict:
    """Devuelve el usuario sin el campo password_hash."""
    return {k: v for k, v in user.items() if k != "password_hash"}


class AuthService:
    def __init__(self):
        self.repo = UserRepository()

    def register(self, data: dict, caller_role: str = None) -> dict:
        """
        Registra un nuevo usuario.
        Si caller_role == 'Admin', respeta el rol enviado en data.
        De lo contrario, fuerza rol 'Consulta'.
        """
        can_assign_role = caller_role == "Admin"
        errors = validate_register(data, allow_role_assignment=can_assign_role)
        if errors:
            raise AppError("Datos invalidos", code="VALIDATION_ERROR", status=422, details=errors)

        email = data["email"].strip().lower()
        if self.repo.email_exists(email):
            raise AppError("El correo ya esta registrado", code="EMAIL_TAKEN", status=409)

        if can_assign_role and data.get("role"):
            role = normalize_role(data["role"]) or "Consulta"
        else:
            role = "Consulta"

        payload = {
            "name": str(data["name"]).strip(),
            "email": email,
            "password_hash": hash_password(str(data["password"])),
            "role": role,
            "status": "activo",
        }
        user = self.repo.save(payload)
        return _safe_user(user)

    def bootstrap_admin(self, data: dict, setup_key: str) -> dict:
        errors = validate_bootstrap_admin(data)
        if errors:
            raise AppError("Datos invalidos", code="VALIDATION_ERROR", status=422, details=errors)

        expected_setup_key = env.ADMIN_SETUP_KEY
        if not expected_setup_key:
            raise AppError(
                "ADMIN_SETUP_KEY no esta configurada en el backend",
                code="CONFIG_ERROR",
                status=500,
            )

        if setup_key != expected_setup_key:
            raise AppError("Llave de bootstrap invalida", code="FORBIDDEN", status=403)

        if self.repo.admin_exists():
            raise AppError("Ya existe un usuario Admin", code="ADMIN_EXISTS", status=409)

        email = data["email"].strip().lower()
        if self.repo.email_exists(email):
            raise AppError("El correo ya esta registrado", code="EMAIL_TAKEN", status=409)

        payload = {
            "name": str(data["name"]).strip(),
            "email": email,
            "password_hash": hash_password(str(data["password"])),
            "role": "Admin",
            "status": "activo",
        }
        user = self.repo.save(payload)
        return _safe_user(user)

    def login(self, data: dict) -> dict:
        errors = validate_login(data)
        if errors:
            raise AppError("Datos invalidos", code="VALIDATION_ERROR", status=422, details=errors)

        email = data["email"].strip().lower()
        user = self.repo.find_by_email(email)

        if not user or not verify_password(str(data["password"]), user.get("password_hash", "")):
            raise AppError("Credenciales incorrectas", code="INVALID_CREDENTIALS", status=401)

        if user.get("status") == "inactivo":
            raise AppError("Cuenta inactiva", code="ACCOUNT_INACTIVE", status=403)

        role = normalize_role(user.get("role")) or "Consulta"
        access_token = create_access_token({"sub": user["id"], "role": role})
        refresh_token = create_refresh_token({"sub": user["id"], "role": role})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": _safe_user(user),
        }

    def refresh(self, data: dict) -> dict:
        token = (data or {}).get("refresh_token", "")
        if not token:
            raise AppError("refresh_token requerido", code="TOKEN_MISSING", status=400)

        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise AppError("Token invalido", code="TOKEN_INVALID", status=401)

        user = self.repo.find_by_id(payload["sub"])
        if not user:
            raise AppError("Usuario no encontrado", code="NOT_FOUND", status=404)

        role = normalize_role(user.get("role")) or "Consulta"
        access_token = create_access_token({"sub": user["id"], "role": role})
        return {"access_token": access_token}

    def me(self, user_id: str) -> dict:
        user = self.repo.find_by_id(user_id)
        return _safe_user(user)
