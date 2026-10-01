import mongoose from "mongoose";

const studentParentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      ref: "Student",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },
    parentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relationship: {
      type: String,
      enum: ["Father", "Mother", "Guardian", "Other"],
      default: "Guardian",
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate relations
studentParentSchema.index({ studentId: 1, parentId: 1 }, { unique: true });

export const StudentParent = mongoose.model("StudentParent", studentParentSchema);
