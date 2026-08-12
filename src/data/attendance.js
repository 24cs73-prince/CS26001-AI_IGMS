/** Attendance dummy data: today's per-student marks + monthly summary. */
export const attendanceRecords = [
  { id: 'STU-1001', name: 'Aarav Sharma', className: 'Class 6', section: 'A', status: 'Present', inTime: '08:02', markedBy: 'Dr. Meenakshi Iyer' },
  { id: 'STU-1002', name: 'Diya Patel', className: 'Class 6', section: 'A', status: 'Present', inTime: '07:58', markedBy: 'Dr. Meenakshi Iyer' },
  { id: 'STU-1003', name: 'Vivaan Gupta', className: 'Class 6', section: 'A', status: 'Late', inTime: '08:41', markedBy: 'Dr. Meenakshi Iyer' },
  { id: 'STU-1004', name: 'Ananya Singh', className: 'Class 5', section: 'B', status: 'Present', inTime: '08:05', markedBy: 'Sushmita Roy' },
  { id: 'STU-1005', name: 'Reyansh Kumar', className: 'Class 5', section: 'B', status: 'Absent', inTime: '—', markedBy: 'Sushmita Roy' },
  { id: 'STU-1006', name: 'Ishita Reddy', className: 'Class 8', section: 'A', status: 'Present', inTime: '07:55', markedBy: 'Rakesh Menon' },
  { id: 'STU-1007', name: 'Kabir Mehta', className: 'Class 8', section: 'A', status: 'Present', inTime: '08:10', markedBy: 'Rakesh Menon' },
  { id: 'STU-1008', name: 'Saanvi Nair', className: 'Class 8', section: 'C', status: 'Present', inTime: '08:00', markedBy: 'Kavita Bhargava' },
  { id: 'STU-1009', name: 'Arjun Verma', className: 'Class 8', section: 'C', status: 'Absent', inTime: '—', markedBy: 'Kavita Bhargava' },
  { id: 'STU-1010', name: 'Myra Joshi', className: 'Class 7', section: 'A', status: 'Present', inTime: '07:50', markedBy: 'Pooja Deshmukh' },
  { id: 'STU-1011', name: 'Aditya Rao', className: 'Class 7', section: 'A', status: 'Late', inTime: '08:35', markedBy: 'Pooja Deshmukh' },
  { id: 'STU-1016', name: 'Aadhya Menon', className: 'Class 6', section: 'B', status: 'Present', inTime: '08:04', markedBy: 'Sandeep Yadav' },
  { id: 'STU-1017', name: 'Krishna Pillai', className: 'Class 6', section: 'B', status: 'Absent', inTime: '—', markedBy: 'Sandeep Yadav' },
  { id: 'STU-1018', name: 'Navya Chauhan', className: 'Class 5', section: 'A', status: 'Present', inTime: '07:59', markedBy: 'Neha Kulkarni' },
];

// Aggregate cards for the top of the Attendance page
export const attendanceSummary = {
  totalStudents: 1284,
  present: 1156,
  absent: 84,
  late: 44,
  percentage: 90.0,
};

// Calendar heat-style data — attendance % per day for the current month
export const attendanceCalendar = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  // weekends lower / holidays null to look realistic
  const dow = new Date(2026, 7, day).getDay();
  if (dow === 0) return { day, pct: null, label: 'Holiday' };
  const base = 84 + ((day * 7) % 14);
  return { day, pct: Math.min(99, base), label: `${Math.min(99, base)}%` };
});
