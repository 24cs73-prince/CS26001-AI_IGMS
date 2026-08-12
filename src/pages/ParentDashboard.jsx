import { Link } from "react-router-dom";
import { FiUser, FiBookOpen, FiClock, FiStar, FiFileText, FiBell } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";

/**
 * Parent Dashboard — simple, clean view of child's academic snapshot.
 * Parents see attendance, grades, and recent notices at a glance.
 */
export default function ParentDashboard() {
  const { user } = useAuth();

  // Mock child data (would come from API in production)
  const child = {
    name: "Aarav Sharma",
    className: "Class 6",
    section: "A",
    rollNo: 12,
    attendance: "92%",
    grade: "A",
    rank: "5th",
  };

  const recentNotices = [
    { id: 1, title: "Annual Sports Meet Registration Open", date: "Oct 1, 2025" },
    { id: 2, title: "Diwali Holidays – School Closed Oct 20–25", date: "Sep 28, 2025" },
    { id: 3, title: "Parent-Teacher Meeting on Nov 5", date: "Sep 25, 2025" },
  ];

  return (
    <div>
      <PageHeader
        title="Parent Portal"
        description={`Welcome, ${user?.name?.split(" ")[0] || "Parent"}! Here's your child's overview.`}
        breadcrumbs={[{ label: "Parent Dashboard" }]}
      />

      {/* Child Info Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiUser className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">{child.name}</h2>
            <p className="text-sm text-slate-500">
              {child.className} · Section {child.section} · Roll No. {child.rollNo}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FiClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Attendance</p>
              <p className="text-xl font-bold text-ink">{child.attendance}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiStar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Overall Grade</p>
              <p className="text-xl font-bold text-ink">{child.grade}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiBookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Class Rank</p>
              <p className="text-xl font-bold text-ink">{child.rank}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Notices */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiBell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-ink">Recent Notices</h3>
          </div>
          <Link
            to="/parent/notices"
            className="text-xs font-medium text-primary hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        <ul className="space-y-3">
          {recentNotices.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between border-b border-hairline pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-2.5">
                <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-sm text-ink">{n.title}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{n.date}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
