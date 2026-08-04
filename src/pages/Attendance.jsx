import { useState } from 'react';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiCalendar } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { attendanceCalendar } from '../data/attendance';
import { STATUS_TONE } from '../constants/theme';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { Badge, Avatar, Table, Card } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { cn } from '../utils/cn';

/**
 * Attendance page: summary cards, calendar heat view, and today's roster table.
 */
export default function Attendance() {
  const { data, loading } = useFetch(() => api.getAttendance(), []);
  const [view, setView] = useState('table'); // table | calendar

  if (loading || !data) return <PageLoader label="Loading attendance…" />;

  const { records, summary } = data;

  const summaryCards = [
    { key: 't', label: 'Total Students', value: summary.totalStudents, icon: FiUsers, tone: 'primary', hint: 'enrolled' },
    { key: 'p', label: 'Present Today', value: summary.present, icon: FiCheckCircle, tone: 'accent', hint: `${summary.percentage}% attendance` },
    { key: 'a', label: 'Absent Today', value: summary.absent, icon: FiXCircle, tone: 'danger', hint: 'needs follow-up' },
    { key: 'l', label: 'Late Arrivals', value: summary.late, icon: FiClock, tone: 'warning', hint: 'marked late' },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-medium text-ink">{r.name}</p>
            <p className="text-xs text-slate-400">{r.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'className', header: 'Class', render: (r) => `${r.className} · ${r.section}` },
    { key: 'inTime', header: 'In-Time', align: 'center' },
    { key: 'markedBy', header: 'Marked By' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>,
    },
  ];

  const heatColor = (pct) => {
    if (pct == null) return 'bg-slate-50 text-slate-300';
    if (pct >= 95) return 'bg-accent text-white';
    if (pct >= 90) return 'bg-accent/70 text-white';
    if (pct >= 85) return 'bg-accent/40 text-accent-700';
    return 'bg-warning/40 text-warning-700';
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Daily attendance overview and student roster."
        breadcrumbs={[{ label: 'Attendance' }]}
        action={
          <div className="inline-flex rounded-xl border border-hairline bg-white p-1 shadow-soft">
            <button
              onClick={() => setView('table')}
              className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', view === 'table' ? 'bg-primary text-white' : 'text-slate-500 hover:text-ink')}
            >
              Roster
            </button>
            <button
              onClick={() => setView('calendar')}
              className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', view === 'calendar' ? 'bg-primary text-white' : 'text-slate-500 hover:text-ink')}
            >
              Calendar
            </button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <StatCard key={c.key} stat={c} />
        ))}
      </div>

      {view === 'table' ? (
        <Card padding={false} className="mt-6">
          <div className="flex items-center justify-between border-b border-hairline p-4">
            <h3 className="text-sm font-semibold text-ink">Today's Attendance</h3>
            <span className="text-xs text-slate-400">{records.length} records</span>
          </div>
          <Table columns={columns} data={records} rowKey={(r) => r.id} />
        </Card>
      ) : (
        <Card className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-ink">Monthly Attendance Heatmap</h3>
          </div>
          {/* weekday header */}
          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* offset for the first day of the month (Aug 2026 starts Saturday) */}
            {Array.from({ length: 6 }).map((_, i) => <span key={`pad-${i}`} />)}
            {attendanceCalendar.map((d) => (
              <div
                key={d.day}
                className={cn('flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold transition-transform hover:scale-105', heatColor(d.pct))}
                title={d.pct == null ? 'Holiday' : `${d.pct}% present`}
              >
                <span className="text-[11px] opacity-70">{d.day}</span>
                <span>{d.pct == null ? '—' : `${d.pct}%`}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent" /> ≥95%</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent/40" /> 85–94%</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-warning/40" /> &lt;85%</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100" /> Holiday</span>
          </div>
        </Card>
      )}
    </div>
  );
}
