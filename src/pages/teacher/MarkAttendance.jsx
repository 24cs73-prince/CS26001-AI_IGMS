import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUsers,
  FiSave,
  FiCalendar,
} from "react-icons/fi";

import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { CLASSES, SECTIONS } from "../../constants/app";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { Button, Avatar, Card, Dropdown } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { cn } from "../../utils/cn";

const STATUS_OPTIONS = [
  { value: "Present", label: "Present", icon: FiCheckCircle, tone: "accent" },
  { value: "Absent", label: "Absent", icon: FiXCircle, tone: "danger" },
  { value: "Late", label: "Late", icon: FiClock, tone: "warning" },
];

const TONE_CLASSES = {
  accent: {
    active: "bg-accent text-white border-accent",
    idle: "text-accent-600 border-hairline hover:bg-accent/10",
  },
  danger: {
    active: "bg-danger text-white border-danger",
    idle: "text-danger-600 border-hairline hover:bg-danger/10",
  },
  warning: {
    active: "bg-warning text-white border-warning",
    idle: "text-warning-600 border-hairline hover:bg-warning/10",
  },
};

const todayStr = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Teacher → Mark Attendance.
 * Pick a class + section to load the roster, then mark each student
 * Present / Absent / Late and save. Frontend-only (mock) — persists to a
 * toast today; swap the save handler for an API call when the backend exists.
 */
export default function MarkAttendance() {
  const { data: students, loading } = useFetch(() => api.getStudents(), []);
  const { user } = useAuth();
  const toast = useToast();

  const [classFilter, setClassFilter] = useState({
    value: "Class 10",
    label: "Class 10",
  });
  const [sectionFilter, setSectionFilter] = useState({
    value: "A",
    label: "A",
  });
  // { [studentId]: 'Present' | 'Absent' | 'Late' }
  const [marks, setMarks] = useState({});

  const classOptions = CLASSES.map((c) => ({ value: c, label: c }));
  const sectionOptions = SECTIONS.map((s) => ({ value: s, label: s }));

  const roster = useMemo(() => {
    if (!students) return [];
    return students
      .filter(
        (s) =>
          s.className === classFilter.value &&
          s.section === sectionFilter.value,
      )
      .sort((a, b) => a.roll - b.roll);
  }, [students, classFilter, sectionFilter]);

  const setStatus = (id, status) =>
    setMarks((prev) => ({ ...prev, [id]: status }));

  const markAll = (status) =>
    setMarks((prev) => {
      const next = { ...prev };
      roster.forEach((s) => {
        next[s.id] = status;
      });
      return next;
    });

  const counts = useMemo(() => {
    const c = { Present: 0, Absent: 0, Late: 0 };
    roster.forEach((s) => {
      const st = marks[s.id];
      if (st) c[st] += 1;
    });
    return c;
  }, [roster, marks]);

  const markedCount = counts.Present + counts.Absent + counts.Late;
  const allMarked = roster.length > 0 && markedCount === roster.length;

  const handleSave = () => {
    if (!roster.length) {
      toast.warning("No students in this class/section.");
      return;
    }
    if (!allMarked) {
      toast.warning(
        `Please mark all students — ${roster.length - markedCount} remaining.`,
      );
      return;
    }
    toast.success(
      `Attendance saved for ${classFilter.value} · ${sectionFilter.value} (${roster.length} students).`,
    );
  };

  if (loading) return <PageLoader label="Loading roster…" />;

  const summaryCards = [
    {
      key: "total",
      label: "In Roster",
      value: roster.length,
      icon: FiUsers,
      tone: "primary",
      hint: `${classFilter.value} · ${sectionFilter.value}`,
    },
    {
      key: "present",
      label: "Present",
      value: counts.Present,
      icon: FiCheckCircle,
      tone: "accent",
      hint: "marked present",
    },
    {
      key: "absent",
      label: "Absent",
      value: counts.Absent,
      icon: FiXCircle,
      tone: "danger",
      hint: "marked absent",
    },
    {
      key: "late",
      label: "Late",
      value: counts.Late,
      icon: FiClock,
      tone: "warning",
      hint: "marked late",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Mark Attendance"
        description={`${todayStr} · ${user?.name ?? "Teacher"}`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Mark Attendance" }]}
        action={
          <Button
            icon={FiSave}
            onClick={handleSave}
            disabled={!roster.length}
          >
            Save Attendance
          </Button>
        }
      />

      {/* Class / section pickers */}
      <Card className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <Dropdown
              label="Class"
              options={classOptions}
              value={classFilter}
              onChange={(o) => {
                setClassFilter(o);
                setMarks({});
              }}
              className="sm:w-48"
            />
            <Dropdown
              label="Section"
              options={sectionOptions}
              value={sectionFilter}
              onChange={(o) => {
                setSectionFilter(o);
                setMarks({});
              }}
              className="sm:w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">
              Quick mark:
            </span>
            <Button
              size="sm"
              variant="outline"
              icon={FiCheckCircle}
              onClick={() => markAll("Present")}
              disabled={!roster.length}
            >
              All Present
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <StatCard key={c.key} stat={c} />
        ))}
      </div>

      {/* Roster */}
      <Card padding={false}>
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-ink">
              Today's Roster
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {markedCount}/{roster.length} marked
          </span>
        </div>

        {roster.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No students found for {classFilter.value} · Section{" "}
            {sectionFilter.value}.
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {roster.map((s) => {
              const current = marks[s.id];
              return (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center text-xs font-semibold text-slate-400">
                      {s.roll}
                    </span>
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:justify-end">
                    {STATUS_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = current === opt.value;
                      const tc = TONE_CLASSES[opt.tone];
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setStatus(s.id, opt.value)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                            active ? tc.active : cn("bg-white", tc.idle),
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
