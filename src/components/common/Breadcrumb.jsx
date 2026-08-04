import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

/**
 * Breadcrumb navigation showing the current page path.
 * @param {Array<{label: string, to?: string}>} items
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link to="/dashboard" className="text-slate-400 hover:text-primary transition-colors" aria-label="Home">
        <FiHome className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
            {isLast ? (
              <span className="font-medium text-ink truncate max-w-[200px]">{item.label}</span>
            ) : (
              <Link to={item.to || '#'} className="text-slate-500 hover:text-primary transition-colors truncate max-w-[200px]">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
