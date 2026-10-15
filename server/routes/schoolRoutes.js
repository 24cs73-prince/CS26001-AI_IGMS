import express from "express";
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  getSchoolRoster,
} from "../controllers/schoolController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSchools)
  .post(protect, protectRoles(["super_admin"]), createSchool);

router.route("/:id")
  .get(getSchoolById)
  .patch(protect, requireSchool, protectRoles(["super_admin", "principal"]), updateSchool);

router.get("/:id/roster", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), getSchoolRoster);

export default router;
