import { FiTrendingUp, FiTrendingDown, FiDownload } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';

import PageHeader from '../components/common/PageHeader';
import ChartCard from '../components/common/ChartCard';
import { Button, Card } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { SimpleAreaChart, SimpleBarChart, DonutChart } from '../components/charts';
import { cn } from '../utils/cn';
import { useToast } from '../context/ToastContext';

/**
 * Reports & Analytics page: summary cards + multiple charts.
 */
export default function Reports() {
  const { data: reports, loading } = useFetch(() => api.getReports(), []);
  const toast = useToast();

  if (loading || !reports) return <PageLoader label="Loading analytics…" />;

  const { summary, subjectPerformance, genderSplit, admissionsTrend, feeCollection } = reports;

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Institution-wide insights and performance metrics."
        breadcrumbs={[{ label: 'Reports & Analytics' }]}
        action={<Button variant="outline" icon={FiDownload} onClick={() => toast.info('Report export started (demo).')}>Download Report</Button>}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.key} className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-ink">{s.value}{s.suffix || ''}</span>
              <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', s.trend === 'up' ? 'text-accent-600' : 'text-danger-600')}>
                {s.trend === 'up' ? <FiTrendingUp className="h-3 w-3" /> : <FiTrendingDown className="h-3 w-3" />}
                {s.delta}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Admissions Trend" subtitle="New admissions per academic year" className="lg:col-span-2">
          <SimpleAreaChart data={admissionsTrend.map((a) => ({ month: a.year, value: a.admissions }))} height={210} color="#2563EB" />
        </ChartCard>

        <ChartCard title="Gender Ratio" subtitle="Student distribution">
          <div className="p-4">
            <DonutChart data={genderSplit} centerLabel="Students" size={150} />
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Subject Performance" subtitle="Average score by subject">
          <SimpleBarChart data={subjectPerformance.map((s) => ({ label: s.subject, value: s.score }))} height={210} color="#4F46E5" />
        </ChartCard>

        {/* Fee collection progress */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-ink">Fee Collection Status</h3>
          <div className="space-y-4">
            {feeCollection.map((f) => (
              <div key={f.month}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{f.month}</span>
                  <span className="text-slate-400">{f.collected}% collected</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-l-full bg-accent" style={{ width: `${f.collected}%` }} />
                  <div className="h-full bg-danger/40" style={{ width: `${f.pending}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent" /> Collected</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-danger/40" /> Pending</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
