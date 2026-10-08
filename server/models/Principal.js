import mongoose from "mongoose";

const principalSchema = new mongoose.Schema(
  {
    principalId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    schoolName: { type: String, required: true },
    district: { type: String, default: "Gandhinagar" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "+91 98765 43210" },
    udise: { type: String, default: "24070100101" },
    status: { type: String, default: "Active" },
    appointedDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    studentsCount: { type: Number, default: 420 },
    teachersCount: { type: Number, default: 18 },
  },
  { timestamps: true }
);

export const Principal = mongoose.model("Principal", principalSchema);
