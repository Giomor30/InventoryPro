from schemas.validators import as_number, is_blank, validate_text

MOVEMENT_TYPES = {"in", "out"}


def validate_movement(data, movement_type):
    """Valida cuerpo para entrada (in) o salida (out) de inventario."""
    errors = []
    data = data or {}

    if movement_type not in MOVEMENT_TYPES:
        errors.append("Tipo de movimiento no válido")
        return errors

    validate_text(errors, data, "product_id", "El producto", max_length=120)
    validate_text(errors, data, "warehouse_id", "El almacén", max_length=120)

    quantity = as_number(data.get("quantity"), "cantidad", errors, minimum=0.01)
    if quantity is not None and quantity <= 0:
        errors.append("La cantidad debe ser mayor que cero")

    reason = data.get("reason")
    if reason is not None and not is_blank(reason):
        if len(str(reason).strip()) > 300:
            errors.append("El motivo no puede tener más de 300 caracteres")

    reference = data.get("reference")
    if reference is not None and not is_blank(reference):
        if len(str(reference).strip()) > 100:
            errors.append("La referencia no puede tener más de 100 caracteres")

    return errors
