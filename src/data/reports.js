/** Reports & Analytics dummy data. */
export const reports = {
  summary: [
    { key: 'enrollment', label: 'Total Enrollment', value: 1284, delta: 4.2, trend: 'up' },
    { key: 'passRate', label: 'Overall Pass Rate', value: 96.3, suffix: '%', delta: 1.1, trend: 'up' },
    { key: 'avgAttendance', label: 'Avg. Attendance', value: 90.2, suffix: '%', delta: 0.6, trend: 'up' },
    { key: 'dropout', label: 'Dropout Rate', value: 1.8, suffix: '%', delta: 0.3, trend: 'down' },
  ],
  // Subject-wise average marks (radar/bar)
  subjectPerformance: [
    { subject: 'Maths', score: 78 },
    { subject: 'Science', score: 81 },
    { subject: 'English', score: 84 },
    { subject: 'Social', score: 76 },
    { subject: 'Hindi', score: 82 },
    { subject: 'Comp. Sci', score: 88 },
  ],
  // Gender ratio
  genderSplit: [
    { name: 'Boys', value: 662, tone: '#2563EB' },
    { name: 'Girls', value: 622, tone: '#4F46E5' },
  ],
  // Yearly admissions
  admissionsTrend: [
    { year: '2021', admissions: 210 },
    { year: '2022', admissions: 244 },
    { year: '2023', admissions: 268 },
    { year: '2024', admissions: 289 },
    { year: '2025', admissions: 312 },
  ],
  // Fee collection status
  feeCollection: [
    { month: 'Apr', collected: 92, pending: 8 },
    { month: 'May', collected: 88, pending: 12 },
    { month: 'Jun', collected: 95, pending: 5 },
    { month: 'Jul', collected: 90, pending: 10 },
  ],
};
