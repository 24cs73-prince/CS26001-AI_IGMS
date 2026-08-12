import { Link } from "react-router-dom";
import { FiBookOpen, FiCalendar, FiClock, FiStar, FiFileText } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { STATUS_TONE } from "../constants/theme";
import { formatDate } from "../utils/format";

/**
 * Student Dashboard — tailored view for students.
 */
export default function StudentDashboard() {
  const { user } = useAuth();

  // Mock student data
  const stats = [
    { key: "attendance", label: "Attendance", value: "92%", icon: FiClock, tone: "success", hint: "Great job!" },
    { key: "grade", label: "Overall Grade", value: "A", icon: FiStar, tone: "primary", hint: "Current term" },
    { key: "assignments", label: "Pending Assignments", value: 3, icon: FiFileText, tone: "warning", hint: "Due this week" },
    { key: "rank", label: "Class Rank", value: "5th", icon: FiBookOpen, tone: "accent", hint: "Out of 45 students" },
  ];

  const upcomingExams = [
    { id: 1, subject: "Mathematics", date: "2025-10-15T09:00:00Z", time: "09:00 AM", status: "Upcoming", className: user?.org || "Class 6" },
    { id: 2, subject: "Science", date: "2025-10-18T10:00:00Z", time: "10:00 AM", status: "Scheduled", className: user?.org || "Class 6" },
  ];

  const recentNotices = [
    { id: 1, title: "Annual Sports Meet Registration", date: "2025-10-01T08:00:00Z", author: "Sports Dept." },
    { id: 2, title: "Diwali Holidays Announcement", date: "2025-09-28T08:00:00Z", author: "Principal Office" },
  ];

  return (
    <div>
      <PageHeader
        title="Student Portal"
        description={`Welcome back, ${user?.name?.split(" ")[0]}! Here's your academic overview.`}
        breadcrumbs={[{ label: "Student Dashboard" }]}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-ink">Upcoming Exams</h3>
            </div>
          </div>
          {upcomingExams.length > 0 ? (
            <ul className="space-y-3">
              {upcomingExams.map((e) => (
                <li key={e.id} className="flex items-center gap-3 border-b border-hairline pb-3 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-[10px] font-medium uppercase">
                      {formatDate(e.date, { month: "short", day: undefined, year: undefined })}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {new Date(e.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{e.subject}</p>
                    <p className="text-xs text-slate-400">{e.time}</p>
                  </div>
                  <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No upcoming exams.</p>
          )}
        </Card>

        {/* Recent Notices */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFileText className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Recent Notices</h3>
            </div>
            <Link to="/student/notices" className="text-xs font-medium text-primary hover:text-primary-700">
              View all
            </Link>
          </div>
          {recentNotices.length > 0 ? (
            <ul className="space-y-3">
              {recentNotices.map((n) => (
                <li key={n.id} className="group border-b border-hairline pb-3 last:border-0 last:pb-0">
                  <Link to="/student/notices" className="block transition-colors">
                    <p className="text-sm font-medium text-ink line-clamp-1 group-hover:text-primary">
                      {n.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {n.author} · {formatDate(n.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No new notices.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
