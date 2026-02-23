import db from "../models/index.js";
import { generateApiKey } from "../utils/apiKey.js";
import crypto from "crypto";

const { ApiKey } = db;

export const createApiKey = async (req, res) => {
  try {
    const user = req.user;

    // Optional: batasi 1 API key per user
    const existing = await ApiKey.findOne({
      where: { user_id: user.id, isActive: true },
    });

    if (existing) {
      return res.status(400).json({
        error: "API key already exists",
      });
    }

    const plainKey = generateApiKey();
    const hash = crypto.createHash("sha256").update(plainKey).digest("hex");

    await ApiKey.create({
      user_id: user.id,
      name: `${user.email} API Key`,
      apiKeyHash: hash,
      isActive: true,
    });

    return res.json({
      apiKey: plainKey, // ⚠️ HANYA SEKALI
      message: "Save this key, it will not be shown again.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate API key" });
  }
};


export const getApiKey = async (req, res) => {
  try {
    const userId = req.user.id;

    const apiKey = await ApiKey.findOne({
      where: { user_id: userId, isActive: true },
      attributes: ["id", "name", "createdAt", "isActive"],
    });

    res.json({
      apiKey,
      message: "API Key fetched",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch API key" });
  }
};


export const revokeApiKey = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    await ApiKey.update(
      {
        isActive: false,
      },
      {
        where: id,
        userId,
      }
    );

    res.json({ message: "API key revoked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const rotateApiKey = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const newKey = generateApiKey();
  const hash = crypto.createHash("sha256").update(newKey).digest("hex");

  try {
    await ApiKey.update(
      {
        isActive: false,
      },
      {
        where: {
          id,
          userId,
        },
      }
    );

    await ApiKey.create({
      userId,
      name: `Rotated Key ${userId}`,
      apiKeyHash: hash,
      isActive: true,
    });

    res.json({
      apiKey: newKey,
      message: "Save this key, it will not be shown again.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
