import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiSend,
  FiSearch,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiEye,
  FiCpu,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Badge, Table, Modal } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";

export default function TeacherResultsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("marks-desc");

  // Selected Student for AI detail modal
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Publish Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ex = await onlineExamService.getExamById(examId);
      setExam(ex);
      let subs = await onlineExamService.getSubmissions(examId);

      // If not evaluated yet, run auto-calc in view
      subs = subs.map((s) => {
        if (!s.evaluated) {
          const res = onlineExamService.calculateEvaluation(ex.questions, s.answers || {});
          return { ...s, ...res };
        }
        return s;
      });

      setSubmissions(subs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleDownload = () => {
    if (!exam) return;
    onlineExamService.downloadResultsCSV(exam.title, submissions);
  };

  const handlePublishResults = async () => {
    setPublishing(true);
    try {
      await onlineExamService.publishResults(examId);
      const updated = await onlineExamService.getExamById(examId);
      setExam(updated);
      setShowPublishModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <PageLoader label="Loading examination results..." />;
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

  // Calculate Average Percentage
  const avgPercentage =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) /
            submissions.length
        )
      : 0;

  // Filtering & Sorting
  const filteredSubmissions = submissions
    .filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        statusFilter === "All" ||
        s.performanceBadge?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "marks-desc") return (b.obtainedMarks || 0) - (a.obtainedMarks || 0);
      if (sortBy === "marks-asc") return (a.obtainedMarks || 0) - (b.obtainedMarks || 0);
      if (sortBy === "percentage-desc") return (b.percentage || 0) - (a.percentage || 0);
      if (sortBy === "percentage-asc") return (a.percentage || 0) - (b.percentage || 0);
      return 0;
    });

  const columns = [
    {
      key: "studentName",
      header: "Student",
      render: (row) => (
        <button
          onClick={() => setSelectedStudent(row)}
          className="text-left font-bold text-primary hover:underline block"
        >
          {row.studentName}
          <span className="block text-[11px] font-normal text-slate-500">ID: {row.studentId}</span>
        </button>
      ),
    },
    {
      key: "marks",
      header: "Marks",
      render: (row) => (
        <span className="font-bold text-ink">
          {row.obtainedMarks} / {row.totalMarks || exam.totalMarks}
        </span>
      ),
    },
    {
      key: "percentage",
      header: "Percentage",
      render: (row) => (
        <span className="font-bold text-slate-700">{row.percentage}%</span>
      ),
    },
    {
      key: "correct",
      header: "Correct",
      render: (row) => (
        <span className="font-semibold text-emerald-600">{row.correctCount}</span>
      ),
    },
    {
      key: "wrong",
      header: "Wrong",
      render: (row) => (
        <span className="font-semibold text-rose-600">{row.wrongCount}</span>
      ),
    },
    {
      key: "unanswered",
      header: "Unanswered",
      render: (row) => (
        <span className="font-semibold text-slate-400">{row.unansweredCount}</span>
      ),
    },
    {
      key: "status",
      header: "Performance Status",
      render: (row) => (
        <Badge
          tone={
            row.performanceBadge === "Excellent" || row.performanceBadge === "Outstanding"
              ? "success"
              : row.performanceBadge === "Good"
              ? "info"
              : "warning"
          }
        >
          {row.performanceBadge || "Evaluated"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          icon={FiEye}
          onClick={() => setSelectedStudent(row)}
          className="text-xs"
        >
          Analysis
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={`Results: ${exam.title}`}
        description="Comprehensive score sheet, AI performance evaluation, and student analytics."
        breadcrumbs={[
          { label: "Online Exams", to: "/teacher/exams" },
          { label: exam.title, to: `/teacher/exams/${exam.id}` },
          { label: "Results" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              icon={FiDownload}
              onClick={handleDownload}
            >
              Download Results
            </Button>
            {exam.resultsStatus === "DRAFT" ? (
              <Button
                icon={FiSend}
                onClick={() => setShowPublishModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
              >
                Publish Results
              </Button>
            ) : (
              <Badge tone="success" className="px-3 py-1.5 text-xs font-bold">
                ✓ RESULTS PUBLISHED
              </Badge>
            )}
          </div>
        }
      />

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Students</span>
          <p className="mt-1 text-2xl font-black text-ink">{exam.totalStudents}</p>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Submitted</span>
          <p className="mt-1 text-2xl font-black text-primary">{submissions.length}</p>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Evaluated</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">{submissions.length}</p>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average %</span>
          <p className="mt-1 text-2xl font-black text-accent">{avgPercentage}%</p>
        </Card>

        <Card className="p-4 text-center col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Status</span>
          <div className="mt-1">
            <Badge tone={exam.resultsStatus === "PUBLISHED" ? "success" : "warning"}>
              {exam.resultsStatus}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Search, Filter & Sort Controls */}
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-white pl-10 pr-4 py-2 text-sm text-ink placeholder-slate-400 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Filter Pills & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {["All", "Excellent", "Good", "Needs Improvement"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    statusFilter === f
                      ? "bg-white text-primary shadow-soft"
                      : "text-slate-600 hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-hairline bg-white px-3 py-2 text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="marks-desc">Sort by Marks (High to Low)</option>
              <option value="marks-asc">Sort by Marks (Low to High)</option>
              <option value="percentage-desc">Sort by Percentage (High to Low)</option>
              <option value="percentage-asc">Sort by Percentage (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No student records found for this query.</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredSubmissions} />
        )}
      </Card>

      {/* Section 9: Individual Student AI Analysis Modal */}
      {selectedStudent && (
        <Modal
          open={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          title="Student Performance Analysis"
        >
          <div className="space-y-6 py-2">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">{selectedStudent.studentName}</h3>
                <p className="text-xs text-slate-500">
                  Student ID: <span className="font-semibold text-slate-700">{selectedStudent.studentId}</span> • Class {exam.class} ({exam.subject})
                </p>
              </div>
              <Badge tone={selectedStudent.percentage >= 75 ? "success" : "warning"}>
                {selectedStudent.performanceBadge || "Evaluated"}
              </Badge>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-4 gap-3 text-center bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Score</span>
                <p className="text-lg font-bold text-ink">
                  {selectedStudent.obtainedMarks} / {selectedStudent.totalMarks || exam.totalMarks}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Percentage</span>
                <p className="text-lg font-bold text-primary">{selectedStudent.percentage}%</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Correct</span>
                <p className="text-lg font-bold text-emerald-600">{selectedStudent.correctCount}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Wrong</span>
                <p className="text-lg font-bold text-rose-600">{selectedStudent.wrongCount}</p>
              </div>
            </div>

            {/* AI Performance Analysis Card */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm border-b border-primary/10 pb-2">
                <FiCpu className="h-5 w-5" />
                AI Performance Analysis
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Overall Performance</h4>
                <p className="text-sm font-semibold text-ink mt-0.5">
                  {selectedStudent.aiFeedback?.overallPerformance || selectedStudent.performanceBadge}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Strengths</h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  {selectedStudent.aiFeedback?.strengths || "Strong conceptual understanding shown across questions."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Areas for Improvement</h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  {selectedStudent.aiFeedback?.areasForImprovement || "Review incorrect questions for clarity."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Recommendation</h4>
                <p className="text-xs text-slate-700 mt-0.5 font-medium">
                  {selectedStudent.aiFeedback?.recommendation || "Practice additional mock tests."}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close Analysis
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Section 10: Publish Confirmation Modal */}
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
              Students will be able to view their marks, percentage, and AI performance analysis after publication.
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
