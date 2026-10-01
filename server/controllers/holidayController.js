import { Holiday } from "../models/Holiday.js";

export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({ isActive: true }).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holidays", error: error.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const holiday = new Holiday({
      ...req.body,
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
    const updated = await Holiday.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Holiday not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update holiday", error: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const deleted = await Holiday.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Holiday not found" });
    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete holiday", error: error.message });
  }
};
