import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/**
 * Reusable dropdown select.
 * label / value: objects or strings. Controlled via `value` + `onChange`.
 */
export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  className,
  align = 'left',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel =
    (typeof value === 'object' ? value?.label : options.find((o) => o.value === value)?.label) ||
    placeholder;

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {label && (
        <p className="mb-1.5 text-[13px] font-medium text-slate-700">{label}</p>
      )}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-hairline bg-white px-3.5 text-sm text-ink shadow-soft transition-all',
          'focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none',
          { 'text-slate-400': value === undefined || value === '' }
        )}
      >
        <span className="truncate">{currentLabel}</span>
        <FiChevronDown
          className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-30 mt-1 w-full min-w-[160px] overflow-hidden rounded-xl border border-hairline bg-white py-1 shadow-lift',
              align === 'right' && 'right-0'
            )}
          >
            {options.map((opt) => {
              const isActive = typeof value === 'object' ? value?.value === opt.value : value === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(opt);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center px-3.5 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
