def validate_supplier(data):
    errors = []
    data = data or {}

    if not data.get("name"):
        errors.append("El nombre es obligatorio")
    elif len(str(data["name"])) > 100:
        errors.append("El nombre no puede tener más de 100 caracteres")

    if not data.get("contact_email"):
        errors.append("El correo de contacto es obligatorio")

    if data.get("phone") and len(str(data["phone"])) > 20:
        errors.append("El teléfono no puede tener más de 20 caracteres")

    return errors
