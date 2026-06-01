export const ROLE_PERMISSIONS = {
  Admin: [
    "dashboard:read",

    "users:read",
    "users:create",
    "users:update",
    "users:delete",

    "products:read",
    "products:create",
    "products:update",
    "products:delete",

    "categories:read",
    "categories:create",
    "categories:update",
    "categories:delete",

    "suppliers:read",
    "suppliers:create",
    "suppliers:update",
    "suppliers:delete",

    "warehouses:read",
    "warehouses:create",
    "warehouses:update",
    "warehouses:delete",

    "inventory:read",
    "inventory:movement_in",
    "inventory:movement_out",

    "reports:read",
    "audit:read",
  ],

  Almacén: [
    "dashboard:read",

    "products:read",
    "categories:read",
    "suppliers:read",
    "warehouses:read",

    "inventory:read",
    "inventory:movement_in",
    "inventory:movement_out",
  ],

  Compras: [
    "dashboard:read",

    "products:read",
    "products:create",
    "products:update",

    "categories:read",
    "categories:create",
    "categories:update",

    "suppliers:read",
    "suppliers:create",
    "suppliers:update",

    "warehouses:read",

    "inventory:read",

    "reports:read",
  ],

  Consulta: [
    "dashboard:read",

    "products:read",
    "categories:read",
    "suppliers:read",
    "warehouses:read",
    "inventory:read",
    "reports:read",
  ],
};

export function normalizeRole(role) {
  if (!role) return "Consulta";

  if (role === "Administrador") return "Admin";
  if (role === "Admin") return "Admin";
  if (role === "Almacen") return "Almacén";
  if (role === "Almacén") return "Almacén";
  if (role === "Compras") return "Compras";
  if (role === "Consulta") return "Consulta";

  return "Consulta";
}

export function getCurrentUser() {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);

      return {
        ...parsedUser,
        role: normalizeRole(parsedUser.role),
      };
    } catch {
      // Si el JSON está dañado, usa los campos separados.
    }
  }

  return {
    name: localStorage.getItem("userName") || "Usuario",
    email: localStorage.getItem("userEmail") || "usuario@inventorypro.com",
    role: normalizeRole(localStorage.getItem("userRole")),
  };
}

export function getRoleLabel(role = getCurrentUser().role) {
  const labels = {
    Admin: "Administrador",
    Almacén: "Almacén",
    Compras: "Compras",
    Consulta: "Consulta",
  };

  return labels[normalizeRole(role)] || "Consulta";
}

export function hasPermission(permission) {
  const user = getCurrentUser();
  const role = normalizeRole(user.role);
  const permissions = ROLE_PERMISSIONS[role] || [];

  return permissions.includes(permission);
} 
