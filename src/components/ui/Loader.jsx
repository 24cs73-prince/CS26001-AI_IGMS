import { cn } from '../../utils/cn';

/** Reusable spinner. sizes: xs sm md lg. tones: primary white muted */
export default function Loader({ size = 'md', tone = 'primary', className, label }) {
  const SIZES = { xs: 'h-4 w-4 border-2', sm: 'h-5 w-5 border-2', md: 'h-7 w-7 border-[3px]', lg: 'h-10 w-10 border-4' };
  const TONES = {
    primary: 'border-primary/25 border-t-primary',
    white: 'border-white/40 border-t-white',
    muted: 'border-slate-300 border-t-slate-500',
  };
  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="status" aria-live="polite">
      <span className={cn('inline-block animate-spin rounded-full', SIZES[size], TONES[tone])} />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </span>
  );
}

/** Full-area centered loader for page/section loading states. */
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Loader size="lg" label={label} />
    </div>
  );
}

/** Skeleton block for content placeholders. */
export function Skeleton({ className }) {
  return <div className={cn('skeleton h-4 w-full', className)} />;
}
