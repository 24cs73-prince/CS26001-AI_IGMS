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

/**
 * Create a new parent profile
 */
export const createParent = async (req, res) => {
  try {
    const { userId, firstName, middleName, lastName, phone, email, address, occupation, studentIds } = req.body;
    
    const parent = new Parent({
      userId,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      address,
      occupation,
    });

    await parent.save();

    // If studentIds provided, link them
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      for (const sId of studentIds) {
        await StudentParent.create({
          studentId: sId,
          parentId: parent._id,
          parentUserId: userId,
          relationship: "Guardian",
        });
      }
    }

    res.status(201).json(parent);
  } catch (error) {
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
