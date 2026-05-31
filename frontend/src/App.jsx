import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RoleRoute from "./components/RoleRoute";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage, { ProtectedRoute } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovementsPage from "./pages/MovementsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import WarehousesPage from "./pages/WarehousesPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <RoleRoute routeKey="dashboard">
                <DashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="productos"
            element={
              <RoleRoute routeKey="productos">
                <ProductsPage />
              </RoleRoute>
            }
          />
          <Route
            path="categorias"
            element={
              <RoleRoute routeKey="categorias">
                <CategoriesPage />
              </RoleRoute>
            }
          />
          <Route
            path="proveedores"
            element={
              <RoleRoute routeKey="proveedores">
                <SuppliersPage />
              </RoleRoute>
            }
          />
          <Route
            path="almacenes"
            element={
              <RoleRoute routeKey="almacenes">
                <WarehousesPage />
              </RoleRoute>
            }
          />
          <Route
            path="inventario"
            element={
              <RoleRoute routeKey="inventario">
                <InventoryPage />
              </RoleRoute>
            }
          />
          <Route
            path="movimientos"
            element={
              <RoleRoute routeKey="movimientos">
                <MovementsPage />
              </RoleRoute>
            }
          />
          <Route
            path="reportes"
            element={
              <RoleRoute routeKey="reportes">
                <PlaceholderPage title="Reportes" description="Resúmenes y exportaciones." />
              </RoleRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <RoleRoute routeKey="usuarios">
                <PlaceholderPage
                  title="Usuarios"
                  description="Gestión de usuarios y roles (próximamente)."
                />
              </RoleRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
