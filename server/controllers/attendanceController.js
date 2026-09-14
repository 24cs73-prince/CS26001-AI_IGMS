import { Attendance } from "../models/Attendance.js";

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
