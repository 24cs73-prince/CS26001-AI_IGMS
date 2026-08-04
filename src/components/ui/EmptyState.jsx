import { FiInbox } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/** Reusable empty-state placeholder for tables/lists with no data. */
export default function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description = 'There is no data to display at the moment.',
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
