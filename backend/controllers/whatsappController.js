import { success, error } from "../utils/response.js";
import db from "../models/index.js";
import { createDevice } from "../services/whatsappServices.js";
import {
  ensureConnected,
} from "../whatsapp/connection.js";

const { WhatsAppDevice, WhatsAppMessage } = db;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const registerDevice = async (req, res) => {
  try {
    console.log("API registerDevice dipanggil oleh user:", req.user?.id);
    const { name, phoneNumber } = req.body;
    const device = await createDevice(req.user.id, name, phoneNumber);
    success(res, device, "Device registered");
  } catch (err) {
    console.error("ERROR registerDevice:", err);
    error(res, err.message);
  }
};

export const getDevices = async (req, res) => {
  try {
    const devices = await WhatsAppDevice.findAll({
      where: { userId: req.user.id },
    });
    success(res, devices);
  } catch (error) {
    console.error(error);
    error(res, error.message);
  }
};

export const getMessageByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const {rows: messages, count: messagesCount} = await WhatsAppMessage.findAndCountAll({where: {status}});
    success(res, messages, messagesCount);
  } catch (error) {
    console.error(error);
    error(res, error.message);
  }
}

export const sendMessage = async (req, res) => {
  let messageLogs = [];

  try {
    const { deviceId, phoneNumber, message } = req.body;

    if (!deviceId || !phoneNumber || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    } 

    const numbers = Array.isArray(phoneNumber)
      ? phoneNumber
      : [phoneNumber];

    const cleanNumbers = numbers.map(n => {
      const clean = n.replace(/\D/g, "");
      if (clean.length < 10 || clean.length > 15) {
        throw new Error(`Invalid phone number: ${n}`);
      }
      return clean;
    });

    const device = await WhatsAppDevice.findByPk(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const sock = await ensureConnected(deviceId);
    if (!sock) {
      return res.status(500).json({ message: "Failed sending message" });
    }

    for (const number of cleanNumbers) {
      const jid = `${number}@s.whatsapp.net`;

      const messageLog = await WhatsAppMessage.create({
        deviceId,
        sender: device.phoneNumber || "",
        recipient: jid,
        content: message,
        status: "pending",
        userId: req.user.id,
        notes: "Queued",
      });

      messageLogs.push(messageLog);

      try {
        const result = await sock.sendMessage(jid, { text: message });

        await messageLog.update({
          status: "success",
          waMessageId: result.key.id,
          notes: "Message sent",
        });

      } catch (sendErr) {
        await messageLog.update({
          status: "failed",
          notes: sendErr.message,
        });
      }

      await delay(10_000);
    }

    return res.json({
      message: "Messages sent",
      total: messageLogs.length,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to send message",
      error: err.message,
    });
  }
};

export const sendMessageGroup = async (req, res) => {
  let messageLogs = [];

  try {
    const { deviceId, groupId, message } = req.body;

    if (!deviceId || !groupId || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const device = await WhatsAppDevice.findByPk(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ===== NORMALIZE GROUP IDS (PLUCK VERSION) =====
    const groupIds = Array.isArray(groupId) ? groupId : [groupId];

    // ===== GET SOCKET =====
    const sock = await ensureConnected(deviceId);

    for (const jid of groupIds) {
      // ===== CREATE LOG =====
      const messageLog = await WhatsAppMessage.create({
        deviceId,
        sender: device.phoneNumber || "",
        recipient: jid,
        content: message,
        status: "pending",
        userId: req.user.id,
        notes: "Queued (group)",
      });

      messageLogs.push(messageLog);

      try {
        // ===== SEND MESSAGE =====
        const result = await sock.sendMessage(jid, { text: message });

        await messageLog.update({
          status: "success",
          waMessageId: result.key.id,
          notes: "Message sent to group",
        });

      } catch (sendErr) {
        await messageLog.update({
          status: "failed",
          notes: sendErr.message,
        });
      }

      // ===== DELAY 10 DETIK (ANTI SPAM) =====
      await delay(10_000);
    }

    return res.json({
      message: "Messages sent",
      total: messageLogs.length,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to send message",
      error: err.message,
    });
  }
};


export const getAllParticipatingGroups = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const sock = await ensureConnected(deviceId);
    const response = await sock.groupFetchAllParticipating();
    success(res, response);
  } catch (err) {
    error(res, err.message);
  }
};


export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    await WhatsAppDevice.destroy({ where: { id: id } });
    success(res, null, "Device deleted");
  } catch (err) {
    error(res, err.message);
  }
};