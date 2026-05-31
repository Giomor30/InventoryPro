import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  product_id: "",
  warehouse_id: "",
  quantity: "",
  reason: "",
  reference: "",
};

export default function MovementsPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [movementType, setMovementType] = useState("out");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.products(),
      api.warehouses(),
      api.inventoryMovements(),
    ])
      .then(([productsRes, warehousesRes, movementsRes]) => {
        setProducts((productsRes.data || []).filter((p) => p.status !== "inactivo"));
        setWarehouses((warehousesRes.data || []).filter((w) => w.status !== "inactivo"));
        setMovements(movementsRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    if (!form.product_id) {
      return "Selecciona un producto.";
    }
    if (!form.warehouse_id) {
      return "Selecciona un almacén.";
    }
    const qty = Number(form.quantity);
    if (!form.quantity || Number.isNaN(qty) || qty <= 0) {
      return "La cantidad debe ser mayor que cero.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    const payload = {
      product_id: form.product_id,
      warehouse_id: form.warehouse_id,
      quantity: Number(form.quantity),
      reason: form.reason.trim() || undefined,
      reference: form.reference.trim() || undefined,
    };

    setSaving(true);
    try {
      if (movementType === "in") {
        await api.inventoryMovementIn(payload);
      } else {
        await api.inventoryMovementOut(payload);
      }
      setForm(initialForm);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h1 className="page-title">Movimientos</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel">
        <div className="panel-header">
          <h2>Registrar movimiento</h2>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Tipo
            <select
              value={movementType}
              onChange={(event) => setMovementType(event.target.value)}
            >
              <option value="out">Salida (venta / consumo)</option>
              <option value="in">Entrada (compra / ingreso)</option>
            </select>
          </label>

          <label>
            Producto
            <select name="product_id" value={form.product_id} onChange={updateField} required>
              <option value="">Seleccionar...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Almacén
            <select name="warehouse_id" value={form.warehouse_id} onChange={updateField} required>
              <option value="">Seleccionar...</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cantidad
            <input
              type="number"
              name="quantity"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Motivo
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={updateField}
              placeholder="Venta, compra..."
            />
          </label>

          <label>
            Referencia
            <input
              type="text"
              name="reference"
              value={form.reference}
              onChange={updateField}
              placeholder="Folio, factura..."
            />
          </label>

          {fieldError && <p className="error-text">{fieldError}</p>}

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Guardando..."
                : movementType === "in"
                  ? "Registrar entrada"
                  : "Registrar salida"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel" style={{ marginTop: "24px" }}>
        <div className="panel-header">
          <h2>Historial</h2>
        </div>

        {loading && <p>Cargando...</p>}

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Almacén</th>
              <th>Cantidad</th>
              <th>Antes</th>
              <th>Después</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 && !loading ? (
              <tr>
                <td colSpan="8">Sin movimientos registrados.</td>
              </tr>
            ) : (
              movements.map((item) => (
                <tr key={item.id}>
                  <td>{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                  <td>
                    <span className={`badge ${item.type === "in" ? "success" : "warning"}`}>
                      {item.type === "in" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td>{item.product_name || item.product_id}</td>
                  <td>{item.warehouse_name || item.warehouse_id}</td>
                  <td>{item.quantity}</td>
                  <td>{item.stock_before}</td>
                  <td>{item.stock_after}</td>
                  <td>{item.reason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
