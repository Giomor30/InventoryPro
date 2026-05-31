from schemas.validators import is_blank, validate_text


def validate_stock_query(params):
    """Valida filtros opcionales para GET /api/inventory/stock."""
    errors = []
    params = params or {}

    product_id = params.get("product_id")
    if product_id is not None and not is_blank(product_id):
        if len(str(product_id).strip()) > 120:
            errors.append("El producto no puede tener más de 120 caracteres")

    warehouse_id = params.get("warehouse_id")
    if warehouse_id is not None and not is_blank(warehouse_id):
        if len(str(warehouse_id).strip()) > 120:
            errors.append("El almacén no puede tener más de 120 caracteres")

    return errors


def validate_movement_list_query(params):
    """Valida filtros opcionales para listar movimientos."""
    errors = []
    params = params or {}

    movement_type = params.get("type")
    if movement_type is not None and not is_blank(movement_type):
        if str(movement_type).strip() not in {"in", "out"}:
            errors.append("El tipo debe ser in o out")

    product_id = params.get("product_id")
    if product_id is not None and not is_blank(product_id):
        if len(str(product_id).strip()) > 120:
            errors.append("El producto no puede tener más de 120 caracteres")

    warehouse_id = params.get("warehouse_id")
    if warehouse_id is not None and not is_blank(warehouse_id):
        if len(str(warehouse_id).strip()) > 120:
            errors.append("El almacén no puede tener más de 120 caracteres")

    return errors
