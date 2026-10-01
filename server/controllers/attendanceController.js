import { Attendance } from "../models/Attendance.js";
import { Parent } from "../models/Parent.js";
import { StudentParent } from "../models/StudentParent.js";

/**
 * @desc    Record / Update Class Attendance
 * @route   POST /api/attendance
 */
export const recordAttendance = async (req, res) => {
  try {
    const { school_id, classVal, division, date, records } = req.body;

    if (!classVal || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Class, date, and attendance records are required." });
    }

    let attendance = await Attendance.findOne({
      school_id: school_id || "school-001",
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
        school_id: school_id || "school-001",
        classVal: String(classVal),
        division: division || "A",
        date,
        recordedBy: req.user?._id,
        records,
      });
    }

    res.status(200).json({
      message: "Attendance recorded successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Record Attendance Error:", error);
    res.status(500).json({ message: "Server error recording attendance." });
  }
};

/**
 * @desc    Get Attendance Records by Class / Date / Student
 * @route   GET /api/attendance
 */
export const getAttendance = async (req, res) => {
  try {
    const { classVal, division, date, studentId } = req.query;

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
          message: "Access forbidden. Parents can only view attendance for their linked children.",
        });
      }
    }

    const filter = {};
    if (classVal) filter.classVal = String(classVal);
    if (division) filter.division = division;
    if (date) filter.date = date;

    const list = await Attendance.find(filter).sort({ date: -1 });

    if (studentId) {
      const studentHistory = list.map((a) => {
        const rec = a.records.find((r) => r.studentId === studentId);
        return {
          date: a.date,
          classVal: a.classVal,
          division: a.division,
          status: rec ? rec.status : "Present",
          remarks: rec ? rec.remarks : "",
        };
      });

      const totalDays = studentHistory.length || 1;
      const presentCount = studentHistory.filter((h) => h.status === "Present").length;
      const percentage = Math.round((presentCount / totalDays) * 100);

      return res.json({
        studentId,
        percentage,
        totalDays,
        presentCount,
        history: studentHistory,
      });
    }

    res.json(list);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Server error fetching attendance records." });
  }
};
