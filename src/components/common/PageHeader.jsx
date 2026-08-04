import Breadcrumb from './Breadcrumb';

/**
 * Page-level heading with breadcrumb and optional action button slot.
 */
export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex flex-wrap items-start justify-between gap-3 mt-1">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
