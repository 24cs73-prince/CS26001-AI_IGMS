import express from "express";
import { uploadMarks, getMarks } from "../controllers/markController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, requireSchool, getMarks)
  .post(protect, requireSchool, protectRoles(["teacher", "principal"]), uploadMarks);

export default router;
