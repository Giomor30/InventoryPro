import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage, { ProtectedRoute } from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="proveedores" element={<SuppliersPage />} />
          <Route
            path="inventario"
            element={
              <PlaceholderPage
                title="Inventario"
                description="Stock por almacén."
              />
            }
          />
          <Route
            path="movimientos"
            element={
              <PlaceholderPage
                title="Movimientos"
                description="Entradas, salidas y ajustes."
              />
            }
          />
          <Route
            path="reportes"
            element={
              <PlaceholderPage
                title="Reportes"
                description="Resúmenes y exportaciones."
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
