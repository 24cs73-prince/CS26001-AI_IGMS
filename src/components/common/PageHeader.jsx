import Breadcrumb from "./Breadcrumb";

/**
 * Page-level heading with breadcrumb and optional action button slot.
 * Formatted with Government of Gujarat theme styling.
 */
export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-1 border-b border-slate-200/80 pb-4">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex flex-wrap items-start justify-between gap-3 mt-1">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17395f]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
