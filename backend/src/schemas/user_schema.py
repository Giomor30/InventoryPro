import re

from utils.role_helper import CANONICAL_ROLES, normalize_role

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_user_update(data):
    """Validacion para actualizar un usuario."""
    errors = []
    data = data or {}

    name = data.get("name")
    if name is not None:
        if not str(name).strip():
            errors.append("El nombre no puede estar vacio")
        elif len(str(name).strip()) > 100:
            errors.append("El nombre no puede tener mas de 100 caracteres")

    email = data.get("email")
    if email is not None:
        if not str(email).strip():
            errors.append("El correo no puede estar vacio")
        elif not EMAIL_RE.match(str(email).strip()):
            errors.append("El correo no tiene un formato valido")

    role = data.get("role")
    if role is not None and normalize_role(role) not in CANONICAL_ROLES:
        errors.append(f"El rol debe ser uno de: {', '.join(sorted(CANONICAL_ROLES))}")

    password = data.get("password")
    if password is not None and len(str(password)) < 8:
        errors.append("La contrasena debe tener al menos 8 caracteres")

    return errors
