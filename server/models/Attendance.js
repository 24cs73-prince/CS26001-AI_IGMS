import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent", "Late"], default: "Present" },
  remarks: { type: String, default: "" },
});

const attendanceSchema = new mongoose.Schema(
  {
    school_id: { type: String, required: true, default: "school-001" },
    classVal: { type: String, required: true },
    division: { type: String, required: true, default: "A" },
    date: { type: String, required: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    records: [attendanceRecordSchema],
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
