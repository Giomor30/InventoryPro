from schemas.validators import as_number, is_blank, validate_text


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
