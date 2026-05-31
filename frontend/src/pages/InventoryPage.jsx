import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function InventoryPage() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ product_id: "", warehouse_id: "" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCatalogs = () => {
    return Promise.all([api.products(), api.warehouses()]).then(([productsRes, warehousesRes]) => {
      setProducts(productsRes.data || []);
      setWarehouses(warehousesRes.data || []);
    });
  };

  const loadStock = (params = filters) => {
    setLoading(true);
    const query = {};
    if (params.product_id) {
      query.product_id = params.product_id;
    }
    if (params.warehouse_id) {
      query.warehouse_id = params.warehouse_id;
    }

    api
      .inventoryStock(query)
      .then((res) => setStock(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCatalogs()
      .then(() => loadStock())
      .catch((err) => setError(err.message));
  }, []);

  const filteredStock = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return stock;
    }

    return stock.filter((row) =>
      [row.product_name, row.warehouse_name, row.product_id, row.warehouse_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, stock]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    loadStock(filters);
  };

  const clearFilters = () => {
    const empty = { product_id: "", warehouse_id: "" };
    setFilters(empty);
    loadStock(empty);
  };

  return (
    <section>
      <h1 className="page-title">Inventario</h1>
      <p>Stock actual por producto y almacén.</p>
      {error && <p className="error-text">{error}</p>}

      <div className="panel">
        <div className="panel-header">
          <h2>Filtros</h2>
        </div>

        <form className="form-grid" onSubmit={applyFilters}>
          <label>
            Producto
            <select name="product_id" value={filters.product_id} onChange={handleFilterChange}>
              <option value="">Todos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Almacén
            <select name="warehouse_id" value={filters.warehouse_id} onChange={handleFilterChange}>
              <option value="">Todos</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">Aplicar</button>
            <button type="button" className="secondary-button" onClick={clearFilters}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div className="panel" style={{ marginTop: "24px" }}>
        <div className="panel-header">
          <h2>Stock</h2>
          <input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading && <p>Cargando...</p>}

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Almacén</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.length === 0 && !loading ? (
              <tr>
                <td colSpan="3">Sin registros de stock. Registra una entrada en Movimientos.</td>
              </tr>
            ) : (
              filteredStock.map((row) => (
                <tr key={row.id || `${row.product_id}-${row.warehouse_id}`}>
                  <td>{row.product_name || row.product_id}</td>
                  <td>{row.warehouse_name || row.warehouse_id}</td>
                  <td>
                    <strong>{row.quantity}</strong>
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
