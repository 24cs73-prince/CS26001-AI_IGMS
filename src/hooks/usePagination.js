import { useMemo, useState } from 'react';
import { paginate, pageCount } from '../utils/filter';

/** Client-side pagination state + derived slice for a dataset. */
export function usePagination(rows, pageSize = 8) {
  const [page, setPage] = useState(1);
  const total = rows.length;
  const totalPages = pageCount(total, pageSize);

  // Clamp current page if the dataset shrinks (e.g. after filtering)
  const current = Math.min(page, totalPages);

  const pageRows = useMemo(
    () => paginate(rows, current, pageSize),
    [rows, current, pageSize]
  );

  return {
    page: current,
    setPage,
    totalPages,
    total,
    pageRows,
    pageSize,
  };
}
