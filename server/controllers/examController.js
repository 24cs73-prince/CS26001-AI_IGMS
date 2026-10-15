import mongoose from "mongoose";
import { Exam } from "../models/Exam.js";
import { Submission } from "../models/Submission.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";
import { schoolScope } from "../middleware/authMiddleware.js";

const examForUser = (exam, user) => {
  const result = exam.toObject();
  if (user?.roleKey === "student") {
    result.questions = result.questions.map(({ correctAnswer, ...question }) => question);
  }
  return result;
};

export const canManageExam = (exam, user) =>
  user?.roleKey !== "teacher" ||
  (exam.createdBy && String(exam.createdBy) === String(user._id));

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

    const schoolId = req.user.roleKey === "super_admin" ? req.body.school_id : req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: "A school must be assigned before creating an exam." });
    }

    const examPayload = {
      school_id: schoolId,
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

    res.status(201).json(exam);
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ message: "Server error creating exam." });
  }
};

/**
 * @desc    Get List of Exams with Search & Pagination
 * @route   GET /api/exams
 */
export const getExams = async (req, res) => {
  try {
    const searchFields = ["title", "subject", "classVal"];
    if (req.user?.roleKey === "student" && !req.user.classVal) {
      return res.status(403).json({ message: "Student class is not configured." });
    }

    const isStudent = req.user?.roleKey === "student";
    const queryParams = {
      ...req.query,
      ...(isStudent
        ? { classVal: req.user.classVal, status: "Published" }
        : {}),
    };
    const baseFilter = {
      ...schoolScope(req),
      ...(isStudent
        ? {
            classVal: req.user.classVal,
            status: "Published",
            startDate: { $lte: new Date() },
            $and: [
              {
                $or: [
                  { endDate: { $exists: false } },
                  { endDate: null },
                  { endDate: { $gte: new Date() } },
                ],
              },
            ],
          }
        : {}),
    };

    const result = await applyQueryFeatures(Exam, queryParams, searchFields, baseFilter);
    res.json(result.data.map((exam) => examForUser(exam, req.user)));
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
    const exam = await Exam.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    if (req.user?.roleKey === "student") {
      const now = new Date();
      if (
        exam.status !== "Published" ||
        String(exam.classVal) !== String(req.user.classVal) ||
        (exam.startDate && now < exam.startDate) ||
        (exam.endDate && now > exam.endDate)
      ) {
        return res.status(404).json({ message: "Exam not found." });
      }
    }

    res.json(examForUser(exam, req.user));
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
    const exam = await Exam.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }

    exam.status = "Published";
    await exam.save();

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
    const exam = await Exam.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (await Submission.exists({ examId: exam._id })) {
      return res.status(409).json({ message: "An exam with submissions cannot be modified." });
    }

    const allowedFields = [
      "title",
      "classVal",
      "subject",
      "syllabus",
      "duration",
      "durationMinutes",
      "totalQuestions",
      "totalMarks",
      "startDate",
      "endDate",
      "questions",
      "status",
    ];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        exam[field] = req.body[field];
      }
    }
    await exam.save();

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
    const exam = await Exam.findOne({ _id: req.params.id, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }

    if (await Submission.exists({ examId: exam._id })) {
      return res.status(409).json({ message: "An exam with submissions cannot be deleted." });
    }

    await exam.deleteOne();

    res.json({ message: "Exam deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting exam." });
  }
};
