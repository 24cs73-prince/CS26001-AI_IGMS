import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiBookmark, FiUser, FiCalendar } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

import PageHeader from '../components/common/PageHeader';
import { Button, Badge, Card, SearchBox } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

/**
 * Notice Board page: pinned notices highlighted, recent notices below.
 */
const CATEGORY_TONE = {
  Event: 'primary',
  Examination: 'danger',
  Meeting: 'secondary',
  General: 'muted',
  Scholarship: 'success',
  Transport: 'warning',
};

const PRIORITY_TONE = { High: 'danger', Medium: 'warning', Low: 'muted' };

export default function Notices() {
  const { data: notices, loading } = useFetch(() => api.getNotices(), []);
  const toast = useToast();
  const { user } = useAuth();
  const canPost = ["principal", "teacher"].includes(user?.roleKey);
  const [query, setQuery] = useState('');

  const { pinned, recent } = useMemo(() => {
    const rows = (notices || []).filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.body.toLowerCase().includes(query.toLowerCase())
    );
    return {
      pinned: rows.filter((n) => n.pinned),
      recent: rows.filter((n) => !n.pinned),
    };
  }, [notices, query]);

  if (loading) return <PageLoader label="Loading notices…" />;

  const NoticeCard = ({ n, featured }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn('h-full', featured && 'border-primary/30 bg-gradient-to-br from-primary/[0.03] to-transparent')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={CATEGORY_TONE[n.category]}>{n.category}</Badge>
            <Badge tone={PRIORITY_TONE[n.priority]}>{n.priority} priority</Badge>
          </div>
          {n.pinned && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <FiBookmark className="h-3.5 w-3.5 fill-primary" /> Pinned
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-semibold text-ink">{n.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{n.body}</p>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><FiUser className="h-3.5 w-3.5" /> {n.author}</span>
          <span className="flex items-center gap-1.5"><FiCalendar className="h-3.5 w-3.5" /> {formatDate(n.date)}</span>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div>
      <PageHeader
        title="Notice Board"
        description="Announcements, events, and important updates."
        breadcrumbs={[{ label: 'Notice Board' }]}
        action={canPost ? <Button icon={FiPlus} onClick={() => toast.success('Post notice (demo).')}>Post Notice</Button> : null}
      />

      <div className="mb-6 max-w-sm">
        <SearchBox value={query} onChange={setQuery} placeholder="Search notices…" />
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <FiBookmark className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-ink">Pinned Notices</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pinned.map((n) => <NoticeCard key={n.id} n={n} featured />)}
          </div>
        </section>
      )}

      {/* Recent */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FiCalendar className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-ink">Recent Notices</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((n) => <NoticeCard key={n.id} n={n} />)}
        </div>
      </section>
    </div>
  );
}
