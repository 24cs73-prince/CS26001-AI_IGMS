/**
 * Mock API service layer.
 * Today this simply resolves the local dummy data with a small artificial
 * delay so the UI can show loaders. When a real backend exists, swap the
 * bodies of these functions for `fetch`/axios calls — component code won't
 * need to change.
 */
import {
  students,
  teachers,
  attendanceRecords,
  attendanceSummary,
  exams,
  results,
  timetable,
  notices,
  reports,
  dashboardStats,
  recentActivities,
  systemStatus,
  performanceTrend,
  leaveApplications,
  leaveBalance,
} from '../data';

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

async function resolve(payload, ms) {
  await delay(ms);
  // Return a shallow clone to mimic a network boundary
  return JSON.parse(JSON.stringify(payload));
}

async function fetchFromBackend(endpoint, fallback) {
  try {
    let res = await fetch(endpoint).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(`http://localhost:5000${endpoint}`).catch(() => null);
    }
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      if (data.value && Array.isArray(data.value) && data.value.length > 0) return data.value;
    }
  } catch (e) {}
  return fallback;
}

export const api = {
  getStudents: async () => {
    const list = await fetchFromBackend("/api/students", students);
    return list.map((s) => ({
      id: s.studentId || s.id || `STU-${s.roll || 1001}`,
      name: s.name,
      roll: s.roll || 1,
      className: s.className || "Class 5",
      section: s.section || "A",
      gender: s.gender || "Male",
      guardian: s.guardian || "Parent",
      phone: s.phone || "+91 98000 00000",
      email: s.email || `${s.name?.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      attendance: s.attendance || 90,
      average: s.average || 80,
      status: s.status || "Active",
      admissionDate: s.admissionDate || "2022-04-10",
    }));
  },
  getTeachers: async () => {
    const list = await fetchFromBackend("/api/teachers", teachers);
    return list.map((t) => ({
      id: t.teacherId || t.id || "TCH-201",
      name: t.name,
      department: t.department || "General",
      subject: t.subject || "General",
      experience: t.experience || 5,
      email: t.email || `${t.name?.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      phone: t.phone || "+91 98000 00000",
      classes: t.classes || ["Class 5"],
      status: t.status || "Active",
      rating: t.rating || 4.5,
    }));
  },
  getAttendance: () => resolve({ records: attendanceRecords, summary: attendanceSummary }),
  getExams: async () => {
    const list = await fetchFromBackend("/api/exams", exams);
    return list;
  },
  getResults: () => resolve(results),
  getTimetable: () => resolve(timetable),
  getNotices: async () => {
    const list = await fetchFromBackend("/api/notices", notices);
    return list;
  },
  getReports: () => resolve(reports),
  getLeave: () => resolve({ applications: leaveApplications, balance: leaveBalance }),
  getDashboard: () =>
    resolve({
      stats: dashboardStats,
      activities: recentActivities,
      system: systemStatus,
      trend: performanceTrend,
      notices,
      exams,
    }),
};
