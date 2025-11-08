export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: DataTypes.STRING,
    },
    {
      tableName: "permissions",
    }
  );

  Permission.associate = (models) => {
    Permission.hasMany(models.RolePermission, {
      foreignKey: "permissionId",
      as: "roles",
    });
  };

  return Permission;
};
