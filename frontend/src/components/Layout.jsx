import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail") || "usuario@inventorypro.com";

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
          <button type="button" className="secondary-button" onClick={handleLogout} style={{ marginTop: "12px" }}>
            Salir
          </button>
        </div>

        <div className="menu-title">NAVEGACIÓN PRINCIPAL</div>

        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>▦</span> Dashboard
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>◼</span> Productos
          </NavLink>
          <NavLink to="/categorias" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>▣</span> Categorías
          </NavLink>
          <NavLink to="/proveedores" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>👥</span> Proveedores
          </NavLink>
          <NavLink to="/almacenes" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>▧</span> Almacenes
          </NavLink>
          <NavLink to="/inventario" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>▰</span> Inventario
          </NavLink>
          <NavLink to="/movimientos" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>↕</span> Movimientos
          </NavLink>
          <NavLink to="/reportes" className={({ isActive }) => (isActive ? "active" : "")}>
            <span>▤</span> Reportes
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
