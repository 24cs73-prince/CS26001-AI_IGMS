import { Student } from "../models/Student.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Get List of Students
 * @route   GET /api/students
 */
export const getStudents = async (req, res) => {
  try {
    const { className, section, search } = req.query;
    const filter = {};

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (search) {
      const regex = new RegExp(search, "i");
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

    const count = await Student.countDocuments();
    const finalStudentId = (studentId && studentId.trim()) ? studentId.trim() : `STU-${1000 + count + 1}`;
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${(name || "student").toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.edu`;
    const userPassword = (password && password.trim()) ? password.trim() : "Student@123";

    // 1. Create Student record in MongoDB
    const newStudent = await Student.create({
      studentId: finalStudentId,
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

    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name: (name || "New Student").trim(),
        email: cleanEmail,
        passwordHash,
        roleKey: "student",
        role: "Student",
        org: `${className || "Class 5"} · Section ${(section || "A").toUpperCase()}`,
        school_id: "SCH-001",
        schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
        classVal: className ? String(className).replace(/[^0-9]/g, "") || "5" : "5",
        division: (section || "A").toUpperCase(),
        studentId: finalStudentId,
        home: "/student/home",
        permissions: ["student.profile", "student.results", "student.attendance"],
        mustChangePassword: false,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      ...newStudent.toObject(),
      loginEmail: cleanEmail,
      loginPassword: userPassword,
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ message: "Server error creating student.", error: error.message });
  }
};
