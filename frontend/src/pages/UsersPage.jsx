import { useEffect, useState } from "react";
import { getRoleLabel, hasPermission, normalizeRole } from "../utils/permissions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Consulta",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken")
    );
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

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

  const resetForm = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Consulta",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo crear el usuario");
      }

      setMessage("Usuario creado correctamente");
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: normalizeRole(user.role),
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();
      const userId = editingUser?.id;

      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo actualizar el usuario");
      }

      setMessage("Usuario actualizado correctamente");
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar al usuario ${user.email}?`
    );

    if (!confirmDelete) return;

    setError("");
    setMessage("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo eliminar el usuario");
      }

      setMessage("Usuario eliminado correctamente");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const canCreate = hasPermission("users:create");
  const canUpdate = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");

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
      {message && <p style={{ color: "#00897b", fontWeight: "700" }}>{message}</p>}

      {canCreate && (
        <section className="panel" style={{ marginBottom: "24px" }}>
          <h2>{editingUser ? "Editar usuario" : "Crear usuario"}</h2>

          <form
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            className="form-grid"
          >
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
                minLength={editingUser ? 0 : 8}
                required={!editingUser}
                placeholder={editingUser ? "Dejar vacío para no cambiar" : ""}
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
              {saving
                ? "Guardando..."
                : editingUser
                ? "Guardar cambios"
                : "Crear usuario"}
            </button>

            {editingUser && (
              <button type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </form>
        </section>
      )}

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
                {(canUpdate || canDelete) && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id || user.email}>
                  <td>{user.name || "Sin nombre"}</td>
                  <td>{user.email}</td>
                  <td>{getRoleLabel(user.role)}</td>
                  <td>{user.status || "activo"}</td>

                  {(canUpdate || canDelete) && (
                    <td>
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => handleEditClick(user)}
                          style={{ marginRight: "8px" }}
                        >
                          Editar
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
} 
