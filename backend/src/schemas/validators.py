def is_blank(value):
    return value is None or str(value).strip() == ""


def as_number(value, field_name, errors, minimum=None):
    if is_blank(value):
        errors.append(f"El campo {field_name} es obligatorio")
        return None

    try:
        number = float(value)
    except (TypeError, ValueError):
        errors.append(f"El campo {field_name} debe ser numérico")
        return None

    if minimum is not None and number < minimum:
        errors.append(f"El campo {field_name} no puede ser menor que {minimum}")

    return number


def validate_text(errors, data, field, label, required=True, max_length=None):
    value = data.get(field)
    if required and is_blank(value):
        errors.append(f"{label} es obligatorio")
        return

    if not is_blank(value) and max_length and len(str(value).strip()) > max_length:
        errors.append(f"{label} no puede tener más de {max_length} caracteres")
