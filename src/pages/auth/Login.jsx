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
  FiUsers,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ROLES, ROLE_ORDER } from "../../constants/app";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { cn } from "../../utils/cn";

/**
 * AI-IGMS - Integrated Government School Management System
 * Compact & High-Efficiency Government Portal Sign-In Panel
 * Designed to fit completely within the viewport without requiring vertical scrolling.
 */

const ROLE_ICONS = {
  super_admin: FiShield,
  principal: FiUserCheck,
  teacher: FiUserCheck,
  student: FiUser,
  parent: FiUsers,
};

const ROLE_STYLES = {
  super_admin: {
    active: "border-[#17395f] bg-[#f0f4f9] text-[#17395f] ring-2 ring-[#17395f]/20 shadow-sm",
    badge: "bg-[#17395f] text-white",
    iconBg: "bg-[#17395f] text-white",
    tag: "Directorate Level",
  },
  principal: {
    active: "border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-700/20 shadow-sm",
    badge: "bg-blue-700 text-white",
    iconBg: "bg-blue-700 text-white",
    tag: "School Admin",
  },
  teacher: {
    active: "border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-700/20 shadow-sm",
    badge: "bg-emerald-700 text-white",
    iconBg: "bg-emerald-700 text-white",
    tag: "Faculty Portal",
  },
  student: {
    active: "border-orange-600 bg-orange-50 text-orange-900 ring-2 ring-orange-600/20 shadow-sm",
    badge: "bg-orange-600 text-white",
    iconBg: "bg-orange-600 text-white",
    tag: "Student Portal",
  },
  parent: {
    active: "border-purple-700 bg-purple-50 text-purple-900 ring-2 ring-purple-700/20 shadow-sm",
    badge: "bg-purple-700 text-white",
    iconBg: "bg-purple-700 text-white",
    tag: "Guardian Portal",
  },
};

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [roleKey, setRoleKey] = useState("super_admin");
  const role = ROLES[roleKey] || ROLES.super_admin;
  const roleStyle = ROLE_STYLES[roleKey] || ROLE_STYLES.super_admin;

  const [form, setForm] = useState({
    email: role.credentials.email,
    password: "Super@123",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError("Enter a valid government email address.");
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
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({
      email: role.credentials.email,
      password:
        roleKey === "super_admin"
          ? "Super@123"
          : roleKey === "principal"
          ? "Principal@123"
          : roleKey === "teacher"
          ? "Teacher@123"
          : roleKey === "parent"
          ? "Parent@123"
          : "Student@123",
    });
    setError("");
    toast.info(`Filled demo credentials for ${role.label}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Official Government Card Header - Streamlined Spacing */}
      <div className="mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#17395f]/20 bg-[#f0f4f9] px-2.5 py-0.5 text-[10px] font-bold text-[#17395f]">
            <FiShield className="h-3 w-3" />
            Official Portal Sign In
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SSL 256-bit
          </span>
        </div>

        <h2 className="mt-2 text-xl font-extrabold text-[#17395f]">
          Government Education Portal
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Select authorized role and enter credentials.
        </p>
      </div>

      {/* Role Selection Options - Compact Pills */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#17395f]">
            I AM SIGNING IN AS...
          </label>
          <span className="text-[10px] font-bold text-slate-400">
            Select Role
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
          {ROLE_ORDER.map((key) => {
            const Icon = ROLE_ICONS[key];
            const active = roleKey === key;
            const style = ROLE_STYLES[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => selectRole(key)}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl border py-2 px-1.5 text-center transition-all duration-150 outline-none",
                  active
                    ? style.active
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                )}
              >
                {active && (
                  <span className="absolute right-1 top-1 text-blue-700">
                    <FiCheckCircle className="h-3 w-3" />
                  </span>
                )}

                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg shadow-sm transition",
                    active ? style.iconBg : "bg-slate-100 text-slate-500"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span className="text-[11px] font-bold leading-tight truncate max-w-full">
                  {ROLES[key].label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Role Banner */}
      <div className="mb-3.5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-md text-white font-bold", roleStyle.badge)}>
            {(() => {
              const Icon = ROLE_ICONS[roleKey];
              return <Icon className="h-3.5 w-3.5" />;
            })()}
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Active Scope
            </p>
            <p className="text-xs font-bold text-[#17395f]">
              {role.label} ({roleStyle.tag})
            </p>
          </div>
        </div>
        <span className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
          Ready
        </span>
      </div>

      {/* Login Form - Streamlined Controls */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email Input */}
        <div>
          <Input
            label="Government Email Address *"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="official@school.gov.in"
            leadingIcon={FiMail}
            autoComplete="username"
            required
            className="!py-2 text-xs"
          />
        </div>

        {/* Password Input with Visibility Toggle */}
        <div className="relative">
          <Input
            label="Password *"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            leadingIcon={FiLock}
            error={error}
            autoComplete="current-password"
            required
            className="!py-2 text-xs"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[34px] rounded-md p-1 text-slate-400 hover:text-slate-700 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff className="h-3.5 w-3.5" /> : <FiEye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-3.5 w-3.5 rounded border-slate-300 text-[#17395f] focus:ring-[#17395f]"
            />
            Remember Login
          </label>
          <button
            type="button"
            className="font-bold text-[#17395f] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="md"
          loading={loading}
          iconRight={FiArrowRight}
          className="mt-1 w-full !bg-[#17395f] hover:!bg-[#0f2744] text-white font-bold !py-2.5 text-xs shadow-md"
        >
          Sign In as {role.label}
        </Button>
      </form>

      {/* Demo Credentials Quick Fill Trigger */}
      <button
        type="button"
        onClick={fillDemo}
        className="mt-3.5 flex w-full items-center gap-2.5 rounded-xl border border-dashed border-blue-200 bg-blue-50/70 p-2.5 text-left transition hover:bg-blue-50"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-700 text-white shadow-sm">
          <FiInfo className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-blue-900 leading-tight">
            {role.label} Demo Credentials
          </p>
          <p className="truncate text-[10px] text-slate-500">
            {role.credentials.email}
          </p>
        </div>
        <span className="rounded bg-blue-700 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
          Auto-fill
        </span>
      </button>

      {/* Footer Security Note */}
      <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] text-slate-400">
        <FiShield className="h-3 w-3 text-emerald-600" />
        <span>Official Government Network • Authorized Users Only</span>
      </div>
    </motion.div>
  );
}
