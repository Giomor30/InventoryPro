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
    { title: "Productos", value: summary?.products ?? "-", icon: "◼", color: "purple" },
    { title: "Categorías", value: summary?.categories ?? "-", icon: "▣", color: "teal" },
    { title: "Proveedores", value: summary?.suppliers ?? "-", icon: "👥", color: "orange" },
    { title: "Stock total", value: summary?.total_stock ?? "-", icon: "▰", color: "blue" },
    { title: "Estado API", value: apiStatus, icon: "⌁", color: "cyan" },
  ];

  return (
    <section>
      <h1 className="page-title">Dashboard</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div className={`stat-card ${card.color}`} key={card.title}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <p>{card.title}</p>
              <h2>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
