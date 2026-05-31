import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "No se pudo registrar");
      }
      setOk("Cuenta creada. Ya puedes iniciar sesion.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="panel login-panel" onSubmit={handleRegister}>
        <h1>Registro</h1>
        <label>
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        {ok && <p style={{ color: "#2e7d32" }}>{ok}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear cuenta"}
        </button>
        <p style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/login">Volver al login</Link>
        </p>
      </form>
    </div>
  );
}
