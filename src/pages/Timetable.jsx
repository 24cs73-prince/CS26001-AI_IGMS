import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import { PageLoader } from '../components/ui/Loader';
import { Card, Dropdown } from '../components/ui';
import { cn } from '../utils/cn';
import { useState } from 'react';

/**
 * Weekly Timetable page: modern colored card grid (days × periods).
 */
const TONE_CLASS = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  accent: 'bg-accent/10 text-accent-700 border-accent/20',
  secondary: 'bg-secondary/10 text-secondary-700 border-secondary/20',
  warning: 'bg-warning/10 text-warning-700 border-warning/20',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  danger: 'bg-danger/10 text-danger-600 border-danger/20',
  muted: 'bg-slate-50 text-slate-400 border-slate-200',
};

export default function Timetable() {
  const { data: tt, loading } = useFetch(() => api.getTimetable(), []);
  const [section, setSection] = useState({ value: '10A', label: 'Class 10 · Section A' });

  if (loading || !tt) return <PageLoader label="Loading timetable…" />;

  const sectionOptions = [
    { value: '10A', label: 'Class 10 · Section A' },
    { value: '10B', label: 'Class 10 · Section B' },
    { value: '9A', label: 'Class 9 · Section A' },
  ];

  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Weekly class schedule at a glance."
        breadcrumbs={[{ label: 'Timetable' }]}
        action={<Dropdown options={sectionOptions} value={section} onChange={setSection} className="w-56" align="right" />}
      />

      <Card padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header row: period times */}
            <div className="grid grid-cols-[120px_repeat(7,1fr)] border-b border-hairline bg-canvas/60">
              <div className="p-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Day / Time</div>
              {tt.periods.map((p) => (
                <div key={p} className="border-l border-hairline p-3 text-center text-[11px] font-medium text-slate-500">{p}</div>
              ))}
            </div>

            {/* Day rows */}
            {tt.days.map((day) => (
              <div key={day} className="grid grid-cols-[120px_repeat(7,1fr)] border-b border-hairline last:border-b-0">
                <div className="flex items-center bg-canvas/40 p-3 text-sm font-semibold text-ink">{day}</div>
                {tt.grid[day].map((cell, idx) => (
                  <div key={idx} className="border-l border-hairline p-2">
                    <div className={cn('flex h-full min-h-[64px] flex-col justify-center rounded-lg border px-2.5 py-1.5 transition-transform hover:scale-[1.02]', TONE_CLASS[cell.tone])}>
                      <p className="text-[12px] font-semibold leading-tight">{cell.subject}</p>
                      {cell.teacher && <p className="text-[10px] opacity-75">{cell.teacher}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        {['primary', 'accent', 'secondary', 'warning', 'info', 'danger'].map((tone) => (
          <span key={tone} className="flex items-center gap-1.5">
            <span className={cn('h-3 w-3 rounded border', TONE_CLASS[tone])} />
            <span className="capitalize">{tone === 'info' ? 'computer sci.' : tone}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
