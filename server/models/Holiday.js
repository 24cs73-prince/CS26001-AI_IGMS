import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: "school-001",
    },
    date: {
      type: String,
      required: true, // "YYYY-MM-DD" e.g. "2025-10-20"
    },
    title: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
    },
    description: {
      type: String,
      default: "",
    },
    holidayType: {
      type: String,
      enum: ["Public Holiday", "Vacation", "Emergency Closure", "Sunday Holiday"],
      default: "Public Holiday",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

holidaySchema.index({ schoolId: 1, date: 1 }, { unique: true });

export const Holiday = mongoose.model("Holiday", holidaySchema);
