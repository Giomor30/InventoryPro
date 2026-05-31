import os
from pathlib import Path

from dotenv import load_dotenv

_backend_dir = Path(__file__).resolve().parents[2]
load_dotenv(_backend_dir / ".env")

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173").strip()
PORT = int(os.environ.get("PORT", "8000"))
FIREBASE_CREDENTIALS_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH", "").strip()

JWT_SECRET = os.environ.get("JWT_SECRET", "cambia_esto_en_produccion").strip()
JWT_ACCESS_EXPIRES_MINUTES = int(os.environ.get("JWT_ACCESS_EXPIRES_MINUTES", "60"))
JWT_REFRESH_EXPIRES_DAYS = int(os.environ.get("JWT_REFRESH_EXPIRES_DAYS", "7"))
