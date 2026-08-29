import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: ['super_admin', 'principal', 'teacher', 'student', 'parent'],
      required: [true, 'Role is required'],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },

    // ── Role-specific links ──────────────────────────────────
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    // For parent → children mapping
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // For student → class/section
    class_name: { type: String, default: '' },
    section: { type: String, default: '' },
    roll_no: { type: String, default: '' },

    // For teacher → subjects & classes they teach
    subjects: [{ type: String }],
    classes_assigned: [{ type: String }],

    // ── Account status ───────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ── Index for fast lookups ─────────────────────────────────────
userSchema.index({ role: 1, school_id: 1 });

// ── Hash password before save ──────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare password method ────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Strip password from JSON output ────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
