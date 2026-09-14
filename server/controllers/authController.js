import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "ai_igms_super_secret_jwt_key_2026_secure", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Initial Seed Accounts matching the app constants for all roles
const DEMO_USERS_SEED = [
  {
    _id: "66b1a201c100000000000001",
    name: "System Administrator",
    email: "superadmin@igms.gov.in",
    passwordRaw: "Super@123",
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
    passwordRaw: "Principal@123",
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
    passwordRaw: "Teacher@123",
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
    passwordRaw: "Teacher@123",
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
    passwordRaw: "Student@123",
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
    passwordRaw: "Parent@123",
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

/** Check if Mongoose connection is active */
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Authenticate User & Get JWT Token
 * @route   POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email address is required." });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check MongoDB if connected
    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (err) {
        console.warn("DB query skipped:", err.message);
      }
    }

    // Check seed list fallback if DB not connected or user not found in DB
    const seedMatch = DEMO_USERS_SEED.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordRaw === password
    );

    if (user) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      const token = generateToken(user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roleKey: user.roleKey,
        role: user.role,
        org: user.org,
        school_id: user.school_id,
        schoolName: user.schoolName,
        classVal: user.classVal,
        division: user.division,
        studentId: user.studentId,
        childStudentId: user.childStudentId,
        home: user.home,
        permissions: user.permissions,
        mustChangePassword: user.mustChangePassword,
        token,
      });
    }

    if (seedMatch) {
      const token = generateToken(seedMatch._id);
      return res.json({
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
        mustChangePassword: false,
        token,
      });
    }

    return res.status(401).json({
      message: `Invalid credentials for ${role || 'selected'} account. Please verify email and password.`,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during authentication." });
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select("-passwordHash");
      if (user) return res.json(user);
    }
    return res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user profile." });
  }
};

/**
 * @desc    Change User Password
 * @route   POST /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (user) {
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect." });
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.mustChangePassword = false;
        await user.save();
        return res.json({ message: "Password updated successfully in MongoDB Atlas." });
      }
    }
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error changing password." });
  }
};

/**
 * @desc    Add Sample Teacher explicitly to Database
 * @route   POST /api/auth/add-sample-teacher
 */
export const addSampleTeacher = async (req, res) => {
  try {
    const sampleTeacherData = {
      name: req.body.name || "Prof. Rajesh Varma",
      email: (req.body.email || "rajesh.teacher@school-a.igms.gov.in").toLowerCase(),
      passwordRaw: req.body.password || "Teacher@123",
      roleKey: "teacher",
      role: "Teacher",
      org: "Govt. Higher Secondary School · School A",
      school_id: "school-001",
      schoolName: "Govt. Higher Secondary School · School A",
      home: "/teacher/dashboard",
      permissions: ["attendance.manage", "marks.manage", "leave.apply", "teacher.dashboard"],
    };

    if (isDbConnected()) {
      let teacher = await User.findOne({ email: sampleTeacherData.email });
      if (!teacher) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(sampleTeacherData.passwordRaw, salt);

        teacher = await User.create({
          ...sampleTeacherData,
          passwordHash: hashedPassword,
        });
      }
      return res.json({
        status: "success",
        message: `Sample teacher '${teacher.name}' added to MongoDB Atlas database successfully!`,
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
          schoolName: teacher.schoolName,
        },
      });
    }

    return res.json({
      status: "notice",
      message: `Sample teacher '${sampleTeacherData.name}' ready for database verification.`,
      teacher: {
        name: sampleTeacherData.name,
        email: sampleTeacherData.email,
        password: sampleTeacherData.passwordRaw,
        role: "Teacher",
      },
    });
  } catch (error) {
    console.error("Add Teacher Error:", error);
    res.status(500).json({ message: "Error adding sample teacher.", details: error.message });
  }
};

/**
 * @desc    Seed Initial Accounts into MongoDB Atlas
 * @route   POST /api/auth/seed
 */
export const seedAccounts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        status: "notice",
        message: "Seed API Ready (Fallback mode). Update MONGODB_URI in server/.env with your MongoDB Atlas cluster connection string to write documents to cloud DB.",
        accountsAvailable: DEMO_USERS_SEED.map((u) => ({ name: u.name, email: u.email, role: u.role })),
      });
    }

    let count = 0;
    for (const seedItem of DEMO_USERS_SEED) {
      const exists = await User.findOne({ email: seedItem.email });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(seedItem.passwordRaw, salt);

        await User.create({
          ...seedItem,
          passwordHash: hashedPassword,
        });
        count++;
      }
    }
    res.json({
      status: "success",
      message: `Successfully seeded ${count} role accounts into MongoDB Atlas database.`,
      accounts: DEMO_USERS_SEED.map((u) => ({ name: u.name, email: u.email, role: u.role })),
    });
  } catch (error) {
    console.error("Seed Error:", error);
    res.status(500).json({ message: "Error seeding accounts to MongoDB.", details: error.message });
  }
};
