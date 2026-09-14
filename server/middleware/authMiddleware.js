import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * JWT Authentication Middleware
 * Protects endpoints and attaches authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token && token !== "undefined" && token !== "null") {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "igms_jwt_secret_key_2024_change_in_production");
        req.user = await User.findById(decoded.id).select("-passwordHash");
        if (req.user) {
          return next();
        }
      }
    } catch (error) {
      console.warn("JWT Verification Warning (using dev fallback):", error.message);
    }
  }

  // Development mode: Fallback to default teacher account so ALL browser operations save directly to MongoDB
  if (process.env.NODE_ENV === "development") {
    try {
      const defaultTeacher = await User.findOne({ roleKey: "teacher" });
      if (defaultTeacher) {
        req.user = defaultTeacher;
        return next();
      }
    } catch (err) {
      console.warn("Dev mode fallback user error:", err.message);
    }
  }

  return res.status(401).json({ message: "Not authorized. No token provided." });
};


/**
 * Role Guards Middleware
 * Restricts access to specific role keys e.g. protectRoles(["teacher", "principal"])
 */
export const protectRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.roleKey)) {
      return res.status(403).json({
        message: `Forbidden. Role '${req.user?.roleKey}' does not have permission for this resource.`,
      });
    }
    next();
  };
};
