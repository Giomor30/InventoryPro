import { NavLink, Outlet } from "react-router-dom";
import { getCurrentRole, getVisibleNavItems, roleLabel } from "../utils/permissions";

export default function Layout() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail") || "usuario@inventorypro.com";
  const userRole = getCurrentRole();
  const navItems = getVisibleNavItems(userRole);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <span>InventoryPro</span>
          <span className="cart-icon">▱</span>
        </div>
      </header>

      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">👤</div>
          <h3>{userName || "Usuario"}</h3>
          <p>{userEmail}</p>
          <span className="role-badge">{roleLabel(userRole)}</span>
          <button type="button" className="secondary-button" onClick={handleLogout} style={{ marginTop: "12px" }}>
            Salir
          </button>
        </div>

        <div className="menu-title">NAVEGACIÓN PRINCIPAL</div>

        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
