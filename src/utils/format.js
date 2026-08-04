/** Formatting & small data helpers used across pages. */

/** Return initials from a full name: "Aarav Sharma" -> "AS" */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

/** Format an ISO date string to e.g. "12 Aug 2026" */
export function formatDate(iso, opts = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

/** Relative time like "2h ago", "3d ago". */
export function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Format an integer with thousands separators (Indian locale). */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n ?? 0);
}

/** Deterministic pastel-ish color from a string (for avatars). */
export function colorFromString(str = '') {
  const palette = [
    'bg-primary/10 text-primary',
    'bg-accent/10 text-accent-600',
    'bg-secondary/10 text-secondary-600',
    'bg-warning/10 text-warning-600',
    'bg-danger/10 text-danger-600',
    'bg-sky-100 text-sky-600',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}
