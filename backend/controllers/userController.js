import db from "../models/index.js";
import { Op, fn, col, literal } from "sequelize";

const { User, WhatsAppMessage, WhatsAppDevice, Role } = db;

export const getProfile = async (req, res) => {
  res.json({ message: "Profile accessed", user: req.user });
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const offset = (page - 1) * limit;

    const { rows: users, count: userCount } = await User.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"], // hanya ambil yang diperlukan
        },
      ],
    });

    const totalPages = Math.ceil(userCount / limit);

    res.status(200).json({
      users,
      pagination: {
        totalData: userCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserByid = async (req, res) => {
  try {
    const user = await User.findOne({where: { id: req.params.id }});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserForHeader = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({where: { id: userId }});
    const role = await Role.findOne({ where: { id: user.roleId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.update(req.body, { where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const dashboardUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = new Date().getFullYear();

    const user = await User.findOne({
      where: { id: userId },
    });

    const device = await WhatsAppDevice.count({
      where: { userId },
    });

    // =============================
    // 🔥 DAILY USAGE
    // =============================
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const usedToday = await WhatsAppMessage.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: todayStart,
          [Op.lt]: tomorrowStart,
        },
      },
    });

    const yearStart = new Date(year, 0, 1);
    const nextYearStart = new Date(year + 1, 0, 1);

    const monthlyMessages = await WhatsAppMessage.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        userId,
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
      group: [fn("MONTH", col("createdAt"))],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const messagesData = Array(12).fill(0);

    monthlyMessages.forEach((item) => {
      const monthIndex = item.month - 1;
      messagesData[monthIndex] = parseInt(item.total);
    });

    const statusData = await WhatsAppMessage.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        userId,
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
      group: ["status"],
      raw: true,
    });

    // Default 0
    let success = 0;
    let pending = 0;
    let failed = 0;

    statusData.forEach((item) => {
      if (item.status === "success") {
        success = parseInt(item.total);
      } else if (item.status === "pending") {
        pending = parseInt(item.total);
      } else if (item.status === "failed") {
        failed = parseInt(item.total);
      }
    });

    res.json({
      year,
      messagesData,
      dailyLimit: user.dailyLimit,
      usedToday,
      devicesCount: device,
      status: {
        success,
        pending,
        failed,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed load dashboard" });
  }
};

export const dashboardAdmin = async (req, res) => {
  try {
    // ambil tahun dari query, default tahun sekarang
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const yearStart = new Date(year, 0, 1);
    const nextYearStart = new Date(year + 1, 0, 1);

    // =============================
    // 🔥 TOTAL GLOBAL
    // =============================

    const totalUsers = await User.count();

    const totalDevices = await WhatsAppDevice.count();

    const totalMessages = await WhatsAppMessage.count({
      where: {
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
    });

    // =============================
    // 🔥 MESSAGES PER BULAN
    // =============================

    const monthlyMessagesRaw = await WhatsAppMessage.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
      group: [fn("MONTH", col("createdAt"))],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const messagesPerMonth = Array(12).fill(0);

    monthlyMessagesRaw.forEach((item) => {
      messagesPerMonth[item.month - 1] = parseInt(item.total);
    });

    // =============================
    // 🔥 DEVICES PER BULAN
    // =============================

    const monthlyDevicesRaw = await WhatsAppDevice.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
      group: [fn("MONTH", col("createdAt"))],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const devicesPerMonth = Array(12).fill(0);

    monthlyDevicesRaw.forEach((item) => {
      devicesPerMonth[item.month - 1] = parseInt(item.total);
    });

    // =============================
    // 🔥 STATUS MESSAGE
    // =============================

    const statusRaw = await WhatsAppMessage.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearStart,
          [Op.lt]: nextYearStart,
        },
      },
      group: ["status"],
      raw: true,
    });

    let success = 0;
    let pending = 0;
    let failed = 0;

    statusRaw.forEach((item) => {
      if (item.status === "success") success = parseInt(item.total);
      if (item.status === "pending") pending = parseInt(item.total);
      if (item.status === "failed") failed = parseInt(item.total);
    });

    // =============================
    // RESPONSE
    // =============================

    res.json({
      year,
      totals: {
        users: totalUsers,
        devices: totalDevices,
        messages: totalMessages,
      },
      messagesPerMonth,
      devicesPerMonth,
      messageStatus: {
        success,
        pending,
        failed,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed load dashboard" });
  }
};
