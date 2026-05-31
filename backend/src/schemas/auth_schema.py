import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validate_identity_fields(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 100:
        errors.append("El nombre no puede tener mas de 100 caracteres")

    email = data.get("email")
    if not email or not str(email).strip():
        errors.append("El correo es obligatorio")
    elif not EMAIL_RE.match(str(email).strip()):
        errors.append("El correo no tiene un formato valido")

    password = data.get("password")
    if not password:
        errors.append("La contrasena es obligatoria")
    elif len(str(password)) < 8:
        errors.append("La contrasena debe tener al menos 8 caracteres")

    return errors


def validate_register(data):
    errors = _validate_identity_fields(data)
    data = data or {}

    # Registro publico: no permite escalar rol.
    role = data.get("role")
    if role is not None and str(role) != "Consulta":
        errors.append("El registro publico solo permite rol Consulta")

    return errors


def validate_bootstrap_admin(data):
    errors = _validate_identity_fields(data)
    data = data or {}

    role = data.get("role")
    if role is not None and str(role) != "Admin":
        errors.append("Este endpoint solo permite crear rol Admin")

    return errors


def validate_login(data):
    errors = []
    data = data or {}

    if not data.get("email") or not str(data["email"]).strip():
        errors.append("El correo es obligatorio")

    if not data.get("password"):
        errors.append("La contrasena es obligatoria")

    return errors
