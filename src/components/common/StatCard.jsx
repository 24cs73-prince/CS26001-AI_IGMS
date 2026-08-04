import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/**
 * Premium stat card with icon, value, delta indicator, and subtle animation.
 */
export default function StatCard({ stat, className }) {
  if (!stat) return null;
  const { label, value, suffix = '', delta, trend = 'up', icon: Icon, tone = 'primary', hint } = stat;

  const TONES = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('card-surface p-5 md:p-6 flex flex-col gap-3', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', TONES[tone])}>
          {Icon && <Icon className="h-5 w-5" />}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[28px] font-bold leading-none tracking-tight text-ink">
          {value}{suffix}
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold',
              trend === 'up' ? 'bg-accent/10 text-accent-600' : 'bg-danger/10 text-danger-600'
            )}
          >
            {trend === 'up' ? (
              <FiTrendingUp className="h-3 w-3" />
            ) : (
              <FiTrendingDown className="h-3 w-3" />
            )}
            {delta}%
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </motion.div>
  );
}
