import re
import unicodedata

CANONICAL_ROLES = {"Admin", "Almacen", "Compras", "Consulta"}


def _compact_text(value) -> str:
    normalized = unicodedata.normalize("NFKD", str(value))
    without_marks = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    return re.sub(r"[^a-z]", "", without_marks.lower())


def normalize_role(role):
    if role is None:
        return None

    compact = _compact_text(role)
    if compact in {"admin", "administrador"}:
        return "Admin"
    if compact.startswith("almac"):
        return "Almacen"
    if compact.startswith("compr"):
        return "Compras"
    if compact.startswith("consult"):
        return "Consulta"

    return str(role).strip()
