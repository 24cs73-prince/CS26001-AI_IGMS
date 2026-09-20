import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    roll: { type: Number },
    className: { type: String, required: true },
    section: { type: String, default: "A" },
    gender: { type: String },
    guardian: { type: String },
    phone: { type: String },
    email: { type: String },
    attendance: { type: Number, default: 90 },
    average: { type: Number, default: 80 },
    status: { type: String, default: "Active" },
    admissionDate: { type: String },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
