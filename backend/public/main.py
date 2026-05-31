import json
import inspect
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from config import env
from middlewares.cors_middleware import apply_cors_headers
from routes import get_all_routes
from utils.errors import AppError
from utils.response import error, to_json_bytes
from utils.router import find_route

ROUTES = get_all_routes()


class AppHandler(BaseHTTPRequestHandler):
    def log_message(self, _format, *_args):
        return

    def _send_json(self, status, payload):
        body = to_json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        apply_cors_headers(self)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        if not raw.strip():
            return {}
        return json.loads(raw)

    def _dispatch(self, method):
        route, params = find_route(method, self.path, ROUTES)
        if route is None:
            status, payload = error("Ruta no encontrada", code="ROUTE_NOT_FOUND", status=404)
            self._send_json(status, payload)
            return

        body = None
        if method in {"POST", "PUT", "PATCH"}:
            try:
                body = self._read_json_body()
            except json.JSONDecodeError:
                status, payload = error("JSON inválido", code="INVALID_JSON", status=400)
                self._send_json(status, payload)
                return

        try:
            handler_kwargs = {"params": params, "body": body}
            if "handler" in inspect.signature(route.handler).parameters:
                handler_kwargs["handler"] = self
            result = route.handler(**handler_kwargs)
            status = 201 if method == "POST" else 200
            self._send_json(status, result)
        except AppError as exc:
            status, payload = error(exc.message, code=exc.code, details=exc.details, status=exc.status)
            self._send_json(status, payload)
        except RuntimeError as exc:
            status, payload = error(str(exc), code="CONFIG_ERROR", status=500)
            self._send_json(status, payload)
        except Exception:
            status, payload = error("Error interno del servidor", code="INTERNAL_ERROR", status=500)
            self._send_json(status, payload)

    def do_OPTIONS(self):
        self.send_response(204)
        apply_cors_headers(self)
        self.end_headers()

    def do_GET(self):
        self._dispatch("GET")

    def do_POST(self):
        self._dispatch("POST")

    def do_PUT(self):
        self._dispatch("PUT")

    def do_PATCH(self):
        self._dispatch("PATCH")

    def do_DELETE(self):
        self._dispatch("DELETE")


def run_server():
    host = "0.0.0.0"
    port = env.PORT
    server = HTTPServer((host, port), AppHandler)
    print(f"InventoryPro API: http://localhost:{port}")
    print(f"CORS permitido para: {env.FRONTEND_ORIGIN}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
