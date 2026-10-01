import { Class } from "../models/Class.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ standard: 1, section: 1 });
    return res.json(classes || []);
  } catch (error) {
    console.error("Get Classes Error:", error);
    return res.status(500).json({ message: "Failed to fetch classes", error: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });
    return res.json(cls);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch class", error: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    return res.status(201).json(newClass);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create class", error: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update class", error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    return res.json({ message: "Class deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete class", error: error.message });
  }
};

