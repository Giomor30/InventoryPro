import { useEffect, useState } from "react";
import api from "../services/api";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .suppliers()
      .then((res) => setSuppliers(res.data || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1 className="page-title">Proveedores</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.contact_email}</td>
                <td>{item.phone || "-"}</td>
                <td>{item.status || "activo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
