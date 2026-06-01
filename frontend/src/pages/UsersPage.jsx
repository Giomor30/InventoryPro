import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Consulta",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudieron cargar los usuarios");
      }

      setUsers(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo crear el usuario");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        role: "Consulta",
      });

      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de usuarios y roles del sistema.</p>
        </div>

        <button type="button" onClick={loadUsers}>
          Actualizar
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="panel" style={{ marginBottom: "24px" }}>
        <h2>Crear usuario</h2>

        <form onSubmit={createUser} className="form-grid">
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          <label>
            Rol
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="Admin">Administrador</option>
              <option value="Almacén">Almacén</option>
              <option value="Compras">Compras</option>
              <option value="Consulta">Consulta</option>
            </select>
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Crear usuario"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Lista de usuarios</h2>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user.email}>
                  <td>{user.name || "Sin nombre"}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "Consulta"}</td>
                  <td>{user.status || "activo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
} 