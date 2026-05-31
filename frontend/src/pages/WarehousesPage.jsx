import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  code: "",
  name: "",
  location: "",
  manager: "",
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadWarehouses = () => {
    setLoading(true);
    api
      .warehouses()
      .then((res) => setWarehouses(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return warehouses;
    }

    return warehouses.filter((warehouse) =>
      [warehouse.name, warehouse.code, warehouse.location, warehouse.manager, warehouse.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, warehouses]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFieldError("");
  };

  const validateForm = () => {
    if (!form.code.trim()) {
      return "El código es obligatorio.";
    }

    if (!form.name.trim()) {
      return "El nombre es obligatorio.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        location: form.location.trim(),
        manager: form.manager.trim(),
      };

      if (editingId) {
        await api.updateWarehouse(editingId, payload);
      } else {
        await api.createWarehouse(payload);
      }

      resetForm();
      loadWarehouses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (warehouse) => {
    setEditingId(warehouse.id);
    setForm({
      code: warehouse.code || "",
      name: warehouse.name || "",
      location: warehouse.location || "",
      manager: warehouse.manager || "",
    });
    setFieldError("");
  };

  const handleDelete = async (warehouse) => {
    if (!window.confirm(`¿Dar de baja el almacén "${warehouse.name}"?`)) {
      return;
    }

    setError("");
    try {
      await api.deleteWarehouse(warehouse.id);
      if (editingId === warehouse.id) {
        resetForm();
      }
      loadWarehouses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-title">Almacenes</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel catalog-form-panel">
        <div className="panel-header">
          <h2>{editingId ? "Editar almacén" : "Nuevo almacén"}</h2>
        </div>

        <form className="catalog-form" onSubmit={handleSubmit}>
          <label>
            Código
            <input
              className={fieldError.includes("código") ? "input-error" : ""}
              name="code"
              value={form.code}
              onChange={updateField}
              placeholder="Ej. CEDIS-01"
            />
          </label>
          <label>
            Nombre
            <input
              className={fieldError.includes("nombre") ? "input-error" : ""}
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Ej. Almacén central"
            />
          </label>
          <label>
            Ubicación
            <input
              name="location"
              value={form.location}
              onChange={updateField}
              placeholder="Ciudad o dirección"
            />
          </label>
          <label>
            Encargado
            <input
              name="manager"
              value={form.manager}
              onChange={updateField}
              placeholder="Nombre del responsable"
            />
          </label>
          {fieldError && <p className="field-error">{fieldError}</p>}
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header catalog-header">
          <h2>Almacenes registrados</h2>
          <label className="search-field">
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre, código o ubicación"
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Encargado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan="6">No hay almacenes para mostrar.</td>
                </tr>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td>{warehouse.code}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.location || "-"}</td>
                    <td>{warehouse.manager || "-"}</td>
                    <td>
                      <span className={`badge ${warehouse.status === "inactivo" ? "danger" : "success"}`}>
                        {warehouse.status || "activo"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(warehouse)}>
                          Editar
                        </button>
                        <button className="danger-button" type="button" onClick={() => handleDelete(warehouse)}>
                          Dar de baja
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
