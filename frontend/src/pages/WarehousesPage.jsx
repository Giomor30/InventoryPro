import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .warehouses()
      .then((res) => setWarehouses(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredWarehouses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return warehouses;
    }

    return warehouses.filter((warehouse) =>
      [warehouse.name, warehouse.code, warehouse.location, warehouse.manager, warehouse.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, warehouses]);

  return (
    <section>
      <h1 className="page-title">Almacenes</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel">
        <div className="panel-header catalog-header">
          <h2>Almacenes registrados</h2>
          <label className="search-field">
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre, código o ubicación"
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Encargado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay almacenes para mostrar.</td>
                </tr>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td>{warehouse.code}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.location || "-"}</td>
                    <td>{warehouse.manager || "-"}</td>
                    <td>
                      <span className={`badge ${warehouse.status === "inactivo" ? "danger" : "success"}`}>
                        {warehouse.status || "activo"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
