import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/index.js';

// ── Helper: generate JWT ──────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// ────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, school_id } = req.body;

  // Only super_admin can create principals; principals can create teachers/students/parents
  // (We'll enforce this in routes via authorize middleware)

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('A user with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    phone,
    school_id: school_id || null,
  });

  sendTokenResponse(user, 201, res);
});

// ────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password.');
  }

  // Explicitly select password (it has select: false on the schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact an administrator.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// ────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('school_id', 'name code');
  res.status(200).json({ success: true, user });
});

// ────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password
// ────────────────────────────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current and new passwords are required.');
  }

  if (newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters.');
  }

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect.');
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();

  sendTokenResponse(user, 200, res);
});
