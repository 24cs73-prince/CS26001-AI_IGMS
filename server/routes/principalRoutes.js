import express from "express";
import {
  getPrincipals,
  createPrincipal,
  deletePrincipal,
} from "../controllers/principalController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, requireSchool, protectRoles(["super_admin", "admin"]), getPrincipals)
  .post(protect, requireSchool, protectRoles(["super_admin", "admin"]), createPrincipal);
router
  .route("/:id")
  .delete(protect, requireSchool, protectRoles(["super_admin", "admin"]), deletePrincipal);

export default router;
