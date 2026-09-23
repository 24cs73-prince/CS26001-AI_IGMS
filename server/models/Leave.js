import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    school_id: { type: String, default: "school-001" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ["Casual Leave", "Sick Leave", "Duty Leave", "Earned Leave"],
      default: "Casual Leave",
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, default: 1 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
