import { Submission } from "../models/Submission.js";
import { Exam } from "../models/Exam.js";
import { evaluateStudentQuiz } from "../utils/gradingEngine.js";
import { generateResultsCSV } from "../utils/exportExcel.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";

/**
 * @desc    Submit Student Quiz & Auto-Grade
 * @route   POST /api/exams/:id/submit
 */
export const submitQuiz = async (req, res) => {
  try {
    const examId = req.params.id;
    const { studentId = "ST001", studentName = "Rahul Patel", answers = {} } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Auto-grade quiz using evaluation engine
    const evalResults = evaluateStudentQuiz(exam.questions, answers);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Update or create submission
    let submission = await Submission.findOne({ examId, studentId });

    if (submission) {
      submission.answers = answers;
      submission.submittedAt = timeStr;
      submission.evaluated = false;
      Object.assign(submission, evalResults);
      await submission.save();
    } else {
      submission = await Submission.create({
        examId,
        studentId,
        studentName,
        classVal: exam.classVal,
        division: "A",
        submittedAt: timeStr,
        answers,
        evaluated: false,
        ...evalResults,
      });

      // Update submissions count on exam
      exam.submissionsCount = (exam.submissionsCount || 0) + 1;
      await exam.save();
    }

    res.status(201).json(submission);
  } catch (error) {
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
    const filter = { examId };

    const searchFields = ["studentName", "studentId"];
    const result = await applyQueryFeatures(
      Submission,
      { ...req.query, ...filter },
      searchFields
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
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
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
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
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
    const exam = await Exam.findById(examId);
    const submissions = await Submission.find({ examId });

    const csvFile = generateResultsCSV(exam?.title, submissions);

    res.setHeader("Content-Type", csvFile.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${csvFile.filename}"`);
    res.status(200).send(csvFile.data);
  } catch (error) {
    res.status(500).json({ message: "Server error generating CSV export." });
  }
};
