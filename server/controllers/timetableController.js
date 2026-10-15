import { Timetable } from "../models/Timetable.js";
import { schoolScope } from "../middleware/authMiddleware.js";

export const getTimetable = async (req, res) => {
  try {
    const { className, section, dayOfWeek } = req.query;
    const filter = schoolScope(req, "schoolId");
    if (className) filter.className = className;
    if (section) filter.section = section;
    if (dayOfWeek) filter.dayOfWeek = Number(dayOfWeek);

    const items = await Timetable.find(filter).sort({ dayOfWeek: 1, period: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timetable", error: error.message });
  }
};

export const createTimetableSlot = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) return res.status(400).json({ message: "A school must be assigned before creating a timetable slot." });
    const slot = new Timetable({
      ...req.body,
      schoolId,
    });
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Failed to create timetable slot", error: error.message });
  }
};

export const updateTimetableSlot = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.roleKey !== "super_admin") delete updates.schoolId;
    const updated = await Timetable.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Slot not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update slot", error: error.message });
  }
};

export const deleteTimetableSlot = async (req, res) => {
  try {
    const deleted = await Timetable.findOneAndDelete({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!deleted) return res.status(404).json({ message: "Slot not found" });
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete slot", error: error.message });
  }
};
