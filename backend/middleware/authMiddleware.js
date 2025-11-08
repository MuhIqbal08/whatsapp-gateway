import { verifyToken } from "../utils/token.js";
import db from "../models/index.js";

const { User, Role } = db;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded)
      return res.status(401).json({ error: "Invalid token" });

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: "role" }],
    });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};
