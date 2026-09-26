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
  FiVolume2,
  FiGlobe,
  FiShield,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/ui/Avatar";

/**
 * Government Portal Top Navbar
 * Features:
 * - Language switcher (English / Gujarati)
 * - Font Size scaler (A-, A, A+)
 * - Screen Reader audio trigger
 * - State Emblem header logo
 * - Notifications & Account dropdown menu
 */
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [fontScale, setFontScale] = useState(1);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = "100%";
    };
  }, [fontScale]);

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
    toast.info("Signed out from Government School Portal.");
    navigate("/login");
  };

  const handleScreenReader = () => {
    toast.info("Screen reader speech synthesizer triggered.");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        lang === "gu"
          ? "ગુજરાત સરકાર શાળા શિક્ષણ વિભાગ સંચાલન પોર્ટલ. સ્ક્રીન રીડર સક્રિય છે."
          : "Government of Gujarat School Education Department Management Portal. Screen reader accessibility mode active.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const notifications = [
    {
      id: 1,
      title: "State Directorate mid-term datesheet published",
      time: "10m ago",
      tone: "bg-blue-600",
    },
    {
      id: 2,
      title: "Gyan Sadhana Scholarship quota updated",
      time: "45m ago",
      tone: "bg-emerald-600",
    },
    {
      id: 3,
      title: "New Principal account created for Gandhinagar High",
      time: "2h ago",
      tone: "bg-purple-600",
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md lg:px-6 shadow-xs">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none"
        aria-label="Open menu"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* State Emblem Branding for desktop */}
      <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-slate-200">
        <img
          src="/images/ashok_stambh.avif"
          alt="State Emblem of India"
          className="h-9 w-auto object-contain"
        />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Government of Gujarat
          </p>
          <p className="text-xs font-extrabold text-[#17395f]">
            School Education Portal
          </p>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative hidden max-w-xs flex-1 md:block lg:max-w-md">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search schools, principals, teachers, students..."
          className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Top Accessibility Bar Controls */}
        <div className="hidden xl:flex items-center gap-2 rounded-xl bg-slate-100/80 p-1 text-[11px] font-bold text-slate-700">
          <button
            onClick={() => setFontScale(0.92)}
            title="Decrease font size"
            className={`px-2 py-1 rounded-lg transition ${
              fontScale === 0.92 ? "bg-white text-[#17395f] shadow-xs font-extrabold" : "hover:text-blue-700"
            }`}
          >
            A-
          </button>
          <button
            onClick={() => setFontScale(1)}
            title="Reset font size"
            className={`px-2 py-1 rounded-lg transition ${
              fontScale === 1 ? "bg-white text-[#17395f] shadow-xs font-extrabold" : "hover:text-blue-700"
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontScale(1.08)}
            title="Increase font size"
            className={`px-2 py-1 rounded-lg transition ${
              fontScale === 1.08 ? "bg-white text-[#17395f] shadow-xs font-extrabold" : "hover:text-blue-700"
            }`}
          >
            A+
          </button>
        </div>

        <button
          onClick={handleScreenReader}
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
          title="Screen Reader Accessibility"
        >
          <FiVolume2 className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden xl:inline">Screen Reader</span>
        </button>

        {/* Secure Portal Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
          <FiLock className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Portal</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-50"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <p className="text-xs font-bold text-[#17395f]">
                    State System Notifications
                  </p>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    3 new
                  </span>
                </div>
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.tone}`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100 transition-colors"
          >
            <Avatar name={user?.name || "Admin"} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-bold leading-tight text-[#17395f]">
                {user?.name?.split(" ")[0] || "Super Admin"}
              </span>
              <span className="block text-[10px] font-semibold leading-tight text-blue-600">
                {user?.roleKey === "super_admin" ? "Super Admin" : user?.role || "Official"}
              </span>
            </span>
            <FiChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-50"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold text-[#17395f]">
                    {user?.name || "Super Administrator"}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 font-mono mt-0.5">
                    {user?.email || "superadmin@igms.gov.in"}
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-800">
                    {user?.roleKey === "super_admin" ? "State Directorate Officer" : user?.role}
                  </span>
                </div>

                <div className="p-1.5 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/change-password");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FiSettings className="h-4 w-4 text-slate-400" /> Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-bold text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4 text-red-500" /> Sign Out
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
