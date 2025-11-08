export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      limit: DataTypes.INTEGER,
      password: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
    User.hasMany(models.WhatsAppDevice, {
      foreignKey: "userId",
      as: "whatsappDevices",
    });
    User.hasMany(models.WhatsAppMessage, {
      foreignKey: "userId",
      as: "whatsappMessages",
    });
  };

  return User;
};
