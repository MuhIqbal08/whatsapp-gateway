import db from "../models/index.js";
import { generateApiKey } from "../utils/apiKey.js";
import crypto from "crypto";

const { ApiKey } = db;

export const createApiKey = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  const plainKey = generateApiKey();
  const hash = crypto.createHash("sha256").update(plainKey).digest("hex");

  try {
    await ApiKey.create({
      user_id: userId,
      name: name || "Default Key",
      apiKeyHash: hash,
      isActive: true,
    });
    res.json({
      apiKey: plainKey,
      message: "Save this key, it will not be shown again.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getApiKey = async (req, res) => {
  const { userId } = req.params.id;
  try {
    const apiKey = await ApiKey.find({
      where: {
        userId,
        isActive: true,
      },
    });

    res.send(200).json({
      apiKey,
      message: "Api Key Get",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
