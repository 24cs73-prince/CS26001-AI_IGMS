import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards authenticated routes.
 * - Redirects unauthenticated users to /login (preserving the destination).
 * - If `allowedRoles` is given, users whose role isn't included are sent to
 *   their own home portal — so a principal can't open teacher pages by URL,
 *   and vice-versa.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.roleKey)) {
    return <Navigate to={user?.home || '/dashboard'} replace />;
  }

  return children;
}
