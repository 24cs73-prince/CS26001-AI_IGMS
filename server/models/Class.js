import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: "school-001",
      required: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    standard: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      required: true,
      default: "A",
      trim: true,
    },
    academicYear: {
      type: String,
      default: "2025-26",
    },
    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    classTeacherName: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      default: 40,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate class sections in the same academic year
classSchema.index({ schoolId: 1, standard: 1, section: 1, academicYear: 1 }, { unique: true });

export const Class = mongoose.model("Class", classSchema);
