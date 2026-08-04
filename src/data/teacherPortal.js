/**
 * Mock data for the Teacher portal (Mark Attendance, Upload Marks, Apply Leave).
 * Scope is classes 1–8 only, since the project covers standards 1 to 8.
 */
import { SUBJECTS, SECTIONS } from '../constants/app';

// Roster of students per class (1–8), used by attendance + marks.
// Kept small and deterministic for a clean demo.
const FIRST_NAMES = [
  'Aarav', 'Diya', 'Vivaan', 'Ananya', 'Reyansh', 'Ishita', 'Kabir', 'Saanvi',
  'Arjun', 'Myra', 'Aditya', 'Kiara', 'Vihaan', 'Anika', 'Shaurya', 'Aadhya',
];
const LAST_NAMES = [
  'Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Mehta', 'Nair',
  'Verma', 'Joshi', 'Rao', 'Iyer', 'Das', 'Bose', 'Malhotra', 'Menon',
];

function buildRoster(classNumber) {
  const count = 8; // students per class in the demo
  return Array.from({ length: count }, (_, i) => {
    const fn = FIRST_NAMES[(classNumber + i) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(classNumber * 2 + i) % LAST_NAMES.length];
    return {
      id: `S${classNumber}${String(i + 1).padStart(2, '0')}`,
      roll: i + 1,
      name: `${fn} ${ln}`,
      className: `Class ${classNumber}`,
      section: SECTIONS[classNumber % SECTIONS.length],
    };
  });
}

// { 'Class 1': [...students], ... } for classes 1–8
export const teacherRoster = Object.fromEntries(
  Array.from({ length: 8 }, (_, i) => {
    const n = i + 1;
    return [`Class ${n}`, buildRoster(n)];
  })
);

// Subjects the teacher can upload marks for
export const teacherSubjects = SUBJECTS.slice(0, 6);

// Recent leave applications by the logged-in teacher
export const leaveApplications = [
  {
    id: 'LV-2001',
    type: 'Casual Leave',
    from: '2026-07-14',
    to: '2026-07-15',
    days: 2,
    reason: 'Family function.',
    status: 'Approved',
  },
  {
    id: 'LV-2002',
    type: 'Sick Leave',
    from: '2026-06-03',
    to: '2026-06-03',
    days: 1,
    reason: 'Fever.',
    status: 'Approved',
  },
  {
    id: 'LV-2003',
    type: 'Casual Leave',
    from: '2026-08-10',
    to: '2026-08-11',
    days: 2,
    reason: 'Personal work.',
    status: 'Pending',
  },
];

export const leaveTypes = [
  'Casual Leave',
  'Sick Leave',
  'Earned Leave',
  'Maternity/Paternity Leave',
  'Duty Leave',
];
