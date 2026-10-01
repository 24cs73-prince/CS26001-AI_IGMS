import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: "school-001",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameGu: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    applicableStandards: [{
      type: Number,
    }],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

subjectSchema.index({ schoolId: 1, code: 1 }, { unique: true });

export const Subject = mongoose.model("Subject", subjectSchema);
