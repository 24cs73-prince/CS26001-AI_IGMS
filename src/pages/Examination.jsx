import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiClock, FiMapPin, FiUser, FiFileText } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { STATUS_TONE } from '../constants/theme';
import { formatDate } from '../utils/format';

import PageHeader from '../components/common/PageHeader';
import { Button, Badge, Card } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { cn } from '../utils/cn';
import { useToast } from '../context/ToastContext';

/**
 * Examination page: filterable exam cards + full schedule.
 */
const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Scheduled', 'Completed'];

export default function Examination() {
  const { data: exams, loading } = useFetch(() => api.getExams(), []);
  const toast = useToast();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (!exams) return [];
    if (filter === 'All') return exams;
    return exams.filter((e) => e.status === filter);
  }, [exams, filter]);

  if (loading) return <PageLoader label="Loading examinations…" />;

  const counts = exams.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Examination"
        description="Manage exam schedules, rooms, and invigilation."
        breadcrumbs={[{ label: 'Examination' }]}
        action={<Button icon={FiPlus} onClick={() => toast.success('Create exam (demo).')}>Schedule Exam</Button>}
      />

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
              filter === f ? 'bg-primary text-white shadow-soft' : 'bg-white border border-hairline text-slate-600 hover:border-slate-300'
            )}
          >
            {f}
            {f !== 'All' && counts[f] > 0 && (
              <span className={cn('rounded-md px-1.5 text-[10px] font-bold', filter === f ? 'bg-white/20' : 'bg-slate-100')}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Exam cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[10px] font-semibold uppercase">{formatDate(e.date, { month: 'short', day: undefined, year: undefined })}</span>
                  <span className="text-base font-bold leading-none">{new Date(e.date).getDate()}</span>
                </div>
                <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
              </div>

              <h3 className="mt-4 text-base font-semibold text-ink">{e.subject}</h3>
              <p className="text-sm text-slate-500">{e.title} · {e.className}</p>

              <div className="mt-4 space-y-2 border-t border-hairline pt-4 text-sm text-slate-600">
                <p className="flex items-center gap-2"><FiClock className="h-4 w-4 text-slate-400" /> {e.time}</p>
                <p className="flex items-center gap-2"><FiMapPin className="h-4 w-4 text-slate-400" /> {e.room}</p>
                <p className="flex items-center gap-2"><FiUser className="h-4 w-4 text-slate-400" /> {e.invigilator}</p>
                <p className="flex items-center gap-2"><FiFileText className="h-4 w-4 text-slate-400" /> {e.totalMarks} marks</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
