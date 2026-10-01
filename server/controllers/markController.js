import { Mark } from "../models/Mark.js";
import { Parent } from "../models/Parent.js";
import { StudentParent } from "../models/StudentParent.js";

/**
 * @desc    Upload / Update Subject Marks
 * @route   POST /api/marks
 */
export const uploadMarks = async (req, res) => {
  try {
    const { school_id, classVal, division, subject, examTerm, maxMarks, records } = req.body;

    if (!classVal || !subject || !Array.isArray(records)) {
      return res.status(400).json({ message: "Class, subject, and student mark records are required." });
    }

    let markDoc = await Mark.findOne({
      school_id: school_id || "school-001",
      classVal: String(classVal),
      division: division || "A",
      subject,
      examTerm: examTerm || "Mid-Term 2026",
    });

    if (markDoc) {
      markDoc.records = records;
      markDoc.uploadedBy = req.user?._id;
      await markDoc.save();
    } else {
      markDoc = await Mark.create({
        school_id: school_id || "school-001",
        classVal: String(classVal),
        division: division || "A",
        subject,
        examTerm: examTerm || "Mid-Term 2026",
        maxMarks: maxMarks || 100,
        uploadedBy: req.user?._id,
        records,
      });
    }

    res.status(200).json({
      message: "Marks uploaded successfully.",
      marks: markDoc,
    });
  } catch (error) {
    console.error("Upload Marks Error:", error);
    res.status(500).json({ message: "Server error uploading marks." });
  }
};

/**
 * @desc    Get Student Marks / Report Card
 * @route   GET /api/marks
 */
export const getMarks = async (req, res) => {
  try {
    const { classVal, subject, examTerm, studentId } = req.query;

    // Strict Parent-Child Access Isolation
    if (req.user && req.user.roleKey === "parent") {
      const parent = await Parent.findOne({ userId: req.user._id });
      let allowedStudentIds = [];
      if (parent) {
        const spLinks = await StudentParent.find({ parentId: parent._id });
        allowedStudentIds = spLinks.map((l) => l.studentId);
      }
      if (req.user.childStudentId) {
        allowedStudentIds.push(req.user.childStudentId);
      }
      if (studentId && !allowedStudentIds.includes(studentId)) {
        return res.status(403).json({
          message: "Access forbidden. Parents can only view marks for their linked children.",
        });
      }
    }

    const filter = {};
    if (classVal) filter.classVal = String(classVal);
    if (subject) filter.subject = subject;
    if (examTerm) filter.examTerm = examTerm;

    const marksList = await Mark.find(filter);

    if (studentId) {
      const studentReport = marksList.map((m) => {
        const rec = m.records.find((r) => r.studentId === studentId);
        return {
          subject: m.subject,
          examTerm: m.examTerm,
          maxMarks: m.maxMarks,
          marksObtained: rec ? rec.marksObtained : 0,
          grade: rec ? rec.grade : "N/A",
          remarks: rec ? rec.remarks : "",
        };
      });

      return res.json({
        studentId,
        reportCard: studentReport,
      });
    }

    res.json(marksList);
  } catch (error) {
    console.error("Get Marks Error:", error);
    res.status(500).json({ message: "Server error fetching marks." });
  }
};
