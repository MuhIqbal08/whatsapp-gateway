import db from "../models/index.js";

const { Permission } = db;

export const createPermission = async (req, res) => {
  try {
    const { name, deskripsi } = req.body;
    if (!name || !deskripsi)
      return res.status(400).json({ error: "All fields are required" });

    const existing = await Permission.findOne({ where: { name } });
    if (existing)
      return res.status(400).json({ error: "Permission already exists" });

    const permission = await Permission.create({ name, deskripsi });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
