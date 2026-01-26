import express from "express";
import { authenticate, authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { createApiKey, getApiKey, revokeApiKey, rotateApiKey } from "../controllers/apiKeyController.js";

const router = express.Router();

router.post("/api-keys", authMiddleware, authorize("send_message"), createApiKey);
router.get("/api-keys", authMiddleware, authorize("send_message"), getApiKey);
router.post("/api-keys/:id/revoke", authMiddleware, authorize("send_message"), revokeApiKey);
router.post("/api-keys/:id/rotate", authMiddleware, authorize("send_message"), rotateApiKey);

export default router;