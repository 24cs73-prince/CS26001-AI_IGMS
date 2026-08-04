/** Global application constants. */
export const APP = {
  name: 'AI-IGMS',
  fullName: 'AI-Enabled Integrated Government School Management System',
  shortTagline: 'Government School Management',
  org: 'Directorate of School Education',
  academicYear: '2025–26',
  version: 'v1.0.0',
};

/**
 * Role-based demo accounts (frontend-only auth).
 * Each role has its own credentials, profile, and landing route.
 * `key` is stored on the logged-in user and drives navigation + route guards.
 */
export const ROLES = {
  principal: {
    key: 'principal',
    label: 'Principal',
    tagline: 'Administration & oversight',
    credentials: { email: 'admin@igms.gov.in', password: 'admin@123' },
    profile: {
      name: 'Rohan Administrator',
      role: 'Principal',
      org: 'Directorate of School Education',
    },
    home: '/dashboard',
  },
  teacher: {
    key: 'teacher',
    label: 'Teacher',
    tagline: 'Attendance, marks & leave',
    credentials: { email: 'teacher@igms.gov.in', password: 'teacher@123' },
    profile: {
      name: 'Dr. Meenakshi Iyer',
      role: 'Teacher',
      org: 'Mathematics Department',
    },
    home: '/teacher/attendance',
  },
  student: {
    key: 'student',
    label: 'Student',
    tagline: 'Your class portal',
    credentials: { email: 'student@igms.gov.in', password: 'student@123' },
    profile: {
      name: 'Aarav Sharma',
      role: 'Student',
      org: 'Class 10 · Section A',
    },
    home: '/student/home',
  },
};

// Order the role buttons appear on the login screen
export const ROLE_ORDER = ['teacher', 'principal', 'student'];

// Backwards-compatible alias (principal = the original admin account)
export const DEMO_CREDENTIALS = ROLES.principal.credentials;

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

// Exam terms used when uploading marks
export const EXAM_TERMS = [
  'Unit Test 1',
  'Mid-Term',
  'Unit Test 2',
  'Final Exam',
];

// Leave types available to teachers on the Apply Leave page
export const LEAVE_TYPES = [
  'Casual Leave',
  'Sick Leave',
  'Earned Leave',
  'Maternity/Paternity Leave',
  'Duty Leave',
];
