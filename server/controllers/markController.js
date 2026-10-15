import { Mark } from "../models/Mark.js";
import { Parent } from "../models/Parent.js";
import { StudentParent } from "../models/StudentParent.js";
import { Student } from "../models/Student.js";
import { schoolScope } from "../middleware/authMiddleware.js";

/**
 * @desc    Upload / Update Subject Marks
 * @route   POST /api/marks
 */
export const uploadMarks = async (req, res) => {
  try {
    const { classVal, division, subject, examTerm, maxMarks, records } = req.body;

    if (!classVal || !subject || !Array.isArray(records)) {
      return res.status(400).json({ message: "Class, subject, and student mark records are required." });
    }
    const schoolId = req.user.roleKey === "super_admin" ? req.body.school_id : req.user.school_id;
    const studentIds = [...new Set(records.map(({ studentId }) => studentId).filter(Boolean))];
    if (!schoolId || studentIds.length !== records.length) {
      return res.status(400).json({ message: "A school and valid student IDs are required." });
    }
    const validStudents = await Student.find({ schoolId, studentId: { $in: studentIds } }).select("studentId");
    if (validStudents.length !== studentIds.length) {
      return res.status(403).json({ message: "Marks can only be uploaded for students in this school." });
    }

    let markDoc = await Mark.findOne({
      ...schoolScope(req),
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
        school_id: schoolId,
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

    let allowedStudentIds = null;
    if (req.user?.roleKey === "student") {
      allowedStudentIds = req.user.studentId ? [req.user.studentId] : [];
    } else if (req.user?.roleKey === "parent") {
      const parent = await Parent.findOne({ userId: req.user._id, schoolId: req.user.school_id });
      const links = parent ? await StudentParent.find({ parentId: parent._id }) : [];
      allowedStudentIds = links.map((link) => link.studentId);
      if (req.user.childStudentId) {
        allowedStudentIds.push(req.user.childStudentId);
      }
    }

    if (allowedStudentIds && studentId && !allowedStudentIds.includes(studentId)) {
      return res.status(403).json({
        message: "Access forbidden. You can only view marks for your own record or linked children.",
      });
    }
    if (allowedStudentIds && allowedStudentIds.length === 0) {
      return res.json([]);
    }

    const filter = schoolScope(req);
    if (classVal) filter.classVal = String(classVal);
    if (subject) filter.subject = subject;
    if (examTerm) filter.examTerm = examTerm;
    if (allowedStudentIds) {
      filter["records.studentId"] = studentId || { $in: allowedStudentIds };
    }

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

    if (allowedStudentIds) {
      return res.json(marksList.map((mark) => {
        const scopedMark = mark.toObject();
        scopedMark.records = scopedMark.records.filter((record) =>
          allowedStudentIds.includes(record.studentId)
        );
        return scopedMark;
      }));
    }

    res.json(marksList);
  } catch (error) {
    console.error("Get Marks Error:", error);
    res.status(500).json({ message: "Server error fetching marks." });
  }
};
