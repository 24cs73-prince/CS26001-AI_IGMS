/** Generic client-side search / paginate helpers used by tables. */

/** Case-insensitive multi-field text search. */
export function searchRows(rows, query, fields) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    fields.some((f) => String(row[f] ?? '').toLowerCase().includes(q))
  );
}

/** Slice an array for the given 1-based page and page size. */
export function paginate(rows, page, pageSize) {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

/** Total number of pages for a dataset. */
export function pageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}
