import { cn } from '../../utils/cn';

/**
 * Reusable Card surface.
 * Supports interactive (hover lift) and glass variants.
 */
export default function Card({
  children,
  className,
  padding = true,
  hover = false,
  glass = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-hairline transition-all duration-200',
        glass
          ? 'bg-white/70 backdrop-blur-xl'
          : 'bg-white shadow-card',
        padding && 'p-5 md:p-6',
        hover && 'hover:shadow-lift hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
