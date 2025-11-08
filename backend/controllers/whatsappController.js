import { getSocket } from "../whatsapp/connection.js";
import db from "../models/index.js";

const { WhatsAppDevice, WhatsAppMessage } = db;

export const registerDevice = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const userId = req.user.id;

    const device = await WhatsAppDevice.create({
      userId,
      name,
      phoneNumber,
      isActive: true,
    });

    res.status(201).json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    const devices = await WhatsAppDevice.findAll({ where: { userId } });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { deviceId, number, message, userId } = req.body;
    const sock = getSocket(deviceId);

    if (!sock) return res.status(400).json({ error: "Device not connected" });

    const jid = number.includes("@s.whatsapp.net")
      ? number
      : `${number}@s.whatsapp.net`;

    const record = await WhatsAppMessage.create({
      userId,
      deviceId,
      content: message,
      sender: "me",
      recipient: number,
      status: "pending",
    });

    await sock.sendMessage(jid, { text: message });
    await record.update({ status: "sent" });

    res.json({ success: true, message: "Message sent!", data: record });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: err.message });
  }
};
