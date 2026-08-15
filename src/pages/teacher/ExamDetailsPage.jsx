import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckSquare,
  FiBarChart2,
  FiSend,
  FiUsers,
  FiClock,
  FiAward,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Badge, Modal } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function ExamDetailsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const data = await onlineExamService.getExamById(examId);
      setExam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const handlePublishResults = async () => {
    setPublishing(true);
    try {
      await onlineExamService.publishResults(examId);
      await fetchExam();
      setShowPublishModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <PageLoader label="Loading examination details..." />;
  }

  if (!exam) {
    return (
      <Card className="text-center py-12">
        <h3 className="text-lg font-bold text-ink">Exam Not Found</h3>
        <p className="text-sm text-slate-500 mt-2">The requested exam could not be located.</p>
        <Button className="mt-4" onClick={() => navigate("/teacher/exams")}>
          Back to Online Exams
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={exam.title}
        description={`Class ${exam.class} • ${exam.subject} Examination`}
        breadcrumbs={[
          { label: "Online Exams", to: "/teacher/exams" },
          { label: exam.title },
        ]}
      />

      {/* Main Details Card */}
      <Card className="border border-hairline shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-hairline pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {exam.subject}
              </span>
              <Badge
                tone={
                  exam.status === "Published"
                    ? "success"
                    : exam.status === "Completed"
                    ? "info"
                    : "neutral"
                }
              >
                {exam.status}
              </Badge>
              <Badge
                tone={exam.resultsStatus === "PUBLISHED" ? "success" : "warning"}
              >
                Results: {exam.resultsStatus}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-black text-ink">{exam.title}</h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              icon={FiCheckSquare}
              onClick={() => navigate(`/teacher/exams/${exam.id}/submissions`)}
            >
              View Submissions
            </Button>

            <Button
              variant="outline"
              icon={FiBarChart2}
              onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
            >
              View Results
            </Button>

            {exam.resultsStatus !== "PUBLISHED" && (
              <Button
                icon={FiSend}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
                onClick={() => setShowPublishModal(true)}
              >
                Publish Results
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Class</span>
            <p className="mt-1 text-xl font-bold text-ink">Class {exam.class}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Questions</span>
            <p className="mt-1 text-xl font-bold text-ink">{exam.totalQuestions}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Marks</span>
            <p className="mt-1 text-xl font-bold text-ink">{exam.totalMarks}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Duration</span>
            <p className="mt-1 text-xl font-bold text-ink">{exam.duration}</p>
          </div>
        </div>

        {/* Submissions Card Banner */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Student Submissions</h3>
              <p className="text-xs text-slate-600">
                {exam.submissionsCount} out of {exam.totalStudents} enrolled students have submitted their attempts.
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              size="sm"
              icon={FiCheckSquare}
              onClick={() => navigate(`/teacher/exams/${exam.id}/submissions`)}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              Manage Submissions
            </Button>
          </div>
        </div>
      </Card>

      {/* Questions Preview */}
      <Card>
        <div className="border-b border-hairline pb-4 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">Question Paper Preview</h3>
            <p className="text-xs text-slate-500">20 MCQ questions configured for this exam.</p>
          </div>
          <Badge tone="info">{exam.questions?.length || 0} Questions</Badge>
        </div>

        <div className="space-y-4">
          {exam.questions?.map((q, idx) => (
            <div
              key={q.id || idx}
              className="rounded-xl border border-hairline p-4 transition-colors hover:border-primary/30 hover:bg-slate-50/50"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-ink">
                  <span className="mr-2 text-primary font-black">Q{idx + 1}.</span>
                  {q.question}
                </p>
                <span className="shrink-0 text-xs font-semibold text-slate-500">
                  {q.marks || 1} mark
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`flex items-center gap-2.5 rounded-lg border p-2 text-xs font-medium ${
                      oIdx === q.correctAnswer
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                        : "border-hairline bg-white text-slate-700"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        oIdx === q.correctAnswer
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="truncate">{opt}</span>
                    {oIdx === q.correctAnswer && (
                      <span className="ml-auto text-[10px] text-emerald-600 font-bold uppercase">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Publish Results Confirmation Modal */}
      <Modal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Results?"
      >
        <div className="space-y-4 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
            <FiCheckCircle className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-ink">Publish Examination Results?</h3>
            <p className="text-sm text-slate-500 mt-1">
              Students will be able to view their marks, percentage, and detailed AI performance feedback immediately after publication.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
            <Button variant="outline" onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePublishResults}
              loading={publishing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
            >
              Publish Results
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
