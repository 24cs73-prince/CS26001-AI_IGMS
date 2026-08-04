import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { navForRole } from '../constants/navigation';
import { APP } from '../constants/app';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

/**
 * Application sidebar.
 * - Desktop: fixed, always visible.
 * - Mobile: slide-in drawer controlled by `open` / `onClose`.
 */
function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-primary text-white shadow-soft'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  const { roleKey } = useAuth();
  const navGroups = navForRole(roleKey);
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M12 3l9 4-9 4-9-4 9-4z" fill="currentColor" opacity="0.9" />
            <path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">{APP.name}</p>
          <p className="text-[10px] text-slate-400">{APP.shortTagline}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
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

      {/* Footer card */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
          <p className="text-xs font-semibold text-white">Academic Year</p>
          <p className="mt-0.5 text-lg font-bold text-white">{APP.academicYear}</p>
          <p className="mt-1 text-[10px] text-slate-400">{APP.org}</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar lg:block">
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
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
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
