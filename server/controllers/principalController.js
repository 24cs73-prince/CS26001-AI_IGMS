import { Principal } from "../models/Principal.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { schoolScope } from "../middleware/authMiddleware.js";
import { isStrongPassword } from "../middleware/validateMiddleware.js";

/**
 * @desc    Get List of Principals
 * @route   GET /api/principals
 */
export const getPrincipals = async (req, res) => {
  try {
    const list = await Principal.find(schoolScope(req)).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error("Get Principals Error:", error);
    res.status(500).json({ message: "Server error fetching principals." });
  }
};

/**
 * @desc    Create a Principal and Register a User Login Account
 * @route   POST /api/principals
 */
export const createPrincipal = async (req, res) => {
  try {
    const {
      principalId,
      name,
      schoolName,
      district,
      email,
      phone,
      password,
      udise,
    } = req.body;
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "A strong password is required for the principal account." });
    }
    const schoolId = req.user.roleKey === "super_admin" ? req.body.school_id : req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: "A school must be assigned before creating a principal." });
    }

    const count = await Principal.countDocuments();
    const finalPrincipalId = (principalId && principalId.trim()) ? principalId.trim() : `PRN-${100 + count + 1}`;
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${(name || "principal").toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.gov.in`;
    const userPassword = password;
    const existingUser = await User.findOne({ email: cleanEmail }).select("_id");
    if (existingUser) {
      return res.status(409).json({ message: "This email is already assigned to an account." });
    }

    // 1. Create or update User Account in MongoDB for Principal Login
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    const userDoc = await User.create({
      name: (name || "Rohan Administrator").trim(),
      email: cleanEmail,
      passwordHash,
      roleKey: "principal",
      role: "Principal",
      org: `${schoolName || "Government Higher Secondary School"} · ${district || "Gandhinagar"}`,
      school_id: schoolId,
      schoolName: schoolName || "Government Higher Secondary School",
      home: "/dashboard",
      permissions: ["school.view", "student.manage", "teacher.manage", "parent.manage", "dashboard.view"],
      mustChangePassword: false,
    });

    // 2. Create Principal record in MongoDB
    const newPrincipal = await Principal.create({
      principalId: finalPrincipalId,
      school_id: schoolId,
      userId: userDoc._id,
      name: (name || "Rohan Administrator").trim(),
      schoolName: (schoolName || "Government Higher Secondary School").trim(),
      district: district || "Gandhinagar",
      email: cleanEmail,
      phone: (phone || "+91 98765 43210").trim(),
      udise: (udise || "24070100101").trim(),
      status: "Active",
      appointedDate: new Date().toISOString().split("T")[0],
      studentsCount: 420,
      teachersCount: 18,
    });

    res.status(201).json({
      ...newPrincipal.toObject(),
      loginEmail: cleanEmail,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A principal or account with those identifiers already exists." });
    }
    console.error("Create Principal Error:", error);
    res.status(500).json({ message: "Server error creating principal.", error: error.message });
  }
};

/**
 * @desc    Delete Principal
 * @route   DELETE /api/principals/:id
 */
export const deletePrincipal = async (req, res) => {
  try {
    const item = await Principal.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!item) return res.status(404).json({ message: "Principal not found" });
    if (item.userId) {
      const account = await User.findOneAndUpdate(
        { _id: item.userId, roleKey: "principal", school_id: item.school_id },
        { $set: { isActive: false } }
      );
      if (!account) {
        return res.status(409).json({ message: "Principal account is missing; profile was not deleted." });
      }
    }
    await item.deleteOne();
    res.json({ message: "Principal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting principal", error: error.message });
  }
};
