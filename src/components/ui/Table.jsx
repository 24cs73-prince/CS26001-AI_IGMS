import { cn } from '../../utils/cn';
import EmptyState from './EmptyState';

/**
 * Reusable data Table.
 * @param {Array<{key,header,align,render,className,width}>} columns
 * @param {Array<Object>} data
 * @param {Function} rowKey - returns a unique key for a row
 * @param {Function} onRowClick - optional row click handler
 */
export default function Table({
  columns = [],
  data = [],
  rowKey = (_, i) => i,
  onRowClick,
  empty,
  className,
}) {
  if (!data.length) {
    return empty || <EmptyState />;
  }

  const alignClass = (a) =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500',
                  alignClass(col.align)
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {data.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-canvas'
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'whitespace-nowrap px-4 py-3.5 text-slate-700',
                    alignClass(col.align),
                    col.className
                  )}
                >
                  {col.render ? col.render(row, i) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
