import express from "express";
import { authenticate, authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { dashboardAdmin, dashboardUser, getProfile, getUserByid, getUserForHeader, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authenticate, authorize("manage_users"), getProfile);
router.get("/users", authMiddleware, getUsers);
router.get("/id", authMiddleware, getUserForHeader);
router.get("/dashboard", authMiddleware, dashboardUser)
router.get("/dashboard/admin", authMiddleware, dashboardAdmin)
router.get("/users/:id", getUserByid);

export default router;
