import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

/**
 * 404 page. Links back to the dashboard (or login if unauthenticated).
 */
export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const home = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[120px] font-bold leading-none text-gradient">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button as={Link} to={home} icon={FiHome}>Back to {isAuthenticated ? 'Dashboard' : 'Login'}</Button>
          <Button as={Link} to={home} variant="outline" icon={FiArrowLeft}>Go back</Button>
        </div>
      </motion.div>
    </div>
  );
}
