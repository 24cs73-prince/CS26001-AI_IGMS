import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    schoolId: { type: String, default: "school-001" },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
    rollNumber: { type: Number },
    roll: { type: Number }, // legacy alias
    firstName: { type: String, trim: true },
    middleName: { type: String, default: "", trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, required: true, trim: true }, // full name e.g. "Aarav Sharma"
    className: { type: String, required: true }, // e.g. "Class 6" or "5"
    section: { type: String, default: "A" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    guardian: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    dateOfBirth: { type: String },
    admissionDate: { type: String, default: "2022-04-10" },
    attendance: { type: Number, default: 90 },
    average: { type: Number, default: 80 },
    status: { type: String, enum: ["Active", "Inactive", "Transferred"], default: "Active" },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);

