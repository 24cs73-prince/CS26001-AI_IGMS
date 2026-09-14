import { School } from "../models/School.js";
import { User } from "../models/User.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";

/**
 * @desc    Get All Schools with Search & Pagination
 * @route   GET /api/schools
 */
export const getSchools = async (req, res) => {
  try {
    const searchFields = ["name", "udiseCode", "school_id", "category"];
    const result = await applyQueryFeatures(School, req.query, searchFields);
    res.json(result.data);
  } catch (error) {
    console.error("Get Schools Error:", error);
    res.status(500).json({ message: "Server error fetching schools." });
  }
};

/**
 * @desc    Get Single School Details
 * @route   GET /api/schools/:id
 */
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate("principalId", "name email role");
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching school details." });
  }
};

/**
 * @desc    Create New School
 * @route   POST /api/schools
 */
export const createSchool = async (req, res) => {
  try {
    const { name, udiseCode, category, district, state, pincode, principalId } = req.body;

    if (!name || !udiseCode) {
      return res.status(400).json({ message: "School name and UDISE Code are required." });
    }

    const exists = await School.findOne({ udiseCode });
    if (exists) {
      return res.status(400).json({ message: "School with this UDISE code already exists." });
    }

    const school_id = `school-${Date.now().toString().slice(-4)}`;

    const school = await School.create({
      school_id,
      name,
      udiseCode,
      category: category || "Higher Secondary",
      address: {
        district: district || "Ahmedabad",
        state: state || "Gujarat",
        pincode: pincode || "380001",
      },
      principalId: principalId || null,
    });

    res.status(201).json(school);
  } catch (error) {
    console.error("Create School Error:", error);
    res.status(500).json({ message: "Server error creating school.", details: error.message });
  }
};

/**
 * @desc    Update School Details / Assign Principal
 * @route   PATCH /api/schools/:id
 */
export const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }

    Object.assign(school, req.body);
    await school.save();

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error updating school." });
  }
};

/**
 * @desc    Get School Roster (Teachers & Students)
 * @route   GET /api/schools/:id/roster
 */
export const getSchoolRoster = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }

    const teachers = await User.find({ school_id: school.school_id, roleKey: "teacher" }).select("-passwordHash");
    const students = await User.find({ school_id: school.school_id, roleKey: "student" }).select("-passwordHash");

    res.json({
      schoolName: school.name,
      school_id: school.school_id,
      teachers,
      students,
      totalTeachers: teachers.length,
      totalStudents: students.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching school roster." });
  }
};
