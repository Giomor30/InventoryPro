import { useEffect, useState } from "react";
import api from "../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .categories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1 className="page-title">Categorías</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description || "-"}</td>
                <td>{item.status || "activo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
