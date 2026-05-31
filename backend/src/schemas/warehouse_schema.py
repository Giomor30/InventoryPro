from schemas.validators import as_number, is_blank, validate_text


def validate_warehouse(data):
    errors = []
    data = data or {}

    validate_text(errors, data, "name", "El nombre", max_length=100)
    validate_text(errors, data, "code", "El código", max_length=30)
    validate_text(errors, data, "location", "La ubicación", required=False, max_length=200)
    validate_text(errors, data, "manager", "El encargado", required=False, max_length=100)

    capacity = data.get("capacity")
    if not is_blank(capacity):
        as_number(capacity, "capacidad", errors, minimum=0)

    return errors
