import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getProfile, getUserByid, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authenticate, authorize("manage_users"), getProfile);
router.get("/users", getUsers);
router.get("/users/:id", getUserByid);

export default router;
