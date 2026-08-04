import { useMemo, useState } from 'react';
import { FiSave, FiUpload } from 'react-icons/fi';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import { CLASSES } from '../../constants/app';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Input } from '../../components/ui';
import { PageLoader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';

const CLASS_OPTIONS = CLASSES.map((c) => ({ value: c, label: c }));
const EXAM_OPTIONS = [
  { value: 'unit-1', label: 'Unit Test 1' },
  { value: 'mid-term', label: 'Mid-Term' },
  { value: 'unit-2', label: 'Unit Test 2' },
  { value: 'final', label: 'Final Exam' },
];

/**
 * Teacher · Upload Marks
 * Classes 1–8 only. Pick class + subject + exam, enter marks out of a max, save.
 */
export default function UploadMarks() {
  const toast = useToast();
  const { data: roster, loading } = useFetch(() => api.getTeacherRoster(), []);
  const { data: subjects } = useFetch(() => api.getTeacherSubjects(), []);

  const [classSel, setClassSel] = useState(CLASS_OPTIONS[0]);
  const [subject, setSubject] = useState(null);
  const [exam, setExam] = useState(EXAM_OPTIONS[0]);
  const [maxMarks, setMaxMarks] = useState(100);
  const [marks, setMarks] = useState({}); // { studentId: number }

  const subjectOptions = useMemo(
    () => (subjects || []).map((s) => ({ value: s, label: s })),
    [subjects]
  );

  const students = useMemo(
    () => (roster ? roster[classSel.value] || [] : []),
    [roster, classSel]
  );

  const setMark = (id, val) => {
    const num = val === '' ? '' : Math.max(0, Math.min(Number(maxMarks) || 100, Number(val)));
    setMarks((p) => ({ ...p, [id]: num }));
  };

  const entered = students.filter((s) => marks[s.id] !== undefined && marks[s.id] !== '').length;

  const handleSave = () => {
    if (!subject) {
      toast.error('Please choose a subject first.');
      return;
    }
    if (entered < students.length) {
      toast.error(`Enter marks for all ${students.length} students.`);
      return;
    }
    toast.success(
      `Marks uploaded for ${classSel.value} · ${subject.label} · ${exam.label} (demo).`
    );
  };

  if (loading) return <PageLoader label="Loading roster…" />;

  return (
    <div>
      <PageHeader
        title="Upload Marks"
        description="Enter and submit exam marks for your class (Classes 1–8)."
        breadcrumbs={[{ label: 'Teacher' }, { label: 'Upload Marks' }]}
        action={
          <Button icon={FiUpload} onClick={handleSave}>
            Upload Marks
          </Button>
        }
      />

      <Card padding={false}>
        {/* Toolbar */}
        <div className="grid grid-cols-1 gap-3 border-b border-hairline p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Dropdown
            label="Class"
            options={CLASS_OPTIONS}
            value={classSel}
            onChange={(o) => {
              setClassSel(o);
              setMarks({});
            }}
          />
          <Dropdown
            label="Subject"
            options={subjectOptions}
            value={subject}
            placeholder="Select subject"
            onChange={setSubject}
          />
          <Dropdown label="Exam" options={EXAM_OPTIONS} value={exam} onChange={setExam} />
          <Input
            label="Max Marks"
            type="number"
            value={maxMarks}
            min={1}
            onChange={(e) => setMaxMarks(e.target.value)}
          />
        </div>

        <div className="border-b border-hairline px-4 py-3 text-sm text-slate-500">
          Entered: <strong className="text-ink">{entered}</strong> / {students.length}
        </div>

        {/* Marks entry */}
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
                <input
                  type="number"
                  min={0}
                  max={maxMarks}
                  value={marks[s.id] ?? ''}
                  onChange={(e) => setMark(s.id, e.target.value)}
                  placeholder="—"
                  className="h-10 w-24 rounded-xl border border-hairline bg-white px-3 text-sm text-ink shadow-soft focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                />
                <span className="text-xs text-slate-400">/ {maxMarks}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
