import { Parent } from "../models/Parent.js";
import { Student } from "../models/Student.js";
import { StudentParent } from "../models/StudentParent.js";
import { User } from "../models/User.js";

/**
 * Get all parents (Admin / Principal)
 */
export const getParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate("userId", "name email roleKey").sort({ createdAt: -1 });
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
    const parent = await Parent.findById(req.params.id).populate("userId", "name email");
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
    let parent = await Parent.findOne({ userId });
    
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
        $or: [{ studentId: { $in: studentIds } }, { id: { $in: studentIds } }],
      });
    }

    // If still no students, return standard demo child for demo parents
    if (students.length === 0) {
      const defaultStudent = await Student.findOne();
      if (defaultStudent) students = [defaultStudent];
    }

    res.json({
      parent: parent || { name: req.user.name, email: req.user.email },
      children: students,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch children", error: error.message });
  }
};

import bcrypt from "bcryptjs";

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
    const userPassword = (password && password.trim()) ? password.trim() : "Parent@123";

    // 1. Create or update User account in MongoDB for Parent Login
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    const userDoc = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name: parentName,
        email: cleanEmail,
        passwordHash,
        roleKey: "parent",
        role: "Parent",
        org: "Govt. Higher Secondary School · School A",
        school_id: "SCH-001",
        schoolName: "PM Shri Government Higher Secondary School - Gandhinagar",
        childStudentId: studentId || (Array.isArray(studentIds) ? studentIds[0] : "STU-1001"),
        home: "/parent/dashboard",
        permissions: ["parent.profile", "student.results", "student.attendance"],
        mustChangePassword: false,
      },
      { upsert: true, new: true }
    );

    // 2. Create Parent profile document in MongoDB
    const parent = new Parent({
      userId: userDoc._id,
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
    const allStudentIds = studentIds || (studentId ? [studentId] : []);
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
      loginPassword: userPassword,
    });
  } catch (error) {
    console.error("Create Parent Error:", error);
    res.status(500).json({ message: "Failed to create parent", error: error.message });
  }
};

/**
 * Update parent profile
 */
export const updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    await StudentParent.deleteMany({ parentId: parent._id });
    res.json({ message: "Parent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete parent", error: error.message });
  }
};
