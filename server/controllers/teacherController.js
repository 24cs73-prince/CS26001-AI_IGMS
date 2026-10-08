import { Teacher } from "../models/Teacher.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Get List of Teachers
 * @route   GET /api/teachers
 */
export const getTeachers = async (req, res) => {
  try {
    const { department, search } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { subject: regex }, { department: regex }];
    }

    const list = await Teacher.find(filter).sort({ name: 1 });
    res.json(list);
  } catch (error) {
    console.error("Get Teachers Error:", error);
    res.status(500).json({ message: "Server error fetching teachers." });
  }
};

/**
 * @desc    Create / Add New Teacher & Register User Login Account
 * @route   POST /api/teachers
 */
export const createTeacher = async (req, res) => {
  try {
    const { teacherId, name, department, subject, experience, phone, email, password, classes } = req.body;
    const count = await Teacher.countDocuments();
    const finalTeacherId = (teacherId && teacherId.trim()) ? teacherId.trim() : `TCH-${200 + count + 1}`;
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${(name || "teacher").toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.edu`;
    const userPassword = (password && password.trim()) ? password.trim() : "Teacher@123";

    // 1. Create Teacher record in MongoDB
    const newTeacher = await Teacher.create({
      teacherId: finalTeacherId,
      name: (name || "New Faculty").trim(),
      department: department || "General",
      subject: subject || "General",
      experience: Number(experience) || 5,
      phone: (phone || "+91 98000 00000").trim(),
      email: cleanEmail,
      classes: Array.isArray(classes) && classes.length > 0 ? classes : ["Class 5", "Class 6"],
      status: "Active",
      rating: 4.8,
    });

    // 2. Create User account in MongoDB for Teacher Login
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name: (name || "New Faculty").trim(),
        email: cleanEmail,
        passwordHash,
        roleKey: "teacher",
        role: "Teacher",
        org: "Govt. Higher Secondary School · School A",
        school_id: "SCH-001",
        schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
        home: "/teacher/dashboard",
        permissions: ["attendance.manage", "marks.manage", "leave.apply", "teacher.dashboard"],
        mustChangePassword: false,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      ...newTeacher.toObject(),
      loginEmail: cleanEmail,
      loginPassword: userPassword,
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);
    res.status(500).json({ message: "Server error creating teacher.", error: error.message });
  }
};
