def validate_warehouse(data):
    errors = []
    data = data or {}

    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("El nombre es obligatorio")
    elif len(str(name).strip()) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    location = data.get("location")
    if location is not None and len(str(location).strip()) > 200:
        errors.append("La ubicación no puede tener más de 200 caracteres")

    capacity = data.get("capacity")
    if capacity is not None:
        try:
            cap = float(capacity)
            if cap < 0:
                errors.append("La capacidad no puede ser negativa")
        except (TypeError, ValueError):
            errors.append("La capacidad debe ser un número")

    return errors
