import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCheckSquare,
  FiEdit3,
  FiCalendar,
  FiHome,
  FiBell,
  FiClock,
  FiSettings,
  FiCpu,
  FiShield,
} from "react-icons/fi";

// Super Admin — system setup & full directory oversight
export const SUPER_ADMIN_NAV = [
  {
    heading: "Directorate Control",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: FiGrid },
      { label: "Schools Directory", to: "/schools", icon: FiHome },
      { label: "Principals Roster", to: "/principals", icon: FiShield },
    ],
  },
  {
    heading: "State Management",
    items: [
      { label: "Students Master", to: "/students", icon: FiUsers },
      { label: "Teachers Roster", to: "/teachers", icon: FiUserCheck },
      { label: "Parents Directory", to: "/parents", icon: FiUsers },
      { label: "Notices & Directives", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Change Password", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Principal / admin — the full management portal
export const PRINCIPAL_NAV = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: FiGrid }],
  },
  {
    heading: "Management",
    items: [
      { label: "Students", to: "/students", icon: FiUsers },
      { label: "Teachers", to: "/teachers", icon: FiUserCheck },
      { label: "Parents", to: "/parents", icon: FiUsers },
      { label: "Notices", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Change Password", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Teacher — clean & focused tools
export const TEACHER_NAV = [
  {
    heading: "Teacher Portal",
    items: [
      {
        label: "Teacher Dashboard",
        to: "/teacher/dashboard",
        icon: FiGrid,
      },
      {
        label: "📝 Online Exams",
        to: "/teacher/exams",
        icon: FiEdit3,
      },
      {
        label: "✨ AI Paper Generator",
        to: "/teacher/ai-generator",
        icon: FiCpu,
      },
      {
        label: "Mark Attendance",
        to: "/teacher/attendance",
        icon: FiCheckSquare,
      },
      { label: "Upload Marks", to: "/teacher/marks", icon: FiEdit3 },
      { label: "Apply Leave", to: "/teacher/leave", icon: FiCalendar },
      { label: "Timetable", to: "/teacher/timetable", icon: FiClock },
      { label: "Notices", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Change Password", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Student portal
export const STUDENT_NAV = [
  {
    heading: "Student",
    items: [
      { label: "Student Home", to: "/student/home", icon: FiGrid },
      { label: "📝 Online Exams", to: "/student/exams", icon: FiEdit3 },
      { label: "My Results", to: "/student/results", icon: FiEdit3 },
      { label: "My Attendance", to: "/student/attendance", icon: FiCheckSquare },
      { label: "Notices", to: "/student/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Change Password", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Parent portal
export const PARENT_NAV = [
  {
    heading: "Parent Portal",
    items: [
      { label: "Parent Dashboard", to: "/parent/dashboard", icon: FiGrid },
      { label: "Child's Results", to: "/parent/results", icon: FiEdit3 },
      { label: "Child's Attendance", to: "/parent/attendance", icon: FiCheckSquare },
      { label: "Notices", to: "/parent/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Change Password", to: "/change-password", icon: FiSettings },
    ],
  },
];

const NAV_BY_ROLE = {
  super_admin: SUPER_ADMIN_NAV,
  principal: PRINCIPAL_NAV,
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
  parent: PARENT_NAV,
};

export function navForRole(roleKey) {
  return NAV_BY_ROLE[roleKey] || PRINCIPAL_NAV;
}

export const NAV_FLAT = Object.values(NAV_BY_ROLE)
  .flat()
  .flatMap((g) => g.items);
