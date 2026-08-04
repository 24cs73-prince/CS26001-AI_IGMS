import { forwardRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/**
 * Reusable search input with clear button.
 */
const SearchBox = forwardRef(function SearchBox(
  { value, onChange, placeholder = 'Search…', className, ...props },
  ref
) {
  return (
    <div className={cn('relative', className)}>
      <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block h-10 w-full rounded-xl border border-hairline bg-white pl-10 pr-9 text-sm text-ink shadow-soft placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"
          aria-label="Clear search"
        >
          <FiX className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
});

export default SearchBox;
