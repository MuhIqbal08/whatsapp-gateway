import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import path from "path";
import fs from "fs";
import db from "../models/index.js"; // pastikan index.js di models sudah pakai ESM juga
import { io } from "../app.js";

const WhatsAppDevice = db.WhatsAppDevice;
const WhatsAppMessage = db.WhatsAppMessage;

const sessions = new Map();

export async function startWhatsApp(deviceId) {
  try {
    const device = await WhatsAppDevice.findByPk(deviceId);
    if (!device) throw new Error("Device not found");

    const sessionPath = path.join(process.cwd(), `sessions/${deviceId}`);
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      printQRInTerminal: true,
      auth: state,
      browser: ["MyApp", "Chrome", "1.0.0"],
    });

    sessions.set(deviceId, sock);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`📱 QR Code untuk device: ${device.name}`);
        qrcode.generate(qr, { small: true });
        if (io) io.emit(`qr-${deviceId}`, { qr });
      }

      if (connection === "open") {
        console.log(`✅ WhatsApp Connected (${device.name})`);
        await device.update({ isActive: true });
      } else if (connection === "close") {
        const reason =
          lastDisconnect?.error?.output?.statusCode ||
          lastDisconnect?.error?.statusCode ||
          lastDisconnect?.error?.message ||
          "unknown";

        console.log("❌ Connection closed:", reason);
        await device.update({ isActive: false });

        if (reason !== DisconnectReason.loggedOut) {
          console.log("🔄 Reconnecting...");
          startWhatsApp(deviceId);
        } else {
          console.log("⚠️ Session expired. Silakan scan ulang QR.");
        }
      }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message) return;

      const sender = msg.key.remoteJid;
      const text =
        msg.message.conversation || msg.message.extendedTextMessage?.text;

      console.log("📩 Pesan baru dari:", sender, "=>", text);

      await WhatsAppMessage.create({
        userId: device.userId,
        deviceId: device.id,
        content: text,
        sender,
        recipient: "me",
        status: "received",
      });
    });

    return sock;
  } catch (error) {
    console.error("❌ startWhatsApp error:", error.message);
  }
}

export function getSocket(deviceId) {
  return sessions.get(deviceId);
}
