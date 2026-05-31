from pathlib import Path

_db = None


def get_db():
    global _db
    if _db is not None:
        return _db

    import firebase_admin
    from firebase_admin import credentials, firestore

    from config import env

    cred_path = env.FIREBASE_CREDENTIALS_PATH
    if not cred_path or not Path(cred_path).is_file():
        raise RuntimeError("Falta FIREBASE_CREDENTIALS_PATH en backend/.env")

    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    _db = firestore.client()
    return _db
