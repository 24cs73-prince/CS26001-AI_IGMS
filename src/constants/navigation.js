/**
 * Sidebar navigation configuration — organised per role.
 * Each item maps to a route and a React-Icons component (imported in the Sidebar).
 * `navForRole(roleKey)` returns the groups a given role should see, so teacher
 * features never appear in the principal's sidebar (and vice-versa).
 */
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCheckSquare,
  FiEdit3,
  FiCalendar,
} from "react-icons/fi";

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
    ],
  },
];

// Teacher — only the teacher tools
export const TEACHER_NAV = [
  {
    heading: "Teacher",
    items: [
      { label: "Mark Attendance", to: "/teacher/attendance", icon: FiCheckSquare },
      { label: "Upload Marks", to: "/teacher/marks", icon: FiEdit3 },
      { label: "Apply Leave", to: "/teacher/leave", icon: FiCalendar },
    ],
  },
];

// Student — dedicated self-service portal
export const STUDENT_NAV = [
  {
    heading: "Student",
    items: [{ label: "My Dashboard", to: "/student/home", icon: FiGrid }],
  },
];

const NAV_BY_ROLE = {
  principal: PRINCIPAL_NAV,
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
};

/** Navigation groups for a given role key (defaults to principal). */
export function navForRole(roleKey) {
  return NAV_BY_ROLE[roleKey] || PRINCIPAL_NAV;
}

// Flattened list of every route across roles — handy for breadcrumbs/titles
export const NAV_FLAT = Object.values(NAV_BY_ROLE)
  .flat()
  .flatMap((g) => g.items);
