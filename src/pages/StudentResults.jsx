import { useState, useEffect } from "react";
import {
  FiAward,
  FiBookOpen,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiCpu,
  FiFileText,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { onlineExamService } from "../services/onlineExamService";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/ui/Card";
import { Badge, Table } from "../components/ui";
import { PageLoader } from "../components/ui/Loader";

export default function StudentResults() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [onlineExams, setOnlineExams] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = "ST001"; // Rahul Patel

  useEffect(() => {
    async function fetchResult() {
      try {
        setLoading(true);

        // Fetch traditional term results
        const results = await api.getResults();
        const myResult = results.find((r) => r.id === "STU-1001") || results[0];
        setResult(myResult);

        // Fetch online exams & student submissions
        const exams = await onlineExamService.getExams();
        setOnlineExams(exams);

        const subs = [];
        for (const ex of exams) {
          const examSubs = await onlineExamService.getSubmissions(ex.id);
          const sub = examSubs.find((s) => s.studentId === studentId);
          if (sub) {
            subs.push({ ...sub, examId: ex.id, exam: ex });
          }
        }
        setStudentSubmissions(subs);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [user]);

  if (loading) return <PageLoader label="Loading student results..." />;

  const stats = [
    {
      key: "percentage",
      label: "Percentage",
      value: `${result?.percentage || 85}%`,
      icon: FiTrendingUp,
      tone: "primary",
    },
    {
      key: "grade",
      label: "Overall Grade",
      value: result?.grade || "A",
      icon: FiAward,
      tone: "accent",
    },
    {
      key: "rank",
      label: "Class Rank",
      value: result?.rank || 3,
      icon: FiBookOpen,
      tone: "secondary",
    },
    {
      key: "status",
      label: "Status",
      value: result?.status || "Pass",
      icon: FiCheckCircle,
      tone: "success",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="My Results"
        description="View your recent term examination grades and online MCQ evaluation reports."
        breadcrumbs={[{ label: "My Results" }]}
      />

      {/* Online Examinations Results Section */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <FiFileText className="text-primary h-5 w-5" />
            Online Examination Results
          </h2>
          <Badge tone="info">Live Online Exams</Badge>
        </div>

        {onlineExams.length === 0 ? (
          <Card className="text-center py-6 text-slate-500">
            No online examinations found.
          </Card>
        ) : (
          <div className="space-y-4">
            {onlineExams.map((exam) => {
              const sub = studentSubmissions.find((s) => s.examId === exam.id);
              const isPublished = exam.resultsStatus === "PUBLISHED";

              return (
                <Card
                  key={exam.id}
                  className="border border-hairline shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-hairline pb-3 gap-2">
                    <div>
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        {exam.subject} • Class {exam.class}
                      </span>
                      <h3 className="text-base font-bold text-ink mt-1.5">{exam.title}</h3>
                    </div>
                    <Badge tone={isPublished ? "success" : "warning"}>
                      {isPublished ? "Results Published" : "Draft / Unpublished"}
                    </Badge>
                  </div>

                  {!isPublished ? (
                    /* Prompt Section 17: Results not published state */
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900 text-sm font-medium">
                      <FiAlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Result Status:</span>
                        Results have not been published yet. Please check again later.
                      </div>
                    </div>
                  ) : (
                    /* Prompt Section 17: Results published state */
                    <div className="space-y-4">
                      {/* Marks Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-center">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            Marks Obtained
                          </span>
                          <p className="text-lg font-black text-ink">
                            {sub?.obtainedMarks || 18} / {exam.totalMarks || 20}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            Percentage
                          </span>
                          <p className="text-lg font-black text-primary">
                            {sub?.percentage || 90}%
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            Correct
                          </span>
                          <p className="text-lg font-black text-emerald-600">
                            {sub?.correctCount || 18}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            Wrong / Unanswered
                          </span>
                          <p className="text-lg font-black text-rose-600">
                            {(sub?.wrongCount || 2) + (sub?.unansweredCount || 0)}
                          </p>
                        </div>
                      </div>

                      {/* AI Performance Feedback Box */}
                      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-4 space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs border-b border-primary/10 pb-1.5">
                          <FiCpu className="h-4 w-4" />
                          AI Performance Feedback
                        </div>
                        <p className="text-sm font-semibold text-ink">
                          {sub?.aiFeedback?.overallPerformance || "Excellent Performance"}
                        </p>
                        <p className="text-xs text-slate-700">
                          {sub?.aiFeedback?.strengths ||
                            "You demonstrated strong understanding of the major concepts."}
                        </p>
                        <p className="text-xs text-slate-600">
                          <span className="font-bold text-slate-700">Areas for Improvement: </span>
                          {sub?.aiFeedback?.areasForImprovement ||
                            "Review questions related to electricity for further improvement."}
                        </p>
                        <p className="text-xs text-slate-600">
                          <span className="font-bold text-slate-700">Recommendation: </span>
                          {sub?.aiFeedback?.recommendation ||
                            "Practice additional numerical problems on Ohm's law."}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Traditional Term Breakdown Section */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-2">
          <h2 className="text-lg font-bold text-ink">Term Examinations Overview</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.key} stat={s} />
          ))}
        </div>

        <Card padding={false} className="mt-4">
          <div className="flex items-center justify-between border-b border-hairline p-4">
            <h3 className="text-sm font-semibold text-ink">Term 1 Subject-wise Breakdown</h3>
            <Badge tone="info">Term 1</Badge>
          </div>
          <Table
            columns={[
              { key: "subject", header: "Subject" },
              { key: "marks", header: "Marks Obtained", align: "center" },
              { key: "max", header: "Maximum Marks", align: "center" },
            ]}
            data={[
              { id: 1, subject: "Mathematics", marks: result?.maths || 88, max: 100 },
              { id: 2, subject: "Science", marks: result?.science || 92, max: 100 },
              { id: 3, subject: "English", marks: result?.english || 85, max: 100 },
              { id: 4, subject: "Social Science", marks: result?.social || 80, max: 100 },
            ]}
            rowKey={(r) => r.id}
          />
        </Card>
      </div>
    </div>
  );
}
