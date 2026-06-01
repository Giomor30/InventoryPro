import { NavLink, Outlet } from "react-router-dom";
import { getCurrentUser, getRoleLabel, hasPermission } from "../utils/permissions";

export default function Layout() {
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "/login";
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          InventoryPro <span className="brand-icon">▱</span>
        </div>
      </header>

      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">👤</div>

          <h3>{user.name || "Usuario"}</h3>
          <p>{user.email || "usuario@inventorypro.com"}</p>

          <span className="role-pill">{getRoleLabel()}</span>

          <button type="button" className="logout-button" onClick={handleLogout}>
            Salir
          </button>
        </div>

        <div className="menu-title">NAVEGACIÓN PRINCIPAL</div>

        <nav className="sidebar-nav">
          {hasPermission("dashboard:read") && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>▦</span> Dashboard
            </NavLink>
          )}

          {hasPermission("products:read") && (
            <NavLink
              to="/productos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>■</span> Productos
            </NavLink>
          )}

          {hasPermission("categories:read") && (
            <NavLink
              to="/categorias"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>▣</span> Categorías
            </NavLink>
          )}

          {hasPermission("suppliers:read") && (
            <NavLink
              to="/proveedores"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>👥</span> Proveedores
            </NavLink>
          )}

          {hasPermission("warehouses:read") && (
            <NavLink
              to="/almacenes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>▧</span> Almacenes
            </NavLink>
          )}

          {hasPermission("inventory:read") && (
            <NavLink
              to="/inventario"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>▰</span> Inventario
            </NavLink>
          )}

          {hasPermission("inventory:read") && (
            <NavLink
              to="/movimientos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>↕</span> Movimientos
            </NavLink>
          )}

          {hasPermission("reports:read") && (
            <NavLink
              to="/reportes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>▤</span> Reportes
            </NavLink>
          )}

          {hasPermission("users:read") && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>⚙</span> Usuarios
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
} 