import { School } from "../models/School.js";
import { User } from "../models/User.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";
import bcrypt from "bcryptjs";
import { schoolScope } from "../middleware/authMiddleware.js";
import { isStrongPassword } from "../middleware/validateMiddleware.js";

/**
 * @desc    Get All Schools with Search & Pagination
 * @route   GET /api/schools
 */
export const getSchools = async (req, res) => {
  try {
    const searchFields = ["name", "udiseCode", "school_id", "category"];
    const result = await applyQueryFeatures(School, req.query, searchFields);
    res.json(result.data.map((school) => ({
      _id: school._id,
      school_id: school.school_id,
      name: school.name,
      udiseCode: school.udiseCode,
      category: school.category,
      address: school.address,
      status: school.status,
    })));
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
    const school = await School.findById(req.params.id).select(
      "school_id name udiseCode category address status"
    );
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching school details." });
  }
};

/**
 * @desc    Create New School & Create Associated Principal User Account
 * @route   POST /api/schools
 */
export const createSchool = async (req, res) => {
  try {
    const {
      name,
      udiseCode,
      category,
      district,
      state,
      pincode,
      principalId,
      principalName,
      principalEmail,
      principalPhone,
      principalPassword,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "School name is required." });
    }
    if (principalEmail && !isStrongPassword(principalPassword)) {
      return res.status(400).json({ message: "A strong password is required for the principal account." });
    }

    const generatedUdise = udiseCode || ("24" + Math.floor(100000000 + Math.random() * 900000000));
    const school_id = `school-${Date.now()}`;

    let createdPrincipalUser = null;
    let assignedPrincipalId = principalId || null;

    // Check if principal email was provided and create Principal User account
    if (principalEmail && principalEmail.trim()) {
      const cleanEmail = principalEmail.trim().toLowerCase();
      let existingUser = await User.findOne({ email: cleanEmail });

      if (existingUser) {
        return res.status(409).json({ message: "This email is already assigned to an account." });
      } else {
        const rawPass = principalPassword;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPass, salt);

        createdPrincipalUser = await User.create({
          name: principalName && principalName.trim() ? principalName.trim() : `Principal ${name}`,
          email: cleanEmail,
          passwordHash: hashedPassword,
          roleKey: "principal",
          role: "Principal",
          org: `${name} · ${district || "Gujarat"}`,
          school_id: school_id,
          schoolName: name,
          isActive: true,
          mustChangePassword: false,
          permissions: [
            "school.view",
            "student.manage",
            "teacher.manage",
            "parent.manage",
            "dashboard.view",
          ],
          home: "/dashboard",
        });

        assignedPrincipalId = createdPrincipalUser._id;
        console.log(`✅ Created Principal Account for school '${name}': ${cleanEmail}`);
      }
    }

    const school = await School.create({
      school_id,
      name,
      udiseCode: generatedUdise,
      category: category || "Higher Secondary",
      address: {
        district: district || "General District",
        state: state || "Gujarat",
        pincode: pincode || "380001",
      },
      principalId: assignedPrincipalId,
    });

    res.status(201).json({
      school,
      principal: createdPrincipalUser
        ? {
            id: createdPrincipalUser._id,
            name: createdPrincipalUser.name,
            email: createdPrincipalUser.email,
            roleKey: createdPrincipalUser.roleKey,
          }
        : null,
    });
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
    const school = await School.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }

    const allowedFields = ["name", "category", "address", "status", "principalId"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        school[field] = req.body[field];
      }
    }
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
    const school = await School.findOne({ _id: req.params.id, ...schoolScope(req) });
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
