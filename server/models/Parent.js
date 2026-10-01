import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolId: {
      type: String,
      default: "school-001",
    },
    parentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      street: { type: String, default: "" },
      district: { type: String, default: "Ahmedabad" },
      state: { type: String, default: "Gujarat" },
      pincode: { type: String, default: "380001" },
    },
    occupation: {
      type: String,
      default: "Business / Professional",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Parent = mongoose.model("Parent", parentSchema);
