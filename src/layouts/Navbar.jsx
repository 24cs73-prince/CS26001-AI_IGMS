import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/ui/Avatar";

/**
 * Top navigation bar: mobile menu toggle, global search, notifications,
 * and the user account menu.
 */
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      title: "Mid-term datesheet published",
      time: "10m ago",
      tone: "bg-primary",
    },
    {
      id: 2,
      title: "AI service running in degraded mode",
      time: "1h ago",
      tone: "bg-warning",
    },
    {
      id: 3,
      title: "Class 9 English results uploaded",
      time: "3h ago",
      tone: "bg-accent",
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-white/70 px-4 backdrop-blur-xl backdrop-saturate-150 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, teachers, notices…"
          className="h-10 w-full rounded-xl border border-hairline bg-canvas/60 pl-10 pr-4 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-hairline bg-white shadow-lift"
              >
                <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    Notifications
                  </p>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    3 new
                  </span>
                </div>
                <ul className="max-h-80 divide-y divide-hairline overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="flex gap-3 px-4 py-3 hover:bg-canvas transition-colors"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.tone}`}
                      />
                      <div>
                        <p className="text-sm text-ink">{n.title}</p>
                        <p className="text-xs text-slate-400">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 hover:bg-slate-100 transition-colors"
          >
            <Avatar name={user?.name || "Admin"} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-ink">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
              <span className="block text-[11px] leading-tight text-slate-400">
                {user?.role || "Administrator"}
              </span>
            </span>
            <FiChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-hairline bg-white shadow-lift"
              >
                <div className="border-b border-hairline px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.email || "admin@igms.gov.in"}
                  </p>
                </div>
                <div className="p-1.5">
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <FiUser className="h-4 w-4 text-slate-400" /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/change-password");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FiSettings className="h-4 w-4 text-slate-400" /> Change
                    Password
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <FiSettings className="h-4 w-4 text-slate-400" /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/5"
                  >
                    <FiLogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
