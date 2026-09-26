import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiCalendar,
  FiFileText,
  FiSearch,
  FiFilter,
  FiShield,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import PageHeader from "../../components/common/PageHeader";
import { Button, Card, Badge, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

const DEFAULT_LEAVES = [
  {
    id: "LV-2026-001",
    teacher: "Priya Sharma",
    subject: "Mathematics (Class 6 - 8)",
    type: "Casual Leave (CL)",
    from: "2026-09-28",
    to: "2026-09-29",
    days: 2,
    reason: "Attending state mathematics seminar in Ahmedabad",
    status: "Pending",
    appliedOn: "2026-09-26",
  },
  {
    id: "LV-2026-002",
    teacher: "Rajesh Varma",
    subject: "Science (Class 5 - 7)",
    type: "Medical Leave (ML)",
    from: "2026-09-27",
    to: "2026-09-28",
    days: 2,
    reason: "Dental surgery and doctor advised rest",
    status: "Pending",
    appliedOn: "2026-09-25",
  },
  {
    id: "LV-2026-003",
    teacher: "Ananya Patel",
    subject: "English & Social Studies",
    type: "Casual Leave (CL)",
    from: "2026-09-15",
    to: "2026-09-16",
    days: 2,
    reason: "Family wedding ceremony in Surat",
    status: "Approved",
    appliedOn: "2026-09-10",
  },
  {
    id: "LV-2026-004",
    teacher: "Dr. Meenakshi Iyer",
    subject: "Science & Gujarati",
    type: "Earned Leave (EL)",
    from: "2026-09-01",
    to: "2026-09-03",
    days: 3,
    reason: "Personal family commitment",
    status: "Approved",
    appliedOn: "2026-08-25",
  },
];

export default function PrincipalLeaves() {
  const { user } = useAuth();
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadLeaves = () => {
    try {
      const stored = localStorage.getItem("igms.faculty_leaves");
      if (stored) {
        setLeaves(JSON.parse(stored));
      } else {
        localStorage.setItem("igms.faculty_leaves", JSON.stringify(DEFAULT_LEAVES));
        setLeaves(DEFAULT_LEAVES);
      }
    } catch (e) {
      setLeaves(DEFAULT_LEAVES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status: newStatus, reviewedAt: new Date().toISOString() } : l
    );
    setLeaves(updated);
    localStorage.setItem("igms.faculty_leaves", JSON.stringify(updated));

    // Try notifying backend API
    try {
      await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);
    } catch (e) {}

    if (newStatus === "Approved") {
      toast.success(`Leave request ${id} has been Approved.`);
    } else {
      toast.info(`Leave request ${id} marked as Rejected.`);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchesSearch =
      (l.teacher || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.reason || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Leave Approvals Desk"
        description="Review, verify, and approve teacher leave applications for your institution."
        breadcrumbs={[
          { label: "Principal Portal" },
          { label: "Faculty Leave Desk" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={FiRefreshCw}
              onClick={loadLeaves}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiFileText className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">{leaves.length}</p>
          <p className="mt-1 text-[11px] text-slate-400">Academic session 2025-26</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending Approvals
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <FiClock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-900">{pendingCount}</p>
          <p className="mt-1 text-[11px] text-amber-600">Action required by Principal</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Approved Leaves
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FiCheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-900">{approvedCount}</p>
          <p className="mt-1 text-[11px] text-emerald-600">Sanctioned by School Office</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Rejected Requests
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <FiXCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">{rejectedCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Declined due to schedule</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative min-w-[280px] flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by teacher name, leave reason, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-ink outline-none focus:border-primary focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-[#0f2b4d] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
              {status === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-[#0f2b4d]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Table / Cards */}
      <Card className="overflow-hidden p-0 border border-slate-200 shadow-xs">
        <div className="border-b border-slate-100 bg-slate-50/75 px-6 py-4">
          <h2 className="text-sm font-bold text-[#0f2b4d]">
            Faculty Leave Applications ({filteredLeaves.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-ink">No Leave Requests Found</p>
              <p className="mt-1 text-xs text-slate-400">
                {searchTerm
                  ? "Try adjusting your search keywords."
                  : "There are no faculty leave applications in this category."}
              </p>
            </div>
          ) : (
            filteredLeaves.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
                    {item.teacher ? item.teacher.charAt(0) : "T"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#0f2b4d]">{item.teacher}</p>
                      <Badge
                        tone={
                          item.status === "Approved"
                            ? "success"
                            : item.status === "Pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.subject || "Faculty Member"} • <span className="font-semibold text-slate-700">{item.type}</span>
                    </p>
                    <p className="mt-2 text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2 max-w-xl">
                      <span className="font-semibold text-slate-900">Reason:</span> {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:flex-col sm:items-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-[#0f2b4d]">
                      {item.from} to {item.to}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Duration: <span className="font-bold text-primary">{item.days} Day{item.days > 1 ? "s" : ""}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Applied on: {item.appliedOn}</p>
                  </div>

                  {item.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        icon={FiCheck}
                        onClick={() => handleUpdateStatus(item.id, "Approved")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={FiX}
                        onClick={() => handleUpdateStatus(item.id, "Rejected")}
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      {item.status === "Approved" ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <FiCheckCircle className="h-4 w-4" /> Approved by Principal
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 font-bold">
                          <FiXCircle className="h-4 w-4" /> Rejected
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
