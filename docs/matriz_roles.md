# Matriz de permisos (RBAC) - InventoryPro

## Roles

- `Admin`: acceso total, gestion de usuarios y configuracion.
- `Almacen`: operacion de inventario y almacenes.
- `Compras`: catalogos de compra (productos, categorias, proveedores) y entradas.
- `Consulta`: solo lectura.

Nota: en UI se puede mostrar `Almacen` como "Almacen" o "Almacen/Almacén"; internamente backend normaliza variantes al valor canonico `Almacen`.

## Reglas clave

- El registro publico (`/api/auth/register`) siempre crea usuarios `Consulta`.
- La creacion inicial de `Admin` solo se permite desde backend con `POST /api/auth/bootstrap-admin` y header `X-Setup-Key`.
- `bootstrap-admin` es de un solo uso: falla si ya existe un usuario `Admin`.

## Matriz por endpoint

| Endpoint | Admin | Almacen | Compras | Consulta |
|---|---|---|---|---|
| `GET /api/health` | Si | Si | Si | Si |
| `GET /api/dashboard/summary` | Si | Si | Si | Si |
| `POST /api/auth/register` | Si* | Si* | Si* | Si* |
| `POST /api/auth/bootstrap-admin` | Si** | No | No | No |
| `POST /api/auth/login` | Si | Si | Si | Si |
| `POST /api/auth/refresh` | Si | Si | Si | Si |
| `GET /api/auth/me` | Si | Si | Si | Si |
| `POST /api/auth/logout` | Si | Si | Si | Si |
| `GET /api/users` | Si | No | No | No |
| `GET /api/users/:id` | Si | No | No | No |
| `PUT /api/users/:id` | Si | No | No | No |
| `DELETE /api/users/:id` | Si | No | No | No |
| `GET /api/categories` | Si | Si | Si | Si |
| `POST /api/categories` | Si | No | Si | No |
| `PUT /api/categories/:id` | Si | No | Si | No |
| `DELETE /api/categories/:id` | Si | No | Si | No |
| `GET /api/suppliers` | Si | Si | Si | Si |
| `POST /api/suppliers` | Si | No | Si | No |
| `PUT /api/suppliers/:id` | Si | No | Si | No |
| `DELETE /api/suppliers/:id` | Si | No | Si | No |
| `GET /api/products` | Si | Si | Si | Si |
| `POST /api/products` | Si | No | Si | No |
| `PUT /api/products/:id` | Si | No | Si | No |
| `PATCH /api/products/:id/status` | Si | No | Si | No |
| `DELETE /api/products/:id` | Si | No | No | No |
| `GET /api/warehouses` | Si | Si | Si | Si |
| `GET /api/warehouses/:id` | Si | Si | Si | Si |
| `POST /api/warehouses` | Si | Si | No | No |
| `PUT /api/warehouses/:id` | Si | Si | No | No |
| `PATCH /api/warehouses/:id/status` | Si | Si | No | No |
| `DELETE /api/warehouses/:id` | Si | Si | No | No |
| `GET /api/inventory/stock` | Si | Si | Si | Si |
| `GET /api/inventory/movements` | Si | Si | Si | Si |
| `POST /api/inventory/movements/in` | Si | Si | Si | No |
| `POST /api/inventory/movements/out` | Si | Si | No | No |

- `Si*`: endpoint publico; el rol final siempre sera `Consulta`.
- `Si**`: no depende del rol del token; requiere `X-Setup-Key` valido y que no exista un `Admin`.
