import { useMemo, useState } from 'react';
import { FiAward, FiTrendingUp, FiUsers, FiPercent } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { classStatistics, gradeDistribution } from '../data/results';
import { STATUS_TONE } from '../constants/theme';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import { Badge, Avatar, Table, Card, Dropdown } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { SimpleBarChart } from '../components/charts';

/**
 * Results page: class statistics, grade distribution chart, and result table.
 */
export default function Results() {
  const { data: results, loading } = useFetch(() => api.getResults(), []);
  const [classFilter, setClassFilter] = useState({ value: 'all', label: 'All Classes' });

  const filtered = useMemo(() => {
    if (!results) return [];
    if (classFilter.value === 'all') return results;
    return results.filter((r) => r.className === classFilter.value);
  }, [results, classFilter]);

  if (loading) return <PageLoader label="Loading results…" />;

  const perfCards = [
    { key: 'a', label: 'Class Average', value: 78.4, suffix: '%', icon: FiTrendingUp, tone: 'primary', hint: 'across all classes' },
    { key: 'b', label: 'Pass Rate', value: 96.3, suffix: '%', icon: FiPercent, tone: 'accent', hint: 'this term' },
    { key: 'c', label: 'Top Performer', value: 'Myra J.', icon: FiAward, tone: 'warning', hint: '95% · Class 11' },
    { key: 'd', label: 'Total Appeared', value: 257, icon: FiUsers, tone: 'secondary', hint: 'students' },
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...[...new Set(results.map((r) => r.className))].map((c) => ({ value: c, label: c })),
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
            <p className="text-xs text-slate-400">{r.className} · {r.section}</p>
          </div>
        </div>
      ),
    },
    { key: 'maths', header: 'Maths', align: 'center' },
    { key: 'science', header: 'Science', align: 'center' },
    { key: 'english', header: 'English', align: 'center' },
    { key: 'social', header: 'Social', align: 'center' },
    { key: 'total', header: 'Total', align: 'center', render: (r) => <span className="font-semibold">{r.total}</span> },
    { key: 'percentage', header: '%', align: 'center', render: (r) => <span className="font-semibold text-primary">{r.percentage}%</span> },
    { key: 'grade', header: 'Grade', align: 'center', render: (r) => <Badge tone={r.grade.startsWith('A') ? 'success' : r.grade === 'D' ? 'danger' : 'info'}>{r.grade}</Badge> },
    { key: 'status', header: 'Result', align: 'center', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Results"
        description="Examination results, grades, and class-wise statistics."
        breadcrumbs={[{ label: 'Results' }]}
        action={<Dropdown options={classOptions} value={classFilter} onChange={setClassFilter} className="w-44" align="right" />}
      />

      {/* Performance cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {perfCards.map((c) => <StatCard key={c.key} stat={c} />)}
      </div>

      {/* Class stats + grade chart */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-ink">Class Statistics</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {classStatistics.map((c) => (
              <div key={c.className} className="rounded-xl border border-hairline p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{c.className}</p>
                  <Badge tone="success">{c.pass}% pass</Badge>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Average</p>
                    <p className="text-lg font-bold text-primary">{c.avg}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Top · {c.appeared} appeared</p>
                    <p className="text-sm font-medium text-ink">{c.top}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${c.avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="Grade Distribution" subtitle="Students per grade band">
          <SimpleBarChart data={gradeDistribution.map((g) => ({ grade: g.grade, value: g.count }))} height={220} color="#10B981" />
        </ChartCard>
      </div>

      {/* Result table */}
      <Card padding={false} className="mt-4">
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-ink">Detailed Results</h3>
          <span className="text-xs text-slate-400">{filtered.length} students</span>
        </div>
        <Table columns={columns} data={filtered} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
