import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiCpu,
  FiBarChart2,
  FiCheckSquare,
  FiArrowLeft,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Badge, Table } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function StudentSubmissionsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ex = await onlineExamService.getExamById(examId);
      setExam(ex);
      const subs = await onlineExamService.getSubmissions(examId);
      setSubmissions(subs);
      if (ex?.evaluationCompleted) {
        setEvaluationDone(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleEvaluateAll = async () => {
    setEvaluating(true);
    try {
      const res = await onlineExamService.evaluateExam(examId);
      setSubmissions(res.submissions);
      setEvaluationDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return <PageLoader label="Loading student submissions..." />;
  }

  if (!exam) {
    return (
      <Card className="text-center py-12">
        <h3 className="text-lg font-bold text-ink">Exam Not Found</h3>
        <Button className="mt-4" onClick={() => navigate("/teacher/exams")}>
          Back to Online Exams
        </Button>
      </Card>
    );
  }

  const columns = [
    {
      key: "studentName",
      header: "Student",
      render: (row) => (
        <div>
          <span className="font-bold text-ink block">{row.studentName}</span>
          <span className="text-xs text-slate-400">Class {row.class || exam.class} • Div {row.division || 'A'}</span>
        </div>
      ),
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          {row.studentId}
        </span>
      ),
    },
    {
      key: "submittedAt",
      header: "Submitted Time",
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <FiClock className="h-3.5 w-3.5 text-slate-400" />
          {row.submittedAt || "10:42 AM"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Submission Status",
      render: (row) => (
        <Badge tone="success">
          {row.status || "Submitted"}
        </Badge>
      ),
    },
    {
      key: "evaluationState",
      header: "Evaluation",
      render: (row) => (
        <Badge tone={evaluationDone || row.evaluated ? "info" : "neutral"}>
          {evaluationDone || row.evaluated ? "Evaluated" : "Pending"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Submissions: ${exam.title}`}
        description="Review student exam submissions and trigger mock auto-evaluation."
        breadcrumbs={[
          { label: "Online Exams", to: "/teacher/exams" },
          { label: exam.title, to: `/teacher/exams/${exam.id}` },
          { label: "Submissions" },
        ]}
      />

      {/* Evaluation Banner Card */}
      <Card className="border border-hairline shadow-soft">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">
                {submissions.length} of {exam.totalStudents} students submitted
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Status:{" "}
                <span
                  className={
                    evaluationDone
                      ? "text-emerald-600 font-bold"
                      : "text-amber-600 font-bold"
                  }
                >
                  {evaluationDone ? "Evaluation Completed" : "Not Evaluated"}
                </span>
              </span>
            </div>

            {evaluationDone ? (
              <p className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <FiCheckCircle className="h-4 w-4" />
                {submissions.length} submissions evaluated successfully.
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Click Evaluate All to automatically grade all MCQ responses.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!evaluationDone ? (
              <Button
                icon={FiCpu}
                onClick={handleEvaluateAll}
                loading={evaluating}
                className="bg-primary hover:bg-primary-600 text-white shadow-soft"
              >
                Evaluate All
              </Button>
            ) : (
              <Button
                icon={FiBarChart2}
                onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
              >
                View Results
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card>
        <div className="border-b border-hairline pb-4 mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">Student Submissions Log</h3>
          <span className="text-xs font-semibold text-slate-500">
            Total Submissions: {submissions.length}
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No submissions recorded for this exam yet.</p>
          </div>
        ) : (
          <Table columns={columns} data={submissions} />
        )}
      </Card>
    </div>
  );
}
