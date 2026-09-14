import express from "express";
import { uploadMarks, getMarks } from "../controllers/markController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getMarks)
  .post(protect, protectRoles(["teacher", "principal"]), uploadMarks);

export default router;
