import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiFileText,
  FiAward,
  FiUser,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function StudentExamStartPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("instructions"); // "instructions" -> "details"

  // Mock Student details
  const student = {
    name: "Rahul Patel",
    studentId: "ST001",
    classVal: "10",
    division: "A",
  };

  useEffect(() => {
    async function loadExam() {
      try {
        setLoading(true);
        const data = await onlineExamService.getExamById(examId);
        setExam(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [examId]);

  if (loading) {
    return <PageLoader label="Loading examination rules..." />;
  }

  if (!exam) {
    return (
      <Card className="text-center py-12">
        <h3 className="text-lg font-bold text-ink">Exam Not Found</h3>
        <Button className="mt-4" onClick={() => navigate("/student/exams")}>
          Back to Online Exams
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={exam.title}
        description="Review examination instructions and verify student identity details before starting."
        breadcrumbs={[
          { label: "Online Exams", to: "/student/exams" },
          { label: "Exam Start" },
        ]}
      />

      {step === "instructions" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-hairline shadow-soft space-y-6">
            <div className="border-b border-hairline pb-4 flex items-center justify-between">
              <div>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {exam.subject}
                </span>
                <h2 className="text-xl font-bold text-ink mt-2">{exam.title}</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                <FiShield className="h-6 w-6" />
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Questions</span>
                <p className="text-lg font-bold text-ink">{exam.totalQuestions}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Total Marks</span>
                <p className="text-lg font-bold text-ink">{exam.totalMarks}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Duration</span>
                <p className="text-lg font-bold text-ink">{exam.duration}</p>
              </div>
            </div>

            {/* Instructions list */}
            <div>
              <h3 className="text-sm font-bold text-ink mb-3 uppercase tracking-wider">
                Examination Rules & Instructions:
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  Attempt all questions within the allocated time duration.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  Each multiple-choice question carries 1 mark. There is no negative marking.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  You can freely navigate between questions using the Question Navigator panel.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  Once submitted, the examination cannot be retaken or edited.
                </li>
                <li className="flex items-start gap-2.5 font-semibold text-rose-600">
                  <span className="h-2 w-2 rounded-full bg-rose-600 mt-2 shrink-0" />
                  Do not refresh or close the browser tab during the active examination.
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end">
              <Button
                icon={FiArrowRight}
                onClick={() => setStep("details")}
                className="bg-primary hover:bg-primary-600 text-white shadow-soft"
              >
                Proceed to Details
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === "details" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-hairline shadow-soft space-y-6">
            <div className="border-b border-hairline pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">Student Verification</h2>
                <p className="text-xs text-slate-500">Confirm your candidate identity details before starting the quiz.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                <FiUser className="h-6 w-6" />
              </div>
            </div>

            {/* Readonly details fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Student Name</label>
                <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-hairline bg-slate-100 px-3.5 text-sm font-bold text-ink">
                  {student.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Student ID</label>
                <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-hairline bg-slate-100 px-3.5 text-sm font-bold text-ink">
                  {student.studentId}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Class</label>
                <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-hairline bg-slate-100 px-3.5 text-sm font-bold text-ink">
                  Class {student.classVal}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Division</label>
                <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-hairline bg-slate-100 px-3.5 text-sm font-bold text-ink">
                  Section {student.division}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep("instructions")}>
                Back to Rules
              </Button>

              <Button
                icon={FiCheckCircle}
                onClick={() => navigate(`/student/exams/${exam.id}/attempt`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
              >
                Continue to Exam
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
