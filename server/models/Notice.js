import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    school_id: { type: String, default: "school-001" },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Academic", "Examination", "Administrative", "Event", "General"],
      default: "General",
    },
    audience: {
      type: String,
      enum: ["All", "Teachers", "Students", "Parents"],
      default: "All",
    },
    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },
    content: { type: String, required: true },
    publishedBy: { type: String, default: "School Principal Office" },
  },
  { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);
