import { cn } from '../../utils/cn';

/**
 * Reusable Badge.
 * tone: primary | secondary | success | warning | danger | info | muted
 */
const TONE_MAP = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary-600',
  success: 'bg-accent/10 text-accent-600',
  warning: 'bg-warning/10 text-warning-600',
  danger: 'bg-danger/10 text-danger-600',
  info: 'bg-sky-50 text-sky-600',
  muted: 'bg-slate-100 text-slate-500',
};

export default function Badge({ tone = 'muted', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        TONE_MAP[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
