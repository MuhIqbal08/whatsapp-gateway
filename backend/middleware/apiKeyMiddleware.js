import db from "../models/index.js";
import crypto from "crypto";

const { ApiKeys, User } = db;

export const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API key not provided" });
    }

    const user = User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const hashed = crypto.createHash("sha256").update(apiKey).digest("hex");

    const key = await ApiKeys.findOne({
      where: { apiKeyHash: hashed, userId: user.id, isActive: true },
    });

    if (!key) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (user.lastResetDate !== today) {
      user.usedToday = 0;
      user.lastResetDate = today;
    }

    if (user.lastResetDate >= user.dailyLimit) {
      return res.status(429).json({ error: "Daily quota exceeded" });
    }

    user.usedToday += 1;
    key.lastUsedAt = new Date();

    await user.save();
    await key.save();

    req.apiKey = key;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "API key validation failed" });
  }
};
