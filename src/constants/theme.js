/**
 * Central chart/status color tokens mirrored from tailwind.config.js.
 * Kept here so JS (charts, inline styles) can reference the same palette.
 */
export const COLORS = {
  primary: '#2563EB',
  secondary: '#4F46E5',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  slate: '#1E293B',
  muted: '#94A3B8',
  canvas: '#F8FAFC',
  hairline: '#E2E8F0',
};

// Ordered palette for multi-series charts
export const CHART_PALETTE = [
  '#2563EB',
  '#10B981',
  '#F59E0B',
  '#4F46E5',
  '#EF4444',
  '#0EA5E9',
];

// Status → semantic color mapping used by Badge across the app
export const STATUS_TONE = {
  Active: 'success',
  Inactive: 'muted',
  Present: 'success',
  Absent: 'danger',
  Late: 'warning',
  'On Leave': 'warning',
  Upcoming: 'info',
  Ongoing: 'warning',
  Completed: 'success',
  Scheduled: 'info',
  Pinned: 'primary',
  Pass: 'success',
  Fail: 'danger',
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
};
