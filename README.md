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

Configura en `backend/.env`:

- `FIREBASE_CREDENTIALS_PATH` — ruta al JSON de Firebase
- `JWT_SECRET` — clave larga inventada por el equipo (no subir a Git)

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
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/refresh` |
| GET | `/api/auth/me` |
| POST | `/api/auth/logout` |
| GET/PUT/DELETE | `/api/users` y `/api/users/:id` |
| GET | `/api/inventory/stock` |
| GET | `/api/inventory/movements` |
| POST | `/api/inventory/movements/in` |
| POST | `/api/inventory/movements/out` |

### Inventario

`GET /api/inventory/stock` acepta query opcional: `product_id`, `warehouse_id`.

`GET /api/inventory/movements` acepta query opcional: `type` (`in` o `out`), `product_id`, `warehouse_id`.

Cuerpo para entrada/salida:

```json
{
  "product_id": "id del producto",
  "warehouse_id": "id del almacén",
  "quantity": 10,
  "reason": "Venta mostrador",
  "reference": "F-1024"
}
```

`reason` y `reference` son opcionales. La salida falla si no hay stock suficiente.
