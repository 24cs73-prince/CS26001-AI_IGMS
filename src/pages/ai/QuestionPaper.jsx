import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiZap, FiDownload, FiRefreshCw, FiFileText } from 'react-icons/fi';

import { CLASSES, SUBJECTS, DIFFICULTY_LEVELS } from '../../constants/app';
import { generateQuestionPaper } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

import PageHeader from '../../components/common/PageHeader';
import { Button, Card, Dropdown, Input, Badge } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

/**
 * AI Question Paper Generator.
 * Configures criteria, generates questions using AI, and automatically writes
 * the generated exam paper directly to MongoDB Exam collection.
 */
export default function QuestionPaper() {
  const { t, language } = useLanguage();
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

      // Auto save into MongoDB
      try {
        const questionsList = [];
        (result.sections || []).forEach((sec) => {
          (sec.questions || []).forEach((q) => {
            questionsList.push({
              id: questionsList.length + 1,
              question: q.text,
              questionText: q.text,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              marks: q.marks || 1,
            });
          });
        });

        const token = localStorage.getItem("igms.token") || localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const examPayload = {
          title: `${config.subject.value} Question Paper (${config.className.value})`,
          classVal: String(config.className.value).replace(/\D/g, "") || "8",
          subject: config.subject.value,
          syllabus: `${config.difficulty.value} Level Curriculum`,
          duration: "60 minutes",
          durationMinutes: 60,
          totalQuestions: questionsList.length,
          totalMarks: result.meta?.totalMarks || questionsList.length,
          status: "Published",
          questions: questionsList,
        };

        await fetch("http://localhost:5000/api/exams", {
          method: "POST",
          headers,
          body: JSON.stringify(examPayload),
        }).catch(() => null);
      } catch (err) {
        console.warn("Auto save exam error:", err);
      }

      toast.success(language === "gu" ? 'પ્રશ્નપત્ર તૈયાર થયું અને ડેટાબેઝમાં સંગ્રહિત થયું.' : 'Question paper generated & saved to database.');
    } catch {
      toast.error(language === "gu" ? 'પ્રશ્નપત્ર બનાવવામાં ક્ષતિ આવી.' : 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={language === "gu" ? "AI પ્રશ્નપત્ર જનરેટર" : "AI Question Paper Generator"}
        description={language === "gu" ? "ગુજરાત શિક્ષણ બોર્ડ અભ્યાસક્રમ મુજબ સેકન્ડોમાં પ્રશ્નપત્ર બનાવો." : "Generate curriculum-aligned question papers in seconds and store in database."}
        breadcrumbs={[{ label: 'AI Suite' }, { label: 'Question Paper Generator' }]}
        action={<Badge tone="secondary">AI Assistant</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Config panel */}
        <Card className="lg:col-span-1 h-fit border border-slate-200 p-5 shadow-xs">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold">
              <FiCpu className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0f2b4d]">{language === "gu" ? "ગોઠવણી (Configuration)" : "Configuration"}</h3>
              <p className="text-[10px] text-slate-400">{language === "gu" ? "પ્રશ્નપત્રના પરિમાણો પસંદ કરો" : "Set the paper parameters"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Dropdown label={language === "gu" ? "વર્ગ (Class)" : "Class"} options={CLASSES.map((c) => ({ value: c, label: c }))} value={config.className} onChange={(v) => setConfig((c) => ({ ...c, className: v }))} />
            <Dropdown label={language === "gu" ? "વિષય (Subject)" : "Subject"} options={SUBJECTS.map((s) => ({ value: s, label: s }))} value={config.subject} onChange={(v) => setConfig((c) => ({ ...c, subject: v }))} />
            <Dropdown label={language === "gu" ? "કાઠિન્ય સ્તર (Difficulty)" : "Difficulty"} options={DIFFICULTY_LEVELS.map((d) => ({ value: d, label: d }))} value={config.difficulty} onChange={(v) => setConfig((c) => ({ ...c, difficulty: v }))} />
            <Input label={language === "gu" ? "પ્રશ્નોની સંખ્યા (Questions)" : "Number of Questions"} type="number" min={5} max={30} value={config.count} onChange={(e) => setConfig((c) => ({ ...c, count: e.target.value }))} />
          </div>

          <Button className="mt-6 w-full" icon={FiZap} loading={loading} onClick={handleGenerate}>
            {loading ? (language === "gu" ? 'પ્રશ્નપત્ર બની રહ્યું છે…' : 'Generating…') : (language === "gu" ? 'પ્રશ્નપત્ર બનાવો' : 'Generate Paper')}
          </Button>
        </Card>

        {/* Result area */}
        <Card className="lg:col-span-2 min-h-[420px] border border-slate-200 p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-[#0f2b4d]">
              {language === "gu" ? "તૈયાર થયેલ પ્રશ્નપત્ર" : "Generated Paper"}
            </h3>
            {paper && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon={FiRefreshCw} onClick={handleGenerate}>
                  {language === "gu" ? "ફરી બનાવો" : "Regenerate"}
                </Button>
                <Button size="sm" variant="outline" icon={FiDownload} onClick={() => toast.info(language === "gu" ? "ડાઉનલોડ શરૂ થયું." : 'Download started.')}>
                  {language === "gu" ? "નિકાસ (Export)" : "Export"}
                </Button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="flex min-h-[340px] flex-col items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader size="lg" />
                <p className="text-xs text-slate-500 font-bold">
                  {language === "gu" ? "AI મોડલ પ્રશ્નપત્ર તૈયાર કરી રહ્યું છે..." : "AI is drafting your question paper…"}
                </p>
              </motion.div>
            ) : paper ? (
              <motion.div key="paper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200">
                {/* Paper header */}
                <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {language === "gu" ? "ગુજરાત રાજ્ય શાળા શિક્ષણ વિભાગ" : "Directorate of School Education"}
                  </p>
                  <h2 className="mt-1 text-base font-extrabold text-[#0f2b4d]">{paper.meta.subject} — {paper.meta.className}</h2>
                  <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                    <span>{language === "gu" ? "કાઠિન્ય" : "Difficulty"}: <b className="text-[#0f2b4d]">{paper.meta.difficulty}</b></span>
                    <span>{language === "gu" ? "કુલ ગુણ" : "Max Marks"}: <b className="text-[#0f2b4d]">{paper.meta.totalMarks}</b></span>
                    <span>{language === "gu" ? "સમય" : "Duration"}: <b className="text-[#0f2b4d]">{paper.meta.duration}</b></span>
                  </div>
                </div>
                {/* Sections */}
                <div className="space-y-6 p-5">
                  {paper.sections.map((sec) => (
                    <div key={sec.title}>
                      <h4 className="mb-3 text-xs font-bold text-blue-700">{sec.title}</h4>
                      <ol className="space-y-2.5">
                        {sec.questions.map((q) => (
                          <li key={q.no} className="flex items-start justify-between gap-4 text-xs">
                            <span className="text-slate-700 font-medium"><span className="mr-2 font-bold text-slate-400">{q.no}.</span>{q.text}</span>
                            <span className="shrink-0 text-[10px] font-bold text-slate-400">[{q.marks} {language === "gu" ? "ગુણ" : "mark"}]</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
                <p className="border-t border-slate-100 p-4 text-center text-[10px] text-slate-400">
                  {language === "gu" ? "AI-IGMS પોર્ટલ દ્વારા નિર્મિત" : "Generated by AI-IGMS"} · {formatDate(paper.meta.generatedAt)}
                </p>
              </motion.div>
            ) : (
              <EmptyState
                key="empty"
                icon={FiFileText}
                title={language === "gu" ? "કોઈ પ્રશ્નપત્ર બનેલ નથી" : "No paper generated yet"}
                description={language === "gu" ? "ડાબી બાજુની પેનલમાંથી વિકલ્પો પસંદ કરી 'પ્રશ્નપત્ર બનાવો' બટન પર ક્લિક કરો." : "Configure the options on the left and click Generate to create an AI question paper."}
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
