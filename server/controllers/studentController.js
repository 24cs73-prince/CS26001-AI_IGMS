import { Student } from "../models/Student.js";

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
 * @desc    Create / Add New Student
 * @route   POST /api/students
 */
export const createStudent = async (req, res) => {
  try {
    const { name, className, section, roll, gender, guardian, phone, email } = req.body;
    const count = await Student.countDocuments();
    const studentId = `STU-${1000 + count + 1}`;

    const newStudent = await Student.create({
      studentId,
      name: name || "New Student",
      roll: roll || count + 1,
      className: className || "Class 5",
      section: section || "A",
      gender: gender || "Male",
      guardian: guardian || "Parent",
      phone: phone || "+91 98000 00000",
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      attendance: 90,
      average: 80,
      status: "Active",
      admissionDate: new Date().toISOString().split("T")[0],
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ message: "Server error creating student." });
  }
};
