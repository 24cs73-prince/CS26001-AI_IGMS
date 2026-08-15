import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiHome,
} from "react-icons/fi";

import Card from "../../components/ui/Card";
import { Button, Modal } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function StudentExamAttemptPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active question index (0-indexed)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Selected answers state: { [questionId]: selectedOptionIndex }
  const [answers, setAnswers] = useState({});

  // Countdown timer in seconds (e.g., 30 mins = 1800s)
  const [timeLeft, setTimeLeft] = useState(1800);

  // Modals & State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadExamData() {
      try {
        setLoading(true);
        const data = await onlineExamService.getExamById(examId);
        setExam(data);
        if (data?.durationMinutes) {
          setTimeLeft(data.durationMinutes * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExamData();
  }, [examId]);

  // Live Timer Countdown Effect
  useEffect(() => {
    if (isSubmitted || loading || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, loading, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      await onlineExamService.submitExam({
        examId,
        studentId: "ST001",
        studentName: "Rahul Patel",
        answers,
      });
      setIsSubmitted(true);
      setShowSubmitModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader label="Preparing examination paper..." />;
  }

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <Card className="text-center py-12">
        <h3 className="text-lg font-bold text-ink">Exam Paper Not Available</h3>
        <Button className="mt-4" onClick={() => navigate("/student/exams")}>
          Back to Online Exams
        </Button>
      </Card>
    );
  }

  const currentQ = exam.questions[currentIndex];
  const totalQ = exam.questions.length;
  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== null && answers[key] !== undefined
  ).length;
  const unansweredCount = totalQ - answeredCount;

  // Post-submission Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-canvas p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="text-center py-10 px-6 space-y-6 shadow-xl border border-hairline">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-inner">
              <FiCheckCircle className="h-10 w-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-ink">Exam Submitted Successfully</h2>
              <p className="text-sm font-medium text-slate-600 mt-2">
                Your responses have been securely recorded.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-hairline p-4 text-xs font-semibold text-slate-700 space-y-2">
              <p>Exam: <span className="font-bold text-ink">{exam.title}</span></p>
              <p>Answered Questions: <span className="font-bold text-emerald-600">{answeredCount} / {totalQ}</span></p>
              <p className="text-slate-500 font-normal mt-2">
                Your marks will be available after the teacher evaluates and publishes the results.
              </p>
            </div>

            <Button
              icon={FiHome}
              onClick={() => navigate("/student/exams")}
              className="bg-primary hover:bg-primary-600 text-white w-full py-3 shadow-soft"
            >
              Back to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Fixed Examination Header */}
      <header className="sticky top-0 z-30 bg-sidebar text-white px-6 py-4 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold truncate max-w-md">{exam.title}</h1>
          <p className="text-xs text-slate-400">Class {exam.class} • {exam.subject}</p>
        </div>

        {/* Live Timer pill */}
        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-mono font-bold text-amber-300 border border-white/20">
          <FiClock className="h-4 w-4 animate-pulse" />
          <span>Time Remaining: {formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Examination Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Current Question Display (3 Cols on Desktop) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border border-hairline shadow-soft min-h-[420px] flex flex-col justify-between">
            <div>
              {/* Question Index Bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question {currentIndex + 1} of {totalQ}
                </span>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {currentQ?.marks || 1} Mark
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg md:text-xl font-bold text-ink leading-snug">
                <span className="text-primary font-black mr-2">Q{currentIndex + 1}.</span>
                {currentQ?.question}
              </h2>

              {/* Options list */}
              <div className="mt-6 space-y-3">
                {currentQ?.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(currentQ.id, oIdx)}
                      className={`w-full flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-soft"
                          : "border-hairline bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-sm font-medium flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Controls */}
            <div className="mt-8 border-t border-hairline pt-4 flex items-center justify-between">
              <Button
                variant="outline"
                icon={FiChevronLeft}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              {currentIndex < totalQ - 1 ? (
                <Button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Next <FiChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  icon={FiSend}
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
                >
                  Submit Exam
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Question Navigator (1 Col on Desktop) */}
        <div className="space-y-6">
          <Card className="border border-hairline shadow-soft">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-hairline pb-2">
              Question Navigator
            </h3>

            {/* Grid of 1 to N Question buttons */}
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered =
                  answers[q.id] !== undefined && answers[q.id] !== null;

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? "ring-2 ring-primary ring-offset-2 bg-primary text-white shadow-md"
                        : isAnswered
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 border-t border-hairline pt-4 space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-md bg-emerald-600" />
                Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-md bg-slate-200" />
                Unanswered ({unansweredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-md ring-2 ring-primary bg-primary" />
                Current Question
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline">
              <Button
                icon={FiSend}
                onClick={() => setShowSubmitModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
              >
                Submit Exam
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      <Modal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Examination?"
      >
        <div className="space-y-4 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 mx-auto">
            <FiAlertCircle className="h-7 w-7" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-ink">Submit Examination?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please confirm your submission. Once submitted, you cannot change your answers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-center text-xs font-bold">
            <div className="text-emerald-700">
              Answered: {answeredCount} / {totalQ}
            </div>
            <div className="text-slate-500">
              Unanswered: {unansweredCount} / {totalQ}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Continue Exam
            </Button>
            <Button
              onClick={handleSubmitExam}
              loading={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
