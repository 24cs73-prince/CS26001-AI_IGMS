import { Leave } from "../models/Leave.js";

/**
 * @desc    Apply for Teacher Leave
 * @route   POST /api/leave
 */
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Start date, end date, and reason are required." });
    }

    const leave = await Leave.create({
      teacherId: req.user?._id,
      teacherName: req.user?.name || "Dr. Meenakshi Iyer",
      leaveType: leaveType || "Casual Leave",
      startDate,
      endDate,
      totalDays: Number(totalDays) || 1,
      reason,
      status: "Pending",
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ message: "Server error submitting leave application." });
  }
};

/**
 * @desc    Get Leave Applications
 * @route   GET /api/leave
 */
export const getLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.user?.roleKey === "teacher") {
      filter.teacherId = req.user._id;
    }

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("Get Leaves Error:", error);
    res.status(500).json({ message: "Server error fetching leave applications." });
  }
};

/**
 * @desc    Approve / Reject Leave Application
 * @route   PATCH /api/leave/:id/status
 */
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave application not found." });
    }

    leave.status = status || "Approved";
    if (remarks) leave.remarks = remarks;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server error updating leave status." });
  }
};
