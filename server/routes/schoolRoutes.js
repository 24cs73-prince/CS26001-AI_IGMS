import express from "express";
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  getSchoolRoster,
} from "../controllers/schoolController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSchools)
  .post(createSchool);

router.route("/:id")
  .get(getSchoolById)
  .patch(updateSchool);

router.get("/:id/roster", getSchoolRoster);

export default router;
