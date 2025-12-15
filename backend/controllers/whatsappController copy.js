import { success, error } from "../utils/response.js";
import db from "../models/index.js";
import { createDevice } from "../services/whatsappServices.js";
import { sendMessageWA } from "../whatsapp/connecting.js";
import { connectToWhatsAppWithId, getSock } from "../whatsapp/connection-old2.js";

const { WhatsAppDevice, WhatsAppMessage } = db;

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
  const devices = await WhatsAppDevice.findAll({
    where: { userId: req.user.id },
  });
  success(res, devices);
};

// export const sendMessage = async (req, res) => {
//   try {
//     const { deviceId, number, message } = req.body;
//     const record = await sendMessageService(
//       deviceId,
//       number,
//       message,
//       req.user.id
//     );
//     success(res, record, "Message sent");
//   } catch (err) {
//     error(res, err.message);
//   }
// };
  
// export const sendMessage = async (req, res) => {
//     try {
//         const { number, message } = req.body;

//         if (!number || !message) {
//             return res.status(400).json({ error: "number & message required" });
//         }

//         const result = await sendMessageWA(number, message);

//         return res.json(result);

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Failed sending message" });
//     }
// };

export const sendMessage = async (req, res) => {
  let messageLog = null;

  try {
    const { deviceId, phoneNumber, message } = req.body;

    // ===== validation =====
    if (!deviceId || !phoneNumber || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const device = await WhatsAppDevice.findByPk(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ===== create pending log =====
    messageLog = await WhatsAppMessage.create({
      deviceId,
      sender: device.phoneNumber || "",
      recipient: cleanNumber,
      content: message,
      status: "pending",
      userId: req.auth?.data?.id || null,
      notes: "Queued"
    });

    // ===== get socket =====
    const sock =
      getSock(deviceId) || (await connectToWhatsAppWithId(deviceId));

    if (!sock?.user) {
      throw new Error("WhatsApp device not connected");
    }

    // ===== send message =====
    const jid = `${cleanNumber}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });

    // ===== update success =====
    await messageLog.update({
      status: "success",
      notes: "Message sent"
    });

    return res.json({
      message: "Message sent successfully",
      data: {
        id: messageLog.id,
        deviceId,
        jid,
        message
      }
    });
  } catch (err) {
    console.error(err);

    // ===== update failed =====
    if (messageLog) {
      await messageLog.update({
        status: "failed",
        notes: err.message
      });
    }

    return res.status(500).json({
      message: "Failed to send message",
      error: err.message
    });
  }
};


export const deleteDevice = async(req, res) => {
  try {
    const { id } = req.params;
    await WhatsAppDevice.destroy({ where: { id: id } });
    success(res, null, "Device deleted");
  } catch (err) {
    error(res, err.message);
  }
}

// function waitForConnectionOpen(sock, timeoutMs) {
//     return new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//             sock.ev.off('connection.update', onUpdate);
//             reject(new Error('Connection timeout'));
//         }, timeoutMs);

//         function onUpdate(update) {
//             const { connection, lastDisconnect } = update;

//             if (connection === 'open') {
//                 clearTimeout(timeout);
//                 sock.ev.off('connection.update', onUpdate);
//                 resolve();
//             }

//             if (connection === 'close') {
//                 clearTimeout(timeout);
//                 sock.ev.off('connection.update', onUpdate);

//                 const statusCode =
//                     lastDisconnect?.error?.output?.statusCode;

//                 if (statusCode === DisconnectReason.loggedOut) {
//                     reject(new Error('Logged out, need to re-scan QR'));
//                 } else {
//                     reject(new Error('Connection closed'));
//                 }
//             }
//         }

//         sock.ev.on('connection.update', onUpdate);
//     });
// }

// async function createOrUpdateLog(status, data, notes) {
//     const { deviceId, recipient } = data;

//     if (status === 'pending') {
//         await WhatsAppMessage.create({
//             deviceId,
//             recipient,
//             sender: data.sender || '',
//             content: data.content || '',
//             status,
//             notes,
//             userId: Number(data.userId)
//         });
//         return;
//     }

//     await WhatsAppMessage.update(
//         { status, notes },
//         {
//             where: {
//                 deviceId,
//                 recipient,
//                 status: 'pending'
//             }
//         }
//     );
// }

// function toJid(phoneNumber) {
//     return phoneNumber.includes('@s.whatsapp.net')
//         ? phoneNumber
//         : `${phoneNumber}@s.whatsapp.net`;
// }
