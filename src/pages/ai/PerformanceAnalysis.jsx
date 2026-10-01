import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiZap, FiCheckCircle, FiAlertTriangle, FiTarget, FiActivity } from 'react-icons/fi';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import { analyzePerformance } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Badge, Avatar } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';

/**
 * AI Student Performance Analysis.
 * Select a student from database → AI evaluates real marks & attendance,
 * returning strengths, growth areas, tailored recommendations, and next-term predictions.
 */
export default function PerformanceAnalysis() {
  const { t, language } = useLanguage();
  const { data: students, loading: loadingStudents } = useFetch(() => api.getStudents(), []);
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  if (loadingStudents) return <PageLoader label={t("common.loading")} />;

  const options = (students || []).map((s) => ({ value: s.id, label: `${s.name} · ${s.className}` }));

  const handleSelect = async (opt) => {
    const student = students.find((s) => s.id === opt.value);
    setSelected(student);
    setAnalysis(null);
    setAnalyzing(true);
    try {
      const result = await analyzePerformance(student);
      setAnalysis(result);
    } catch {
      toast.error(language === "gu" ? 'વિશ્લેષણ કરવામાં ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.' : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const bandTone = (band) =>
    band === 'Excellent' ? 'success' : band === 'Good' ? 'primary' : band === 'Average' ? 'warning' : 'danger';
  const riskTone = (r) => (r === 'Low' ? 'success' : r === 'Moderate' ? 'warning' : 'danger');

  return (
    <div className="space-y-6">
      <PageHeader
        title={language === "gu" ? "AI વિદ્યાર્થી પ્રદર્શન વિશ્લેષણ" : "AI Student Performance Analysis"}
        description={language === "gu" ? "વિદ્યાર્થીની હાજરી અને ગુણ આધારિત AI વિશ્લેષણ અને ભલામણો." : "AI-powered insights, recommendations, and predictions based on database marks & attendance."}
        breadcrumbs={[{ label: 'AI Suite' }, { label: 'Performance Analysis' }]}
        action={<Badge tone="secondary">AI Assistant</Badge>}
      />

      {/* Student selector */}
      <Card className="border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Dropdown
              label={language === "gu" ? "વિશ્લેષણ માટે વિદ્યાર્થી પસંદ કરો" : "Select a student to analyze"}
              options={options}
              value={selected ? { value: selected.id, label: `${selected.name} · ${selected.className}` } : ''}
              onChange={handleSelect}
              placeholder={language === "gu" ? "વિદ્યાર્થી પસંદ કરો..." : "Choose a student…"}
            />
          </div>
          <Button icon={FiZap} loading={analyzing} disabled={!selected} onClick={() => selected && handleSelect({ value: selected.id })}>
            {language === "gu" ? "પુનઃ વિશ્લેષણ" : "Re-analyze"}
          </Button>
        </div>
      </Card>

      {!selected ? (
        <EmptyState
          icon={FiActivity}
          title={language === "gu" ? "કોઈ વિદ્યાર્થી પસંદ કરેલ નથી" : "No student selected"}
          description={language === "gu" ? "AI પ્રદર્શન વિશ્લેષણ જોવા માટે ઉપર આપેલ ડ્રોપડાઉનમાંથી વિદ્યાર્થી પસંદ કરો." : "Select a student above to generate an AI-powered performance analysis."}
        />
      ) : (
        <div className="space-y-4">
          {/* Student summary + attendance/marks */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1 border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} size="xl" />
                <div>
                  <h3 className="text-base font-bold text-[#0f2b4d]">{selected.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selected.className} · Section {selected.section}</p>
                  <p className="mt-1 text-xs text-slate-400 font-mono">{selected.id}</p>
                </div>
              </div>
            </Card>

            {/* Attendance summary */}
            <Card className="border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {language === "gu" ? "હાજરી સારાંશ" : "Attendance Summary"}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">{selected.attendance}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${selected.attendance >= 85 ? 'bg-emerald-500' : selected.attendance >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${selected.attendance}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500 font-medium">{selected.attendance >= 85 ? (language === "gu" ? 'ઉત્તમ નિયમિત હાજરી' : 'Excellent attendance') : (language === "gu" ? 'હાજરીમાં સુધારો જરૂરી છે' : 'Attendance needs improvement')}</p>
            </Card>

            {/* Marks summary */}
            <Card className="border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {language === "gu" ? "ગુણ સારાંશ" : "Marks Summary"}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">{selected.average}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${selected.average}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                {language === "gu" ? "સત્રાંત પરીક્ષામાં સરેરાશ સ્કોર" : "Overall academic average from database marks"}
              </p>
            </Card>
          </div>

          {/* AI output */}
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex min-h-[240px] flex-col items-center justify-center gap-4 border border-slate-200 p-8 shadow-xs">
                  <Loader size="lg" />
                  <p className="text-xs text-slate-500 font-bold">
                    {language === "gu" ? "AI મોડલ વિદ્યાર્થીના પ્રદર્શનનું વિશ્લેષણ કરી રહ્યું છે..." : "AI is analyzing performance patterns from student metrics…"}
                  </p>
                </Card>
              </motion.div>
            ) : analysis ? (
              <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Performance card */}
                <Card className="border border-slate-200 p-5 shadow-xs">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold"><FiTrendingUp className="h-4 w-4" /></span>
                      <h3 className="text-xs font-bold text-[#0f2b4d]">{language === "gu" ? "પ્રદર્શન સ્તર" : "Performance"}</h3>
                    </div>
                    <Badge tone={bandTone(analysis.band)}>{analysis.band}</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-700"><FiCheckCircle className="h-3.5 w-3.5" /> {language === "gu" ? "મજબૂત પાસાં" : "Strengths"}</p>
                      <ul className="space-y-1 text-xs text-slate-600 font-medium">
                        {analysis.strengths.map((s) => <li key={s} className="flex gap-1.5"><span className="text-emerald-500 font-bold">•</span>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-700"><FiAlertTriangle className="h-3.5 w-3.5" /> {language === "gu" ? "સુધારવા યોગ્ય ક્ષેત્રો" : "Areas to Improve"}</p>
                      <ul className="space-y-1 text-xs text-slate-600 font-medium">
                        {analysis.weaknesses.map((w) => <li key={w} className="flex gap-1.5"><span className="text-amber-500 font-bold">•</span>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Recommendation card */}
                <Card className="border border-slate-200 p-5 shadow-xs">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold"><FiTarget className="h-4 w-4" /></span>
                    <h3 className="text-xs font-bold text-[#0f2b4d]">{language === "gu" ? "AI ભલામણો" : "Recommendations"}</h3>
                  </div>
                  <ol className="space-y-3">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-700 font-medium">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-black text-purple-800">{i + 1}</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ol>
                </Card>

                {/* Prediction card */}
                <Card className="border border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-5 shadow-xs">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold"><FiZap className="h-4 w-4" /></span>
                    <h3 className="text-xs font-bold text-[#0f2b4d]">{language === "gu" ? "AI પૂર્વાનુમાન" : "AI Prediction"}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{language === "gu" ? "આગામી સત્ર માટે સંભવિત સ્કોર" : "Predicted next-term score"}</p>
                  <p className="mt-1 text-3xl font-black text-[#0f2b4d]">{analysis.prediction.nextTermScore}%</p>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{language === "gu" ? "વિશ્વાસપાત્રતા દર" : "Confidence"}</span>
                      <span className="font-bold text-[#0f2b4d]">{analysis.prediction.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{language === "gu" ? "જોખમ સ્તર" : "Risk Level"}</span>
                      <Badge tone={riskTone(analysis.prediction.riskLevel)}>{analysis.prediction.riskLevel}</Badge>
                    </div>
                  </div>
                  <p className="mt-4 rounded-xl bg-white/80 p-2.5 text-[10px] leading-relaxed text-slate-500 border border-slate-100">
                    {language === "gu" ? "આ પૂર્વાનુમાન વિદ્યાર્થીની હાજરી અને પાછલા પરિણામો પર આધારિત અંદાજ છે." : "Predictions are AI-generated estimates based on attendance and historical marks."}
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
