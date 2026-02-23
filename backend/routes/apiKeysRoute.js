import express from "express";
import { authenticate, authMiddleware } from "../middleware/authMiddleware.js";
// import { authorize } from "../middleware/roleMiddleware.js";
import { createApiKey, getApiKey, revokeApiKey, rotateApiKey } from "../controllers/apiKeyController.js";

const router = express.Router();

router.post("/keys", authMiddleware, createApiKey);
router.get("/keys", authMiddleware, getApiKey);
router.post("/keys/:id/revoke", authMiddleware, revokeApiKey);
router.post("/keys/:id/rotate", authMiddleware, rotateApiKey);

export default router;