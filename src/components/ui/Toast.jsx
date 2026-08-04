import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/** Icon + accent per toast type. */
const CONFIG = {
  success: { icon: FiCheckCircle, ring: 'text-accent', bar: 'bg-accent' },
  error: { icon: FiXCircle, ring: 'text-danger', bar: 'bg-danger' },
  warning: { icon: FiAlertTriangle, ring: 'text-warning', bar: 'bg-warning' },
  info: { icon: FiInfo, ring: 'text-primary', bar: 'bg-primary' },
};

/**
 * Toast viewport rendered once by ToastProvider.
 * Individual toasts animate in/out from the top-right.
 */
export default function ToastViewport({ toasts = [], onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const cfg = CONFIG[t.type] || CONFIG.info;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border border-hairline bg-white p-4 pr-10 shadow-lift"
            >
              <span className={cn('absolute inset-y-0 left-0 w-1', cfg.bar)} />
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', cfg.ring)} />
              <div className="min-w-0">
                {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                <p className="text-sm text-slate-600">{t.message}</p>
              </div>
              <button
                onClick={() => onDismiss(t.id)}
                className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink"
                aria-label="Dismiss"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
