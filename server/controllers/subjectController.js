import { Subject } from "../models/Subject.js";
import { schoolScope } from "../middleware/authMiddleware.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find(schoolScope(req, "schoolId")).sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subject", error: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) return res.status(400).json({ message: "A school must be assigned before creating a subject." });
    const subject = new Subject({
      ...req.body,
      schoolId,
    });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Failed to create subject", error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.roleKey !== "super_admin") delete updates.schoolId;
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Failed to update subject", error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subject", error: error.message });
  }
};
