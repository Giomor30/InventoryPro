import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  description: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadCategories = () => {
    setLoading(true);
    api
      .categories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return categories;
    }

    return categories.filter((item) =>
      [item.name, item.description, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [categories, search]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFieldError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setFieldError("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (editingId) {
        await api.updateCategory(editingId, payload);
      } else {
        await api.createCategory(payload);
      }

      resetForm();
      loadCategories();
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
      description: item.description || "",
    });
    setFieldError("");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar la categoría "${item.name}"?`)) {
      return;
    }

    setError("");
    try {
      await api.deleteCategory(item.id);
      if (editingId === item.id) {
        resetForm();
      }
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-title">Categorías</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel catalog-form-panel">
        <div className="panel-header">
          <h2>{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
        </div>

        <form className="catalog-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              className={fieldError ? "input-error" : ""}
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Ej. Electrónica"
            />
          </label>
          <label>
            Descripción
            <input
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Descripción breve"
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
          <h2>Categorías registradas</h2>
          <label className="search-field">
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre o descripción"
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
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4">No hay categorías registradas.</td>
                </tr>
              ) : (
                filteredCategories.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description || "-"}</td>
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
