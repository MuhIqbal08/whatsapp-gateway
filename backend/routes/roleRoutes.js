import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getProfile } from "../controllers/userController.js";
import { createRole } from "../controllers/roleController.js";

const router = express.Router();

router.get("/roles", authenticate, authorize("manage_roles"), getProfile);
router.post("/roles", authenticate, authorize("manage_roles"), createRole);

export default router;
