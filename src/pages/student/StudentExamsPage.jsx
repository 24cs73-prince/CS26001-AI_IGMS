import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiFileText,
  FiAward,
  FiPlay,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Badge } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function StudentExamsPage() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = "ST001"; // Mock student Rahul Patel

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const allExams = await onlineExamService.getExams();
        setExams(allExams);

        // Fetch submissions across exams for this student
        const studentSubs = [];
        for (const ex of allExams) {
          const subs = await onlineExamService.getSubmissions(ex.id);
          const found = subs.find((s) => s.studentId === studentId);
          if (found) {
            studentSubs.push({ ...found, examId: ex.id, examTitle: ex.title, exam: ex });
          }
        }
        setSubmissions(studentSubs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <PageLoader label="Loading student examinations..." />;
  }

  // Available Exams = Published status and student hasn't submitted yet
  const availableExams = exams.filter(
    (e) =>
      e.status === "Published" &&
      !submissions.some((s) => s.examId === e.id)
  );

  // Completed Exams = Exams where student has submitted an attempt
  const completedExams = submissions;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Online Examinations"
        description="View available tests, attempt online MCQ exams, and check your performance results."
        breadcrumbs={[{ label: "Online Exams" }]}
      />

      {/* Available Exams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <FiPlay className="text-primary h-5 w-5" />
            Available Exams
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {availableExams.length} Available
          </span>
        </div>

        {availableExams.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-sm text-slate-500">No active examinations available right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableExams.map((exam, idx) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card hover className="flex flex-col justify-between border border-hairline shadow-soft h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-hairline pb-3">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        {exam.subject}
                      </span>
                      <Badge tone="success">Available</Badge>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-ink">{exam.title}</h3>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs font-semibold text-slate-600">
                      <div>
                        <span className="block text-slate-400 font-normal">Questions</span>
                        <span className="text-ink font-bold">{exam.totalQuestions}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-normal">Marks</span>
                        <span className="text-ink font-bold">{exam.totalMarks}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-normal">Duration</span>
                        <span className="text-ink font-bold">{exam.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-hairline pt-4 flex justify-end">
                    <Button
                      icon={FiPlay}
                      onClick={() => navigate(`/student/exams/${exam.id}/start`)}
                      className="bg-primary hover:bg-primary-600 text-white w-full sm:w-auto shadow-soft"
                    >
                      Start Exam
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Exams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 h-5 w-5" />
            Completed Exams
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {completedExams.length} Attempted
          </span>
        </div>

        {completedExams.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-sm text-slate-500">You have not completed any online examinations yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedExams.map((sub, idx) => {
              const resultsPublished = sub.exam?.resultsStatus === "PUBLISHED";

              return (
                <motion.div
                  key={sub.examId || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card hover className="flex flex-col justify-between border border-hairline shadow-soft h-full">
                    <div>
                      <div className="flex items-center justify-between border-b border-hairline pb-3">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {sub.exam?.subject || "Subject"}
                        </span>
                        <Badge tone={resultsPublished ? "success" : "warning"}>
                          {resultsPublished ? "Results Published" : "Results Pending"}
                        </Badge>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-ink">{sub.examTitle}</h3>

                      {resultsPublished ? (
                        <div className="mt-4 flex items-center justify-around rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                          <div>
                            <span className="text-[11px] font-semibold text-emerald-700 uppercase">Marks</span>
                            <p className="text-lg font-black text-emerald-900">
                              {sub.obtainedMarks} / {sub.totalMarks || sub.exam?.totalMarks || 20}
                            </p>
                          </div>
                          <div className="border-l border-emerald-200 h-8" />
                          <div>
                            <span className="text-[11px] font-semibold text-emerald-700 uppercase">Percentage</span>
                            <p className="text-lg font-black text-emerald-900">{sub.percentage}%</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-center text-xs font-medium text-amber-800">
                          Your responses have been recorded. Waiting for teacher evaluation and publication.
                        </div>
                      )}
                    </div>

                    <div className="mt-6 border-t border-hairline pt-4 flex justify-end">
                      <Button
                        variant="outline"
                        icon={FiEye}
                        onClick={() => navigate("/student/results")}
                        className="w-full sm:w-auto text-xs"
                      >
                        View Result
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
