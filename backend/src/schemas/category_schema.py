def validate_category(data):
    errors = []
    data = data or {}

    if not data.get("name"):
        errors.append("El nombre es obligatorio")
    elif len(str(data["name"])) > 50:
        errors.append("El nombre no puede tener más de 50 caracteres")

    if data.get("description") and len(str(data["description"])) > 200:
        errors.append("La descripción no puede tener más de 200 caracteres")

    return errors
