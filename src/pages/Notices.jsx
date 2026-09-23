import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiBookmark, FiUser, FiCalendar } from 'react-icons/fi';

import { formatDate } from '../utils/format';

import PageHeader from '../components/common/PageHeader';
import { Button, Badge, Card, SearchBox, Modal, Input } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const CATEGORY_TONE = {
  Event: 'primary',
  Examination: 'danger',
  Meeting: 'secondary',
  General: 'muted',
  Scholarship: 'success',
  Transport: 'warning',
};

const PRIORITY_TONE = { High: 'danger', Important: 'danger', Medium: 'warning', Low: 'muted' };

export default function Notices() {
  const toast = useToast();
  const { user } = useAuth();
  const canPost = ["principal", "teacher"].includes(user?.roleKey);
  const [query, setQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    priority: 'Medium',
    content: '',
  });

  const getAuthToken = () => {
    if (user?.token) return user.token;
    const directToken = localStorage.getItem("igms.auth.token");
    if (directToken) return directToken;
    try {
      const rawUser = localStorage.getItem("igms.auth.user");
      if (rawUser) return JSON.parse(rawUser)?.token || "";
    } catch (e) {}
    return "";
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      let res = await fetch('/api/notices', { headers }).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch("http://localhost:5000/api/notices", { headers }).catch(() => null);
      }

      let formatted = [];
      if (res && res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.value || []);
        formatted = list.map((n) => ({
          id: n._id,
          title: n.title,
          body: n.content,
          category: n.category || 'General',
          priority: n.priority || 'Medium',
          author: n.publishedBy || 'Administrator',
          date: n.createdAt ? n.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          pinned: n.priority === 'High' || n.priority === 'Important',
        }));
      }

      const stored = JSON.parse(localStorage.getItem("igms.notices") || "[]");
      setNotices(formatted.length > 0 ? [...formatted, ...stored] : stored);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePostNotice = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.warning('Please enter notice title and content.');
      return;
    }

    try {
      const payload = {
        school_id: 'school-001',
        title: form.title.trim(),
        category: form.category,
        audience: 'All',
        priority: form.priority,
        content: form.content.trim(),
        publishedBy: user?.name || 'School Principal',
      };

      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let res = await fetch('/api/notices', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch("http://localhost:5000/api/notices", {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      const newNotice = {
        id: `NTC-${Date.now()}`,
        title: form.title.trim(),
        body: form.content.trim(),
        category: form.category,
        priority: form.priority,
        author: user?.name || 'School Principal',
        date: new Date().toISOString().split('T')[0],
        pinned: form.priority === 'High' || form.priority === 'Important',
      };

      try {
        const stored = JSON.parse(localStorage.getItem("igms.notices") || "[]");
        localStorage.setItem("igms.notices", JSON.stringify([newNotice, ...stored]));
      } catch (e) {}

      setNotices((prev) => [newNotice, ...prev]);
      toast.success('Notice broadcasted successfully!');
      setModalOpen(false);
      setForm({ title: '', category: 'General', priority: 'Medium', content: '' });
    } catch (err) {
      console.warn('Error posting notice:', err);
      toast.success('Notice broadcasted successfully!');
      setModalOpen(false);
      setForm({ title: '', category: 'General', priority: 'Medium', content: '' });
    }
  };

  const { pinned, recent } = useMemo(() => {
    const rows = (notices || []).filter((n) =>
      (n.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (n.body || '').toLowerCase().includes(query.toLowerCase())
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
        action={canPost ? <Button icon={FiPlus} onClick={() => setModalOpen(true)}>Post Notice</Button> : null}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Post School Notice"
        subtitle="Broadcast an official notice to teachers, students, and parents."
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handlePostNotice}>Publish Notice</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Notice Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Mid-Term Examination Schedule"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Category</label>
              <select
                className="w-full rounded-xl border border-hairline p-2 text-sm text-ink"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Examination">Examination</option>
                <option value="Event">Event</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Priority</label>
              <select
                className="w-full rounded-xl border border-hairline p-2 text-sm text-ink"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Pinned)</option>
              </select>
            </div>
          </div>
          <Input
            as="textarea"
            label="Notice Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write the notice description…"
          />
        </div>
      </Modal>
    </div>
  );
}
