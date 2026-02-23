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
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      dailyLimit: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      usedToday: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lastResetDate: {
        type: DataTypes.DATE
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // password: DataTypes.STRING,
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
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
    User.hasMany(models.ApiKeys, {
      foreignKey: "userId",
      as: "apiKeys",
    });
    User.hasMany(models.UserAuth, { foreignKey: "userId", as: "userAuths" });
  };

  return User;
};
