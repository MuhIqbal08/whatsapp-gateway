import { verifyToken } from "../utils/token.js";
import db from "../models/index.js";
import jwt from "jsonwebtoken";

const { User, Role } = db;
const SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const SECRET = process.env.JWT_SECRET;

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

// export const authMiddleware = (req, res, next) => {
//   const token = req.cookies?.access_token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// export const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const [type, token] = authHeader.split(" ");
//     if (type !== "Bearer" || !token) {
//       return res.status(401).json({ error: "Invalid auth format" });
//     }

//     const decoded = jwt.verify(token, SECRET);

//     const user = await User.findByPk(decoded.id, {
//       include: [{ model: Role, as: "role" }],
//     });

//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("AUTH ERROR:", err.message);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };


export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch {
    return res.sendStatus(401);
  }
};

