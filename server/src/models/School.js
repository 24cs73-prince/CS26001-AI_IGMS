import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'School code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },

    principal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // School stats (updated periodically)
    totalStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);



const School = mongoose.model('School', schoolSchema);
export default School;
