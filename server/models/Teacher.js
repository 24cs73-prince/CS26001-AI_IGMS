import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String },
    subject: { type: String },
    experience: { type: Number, default: 5 },
    email: { type: String },
    phone: { type: String },
    classes: [{ type: String }],
    status: { type: String, default: "Active" },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
