import { cn } from "../../utils/cn";

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
  title,
  subtitle,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline transition-all duration-200",
        glass ? "bg-white/70 backdrop-blur-xl" : "bg-white shadow-card",
        padding && "p-5 md:p-6",
        hover && "hover:shadow-lift hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
