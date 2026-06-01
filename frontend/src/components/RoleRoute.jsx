import { Navigate } from "react-router-dom";
import { canAccessRoute, getCurrentRole } from "../utils/permissions";

export default function RoleRoute({ routeKey, children }) {
  const role = getCurrentRole();

  if (!canAccessRoute(routeKey, role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
