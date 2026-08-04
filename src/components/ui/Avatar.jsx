import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/format';

/**
 * Reusable Avatar with color-from-name fallback.
 * Displays <img> when `src` is provided, otherwise shows initials.
 */
export default function Avatar({ src, name = '', size = 'md', className }) {
  const SIZES = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };
  const HASH = [
    'bg-primary-100 text-primary-700',
    'bg-accent-100 text-accent-700',
    'bg-secondary-100 text-secondary-700',
    'bg-warning-100 text-warning-700',
    'bg-sky-100 text-sky-700',
    'bg-rose-100 text-rose-700',
  ];
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  const toneClass = HASH[Math.abs(h) % HASH.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('inline-block rounded-full object-cover ring-2 ring-white', SIZES[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold select-none',
        toneClass,
        SIZES[size],
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
