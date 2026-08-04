/**
 * Sidebar navigation configuration.
 * Each item maps to a route and a React-Icons component (imported in the Sidebar).
 * Grouping keeps the navigation scannable in the UI.
 */
import { FiGrid, FiUsers, FiUserCheck } from "react-icons/fi";

export const NAV_GROUPS = [
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

// Flattened list – handy for breadcrumbs and route titles
export const NAV_FLAT = NAV_GROUPS.flatMap((g) => g.items);
