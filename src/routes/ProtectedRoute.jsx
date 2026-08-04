import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards authenticated routes.
 * - Redirects unauthenticated users to /login (preserving intended destination).
 * - If `allowedRoles` is provided and the user's role isn't in it,
 *   redirects them to their own home page.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.roleKey)) {
    return <Navigate to={user?.home || '/login'} replace />;
  }

  return children;
}
