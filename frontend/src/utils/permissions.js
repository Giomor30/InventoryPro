const CANONICAL_ROLES = new Set(["Admin", "Almacen", "Compras", "Consulta"]);

/** Rutas accesibles por rol (lectura / navegacion). Alineado con docs/matriz_roles.md */
export const ROUTE_ACCESS = {
  dashboard: CANONICAL_ROLES,
  productos: CANONICAL_ROLES,
  categorias: CANONICAL_ROLES,
  proveedores: CANONICAL_ROLES,
  almacenes: CANONICAL_ROLES,
  inventario: CANONICAL_ROLES,
  movimientos: CANONICAL_ROLES,
  reportes: CANONICAL_ROLES,
  usuarios: new Set(["Admin"]),
};

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "▦", routeKey: "dashboard" },
  { to: "/productos", label: "Productos", icon: "◼", routeKey: "productos" },
  { to: "/categorias", label: "Categorías", icon: "▣", routeKey: "categorias" },
  { to: "/proveedores", label: "Proveedores", icon: "👥", routeKey: "proveedores" },
  { to: "/almacenes", label: "Almacenes", icon: "▧", routeKey: "almacenes" },
  { to: "/inventario", label: "Inventario", icon: "▰", routeKey: "inventario" },
  { to: "/movimientos", label: "Movimientos", icon: "↕", routeKey: "movimientos" },
  { to: "/reportes", label: "Reportes", icon: "▤", routeKey: "reportes" },
  { to: "/usuarios", label: "Usuarios", icon: "⚙", routeKey: "usuarios" },
];

export function normalizeRole(role) {
  if (role == null || role === "") {
    return null;
  }

  const compact = String(role)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (compact === "admin" || compact === "administrador") {
    return "Admin";
  }
  if (compact.startsWith("almac")) {
    return "Almacen";
  }
  if (compact.startsWith("compr")) {
    return "Compras";
  }
  if (compact.startsWith("consult")) {
    return "Consulta";
  }

  const trimmed = String(role).trim();
  return CANONICAL_ROLES.has(trimmed) ? trimmed : null;
}

export function getCurrentRole() {
  const normalized = normalizeRole(localStorage.getItem("userRole"));
  return normalized && CANONICAL_ROLES.has(normalized) ? normalized : "Consulta";
}

export function roleLabel(role) {
  const canonical = normalizeRole(role) || role;
  const labels = {
    Admin: "Administrador",
    Almacen: "Almacén",
    Compras: "Compras",
    Consulta: "Consulta",
  };
  return labels[canonical] || String(role || "Consulta");
}

export function canAccessRoute(routeKey, role = getCurrentRole()) {
  const allowed = ROUTE_ACCESS[routeKey];
  if (!allowed) {
    return false;
  }
  const canonical = normalizeRole(role) || "Consulta";
  return allowed.has(canonical);
}

export function getVisibleNavItems(role = getCurrentRole()) {
  return NAV_ITEMS.filter((item) => canAccessRoute(item.routeKey, role));
}
