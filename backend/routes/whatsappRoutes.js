import express from "express";
import { authenticate, authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  deleteDevice,
  getAllParticipatingGroups,
  getDevices,
  registerDevice,
  sendMessage,
  sendMessageGroup,
} from "../controllers/whatsappController.js";
import { connectToWhatsAppWithId } from "../whatsapp/connection.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = express.Router();
router.post("/device", authMiddleware, authorize("send_message"), registerDevice);

router.get("/device", authMiddleware, authorize("send_message"), getDevices);

router.delete(
  "/device/:id",
  authMiddleware,
  authorize("send_message"),
  deleteDevice
);

router.get("/connect/:id", async (req, res) => {
    try {
        await connectToWhatsAppWithId(req.params.id);
        res.json({ message: "Connecting..." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/send", authMiddleware, authorize("send_message"), sendMessage);
router.post("/send/group", authMiddleware, authorize("send_message"),  sendMessageGroup);
router.get('/participating/group/:deviceId', authMiddleware, authorize("send_message"), getAllParticipatingGroups);

export default router;