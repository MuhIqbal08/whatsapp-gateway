import db from "../models/index.js";

const { RolePermission, Permission } = db;

export const authorize = (permissionName) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.roleId;

      const hasPermission = await RolePermission.findOne({
        where: { roleId },
        include: [
          {
            model: Permission,
            as: "permission",
            where: { name: permissionName },
          },
        ],
      });

      if (!hasPermission)
        return res.status(403).json({ error: "Forbidden: no permission" });

      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
