ALLOWED_STATUSES = {"activo", "inactivo"}


def _is_number(value):
    try:
        float(value)
        return True
    except (TypeError, ValueError):
        return False


def validate_product(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    price = data.get("price")
    if price is None:
        errors.append("El precio es obligatorio")
    elif not _is_number(price):
        errors.append("El precio debe ser un número")
    elif float(price) < 0:
        errors.append("El precio no puede ser negativo")

    stock = data.get("stock")
    if stock is not None:
        if not _is_number(stock):
            errors.append("El stock debe ser un número")
        elif float(stock) < 0:
            errors.append("El stock no puede ser negativo")

    if not data.get("category_id") or not str(data["category_id"]).strip():
        errors.append("La categoría es obligatoria")

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
