const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: "Respuesta inválida del servidor",
  }));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}

export const api = {
  health: () => request("/api/health"),
  dashboard: () => request("/api/dashboard/summary"),
  products: () => request("/api/products"),
  categories: () => request("/api/categories"),
  suppliers: () => request("/api/suppliers"),
  warehouses: () => request("/api/warehouses"),
};

export default api;
