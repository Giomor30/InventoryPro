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

const jsonOptions = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

export const api = {
  health: () => request("/api/health"),
  dashboard: () => request("/api/dashboard/summary"),
  products: () => request("/api/products"),
  createProduct: (data) => request("/api/products", jsonOptions("POST", data)),
  updateProduct: (id, data) => request(`/api/products/${id}`, jsonOptions("PUT", data)),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
  categories: () => request("/api/categories"),
  createCategory: (data) => request("/api/categories", jsonOptions("POST", data)),
  updateCategory: (id, data) => request(`/api/categories/${id}`, jsonOptions("PUT", data)),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: "DELETE" }),
  suppliers: () => request("/api/suppliers"),
  createSupplier: (data) => request("/api/suppliers", jsonOptions("POST", data)),
  updateSupplier: (id, data) => request(`/api/suppliers/${id}`, jsonOptions("PUT", data)),
  deleteSupplier: (id) => request(`/api/suppliers/${id}`, { method: "DELETE" }),
  warehouses: () => request("/api/warehouses"),
};

export default api;
