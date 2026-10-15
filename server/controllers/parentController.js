import { Parent } from "../models/Parent.js";
import { Student } from "../models/Student.js";
import { StudentParent } from "../models/StudentParent.js";
import { User } from "../models/User.js";
import { schoolScope } from "../middleware/authMiddleware.js";
import { isStrongPassword } from "../middleware/validateMiddleware.js";
import bcrypt from "bcryptjs";

/**
 * Get all parents (Admin / Principal)
 */
export const getParents = async (req, res) => {
  try {
    const parents = await Parent.find(schoolScope(req, "schoolId"))
      .populate("userId", "name email roleKey")
      .sort({ createdAt: -1 });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parents", error: error.message });
  }
};

/**
 * Get single parent by ID
 */
export const getParentById = async (req, res) => {
  try {
    const parent = await Parent.findOne({ _id: req.params.id, ...schoolScope(req, "schoolId") })
      .populate("userId", "name email");
    if (!parent) return res.status(404).json({ message: "Parent record not found" });
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parent", error: error.message });
  }
};

/**
 * Get linked children for authenticated Parent user
 * Determines parent from JWT req.user._id and returns student profiles
 */
export const getMyChildren = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    // 1. Find Parent record by userId
    let parent = await Parent.findOne({ userId, ...schoolScope(req, "schoolId") });
    
    // 2. Find StudentParent links
    let links = [];
    if (parent) {
      links = await StudentParent.find({ parentId: parent._id });
    }
    
    // If no direct link yet, also check if User has childStudentId or fallback
    let studentIds = links.map((l) => l.studentId);
    if (studentIds.length === 0 && req.user.childStudentId) {
      studentIds = [req.user.childStudentId];
    }

    let students = [];
    if (studentIds.length > 0) {
      students = await Student.find({
        ...schoolScope(req, "schoolId"),
        $or: [{ studentId: { $in: studentIds } }, { id: { $in: studentIds } }],
      });
    }

    res.json({
      parent: parent || { name: req.user.name, email: req.user.email },
      children: students,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch children", error: error.message });
  }
};

/**
 * Create a new parent profile & Register User Login Account
 */
export const createParent = async (req, res) => {
  try {
    const {
      guardian,
      name,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      password,
      address,
      occupation,
      studentId,
      studentIds,
    } = req.body;

    const parentName = guardian || name || `${firstName || "Parent"} ${lastName || ""}`.trim() || "Guardian";
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${parentName.toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.edu`;
    const userPassword = password;
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: "A school must be assigned before creating a parent." });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "A strong password is required for the parent account." });
    }
    const existingUser = await User.findOne({ email: cleanEmail }).select("_id");
    if (existingUser) {
      return res.status(409).json({ message: "This email is already assigned to an account." });
    }
    const allStudentIds = studentIds || (studentId ? [studentId] : []);
    if (Array.isArray(allStudentIds) && allStudentIds.length > 0) {
      const students = await Student.find({
        schoolId,
        studentId: { $in: allStudentIds },
      }).select("studentId");
      if (students.length !== new Set(allStudentIds).size) {
        return res.status(403).json({ message: "One or more students are not in your school." });
      }
    }

    // 1. Create or update User account in MongoDB for Parent Login
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    const userDoc = await User.create({
      name: parentName,
      email: cleanEmail,
      passwordHash,
      roleKey: "parent",
      role: "Parent",
      org: "Govt. Higher Secondary School · School A",
      school_id: schoolId,
      schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
      childStudentId: studentId || (Array.isArray(studentIds) ? studentIds[0] : undefined),
      home: "/parent/dashboard",
      permissions: ["parent.profile", "student.results", "student.attendance"],
      mustChangePassword: false,
    });

    // 2. Create Parent profile document in MongoDB
    const parent = new Parent({
      userId: userDoc._id,
      schoolId,
      firstName: firstName || parentName.split(" ")[0] || "Guardian",
      middleName: middleName || "",
      lastName: lastName || parentName.split(" ")[1] || "",
      phone: phone || "+91 98000 00000",
      email: cleanEmail,
      address: address || "Gandhinagar, Gujarat",
      occupation: occupation || "Government / Business",
    });

    await parent.save();

    // 3. Link students if studentId or studentIds provided
    if (Array.isArray(allStudentIds) && allStudentIds.length > 0) {
      for (const sId of allStudentIds) {
        await StudentParent.create({
          studentId: sId,
          parentId: parent._id,
          parentUserId: userDoc._id,
          relationship: "Guardian",
        });
      }
    }

    res.status(201).json({
      ...parent.toObject(),
      loginEmail: cleanEmail,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A parent or account with those identifiers already exists." });
    }
    console.error("Create Parent Error:", error);
    res.status(500).json({ message: "Failed to create parent", error: error.message });
  }
};

/**
 * Update parent profile
 */
export const updateParent = async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "middleName",
      "lastName",
      "phone",
      "email",
      "address",
      "occupation",
      "status",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );
    const parent = await Parent.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update parent", error: error.message });
  }
};

/**
 * Delete parent
 */
export const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findOne({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const account = await User.findOneAndUpdate(
      { _id: parent.userId, roleKey: "parent", school_id: parent.schoolId },
      { $set: { isActive: false, childStudentId: null } }
    );
    if (!account) {
      return res.status(409).json({ message: "Parent account is missing; profile was not deleted." });
    }
    await parent.deleteOne();
    await StudentParent.deleteMany({ parentId: parent._id });
    res.json({ message: "Parent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete parent", error: error.message });
  }
};
