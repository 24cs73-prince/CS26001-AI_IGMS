import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiZap, FiDownload, FiRefreshCw, FiFileText } from 'react-icons/fi';

import { CLASSES, SUBJECTS, DIFFICULTY_LEVELS } from '../../constants/app';
import { generateQuestionPaper } from '../../services/aiService';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Input, Badge } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

/**
 * AI Question Paper Generator (UI only).
 * Collects config, calls the mock AI service, and renders a formatted paper.
 */
export default function QuestionPaper() {
  const toast = useToast();
  const [config, setConfig] = useState({
    className: { value: 'Class 8', label: 'Class 8' },
    subject: { value: 'Mathematics', label: 'Mathematics' },
    difficulty: { value: 'Medium', label: 'Medium' },
    count: 10,
  });
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setPaper(null);
    try {
      const result = await generateQuestionPaper({
        className: config.className.value,
        subject: config.subject.value,
        difficulty: config.difficulty.value,
        questionCount: Number(config.count) || 10,
      });
      setPaper(result);
      toast.success('Question paper generated.');
    } catch {
      toast.error('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Question Paper Generator"
        description="Generate exam-ready question papers in seconds."
        breadcrumbs={[{ label: 'AI Suite' }, { label: 'Question Paper Generator' }]}
        action={<Badge tone="secondary">AI Beta</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Config panel */}
        <Card className="lg:col-span-1 h-fit">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <FiCpu className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">Configuration</h3>
              <p className="text-xs text-slate-400">Set the paper parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <Dropdown label="Class" options={CLASSES.map((c) => ({ value: c, label: c }))} value={config.className} onChange={(v) => setConfig((c) => ({ ...c, className: v }))} />
            <Dropdown label="Subject" options={SUBJECTS.map((s) => ({ value: s, label: s }))} value={config.subject} onChange={(v) => setConfig((c) => ({ ...c, subject: v }))} />
            <Dropdown label="Difficulty" options={DIFFICULTY_LEVELS.map((d) => ({ value: d, label: d }))} value={config.difficulty} onChange={(v) => setConfig((c) => ({ ...c, difficulty: v }))} />
            <Input label="Number of Questions" type="number" min={5} max={30} value={config.count} onChange={(e) => setConfig((c) => ({ ...c, count: e.target.value }))} />
          </div>

          <Button className="mt-6 w-full" icon={FiZap} loading={loading} onClick={handleGenerate}>
            {loading ? 'Generating…' : 'Generate Paper'}
          </Button>
        </Card>

        {/* Result area */}
        <Card className="lg:col-span-2 min-h-[420px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Generated Paper</h3>
            {paper && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon={FiRefreshCw} onClick={handleGenerate}>Regenerate</Button>
                <Button size="sm" variant="outline" icon={FiDownload} onClick={() => toast.info('Download (demo).')}>Export</Button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="flex min-h-[340px] flex-col items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader size="lg" />
                <p className="text-sm text-slate-500">AI is drafting your question paper…</p>
              </motion.div>
            ) : paper ? (
              <motion.div key="paper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-hairline">
                {/* Paper header */}
                <div className="rounded-t-xl border-b border-hairline bg-canvas/60 p-5 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Directorate of School Education</p>
                  <h2 className="mt-1 text-lg font-bold text-ink">{paper.meta.subject} — {paper.meta.className}</h2>
                  <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span>Difficulty: <b className="text-ink">{paper.meta.difficulty}</b></span>
                    <span>Max Marks: <b className="text-ink">{paper.meta.totalMarks}</b></span>
                    <span>Duration: <b className="text-ink">{paper.meta.duration}</b></span>
                  </div>
                </div>
                {/* Sections */}
                <div className="space-y-6 p-5">
                  {paper.sections.map((sec) => (
                    <div key={sec.title}>
                      <h4 className="mb-3 text-sm font-semibold text-primary">{sec.title}</h4>
                      <ol className="space-y-2.5">
                        {sec.questions.map((q) => (
                          <li key={q.no} className="flex items-start justify-between gap-4 text-sm">
                            <span className="text-slate-700"><span className="mr-2 font-medium text-slate-400">{q.no}.</span>{q.text}</span>
                            <span className="shrink-0 text-xs font-medium text-slate-400">[{q.marks}]</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
                <p className="border-t border-hairline p-4 text-center text-[11px] text-slate-400">
                  Generated by AI-IGMS · {formatDate(paper.meta.generatedAt)}
                </p>
              </motion.div>
            ) : (
              <EmptyState
                key="empty"
                icon={FiFileText}
                title="No paper generated yet"
                description="Configure the options on the left and click Generate to create an AI question paper."
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
