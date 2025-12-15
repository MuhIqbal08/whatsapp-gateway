import db from "../models/index.js";

const { WhatsAppDevice, WhatsAppMessage } = db;

export const createDevice = async (userId, name, phoneNumber) => {
  const device = await WhatsAppDevice.create({
    userId,
    name,
    phoneNumber,
    isActive: false,
  });

  return device;
};
