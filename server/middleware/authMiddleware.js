import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "ai_igms_super_secret_jwt_key_2026_secure";

// Demo users seed matching authController for fallback identification
const DEMO_USERS_SEED = [
  {
    _id: "66b1a201c100000000000001",
    name: "System Administrator",
    email: "superadmin@igms.gov.in",
    roleKey: "super_admin",
    role: "Super Admin",
    org: "Directorate of School Education",
    schoolName: "Network Administration",
    home: "/dashboard",
    permissions: ["school.create", "school.manage", "principal.assign", "teacher.assign"],
  },
  {
    _id: "66b1a201c100000000000002",
    name: "Rohan Administrator",
    email: "principal@school-a.igms.gov.in",
    roleKey: "principal",
    role: "Principal",
    org: "Govt. Higher Secondary School · School A",
    school_id: "school-001",
    schoolName: "Govt. Higher Secondary School · School A",
    home: "/dashboard",
    permissions: ["school.view", "student.manage", "teacher.manage", "parent.manage", "dashboard.view"],
  },
  {
    _id: "66b1a201c100000000000003",
    name: "Dr. Meenakshi Iyer",
    email: "teacher@school-a.igms.gov.in",
    roleKey: "teacher",
    role: "Teacher",
    org: "Govt. Higher Secondary School · School A",
    school_id: "school-001",
    schoolName: "Govt. Higher Secondary School · School A",
    home: "/teacher/dashboard",
    permissions: ["attendance.manage", "marks.manage", "leave.apply", "teacher.dashboard"],
  },
  {
    _id: "66b1a201c100000000000006",
    name: "Prof. Rajesh Varma",
    email: "rajesh.teacher@school-a.igms.gov.in",
    roleKey: "teacher",
    role: "Teacher",
    org: "Govt. Higher Secondary School · School A",
    school_id: "school-001",
    schoolName: "Govt. Higher Secondary School · School A",
    home: "/teacher/dashboard",
    permissions: ["attendance.manage", "marks.manage", "leave.apply", "teacher.dashboard"],
  },
  {
    _id: "66b1a201c100000000000004",
    name: "Aarav Sharma",
    email: "student@school-a.igms.gov.in",
    roleKey: "student",
    role: "Student",
    org: "Class 6 · Section A",
    school_id: "school-001",
    schoolName: "Govt. Higher Secondary School · School A",
    classVal: "10",
    division: "A",
    studentId: "ST001",
    home: "/student/home",
    permissions: ["student.profile", "student.results", "student.attendance"],
  },
  {
    _id: "66b1a201c100000000000005",
    name: "Rajesh Sharma",
    email: "parent@school-a.igms.gov.in",
    roleKey: "parent",
    role: "Parent",
    org: "Govt. Higher Secondary School · School A",
    school_id: "school-001",
    schoolName: "Govt. Higher Secondary School · School A",
    childStudentId: "ST001",
    home: "/parent/dashboard",
    permissions: ["parent.profile", "student.results", "student.attendance"],
  },
];

/**
 * JWT Authentication Middleware
 * Protects endpoints and attaches authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token && token !== "undefined" && token !== "null") {
        const decoded = jwt.verify(token, JWT_SECRET);

        let user = null;
        if (mongoose.connection.readyState === 1 && decoded?.id) {
          try {
            user = await User.findById(decoded.id).select("-passwordHash");
          } catch (dbErr) {
            console.warn("protect middleware User lookup warning:", dbErr.message);
          }
        }

        // Check demo seed accounts if user not found in DB
        if (!user && decoded?.id) {
          const seedMatch = DEMO_USERS_SEED.find((u) => String(u._id) === String(decoded.id));
          if (seedMatch) {
            user = {
              _id: seedMatch._id,
              name: seedMatch.name,
              email: seedMatch.email,
              roleKey: seedMatch.roleKey,
              role: seedMatch.role,
              org: seedMatch.org,
              school_id: seedMatch.school_id || null,
              schoolName: seedMatch.schoolName || null,
              classVal: seedMatch.classVal || null,
              division: seedMatch.division || "A",
              studentId: seedMatch.studentId || null,
              childStudentId: seedMatch.childStudentId || null,
              home: seedMatch.home,
              permissions: seedMatch.permissions,
            };
          }
        }

        if (user) {
          req.user = user;
          return next();
        } else {
          return res.status(401).json({ message: "Not authorized, user not found." });
        }
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed or expired." });
    }
  }

  return res.status(401).json({ message: "Not authorized, no authentication token provided." });
};

/**
 * Role Guards Middleware
 * Restricts access to specific role keys e.g. protectRoles(["teacher", "principal"])
 */
export const protectRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.roleKey)) {
      return res.status(403).json({
        message: `Forbidden. Role '${req.user?.roleKey}' does not have permission for this resource.`,
      });
    }
    next();
  };
};
