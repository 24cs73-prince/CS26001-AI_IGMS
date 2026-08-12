import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCalendar, FiActivity, FiZap } from "react-icons/fi";

import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import { enrollmentByClass, attendanceSplit } from "../data/dashboard";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import ChartCard from "../components/common/ChartCard";
import { PageLoader } from "../components/ui/Loader";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { STATUS_TONE } from "../constants/theme";
import { formatDate } from "../utils/format";

import {
  SimpleAreaChart,
  SimpleBarChart,
  DonutChart,
} from "../components/charts";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { useAuth } from "../context/AuthContext";

/**
 * Main dashboard — stat cards, charts, activities, notices, system status.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.roleKey === "super_admin";
  const { data, loading } = useFetch(() => api.getDashboard(), []);

  if (loading || !data) return <PageLoader label="Loading dashboard…" />;

  const { stats, activities, system, trend, notices, exams } = data;
  const upcomingExams = exams
    .filter((e) => ["Upcoming", "Scheduled"].includes(e.status))
    .slice(0, 4);
  const recentNotices = notices.slice(0, 4);
  const trendData = trend.map((t) => ({
    month: t.month,
    value: t.performance,
  }));
  const enrollmentData = enrollmentByClass.map((e) => ({
    className: e.className,
    value: e.students,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={
          isSuperAdmin
            ? "Welcome back — Super Admin control panel."
            : "Welcome back — here's what's happening across your institution today."
        }
        breadcrumbs={
          isSuperAdmin
            ? [{ label: "Super Admin" }, { label: "Dashboard" }]
            : [{ label: "Dashboard" }]
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      {/* Quick actions */}
      {!isSuperAdmin && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <FiZap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-ink">Quick Actions</h2>
          </div>
          <QuickActions />
        </div>
      )}

      {/* Charts row */}
      {isSuperAdmin ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Today's Attendance"
            subtitle="Live breakdown by status"
            className="lg:col-span-1"
          >
            <div className="p-4">
              <DonutChart data={attendanceSplit} centerLabel="Students" />
            </div>
          </ChartCard>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Performance Overview"
            subtitle="Average performance trend across the year"
            className="lg:col-span-2"
          >
            <SimpleAreaChart data={trendData} height={200} />
          </ChartCard>
          <ChartCard
            title="Today's Attendance"
            subtitle="Live breakdown by status"
          >
            <div className="p-4">
              <DonutChart data={attendanceSplit} centerLabel="Students" />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Enrollment + attendance + activities */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Enrollment by Class"
          subtitle="Distribution of students across grades"
          className="lg:col-span-2"
        >
          <SimpleBarChart data={enrollmentData} height={200} color="#4F46E5" />
        </ChartCard>

        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">
                Recent Activities
              </h3>
            </div>
          </div>
          <ActivityFeed activities={activities.slice(0, 5)} />
        </Card>
      </div>

      {/* Upcoming exams + notices + system status */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Upcoming Exams */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-ink">Upcoming Exams</h3>
            </div>
            <Link
              to="/examination"
              className="text-xs font-medium text-primary hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {upcomingExams.map((e) => (
              <li key={e.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[10px] font-medium uppercase">
                    {formatDate(e.date, {
                      month: "short",
                      day: undefined,
                      year: undefined,
                    })}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {new Date(e.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {e.subject}
                  </p>
                  <p className="text-xs text-slate-400">
                    {e.className} · {e.time}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recent Notices */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Recent Notices</h3>
            <Link
              to="/notices"
              className="text-xs font-medium text-primary hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentNotices.map((n) => (
              <li key={n.id} className="group">
                <Link
                  to="/notices"
                  className="block rounded-lg p-2 -mx-2 hover:bg-canvas transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink line-clamp-1 group-hover:text-primary">
                      {n.title}
                    </p>
                    <FiArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-primary" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {n.author} · {formatDate(n.date)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* System Status */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">System Status</h3>
            <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />{" "}
              Operational
            </span>
          </div>
          <ul className="space-y-3">
            {system.map((s) => (
              <li key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${s.tone === "success" ? "bg-accent" : s.tone === "warning" ? "bg-warning" : "bg-danger"}`}
                  />
                  <span className="text-sm text-slate-600">{s.label}</span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {s.uptime}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
