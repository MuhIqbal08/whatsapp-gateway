import db from "../models/index.js";
import crypto from "crypto";

const { ApiKeys, User } = db;

export const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API key not provided" });
    }

    // const hashed = crypto.createHash("sha256").update(apiKey).digest("hex");

    const key = await ApiKeys.findOne({
      where: {
        apiKeyHash: apiKey,
        isActive: true,
      },
      include: {
        model: User,
        as: "user",
      },
    });

    console.log("From header:", apiKey);
    // console.log("Hashed:", hashed);
    console.log("DB hash:", key?.apiKeyHash);

    if (!key || !key.userId) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const user = await User.findOne({ where: { id: key.userId } });
    const today = new Date().toISOString().slice(0, 10);

    // Reset quota jika beda hari
    if (user.lastResetDate !== today) {
      user.usedToday = 0;
      user.lastResetDate = today;
    }

    // ❌ BUG kamu tadi ada di sini
    // kamu bandingin lastResetDate >= dailyLimit (salah total)

    if (user.usedToday >= user.dailyLimit) {
      return res.status(429).json({ error: "Daily quota exceeded" });
    }

    // increment usage
    user.usedToday += 1;
    key.lastUsedAt = new Date();

    await user.save();
    await key.save();

    req.user = user; // optional kalau mau dipakai di controller
    req.apiKey = key;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "API key validation failed" });
  }
};
