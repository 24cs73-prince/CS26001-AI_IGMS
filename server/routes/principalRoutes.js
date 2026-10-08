import express from "express";
import {
  getPrincipals,
  createPrincipal,
  deletePrincipal,
} from "../controllers/principalController.js";

const router = express.Router();

router.route("/").get(getPrincipals).post(createPrincipal);
router.route("/:id").delete(deletePrincipal);

export default router;
