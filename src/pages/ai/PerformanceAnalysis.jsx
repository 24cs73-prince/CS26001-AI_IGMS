import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiZap, FiCheckCircle, FiAlertTriangle, FiTarget, FiActivity } from 'react-icons/fi';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import { analyzePerformance } from '../../services/aiService';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Badge, Avatar } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';

/**
 * AI Student Performance Analysis (UI only).
 * Select a student → mock AI returns strengths, weaknesses, recommendations,
 * and a next-term prediction.
 */
export default function PerformanceAnalysis() {
  const { data: students, loading: loadingStudents } = useFetch(() => api.getStudents(), []);
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  if (loadingStudents) return <PageLoader label="Loading students…" />;

  const options = students.map((s) => ({ value: s.id, label: `${s.name} · ${s.className}` }));

  const handleSelect = async (opt) => {
    const student = students.find((s) => s.id === opt.value);
    setSelected(student);
    setAnalysis(null);
    setAnalyzing(true);
    try {
      const result = await analyzePerformance(student);
      setAnalysis(result);
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const bandTone = (band) =>
    band === 'Excellent' ? 'success' : band === 'Good' ? 'primary' : band === 'Average' ? 'warning' : 'danger';
  const riskTone = (r) => (r === 'Low' ? 'success' : r === 'Moderate' ? 'warning' : 'danger');

  return (
    <div>
      <PageHeader
        title="AI Student Performance Analysis"
        description="AI-powered insights, recommendations, and predictions."
        breadcrumbs={[{ label: 'AI Suite' }, { label: 'Performance Analysis' }]}
        action={<Badge tone="secondary">AI Beta</Badge>}
      />

      {/* Student selector */}
      <Card className="mb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Dropdown
              label="Select a student to analyze"
              options={options}
              value={selected ? { value: selected.id, label: `${selected.name} · ${selected.className}` } : ''}
              onChange={handleSelect}
              placeholder="Choose a student…"
            />
          </div>
          <Button icon={FiZap} loading={analyzing} disabled={!selected} onClick={() => selected && handleSelect({ value: selected.id })}>
            Re-analyze
          </Button>
        </div>
      </Card>

      {!selected ? (
        <EmptyState
          icon={FiActivity}
          title="No student selected"
          description="Select a student above to generate an AI-powered performance analysis."
        />
      ) : (
        <div className="space-y-4">
          {/* Student summary + attendance/marks */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} size="xl" />
                <div>
                  <h3 className="text-lg font-semibold text-ink">{selected.name}</h3>
                  <p className="text-sm text-slate-500">{selected.className} · Section {selected.section}</p>
                  <p className="mt-1 text-xs text-slate-400">{selected.id}</p>
                </div>
              </div>
            </Card>

            {/* Attendance summary */}
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Attendance Summary</p>
              <p className="mt-2 text-3xl font-bold text-ink">{selected.attendance}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${selected.attendance >= 85 ? 'bg-accent' : selected.attendance >= 70 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${selected.attendance}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">{selected.attendance >= 85 ? 'Excellent attendance' : selected.attendance >= 70 ? 'Attendance needs improvement' : 'Low attendance — flag for follow-up'}</p>
            </Card>

            {/* Marks summary */}
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Marks Summary</p>
              <p className="mt-2 text-3xl font-bold text-ink">{selected.average}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${selected.average}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">Overall academic average this term</p>
            </Card>
          </div>

          {/* AI output */}
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex min-h-[240px] flex-col items-center justify-center gap-4">
                  <Loader size="lg" />
                  <p className="text-sm text-slate-500">AI is analyzing performance patterns…</p>
                </Card>
              </motion.div>
            ) : analysis ? (
              <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Performance card */}
                <Card>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><FiTrendingUp className="h-4 w-4" /></span>
                    <h3 className="text-sm font-semibold text-ink">Performance</h3>
                  </div>
                  <Badge tone={bandTone(analysis.band)}>{analysis.band}</Badge>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-accent-600"><FiCheckCircle className="h-3.5 w-3.5" /> Strengths</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {analysis.strengths.map((s) => <li key={s} className="flex gap-1.5"><span className="text-accent">•</span>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-warning-600"><FiAlertTriangle className="h-3.5 w-3.5" /> Areas to Improve</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {analysis.weaknesses.map((w) => <li key={w} className="flex gap-1.5"><span className="text-warning">•</span>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Recommendation card */}
                <Card>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary"><FiTarget className="h-4 w-4" /></span>
                    <h3 className="text-sm font-semibold text-ink">Recommendations</h3>
                  </div>
                  <ol className="space-y-3">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-[11px] font-bold text-secondary">{i + 1}</span>
                        {r}
                      </li>
                    ))}
                  </ol>
                </Card>

                {/* Prediction card */}
                <Card className="bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04]">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><FiZap className="h-4 w-4" /></span>
                    <h3 className="text-sm font-semibold text-ink">AI Prediction</h3>
                  </div>
                  <p className="text-xs text-slate-500">Predicted next-term score</p>
                  <p className="mt-1 text-4xl font-bold text-gradient">{analysis.prediction.nextTermScore}%</p>
                  <div className="mt-4 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Confidence</span>
                      <span className="font-semibold text-ink">{analysis.prediction.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Risk Level</span>
                      <Badge tone={riskTone(analysis.prediction.riskLevel)}>{analysis.prediction.riskLevel}</Badge>
                    </div>
                  </div>
                  <p className="mt-4 rounded-lg bg-white/60 p-2.5 text-[11px] leading-relaxed text-slate-500">
                    Predictions are AI-generated estimates based on attendance and historical marks. Use as guidance alongside teacher judgement.
                  </p>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
