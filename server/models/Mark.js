import mongoose from "mongoose";

const markRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  marksObtained: { type: Number, required: true, default: 0 },
  maxMarks: { type: Number, required: true, default: 100 },
  grade: { type: String, default: "A" },
  remarks: { type: String, default: "Good performance" },
});

const markSchema = new mongoose.Schema(
  {
    school_id: { type: String, required: true, default: "school-001" },
    classVal: { type: String, required: true },
    division: { type: String, required: true, default: "A" },
    subject: { type: String, required: true },
    examTerm: { type: String, required: true, default: "Mid-Term 2026" },
    maxMarks: { type: Number, default: 100 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    records: [markRecordSchema],
  },
  { timestamps: true }
);

export const Mark = mongoose.model("Mark", markSchema);
