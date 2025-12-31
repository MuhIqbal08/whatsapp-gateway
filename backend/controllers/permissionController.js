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
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPermissionId = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ error: "Permission not found" });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
