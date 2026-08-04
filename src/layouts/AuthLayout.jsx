import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP } from '../constants/app';

/**
 * Authentication layout: split-screen with a branded hero panel on the left
 * (desktop) and the form outlet on the right.
 */
export default function AuthLayout() {
  const highlights = [
    'Unified student & teacher management',
    'AI-assisted question papers & analytics',
    'Real-time attendance and examination tracking',
  ];

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Brand / hero panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between p-12">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lift">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path d="M12 3l9 4-9 4-9-4 9-4z" fill="currentColor" />
              <path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{APP.name}</p>
            <p className="text-xs text-slate-400">{APP.shortTagline}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md"
        >
          <h1 className="text-3xl font-bold leading-tight text-white">
            The modern operating system for government schools.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Manage academics, attendance, examinations and insights from one
            secure, AI-enabled platform designed for public education.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current"><path d="M7.5 13.5l-3-3 1-1 2 2 5-5 1 1z" /></svg>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} {APP.org}
        </p>
      </div>

      {/* Form area */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <Outlet />
      </div>
    </div>
  );
}
