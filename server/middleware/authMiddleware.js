import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "ai_igms_super_secret_jwt_key_2026_secure";

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
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-passwordHash");
        if (req.user) {
          return next();
        }
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed or expired." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no authentication token provided." });
  }
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
