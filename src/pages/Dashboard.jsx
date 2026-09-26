import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCalendar,
  FiActivity,
  FiZap,
  FiShield,
  FiHome,
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiAward,
  FiLayers,
} from "react-icons/fi";

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
 * Government Portal Main Dashboard
 * Customized for Super Admin, Principal, Teacher, Student, Parent roles
 */
export default function Dashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.roleKey === "super_admin" || user?.roleKey === "admin";
  const { data, loading } = useFetch(() => api.getDashboard(), []);

  if (loading || !data) return <PageLoader label="Loading Government Portal Dashboard…" />;

  const { stats, activities, system, trend, notices, exams } = data;
  const upcomingExams = (exams || [])
    .filter((e) => ["Upcoming", "Scheduled"].includes(e.status))
    .slice(0, 4);
  const recentNotices = (notices || []).slice(0, 4);
  const trendData = (trend || []).map((t) => ({
    month: t.month,
    value: t.performance,
  }));
  const enrollmentData = enrollmentByClass.map((e) => ({
    className: e.className,
    value: e.students,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Super Admin / Directorate Banner */}
      {isSuperAdmin && (
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1b436f] to-blue-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
                <FiShield className="h-4 w-4 text-amber-400" />
                Directorate of School Education • State Control Center
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Super Admin State Command Center
              </h1>
              <p className="mt-1 text-xs text-blue-200 font-medium">
                રાજ્ય શિક્ષણાધિકારી વહીવટી અને શાળા નિયામક કચેરી ડેશબોર્ડ
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-xs border border-white/10 text-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-[#17395f] font-black">
                GUJ
              </div>
              <div>
                <p className="font-bold text-white">Academic Year 2025-26</p>
                <p className="text-[10px] text-blue-200">Integrated Portal Active</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4 text-xs">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">State Schools</p>
              <p className="text-lg font-extrabold text-white mt-0.5">12,450+</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Total Enrolled</p>
              <p className="text-lg font-extrabold text-emerald-300 mt-0.5">4.25 Million</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Active Faculty</p>
              <p className="text-lg font-extrabold text-amber-300 mt-0.5">185,200</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Avg Attendance</p>
              <p className="text-lg font-extrabold text-purple-300 mt-0.5">94.8%</p>
            </div>
          </div>
        </div>
      )}

      {/* Principal Institutional Administration Banner */}
      {user?.roleKey === "principal" && (
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#0f2b4d] via-[#163d6b] to-indigo-950 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs">
                <FiShield className="h-4 w-4 text-amber-400" />
                Office of the Principal • Institutional Administration Desk
              </div>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl text-white">
                {user?.schoolName || "Government Higher Secondary School"}
              </h1>
              <p className="mt-1 text-xs text-blue-200 font-medium">
                Principal: <span className="font-bold text-white">{user?.name || "Rohan Administrator"}</span> • UDISE Code: 24070100101 • Gandhinagar Division
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-xs border border-white/10 text-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-[#0f2b4d] font-black">
                SCH
              </div>
              <div>
                <p className="font-bold text-white">Academic Year 2025-26</p>
                <p className="text-[10px] text-emerald-300 font-bold">● Institutional Portal Active</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4 text-xs">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Enrolled Students</p>
              <p className="text-lg font-extrabold text-white mt-0.5">420 Students</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Teaching Faculty</p>
              <p className="text-lg font-extrabold text-emerald-300 mt-0.5">18 Active Teachers</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Today's Attendance</p>
              <p className="text-lg font-extrabold text-amber-300 mt-0.5">96.4% Present</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Leave Approvals</p>
              <p className="text-lg font-extrabold text-purple-300 mt-0.5">2 Pending</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header if regular staff/student */}
      {!isSuperAdmin && user?.roleKey !== "principal" && (
        <PageHeader
          title="School Dashboard"
          description="Welcome back — here's what's happening across your school today."
          breadcrumbs={[{ label: "Dashboard" }]}
        />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      {/* Principal Direct Administration Access Cards */}
      {user?.roleKey === "principal" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f2b4d]">
              Principal Administrative Operations
            </h2>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Management Tools
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Link
              to="/teachers"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-500 hover:bg-blue-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                <FiUserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2b4d]">Faculty Roster</p>
                <p className="text-[11px] text-slate-500">18 Teachers on duty</p>
              </div>
            </Link>

            <Link
              to="/students"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                <FiUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2b4d]">Student Enrollment</p>
                <p className="text-[11px] text-slate-500">Class 1 to 8 directory</p>
              </div>
            </Link>

            <Link
              to="/principal/leaves"
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/30 p-3 hover:border-amber-500 hover:bg-amber-50/70 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition">
                <FiCalendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2b4d]">Leave Approvals</p>
                <p className="text-[11px] text-amber-700 font-bold">2 Pending Review</p>
              </div>
            </Link>

            <Link
              to="/notices"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-purple-500 hover:bg-purple-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                <FiAward className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2b4d]">School Circulars</p>
                <p className="text-[11px] text-slate-500">Publish school notices</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions for Non-Super Admin / Non-Principal */}
      {!isSuperAdmin && user?.roleKey !== "principal" && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <FiZap className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-[#17395f]">Quick Actions</h2>
          </div>
          <QuickActions />
        </div>
      )}

      {/* Quick Admin Shortcut Links for Super Admin */}
      {isSuperAdmin && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#17395f] mb-3">
            Super Admin State Direct Access
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/schools"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-500 hover:bg-blue-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                <FiHome className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17395f]">School Directory</p>
                <p className="text-[11px] text-slate-500">Provision & assign schools</p>
              </div>
            </Link>

            <Link
              to="/principals"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                <FiUserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17395f]">Principals Roster</p>
                <p className="text-[11px] text-slate-500">Manage principal accounts</p>
              </div>
            </Link>

            <Link
              to="/students"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-purple-500 hover:bg-purple-50/50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                <FiUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17395f]">Students Master</p>
                <p className="text-[11px] text-slate-500">View enrolled students</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Performance Overview"
          subtitle="Average academic performance trend across state districts"
          className="lg:col-span-2"
        >
          <SimpleAreaChart data={trendData} height={200} />
        </ChartCard>

        <ChartCard
          title="Today's Attendance Split"
          subtitle="Real-time student attendance breakdown"
        >
          <div className="p-4">
            <DonutChart data={attendanceSplit} centerLabel="Students" />
          </div>
        </ChartCard>
      </div>

      {/* Enrollment + Recent Activities */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Class Enrollment Distribution"
          subtitle="Student count distribution across Std 1 to Std 8"
          className="lg:col-span-2"
        >
          <SimpleBarChart data={enrollmentData} height={200} color="#1769e8" />
        </ChartCard>

        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-[#17395f]">
                State Audit Logs & Activity
              </h3>
            </div>
          </div>
          <ActivityFeed activities={activities.slice(0, 5)} />
        </Card>
      </div>

      {/* Upcoming exams + notices + system status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Upcoming Exams */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-[#17395f]">Scheduled State Exams</h3>
            </div>
          </div>
          <ul className="space-y-3">
            {upcomingExams.map((e) => (
              <li key={e.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-100">
                  <span className="text-[10px] font-bold uppercase">
                    {formatDate(e.date, {
                      month: "short",
                      day: undefined,
                      year: undefined,
                    })}
                  </span>
                  <span className="text-sm font-extrabold leading-none">
                    {new Date(e.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {e.subject}
                  </p>
                  <p className="text-[11px] text-slate-500">
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
            <h3 className="text-xs font-bold text-[#17395f]">Official State Directives</h3>
            <Link
              to="/notices"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentNotices.map((n) => (
              <li key={n.id} className="group">
                <Link
                  to="/notices"
                  className="block rounded-lg p-2 -mx-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                      {n.title}
                    </p>
                    <FiArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
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
            <h3 className="text-xs font-bold text-[#17395f]">State Portal Health</h3>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />{" "}
              Operational
            </span>
          </div>
          <ul className="space-y-3 text-xs">
            {system.map((s) => (
              <li key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${s.tone === "success" ? "bg-emerald-500" : s.tone === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                  />
                  <span className="font-semibold text-slate-700">{s.label}</span>
                </div>
                <span className="font-mono font-medium text-slate-500">
                  {s.uptime}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </motion.div>
  );
}
