# InventoryPro

Sistema de control de inventario — proyecto fullstack.

## Stack

- Backend: Python (`http.server`) + Firestore
- Frontend: React + Vite + React Router

## Estructura

```
backend/
  public/main.py
  src/
    config/
    controllers/
    services/
    repositories/
    routes/
    schemas/
    middlewares/
    utils/
frontend/
  src/
```

## Instalación

### Backend

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env
python public/main.py
```

Configura `FIREBASE_CREDENTIALS_PATH` en `backend/.env` con la ruta al JSON de Firebase.

Servidor: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

App: `http://localhost:5173`

## Endpoints

| Método | Ruta |
|--------|------|
| GET | `/api/health` |
| GET | `/api/dashboard/summary` |
| GET/POST | `/api/categories` |
| PUT/DELETE | `/api/categories/:id` |
| GET/POST | `/api/suppliers` |
| PUT/DELETE | `/api/suppliers/:id` |
| GET/POST | `/api/products` |
| PUT | `/api/products/:id` |
| PATCH | `/api/products/:id/status` |
| DELETE | `/api/products/:id` |
| GET/POST | `/api/warehouses` |
| PUT | `/api/warehouses/:id` |
| PATCH | `/api/warehouses/:id/status` |
| DELETE | `/api/warehouses/:id` |
