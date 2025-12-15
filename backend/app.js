import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import db from "./models/index.js"; // pastikan index.js di models sudah ESM
import { connectToWhatsApp, getSock } from "./whatsapp/connecting.js";
import { setIo } from "./whatsapp/connection.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// inject io ke module connection
setIo(io);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.get("/connect", async (req, res) => {
  try {
    if (!getSock()) {
      await connectToWhatsApp();
      return res.json({ message: "WhatsApp is connecting..." });
    }

    return res.json({ message: "WhatsApp already connected." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is Running!" });
});

global.io = io;

// Socket.io Events
io.on("connection", (socket) => {
  console.log("🟢 Socket.io connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket.io disconnected:", socket.id);
  });
});

// Jalankan server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database Connected!");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

startServer();

// Export agar bisa digunakan oleh file lain (misalnya connection.js)
export { io };
