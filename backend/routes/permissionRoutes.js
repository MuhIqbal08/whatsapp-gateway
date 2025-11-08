import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createPermission,
  getAllPermissions,
} from "../controllers/permissionController.js";

const router = express.Router();

router.get(
  "/permissions",
  authenticate,
  authorize("manage_permissions"),
  getAllPermissions
);

router.post(
  "/permissions",
  authenticate,
  authorize("manage_permissions"),
  createPermission
);

export default router;
