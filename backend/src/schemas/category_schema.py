def validate_category(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 50:
        errors.append("El nombre no puede tener más de 50 caracteres")

    description = data.get("description")
    if description is not None and len(str(description).strip()) > 200:
        errors.append("La descripción no puede tener más de 200 caracteres")

    return errors
