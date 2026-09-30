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
  FiCoffee,
} from "react-icons/fi";

// Super Admin — system setup & full directory oversight
export const SUPER_ADMIN_NAV = [
  {
    heading: "Directorate Control",
    i18nKey: "nav.directorateControl",
    items: [
      { label: "Dashboard", i18nKey: "nav.dashboard", to: "/dashboard", icon: FiGrid },
      { label: "Schools Directory", i18nKey: "nav.schools", to: "/schools", icon: FiHome },
      { label: "Principals Roster", i18nKey: "nav.principalsRoster", to: "/principals", icon: FiShield },
    ],
  },
  {
    heading: "State Management",
    i18nKey: "nav.stateManagement",
    items: [
      { label: "Students Master", i18nKey: "nav.studentsMaster", to: "/students", icon: FiUsers },
      { label: "Teachers Roster", i18nKey: "nav.teachersRoster", to: "/teachers", icon: FiUserCheck },
      { label: "Parents Directory", i18nKey: "nav.parentsDirectory", to: "/parents", icon: FiUsers },
      { label: "Notices & Directives", i18nKey: "nav.notices", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    i18nKey: "nav.account",
    items: [
      { label: "Change Password", i18nKey: "nav.changePassword", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Principal / admin — Institutional Governance & Oversight Portal
export const PRINCIPAL_NAV = [
  {
    heading: "Institutional Desk",
    i18nKey: "nav.institutionalDesk",
    items: [
      { label: "Principal Dashboard", i18nKey: "nav.dashboard", to: "/dashboard", icon: FiGrid },
      {
        label: "Faculty Leave Desk",
        i18nKey: "nav.facultyLeaveDesk",
        to: "/principal/leaves",
        icon: FiCalendar,
        badge: "Approvals",
        badgeI18nKey: "principal.leaveApprovals",
      },
    ],
  },
  {
    heading: "Roster & Operations",
    i18nKey: "nav.rosterOperations",
    items: [
      { label: "Faculty Directory", i18nKey: "nav.teachersRoster", to: "/teachers", icon: FiUserCheck },
      { label: "Student Enrollment", i18nKey: "nav.studentsMaster", to: "/students", icon: FiUsers },
      { label: "Parent Directory", i18nKey: "nav.parentsDirectory", to: "/parents", icon: FiUsers },
      { label: "School Circulars", i18nKey: "nav.notices", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    i18nKey: "nav.account",
    items: [
      { label: "Change Password", i18nKey: "nav.changePassword", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Teacher — clean & focused tools
export const TEACHER_NAV = [
  {
    heading: "Teacher Portal",
    i18nKey: "nav.teacherPortal",
    items: [
      {
        label: "Teacher Dashboard",
        i18nKey: "nav.dashboard",
        to: "/teacher/dashboard",
        icon: FiGrid,
      },
      {
        label: "Online Exams",
        i18nKey: "nav.onlineExams",
        to: "/teacher/exams",
        icon: FiEdit3,
      },
      {
        label: "AI Paper Generator",
        i18nKey: "nav.aiPaperGenerator",
        to: "/teacher/ai-generator",
        icon: FiCpu,
      },
      {
        label: "Mark Attendance",
        i18nKey: "nav.markAttendance",
        to: "/teacher/attendance",
        icon: FiCheckSquare,
      },
      { label: "Upload Marks", i18nKey: "nav.uploadMarks", to: "/teacher/marks", icon: FiEdit3 },
      { label: "Apply Leave", i18nKey: "nav.applyLeave", to: "/teacher/leave", icon: FiCalendar },
      { label: "Timetable", i18nKey: "nav.timetable", to: "/teacher/timetable", icon: FiClock },
      { label: "Notices", i18nKey: "nav.notices", to: "/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    i18nKey: "nav.account",
    items: [
      { label: "Change Password", i18nKey: "nav.changePassword", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Student portal
export const STUDENT_NAV = [
  {
    heading: "Student Portal",
    i18nKey: "nav.studentPortal",
    items: [
      { label: "Student Home", i18nKey: "nav.dashboard", to: "/student/home", icon: FiGrid },
      { label: "Online Exams", i18nKey: "nav.onlineExams", to: "/student/exams", icon: FiEdit3 },
      { label: "My Results", i18nKey: "nav.myResults", to: "/student/results", icon: FiEdit3 },
      { label: "My Attendance", i18nKey: "nav.myAttendance", to: "/student/attendance", icon: FiCheckSquare },
      { label: "Notices", i18nKey: "nav.notices", to: "/student/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    i18nKey: "nav.account",
    items: [
      { label: "Change Password", i18nKey: "nav.changePassword", to: "/change-password", icon: FiSettings },
    ],
  },
];

// Parent portal
export const PARENT_NAV = [
  {
    heading: "Parent Portal",
    i18nKey: "nav.parentPortal",
    items: [
      { label: "Parent Dashboard", i18nKey: "nav.dashboard", to: "/parent/dashboard", icon: FiGrid },
      { label: "Child's Results", i18nKey: "nav.childResults", to: "/parent/results", icon: FiEdit3 },
      { label: "Child's Attendance", i18nKey: "nav.childAttendance", to: "/parent/attendance", icon: FiCheckSquare },
      { label: "Mid-Day Meal Menu", i18nKey: "nav.midDayMeal", to: "/parent/mid-day-meal", icon: FiCoffee },
      { label: "Notices", i18nKey: "nav.notices", to: "/parent/notices", icon: FiBell },
    ],
  },
  {
    heading: "Account",
    i18nKey: "nav.account",
    items: [
      { label: "Change Password", i18nKey: "nav.changePassword", to: "/change-password", icon: FiSettings },
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

export function navForRole(roleKey, t = (k, f) => f || k) {
  const groups = NAV_BY_ROLE[roleKey] || PRINCIPAL_NAV;
  return groups.map((g) => ({
    ...g,
    heading: g.i18nKey ? t(g.i18nKey, g.heading) : g.heading,
    items: g.items.map((item) => ({
      ...item,
      label: item.i18nKey ? t(item.i18nKey, item.label) : item.label,
      badge: item.badgeI18nKey ? t(item.badgeI18nKey, item.badge) : item.badge,
    })),
  }));
}

export const NAV_FLAT = Object.values(NAV_BY_ROLE)
  .flat()
  .flatMap((g) => g.items);
