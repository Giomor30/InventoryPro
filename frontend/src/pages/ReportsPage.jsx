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
    return (
      <section className="page">
        <h1>Reportes</h1>
        <p>Cargando reporte...</p>
      </section>
    );
  }

  return (
    <section className="page reports-page">
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Resumen general del inventario.</p>
        </div>

        <button type="button" onClick={loadReport}>
          Actualizar
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="reports-grid">
        <article className="report-card">
          <span>Productos</span>
          <strong>{report?.total_products ?? 0}</strong>
        </article>

        <article className="report-card">
          <span>Almacenes</span>
          <strong>{report?.total_warehouses ?? 0}</strong>
        </article>

        <article className="report-card">
          <span>Stock total</span>
          <strong>{report?.total_stock ?? 0}</strong>
        </article>

        <article className="report-card">
          <span>Entradas</span>
          <strong>{report?.total_entries ?? 0}</strong>
        </article>

        <article className="report-card">
          <span>Salidas</span>
          <strong>{report?.total_outputs ?? 0}</strong>
        </article>

        <article className="report-card warning">
          <span>Stock bajo</span>
          <strong>{report?.low_stock_count ?? 0}</strong>
        </article>
      </div>

      <section className="panel reports-panel">
        <div className="panel-header">
          <div>
            <h2>Productos con stock bajo</h2>
            <p>Productos que requieren revisión o reabastecimiento.</p>
          </div>
        </div>

        {!report?.low_stock?.length ? (
          <p className="empty-text">No hay productos con stock bajo.</p>
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
                  <td>{item.product_name || item.product_id || "Sin producto"}</td>
                  <td>{item.warehouse_name || item.warehouse_id || "Sin almacén"}</td>
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