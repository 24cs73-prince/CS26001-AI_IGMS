/**
 * Sidebar navigation configuration — organised per role.
 * The hierarchy here mirrors the requested role isolation:
 * Super Admin can provision schools and principals; Principal manages school-level users;
 * Teachers / Students / Parents only get their own scoped portal navigation.
 */
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
} from "react-icons/fi";

// Super Admin — system setup route
export const SUPER_ADMIN_NAV = [
  {
    heading: "Administration",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: FiGrid },
      { label: "Schools", to: "/schools", icon: FiHome },
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

// Teacher — only the teacher tools
export const TEACHER_NAV = [
  {
    heading: "Teacher",
    items: [
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

// Student — built separately by teammate; no nav here for now
export const STUDENT_NAV = [
  {
    heading: "Student",
    items: [
      { label: "Student Home", to: "/student/home", icon: FiGrid },
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

// Parent — portal
export const PARENT_NAV = [
  {
    heading: "Parent Portal",
    items: [
      { label: "Parent Dashboard", to: "/parent/dashboard", icon: FiGrid },
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

/** Navigation groups for a given role key (defaults to principal). */
export function navForRole(roleKey) {
  return NAV_BY_ROLE[roleKey] || PRINCIPAL_NAV;
}

// Flattened list of every route across roles — handy for breadcrumbs/titles
export const NAV_FLAT = Object.values(NAV_BY_ROLE)
  .flat()
  .flatMap((g) => g.items);
