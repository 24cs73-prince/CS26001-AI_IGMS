import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import config from '../config/index.js';

/**
 * Protect middleware — verifies JWT from the Authorization header,
 * attaches the decoded user to `req.user`.
 */
const protect = async (req, _res, next) => {
  try {
    let token;

    // Accept: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Not authenticated — token missing.');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Fetch user (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Contact an administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired — please login again.'));
    }
    next(error);
  }
};

export default protect;
