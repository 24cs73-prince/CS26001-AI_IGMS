import { Teacher } from "../models/Teacher.js";

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
 * @desc    Create / Add New Teacher
 * @route   POST /api/teachers
 */
export const createTeacher = async (req, res) => {
  try {
    const { name, department, subject, experience, phone, email, classes } = req.body;
    const count = await Teacher.countDocuments();
    const teacherId = `TCH-${200 + count + 1}`;

    const newTeacher = await Teacher.create({
      teacherId,
      name: name || "New Teacher",
      department: department || "General",
      subject: subject || "General",
      experience: experience || 5,
      phone: phone || "+91 98000 00000",
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      classes: Array.isArray(classes) ? classes : ["Class 5"],
      status: "Active",
      rating: 4.5,
    });

    res.status(201).json(newTeacher);
  } catch (error) {
    console.error("Create Teacher Error:", error);
    res.status(500).json({ message: "Server error creating teacher." });
  }
};
