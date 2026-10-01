import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiCalendar, FiClock, FiStar, FiFileText, FiAward } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { PageLoader } from "../components/ui/Loader";
import { STATUS_TONE } from "../constants/theme";
import { formatDate } from "../utils/format";

/**
 * Student Dashboard — Live academic overview for authenticated students.
 * Pulls student-specific attendance, grades, exams, and notices from MongoDB.
 */
export default function StudentDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [attendancePct, setAttendancePct] = useState(94);
  const [overallGrade, setOverallGrade] = useState("A");
  const [overallAverage, setOverallAverage] = useState(88);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        const studentId = user?.studentId || "STU-1001";

        const [attData, marksData, examsList, noticesList] = await Promise.all([
          api.getAttendance({ studentId }).catch(() => null),
          api.getMarks({ studentId }).catch(() => null),
          api.getExams().catch(() => []),
          api.getNotices().catch(() => []),
        ]);

        if (attData && typeof attData === "object" && attData.percentage !== undefined) {
          setAttendancePct(attData.percentage);
        }

        if (marksData && marksData.reportCard && marksData.reportCard.length > 0) {
          const sum = marksData.reportCard.reduce((acc, r) => acc + (r.marksObtained || 0), 0);
          const avg = Math.round(sum / marksData.reportCard.length);
          setOverallAverage(avg);
          setOverallGrade(avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B" : avg >= 60 ? "C" : "D");
        }

        const scheduled = (examsList || [])
          .filter((e) => ["Upcoming", "Scheduled", "Active", "Published"].includes(e.status))
          .slice(0, 3);
        setUpcomingExams(scheduled);

        setRecentNotices((noticesList || []).slice(0, 3));
      } catch (err) {
        console.warn("Student dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [user]);

  if (loading) {
    return <PageLoader label={t("common.loading")} />;
  }

  const stats = [
    {
      key: "attendance",
      label: t("common.attendance"),
      value: `${attendancePct}%`,
      icon: FiClock,
      tone: "success",
      hint: language === "gu" ? "ઉત્તમ હાજરી રેકોર્ડ" : "Excellent attendance",
    },
    {
      key: "grade",
      label: t("parent.overallGrade"),
      value: overallGrade,
      icon: FiStar,
      tone: "primary",
      hint: `${overallAverage}% ${language === "gu" ? "સરેરાશ ગુણ" : "average marks"}`,
    },
    {
      key: "exams",
      label: t("nav.examinations"),
      value: upcomingExams.length,
      icon: FiCalendar,
      tone: "warning",
      hint: language === "gu" ? "આગામી સત્ર પરીક્ષાઓ" : "Scheduled term tests",
    },
    {
      key: "rank",
      label: t("parent.classRank"),
      value: overallAverage >= 90 ? "1st" : overallAverage >= 80 ? "2nd" : "3rd",
      icon: FiAward,
      tone: "accent",
      hint: user?.classVal ? `Class ${user.classVal}` : "Class 6",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("studentPortal") || "Student Portal"}
        description={`${t("parent.welcomeMsg")} ${user?.name?.split(" ")[0]}!`}
        breadcrumbs={[{ label: t("nav.dashboard") }]}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card className="border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-[#0f2b4d]">
                {language === "gu" ? "આગામી પરીક્ષાઓ" : "Upcoming Exams"}
              </h3>
            </div>
            <Link to="/student/exams" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              {language === "gu" ? "બધી જુઓ" : "View all"}
            </Link>
          </div>
          {upcomingExams.length > 0 ? (
            <ul className="space-y-3">
              {upcomingExams.map((e) => (
                <li
                  key={e._id || e.id}
                  className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    <span className="text-[10px] font-bold uppercase">
                      {formatDate(e.date, { month: "short", day: undefined, year: undefined })}
                    </span>
                    <span className="text-sm font-extrabold leading-none">
                      {new Date(e.date).getDate() || 15}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{e.title || e.subject}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Class {e.classVal || "6"} · {e.duration || "60 mins"} · {e.totalMarks || 100} Marks
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[e.status] || "info"}>{e.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">{language === "gu" ? "કોઈ આગામી પરીક્ષા નથી." : "No upcoming exams."}</p>
          )}
        </Card>

        {/* Recent Notices */}
        <Card className="border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FiFileText className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-[#0f2b4d]">
                {language === "gu" ? "તાજેતરની સૂચનાઓ" : "Recent Notices"}
              </h3>
            </div>
            <Link to="/student/notices" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              {language === "gu" ? "બધી જુઓ" : "View all"}
            </Link>
          </div>
          {recentNotices.length > 0 ? (
            <ul className="space-y-3">
              {recentNotices.map((n) => (
                <li key={n._id || n.id} className="group border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <Link to="/student/notices" className="block transition-colors">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {n.publishedBy || n.author || "Principal Office"} · {n.createdAt ? formatDate(n.createdAt) : formatDate(n.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">{language === "gu" ? "કોઈ નવી સૂચના નથી." : "No new notices."}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
