import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { sendMessage } from "../controllers/whatsappController.js";

const router = express.Router();

router.post("/send", authenticate, authorize("send_message"), sendMessage);

export default router;
