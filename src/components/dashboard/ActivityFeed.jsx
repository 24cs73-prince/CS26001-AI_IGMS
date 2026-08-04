import { timeAgo } from '../../utils/format';

/**
 * Recent activity timeline for the dashboard.
 */
const TONES = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  warning: 'bg-warning',
  info: 'bg-sky-500',
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <ul className="space-y-4">
      {activities.map((a, i) => (
        <li key={a.id} className="relative flex gap-3 pl-1">
          {/* connector line */}
          {i !== activities.length - 1 && (
            <span className="absolute left-[7px] top-4 h-full w-px bg-hairline" />
          )}
          <span className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white ${TONES[a.tone] || 'bg-slate-400'}`} />
          <div className="min-w-0 pb-1">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-ink">{a.actor}</span> {a.action}{' '}
              <span className="font-medium text-primary">{a.target}</span>
            </p>
            <p className="text-xs text-slate-400">{timeAgo(a.time)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
