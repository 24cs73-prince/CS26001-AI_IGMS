import { Class } from "../models/Class.js";
import { schoolScope } from "../middleware/authMiddleware.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find(schoolScope(req, "schoolId")).sort({ standard: 1, section: 1 });
    return res.json(classes || []);
  } catch (error) {
    console.error("Get Classes Error:", error);
    return res.status(500).json({ message: "Failed to fetch classes", error: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    return res.json(cls);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch class", error: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) return res.status(400).json({ message: "A school must be assigned before creating a class." });
    const newClass = new Class({
      ...req.body,
      schoolId,
    });
    await newClass.save();
    return res.status(201).json(newClass);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create class", error: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.roleKey !== "super_admin") delete updates.schoolId;
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Class not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update class", error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    return res.json({ message: "Class deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete class", error: error.message });
  }
};
