import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  contact_email: "",
  phone: "",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadSuppliers = () => {
    setLoading(true);
    api
      .suppliers()
      .then((res) => setSuppliers(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return suppliers;
    }

    return suppliers.filter((item) =>
      [item.name, item.contact_email, item.phone, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, suppliers]);

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
    if (!form.name.trim()) {
      return "El nombre es obligatorio.";
    }

    if (!form.contact_email.trim()) {
      return "El correo de contacto es obligatorio.";
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contact_email.trim())) {
      return "El correo no tiene un formato válido.";
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
        name: form.name.trim(),
        contact_email: form.contact_email.trim(),
        phone: form.phone.trim(),
      };

      if (editingId) {
        await api.updateSupplier(editingId, payload);
      } else {
        await api.createSupplier(payload);
      }

      resetForm();
      loadSuppliers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      contact_email: item.contact_email || "",
      phone: item.phone || "",
    });
    setFieldError("");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar el proveedor "${item.name}"?`)) {
      return;
    }

    setError("");
    try {
      await api.deleteSupplier(item.id);
      if (editingId === item.id) {
        resetForm();
      }
      loadSuppliers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-title">Proveedores</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel catalog-form-panel">
        <div className="panel-header">
          <h2>{editingId ? "Editar proveedor" : "Nuevo proveedor"}</h2>
        </div>

        <form className="catalog-form three-columns" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              className={fieldError.includes("nombre") ? "input-error" : ""}
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Ej. Suministros del Norte"
            />
          </label>
          <label>
            Email
            <input
              className={fieldError.includes("correo") ? "input-error" : ""}
              name="contact_email"
              type="email"
              value={form.contact_email}
              onChange={updateField}
              placeholder="contacto@proveedor.com"
            />
          </label>
          <label>
            Teléfono
            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="555-000-0000"
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
          <h2>Proveedores registrados</h2>
          <label className="search-field">
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre, email o teléfono"
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay proveedores registrados.</td>
                </tr>
              ) : (
                filteredSuppliers.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.contact_email}</td>
                    <td>{item.phone || "-"}</td>
                    <td>{item.status || "activo"}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(item)}>
                          Editar
                        </button>
                        <button className="danger-button" type="button" onClick={() => handleDelete(item)}>
                          Eliminar
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
