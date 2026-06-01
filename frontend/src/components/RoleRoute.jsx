import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permissions";

export default function RoleRoute({ permission, children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
} 