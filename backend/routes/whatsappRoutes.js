import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  deleteDevice,
  getDevices,
  registerDevice,
  sendMessage,
} from "../controllers/whatsappController.js";
import { connectToWhatsAppWithId } from "../whatsapp/connection.js";

const router = express.Router();
router.post("/device", authenticate, authorize("send_message"), registerDevice);

router.get("/device", authenticate, authorize("send_message"), getDevices);

router.delete(
  "/device/:id",
  authenticate,
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

router.post("/send", authenticate, authorize("send_message"), sendMessage);

export default router;