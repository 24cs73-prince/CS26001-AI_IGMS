import { Principal } from "../models/Principal.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Get List of Principals
 * @route   GET /api/principals
 */
export const getPrincipals = async (req, res) => {
  try {
    const list = await Principal.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error("Get Principals Error:", error);
    res.status(500).json({ message: "Server error fetching principals." });
  }
};

/**
 * @desc    Create / Add New Principal & Register User Login Account
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

    const count = await Principal.countDocuments();
    const finalPrincipalId = (principalId && principalId.trim()) ? principalId.trim() : `PRN-${100 + count + 1}`;
    const cleanEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${(name || "principal").toLowerCase().replace(/[^a-z0-9]/g, "")}@igms.gov.in`;
    const userPassword = (password && password.trim()) ? password.trim() : "Principal@123";

    // 1. Create or update User Account in MongoDB for Principal Login
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    const userDoc = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        name: (name || "Rohan Administrator").trim(),
        email: cleanEmail,
        passwordHash,
        roleKey: "principal",
        role: "Principal",
        org: `${schoolName || "Government Higher Secondary School"} · ${district || "Gandhinagar"}`,
        school_id: "SCH-001",
        schoolName: schoolName || "Government Higher Secondary School",
        home: "/dashboard",
        permissions: ["school.view", "student.manage", "teacher.manage", "parent.manage", "dashboard.view"],
        mustChangePassword: false,
      },
      { upsert: true, new: true }
    );

    // 2. Create Principal record in MongoDB
    const newPrincipal = await Principal.create({
      principalId: finalPrincipalId,
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
      loginPassword: userPassword,
    });
  } catch (error) {
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
    const item = await Principal.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Principal not found" });
    if (item.email) {
      await User.deleteMany({ email: item.email.toLowerCase() });
    }
    res.json({ message: "Principal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting principal", error: error.message });
  }
};
