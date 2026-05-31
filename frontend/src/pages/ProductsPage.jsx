import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  category_id: "",
  supplier_id: "",
  price: "",
  warehouse_id: "",
  initial_stock: "",
  min_stock: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadCatalogs = () => {
    setLoading(true);
    Promise.all([api.products(), api.categories(), api.suppliers(), api.warehouses()])
      .then(([productsRes, categoriesRes, suppliersRes, warehousesRes]) => {
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
        setSuppliers(suppliersRes.data || []);
        setWarehouses((warehousesRes.data || []).filter((w) => w.status !== "inactivo"));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const supplierMap = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier.name])),
    [suppliers]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        categoryMap.get(product.category_id),
        supplierMap.get(product.supplier_id),
        product.price,
        product.stock,
        product.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [categoryMap, products, search, supplierMap]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFieldError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "El nombre es obligatorio.";
    }

    if (!form.category_id) {
      return "La categoría es obligatoria.";
    }

    if (form.price === "" || Number(form.price) < 0) {
      return "El precio debe ser mayor o igual a 0.";
    }

    if (!editingId) {
      const qty = form.initial_stock === "" ? 0 : Number(form.initial_stock);
      if (qty < 0) {
        return "La cantidad inicial no puede ser negativa.";
      }
      if (qty > 0 && !form.warehouse_id) {
        return "Elige el almacén donde entra el stock inicial.";
      }
    }

    if (form.min_stock !== "" && Number(form.min_stock) < 0) {
      return "El stock mínimo no puede ser negativo.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category_id: form.category_id,
        supplier_id: form.supplier_id,
        price: Number(form.price),
        stock: 0,
        min_stock: form.min_stock === "" ? 0 : Number(form.min_stock),
      };

      if (editingId) {
        const existing = products.find((p) => p.id === editingId);
        await api.updateProduct(editingId, {
          ...payload,
          stock: existing?.stock ?? 0,
        });
      } else {
        const created = await api.createProduct(payload);
        const productId = created.data?.id;
        const qty = form.initial_stock === "" ? 0 : Number(form.initial_stock);

        if (productId && qty > 0) {
          await api.inventoryMovementIn({
            product_id: productId,
            warehouse_id: form.warehouse_id,
            quantity: qty,
            reason: "Stock inicial",
          });
          await api.updateProduct(productId, { ...payload, stock: qty });
        }
      }

      resetForm();
      loadCatalogs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category_id: product.category_id || "",
      supplier_id: product.supplier_id || "",
      price: product.price ?? "",
      warehouse_id: "",
      initial_stock: "",
      min_stock: product.min_stock ?? "",
    });
    setFieldError("");
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Dar de baja el producto "${product.name}"?`)) {
      return;
    }

    setError("");
    try {
      await api.deleteProduct(product.id);
      if (editingId === product.id) {
        resetForm();
      }
      loadCatalogs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-title">Productos</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="panel catalog-form-panel">
        <div className="panel-header">
          <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
        </div>

        <form className="catalog-form product-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              className={fieldError.includes("nombre") ? "input-error" : ""}
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Ej. Teclado mecánico"
            />
          </label>
          <label>
            Categoría
            <select
              className={fieldError.includes("categoría") ? "input-error" : ""}
              name="category_id"
              value={form.category_id}
              onChange={updateField}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Proveedor
            <select name="supplier_id" value={form.supplier_id} onChange={updateField}>
              <option value="">Sin proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Precio
            <input
              className={fieldError.includes("precio") ? "input-error" : ""}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={updateField}
              placeholder="0.00"
            />
          </label>
          {!editingId && (
            <>
              <label>
                Almacén inicial
                <select
                  className={fieldError.includes("almacén") ? "input-error" : ""}
                  name="warehouse_id"
                  value={form.warehouse_id}
                  onChange={updateField}
                >
                  <option value="">Sin stock en almacén</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Cantidad inicial
                <input
                  className={fieldError.includes("cantidad") ? "input-error" : ""}
                  name="initial_stock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.initial_stock}
                  onChange={updateField}
                  placeholder="0"
                />
              </label>
            </>
          )}
          {editingId && (
            <p className="form-hint">
              Para cambiar stock por almacén usa Movimientos o revisa Inventario.
            </p>
          )}
          <label>
            Stock mínimo
            <input
              className={fieldError.includes("mínimo") ? "input-error" : ""}
              name="min_stock"
              type="number"
              min="0"
              value={form.min_stock}
              onChange={updateField}
              placeholder="0"
            />
          </label>
          {fieldError && <p className="field-error">{fieldError}</p>}
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header catalog-header">
          <h2>Productos registrados</h2>
          <label className="search-field">
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre, categoría o proveedor"
            />
          </label>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Precio</th>
                <th>Stock ref.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay productos registrados.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{categoryMap.get(product.category_id) || product.category_id || "-"}</td>
                    <td>{supplierMap.get(product.supplier_id) || "-"}</td>
                    <td>{product.price ?? "-"}</td>
                    <td>{product.stock ?? 0}</td>
                    <td>
                      <span className={`badge ${product.status === "inactivo" ? "danger" : "success"}`}>
                        {product.status || "activo"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleEdit(product)}>
                          Editar
                        </button>
                        <button className="danger-button" type="button" onClick={() => handleDelete(product)}>
                          Dar de baja
                        </button>
                      </div>
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
