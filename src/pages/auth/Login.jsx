import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiUserCheck, FiShield, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, ROLE_ORDER } from '../../constants/app';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { cn } from '../../utils/cn';

const ROLE_ICONS = {
  teacher: FiUserCheck,
  principal: FiShield,
  student: FiUser,
};

/**
 * Login page. Frontend-only auth with 3 roles (Teacher / Principal / Student).
 * - Teacher & Principal log in with their demo credentials.
 * - Student is a placeholder: signing in does nothing (portal coming soon).
 */
export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [roleKey, setRoleKey] = useState('teacher');
  const [form, setForm] = useState({
    email: ROLES.teacher.email,
    password: ROLES.teacher.password,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStudent = roleKey === 'student';

  const selectRole = (key) => {
    setRoleKey(key);
    setError('');
    // Auto-fill demo credentials for the chosen role
    setForm({ email: ROLES[key].email, password: ROLES[key].password });
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login({ ...form, role: roleKey });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const from = location.state?.from?.pathname || user.home;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Sign in to your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Choose your role and enter your credentials.
        </p>
      </div>

      {/* Role selector */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {ROLE_ORDER.map((key) => {
          const Icon = ROLE_ICONS[key];
          const active = roleKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectRole(key)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all',
                active
                  ? 'border-primary bg-primary/5 text-primary shadow-soft'
                  : 'border-hairline bg-white text-slate-500 hover:border-slate-300 hover:text-ink'
              )}
            >
              <Icon className="h-5 w-5" />
              {ROLES[key].label}
            </button>
          );
        })}
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
          disabled={isStudent}
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
          disabled={isStudent}
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
          {isStudent ? `Sign in as ${ROLES.student.label}` : `Sign in as ${ROLES[roleKey].label}`}
        </Button>
      </form>

      {!isStudent && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
          <p className="font-semibold text-primary">Demo credentials</p>
          <p className="mt-0.5 text-slate-600">Email: {ROLES[roleKey].email}</p>
          <p className="text-slate-600">Password: {ROLES[roleKey].password}</p>
        </div>
      )}
    </motion.div>
  );
}
