import { useMemo, useState } from 'react';
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Badge, Card } from '../../components/ui';
import { PageLoader } from '../../components/ui/Loader';
import { cn } from '../../utils/cn';

const TABS = [
  { id: 'attendance', label: 'Attendance', icon: FiCalendar },
  { id: 'results', label: 'Results', icon: FiBookOpen },
];

export default function StudentHome() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');

  const { data: attendanceData, loading: attendanceLoading } = useFetch(
    () => api.getAttendance(),
    []
  );
  const { data: resultsData, loading: resultsLoading } = useFetch(
    () => api.getResults(),
    []
  );

  const studentName = user?.name || 'Aarav Sharma';

  const attendanceRecord = useMemo(() => {
    if (!attendanceData?.records?.length) return null;
    return (
      attendanceData.records.find((record) => record.name === studentName) ||
      attendanceData.records[0]
    );
  }, [attendanceData, studentName]);

  const resultRecord = useMemo(() => {
    if (!resultsData?.length) return null;
    return (
      resultsData.find((record) => record.name === studentName) || resultsData[0]
    );
  }, [resultsData, studentName]);

  const attendanceStats = useMemo(() => {
    const baseAttendance = attendanceRecord?.status === 'Absent' ? 86 : attendanceRecord?.status === 'Late' ? 89 : 92;
    return {
      percentage: baseAttendance,
      presentDays: attendanceRecord?.status === 'Absent' ? 31 : 34,
      absentDays: attendanceRecord?.status === 'Absent' ? 4 : 2,
      lateDays: attendanceRecord?.status === 'Late' ? 1 : 0,
      status: attendanceRecord?.status || 'Present',
    };
  }, [attendanceRecord]);

  if (attendanceLoading || resultsLoading) {
    return <PageLoader label="Loading your student portal…" />;
  }

  const attendanceCards = [
    {
      key: 'percent',
      label: 'Attendance',
      value: attendanceStats.percentage,
      suffix: '%',
      icon: FiTrendingUp,
      tone: 'primary',
      hint: 'This month',
    },
    {
      key: 'present',
      label: 'Present Days',
      value: attendanceStats.presentDays,
      icon: FiCheckCircle,
      tone: 'accent',
      hint: 'so far',
    },
    {
      key: 'absent',
      label: 'Absent Days',
      value: attendanceStats.absentDays,
      icon: FiClock,
      tone: 'warning',
      hint: 'needs follow-up',
    },
    {
      key: 'late',
      label: 'Late Arrivals',
      value: attendanceStats.lateDays,
      icon: FiCalendar,
      tone: 'secondary',
      hint: 'today / this term',
    },
  ];

  const resultCards = [
    {
      key: 'total',
      label: 'Total Marks',
      value: resultRecord?.total ?? 355,
      icon: FiAward,
      tone: 'primary',
      hint: 'out of 400',
    },
    {
      key: 'percent',
      label: 'Percentage',
      value: resultRecord?.percentage ?? 88.75,
      suffix: '%',
      icon: FiTrendingUp,
      tone: 'accent',
      hint: 'overall',
    },
    {
      key: 'grade',
      label: 'Grade',
      value: resultRecord?.grade ?? 'A',
      icon: FiBookOpen,
      tone: 'secondary',
      hint: 'current term',
    },
    {
      key: 'rank',
      label: 'Rank',
      value: resultRecord?.rank ?? 2,
      icon: FiAward,
      tone: 'warning',
      hint: 'in class',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Student Portal"
        description={`Track your attendance and latest results for ${studentName}.`}
        breadcrumbs={[{ label: 'Student' }]}
      />

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-hairline bg-white p-2 shadow-card">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                active
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-slate-600 hover:bg-canvas hover:text-ink'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'attendance' ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {attendanceCards.map((card) => (
              <StatCard key={card.key} stat={card} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Attendance overview</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your current status for today is{' '}
                    <span className="font-semibold text-ink">{attendanceRecord?.status || 'Present'}</span>.
                  </p>
                </div>
                <Badge
                  tone={
                    attendanceStats.status === 'Absent'
                      ? 'danger'
                      : attendanceStats.status === 'Late'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {attendanceStats.status}
                </Badge>
              </div>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold tracking-tight text-ink">
                      {attendanceStats.percentage}%
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Overall attendance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">Goal: 95%</p>
                    <p className="text-xs text-slate-400">Keep it consistent</p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${attendanceStats.percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Present</p>
                  <p className="mt-1 text-lg font-bold text-ink">{attendanceStats.presentDays}</p>
                </div>
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Absent</p>
                  <p className="mt-1 text-lg font-bold text-ink">{attendanceStats.absentDays}</p>
                </div>
                <div className="rounded-xl bg-canvas p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Late</p>
                  <p className="mt-1 text-lg font-bold text-ink">{attendanceStats.lateDays}</p>
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-sm font-semibold text-ink">This term snapshot</p>
              <div className="mt-4 space-y-3">
                {[
                  { month: 'July', value: 91, tone: 'accent' },
                  { month: 'August', value: 93, tone: 'primary' },
                  { month: 'September', value: 92, tone: 'secondary' },
                ].map((item) => (
                  <div key={item.month}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.month}</span>
                      <span className="font-semibold text-ink">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          item.tone === 'accent' && 'bg-accent',
                          item.tone === 'primary' && 'bg-primary',
                          item.tone === 'secondary' && 'bg-secondary'
                        )}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {resultCards.map((card) => (
              <StatCard key={card.key} stat={card} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Performance summary</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest marks and grade for the current term.
                  </p>
                </div>
                <Badge tone="success">{resultRecord?.grade ?? 'A'}</Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ['Mathematics', resultRecord?.maths ?? 92],
                  ['Science', resultRecord?.science ?? 88],
                  ['English', resultRecord?.english ?? 85],
                  ['Social', resultRecord?.social ?? 90],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-hairline bg-canvas p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-bold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className="text-sm font-semibold text-ink">Result status</p>
              <div className="mt-4 rounded-2xl border border-hairline bg-canvas p-4">
                <p className="text-sm text-slate-500">Current status</p>
                <p className="mt-2 text-2xl font-bold text-ink">{resultRecord?.status ?? 'Pass'}</p>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                    style={{ width: `${resultRecord?.percentage ?? 88.75}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Great progress this term — keep the momentum going.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
