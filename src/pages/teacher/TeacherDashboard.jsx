import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiCheckSquare, FiCalendar, FiClock, FiFileText } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/ui/Card";
import { Badge } from "../../components/ui";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceMarked: false,
    pendingLeaves: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const students = await api.getStudents();
        const myStudents = students.filter(s => s.className === "Class 6" && s.section === "A");
        
        setStats({
          totalStudents: myStudents.length,
          attendanceMarked: true, // Mock value
          pendingLeaves: 1, // Mock value
        });
      } catch (error) {
        console.error("Failed to fetch teacher dashboard data", error);
      }
    }
    fetchDashboardData();
  }, []);

  const statCards = [
    { key: "students", label: "My Class Students", value: stats.totalStudents || "45", icon: FiUsers, tone: "primary", hint: "Class 6 · A" },
    { key: "attendance", label: "Today's Attendance", value: stats.attendanceMarked ? "Marked" : "Pending", icon: FiCheckSquare, tone: stats.attendanceMarked ? "success" : "warning", hint: "Updated 8:00 AM" },
    { key: "leave", label: "Pending Leaves", value: stats.pendingLeaves, icon: FiCalendar, tone: "accent", hint: "Awaiting approval" },
  ];

  const quickLinks = [
    { label: "Mark Attendance", to: "/teacher/attendance", icon: FiCheckSquare, color: "text-green-600", bg: "bg-green-50" },
    { label: "Upload Marks", to: "/teacher/marks", icon: FiFileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "My Class Roster", to: "/teacher/my-class", icon: FiUsers, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Apply Leave", to: "/teacher/leave", icon: FiCalendar, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div>
      <PageHeader
        title="Teacher Portal"
        description={`Welcome back, ${user?.name || "Teacher"}! Here is your daily summary.`}
        breadcrumbs={[{ label: "Teacher Dashboard" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-ink">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline p-4 transition-colors hover:bg-slate-50 hover:border-primary/30"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${link.bg} ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-ink text-center">{link.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Today's Timetable</h3>
            <Link to="/teacher/timetable" className="text-xs font-medium text-primary hover:underline">View Full</Link>
          </div>
          <div className="space-y-3">
            {[
              { time: "08:30 AM - 09:15 AM", subject: "Mathematics", class: "Class 6 · A", type: "Regular" },
              { time: "09:15 AM - 10:00 AM", subject: "Mathematics", class: "Class 7 · B", type: "Regular" },
              { time: "10:15 AM - 11:00 AM", subject: "Free Period", class: "—", type: "Break" },
              { time: "11:00 AM - 11:45 AM", subject: "Science", class: "Class 6 · A", type: "Substitution" },
            ].map((period, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-hairline pb-3 last:border-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <FiClock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{period.subject}</p>
                  <p className="text-xs text-slate-400">{period.class} · {period.time}</p>
                </div>
                <Badge tone={period.type === "Break" ? "info" : period.type === "Substitution" ? "warning" : "primary"}>
                  {period.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
