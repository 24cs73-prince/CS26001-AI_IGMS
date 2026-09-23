import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guards authenticated routes.
 * - Redirects unauthenticated users to /login with return location.
 * - Enforces role and school scope at the frontend shell.
 * - For first-login accounts, redirects to /change-password before the dashboard.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.roleKey || user?.role || "";

  if (
    currentRole === "super_admin" &&
    user?.mustChangePassword === true &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some(
      (r) => r === currentRole || r === user?.role
    );
    if (!isAllowed) {
      return <Navigate to={user?.home || "/dashboard"} replace />;
    }
  }

  return children;
}
