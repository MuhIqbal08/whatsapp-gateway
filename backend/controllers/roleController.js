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

export const getRole = async(req, res) => {
  try {
    const {rows: roles, count: roleCount} = await Role.findAndCountAll();
    res.status(200).json({ roles, roleCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const getRoleById = async(req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const updateRole = async(req, res) => {
  try {
    await Role.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Role updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const deleteRole = async(req, res) => {
  try {
    await Role.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
