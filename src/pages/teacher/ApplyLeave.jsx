import { useEffect, useMemo, useState } from "react";
import { FiSend, FiCalendar, FiInbox, FiClock } from "react-icons/fi";

import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { LEAVE_TYPES } from "../../constants/app";
import { STATUS_TONE } from "../../constants/theme";

import PageHeader from "../../components/common/PageHeader";
import { Button, Card, Dropdown, Input, Table, Badge } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";

const TODAY = "2026-08-02";

/** Inclusive whole-day count between two ISO dates. */
function dayCount(from, to) {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const diff = Math.round((b - a) / 86_400_000);
  return diff >= 0 ? diff + 1 : 0;
}

/**
 * Teacher → Apply Leave.
 * Submit a leave request (added locally as "Pending") and review the
 * history of applications. Frontend-only (mock) — seeded from api.getLeave().
 */
export default function ApplyLeave() {
  const { data, loading } = useFetch(() => api.getLeave(), []);
  const { user } = useAuth();
  const toast = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState([
    { key: "casual", type: "Casual Leave", total: 12, used: 3 },
    { key: "sick", type: "Sick Leave", total: 10, used: 2 },
    { key: "earned", type: "Earned Leave", total: 15, used: 5 },
  ]);

  const [type, setType] = useState({
    value: LEAVE_TYPES[0],
    label: LEAVE_TYPES[0],
  });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leave");
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.value || []).map((l) => ({
          id: l._id ? "LV-" + l._id.slice(-4) : "LV-101",
          teacher: l.teacherName || "Dr. Meenakshi Iyer",
          type: l.leaveType,
          from: l.startDate,
          to: l.endDate,
          days: l.totalDays,
          reason: l.reason,
          status: l.status || "Pending",
          appliedOn: l.createdAt ? l.createdAt.split("T")[0] : TODAY,
        }));
        setApplications(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch leave applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const typeOptions = LEAVE_TYPES.map((t) => ({ value: t, label: t }));
  const days = useMemo(() => dayCount(from, to), [from, to]);

  const resetForm = () => {
    setFrom("");
    setTo("");
    setReason("");
    setType({ value: LEAVE_TYPES[0], label: LEAVE_TYPES[0] });
  };

  const handleSubmit = async () => {
    if (!from || !to) {
      toast.warning("Select both a start and end date.");
      return;
    }
    if (days <= 0) {
      toast.warning("End date must be on or after the start date.");
      return;
    }
    if (!reason.trim()) {
      toast.warning("Please add a short reason for your leave.");
      return;
    }

    try {
      const payload = {
        school_id: "school-001",
        teacherName: user?.name || "Dr. Meenakshi Iyer",
        leaveType: type.value,
        startDate: from,
        endDate: to,
        totalDays: days,
        reason: reason.trim(),
      };

      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Leave request submitted (${days} day${days > 1 ? "s" : ""}).`);
        fetchLeaveRequests();
        resetForm();
      } else {
        toast.error("Failed to submit leave request.");
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
      toast.error("Network error while submitting leave request.");
    }
  };

  if (loading) return <PageLoader label="Loading leave records…" />;

  const pendingCount = applications.filter((a) => a.status === "Pending").length;

  const columns = [
    {
      key: "type",
      header: "Type",
      render: (r) => (
        <div>
          <p className="font-medium text-ink">{r.type}</p>
          <p className="text-xs text-slate-400">{r.id}</p>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      render: (r) => (
        <span>
          {r.from} → {r.to}
        </span>
      ),
    },
    { key: "days", header: "Days", align: "center" },
    {
      key: "reason",
      header: "Reason",
      render: (r) => (
        <span className="block max-w-xs truncate text-slate-600" title={r.reason}>
          {r.reason}
        </span>
      ),
    },
    { key: "appliedOn", header: "Applied On" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Apply Leave"
        description={`Submit and track your leave requests · ${user?.name ?? "Teacher"}`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Apply Leave" }]}
      />

      {/* Leave balance cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {balance.map((b) => {
          const remaining = b.total - b.used;
          const pct = Math.round((b.used / b.total) * 100);
          return (
            <Card key={b.key}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {b.type}
                </span>
                <FiCalendar className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-[28px] font-bold leading-none text-ink">
                  {remaining}
                </span>
                <span className="text-sm text-slate-400">/ {b.total} left</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">{b.used} used this year</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Application form */}
        <Card className="lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-ink">New Leave Request</h3>
          <div className="space-y-4">
            <Dropdown
              label="Leave Type"
              options={typeOptions}
              value={type}
              onChange={setType}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="From"
                type="date"
                value={from}
                min={TODAY}
                onChange={(e) => setFrom(e.target.value)}
              />
              <Input
                label="To"
                type="date"
                value={to}
                min={from || TODAY}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <Input
              as="textarea"
              label="Reason"
              placeholder="Briefly describe the reason for your leave…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiClock className="h-3.5 w-3.5" /> Duration
              </span>
              <span className="text-sm font-semibold text-ink">
                {days} day{days === 1 ? "" : "s"}
              </span>
            </div>
            <Button icon={FiSend} onClick={handleSubmit} className="w-full">
              Submit Request
            </Button>
          </div>
        </Card>

        {/* Applications history */}
        <Card padding={false} className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-hairline p-4">
            <div className="flex items-center gap-2">
              <FiInbox className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-ink">My Applications</h3>
            </div>
            <span className="text-xs text-slate-400">
              {pendingCount} pending · {applications.length} total
            </span>
          </div>
          <Table columns={columns} data={applications} rowKey={(r) => r.id} />
        </Card>
      </div>
    </div>
  );
}
