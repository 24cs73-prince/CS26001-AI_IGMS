import { Holiday } from "../models/Holiday.js";
import { schoolScope } from "../middleware/authMiddleware.js";

export const getHolidays = async (req, res) => {
  try {
    const requestedSchoolId = typeof req.query.schoolId === "string" ? req.query.schoolId : undefined;
    const schoolId = req.user?.school_id || requestedSchoolId || "SCH-001";
    const holidays = await Holiday.find({ schoolId, isActive: true }).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holidays", error: error.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) return res.status(400).json({ message: "A school must be assigned before creating a holiday." });
    const holiday = new Holiday({
      ...req.body,
      schoolId,
      createdBy: req.user?._id,
    });
    await holiday.save();
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: "Failed to create holiday", error: error.message });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.roleKey !== "super_admin") delete updates.schoolId;
    const updated = await Holiday.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Holiday not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update holiday", error: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const deleted = await Holiday.findOneAndDelete({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!deleted) return res.status(404).json({ message: "Holiday not found" });
    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete holiday", error: error.message });
  }
};
