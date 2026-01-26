import express from "express";
import { register, login, setPhoneNumber, googleLogin, logout, getMe } from "../controllers/authController.js";
import { authenticate, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setPhoneNumber", authMiddleware, setPhoneNumber);
router.get("/me", authMiddleware, getMe);
router.post("/google", googleLogin)
router.post("/logout", authMiddleware, logout);

export default router;
