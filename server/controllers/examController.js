import mongoose from "mongoose";
import { Exam } from "../models/Exam.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";
import { writeDocToBothDatabases, deleteDocFromBothDatabases } from "../config/dualDbWriter.js";

/**
 * @desc    Create & Save New Exam (Instant Dual-Write to Atlas Cloud & Local Compass)
 * @route   POST /api/exams
 */
export const createExam = async (req, res) => {
  try {
    const {
      title,
      classVal,
      subject,
      syllabus,
      duration,
      durationMinutes,
      totalQuestions,
      totalMarks,
      startDate,
      endDate,
      questions,
      status,
    } = req.body;

    const cleanedQuestions = (questions || []).map((q, idx) => ({
      id: q.id || idx + 1,
      question: String(q.question || q.questionText || q.q || `Question ${idx + 1}`),
      options: Array.isArray(q.options) && q.options.length > 0 ? q.options.map(String) : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
      marks: Number(q.marks) || 1,
    }));

    const examPayload = {
      title: title || `${subject} Exam (Class ${classVal})`,
      classVal: String(classVal || "5"),
      subject: subject || "General",
      syllabus: syllabus || "Standard Curriculum",
      duration: duration || "30 minutes",
      durationMinutes: Number(durationMinutes) || 30,
      totalQuestions: Number(totalQuestions) || cleanedQuestions.length || 10,
      totalMarks: Number(totalMarks) || cleanedQuestions.length || 10,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 86400000 * 5),
      status: status === "Draft" ? "Draft" : "Published",
      resultsStatus: "DRAFT",
      questions: cleanedQuestions,
      ...(mongoose.isValidObjectId(req.user?._id) ? { createdBy: req.user._id } : {}),
    };

    const exam = await Exam.create(examPayload);

    // Instant parallel write to MongoDB Atlas Cloud & Local Compass
    await writeDocToBothDatabases("exams", exam.toObject());

    res.status(201).json(exam);
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ message: "Server error creating exam.", details: error.message });
  }
};

/**
 * @desc    Get List of Exams with Search & Pagination
 * @route   GET /api/exams
 */
export const getExams = async (req, res) => {
  try {
    const searchFields = ["title", "subject", "classVal"];
    const result = await applyQueryFeatures(Exam, req.query, searchFields);
    res.json(result.data);
  } catch (error) {
    console.error("Get Exams Error:", error);
    res.status(500).json({ message: "Server error fetching exams." });
  }
};

/**
 * @desc    Get Single Exam Details
 * @route   GET /api/exams/:id
 */
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching exam details." });
  }
};

/**
 * @desc    Publish Exam
 * @route   PATCH /api/exams/:id/publish
 */
export const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    exam.status = "Published";
    await exam.save();

    // Instant dual write to Atlas & Local
    await writeDocToBothDatabases("exams", exam.toObject());

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error publishing exam." });
  }
};

/**
 * @desc    Update Exam details or questions
 * @route   PUT /api/exams/:id
 */
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    Object.assign(exam, req.body);
    await exam.save();

    // Instant dual write to Atlas & Local
    await writeDocToBothDatabases("exams", exam.toObject());

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error updating exam." });
  }
};

/**
 * @desc    Delete Exam
 * @route   DELETE /api/exams/:id
 */
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    await exam.deleteOne();
    await deleteDocFromBothDatabases("exams", req.params.id);

    res.json({ message: "Exam deleted successfully from all databases." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting exam." });
  }
};
