import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_CREDENTIALS } from '../../constants/app';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * Login page. Frontend-only auth using demo credentials.
 */
export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      {/* Mobile brand */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M12 3l9 4-9 4-9-4 9-4z" fill="currentColor" />
          </svg>
        </div>
        <p className="text-lg font-bold text-ink">AI-IGMS</p>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Sign in to your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your credentials to access the management portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@igms.gov.in"
          leadingIcon={FiMail}
          autoComplete="username"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          leadingIcon={FiLock}
          error={error}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-hairline text-primary focus:ring-primary/30" />
            Remember me
          </label>
          <button type="button" className="text-sm font-medium text-primary hover:text-primary-700">
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" loading={loading} iconRight={FiArrowRight} className="w-full">
          Sign in
        </Button>
      </form>

      {/* Demo credentials helper */}
      <button
        type="button"
        onClick={fillDemo}
        className="mt-6 flex w-full items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
      >
        <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-xs">
          <p className="font-semibold text-primary">Demo credentials (click to fill)</p>
          <p className="mt-0.5 text-slate-600">Email: {DEMO_CREDENTIALS.email}</p>
          <p className="text-slate-600">Password: {DEMO_CREDENTIALS.password}</p>
        </div>
      </button>
    </motion.div>
  );
}
