import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_supplier(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    email = data.get("contact_email")
    if not email or not str(email).strip():
        errors.append("El correo de contacto es obligatorio")
    elif not EMAIL_RE.match(str(email).strip()):
        errors.append("El correo de contacto no tiene un formato válido")

    phone = data.get("phone")
    if phone is not None and str(phone).strip():
        phone_str = str(phone).strip()
        if len(phone_str) > 20:
            errors.append("El teléfono no puede tener más de 20 caracteres")
        if not re.match(r"^[\d\s\+\-\(\)]+$", phone_str):
            errors.append("El teléfono solo puede contener dígitos, espacios y los caracteres + - ( )")

    return errors
