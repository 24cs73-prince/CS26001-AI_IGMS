import { cn } from '../../utils/cn';

/**
 * Wrapper card for a chart: white surface with a title, subtitle,
 * optional action, and the chart content below.
 */
export default function ChartCard({ title, subtitle, action, children, className }) {
  return (
    <div className={cn('card-surface flex flex-col', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2 p-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 px-1 py-2">{children}</div>
    </div>
  );
}
