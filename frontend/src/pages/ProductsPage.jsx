import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .products()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1 className="page-title">Productos</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="panel">
        <div className="panel-header">
          <h2>Productos registrados</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !loading ? (
              <tr>
                <td colSpan="5">No hay productos registrados.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category_id || "-"}</td>
                  <td>{product.price ?? "-"}</td>
                  <td>{product.stock ?? 0}</td>
                  <td>
                    <span className={`badge ${product.status === "inactivo" ? "danger" : "success"}`}>
                      {product.status || "activo"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
