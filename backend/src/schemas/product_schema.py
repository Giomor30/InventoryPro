def validate_product(data):
    errors = []
    data = data or {}

    if not data.get("name"):
        errors.append("El nombre es obligatorio")
    elif len(str(data["name"])) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    if data.get("price") is None:
        errors.append("El precio es obligatorio")
    elif float(data["price"]) < 0:
        errors.append("El precio no puede ser negativo")

    if data.get("stock") is not None and float(data["stock"]) < 0:
        errors.append("El stock no puede ser negativo")

    if not data.get("category_id"):
        errors.append("La categoría es obligatoria")

    return errors
