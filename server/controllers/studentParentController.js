import { StudentParent } from "../models/StudentParent.js";
import { Student } from "../models/Student.js";
import { Parent } from "../models/Parent.js";

export const getStudentParents = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.query.schoolId : req.user.school_id;
    const students = await Student.find({ schoolId }).select("studentId");
    const list = await StudentParent.find({ studentId: { $in: students.map(({ studentId }) => studentId) } })
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
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    const student = await Student.findOne({ studentId, schoolId });
    if (!student) return res.status(404).json({ message: "Student not found in this school." });
    
    // Check if parent exists
    const parent = await Parent.findOne({ _id: parentId, schoolId });
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
    const link = await StudentParent.findById(id);
    if (!link) return res.status(404).json({ message: "Relationship not found." });
    const schoolId = req.user.roleKey === "super_admin" ? req.query.schoolId : req.user.school_id;
    const student = await Student.findOne({ studentId: link.studentId, schoolId });
    if (!student) return res.status(404).json({ message: "Relationship not found." });
    await link.deleteOne();
    res.json({ message: "Relationship unlinked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlink", error: error.message });
  }
};
