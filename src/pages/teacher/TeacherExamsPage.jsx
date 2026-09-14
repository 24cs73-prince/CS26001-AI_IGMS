import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiFileText,
  FiClock,
  FiAward,
  FiUsers,
  FiEye,
  FiCheckSquare,
  FiBarChart2,
  FiSearch,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Badge } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";
import { onlineExamService } from "../../services/onlineExamService";
import { cn } from "../../utils/cn";

const FILTERS = ["All", "Draft", "Published", "Completed"];

export default function TeacherExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await onlineExamService.getExams();
      setExams(data);
    } catch (err) {
      console.error("Failed to load exams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const filteredExams = (exams || []).filter((exam) => {
    if (!exam) return false;
    const status = String(exam.status || "").toLowerCase();
    const matchesFilter =
      activeFilter === "All" ||
      status === activeFilter.toLowerCase();

    const title = String(exam.title || "").toLowerCase();
    const subject = String(exam.subject || "").toLowerCase();
    const cls = String(exam.class || exam.classVal || "").toLowerCase();
    const q = (searchQuery || "").toLowerCase();

    const matchesSearch =
      !q ||
      title.includes(q) ||
      subject.includes(q) ||
      cls.includes(q);

    return matchesFilter && matchesSearch;
  });


  if (loading) {
    return <PageLoader label="Loading online examinations..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Online Exams"
        description="Manage online MCQ examinations, evaluate student submissions, and publish results."
        breadcrumbs={[{ label: "Online Exams" }]}
        action={
          <Button
            icon={FiPlus}
            onClick={() => navigate("/teacher/exams/create")}
            className="bg-primary hover:bg-primary-600 shadow-soft"
          >
            Create Exam
          </Button>
        }
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150",
                activeFilter === f
                  ? "bg-primary text-white shadow-soft"
                  : "bg-white text-slate-600 border border-hairline hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search exam by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-white pl-10 pr-4 py-2 text-sm font-medium text-ink placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <FiFileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-ink">No examinations found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            No exams match your current filter or search criteria. Create a new online exam from a generated MCQ paper.
          </p>
          <Button
            icon={FiPlus}
            onClick={() => navigate("/teacher/exams/create")}
            className="mt-4"
          >
            Create Exam
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam, idx) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card hover className="flex h-full flex-col justify-between border border-hairline shadow-soft">
                <div>
                  {/* Status & Subject Pill */}
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      {exam.subject} • Class {exam.class}
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
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-bold text-ink line-clamp-2">
                    {exam.title}
                  </h3>

                  {/* Specs */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center text-xs font-semibold text-slate-600">
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

                  {/* Submissions counter */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-hairline px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <FiUsers className="h-4 w-4 text-primary" />
                      Submissions
                    </span>
                    <span className="text-xs font-bold text-ink">
                      {exam.submissionsCount} / {exam.totalStudents} Students
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-2 border-t border-hairline pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    icon={FiEye}
                    onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    icon={FiCheckSquare}
                    onClick={() => navigate(`/teacher/exams/${exam.id}/submissions`)}
                  >
                    Submissions
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs bg-ink hover:bg-slate-800 text-white"
                    icon={FiBarChart2}
                    onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                  >
                    Results
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
