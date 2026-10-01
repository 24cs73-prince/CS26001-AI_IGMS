import mongoose from "mongoose";

const mealMenuSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: "school-001",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 6, // 1 = Monday, ..., 6 = Saturday
    },
    dayName: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
    },
    snack: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
    },
    meal: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
    },
    time: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
    },
    mealStartTime: {
      type: String,
      default: "13:30",
    },
    mealEndTime: {
      type: String,
      default: "14:00",
    },
    snackStartTime: {
      type: String,
      default: "10:30",
    },
    snackEndTime: {
      type: String,
      default: "11:00",
    },
    tag: {
      en: { type: String, default: "Nutritious Diet" },
      gu: { type: String, default: "પૌષ્ટિક આહાર" },
    },
    academicYear: {
      type: String,
      default: "2025-26",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

mealMenuSchema.index({ schoolId: 1, dayOfWeek: 1, academicYear: 1 }, { unique: true });

export const MealMenu = mongoose.model("MealMenu", mealMenuSchema);
