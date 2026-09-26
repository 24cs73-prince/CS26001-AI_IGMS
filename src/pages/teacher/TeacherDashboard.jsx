import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiFileText,
  FiCpu,
  FiEdit3,
  FiBookOpen,
  FiAward,
  FiShield,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/ui/Card";
import { Badge } from "../../components/ui";

/**
 * Teacher Portal Dashboard - Government School Faculty Desk
 */
export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 45,
    attendanceMarked: true,
    pendingLeaves: 1,
    examsCreated: 6,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const students = await api.getStudents();
        const myStudents = students.filter(
          (s) => s.className === "Class 6" && s.section === "A"
        );
        if (myStudents.length > 0) {
          setStats((prev) => ({
            ...prev,
            totalStudents: myStudents.length,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch teacher dashboard data", error);
      }
    }
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      key: "students",
      label: "My Class Students",
      value: stats.totalStudents || "45",
      icon: FiUsers,
      tone: "primary",
      hint: "Class 6 · Division A",
    },
    {
      key: "attendance",
      label: "Today's Attendance",
      value: stats.attendanceMarked ? "Marked" : "Pending",
      icon: FiCheckSquare,
      tone: stats.attendanceMarked ? "success" : "warning",
      hint: "Morning Session · 95.5%",
    },
    {
      key: "exams",
      label: "AI Exams Published",
      value: stats.examsCreated || "6",
      icon: FiCpu,
      tone: "accent",
      hint: "Online & Board Aligned",
    },
    {
      key: "leave",
      label: "Leave Status",
      value: `${stats.pendingLeaves} Pending`,
      icon: FiCalendar,
      tone: "warning",
      hint: "Casual Leave · Balance: 8",
    },
  ];

  const quickLinks = [
    {
      label: "✨ AI Paper Generator",
      desc: "Synthesize MCQ papers for Std 1–8",
      to: "/teacher/ai-generator",
      icon: FiCpu,
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "📝 Online Exams Desk",
      desc: "Publish & monitor student exams",
      to: "/teacher/exams",
      icon: FiEdit3,
      color: "text-purple-700",
      bg: "bg-purple-50 border-purple-200",
    },
    {
      label: "Mark Daily Attendance",
      desc: "Record morning student attendance",
      to: "/teacher/attendance",
      icon: FiCheckSquare,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      label: "Upload Term Marks",
      desc: "Submit examination scores",
      to: "/teacher/marks",
      icon: FiFileText,
      color: "text-orange-700",
      bg: "bg-orange-50 border-orange-200",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Government Teacher Faculty Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1b436f] to-blue-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
              <FiShield className="h-4 w-4 text-emerald-400" />
              Government Faculty Portal • Academic Year 2025-26
            </div>
            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Welcome, {user?.name || "Teacher"}
            </h1>
            <p className="mt-1 text-xs text-blue-200 font-medium">
              શિક્ષક પોર્ટલ - દૈનિક હાજરી, પરીક્ષા આયોજન અને વિદ્યાર્થી પરિણામ વ્યવસ્થાપન
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10 text-xs">
            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
              Assigned Class
            </p>
            <p className="text-sm font-extrabold text-white mt-0.5">
              Class 6 • Division A
            </p>
            <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
              Subject: Mathematics & Science
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      {/* Main Grid: Quick Actions & Timetable */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FiBookOpen className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#17395f]">
                Faculty Operations & Assessment Tools
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-start gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${link.bg}`}
                >
                  <div className="mt-0.5 rounded-lg bg-white p-2 shadow-xs">
                    <Icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#17395f]">
                      {link.label}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Today's Timetable */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#17395f]">
                Today's Class Schedule
              </h3>
            </div>
            <Link
              to="/teacher/timetable"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Full Week
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                time: "08:30 AM - 09:15 AM",
                subject: "Mathematics",
                class: "Class 6 · Div A",
                room: "Room 102",
                type: "Regular",
              },
              {
                time: "09:15 AM - 10:00 AM",
                subject: "Mathematics",
                class: "Class 7 · Div B",
                room: "Room 105",
                type: "Regular",
              },
              {
                time: "10:15 AM - 11:00 AM",
                subject: "AI Assessment Review",
                class: "Staff Room",
                room: "Lab 2",
                type: "Special",
              },
              {
                time: "11:00 AM - 11:45 AM",
                subject: "General Science",
                class: "Class 6 · Div A",
                room: "Science Lab",
                type: "Lab Work",
              },
            ].map((period, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">
                    P{i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17395f]">
                      {period.subject}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {period.class} • {period.room} • {period.time}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-100/70 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                  {period.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
