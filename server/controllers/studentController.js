import { Student } from "../models/Student.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { schoolScope } from "../middleware/authMiddleware.js";
import { isStrongPassword } from "../middleware/validateMiddleware.js";

/**
 * @desc    Get List of Students
 * @route   GET /api/students
 */
export const getStudents = async (req, res) => {
  try {
    const { className, section, search } = req.query;
    const filter = schoolScope(req, "schoolId");

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (search) {
      const escapedSearch = String(search).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");
      filter.$or = [{ name: regex }, { studentId: regex }, { guardian: regex }];
    }

    const list = await Student.find(filter).sort({ roll: 1 });
    res.json(list);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Server error fetching students." });
  }
};

/**
 * @desc    Create / Add New Student & Register User Login Account
 * @route   POST /api/students
 */
export const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      className,
      section,
      roll,
      gender,
      guardian,
      phone,
      email,
      password,
      dob,
      admissionDate,
    } = req.body;

    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: "A school must be assigned before creating a student." });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "A strong password is required for the student account." });
    }
    const count = await Student.countDocuments({ schoolId });
    const finalStudentId = (studentId && studentId.trim()) ? studentId.trim() : `STU-${1000 + count + 1}`;
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${(name || "student").toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.edu`;
    const existingUser = await User.findOne({ email: cleanEmail }).select("_id");
    if (existingUser) {
      return res.status(409).json({ message: "This email is already assigned to an account." });
    }
    const userPassword = password;

    // 1. Create Student record in MongoDB
    const newStudent = await Student.create({
      studentId: finalStudentId,
      schoolId,
      name: (name || "New Student").trim(),
      roll: Number(roll) || (count + 1),
      className: className || "Class 5",
      section: (section || "A").toUpperCase(),
      gender: gender || "Male",
      guardian: (guardian || "Parent").trim(),
      phone: (phone || "+91 98000 00000").trim(),
      email: cleanEmail,
      dob: dob || "2015-05-15",
      admissionDate: admissionDate || new Date().toISOString().split("T")[0],
      attendance: 90,
      average: 80,
      status: "Active",
    });

    // 2. Create corresponding User Account in MongoDB so Student can log in
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    await User.create({
      name: (name || "New Student").trim(),
      email: cleanEmail,
      passwordHash,
      roleKey: "student",
      role: "Student",
      org: `${className || "Class 5"} · Section ${(section || "A").toUpperCase()}`,
      school_id: schoolId,
      schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
      classVal: className ? String(className).replace(/[^0-9]/g, "") || "5" : "5",
      division: (section || "A").toUpperCase(),
      studentId: finalStudentId,
      home: "/student/home",
      permissions: ["student.profile", "student.results", "student.attendance"],
      mustChangePassword: false,
    });

    res.status(201).json({
      ...newStudent.toObject(),
      loginEmail: cleanEmail,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A student or account with those identifiers already exists." });
    }
    console.error("Create Student Error:", error);
    res.status(500).json({ message: "Server error creating student.", error: error.message });
  }
};
