import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/reports/inventory-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo cargar el reporte");
      }

      setReport(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Resumen general del inventario.</p>
        </div>

        <button type="button" onClick={loadReport}>
          Actualizar
        </button>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <h3>Productos</h3>
          <strong>{report?.total_products ?? 0}</strong>
        </article>

        <article className="stat-card">
          <h3>Almacenes</h3>
          <strong>{report?.total_warehouses ?? 0}</strong>
        </article>

        <article className="stat-card">
          <h3>Stock total</h3>
          <strong>{report?.total_stock ?? 0}</strong>
        </article>

        <article className="stat-card">
          <h3>Entradas</h3>
          <strong>{report?.total_entries ?? 0}</strong>
        </article>

        <article className="stat-card">
          <h3>Salidas</h3>
          <strong>{report?.total_outputs ?? 0}</strong>
        </article>

        <article className="stat-card">
          <h3>Stock bajo</h3>
          <strong>{report?.low_stock_count ?? 0}</strong>
        </article>
      </div>

      <section className="panel" style={{ marginTop: "24px" }}>
        <h2>Productos con stock bajo</h2>

        {!report?.low_stock?.length ? (
          <p>No hay productos con stock bajo.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Almacén</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {report.low_stock.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_id || "Sin producto"}</td>
                  <td>{item.warehouse_id || "Sin almacén"}</td>
                  <td>{item.quantity ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}