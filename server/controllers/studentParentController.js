import { StudentParent } from "../models/StudentParent.js";
import { Student } from "../models/Student.js";
import { Parent } from "../models/Parent.js";

export const getStudentParents = async (req, res) => {
  try {
    const list = await StudentParent.find()
      .populate("parentId")
      .populate("parentUserId", "name email");
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch relationships", error: error.message });
  }
};

export const linkStudentParent = async (req, res) => {
  try {
    const { studentId, parentId, relationship, isPrimary } = req.body;
    
    // Check if parent exists
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    // Link
    const link = await StudentParent.findOneAndUpdate(
      { studentId, parentId },
      {
        studentId,
        parentId,
        parentUserId: parent.userId,
        relationship: relationship || "Guardian",
        isPrimary: isPrimary !== undefined ? isPrimary : true,
      },
      { upsert: true, new: true }
    );

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: "Failed to link student and parent", error: error.message });
  }
};

export const unlinkStudentParent = async (req, res) => {
  try {
    const { id } = req.params;
    await StudentParent.findByIdAndDelete(id);
    res.json({ message: "Relationship unlinked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlink", error: error.message });
  }
};
