import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";
import { useAuth } from "../context/AuthContext";

// Pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Parents from "../pages/Parents";
import Teachers from "../pages/Teachers";
import Schools from "../pages/Schools";
import Principals from "../pages/Principals";
import MarkAttendance from "../pages/teacher/MarkAttendance";
import UploadMarks from "../pages/teacher/UploadMarks";
import ApplyLeave from "../pages/teacher/ApplyLeave";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyClass from "../pages/teacher/MyClass";
import AIPaperGenerator from "../pages/teacher/AIPaperGenerator";
import TeacherExamsPage from "../pages/teacher/TeacherExamsPage";
import CreateExamPage from "../pages/teacher/CreateExamPage";
import ExamDetailsPage from "../pages/teacher/ExamDetailsPage";
import StudentSubmissionsPage from "../pages/teacher/StudentSubmissionsPage";
import TeacherResultsPage from "../pages/teacher/TeacherResultsPage";

import StudentExamsPage from "../pages/student/StudentExamsPage";
import StudentExamStartPage from "../pages/student/StudentExamStartPage";
import StudentExamAttemptPage from "../pages/student/StudentExamAttemptPage";

import ChangePassword from "../pages/ChangePassword";
import NotFound from "../pages/NotFound";
import Timetable from "../pages/Timetable";
import Notices from "../pages/Notices";
import StudentDashboard from "../pages/StudentDashboard";
import StudentResults from "../pages/StudentResults";
import StudentAttendance from "../pages/StudentAttendance";
import ParentDashboard from "../pages/ParentDashboard";
import ParentResults from "../pages/ParentResults";
import ParentAttendance from "../pages/ParentAttendance";

/** Sends "/" to the logged-in user's home portal (or login if signed out). */
function RoleHome() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.home || "/dashboard"} replace />;
}

/**
 * Central route configuration.
 * - /login          → AuthLayout (public)
 * - all app routes  → DashboardLayout (protected)
 * Each page is additionally guarded by role via `allowedRoles`, so teacher
 * pages live only in the teacher portal and management pages only in the
 * principal portal.
 */
export default function AppRoutes() {
  const location = useLocation();

  // Wrap a page with its transition + a role guard
  const page = (Component, allowedRoles) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PageTransition>
        <Component />
      </PageTransition>
    </ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected app shell (requires auth) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Super Admin portal */}
          <Route
            path="/dashboard"
            element={page(Dashboard, ["super_admin", "principal"])}
          />
          <Route path="/schools" element={page(Schools, ["super_admin"])} />
          <Route
            path="/principals"
            element={page(Principals, ["super_admin"])}
          />

          {/* Principal portal */}
          <Route path="/students" element={page(Students, ["principal"])} />
          <Route path="/teachers" element={page(Teachers, ["principal"])} />
          <Route path="/parents" element={page(Parents, ["principal"])} />
          <Route path="/notices" element={page(Notices, ["principal", "teacher"])} />

          {/* Teacher portal */}
          <Route
            path="/teacher/dashboard"
            element={page(TeacherDashboard, ["teacher"])}
          />
          <Route
            path="/teacher/my-class"
            element={<Navigate to="/teacher/dashboard" replace />}
          />
          <Route
            path="/teacher/ai-generator"
            element={<Navigate to="/teacher/exams/create" replace />}
          />
          <Route
            path="/teacher/exams"
            element={page(TeacherExamsPage, ["teacher"])}
          />
          <Route
            path="/teacher/exams/create"
            element={page(CreateExamPage, ["teacher"])}
          />
          <Route
            path="/teacher/exams/:examId"
            element={page(ExamDetailsPage, ["teacher"])}
          />
          <Route
            path="/teacher/exams/:examId/submissions"
            element={page(StudentSubmissionsPage, ["teacher"])}
          />
          <Route
            path="/teacher/exams/:examId/results"
            element={page(TeacherResultsPage, ["teacher"])}
          />
          <Route
            path="/teacher/attendance"
            element={page(MarkAttendance, ["teacher"])}
          />
          <Route
            path="/teacher/marks"
            element={page(UploadMarks, ["teacher"])}
          />
          <Route
            path="/teacher/leave"
            element={page(ApplyLeave, ["teacher"])}
          />
          <Route
            path="/teacher/timetable"
            element={page(Timetable, ["teacher"])}
          />

          {/* Student portal */}
          <Route path="/student/home" element={page(StudentDashboard, ["student"])} />
          <Route path="/student/exams" element={page(StudentExamsPage, ["student"])} />
          <Route path="/student/exams/:examId/start" element={page(StudentExamStartPage, ["student"])} />
          <Route path="/student/exams/:examId/attempt" element={page(StudentExamAttemptPage, ["student"])} />
          <Route path="/student/results" element={page(StudentResults, ["student"])} />
          <Route path="/student/attendance" element={page(StudentAttendance, ["student"])} />
          <Route path="/student/notices" element={page(Notices, ["student"])} />

          {/* Parent portal */}
          <Route path="/parent/dashboard" element={page(ParentDashboard, ["parent"])} />
          <Route path="/parent/results" element={page(ParentResults, ["parent"])} />
          <Route path="/parent/attendance" element={page(ParentAttendance, ["parent"])} />
          <Route path="/parent/notices" element={page(Notices, ["parent"])} />

          <Route
            path="/change-password"
            element={page(ChangePassword, [
              "super_admin",
              "principal",
              "teacher",
              "student",
              "parent",
            ])}
          />
        </Route>

        {/* Redirects & fallback */}
        <Route path="/" element={<RoleHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
