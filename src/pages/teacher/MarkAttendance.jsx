import { useMemo, useState } from 'react';
import { FiCheckSquare, FiCheck, FiX, FiSave } from 'react-icons/fi';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import { CLASSES } from '../../constants/app';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Input } from '../../components/ui';
import { PageLoader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

const CLASS_OPTIONS = CLASSES.map((c) => ({ value: c, label: c }));

/**
 * Teacher · Mark Attendance
 * Classes 1–8 only. Pick a class + date, then mark each student present/absent.
 */
export default function MarkAttendance() {
  const toast = useToast();
  const { data: roster, loading } = useFetch(() => api.getTeacherRoster(), []);

  const [classSel, setClassSel] = useState(CLASS_OPTIONS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState({}); // { studentId: 'present' | 'absent' }

  const students = useMemo(
    () => (roster ? roster[classSel.value] || [] : []),
    [roster, classSel]
  );

  const setAll = (val) =>
    setStatus(Object.fromEntries(students.map((s) => [s.id, val])));

  const toggle = (id, val) => setStatus((p) => ({ ...p, [id]: val }));

  const presentCount = students.filter((s) => status[s.id] === 'present').length;
  const absentCount = students.filter((s) => status[s.id] === 'absent').length;

  const handleSave = () => {
    if (!students.length) return;
    const marked = presentCount + absentCount;
    if (marked < students.length) {
      toast.error(`Please mark all ${students.length} students first.`);
      return;
    }
    toast.success(
      `Attendance saved for ${classSel.value} on ${date} — ${presentCount} present, ${absentCount} absent (demo).`
    );
  };

  if (loading) return <PageLoader label="Loading roster…" />;

  return (
    <div>
      <PageHeader
        title="Mark Attendance"
        description="Record daily attendance for your class (Classes 1–8)."
        breadcrumbs={[{ label: 'Teacher' }, { label: 'Mark Attendance' }]}
        action={
          <Button icon={FiSave} onClick={handleSave}>
            Save Attendance
          </Button>
        }
      />

      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-hairline p-4 md:flex-row md:items-end">
          <Dropdown
            label="Class"
            options={CLASS_OPTIONS}
            value={classSel}
            onChange={(o) => {
              setClassSel(o);
              setStatus({});
            }}
            className="md:w-44"
          />
          <div className="md:w-44">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-1 items-center gap-2 md:justify-end">
            <Button variant="subtle" size="sm" icon={FiCheck} onClick={() => setAll('present')}>
              All Present
            </Button>
            <Button variant="outline" size="sm" icon={FiX} onClick={() => setAll('absent')}>
              All Absent
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-4 border-b border-hairline px-4 py-3 text-sm">
          <span className="text-slate-500">
            Total: <strong className="text-ink">{students.length}</strong>
          </span>
          <span className="text-accent-600">
            Present: <strong>{presentCount}</strong>
          </span>
          <span className="text-danger-600">
            Absent: <strong>{absentCount}</strong>
          </span>
        </div>

        {/* Student rows */}
        <ul className="divide-y divide-hairline">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-ink">
                  {s.roll}. {s.name}
                </p>
                <p className="text-xs text-slate-400">
                  {s.className} · Section {s.section} · {s.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(s.id, 'present')}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border transition-all',
                    status[s.id] === 'present'
                      ? 'border-accent bg-accent text-white'
                      : 'border-hairline text-slate-400 hover:border-accent hover:text-accent'
                  )}
                  aria-label="Mark present"
                >
                  <FiCheck className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggle(s.id, 'absent')}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border transition-all',
                    status[s.id] === 'absent'
                      ? 'border-danger bg-danger text-white'
                      : 'border-hairline text-slate-400 hover:border-danger hover:text-danger'
                  )}
                  aria-label="Mark absent"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
