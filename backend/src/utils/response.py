import json


def success(message="Operación realizada correctamente", data=None, status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return status, payload


def error(message, code="APP_ERROR", details=None, status=400):
    return status, {
        "success": False,
        "message": message,
        "error": {"code": code, "details": details or []},
    }


def to_json_bytes(payload):
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")
