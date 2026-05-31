import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim() || "admin@inventorypro.com";

    localStorage.setItem("token", "session-local");
    localStorage.setItem("userEmail", email);
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-page">
      <form className="panel login-panel" onSubmit={handleLogin}>
        <h1>InventoryPro</h1>
        <label>
          Correo
          <input type="email" name="email" placeholder="admin@inventorypro.com" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" placeholder="********" />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
