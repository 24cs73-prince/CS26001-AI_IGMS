/** Results dummy data + per-class statistics. */
export const results = [
  { id: 'STU-1001', name: 'Aarav Sharma', className: 'Class 10', section: 'A', maths: 92, science: 88, english: 85, social: 90, total: 355, percentage: 88.75, grade: 'A', rank: 2, status: 'Pass' },
  { id: 'STU-1002', name: 'Diya Patel', className: 'Class 10', section: 'A', maths: 95, science: 90, english: 92, social: 87, total: 364, percentage: 91.0, grade: 'A+', rank: 1, status: 'Pass' },
  { id: 'STU-1003', name: 'Vivaan Gupta', className: 'Class 10', section: 'A', maths: 61, science: 66, english: 70, social: 59, total: 256, percentage: 64.0, grade: 'B', rank: 8, status: 'Pass' },
  { id: 'STU-1016', name: 'Aadhya Menon', className: 'Class 10', section: 'B', maths: 84, science: 82, english: 88, social: 82, total: 336, percentage: 84.0, grade: 'A', rank: 3, status: 'Pass' },
  { id: 'STU-1017', name: 'Krishna Pillai', className: 'Class 10', section: 'B', maths: 52, science: 55, english: 58, social: 51, total: 216, percentage: 54.0, grade: 'C', rank: 12, status: 'Pass' },
  { id: 'STU-1006', name: 'Ishita Reddy', className: 'Class 12', section: 'A', maths: 96, science: 94, english: 90, social: 93, total: 373, percentage: 93.25, grade: 'A+', rank: 1, status: 'Pass' },
  { id: 'STU-1007', name: 'Kabir Mehta', className: 'Class 12', section: 'A', maths: 70, science: 74, english: 76, social: 68, total: 288, percentage: 72.0, grade: 'B+', rank: 6, status: 'Pass' },
  { id: 'STU-1010', name: 'Myra Joshi', className: 'Class 11', section: 'A', maths: 97, science: 95, english: 94, social: 94, total: 380, percentage: 95.0, grade: 'A+', rank: 1, status: 'Pass' },
  { id: 'STU-1011', name: 'Aditya Rao', className: 'Class 11', section: 'A', maths: 68, science: 70, english: 66, social: 68, total: 272, percentage: 68.0, grade: 'B', rank: 7, status: 'Pass' },
  { id: 'STU-1004', name: 'Ananya Singh', className: 'Class 9', section: 'B', maths: 79, science: 81, english: 78, social: 78, total: 316, percentage: 79.0, grade: 'A', rank: 4, status: 'Pass' },
  { id: 'STU-1005', name: 'Reyansh Kumar', className: 'Class 9', section: 'B', maths: 55, science: 58, english: 60, social: 59, total: 232, percentage: 58.0, grade: 'C', rank: 11, status: 'Pass' },
  { id: 'STU-1009', name: 'Arjun Verma', className: 'Class 8', section: 'C', maths: 41, science: 48, english: 52, social: 55, total: 196, percentage: 49.0, grade: 'D', rank: 18, status: 'Fail' },
];

export const classStatistics = [
  { className: 'Class 10', avg: 78.4, pass: 96, top: 'Diya Patel', appeared: 68 },
  { className: 'Class 11', avg: 81.2, pass: 98, top: 'Myra Joshi', appeared: 54 },
  { className: 'Class 12', avg: 83.6, pass: 99, top: 'Ishita Reddy', appeared: 61 },
  { className: 'Class 9', avg: 72.9, pass: 92, top: 'Navya Chauhan', appeared: 74 },
];

// Grade distribution for the results chart
export const gradeDistribution = [
  { grade: 'A+', count: 118 },
  { grade: 'A', count: 264 },
  { grade: 'B+', count: 212 },
  { grade: 'B', count: 176 },
  { grade: 'C', count: 98 },
  { grade: 'D', count: 34 },
];
