import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * Reusable Input / Select / Textarea.
 * Accepts: label, error, helper, leadingIcon.
 */
const Input = forwardRef(function Input(
  { label, error, helper, className, leadingIcon: Icon, as: Comp = 'input', ...props },
  ref
) {
  const isTextarea = Comp === 'textarea';
  const base = cn(
    'block w-full rounded-xl border bg-white px-3.5 text-sm text-ink shadow-soft placeholder-slate-400 transition-all duration-150',
    'focus:border-primary focus:ring-2 focus:ring-primary/15 focus:shadow-glow',
    'focus:outline-none',
    { 'py-2.5': !isTextarea, 'py-3 min-h-[100px]': isTextarea },
    Icon && 'pl-10',
    error && 'border-danger focus:border-danger focus:ring-danger/15',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        )}
        <Comp ref={ref} className={base} {...props} />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
          <FiAlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{helper}</p>
      )}
    </div>
  );
});

export default Input;
