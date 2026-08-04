/** Dashboard dummy data: stat cards, activities, system status, charts. */
import {
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiTrendingUp,
} from 'react-icons/fi';

export const dashboardStats = [
  { key: 'students', label: 'Total Students', value: 1284, delta: 4.2, trend: 'up', icon: FiUsers, tone: 'primary', hint: 'vs last term' },
  { key: 'teachers', label: 'Total Teachers', value: 86, delta: 2.1, trend: 'up', icon: FiUserCheck, tone: 'secondary', hint: 'vs last term' },
  { key: 'attendance', label: 'Attendance Today', value: 90.0, suffix: '%', delta: 1.4, trend: 'up', icon: FiCheckCircle, tone: 'accent', hint: '1,156 present' },
  { key: 'performance', label: 'Avg. Performance', value: 79.6, suffix: '%', delta: 0.8, trend: 'down', icon: FiTrendingUp, tone: 'warning', hint: 'across all classes' },
];

// Monthly performance + attendance trend for the area chart
export const performanceTrend = [
  { month: 'Feb', attendance: 88, performance: 74 },
  { month: 'Mar', attendance: 90, performance: 76 },
  { month: 'Apr', attendance: 87, performance: 75 },
  { month: 'May', attendance: 92, performance: 78 },
  { month: 'Jun', attendance: 91, performance: 80 },
  { month: 'Jul', attendance: 93, performance: 82 },
  { month: 'Aug', attendance: 90, performance: 80 },
];

// Enrollment split by class for the bar chart
export const enrollmentByClass = [
  { className: 'VI', students: 168 },
  { className: 'VII', students: 175 },
  { className: 'VIII', students: 182 },
  { className: 'IX', students: 196 },
  { className: 'X', students: 204 },
  { className: 'XI', students: 178 },
  { className: 'XII', students: 181 },
];

// Attendance status split for the donut chart
export const attendanceSplit = [
  { name: 'Present', value: 1156, tone: '#10B981' },
  { name: 'Absent', value: 84, tone: '#EF4444' },
  { name: 'Late', value: 44, tone: '#F59E0B' },
];

export const recentActivities = [
  { id: 1, actor: 'Dr. Meenakshi Iyer', action: 'marked attendance for', target: 'Class 10-A', time: '2026-08-01T08:05:00', tone: 'accent' },
  { id: 2, actor: 'Examination Cell', action: 'published', target: 'Mid-Term Datesheet', time: '2026-08-01T07:40:00', tone: 'primary' },
  { id: 3, actor: 'Sushmita Roy', action: 'uploaded results for', target: 'Class 9 English', time: '2026-07-31T16:22:00', tone: 'secondary' },
  { id: 4, actor: 'Admin', action: 'added new student', target: 'Anika Bose (Class 6-B)', time: '2026-07-31T11:10:00', tone: 'primary' },
  { id: 5, actor: 'Transport Office', action: 'updated', target: 'Bus Route 4 timings', time: '2026-07-30T14:48:00', tone: 'warning' },
  { id: 6, actor: 'Suresh Pillai', action: 'scheduled', target: 'CS Practical (Class 12)', time: '2026-07-30T09:15:00', tone: 'info' },
];

export const systemStatus = [
  { label: 'Student Portal', status: 'Operational', tone: 'success', uptime: '99.98%' },
  { label: 'Attendance Sync', status: 'Operational', tone: 'success', uptime: '99.92%' },
  { label: 'AI Services', status: 'Degraded', tone: 'warning', uptime: '97.40%' },
  { label: 'SMS Gateway', status: 'Operational', tone: 'success', uptime: '99.80%' },
];

export const latestUpdates = [
  { id: 1, tag: 'Release', title: 'AI Question Paper Generator (Beta)', date: '2026-07-29' },
  { id: 2, tag: 'Improvement', title: 'Faster results upload for large classes', date: '2026-07-24' },
  { id: 3, tag: 'Fix', title: 'Corrected attendance percentage rounding', date: '2026-07-19' },
];
