import re

from schemas.validators import validate_text


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_supplier(data):
    errors = []
    data = data or {}

    validate_text(errors, data, "name", "El nombre", max_length=100)
    validate_text(errors, data, "contact_email", "El correo de contacto", max_length=120)

    email = str(data.get("contact_email") or "").strip()
    if email and not EMAIL_PATTERN.match(email):
        errors.append("El correo de contacto no tiene un formato válido")

    phone = data.get("phone")
    if phone is not None and str(phone).strip():
        phone_str = str(phone).strip()
        if len(phone_str) > 20:
            errors.append("El teléfono no puede tener más de 20 caracteres")
        if not re.match(r"^[\d\s\+\-\(\)]+$", phone_str):
            errors.append("El teléfono solo puede contener dígitos, espacios y los caracteres + - ( )")

    return errors
