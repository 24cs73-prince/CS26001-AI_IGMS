import { useMemo, useState } from 'react';
import { FiSend, FiCalendar } from 'react-icons/fi';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Input, Badge, Table } from '../../components/ui';
import { PageLoader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';

const STATUS_TONE = { Approved: 'success', Pending: 'warning', Rejected: 'danger' };

function daysBetween(from, to) {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const diff = Math.round((b - a) / 86400000) + 1;
  return diff > 0 ? diff : 0;
}

/**
 * Teacher · Apply Leave
 * Submit a leave request and view the history of past applications.
 */
export default function ApplyLeave() {
  const toast = useToast();
  const { data: apps, loading } = useFetch(() => api.getLeaveApplications(), []);
  const { data: types } = useFetch(() => api.getLeaveTypes(), []);

  const [rows, setRows] = useState(null);
  const [type, setType] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const list = rows ?? apps ?? [];
  const typeOptions = useMemo(
    () => (types || []).map((t) => ({ value: t, label: t })),
    [types]
  );
  const days = daysBetween(from, to);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !from || !to || !reason.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (days <= 0) {
      toast.error('The "to" date must be on or after the "from" date.');
      return;
    }
    const next = {
      id: `LV-${Math.floor(2000 + Math.random() * 8000)}`,
      type: type.label,
      from,
      to,
      days,
      reason: reason.trim(),
      status: 'Pending',
    };
    setRows([next, ...list]);
    setType(null);
    setFrom('');
    setTo('');
    setReason('');
    toast.success('Leave application submitted (demo).');
  };

  if (loading) return <PageLoader label="Loading leave history…" />;

  const columns = [
    { key: 'id', header: 'Ref' },
    { key: 'type', header: 'Type' },
    {
      key: 'from',
      header: 'Dates',
      render: (r) => (
        <span>
          {r.from} → {r.to}
        </span>
      ),
    },
    { key: 'days', header: 'Days', align: 'center' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'muted'}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Apply Leave"
        description="Request leave and track your application status."
        breadcrumbs={[{ label: 'Teacher' }, { label: 'Apply Leave' }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Application form */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <FiCalendar className="h-4 w-4 text-primary" /> New Leave Request
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Dropdown
              label="Leave Type"
              options={typeOptions}
              value={type}
              placeholder="Select leave type"
              onChange={setType}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            {days > 0 && (
              <p className="text-xs text-slate-500">
                Duration: <strong className="text-ink">{days} day(s)</strong>
              </p>
            )}
            <Input
              as="textarea"
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for leave…"
            />
            <Button type="submit" icon={FiSend} className="w-full">
              Submit Application
            </Button>
          </form>
        </Card>

        {/* History */}
        <Card padding={false} className="lg:col-span-3">
          <div className="border-b border-hairline p-4">
            <h3 className="text-sm font-semibold text-ink">My Applications</h3>
          </div>
          <Table columns={columns} data={list} rowKey={(r) => r.id} />
        </Card>
      </div>
    </div>
  );
}
