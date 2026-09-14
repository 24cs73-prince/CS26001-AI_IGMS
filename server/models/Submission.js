import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    classVal: { type: String },
    division: { type: String, default: "A" },
    submittedAt: { type: String },
    status: { type: String, default: "Submitted" },
    evaluated: { type: Boolean, default: false },
    obtainedMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    unansweredCount: { type: Number, default: 0 },
    performanceBadge: {
      type: String,
      enum: ["Outstanding", "Excellent", "Good", "Satisfactory", "Needs Improvement"],
      default: "Needs Improvement",
    },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { "1": 1, "2": 0 }
    aiFeedback: {
      overallPerformance: { type: String, default: "" },
      strengths: { type: String, default: "" },
      areasForImprovement: { type: String, default: "" },
      recommendation: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
