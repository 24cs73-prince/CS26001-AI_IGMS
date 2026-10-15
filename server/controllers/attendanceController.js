import { Attendance } from "../models/Attendance.js";
import { Parent } from "../models/Parent.js";
import { StudentParent } from "../models/StudentParent.js";
import { Student } from "../models/Student.js";
import { schoolScope } from "../middleware/authMiddleware.js";

/**
 * @desc    Record / Update Class Attendance
 * @route   POST /api/attendance
 */
export const recordAttendance = async (req, res) => {
  try {
    const { classVal, division, date, records } = req.body;

    if (!classVal || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Class, date, and attendance records are required." });
    }
    const schoolId = req.user.roleKey === "super_admin" ? req.body.school_id : req.user.school_id;
    const studentIds = [...new Set(records.map(({ studentId }) => studentId).filter(Boolean))];
    if (!schoolId || studentIds.length !== records.length) {
      return res.status(400).json({ message: "A school and valid student IDs are required." });
    }
    const validStudents = await Student.find({ schoolId, studentId: { $in: studentIds } }).select("studentId");
    if (validStudents.length !== studentIds.length) {
      return res.status(403).json({ message: "Attendance can only be recorded for students in this school." });
    }

    let attendance = await Attendance.findOne({
      ...schoolScope(req),
      classVal: String(classVal),
      division: division || "A",
      date,
    });

    if (attendance) {
      attendance.records = records;
      attendance.recordedBy = req.user?._id;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        school_id: schoolId,
        classVal: String(classVal),
        division: division || "A",
        date,
        recordedBy: req.user?._id,
        records,
      });
    }

    return res.status(200).json({
      message: "Attendance recorded successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Record Attendance Error:", error);
    return res.status(500).json({ message: "Server error recording attendance.", error: error.message });
  }
};

/**
 * @desc    Get Attendance Records by Class / Date / Student
 * @route   GET /api/attendance
 */
export const getAttendance = async (req, res) => {
  try {
    const { classVal, division, date, studentId } = req.query;

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
        message: "Access forbidden. You can only view attendance for your own record or linked children.",
      });
    }
    if (allowedStudentIds && allowedStudentIds.length === 0) {
      return res.json([]);
    }

    const filter = schoolScope(req);
    if (classVal) filter.classVal = String(classVal);
    if (division) filter.division = division;
    if (date) filter.date = date;
    if (allowedStudentIds) {
      filter["records.studentId"] = studentId || { $in: allowedStudentIds };
    }

    const list = await Attendance.find(filter).sort({ date: -1 });

    if (studentId) {
      const studentHistory = (list || []).flatMap((a) => {
        const rec = (a.records || []).find((r) => r.studentId === studentId);
        return rec ? [{
          date: a.date,
          classVal: a.classVal,
          division: a.division,
          status: rec.status,
          remarks: rec.remarks || "",
        }] : [];
      });

      const totalDays = studentHistory.length;
      const presentCount = studentHistory.filter((h) => h.status === "Present").length;
      const percentage = totalDays ? Math.round((presentCount / totalDays) * 100) : null;

      return res.json({
        studentId,
        percentage,
        totalDays,
        presentCount,
        history: studentHistory,
      });
    }

    if (allowedStudentIds) {
      return res.json((list || []).map((attendance) => {
        const scopedAttendance = attendance.toObject();
        scopedAttendance.records = scopedAttendance.records.filter((record) =>
          allowedStudentIds.includes(record.studentId)
        );
        return scopedAttendance;
      }));
    }

    return res.json(list || []);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    return res.status(500).json({ message: "Server error fetching attendance records.", error: error.message });
  }
};
