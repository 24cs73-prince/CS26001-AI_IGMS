import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: "school-001",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    className: {
      type: String,
      required: true, // e.g. "Class 5" or "Class 6"
    },
    section: {
      type: String,
      default: "A",
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 6, // 1 = Monday, ..., 6 = Saturday
    },
    dayName: {
      en: { type: String, default: "Monday" },
      gu: { type: String, default: "સોમવાર" },
    },
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    subjectName: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teacherName: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // e.g. "08:00 AM"
    },
    endTime: {
      type: String,
      required: true, // e.g. "08:45 AM"
    },
    room: {
      type: String,
      default: "Room 101",
    },
    academicYear: {
      type: String,
      default: "2025-26",
    },
  },
  { timestamps: true }
);

timetableSchema.index(
  { schoolId: 1, className: 1, section: 1, dayOfWeek: 1, period: 1 },
  { unique: true }
);

export const Timetable = mongoose.model("Timetable", timetableSchema);
