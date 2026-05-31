import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

ALLOWED_ROLES = {"Admin", "Almacén", "Compras", "Consulta"}


def validate_register(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    email = data.get("email")
    if not email or not str(email).strip():
        errors.append("El correo es obligatorio")
    elif not EMAIL_RE.match(str(email).strip()):
        errors.append("El correo no tiene un formato válido")

    password = data.get("password")
    if not password:
        errors.append("La contraseña es obligatoria")
    elif len(str(password)) < 8:
        errors.append("La contraseña debe tener al menos 8 caracteres")

    role = data.get("role")
    if role and str(role) not in ALLOWED_ROLES:
        errors.append(f"El rol debe ser uno de: {', '.join(sorted(ALLOWED_ROLES))}")

    return errors


def validate_login(data):
    errors = []
    data = data or {}

    if not data.get("email") or not str(data["email"]).strip():
        errors.append("El correo es obligatorio")

    if not data.get("password"):
        errors.append("La contraseña es obligatoria")

    return errors
