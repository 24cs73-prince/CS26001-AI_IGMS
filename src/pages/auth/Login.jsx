import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiInfo,
  FiUserCheck,
  FiShield,
  FiUser,
  FiKey,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ROLES, ROLE_ORDER } from "../../constants/app";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { cn } from "../../utils/cn";

/**
 * Login page. Frontend-only role-based auth simulation aligned with the
 * requested hierarchy: Super Admin -> School -> Principal -> Teacher/Student/Parent.
 */
const ROLE_ICONS = {
  super_admin: FiShield,
  principal: FiUserCheck,
  teacher: FiUserCheck,
  student: FiUser,
  parent: FiUsers,
};

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [roleKey, setRoleKey] = useState("super_admin");
  const role = ROLES[roleKey] || ROLES.super_admin;

  const [form, setForm] = useState({
    email: role.credentials.email,
    password: "Super@123",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectRole = (key) => {
    const selectedRole = ROLES[key] || ROLES.super_admin;
    const placeholderPassword =
      selectedRole.key === "super_admin"
        ? "Super@123"
        : selectedRole.key === "principal"
          ? "Principal@123"
          : selectedRole.key === "teacher"
            ? "Teacher@123"
            : selectedRole.key === "parent"
              ? "Parent@123"
              : "Student@123";

    setRoleKey(key);
    setForm({
      email: selectedRole.credentials.email,
      password: placeholderPassword,
    });
    setError("");
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!form.password || !form.password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const user = await login({
        email: form.email,
        password: form.password,
        role: roleKey,
      });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      if (user.mustChangePassword) {
        navigate("/change-password", { replace: true });
      } else {
        navigate(user.home, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({
      email: role.credentials.email,
      password: role.credentials.password || "password",
    });
    setError("");
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
      <div className="mb-6">
        <p className="mb-2 text-[13px] font-medium text-slate-700">I am a…</p>
        <div className="grid grid-cols-3 gap-2">
          {ROLE_ORDER.map((key) => {
            const Icon = ROLE_ICONS[key];
            const active = roleKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectRole(key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-hairline bg-white hover:border-slate-300 hover:bg-canvas",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-primary" : "text-slate-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    active ? "text-primary" : "text-slate-600",
                  )}
                >
                  {ROLES[key].label}
                </span>
              </button>
            );
          })}
        </div>
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
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-hairline text-primary focus:ring-primary/30"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:text-primary-700"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          iconRight={FiArrowRight}
          className="w-full"
        >
          Sign in as {role.label}
        </Button>
      </form>

      {/* Demo credentials helper — reflects the selected role */}
      <button
        type="button"
        onClick={fillDemo}
        className="mt-6 flex w-full items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
      >
        <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-xs">
          <p className="font-semibold text-primary">
            {role.label} demo credentials (click to fill)
          </p>
          <p className="mt-0.5 text-slate-600">
            Email: {role.credentials.email}
          </p>
          <p className="text-slate-600">
            Password:{" "}
            {role.credentials.passwordHash
              ? "••••••••"
              : role.credentials.password}
          </p>
        </div>
      </button>
    </motion.div>
  );
}
