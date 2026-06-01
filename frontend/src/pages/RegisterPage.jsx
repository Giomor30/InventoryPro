import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo registrar el usuario");
      }

      setSuccess("Usuario registrado correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <h1>Registro</h1>

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-input-group">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={form.name}
              onChange={handleChange}
              required
            />
            <span>👤</span>
          </div>

          <div className="register-input-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
            <span>✉️</span>
          </div>

          <div className="register-input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <span>🔒</span>
          </div>

          <p className="register-role-note">
            Tu cuenta se creará con rol Consulta. Un administrador puede cambiar tu rol después.
          </p>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="register-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
} 
