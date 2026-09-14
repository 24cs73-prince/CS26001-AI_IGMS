import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index 0, 1, 2, 3
  marks: { type: Number, default: 1 },
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    classVal: { type: String, required: true }, // Class "1" to "8"
    subject: { type: String, required: true, trim: true },
    syllabus: { type: String, required: true },
    duration: { type: String, default: "30 minutes" },
    durationMinutes: { type: Number, default: 30 },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Published", "Completed"],
      default: "Published",
    },
    resultsStatus: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    evaluationCompleted: { type: Boolean, default: false },
    submissionsCount: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 40 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
