/** Global application constants. */
export const APP = {
  name: 'AI-IGMS',
  fullName: 'AI-Enabled Integrated Government School Management System',
  shortTagline: 'Government School Management',
  org: 'Directorate of School Education',
  academicYear: '2025–26',
  version: 'v1.0.0',
};

// Demo credentials shown on the login screen (frontend-only auth)
export const DEMO_CREDENTIALS = {
  email: 'admin@igms.gov.in',
  password: 'admin@123',
};

/**
 * Role-based auth config (frontend-only).
 * - principal: the admin portal built by the team.
 * - teacher:   Mark Attendance, Upload Marks, Apply Leave.
 * - student:   placeholder only — signing in does nothing for now.
 */
export const ROLES = {
  principal: {
    key: 'principal',
    label: 'Principal',
    name: 'Rohan Administrator',
    role: 'Principal',
    email: 'admin@igms.gov.in',
    password: 'admin@123',
    home: '/dashboard',
  },
  teacher: {
    key: 'teacher',
    label: 'Teacher',
    name: 'Priya Teacher',
    role: 'Teacher',
    email: 'teacher@igms.gov.in',
    password: 'teacher@123',
    home: '/teacher/attendance',
  },
  student: {
    key: 'student',
    label: 'Student',
    name: 'Student',
    role: 'Student',
    email: 'student@igms.gov.in',
    password: 'student@123',
    home: '/student',
  },
};

// Order of the role buttons on the login screen
export const ROLE_ORDER = ['teacher', 'principal', 'student'];

// Project scope is grades 1–8 only (used by the teacher portal)
export const CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
];

export const SECTIONS = ['A', 'B', 'C', 'D'];

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Science',
  'Hindi',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
];

export const DEPARTMENTS = [
  'Mathematics',
  'Science',
  'Languages',
  'Social Science',
  'Computer Science',
  'Physical Education',
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Mixed'];
