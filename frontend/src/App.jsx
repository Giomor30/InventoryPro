import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import RoleRoute from "./components/RoleRoute";

import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage, { ProtectedRoute } from "./pages/LoginPage";
import MovementsPage from "./pages/MovementsPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";
import ReportsPage from "./pages/ReportsPage";
import SuppliersPage from "./pages/SuppliersPage";
import UsersPage from "./pages/UsersPage";
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
              <RoleRoute permission="dashboard:read">
                <DashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path="productos"
            element={
              <RoleRoute permission="products:read">
                <ProductsPage />
              </RoleRoute>
            }
          />

          <Route
            path="categorias"
            element={
              <RoleRoute permission="categories:read">
                <CategoriesPage />
              </RoleRoute>
            }
          />

          <Route
            path="proveedores"
            element={
              <RoleRoute permission="suppliers:read">
                <SuppliersPage />
              </RoleRoute>
            }
          />

          <Route
            path="almacenes"
            element={
              <RoleRoute permission="warehouses:read">
                <WarehousesPage />
              </RoleRoute>
            }
          />

          <Route
            path="inventario"
            element={
              <RoleRoute permission="inventory:read">
                <InventoryPage />
              </RoleRoute>
            }
          />

          <Route
            path="movimientos"
            element={
              <RoleRoute permission="inventory:read">
                <MovementsPage />
              </RoleRoute>
            }
          />

          <Route
            path="reportes"
            element={
              <RoleRoute permission="reports:read">
                <ReportsPage />
              </RoleRoute>
            }
          />

          <Route
            path="usuarios"
            element={
              <RoleRoute permission="users:read">
                <UsersPage />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
} 