import db from "../models/index.js";

const { Role, RolePermissions } = db;

export const createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignPermission = async (req, res) => {
  const { roleId, permissionId } = req.body;
  try {
    const exists = await RolePermissions.findOne({ where: { roleId, permissionId } });
    if (exists) return res.status(400).json({ error: "Permission already assigned" });

    const rp = await RolePermissions.create({ roleId, permissionId });
    res.json(rp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
