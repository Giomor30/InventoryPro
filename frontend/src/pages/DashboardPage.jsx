import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [apiStatus, setApiStatus] = useState("Verificando...");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.health(), api.dashboard()])
      .then(([healthRes, dashboardRes]) => {
        setApiStatus(healthRes.data?.status === "ok" ? "Conectado" : "Error");
        setSummary(dashboardRes.data);
      })
      .catch((err) => {
        setApiStatus("Sin conexión");
        setError(err.message);
      });
  }, []);

  const cards = [
    { title: "Productos", value: summary?.products ?? "—", accent: "teal" },
    { title: "Categorías", value: summary?.categories ?? "—", accent: "gold" },
    { title: "Proveedores", value: summary?.suppliers ?? "—", accent: "teal" },
    { title: "Stock total", value: summary?.total_stock ?? "—", accent: "gold" },
    { title: "Estado API", value: apiStatus, accent: apiStatus === "Conectado" ? "ok" : "warn" },
  ];

  return (
    <section className="page-shell dashboard-page">
      <header className="page-head">
        <div>
          <p className="page-eyebrow">Resumen</p>
          <h1 className="page-heading">Dashboard</h1>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-grid">
        {cards.map((card) => (
          <article className={`stat-card stat-card--${card.accent}`} key={card.title}>
            <p className="stat-label">{card.title}</p>
            <p className="stat-value">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
