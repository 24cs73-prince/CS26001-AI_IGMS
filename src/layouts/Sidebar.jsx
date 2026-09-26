import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShield } from "react-icons/fi";
import { navForRole } from "../constants/navigation";
import { APP } from "../constants/app";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

/**
 * Official Government of Gujarat School Portal Sidebar
 * Features:
 * - State Emblem branding
 * - Official Deep Navy (#0f2b4d) Government Theme
 * - Active Gold & Blue navigation indicators
 */
function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-md border-l-4 border-amber-400"
            : "text-blue-100/80 hover:bg-white/10 hover:text-white"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-amber-300" : "text-blue-200/70 group-hover:text-white"
            )}
          />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  const { roleKey, user } = useAuth();
  const navGroups = navForRole(roleKey);

  return (
    <div className="flex h-full flex-col bg-[#0f2b4d] text-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 backdrop-blur-xs">
          <img
            src="/images/ashok_stambh.avif"
            alt="State Emblem of India"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 truncate">
            Government of Gujarat
          </p>
          <p className="text-sm font-extrabold text-white truncate">
            School Education Dept.
          </p>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
        <FiShield className="h-4 w-4 text-emerald-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
            {roleKey === "super_admin" ? "Super Admin Portal" : user?.role || "Active User"}
          </p>
          <p className="text-[11px] text-blue-200/80 truncate">
            {user?.name || "State Official"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-blue-300/60">
              {group.heading}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer System Card */}
      <div className="p-3 border-t border-white/10">
        <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-slate-900/80 p-3.5 border border-white/10 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
            Directorate System
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-white">
            {APP.academicYear}
          </p>
          <p className="mt-1 text-[10px] text-blue-200/70">{APP.org}</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-[#0f2b4d] lg:block border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f2b4d] lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-4 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
