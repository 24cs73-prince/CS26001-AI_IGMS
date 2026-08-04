import { useMemo, useState } from "react";
import { FiUsers, FiCheckCircle, FiAward, FiSave, FiEdit3 } from "react-icons/fi";

import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { CLASSES, SECTIONS, SUBJECTS, EXAM_TERMS } from "../../constants/app";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { Button, Avatar, Card, Dropdown, Badge } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { cn } from "../../utils/cn";

const MAX_MARKS = 100;

/** Percentage → letter grade (matches the app's results grading bands). */
function gradeFor(pct) {
  if (pct == null || Number.isNaN(pct)) return "—";
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

const GRADE_TONE = {
  "A+": "success",
  A: "success",
  "B+": "info",
  B: "info",
  C: "warning",
  D: "warning",
  F: "danger",
  "—": "muted",
};

/**
 * Teacher → Upload Marks.
 * Select class / section / subject / exam, enter each student's score
 * (out of 100), see the auto-computed grade, then save. Frontend-only (mock).
 */
export default function UploadMarks() {
  const { data: students, loading } = useFetch(() => api.getStudents(), []);
  const { user } = useAuth();
  const toast = useToast();

  const [classFilter, setClassFilter] = useState({
    value: "Class 10",
    label: "Class 10",
  });
  const [sectionFilter, setSectionFilter] = useState({ value: "A", label: "A" });
  const [subject, setSubject] = useState({
    value: "Mathematics",
    label: "Mathematics",
  });
  const [exam, setExam] = useState({ value: "Unit Test 1", label: "Unit Test 1" });
  // { [studentId]: '85' }  (raw string from the input)
  const [scores, setScores] = useState({});

  const classOptions = CLASSES.map((c) => ({ value: c, label: c }));
  const sectionOptions = SECTIONS.map((s) => ({ value: s, label: s }));
  const subjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }));
  const examOptions = EXAM_TERMS.map((e) => ({ value: e, label: e }));

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

  const setScore = (id, raw) => {
    // allow empty, otherwise clamp 0..MAX_MARKS
    if (raw === "") {
      setScores((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    let n = Number(raw);
    if (Number.isNaN(n)) return;
    n = Math.max(0, Math.min(MAX_MARKS, n));
    setScores((prev) => ({ ...prev, [id]: String(n) }));
  };

  const stats = useMemo(() => {
    const entered = roster.filter(
      (s) => scores[s.id] !== undefined && scores[s.id] !== "",
    );
    const values = entered.map((s) => Number(scores[s.id]));
    const avg = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;
    const passed = values.filter((v) => v >= 40).length;
    return { enteredCount: entered.length, avg, passed };
  }, [roster, scores]);

  const handleSave = () => {
    if (!roster.length) {
      toast.warning("No students in this class/section.");
      return;
    }
    if (stats.enteredCount === 0) {
      toast.warning("Enter marks for at least one student.");
      return;
    }
    toast.success(
      `${subject.value} · ${exam.value} marks saved for ${classFilter.value} · ${sectionFilter.value} (${stats.enteredCount}/${roster.length} entered).`,
    );
  };

  if (loading) return <PageLoader label="Loading roster…" />;

  const resetScores = () => setScores({});

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
      key: "entered",
      label: "Marks Entered",
      value: `${stats.enteredCount}/${roster.length}`,
      icon: FiEdit3,
      tone: "secondary",
      hint: exam.value,
    },
    {
      key: "avg",
      label: "Class Average",
      value: stats.avg,
      suffix: "%",
      icon: FiAward,
      tone: "accent",
      hint: subject.value,
    },
    {
      key: "passed",
      label: "Passed (≥40)",
      value: stats.passed,
      icon: FiCheckCircle,
      tone: "warning",
      hint: "of entered",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Upload Marks"
        description={`Enter exam marks · ${user?.name ?? "Teacher"}`}
        breadcrumbs={[{ label: "Teacher" }, { label: "Upload Marks" }]}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetScores}
              disabled={stats.enteredCount === 0}
            >
              Clear
            </Button>
            <Button icon={FiSave} onClick={handleSave} disabled={!roster.length}>
              Save Marks
            </Button>
          </div>
        }
      />

      {/* Selectors */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Dropdown
            label="Class"
            options={classOptions}
            value={classFilter}
            onChange={(o) => {
              setClassFilter(o);
              setScores({});
            }}
          />
          <Dropdown
            label="Section"
            options={sectionOptions}
            value={sectionFilter}
            onChange={(o) => {
              setSectionFilter(o);
              setScores({});
            }}
          />
          <Dropdown
            label="Subject"
            options={subjectOptions}
            value={subject}
            onChange={setSubject}
          />
          <Dropdown
            label="Exam"
            options={examOptions}
            value={exam}
            onChange={setExam}
          />
        </div>
      </Card>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <StatCard key={c.key} stat={c} />
        ))}
      </div>

      {/* Marks entry */}
      <Card padding={false}>
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-ink">
            {subject.value} · {exam.value}
          </h3>
          <span className="text-xs text-slate-400">Marks out of {MAX_MARKS}</span>
        </div>

        {roster.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No students found for {classFilter.value} · Section{" "}
            {sectionFilter.value}.
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {roster.map((s) => {
              const raw = scores[s.id] ?? "";
              const pct = raw === "" ? null : Number(raw);
              const grade = gradeFor(pct);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-8 text-center text-xs font-semibold text-slate-400">
                      {s.roll}
                    </span>
                    <Avatar name={s.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={GRADE_TONE[grade]}>{grade}</Badge>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={MAX_MARKS}
                        value={raw}
                        onChange={(e) => setScore(s.id, e.target.value)}
                        placeholder="—"
                        className={cn(
                          "h-10 w-20 rounded-xl border border-hairline bg-white px-3 text-center text-sm text-ink shadow-soft transition-all",
                          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
                        )}
                      />
                      <span className="text-xs text-slate-400">/{MAX_MARKS}</span>
                    </div>
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
