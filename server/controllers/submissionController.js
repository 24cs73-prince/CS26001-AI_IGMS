import { Submission } from "../models/Submission.js";
import { Exam } from "../models/Exam.js";
import { evaluateStudentQuiz } from "../utils/gradingEngine.js";
import { generateResultsCSV } from "../utils/exportExcel.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";
import { schoolScope } from "../middleware/authMiddleware.js";
import { canManageExam } from "./examController.js";

/**
 * @desc    Submit Student Quiz & Auto-Grade
 * @route   POST /api/exams/:id/submit
 */
export const submitQuiz = async (req, res) => {
  try {
    const examId = req.params.id;
    const studentId = req.user?.studentId;
    const studentName = req.user?.name;
    const answers = req.body.answers;

    if (!studentId) {
      return res.status(403).json({ message: "Student account is not linked to a student record." });
    }

    const userSchoolId = req.user?.school_id;
    const schoolFilter = req.user?.roleKey === "super_admin"
      ? {}
      : {
          $or: [
            ...(userSchoolId ? [{ school_id: userSchoolId }, { school_id: userSchoolId.toLowerCase() }, { school_id: userSchoolId.toUpperCase() }] : []),
            { school_id: "school-001" },
            { school_id: "SCH-001" },
            { school_id: null },
            { school_id: { $exists: false } },
            { school_id: "" },
            ...(req.user?._id ? [{ createdBy: req.user._id }] : []),
          ],
        };

    const exam = await Exam.findOne({ _id: examId, ...schoolFilter });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    if (exam.status !== "Published") {
      return res.status(403).json({ message: "This exam is not published." });
    }

    const questionById = new Map(exam.questions.map((question) => [String(question.id), question]));
    const invalidAnswer = Object.entries(answers).some(([questionId, selected]) => {
      const question = questionById.get(questionId);
      return !question ||
        !Number.isInteger(selected) ||
        selected < 0 ||
        selected >= question.options.length;
    });
    if (invalidAnswer) {
      return res.status(400).json({ message: "One or more answers are invalid." });
    }

    const existingSubmission = await Submission.findOne({ examId, studentId });
    if (existingSubmission) {
      return res.status(409).json({ message: "A submission already exists for this exam." });
    }

    // Auto-grade quiz using evaluation engine
    const evalResults = evaluateStudentQuiz(exam.questions, answers);

    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const submission = await Submission.create({
      examId,
      studentId,
      studentName,
      classVal: exam.classVal,
      division: req.user.division || "A",
      submittedAt: timeStr,
      answers,
      evaluated: false,
      ...evalResults,
    });

    await Exam.updateOne({ _id: examId }, { $inc: { submissionsCount: 1 } });

    res.status(201).json({
      message: "Exam submitted successfully.",
      submissionId: submission._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A submission already exists for this exam." });
    }
    console.error("Submit Quiz Error:", error);
    res.status(500).json({ message: "Server error submitting quiz response." });
  }
};

/**
 * @desc    Get All Student Submissions for an Exam
 * @route   GET /api/exams/:id/submissions
 */
export const getSubmissions = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findOne({ _id: examId, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    if (req.user?.roleKey === "student") {
      if (!req.user.studentId) {
        return res.status(403).json({ message: "Student account is not linked to a student record." });
      }
      if (exam.resultsStatus !== "PUBLISHED") {
        return res.json([]);
      }
      const submissions = await Submission.find({ examId, studentId: req.user.studentId });
      return res.json(submissions);
    }

    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }

    const filter = { examId };

    const searchFields = ["studentName", "studentId"];
    const result = await applyQueryFeatures(
      Submission,
      req.query,
      searchFields,
      filter
    );

    res.json(result.data);
  } catch (error) {
    console.error("Get Submissions Error:", error);
    res.status(500).json({ message: "Server error fetching submissions." });
  }
};

/**
 * @desc    Auto-Grade All Submissions for an Exam
 * @route   POST /api/exams/:id/evaluate
 */
export const evaluateAllSubmissions = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findOne({ _id: examId, ...schoolScope(req) });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (exam.resultsStatus === "PUBLISHED") {
      return res.status(409).json({ message: "Published exam results cannot be re-evaluated." });
    }

    const submissions = await Submission.find({ examId });

    // Auto-grade all submissions using server-side grading engine
    for (const sub of submissions) {
      const evalRes = evaluateStudentQuiz(exam.questions, sub.answers || {});
      Object.assign(sub, evalRes);
      sub.evaluated = true;
      await sub.save();
    }

    exam.evaluationCompleted = true;
    await exam.save();

    res.json({
      message: `Successfully evaluated ${submissions.length} student submissions.`,
      evaluatedCount: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Evaluate All Error:", error);
    res.status(500).json({ message: "Server error during evaluation." });
  }
};

/**
 * @desc    Publish Exam Results for Students
 * @route   PATCH /api/exams/:id/publish-results
 */
export const publishResults = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findOne({ _id: examId, ...schoolScope(req) });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!exam.evaluationCompleted) {
      return res.status(409).json({ message: "Evaluate the exam before publishing results." });
    }

    exam.resultsStatus = "PUBLISHED";
    await exam.save();

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error publishing results." });
  }
};

/**
 * @desc    Export Exam Results CSV / Spreadsheet File
 * @route   GET /api/exams/:id/export-csv
 */
export const exportResultsCSV = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findOne({ _id: examId, ...schoolScope(req) });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }
    if (!canManageExam(exam, req.user)) {
      return res.status(404).json({ message: "Exam not found." });
    }
    const submissions = await Submission.find({ examId });

    const csvFile = generateResultsCSV(exam?.title, submissions);

    res.setHeader("Content-Type", csvFile.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${csvFile.filename}"`);
    res.status(200).send(csvFile.data);
  } catch (error) {
    res.status(500).json({ message: "Server error generating CSV export." });
  }
};
