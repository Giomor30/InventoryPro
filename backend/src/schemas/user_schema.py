import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ALLOWED_ROLES = {"Admin", "Almacén", "Compras", "Consulta"}


def validate_user_update(data):
    """Validación para actualizar un usuario (todos los campos opcionales excepto si se envían)."""
    errors = []
    data = data or {}

    name = data.get("name")
    if name is not None:
        if not str(name).strip():
            errors.append("El nombre no puede estar vacío")
        elif len(str(name).strip()) > 100:
            errors.append("El nombre no puede tener más de 100 caracteres")

    email = data.get("email")
    if email is not None:
        if not str(email).strip():
            errors.append("El correo no puede estar vacío")
        elif not EMAIL_RE.match(str(email).strip()):
            errors.append("El correo no tiene un formato válido")

    role = data.get("role")
    if role is not None and str(role) not in ALLOWED_ROLES:
        errors.append(f"El rol debe ser uno de: {', '.join(sorted(ALLOWED_ROLES))}")

    password = data.get("password")
    if password is not None and len(str(password)) < 8:
        errors.append("La contraseña debe tener al menos 8 caracteres")

    return errors
