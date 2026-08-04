/**
 * Sidebar navigation configuration (role-aware).
 * Each item maps to a route and a React-Icons component.
 * Use navForRole(roleKey) to get the right groups for the logged-in user.
 */
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCheckSquare,
  FiEdit3,
  FiCalendar,
} from "react-icons/fi";

// Principal (admin) portal — built by the team
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
    ],
  },
];

// Teacher portal — only these three features for now
export const TEACHER_NAV = [
  {
    heading: "Teaching",
    items: [
      { label: "Mark Attendance", to: "/teacher/attendance", icon: FiCheckSquare },
      { label: "Upload Marks", to: "/teacher/marks", icon: FiEdit3 },
      { label: "Apply Leave", to: "/teacher/leave", icon: FiCalendar },
    ],
  },
];

// Student portal — placeholder, no navigation for now
export const STUDENT_NAV = [];

/** Returns the nav groups for a given role key. */
export function navForRole(roleKey) {
  switch (roleKey) {
    case "teacher":
      return TEACHER_NAV;
    case "student":
      return STUDENT_NAV;
    case "principal":
    default:
      return PRINCIPAL_NAV;
  }
}

// Kept for backwards compatibility (defaults to principal)
export const NAV_GROUPS = PRINCIPAL_NAV;
export const NAV_FLAT = PRINCIPAL_NAV.flatMap((g) => g.items);
