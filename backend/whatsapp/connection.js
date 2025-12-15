import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
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

const connecting = new Map();

export const connectToWhatsAppWithId = async (deviceId) => {
  const existingSock = sockets.get(deviceId);

  if (existingSock?.user) {
    return existingSock;
  }

  sockets.delete(deviceId);

  if (connecting.has(deviceId)) {
    return connecting.get(deviceId);
  }

  const connectPromise = (async () => {
    const device = await WhatsAppDevice.findByPk(deviceId);
    if (!device) throw new Error("Device not found");

    const sessionPath = path.join("sessions", deviceId.toString());
    fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      browser: Browsers.windows("Chrome"),
      generateHighQualityLinkPreview: true,
    });

    sockets.set(deviceId, sock);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { qr, connection, lastDisconnect } = update;

      io?.emit(`qr-${deviceId}`, { qr: qr || null });

      if (connection === "open") {
        await device.update({ isActive: true });
        io?.emit(`qr-${deviceId}`, { connected: true, qr: null });
      }

      if (connection === "close") {
        sockets.delete(deviceId);
        connecting.delete(deviceId);

        const shouldReconnect =
          lastDisconnect?.error instanceof Boom &&
          lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          connectToWhatsAppWithId(deviceId);
        } else {
          await device.update({ isActive: false });
        }
      }
    });

    return sock;
  })();

  connecting.set(deviceId, connectPromise);

  try {
    return await connectPromise;
  } finally {
    connecting.delete(deviceId);
  }
};

export const ensureConnected = async (deviceId, timeoutMs = 20000) => {
  sockets.delete(deviceId);

  const sock = await connectToWhatsAppWithId(deviceId);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      sock.ev.off("connection.update", onUpdate);
      reject(new Error("Connection timeout"));
    }, timeoutMs);

    const onUpdate = (update) => {
      if (update.connection === "open") {
        clearTimeout(timeout);
        sock.ev.off("connection.update", onUpdate);
        resolve(sock);
      }

      if (update.connection === "close") {
        clearTimeout(timeout);
        sock.ev.off("connection.update", onUpdate);
        reject(new Error("Connection Closed"));
      }
    };

    sock.ev.on("connection.update", onUpdate);
  });
};

export const getSock = (deviceId) => {
  const sock = sockets.get(deviceId);
  return sock?.user ? sock : null;
};
