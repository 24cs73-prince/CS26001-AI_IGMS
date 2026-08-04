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
} from '../data';

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

async function resolve(payload, ms) {
  await delay(ms);
  // Return a shallow clone to mimic a network boundary
  return JSON.parse(JSON.stringify(payload));
}

export const api = {
  getStudents: () => resolve(students),
  getTeachers: () => resolve(teachers),
  getAttendance: () => resolve({ records: attendanceRecords, summary: attendanceSummary }),
  getExams: () => resolve(exams),
  getResults: () => resolve(results),
  getTimetable: () => resolve(timetable),
  getNotices: () => resolve(notices),
  getReports: () => resolve(reports),
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
