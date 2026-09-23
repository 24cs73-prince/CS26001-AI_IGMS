import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    udiseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Primary", "Upper Primary", "Secondary", "Higher Secondary"],
      default: "Higher Secondary",
    },
    address: {
      district: { type: String, default: "Ahmedabad" },
      state: { type: String, default: "Gujarat" },
      pincode: { type: String, default: "380001" },
    },
    principalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    activeTeachersCount: {
      type: Number,
      default: 15,
    },
    activeStudentsCount: {
      type: Number,
      default: 450,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending Review"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const School = mongoose.model("School", schoolSchema);
