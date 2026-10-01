import { Timetable } from "../models/Timetable.js";

export const getTimetable = async (req, res) => {
  try {
    const { className, section, dayOfWeek } = req.query;
    const filter = {};
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
    const slot = new Timetable(req.body);
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Failed to create timetable slot", error: error.message });
  }
};

export const updateTimetableSlot = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Slot not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update slot", error: error.message });
  }
};

export const deleteTimetableSlot = async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Slot not found" });
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete slot", error: error.message });
  }
};
