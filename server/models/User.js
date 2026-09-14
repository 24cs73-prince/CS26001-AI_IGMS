import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roleKey: {
      type: String,
      enum: ["super_admin", "principal", "teacher", "student", "parent"],
      required: true,
    },
    role: { type: String, required: true }, // Display name e.g. "Super Admin", "Teacher"
    org: { type: String, default: "Directorate of School Education" },
    school_id: { type: String, default: null },
    schoolName: { type: String, default: null },
    classVal: { type: String, default: null }, // e.g. "10", "5"
    division: { type: String, default: "A" },
    studentId: { type: String, default: null }, // e.g. "ST001"
    childStudentId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    permissions: [{ type: String }],
    home: { type: String, default: "/dashboard" },
  },
  { timestamps: true }
);

// Method to verify password hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Check bcrypt hash
  try {
    const match = await bcrypt.compare(enteredPassword, this.passwordHash);
    if (match) return true;
  } catch (err) {
    // Fallback base64 check for legacy seed
  }
  
  try {
    const base64Hash = btoa(String(enteredPassword));
    return base64Hash === this.passwordHash;
  } catch (err) {
    return false;
  }
};

export const User = mongoose.model("User", userSchema);
