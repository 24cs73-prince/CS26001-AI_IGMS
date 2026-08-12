/** Global application constants. */
export const APP = {
  name: "AI-IGMS",
  fullName: "AI-Enabled Integrated Government School Management System",
  shortTagline: "Government School Management",
  org: "Directorate of School Education",
  academicYear: "2025–26",
  version: "v1.0.0",
};

function hashPassword(value) {
  try {
    return btoa(String(value));
  } catch {
    return String(value);
  }
}

/**
 * Role-based demo accounts (frontend-only auth simulation).
 * The hierarchy is intentionally restricted so the Super Admin creates a
 * school and assigns Principal credentials, while a Principal creates
 * Teacher / Student / Parent credentials within their school.
 */
export const ROLES = {
  super_admin: {
    key: "super_admin",
    label: "Super Admin",
    tagline: "System seed & school provisioning",
    credentials: {
      email: "superadmin@igms.gov.in",
      passwordHash: hashPassword("Super@123"),
    },
    profile: {
      name: "System Administrator",
      role: "Super Admin",
      org: "Directorate of School Education",
      school_id: null,
      schoolName: "Network Administration",
      isActive: true,
      mustChangePassword: false,
      permissions: [
        "school.create",
        "school.manage",
        "principal.assign",
        "teacher.assign",
      ],
    },
    home: "/dashboard",
  },
  principal: {
    key: "principal",
    label: "Principal",
    tagline: "Administration & oversight",
    credentials: {
      email: "principal@school-a.igms.gov.in",
      passwordHash: hashPassword("Principal@123"),
    },
    profile: {
      name: "Rohan Administrator",
      role: "Principal",
      org: "Govt. Higher Secondary School · School A",
      school_id: "school-001",
      schoolName: "Govt. Higher Secondary School · School A",
      isActive: true,
      mustChangePassword: false,
      permissions: [
        "school.view",
        "student.manage",
        "teacher.manage",
        "parent.manage",
        "dashboard.view",
      ],
    },
    home: "/dashboard",
  },
  teacher: {
    key: "teacher",
    label: "Teacher",
    tagline: "Attendance, marks & leave",
    credentials: {
      email: "teacher@school-a.igms.gov.in",
      passwordHash: hashPassword("Teacher@123"),
    },
    profile: {
      name: "Dr. Meenakshi Iyer",
      role: "Teacher",
      org: "Govt. Higher Secondary School · School A",
      school_id: "school-001",
      schoolName: "Govt. Higher Secondary School · School A",
      isActive: true,
      mustChangePassword: false,
      permissions: [
        "attendance.manage",
        "marks.manage",
        "leave.apply",
        "teacher.dashboard",
      ],
    },
    home: "/teacher/attendance",
  },
  student: {
    key: "student",
    label: "Student",
    tagline: "Your class portal",
    credentials: {
      email: "student@school-a.igms.gov.in",
      passwordHash: hashPassword("Student@123"),
    },
    profile: {
      name: "Aarav Sharma",
      role: "Student",
      org: "Class 6 · Section A",
      school_id: "school-001",
      schoolName: "Govt. Higher Secondary School · School A",
      isActive: true,
      mustChangePassword: false,
      permissions: ["student.profile", "student.results", "student.attendance"],
    },
    home: "/student/home",
  },
  parent: {
    key: "parent",
    label: "Parent",
    tagline: "Your child's progress portal",
    credentials: {
      email: "parent@school-a.igms.gov.in",
      passwordHash: hashPassword("Parent@123"),
    },
    profile: {
      name: "Rajesh Sharma",
      role: "Parent",
      org: "Govt. Higher Secondary School · School A",
      school_id: "school-001",
      schoolName: "Govt. Higher Secondary School · School A",
      isActive: true,
      mustChangePassword: false,
      permissions: ["parent.profile", "student.results", "student.attendance"],
    },
    home: "/parent/dashboard",
  },
};

// Order the role buttons appear on the login screen
export const ROLE_ORDER = ["super_admin", "principal", "teacher", "student", "parent"];

// Backwards-compatible alias (principal = the original admin account)
export const DEMO_CREDENTIALS = ROLES.principal.credentials;

export const CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
];

export const SECTIONS = ["A", "B", "C", "D"];

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Social Science",
  "Hindi",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
];

export const DEPARTMENTS = [
  "Mathematics",
  "Science",
  "Languages",
  "Social Science",
  "Computer Science",
  "Physical Education",
];

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Mixed"];

// Exam terms used when uploading marks
export const EXAM_TERMS = [
  "Unit Test 1",
  "Mid-Term",
  "Unit Test 2",
  "Final Exam",
];

// Leave types available to teachers on the Apply Leave page
export const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity/Paternity Leave",
  "Duty Leave",
];
