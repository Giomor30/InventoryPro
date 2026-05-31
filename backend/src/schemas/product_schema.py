from schemas.validators import as_number, is_blank, validate_text


ALLOWED_STATUSES = {"activo", "inactivo"}


def validate_product(data):
    errors = []
    data = data or {}

    validate_text(errors, data, "name", "El nombre", max_length=100)
    validate_text(errors, data, "category_id", "La categoría", max_length=120)

    if not is_blank(data.get("supplier_id")):
        validate_text(errors, data, "supplier_id", "El proveedor", required=False, max_length=120)

    as_number(data.get("price"), "precio", errors, minimum=0)

    if not is_blank(data.get("stock")):
        as_number(data.get("stock"), "stock", errors, minimum=0)

    if not is_blank(data.get("min_stock")):
        as_number(data.get("min_stock"), "stock mínimo", errors, minimum=0)

    return errors


def validate_status(data):
    errors = []
    data = data or {}

    status = data.get("status")
    if not status or not str(status).strip():
        errors.append("El campo status es requerido")
    elif str(status).strip() not in ALLOWED_STATUSES:
        errors.append(f"El status debe ser uno de: {', '.join(sorted(ALLOWED_STATUSES))}")

    return errors
