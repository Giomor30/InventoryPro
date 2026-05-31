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

    if data.get("phone") and len(str(data["phone"])) > 20:
        errors.append("El teléfono no puede tener más de 20 caracteres")

    return errors
