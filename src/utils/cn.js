/**
 * Lightweight className combiner (no external deps).
 * Filters out falsy values and joins with a space.
 *   cn('a', cond && 'b', undefined) => 'a b'
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
