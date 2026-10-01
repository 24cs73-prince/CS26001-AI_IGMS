/**
 * API Service Layer for AI-IGMS.
 * Seamlessly connects React frontend to Express + MongoDB backend,
 * with resilient local fallbacks for offline development.
 */
import {
  students as mockStudents,
  teachers as mockTeachers,
  attendanceRecords,
  attendanceSummary,
  exams as mockExams,
  results as mockResults,
  timetable as mockTimetable,
  notices as mockNotices,
  reports as mockReports,
  dashboardStats,
  recentActivities,
  systemStatus,
  performanceTrend,
  leaveApplications,
  leaveBalance,
} from '../data';

import { WEEKLY_MEAL_MENU_EN, WEEKLY_MEAL_MENU_GU, getTodaysMeal as getMockTodaysMeal } from '../data/midDayMealData';

const BASE_URL = "http://localhost:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("igms.token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchFromBackend(endpoint, fallback = null) {
  try {
    const headers = getAuthHeaders();
    let res = await fetch(endpoint, { headers }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(`${BASE_URL}${endpoint}`, { headers }).catch(() => null);
    }
    if (res && res.ok) {
      const data = await res.json();
      if (data !== undefined && data !== null) {
        if (Array.isArray(data) && data.length > 0) return data;
        if (typeof data === "object") return data;
      }
    }
  } catch (e) {
    console.warn(`[API] fetch failed for ${endpoint}, using fallback:`, e.message);
  }
  return fallback;
}

export const api = {
  // Students
  getStudents: async () => {
    const list = await fetchFromBackend("/api/students", mockStudents);
    if (!Array.isArray(list)) return mockStudents;
    return list.map((s) => ({
      id: s.studentId || s.id || `STU-${s.roll || 1001}`,
      name: s.name,
      roll: s.roll || s.rollNumber || 1,
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

  // Teachers
  getTeachers: async () => {
    const list = await fetchFromBackend("/api/teachers", mockTeachers);
    if (!Array.isArray(list)) return mockTeachers;
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

  // Parents & Linked Children
  getParents: async () => {
    return await fetchFromBackend("/api/parents", []);
  },
  getMyChildren: async () => {
    const res = await fetchFromBackend("/api/parents/my-children", { children: [] });
    return res.children || [];
  },

  // Classes & Subjects
  getClasses: async () => {
    return await fetchFromBackend("/api/classes", []);
  },
  getSubjects: async () => {
    return await fetchFromBackend("/api/subjects", []);
  },

  // Mid-Day Meal Menu (Bilingual from DB)
  getMeals: async (language = "gu") => {
    const dbMeals = await fetchFromBackend("/api/meals/weekly", null);
    if (Array.isArray(dbMeals) && dbMeals.length > 0) {
      return dbMeals.map((m) => ({
        dayIndex: m.dayOfWeek,
        day: m.dayName ? (m.dayName[language] || m.dayName.en) : (language === "gu" ? "સોમવાર" : "Monday"),
        snack: m.snack ? (m.snack[language] || m.snack.en) : "",
        meal: m.meal ? (m.meal[language] || m.meal.en) : "",
        time: m.time ? (m.time[language] || m.time.en) : (m.dayOfWeek === 6 ? "12:00 PM - 12:30 PM" : "1:30 PM - 2:00 PM"),
        tag: m.tag ? (m.tag[language] || m.tag.en) : (language === "gu" ? "પૌષ્ટિક આહાર" : "Nutritious Diet"),
      }));
    }
    return language === "gu" ? WEEKLY_MEAL_MENU_GU : WEEKLY_MEAL_MENU_EN;
  },

  getTodayMeal: async (language = "gu") => {
    const dbToday = await fetchFromBackend("/api/meals/today", null);
    if (dbToday) {
      if (dbToday.isSunday || dbToday.isHoliday) {
        return {
          isSunday: dbToday.isSunday,
          isHoliday: dbToday.isHoliday,
          holidayMessage: dbToday.holidayMessage ? (dbToday.holidayMessage[language] || dbToday.holidayMessage.en) : "",
          holidaySubMessage: dbToday.holidaySubMessage ? (dbToday.holidaySubMessage[language] || dbToday.holidaySubMessage.en) : "",
        };
      }
      return {
        isSunday: false,
        isHoliday: false,
        dayIndex: dbToday.dayOfWeek,
        day: dbToday.dayName ? (dbToday.dayName[language] || dbToday.dayName.en) : "",
        snack: dbToday.snack ? (dbToday.snack[language] || dbToday.snack.en) : "",
        meal: dbToday.meal ? (dbToday.meal[language] || dbToday.meal.en) : "",
        time: dbToday.time ? (dbToday.time[language] || dbToday.time.en) : "",
        tag: dbToday.tag ? (dbToday.tag[language] || dbToday.tag.en) : "",
      };
    }
    return getMockTodaysMeal(new Date(), language);
  },

  // Timetable
  getTimetable: async (query = {}) => {
    const dbTimetable = await fetchFromBackend("/api/timetable", null);
    if (Array.isArray(dbTimetable) && dbTimetable.length > 0) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const periods = ["08:00 - 08:45", "08:45 - 09:30", "09:45 - 10:30", "10:30 - 11:15", "11:45 - 12:30", "12:30 - 01:15", "01:15 - 02:00"];
      const tones = ["primary", "accent", "secondary", "warning", "info", "danger", "muted"];

      const grid = {};
      days.forEach((d) => {
        grid[d] = [];
      });

      days.forEach((dayName) => {
        for (let p = 1; p <= 7; p++) {
          const match = dbTimetable.find((t) => (t.dayName?.en === dayName || t.dayName === dayName) && t.period === p);
          if (match) {
            grid[dayName].push({
              subject: match.subjectName,
              teacher: match.teacherName,
              tone: tones[(p - 1) % tones.length],
            });
          } else {
            grid[dayName].push({
              subject: p === 4 ? "Recess Break" : (p === 7 ? "Sports / Library" : "General Studies"),
              teacher: "",
              tone: "muted",
            });
          }
        }
      });

      return { periods, days, grid };
    }
    return mockTimetable;
  },

  // Holidays
  getHolidays: async () => {
    return await fetchFromBackend("/api/holidays", []);
  },

  // Attendance, Marks, Exams, Notices, Leave
  getAttendance: async () => {
    const dbAttendance = await fetchFromBackend("/api/attendance", null);
    if (Array.isArray(dbAttendance) && dbAttendance.length > 0) {
      return { records: dbAttendance, summary: attendanceSummary };
    }
    return { records: attendanceRecords, summary: attendanceSummary };
  },

  getMarks: async () => {
    return await fetchFromBackend("/api/marks", mockResults);
  },

  getExams: async () => {
    const list = await fetchFromBackend("/api/exams", mockExams);
    return list;
  },

  getNotices: async () => {
    const list = await fetchFromBackend("/api/notices", mockNotices);
    return list;
  },

  getLeave: async () => {
    const dbLeaves = await fetchFromBackend("/api/leave", null);
    if (Array.isArray(dbLeaves) && dbLeaves.length > 0) {
      return { applications: dbLeaves, balance: leaveBalance };
    }
    return { applications: leaveApplications, balance: leaveBalance };
  },

  getDashboard: () => ({
    stats: dashboardStats,
    activities: recentActivities,
    system: systemStatus,
    trend: performanceTrend,
    notices: mockNotices,
    exams: mockExams,
  }),
};
