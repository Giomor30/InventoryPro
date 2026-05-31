from schemas.validators import validate_text


def validate_category(data):
    errors = []
    data = data or {}

    validate_text(errors, data, "name", "El nombre", max_length=50)

    description = data.get("description")
    if description is not None and len(str(description).strip()) > 200:
        errors.append("La descripción no puede tener más de 200 caracteres")

    return errors
