import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";

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
import AIPaperGenerator from "../pages/teacher/AIPaperGenerator";
import TeacherExamsPage from "../pages/teacher/TeacherExamsPage";
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

/** Root URL "/" always opens the Login page */
function RoleHome() {
  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const location = useLocation();

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
          {/* Super Admin / Principal portals */}
          <Route
            path="/dashboard"
            element={page(Dashboard, ["super_admin", "principal", "admin"])}
          />
          <Route path="/schools" element={page(Schools, ["super_admin", "admin"])} />
          <Route
            path="/principals"
            element={page(Principals, ["super_admin", "admin"])}
          />

          {/* Student & Management routes */}
          <Route path="/students" element={page(Students, ["principal", "super_admin", "admin"])} />
          <Route path="/teachers" element={page(Teachers, ["principal", "super_admin", "admin"])} />
          <Route path="/parents" element={page(Parents, ["principal", "super_admin", "admin"])} />
          <Route path="/notices" element={page(Notices, ["principal", "super_admin", "admin", "teacher"])} />

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
            element={page(AIPaperGenerator, ["teacher"])}
          />
          <Route
            path="/teacher/exams"
            element={page(TeacherExamsPage, ["teacher"])}
          />
          <Route
            path="/teacher/exams/create"
            element={page(AIPaperGenerator, ["teacher"])}
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
              "admin",
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
