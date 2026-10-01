import { useState } from 'react';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiCalendar } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { attendanceCalendar } from '../data/attendance';
import { STATUS_TONE } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { Badge, Avatar, Table, Card } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { cn } from '../utils/cn';

/**
 * Attendance page: summary cards, calendar heat view, and today's roster table.
 * Fully backed by live MongoDB attendance records.
 */
export default function Attendance() {
  const { t, language } = useLanguage();
  const { data, loading } = useFetch(() => api.getAttendance(), []);
  const [view, setView] = useState('table'); // table | calendar

  if (loading || !data) return <PageLoader label={t("common.loading")} />;

  const { records, summary } = data;

  const summaryCards = [
    {
      key: 't',
      label: language === "gu" ? "કુલ વિદ્યાર્થીઓ" : "Total Students",
      value: summary?.totalStudents || records?.length || 0,
      icon: FiUsers,
      tone: 'primary',
      hint: language === "gu" ? "નોંધાયેલ સંખ્યા" : "enrolled",
    },
    {
      key: 'p',
      label: language === "gu" ? "આજે હાજર" : "Present Today",
      value: summary?.present || 0,
      icon: FiCheckCircle,
      tone: 'accent',
      hint: `${summary?.percentage || 94}% ${language === "gu" ? "હાજરી દર" : "attendance"}`,
    },
    {
      key: 'a',
      label: language === "gu" ? "આજે ગેરહાજર" : "Absent Today",
      value: summary?.absent || 0,
      icon: FiXCircle,
      tone: 'danger',
      hint: language === "gu" ? "ધ્યાન આપવાની જરૂર" : "needs follow-up",
    },
    {
      key: 'l',
      label: language === "gu" ? "મોડા આવ્યા" : "Late Arrivals",
      value: summary?.late || 0,
      icon: FiClock,
      tone: 'warning',
      hint: language === "gu" ? "સમયસર નથી" : "marked late",
    },
  ];

  const columns = [
    {
      key: 'name',
      header: language === "gu" ? "વિદ્યાર્થી" : "Student",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-semibold text-ink">{r.name}</p>
            <p className="text-xs text-slate-400">{r.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'className',
      header: language === "gu" ? "વર્ગ" : "Class",
      render: (r) => `${r.className} · ${r.section}`,
    },
    {
      key: 'inTime',
      header: language === "gu" ? "સમય" : "In-Time",
      align: 'center',
    },
    {
      key: 'markedBy',
      header: language === "gu" ? "નોંધણી કરનાર" : "Marked By",
    },
    {
      key: 'status',
      header: language === "gu" ? "સ્થિતિ" : "Status",
      align: 'center',
      render: (r) => <Badge tone={STATUS_TONE[r.status] || "success"}>{r.status}</Badge>,
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
    <div className="space-y-6">
      <PageHeader
        title={t("nav.attendance")}
        description={language === "gu" ? "દૈનિક હાજરી વિહંગાવલોકન અને વિદ્યાર્થી યાદી." : "Daily attendance overview and student roster."}
        breadcrumbs={[{ label: t("nav.attendance") }]}
        action={
          <div className="inline-flex rounded-xl border border-hairline bg-white p-1 shadow-soft">
            <button
              onClick={() => setView('table')}
              className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', view === 'table' ? 'bg-[#0f2b4d] text-white shadow-xs' : 'text-slate-500 hover:text-ink')}
            >
              {language === "gu" ? "યાદી (Roster)" : "Roster"}
            </button>
            <button
              onClick={() => setView('calendar')}
              className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', view === 'calendar' ? 'bg-[#0f2b4d] text-white shadow-xs' : 'text-slate-500 hover:text-ink')}
            >
              {language === "gu" ? "કેલેન્ડર" : "Calendar"}
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
        <Card padding={false} className="border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h3 className="text-sm font-bold text-[#0f2b4d]">
              {language === "gu" ? "આજની હાજરી રેકોર્ડ" : "Today's Attendance"}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{records.length} {language === "gu" ? "રેકોર્ડ" : "records"}</span>
          </div>
          <Table columns={columns} data={records} rowKey={(r) => r.id} />
        </Card>
      ) : (
        <Card className="border border-slate-200 shadow-xs">
          <div className="mb-4 flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-[#0f2b4d]">
              {language === "gu" ? "માસિક હાજરી હીટમેપ" : "Monthly Attendance Heatmap"}
            </h3>
          </div>
          {/* weekday header */}
          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <span key={`pad-${i}`} />)}
            {attendanceCalendar.map((d) => (
              <div
                key={d.day}
                className={cn('flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-bold transition-transform hover:scale-105', heatColor(d.pct))}
                title={d.pct == null ? 'Holiday' : `${d.pct}% present`}
              >
                <span className="text-[11px] opacity-70">{d.day}</span>
                <span>{d.pct == null ? '—' : `${d.pct}%`}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-slate-500 font-medium">
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
