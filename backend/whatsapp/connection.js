import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import path from "path";
import db from "../models/index.js";

const { WhatsAppDevice } = db;

const sockets = new Map();
let io = null;

export function setIo(ioServer) {
  io = ioServer;
}

export const connectToWhatsAppWithId = async (deviceId) => {
  if (sockets.has(deviceId)) {
    const existing = sockets.get(deviceId);
    if (existing?.user) return existing;
  }

  const device = await WhatsAppDevice.findByPk(deviceId);
  if (!device) throw new Error("Device not found");

  const sessionPath = path.join("sessions", deviceId.toString());
  fs.mkdirSync(sessionPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    browser: Browsers.windows("Chrome"),
    generateHighQualityLinkPreview: true,
    keepAliveIntervalMs: 10000,
    markOnlineOnConnect: true,
    syncFullHistory: false,
  });

  sockets.set(deviceId, sock);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) {
      io?.emit(`qr-${deviceId}`, { qr });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected:", deviceId);
      await device.update({ isActive: true });
      io?.emit(`qr-${deviceId}`, { connected: true, qr: null });
    }

    if (connection === "close") {
      console.log("❌ WhatsApp Closed:", deviceId);

      sockets.delete(deviceId);

      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !==
          DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔄 Reconnecting:", deviceId);
        setTimeout(() => connectToWhatsAppWithId(deviceId), 2000);
      } else {
        await device.update({ isActive: false });
      }
    }
  });

  return sock;
};

export const ensureConnected = async (deviceId) => {
  let sock = sockets.get(deviceId);

  if (!sock || sock.ws.readyState !== 1) {
    console.log("⚡ Starting fresh connection...");
    sock = await connectToWhatsAppWithId(deviceId);

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return sock;
};

export const getSock = (deviceId) => {
  const sock = sockets.get(deviceId);
  return sock?.user ? sock : null;
};